"use client";

import { AssessmentPreviewCard } from "@/components/assessments/assessment-preview-card";
import { isSkillExhausted } from "@/components/assessments/dashboard-home-state";
import {
  getAssessmentPreview,
  type AssessmentPreview,
  type AssessmentSlug,
} from "@/constants/assessment-previews";
import { useSkillAvailability } from "@/hooks/api/use-assessment";
import { useDashboardHome } from "@/hooks/api/use-dashboard";
import { ASSESSMENT_PREPARING_MESSAGE } from "@/lib/assessment-start";

type AssessmentPreviewPageProps = {
  assessmentName: AssessmentSlug;
};

function withDynamicAttempts(
  base: AssessmentPreview,
  slug: AssessmentSlug,
  dashboardHome: ReturnType<typeof useDashboardHome>["data"],
): AssessmentPreview {
  if (!dashboardHome) return base;

  if (slug === "skill") {
    const used =
      dashboardHome.performance?.skill?.attemptsUsed ??
      dashboardHome.skillAttemptsUsed;
    const max = dashboardHome.skillMaxAttempts;
    if (used == null || used <= 0 || max == null) return base;
    const remaining = Math.max(0, max - used);
    const attempts =
      remaining === 0
        ? `No attempts remaining (${used} of ${max} used)`
        : `${remaining} of ${max} attempts remaining`;
    return { ...base, attempts };
  }

  if (slug === "advanced") {
    const retake =
      dashboardHome.performance?.advanced?.retake ??
      dashboardHome.advancedRetake;
    const daysRemaining = retake?.daysRemaining;
    if (daysRemaining == null) return base;
    const attempts =
      daysRemaining <= 0
        ? "Retake available now"
        : daysRemaining === 1
          ? "Retake available in 1 day"
          : `Retake available in ${daysRemaining} days`;
    return { ...base, attempts };
  }

  return base;
}

function AssessmentPreviewPage({ assessmentName }: AssessmentPreviewPageProps) {
  const base = getAssessmentPreview(assessmentName);
  const { data: dashboardHome } = useDashboardHome();
  const { data: skillAvailability } = useSkillAvailability(
    assessmentName === "skill",
  );
  const assessment = withDynamicAttempts(base, assessmentName, dashboardHome);

  const skillExhausted =
    assessmentName === "skill" && isSkillExhausted(dashboardHome);
  const skillAttemptsUsed =
    assessmentName === "skill"
      ? (dashboardHome?.performance?.skill?.attemptsUsed ??
        dashboardHome?.skillAttemptsUsed ??
        0)
      : 0;
  const skillIsRetake =
    assessmentName === "skill" && !skillExhausted && skillAttemptsUsed > 0;

  const advancedRetake =
    assessmentName === "advanced"
      ? (dashboardHome?.performance?.advanced?.retake ??
        dashboardHome?.advancedRetake)
      : undefined;
  const advancedRetakeBlocked = advancedRetake?.ctaEnabled === false;

  const startHref = skillExhausted ? "/t/assessments/advanced" : undefined;
  // No unseen questions left yet: say so up front instead of failing after Start.
  const skillPreparing =
    assessmentName === "skill" &&
    !skillExhausted &&
    skillAvailability?.can_start === false;
  const startLabel = skillPreparing
    ? "Available soon"
    : skillExhausted
      ? "Continue to advanced"
      : skillIsRetake || advancedRetake != null
        ? "Retake"
        : undefined;
  const startDisabled = advancedRetakeBlocked || skillPreparing;

  return (
    <div className="flex min-h-[calc(100dvh-72px)] items-start justify-center px-4 pt-11 pb-14 sm:pt-14 lg:pt-16 2xl:pt-20">
      <div className="mx-auto w-full max-w-200 xl:max-w-217.5 2xl:max-w-238">
        <AssessmentPreviewCard
          assessment={assessment}
          startHref={startHref}
          startLabel={startLabel}
          startDisabled={startDisabled}
        />
        {skillPreparing && (
          <p
            role="status"
            className="mt-4 text-center font-sans text-sm text-muted-foreground"
          >
            {ASSESSMENT_PREPARING_MESSAGE}
          </p>
        )}
      </div>
    </div>
  );
}

export { AssessmentPreviewPage };
export type { AssessmentPreviewPageProps };
