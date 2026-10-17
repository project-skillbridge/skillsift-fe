import type {
  EmployerOfferListItem,
  EmployerOfferStatus,
} from "@/types/api/employer-offers";

export const SHORTLIST_HERO = {
  title: "Need role-based assessments for your team?",
  description:
    "Create customized assessments tailored to your roles and evaluate talents with confidence.",
  ctaLabel: "Create assessment",
  ctaHref: "/e/assessments",
  illustration: "/assets/employer-dashboard/shortlist-hero.svg",
} as const;

export const SHORTLIST_EMPTY_STATE = {
  title: "No shortlisted talents",
  description: "Once you shortlist talents, they will appear here",
  icon: "/assets/icons/icon-shortlisted-candidates.svg",
} as const;

export const OFFERS_EMPTY_STATE = {
  title: "No invites sent",
  description: "Once you invite talents to interview, they will appear here",
  icon: "/assets/icons/icon-assessments-shared.svg",
} as const;

/**
 * Pill colour + label per offer status. Grouped roughly:
 *   - in-flight / waiting  → yellow / blue / purple
 *   - candidate progressed → green
 *   - terminal positive    → emerald
 *   - terminal negative    → red
 *   - inactive / dead-end  → gray
 */
export const OFFER_STATUS_META: Record<
  EmployerOfferStatus,
  { label: string; pillClass: string }
> = {
  pending: {
    label: "PENDING",
    pillClass: "bg-[#FEF3C7] text-[#92400E]",
  },
  assessment_unlocked: {
    label: "ASSESSMENT UNLOCKED",
    pillClass: "bg-[#DBEAFE] text-[#1E40AF]",
  },
  assessment_completed: {
    label: "ASSESSMENT COMPLETED",
    pillClass: "bg-[#EDE9FE] text-[#5B21B6]",
  },
  passed: {
    label: "PASSED",
    pillClass: "bg-[#D1FAE5] text-[#065F46]",
  },
  failed: {
    label: "FAILED",
    pillClass: "bg-[#FEE2E2] text-[#991B1B]",
  },
  accepted: {
    label: "ACCEPTED",
    pillClass: "bg-[#D1FAE5] text-[#065F46]",
  },
  declined: {
    label: "DECLINED",
    pillClass: "bg-[#FEE2E2] text-[#991B1B]",
  },
  expired: {
    label: "EXPIRED",
    pillClass: "bg-[#E5E7EB] text-[#374151]",
  },
  hired: {
    label: "HIRED",
    pillClass: "bg-[#A7F3D0] text-[#064E3B]",
  },
  withdrawn: {
    label: "WITHDRAWN",
    pillClass: "bg-[#E5E7EB] text-[#374151]",
  },
  interview_invited: {
    label: "INTERVIEW INVITED",
    pillClass: "bg-[#E0E7FF] text-[#4338CA]",
  },
  interview_accepted: {
    label: "INTERVIEW ACCEPTED",
    pillClass: "bg-[#D1FAE5] text-[#065F46]",
  },
  interview_declined: {
    label: "INTERVIEW DECLINED",
    pillClass: "bg-[#FEE2E2] text-[#991B1B]",
  },
};

/**
 * Mock offers used while the backend offers endpoints are pending. Shape
 * mirrors `EmployerOfferListItem` exactly; when backend ships the list
 * endpoint, only the action/hook need to land.
 *
 * The mock fills `candidateAvatarUrl` and `candidateScore` for design
 * parity — the live response doesn't yet include either field, so real
 * rows will render with initials + a placeholder score until backend
 * adds them.
 */
export const MOCK_EMPLOYER_OFFERS: EmployerOfferListItem[] = [
  {
    offerId: "offer-001",
    candidateUserId: "cand-001",
    candidateName: "Adebayo O.",
    candidateAvatarUrl: null,
    candidateScore: 85,
    roleTrack: "mobile_developer",
    jobTitle: "Lead Flutter Engineer",
    dateSent: "2026-05-18T09:00:00.000Z",
    status: "pending",
    pendingHireFeedback: false,
  },
  {
    offerId: "offer-002",
    candidateUserId: "cand-002",
    candidateName: "Chiamaka E.",
    candidateAvatarUrl: null,
    candidateScore: 87,
    roleTrack: "product_designer",
    jobTitle: "Product Designer",
    dateSent: "2026-05-18T09:00:00.000Z",
    status: "pending",
    pendingHireFeedback: false,
  },
  {
    offerId: "offer-003",
    candidateUserId: "cand-003",
    candidateName: "David M.",
    candidateAvatarUrl: null,
    candidateScore: 91,
    roleTrack: "backend_developer",
    jobTitle: "Backend Engineer",
    dateSent: "2026-05-18T09:00:00.000Z",
    status: "pending",
    pendingHireFeedback: false,
  },
  {
    offerId: "offer-004",
    candidateUserId: "cand-004",
    candidateName: "Tolani Y.",
    candidateAvatarUrl: null,
    candidateScore: 95,
    roleTrack: "frontend_developer",
    jobTitle: "Frontend Developer",
    dateSent: "2026-05-18T09:00:00.000Z",
    status: "pending",
    pendingHireFeedback: false,
  },
];

/** Tabs for the shortlist page toolbar. */
export type ShortlistTabId = "shortlist" | "offers";
