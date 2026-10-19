import { publicApi } from "@/lib/api";
import type { ApiEnvelope, VerifiedProfileResponseData } from "@/types/api";
import type { PublicVerifiedProfileResponseData } from "@/types/api/public-verified-profile";

import { unwrapData } from "./utils";

/** What `getPublicVerifiedProfile` actually returns — the shared base type
 *  plus track-record fields, mirroring how `EmployerDiscoveryCandidateProfile`
 *  extends the same base for the employer-viewer context. */
export type PublicVerifiedProfile = VerifiedProfileResponseData & {
  averageHireRating: number | null;
  hireRatingCount: number;
  wouldHireAgainRate: number | null;
};

/** Fills in the fields the public payload deliberately omits (resume,
 *  share/QR links, ownership) with safe, inert defaults so the shared
 *  `VerifiedReportSummary`/`VerifiedReportSkillsSection` components can
 *  render it unchanged — `viewerMode="public"` is what actually keeps
 *  owner-only actions (Share, Download CV) from rendering, not this. */
function toPublicVerifiedProfile(
  raw: PublicVerifiedProfileResponseData,
): PublicVerifiedProfile {
  return {
    ...raw,
    status: "verified",
    seniority_badge: raw.tier_label,
    resume_url: null,
    share_url: "",
    qr_code_url: "",
    is_owner: false,
    averageHireRating: raw.average_hire_rating ?? null,
    hireRatingCount: raw.hire_rating_count ?? 0,
    wouldHireAgainRate: raw.would_hire_again_rate ?? null,
  };
}

export async function getPublicVerifiedProfile(
  shareToken: string,
): Promise<PublicVerifiedProfile> {
  const res = await publicApi.get<
    ApiEnvelope<PublicVerifiedProfileResponseData>
  >(`/verified-profiles/${encodeURIComponent(shareToken)}`);
  return toPublicVerifiedProfile(unwrapData(res));
}
