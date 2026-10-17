"use client";

import { Overview } from "@/components/assessments/overview";
import { useDashboardHome } from "@/hooks/api/use-dashboard";

import { DashboardLoading } from "./dashboard-loading";
import { pickDashboardVariant } from "./dashboard-variant";
import { EmergingUserDashboard } from "./emerging-user/emerging-user-dashboard";
import { InProgressDashboard } from "./in-progress/in-progress-dashboard";
import { JobReadyDashboard } from "./job-ready/job-ready-dashboard";

export function TalentDashboard() {
  const { data: dashboardHome, isLoading } = useDashboardHome();

  if (isLoading) return <DashboardLoading />;

  const variant = pickDashboardVariant(dashboardHome);

  if (variant === "job-ready" && dashboardHome) {
    return <JobReadyDashboard dashboardHome={dashboardHome} />;
  }
  if (variant === "in-progress" && dashboardHome) {
    return <InProgressDashboard dashboardHome={dashboardHome} />;
  }
  if (variant === "emerging-user" && dashboardHome) {
    return <EmergingUserDashboard dashboardHome={dashboardHome} />;
  }
  return <Overview />;
}
