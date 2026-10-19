"use client";

import { VerifiedReportErrorState } from "@/components/verified-report/verified-report-error-state";
import { VerifiedReportLoadingState } from "@/components/verified-report/verified-report-loading-state";
import { useDiscoveryCandidateProfile } from "@/hooks/api/use-employer-discovery";
import { ApiError } from "@/lib/api";

import { EmployerTalentProfileHeader } from "../employer-talent-profile-header";
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
        <EmployerTalentProfileHeader userId={userId} isSaved={false} />
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
        profile={data}
      />
      <EmployerCandidateDecisionCard profile={data} />
      <EmployerUnlockPanel profile={data} />
      <EmployerRoleFit profile={data} />
      <EmployerHiringBrief userId={data.userId} />
    </div>
  );
}
