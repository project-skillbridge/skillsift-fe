import type { AssessmentTier } from "./assessment";
import type { VerifiedProfileResponseData } from "./verified-profile";

/** Backend enforces a minimum composite score of 75 on discovery list. */
export const DISCOVERY_MIN_SCORE = 75;

/**
 * Discovery / saved candidate card as the UI consumes it. Mapped from the
 * snake_case backend response.
 */
export type EmployerDiscoveryCandidate = {
  userId: string;
  candidateId: string;
  firstName: string;
  lastNameInitial: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  roleTrack: string;
  seniorityBadge: string;
  validatedLevel: string;
  tier: AssessmentTier;
  score: number;
  compositeScore: number;
  skills: string[];
  topSkills: string[];
  aboutTags: string[];
  availability: string;
  availabilityStatus: string;
  availabilityLabel: string;
  verifiedAt: string;
  strongCompetencies: string[];
  shareToken: string;
  region: string;
  dateAdded: string;
  isSaved: boolean;
  offerSent: boolean;
  offerStatus: string | null;
  /** False until the employer spends an unlock (name, photo and links stay hidden). */
  isUnlocked: boolean;
  averageHireRating: number | null;
  hireRatingCount: number;
  wouldHireAgainRate: number | null;
};

/** @deprecated Use {@link EmployerDiscoveryCandidate}. */
export type EmployerSavedCandidate = EmployerDiscoveryCandidate;

export type EmployerDiscoveryCandidatesListData = {
  candidates: EmployerDiscoveryCandidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  emptyStateMessage: string | null;
};

/** @deprecated Use {@link EmployerDiscoveryCandidatesListData}. */
export type EmployerSavedCandidatesListData =
  EmployerDiscoveryCandidatesListData;

export type DiscoveryCandidatesParams = {
  page?: number;
  limit?: number;
  roleTrack?: string[];
  availability?: string[];
  experienceLevel?: string[];
  minScore?: number;
  maxScore?: number;
  region?: string[];
  search?: string;
};

export type EmployerSavedCandidatesListParams = {
  page?: number;
  limit?: number;
};

export type EmployerDiscoveryCandidateProfile = VerifiedProfileResponseData & {
  userId: string;
  email: string | null;
  isSaved: boolean;
  offerSent: boolean;
  offerStatus: "pending" | "accepted" | null;
  isUnlocked: boolean;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  averageHireRating: number | null;
  hireRatingCount: number;
  wouldHireAgainRate: number | null;
};

// ─── Raw response (snake_case from the API) ──────────────────────────────────

export type RawEmployerDiscoveryCandidate = {
  user_id: string;
  candidate_id?: string;
  first_name?: string;
  last_name_initial?: string;
  full_name: string;
  avatar_url?: string | null;
  role?: string;
  role_track?: string | null;
  seniority_badge?: string;
  validated_level?: string | null;
  tier: AssessmentTier;
  score?: number;
  composite_score?: number;
  skills?: string[];
  top_skills?: string[];
  about_tags?: string[];
  availability?: string;
  availability_status?: string | null;
  availability_label?: string | null;
  verified_at: string;
  strong_competencies?: string[] | null;
  share_token?: string | null;
  region?: string | null;
  date_added?: string | null;
  is_saved: boolean;
  offer_sent: boolean;
  offer_status: "pending" | "accepted" | null;
  is_unlocked?: boolean;
  average_hire_rating?: number | null;
  hire_rating_count?: number;
  would_hire_again_rate?: number | null;
};

/** @deprecated Use {@link RawEmployerDiscoveryCandidate}. */
export type RawEmployerSavedCandidate = RawEmployerDiscoveryCandidate;

export type RawEmployerDiscoveryCandidatesListResponse = {
  candidates: RawEmployerDiscoveryCandidate[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  empty_state_message: string | null;
};

/** @deprecated Use {@link RawEmployerDiscoveryCandidatesListResponse}. */
export type RawEmployerSavedCandidatesListResponse =
  RawEmployerDiscoveryCandidatesListResponse;

export type RawEmployerDiscoveryCandidateProfile =
  VerifiedProfileResponseData & {
    user_id: string;
    email?: string | null;
    is_saved: boolean;
    offer_sent: boolean;
    offer_status: "pending" | "accepted" | null;
    is_unlocked?: boolean;
    portfolio_url?: string | null;
    linkedin_url?: string | null;
    average_hire_rating?: number | null;
    hire_rating_count?: number;
    would_hire_again_rate?: number | null;
  };
