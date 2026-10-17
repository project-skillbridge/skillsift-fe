import type { EmployerAssessmentStatus } from "@/types/api/employer-assessments";

export const DEFAULT_ASSESSMENT_PASS_RATE = 70;
/** The backend only accepts a passing threshold in this range. */
export const MIN_ASSESSMENT_PASS_RATE = 50;
export const MAX_ASSESSMENT_PASS_RATE = 90;

/** Backend accepts exactly these durations. */
export const ASSESSMENT_TIME_LIMIT_OPTIONS = [
  { value: "20", label: "20 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "40", label: "40 minutes" },
  { value: "60", label: "1 hour" },
] as const;

export const ASSESSMENT_LEVEL_OPTIONS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
] as const;

/** Company-written assessments need at least this many questions. */
export const MIN_COMPANY_QUESTIONS = 5;
export const MAX_ASSESSMENT_RECIPIENTS = 50;

export const ASSESSMENT_STATUS_META: Record<
  EmployerAssessmentStatus,
  { label: string; pillClass: string }
> = {
  active: {
    label: "Active",
    pillClass: "bg-[#D1FAE5] text-[#065F46]",
  },
  inactive: {
    label: "Inactive",
    pillClass: "bg-[#E5E7EB] text-[#374151]",
  },
};
