import { ImageResponse } from "next/og";
import { allProjectSlugs, getProject, hostOf, projectBlurb } from "@/lib/projects";
import { Display, OG_SIZE, fitSize, og, ogFonts } from "@/lib/og/render";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return allProjectSlugs().map((slug) => ({ slug }));
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const data = getProject(params.slug);
  return [
    {
      id: "cover",
      size,
      contentType,
      alt: data ? `${data.project.title}, a case study by Lucas Lisboa` : "Case study by Lucas Lisboa",
    },
  ];
}

/**
 * Social preview for a case study: the project's typographic cover, in the
 * same dark or light tone as its card on the homepage. The last line of the
 * cover title is outlined, as on the case study page.
 */
export default async function Image({ params }: { params: { slug: string } }) {
  const data = getProject(params.slug);
  const fonts = await ogFonts();
  if (!data) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", background: og.ink }} />, {
      ...size,
      fonts,
    });
  }

  const { project, num } = data;
  const dark = data.tone === "dark";
  const fg = dark ? og.canvas : og.ink;
  const soft = dark ? og.inkMuted : og.inkSoft;
  const lines = project.coverTitle.split("\n");
  const titleSize = fitSize(lines, 1072, lines.length > 2 ? 132 : 168);
  const status = project.liveUrl ? hostOf(project.liveUrl) : "GitHub";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 64px 56px",
          background: dark ? og.ink : og.surface,
          color: fg,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: soft }}>
          <span>
            /{num} · {project.category}
          </span>
          <span>Case Study · {status}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: Math.round(titleSize * 0.13) }}>
          {lines.map((line, i) => (
            <Display
              key={i}
              text={line}
              size={titleSize}
              color={fg}
              outline={i > 0 && i === lines.length - 1}
              stroke={2.5}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 48 }}>
          <span style={{ fontSize: 24, lineHeight: 1.4, maxWidth: 780, color: soft }}>{clamp(projectBlurb(project), 110)}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>Lucas Lisboa</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

/** Keeps the pitch to two lines on the image, ending at a word boundary. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}
