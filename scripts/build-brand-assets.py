"""
Builds the brand assets that are generated from the site's fonts and photo.

Run from the repository root:  python3 scripts/build-brand-assets.py
Needs: fontTools, brotli, Pillow, and Playwright with Chromium (for the PNG
and ICO icons). The outputs are committed, so this only needs to run again
when the fonts, the monogram or the portrait change.

Outputs
  app/fonts/Archivo-Display-600-800.woff2
                         The display font the site loads: Archivo pinned to
                         normal width (100%) and trimmed to weights 600 to 800,
                         the only ones the design uses. 23 KB instead of 88 KB.
  app/fonts/Inter-400-700.woff2
                         Body font: Inter trimmed to weights 400 to 700.
                         35 KB instead of 47 KB.
  (The full variable fonts these come from are kept in scripts/font-sources.
  The 7 KB headline font, app/fonts/Archivo-Headline-800-112.woff2, was made
  in Phase 1 with the same instancer at weight 800 and width 112%.)
  lib/og/glyphs.json     Outlines of the headline font (Archivo 800 at 112%
                         width) as SVG path data, with advance widths and
                         kerning pairs. The social preview images draw their
                         display type from these paths, because the image
                         renderer cannot draw outlined text on its own.
  lib/og/Inter-Medium.ttf  A static, Latin-only Inter 500 for small text in
                         the social preview images (the renderer cannot read
                         variable fonts or WOFF2).
  lib/og/portrait.png    A grayscale, reduced copy of the hero cutout.
  app/icon.svg           The LL monogram favicon for modern browsers.
  app/apple-icon.png     180 x 180 home screen icon for iPhone and iPad.
  app/favicon.ico        16, 32 and 48 px icons for older browsers and crawlers.
"""

import io
import json
import subprocess
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OG = ROOT / "lib" / "og"
OG.mkdir(parents=True, exist_ok=True)

INK = "#0A0909"
CANVAS = "#FDFDFD"

HEADLINE = ROOT / "app/fonts/Archivo-Headline-800-112.woff2"
SOURCES = ROOT / "scripts/font-sources"
INTER = SOURCES / "Inter-Variable-latin.woff2"
ARCHIVO = SOURCES / "Archivo-Variable-latin.woff2"
PORTRAIT = ROOT / "public/lucas-professional2-cutout.png"

# Printable ASCII plus the few typographic characters the site uses.
CHARS = [chr(c) for c in range(0x20, 0x7F)] + ["·", "’", "©", "→"]


def glyph_path(font: TTFont, glyph_name: str) -> str:
    """SVG path data for one glyph, with y flipped so +y points down."""
    gs = font.getGlyphSet()
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.0f}" if float(v).is_integer() else f"{v:.1f}")
    gs[glyph_name].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))
    return pen.getCommands()


def pair_kerning(font: TTFont, names: set[str]) -> dict[tuple[str, str], int]:
    """Reads x-advance adjustments from GPOS pair positioning (formats 1 and 2)."""
    kern: dict[tuple[str, str], int] = {}
    if "GPOS" not in font:
        return kern
    gpos = font["GPOS"].table
    for lookup in gpos.LookupList.Lookup:
        subtables = []
        for st in lookup.SubTable:
            if lookup.LookupType == 9:  # extension
                st = st.ExtSubTable
            if getattr(st, "LookupType", lookup.LookupType) == 2:
                subtables.append(st)
        for st in subtables:
            firsts = st.Coverage.glyphs
            if st.Format == 1:
                for first, pset in zip(firsts, st.PairSet):
                    if first not in names:
                        continue
                    for rec in pset.PairValueRecord:
                        v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                        if v and rec.SecondGlyph in names:
                            kern.setdefault((first, rec.SecondGlyph), v)
            elif st.Format == 2:
                cd1 = st.ClassDef1.classDefs if st.ClassDef1 else {}
                cd2 = st.ClassDef2.classDefs if st.ClassDef2 else {}
                for first in firsts:
                    if first not in names:
                        continue
                    c1 = cd1.get(first, 0)
                    row = st.Class1Record[c1]
                    for second in names:
                        c2 = cd2.get(second, 0)
                        rec = row.Class2Record[c2]
                        v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                        if v:
                            kern.setdefault((first, second), v)
    return kern


def build_glyphs() -> TTFont:
    font = TTFont(HEADLINE)
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    names = {}
    glyphs = {}
    for ch in CHARS:
        gid = cmap.get(ord(ch))
        if gid is None:
            continue
        names[gid] = ch
        glyphs[ch] = {"a": hmtx[gid][0], "d": glyph_path(font, gid)}
    kern = {
        names[a] + names[b]: v
        for (a, b), v in pair_kerning(font, set(names)).items()
    }
    data = {
        "unitsPerEm": font["head"].unitsPerEm,
        "ascent": font["hhea"].ascent,
        "descent": font["hhea"].descent,
        "capHeight": getattr(font["OS/2"], "sCapHeight", 700),
        "glyphs": glyphs,
        "kern": kern,
    }
    (OG / "glyphs.json").write_text(json.dumps(data, separators=(",", ":")))
    print(f"glyphs.json: {len(glyphs)} glyphs, {len(kern)} kerning pairs")
    return font


def build_web_fonts() -> None:
    """Trims the variable fonts to the axes and weights the design uses."""
    for src, limits, name in [
        (ARCHIVO, {"wdth": 100, "wght": (600, 800)}, "Archivo-Display-600-800.woff2"),
        (INTER, {"wght": (400, 700)}, "Inter-400-700.woff2"),
    ]:
        font = instantiateVariableFont(TTFont(src), limits)
        font.flavor = "woff2"
        out = ROOT / "app/fonts" / name
        font.save(out)
        print(f"{name}: {out.stat().st_size // 1024} KB")


def build_inter() -> None:
    font = TTFont(INTER)
    font = instantiateVariableFont(font, {"wght": 500})
    opts = Options()
    opts.layout_features = ["kern", "liga", "calt"]
    opts.name_IDs = ["*"]
    sub = Subsetter(opts)
    sub.populate(unicodes=[ord(c) for c in CHARS])
    sub.subset(font)
    font.flavor = None
    out = OG / "Inter-Medium.ttf"
    font.save(out)
    print(f"Inter-Medium.ttf: {out.stat().st_size // 1024} KB")


def build_portrait() -> None:
    im = Image.open(PORTRAIT).convert("RGBA")
    h = 760
    w = round(im.width * h / im.height)
    im = im.resize((w, h), Image.LANCZOS)
    r, g, b, a = im.split()
    gray = Image.merge("RGB", (r, g, b)).convert("L")
    out = Image.merge("LA", (gray, a))
    out.save(OG / "portrait.png", optimize=True)
    print(f"portrait.png: {w}x{h}, {(OG / 'portrait.png').stat().st_size // 1024} KB")


def monogram_svg(font: TTFont, size: int = 64) -> str:
    """Ink tile with a canvas 'LL', both letters solid, optically centered."""
    gid = font.getBestCmap()[ord("L")]
    adv = font["hmtx"][gid][0]
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    gs[gid].draw(bp)
    xmin, ymin, xmax, ymax = bp.bounds
    d = glyph_path(font, gid)
    # The second L starts just after the first L's foot, so the pair reads as one mark.
    step = (xmax - xmin) + 36
    pair_w = step + (xmax - xmin)
    pair_h = ymax - ymin
    scale = min(size * 0.46 / pair_h, size * 0.66 / pair_w)
    tx = (size - pair_w * scale) / 2 - xmin * scale
    ty = (size + pair_h * scale) / 2 + ymin * scale
    radius = size * 0.22
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
        f'<rect width="{size}" height="{size}" rx="{radius:.1f}" fill="{INK}"/>'
        f'<g fill="{CANVAS}" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})">'
        f'<path d="{d}"/>'
        f'<path transform="translate({step:.0f} 0)" d="{d}"/>'
        f"</g></svg>"
    )


RASTERIZE = """
import sys, asyncio
from playwright.sync_api import sync_playwright
svg_path, out_dir = sys.argv[1], sys.argv[2]
svg = open(svg_path).read()
with sync_playwright() as p:
    b = p.chromium.launch()
    for size, name, square in [(180, "apple-icon.png", True), (48, "ico-48.png", False), (32, "ico-32.png", False), (16, "ico-16.png", False)]:
        pg = b.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
        body = svg
        if square:
            # iOS applies its own rounded mask, so the home screen icon is a full square.
            body = svg.replace('rx="', 'data-rx="')
        sized = body.replace("<svg ", '<svg width="%d" height="%d" ' % (size, size), 1)
        pg.set_content('<html><body style="margin:0;background:transparent">' + sized + '</body></html>')
        pg.screenshot(path=f"{out_dir}/{name}", omit_background=True)
        pg.close()
    b.close()
"""


def build_icons(font: TTFont) -> None:
    svg = monogram_svg(font)
    (ROOT / "app/icon.svg").write_text(svg)
    tmp = OG / ".icons"
    tmp.mkdir(exist_ok=True)
    (tmp / "icon.svg").write_text(svg)
    (tmp / "raster.py").write_text(RASTERIZE)
    subprocess.run([sys.executable, str(tmp / "raster.py"), str(tmp / "icon.svg"), str(tmp)], check=True)
    Image.open(tmp / "apple-icon.png").convert("RGB").save(ROOT / "app/apple-icon.png", optimize=True)
    imgs = [Image.open(tmp / f"ico-{s}.png").convert("RGBA") for s in (48, 32, 16)]
    imgs[0].save(ROOT / "app/favicon.ico", format="ICO", sizes=[(48, 48), (32, 32), (16, 16)], append_images=imgs[1:])
    for f in tmp.iterdir():
        f.unlink()
    tmp.rmdir()
    print("icons: app/icon.svg, app/apple-icon.png, app/favicon.ico")


if __name__ == "__main__":
    build_web_fonts()
    headline = build_glyphs()
    build_inter()
    build_portrait()
    build_icons(headline)
