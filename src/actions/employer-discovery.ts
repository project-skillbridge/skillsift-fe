import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { authApi } from "@/lib/api";
import { buildDiscoveryQueryString } from "@/lib/employer-discovery-params";
import type { ApiEnvelope } from "@/types/api/common";
import type {
  DiscoveryCandidatesParams,
  EmployerDiscoveryCandidate,
  EmployerDiscoveryCandidateProfile,
  EmployerDiscoveryCandidatesListData,
  EmployerHiringBriefResponse,
  EmployerSavedCandidatesListParams,
  RawEmployerDiscoveryCandidate,
  RawEmployerDiscoveryCandidateProfile,
  RawEmployerDiscoveryCandidatesListResponse,
} from "@/types/api/employer-discovery";

import { unwrapData } from "./utils";

function mapDiscoveryCandidate(
  raw: RawEmployerDiscoveryCandidate,
): EmployerDiscoveryCandidate {
  const compositeScore = raw.composite_score ?? raw.score ?? 0;

  return {
    userId: raw.user_id,
    candidateId: raw.candidate_id ?? raw.user_id,
    firstName: raw.first_name ?? "",
    lastNameInitial: raw.last_name_initial ?? "",
    fullName: raw.full_name,
    avatarUrl: raw.avatar_url ?? null,
    role: raw.role ?? "",
    roleTrack: raw.role_track ?? "",
    seniorityBadge: raw.seniority_badge ?? raw.validated_level ?? "",
    validatedLevel: raw.validated_level ?? "",
    tier: raw.tier,
    score: compositeScore,
    compositeScore,
    skills: raw.skills ?? [],
    topSkills: raw.top_skills ?? [],
    aboutTags: raw.about_tags ?? [],
    // availability: API slug; availabilityStatus: separate status field (no cross-fallback).
    availability: raw.availability ?? "",
    availabilityStatus: raw.availability_status ?? "",
    availabilityLabel: raw.availability_label ?? "",
    verifiedAt: raw.verified_at,
    strongCompetencies: raw.strong_competencies ?? [],
    shareToken: raw.share_token ?? "",
    region: raw.region ?? "",
    dateAdded: raw.date_added ?? raw.verified_at,
    isSaved: raw.is_saved,
    offerSent: raw.offer_sent,
    offerStatus: raw.offer_status,
    isUnlocked: raw.is_unlocked ?? false,
    averageHireRating: raw.average_hire_rating ?? null,
    hireRatingCount: raw.hire_rating_count ?? 0,
    wouldHireAgainRate: raw.would_hire_again_rate ?? null,
  };
}

function mapDiscoveryList(
  raw: RawEmployerDiscoveryCandidatesListResponse,
  fallbackLimit: number,
): EmployerDiscoveryCandidatesListData {
  return {
    candidates: (raw.candidates ?? []).map(mapDiscoveryCandidate),
    total: raw.total ?? 0,
    page: raw.page ?? 1,
    limit: raw.limit ?? fallbackLimit,
    totalPages: raw.total_pages ?? 1,
    emptyStateMessage: raw.empty_state_message,
  };
}

function mapDiscoveryProfile(
  raw: RawEmployerDiscoveryCandidateProfile,
): EmployerDiscoveryCandidateProfile {
  const {
    user_id,
    email,
    is_saved,
    offer_sent,
    offer_status,
    is_unlocked,
    role_track,
    validated_level,
    portfolio_url,
    linkedin_url,
    average_hire_rating,
    hire_rating_count,
    would_hire_again_rate,
    ...profile
  } = raw;

  return {
    ...profile,
    userId: user_id,
    email: email ?? null,
    isSaved: is_saved,
    offerSent: offer_sent,
    offerStatus: offer_status,
    isUnlocked: is_unlocked ?? false,
    roleTrack: role_track ?? null,
    validatedLevel: validated_level ?? null,
    portfolioUrl: portfolio_url ?? null,
    linkedinUrl: linkedin_url ?? null,
    averageHireRating: average_hire_rating ?? null,
    hireRatingCount: hire_rating_count ?? 0,
    wouldHireAgainRate: would_hire_again_rate ?? null,
  };
}

export async function discoverCandidates(
  params: DiscoveryCandidatesParams,
): Promise<EmployerDiscoveryCandidatesListData> {
  const query = buildDiscoveryQueryString(params);
  const path = query
    ? `/employer/discovery/candidates?${query}`
    : "/employer/discovery/candidates";
  const res =
    await authApi.get<ApiEnvelope<RawEmployerDiscoveryCandidatesListResponse>>(
      path,
    );
  const raw = unwrapData(res);
  return mapDiscoveryList(raw, params.limit ?? DEFAULT_PAGE_SIZE);
}

export async function getDiscoveryCandidateProfile(
  userId: string,
): Promise<EmployerDiscoveryCandidateProfile> {
  const res = await authApi.get<
    ApiEnvelope<RawEmployerDiscoveryCandidateProfile>
  >(`/employer/discovery/candidates/${encodeURIComponent(userId)}/profile`);
  return mapDiscoveryProfile(unwrapData(res));
}

export async function getHiringBrief(
  userId: string,
): Promise<EmployerHiringBriefResponse> {
  const res = await authApi.get<ApiEnvelope<EmployerHiringBriefResponse>>(
    `/employer/discovery/candidates/${encodeURIComponent(userId)}/hiring-brief`,
  );
  return unwrapData(res);
}

export async function getSavedCandidates(
  params?: EmployerSavedCandidatesListParams,
): Promise<EmployerDiscoveryCandidatesListData> {
  const res = await authApi.get<
    ApiEnvelope<RawEmployerDiscoveryCandidatesListResponse>
  >("/employer/discovery/saved", { params });
  const raw = unwrapData(res);
  return mapDiscoveryList(raw, params?.limit ?? DEFAULT_PAGE_SIZE);
}

export async function saveCandidate(userId: string): Promise<void> {
  await authApi.post(
    `/employer/discovery/candidates/${encodeURIComponent(userId)}/save`,
  );
}

export async function removeCandidate(userId: string): Promise<void> {
  await authApi.delete(
    `/employer/discovery/candidates/${encodeURIComponent(userId)}/save`,
  );
}

/** Spends one unlock to reveal a candidate. Throws an ApiError with status 402 when none are left. */
export async function unlockCandidate(
  userId: string,
): Promise<{ alreadyUnlocked: boolean; unlocksRemaining: number }> {
  const res = await authApi.post<
    ApiEnvelope<{ already_unlocked: boolean; unlocks_remaining: number }>
  >(`/employer/discovery/candidates/${encodeURIComponent(userId)}/unlock`);
  const data = unwrapData(res);
  return {
    alreadyUnlocked: data.already_unlocked,
    unlocksRemaining: data.unlocks_remaining,
  };
}
