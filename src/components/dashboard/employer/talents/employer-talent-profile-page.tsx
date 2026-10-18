"use client";

import { VerifiedReportSkillsSection } from "@/components/verified-report/verified-report-skills-section";
import { VerifiedReportSummary } from "@/components/verified-report/verified-report-summary";
import { VerifiedReportErrorState } from "@/components/verified-report/verified-report-error-state";
import { VerifiedReportLoadingState } from "@/components/verified-report/verified-report-loading-state";
import { getSkillBreakdownTabs } from "@/components/verified-report/verified-report-utils";
import { useDiscoveryCandidateProfile } from "@/hooks/api/use-employer-discovery";
import { ApiError } from "@/lib/api";

import { EmployerTalentProfileHeader } from "../employer-talent-profile-header";
import { EmployerTalentContactPanel } from "./employer-talent-contact-panel";
import { EmployerCandidateDecisionCard } from "./employer-candidate-decision-card";
import { EmployerRoleFit } from "./employer-role-fit";
import { EmployerHiringBrief } from "./employer-hiring-brief";
import { EmployerUnlockPanel } from "./employer-unlock-panel";

type EmployerTalentProfilePageProps = {
  userId: string;
};

export function EmployerTalentProfilePage({
  userId,
}: EmployerTalentProfilePageProps) {
  const { data, isPending, isError, error } =
    useDiscoveryCandidateProfile(userId);

  if (isPending) {
    return <VerifiedReportLoadingState />;
  }

  const notFoundError =
    error instanceof ApiError && error.status === 404 ? error : null;

  if (notFoundError) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-y-6 px-4 py-8 md:px-8">
        <EmployerTalentProfileHeader
          userId={userId}
          isSaved={false}
          offerSent={false}
        />
        <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-[#151515]">
            Candidate not found
          </p>
          <p className="mt-2 text-sm text-[#757575]">{notFoundError.message}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <VerifiedReportErrorState />;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8 md:px-8">
      <EmployerTalentProfileHeader
        userId={data.userId}
        isSaved={data.isSaved}
        offerSent={data.offerSent}
      />
      {/* Post-acceptance the employer is here to coordinate, not re-evaluate
          — surface contact details up front, above the profile content. */}
      {data.offerStatus === "accepted" ? (
        <EmployerTalentContactPanel
          candidateName={data.full_name}
          email={data.email}
        />
      ) : null}
      <EmployerCandidateDecisionCard profile={data} />
      <EmployerUnlockPanel profile={data} />
      <EmployerRoleFit profile={data} />
      <EmployerHiringBrief userId={data.userId} />
      <details className="group rounded-2xl border border-[#E4E7EC] bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-[#151515]">
          Full profile
          <span className="text-sm font-medium text-[#667085] group-open:hidden">
            Show
          </span>
          <span className="hidden text-sm font-medium text-[#667085] group-open:inline">
            Hide
          </span>
        </summary>
        <div className="flex flex-col gap-y-6 border-t border-[#EEF0F3] p-5">
          <VerifiedReportSummary
            data={data}
            viewerMode="employer"
            trackRecord={{
              averageRating: data.averageHireRating,
              ratingCount: data.hireRatingCount,
              wouldHireAgainRate: data.wouldHireAgainRate,
            }}
            isShortlisted={data.isSaved}
          />
          <section className="flex flex-col gap-y-5">
            <VerifiedReportSkillsSection skills={getSkillBreakdownTabs(data)} />
          </section>
        </div>
      </details>
    </div>
  );
}
