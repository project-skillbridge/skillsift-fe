"use client";

import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { EMPLOYER_DASHBOARD_GOAL } from "@/constants/employer-dashboard";
import { useEmployerDashboardHome } from "@/hooks/api/use-employer-dashboard";

import { EmployerCommandCenter } from "./employer-command-center";
import { EmployerDashboardActions } from "./employer-dashboard-actions";
import { EmployerDashboardHero } from "./employer-dashboard-hero";
import { EmployerDashboardPipelineBanner } from "./employer-dashboard-pipeline-banner";
import { EmployerNextSteps } from "./employer-next-steps";
import { EmployerPendingFeedbackBanner } from "./employer-pending-feedback-banner";
import { EmployerRecentActivity } from "./employer-recent-activity";

const NewEmployerDashboardPage = () => {
  const { data, isLoading, isError } = useEmployerDashboardHome();

  if (isLoading) return <DashboardLoading />;

  // Any error (network, 5xx, unrecognised shape) falls back to the new-user
  // view as a safe degradation.
  const viewState = isError ? "new_user" : (data?.viewState ?? "new_user");
  const recentActivity = data?.recentActivity ?? [];
  const firstName = data?.companyName?.split(" ")[0] || undefined;
  const profileCompletion = data?.profilePrompt?.completionPercentage;

  if (viewState === "existing_user") {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-10 py-8">
        <EmployerPendingFeedbackBanner />
        <EmployerCommandCenter
          companyName={firstName}
          profileCompletion={profileCompletion}
        />
        <EmployerNextSteps />
        <EmployerRecentActivity items={recentActivity} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 space-y-6 py-8 max-w-5xl mx-auto">
      <DashboardWelcome
        firstName={firstName}
        goal={EMPLOYER_DASHBOARD_GOAL}
        goalLabel=""
        profileCompletion={profileCompletion}
        settingsHref="/e/settings"
      />

      <EmployerNextSteps />

      <div className="rounded-2xl">
        <EmployerDashboardHero />
        <EmployerDashboardPipelineBanner />
      </div>
      <EmployerDashboardActions />
    </div>
  );
};

export default NewEmployerDashboardPage;
