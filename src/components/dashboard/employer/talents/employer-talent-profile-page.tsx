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
      <h2 className="pt-4 text-xl font-semibold text-[#151515]">
        Full profile
      </h2>
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
  );
}
