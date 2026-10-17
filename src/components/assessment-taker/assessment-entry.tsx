"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ExternalAssessmentPage } from "@/components/external-assessment/external-assessment-page";
import { usePublicAssessment } from "@/hooks/api/use-external-assessment";

import { TalentAssessmentPage } from "./talent-assessment-page";

/** Picks the right flow for a shared assessment link. */
export function AssessmentEntry({ token }: { token: string }) {
  const { data, isLoading, isError } = usePublicAssessment(token);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#151515]">
          This link isn&apos;t available
        </h1>
        <p className="mt-2 text-sm text-[#475467]">
          The assessment may have been closed or the link is wrong. Ask the
          employer for a fresh link.
        </p>
      </div>
    );
  }

  return data.type === "external" ? (
    <ExternalAssessmentPage token={token} assessment={data} />
  ) : (
    <TalentAssessmentPage token={token} assessment={data} />
  );
}
