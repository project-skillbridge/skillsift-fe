import { ImageResponse } from "next/og";

import { getPublicCertificate } from "@/actions/certificates";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SkillSift skill certificate";

const GREEN = "#009F6A";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let name = "Verified Talent";
  let title = "Skill Certificate";
  let id = code.toUpperCase();

  try {
    const cert = await getPublicCertificate(code);
    name = cert.holder_name;
    title = `${cert.level_label} ${cert.track_label}`;
    id = cert.code;
  } catch {
    // A broken preview image must never break link unfurling.
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #F3FBF8 0%, #FFFFFF 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
        SkillSift
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", fontSize: 28, color: "#535862" }}>
          This certifies that
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700 }}>
          {name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 600,
            color: GREEN,
          }}
        >
          {`Passed: ${title}`}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#757575" }}>
        {`Certificate ID ${id}`}
      </div>
    </div>,
    { ...size },
  );
}
