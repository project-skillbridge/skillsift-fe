import { ImageResponse } from "next/og";

import { getPublicVerifiedProfile } from "@/actions/public-verified-profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SkillSift verified talent profile";

const VERIFIED_GREEN = "#009F6A";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;

  let name = "Verified Talent";
  let role = "";
  let tierLabel = "Job Ready";
  let score = 0;

  try {
    const profile = await getPublicVerifiedProfile(shareToken);
    name = profile.full_name;
    role = profile.role;
    tierLabel = profile.tier_label;
    score = Math.round(profile.score_percentage);
  } catch {
    // Falls through to the generic card below — a broken preview image
    // shouldn't ever throw and break link unfurling.
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

      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 220,
            height: 220,
            borderRadius: 40,
            background: VERIFIED_GREEN,
            color: "white",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          {score}%
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>
            {name}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#535862" }}>
            {role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              color: VERIFIED_GREEN,
            }}
          >
            {tierLabel} · Verified by SkillSift
          </div>
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 22, color: "#757575" }}>
        skillsift.online
      </div>
    </div>,
    { ...size },
  );
}
