import type { DiscoveryCandidatesParams } from "@/types/api/employer-discovery";
import { DISCOVERY_MIN_SCORE } from "@/types/api/employer-discovery";
import type { TalentFilters } from "@/types/employer-talents";

/** Serialize discovery query params with repeated keys for array fields. */
export function buildDiscoveryQueryString(
  params: DiscoveryCandidatesParams,
): string {
  const searchParams = new URLSearchParams();

  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.minScore != null)
    searchParams.set("minScore", String(params.minScore));
  if (params.maxScore != null)
    searchParams.set("maxScore", String(params.maxScore));
  // The API takes one comma-separated value for several regions.
  if (params.region?.length)
    searchParams.set("region", params.region.join(","));
  if (params.search) searchParams.set("search", params.search);

  for (const value of params.roleTrack ?? []) {
    searchParams.append("roleTrack", value);
  }
  for (const value of params.availability ?? []) {
    searchParams.append("availability", value);
  }
  for (const value of params.experienceLevel ?? []) {
    searchParams.append("experienceLevel", value);
  }

  return searchParams.toString();
}

export function toDiscoveryCandidatesParams(
  filters: TalentFilters,
  opts: { page: number; limit: number; search?: string },
): DiscoveryCandidatesParams {
  const minScore = Math.max(DISCOVERY_MIN_SCORE, filters.scoreMin);

  return {
    page: opts.page,
    limit: opts.limit,
    search: opts.search?.trim() || undefined,
    roleTrack: filters.roleTrack.length ? filters.roleTrack : undefined,
    experienceLevel: filters.experience.length ? filters.experience : undefined,
    availability: filters.availability.length
      ? filters.availability
      : undefined,
    minScore: minScore > DISCOVERY_MIN_SCORE ? minScore : undefined,
    region: filters.region.length ? filters.region : undefined,
  };
}
