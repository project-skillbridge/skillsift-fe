import { CertificatesSection } from "@/components/certificates/certificates-section";
import { DashboardRecommended } from "@/components/dashboard/dashboard-recommended";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { apiGoalToLabel } from "@/constants/talent-onboarding";
import type { DashboardHomeResponseData } from "@/types/api";

import { DashboardJobRoadmap } from "./emerging-user-job-roadmap";
import { SkillBreakdownSection } from "@/components/dashboard/skill-breakdown";
import { JobReadyTrackRecord } from "@/components/dashboard/job-ready/job-ready-track-record";
import { DashboardStatusCard } from "./emerging-user-status-card";

type EmergingUserDashboardProps = {
  dashboardHome: DashboardHomeResponseData;
};

export function EmergingUserDashboard({
  dashboardHome,
}: EmergingUserDashboardProps) {
  const advanced = dashboardHome.performance?.advanced;
  const goalLabel = apiGoalToLabel(dashboardHome.goal);

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto">
      <DashboardWelcome
        firstName={dashboardHome.firstName}
        goal={goalLabel}
        profileCompletion={dashboardHome.profileCompletionPercentage}
      />
      <DashboardStatusCard
        tier={advanced?.tierLabel}
        score={advanced?.percentage}
        daysRemaining={advanced?.retake?.daysRemaining}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SkillBreakdownSection
          tier={advanced?.tier}
          activePercentage={advanced?.percentage}
          completedAt={advanced?.completedAt}
        />
        <DashboardJobRoadmap journeyOverview={dashboardHome.journeyOverview} />
      </div>
      <CertificatesSection />
      <JobReadyTrackRecord />
      <DashboardRecommended />
    </div>
  );
}
