"use client";

import { useMemo } from "react";

import {
  ASSESSMENT_EXPECTATIONS,
  ASSESSMENT_PROFILE_COMPLETION,
  ASSESSMENT_ROADMAP_STEPS,
} from "@/constants/assessment-roadmap";
import { PracticeCard } from "@/components/dashboard/practice-card";
import { useDashboardHome } from "@/hooks/api/use-dashboard";
import { isAssessmentDemoMode, useDemoRoadmapSteps } from "@/mock/assessment";

import { applyDashboardHomeToRoadmapSteps } from "./dashboard-home-state";
import { ExpectationsPanel } from "./expectations-panel";
import { OverviewHeader } from "./overview-header";
import { RoadmapSection } from "./roadmap-section";

export function Overview() {
  const demoSteps = useDemoRoadmapSteps();
  const { data: dashboardHome } = useDashboardHome();

  const roadmapSteps = useMemo(() => {
    if (isAssessmentDemoMode()) return demoSteps;
    return applyDashboardHomeToRoadmapSteps(
      ASSESSMENT_ROADMAP_STEPS,
      dashboardHome,
    );
  }, [demoSteps, dashboardHome]);

  // Demo mode uses a static constant for the progress bar; real users get the
  // live value or `undefined` while loading — never a fake fallback that would
  // flash a misleading percentage before the dashboard resolves.
  const profileCompletion = isAssessmentDemoMode()
    ? ASSESSMENT_PROFILE_COMPLETION
    : dashboardHome?.profileCompletionPercentage;

  return (
    <div className="mx-auto max-w-260.5 animate-in fade-in slide-in-from-bottom-1 px-1 pb-10 duration-500 sm:px-0">
      <OverviewHeader profileCompletion={profileCompletion} />
      <ExpectationsPanel items={ASSESSMENT_EXPECTATIONS} />
      <PracticeCard className="mt-6" />
      <RoadmapSection steps={roadmapSteps} />
    </div>
  );
}
