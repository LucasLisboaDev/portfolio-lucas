import { ImageResponse } from "next/og";
import { Display, OG_SIZE, StatusPill, fitSize, og, ogFonts, ogPortrait } from "@/lib/og/render";

export const alt = "Lucas Lisboa, AI Engineer. Portfolio of production web, mobile, data and AI work.";
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Social preview for the homepage (and any page without its own): the hero
 * in miniature. The outlined first name over the solid last name, the
 * grayscale portrait beside them, and the role underneath.
 */
export default async function Image() {
  const [fonts, portrait] = await Promise.all([ogFonts(), ogPortrait()]);
  // The name fills the space left of the portrait, so neither word is hidden.
  const nameSize = fitSize(["Lucas", "Lisboa"], 610, 196);
  const portraitH = 515; // keeps the hair clear of the status pill
  const portraitW = Math.round((portrait.width / portrait.height) * portraitH);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: og.canvas,
          color: og.ink,
          fontFamily: "Inter",
        }}
      >
        {/* Top row */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 64,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
            <span>Lucas Lisboa Alves</span>
            <span style={{ color: og.accent }}>/Portfolio</span>
          </div>
          <StatusPill />
        </div>

        {/* Name, beside the portrait */}
        <div style={{ position: "absolute", left: 60, top: 158, display: "flex", flexDirection: "column", gap: Math.round(nameSize * 0.12) }}>
          <Display text="Lucas" size={nameSize} color={og.ink} outline stroke={2.5} />
          <Display text="Lisboa" size={nameSize} color={og.ink} />
        </div>

        {/* Portrait */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={portrait.src}
          width={portraitW}
          height={portraitH}
          style={{ position: "absolute", right: 36, bottom: 0 }}
        />

        {/* Role */}
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 58,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Display text="AI Engineer" size={38} color={og.ink} />
          <span style={{ fontSize: 22, color: og.muted, maxWidth: 560, lineHeight: 1.45 }}>
            Production software across web, mobile, data and intelligent systems.
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
