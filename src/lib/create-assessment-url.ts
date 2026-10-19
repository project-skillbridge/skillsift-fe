import type { CreateAssessmentValues } from "@/types/create-assessment-schema";

/** Query string the assessment wizard reads; the dialog collects these up front. */
export function buildAssessmentDraftUrl(
  values: CreateAssessmentValues,
): string {
  const params = new URLSearchParams({
    title: values.title.trim(),
    roleTrack: values.roleTrack,
    level: values.experienceLevel,
    timeLimit: values.timeLimitMinutes,
    passRate: String(values.passRate),
    type: values.type,
  });
  return `/e/assessments/draft?${params.toString()}`;
}
