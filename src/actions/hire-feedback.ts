import { ApiError, authApi } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api/common";
import type {
  HireFeedbackListData,
  RawHireFeedbackListResponse,
  RawHireFeedbackRequest,
  RawTalentTrackRecord,
  SubmitHireFeedbackInput,
  TalentTrackRecord,
} from "@/types/api/hire-feedback";

import { unwrapData } from "./utils";

function mapHireFeedbackRequest(raw: RawHireFeedbackRequest) {
  return {
    id: raw.id,
    offerId: raw.offer_id,
    candidateUserId: raw.candidate_user_id,
    candidateName: raw.candidate_name,
    candidateAvatarUrl: raw.candidate_avatar_url ?? null,
    roleTitle: raw.role_title,
    status: raw.status,
    requestedAt: raw.requested_at,
    submittedAt: raw.submitted_at,
  };
}

function mapTrackRecord(raw: RawTalentTrackRecord): TalentTrackRecord {
  return {
    averageRating: raw.average_rating,
    ratingCount: raw.rating_count ?? 0,
    wouldHireAgainRate: raw.would_hire_again_rate,
  };
}

/** The API doesn't expose hire-feedback endpoints yet; a 404 means "no data". */
function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export async function getPendingHireFeedback(): Promise<HireFeedbackListData> {
  try {
    const res = await authApi.get<ApiEnvelope<RawHireFeedbackListResponse>>(
      "/employer/hire-feedback",
      { params: { status: "pending" } },
    );
    const raw = unwrapData(res);
    return { requests: (raw.requests ?? []).map(mapHireFeedbackRequest) };
  } catch (error) {
    if (isNotFound(error)) return { requests: [] };
    throw error;
  }
}

export async function submitHireFeedback(
  input: SubmitHireFeedbackInput,
): Promise<void> {
  await authApi.post(`/employer/hire-feedback/${input.offerId}`, {
    overall_rating: input.overallRating,
    would_hire_again: input.wouldHireAgain,
    comment: input.comment,
  });
}

export async function getTalentTrackRecord(): Promise<TalentTrackRecord> {
  try {
    const res = await authApi.get<ApiEnvelope<RawTalentTrackRecord>>(
      "/talent/track-record",
    );
    return mapTrackRecord(unwrapData(res));
  } catch (error) {
    if (isNotFound(error)) {
      return { averageRating: null, ratingCount: 0, wouldHireAgainRate: null };
    }
    throw error;
  }
}
