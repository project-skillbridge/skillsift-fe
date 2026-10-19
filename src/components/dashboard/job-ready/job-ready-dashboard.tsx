"use client";

import { CertificatesSection } from "@/components/certificates/certificates-section";
import { DashboardRecommended } from "@/components/dashboard/dashboard-recommended";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import {
  apiGoalToLabel,
  apiRoleTrackToLabel,
} from "@/constants/talent-onboarding";
import { useMe } from "@/hooks/api";
import type { DashboardHomeResponseData } from "@/types/api";

import { SkillBreakdownSection } from "@/components/dashboard/skill-breakdown";
import { JobReadyStatusCard } from "./job-ready-status-card";
import { JobReadyTrackRecord } from "./job-ready-track-record";
import { JobReadyVerifiedProfile } from "./job-ready-verified-profile";

type JobReadyDashboardProps = {
  dashboardHome: DashboardHomeResponseData;
};

export function JobReadyDashboard({ dashboardHome }: JobReadyDashboardProps) {
  const advanced = dashboardHome.performance?.advanced;
  const { data: me } = useMe({ enabled: true });
  const goalLabel = apiGoalToLabel(dashboardHome.goal);
  const roleLabel = apiRoleTrackToLabel(me?.track ?? undefined);
  const avatarUrl = dashboardHome.avatarUrl ?? me?.avatar_url ?? undefined;

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto">
      <DashboardWelcome
        firstName={dashboardHome.firstName}
        goal={goalLabel}
        profileCompletion={dashboardHome.profileCompletionPercentage}
      />
      <JobReadyStatusCard
        tier={advanced?.tierLabel}
        score={advanced?.percentage}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SkillBreakdownSection
          tier={advanced?.tier}
          activePercentage={advanced?.percentage}
          completedAt={advanced?.completedAt}
        />
        <JobReadyVerifiedProfile
          firstName={dashboardHome.firstName}
          verifiedAt={advanced?.completedAt}
          avatarUrl={avatarUrl}
          role={roleLabel}
        />
      </div>
      <CertificatesSection />
      <JobReadyTrackRecord />
      <DashboardRecommended />
    </div>
  );
}
