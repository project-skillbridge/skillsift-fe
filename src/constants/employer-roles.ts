import { EMPLOYER_ROLE_TRACKS } from "@/constants/employer-onboarding";

/** Target seniority for a role; values match the backend `VerifiedLevel` enum. */
export const ROLE_LEVEL_OPTIONS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" },
] as const;

/** Sentinel for "no education requirement"; never sent to the API. */
export const NO_EDUCATION_REQUIREMENT = "any";

/** Education values match the backend `TALENT_EDUCATION_LEVELS`. */
export const ROLE_EDUCATION_OPTIONS = [
  { value: NO_EDUCATION_REQUIREMENT, label: "No requirement" },
  { value: "high_school", label: "High school diploma" },
  { value: "associate", label: "Associate degree" },
  { value: "bachelor", label: "Bachelor's degree" },
  { value: "master", label: "Master's degree" },
  { value: "doctorate", label: "PhD / Doctorate" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "other", label: "Other" },
] as const;

export function educationLabel(value: string | null | undefined): string {
  if (!value) return "";
  return ROLE_EDUCATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function levelLabel(value: string | null | undefined): string {
  if (!value) return "";
  return ROLE_LEVEL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function trackLabel(value: string | null | undefined): string {
  if (!value) return "";
  return EMPLOYER_ROLE_TRACKS.find((t) => t.id === value)?.label ?? value;
}
