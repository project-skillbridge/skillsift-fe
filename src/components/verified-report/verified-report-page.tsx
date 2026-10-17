"use client";

import { useMyCertificates, useTalentTrackRecord } from "@/hooks/api";
import { useDashboardHome } from "@/hooks/api/use-dashboard";
import { useVerifiedProfile } from "@/hooks/api/use-verified-profile";
import { ApiError } from "@/lib/api";

import { VerifiedReportContent } from "./verified-report-content";
import { VerifiedReportErrorState } from "./verified-report-error-state";
import { VerifiedReportLoadingState } from "./verified-report-loading-state";
import { SkillProfileFallback } from "./skill-profile-fallback";
import { VerifiedReportUnavailableState } from "./verified-report-unavailable-state";

const VerifiedReportPage = () => {
  const { data, isPending, isError, error } = useVerifiedProfile();
  const { data: trackRecord } = useTalentTrackRecord();
  const { data: dashboardHome, isPending: homePending } = useDashboardHome();
  const { data: certificates } = useMyCertificates();

  if (isPending || homePending) {
    return <VerifiedReportLoadingState />;
  }

  const notFoundError =
    error instanceof ApiError && error.status === 404 ? error : null;

  if (notFoundError) {
    const skill = dashboardHome?.performance?.skill;
    if (skill) {
      return (
        <SkillProfileFallback
          firstName={dashboardHome.firstName}
          skill={skill}
          certificates={certificates ?? []}
        />
      );
    }
    return <VerifiedReportUnavailableState message={notFoundError.message} />;
  }
  if (isError || !data) return <VerifiedReportErrorState />;

  return (
    <div className="flex flex-col gap-y-6 my-8.5">
      <VerifiedReportContent
        data={data}
        viewerMode="owner"
        trackRecord={
          trackRecord
            ? {
                averageRating: trackRecord.averageRating,
                ratingCount: trackRecord.ratingCount,
                wouldHireAgainRate: trackRecord.wouldHireAgainRate,
              }
            : null
        }
      />
    </div>
  );
};

export default VerifiedReportPage;
