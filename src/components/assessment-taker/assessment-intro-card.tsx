"use client";

import type { ReactNode } from "react";

import { AssessmentPreviewCard } from "@/components/assessments/assessment-preview-card";
import { buildEmployerAssessmentPreview } from "@/lib/employer-assessment-preview";
import type { PublicAssessment } from "@/types/api/assessment-taker";

type Props = {
  assessment: PublicAssessment;
  /** Extra inputs shown above the start button (email and consent for external takers). */
  children?: ReactNode;
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
};

/** The talent assessment preview card, filled in for an employer's assessment. */
export function AssessmentIntroCard({
  assessment,
  children,
  canStart,
  isStarting,
  onStart,
}: Props) {
  return (
    <div className="flex min-h-[calc(100dvh-72px)] items-start justify-center px-0 pt-8 pb-14 sm:pt-12 lg:pt-14">
      <div className="mx-auto w-full max-w-200 xl:max-w-217.5 2xl:max-w-238">
        {assessment.welcome_message ? (
          <div className="mb-4 rounded-2xl border border-[#D3E6DF] bg-[#F4FBF8] p-5">
            <p className="text-xs font-medium tracking-wide text-[#008458] uppercase">
              {assessment.employer_name
                ? `A note from ${assessment.employer_name}`
                : "A note from the employer"}
            </p>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-[#0d2025]">
              {assessment.welcome_message}
            </p>
          </div>
        ) : null}
        <AssessmentPreviewCard
          assessment={buildEmployerAssessmentPreview(assessment)}
          startLabel={isStarting ? "Starting..." : "Start assessment"}
          startDisabled={!canStart || isStarting}
          onStart={onStart}
        >
          {children ? (
            <div className="mt-6 border-t border-[#D9D9D9] pt-6">
              {children}
            </div>
          ) : null}
        </AssessmentPreviewCard>
      </div>
    </div>
  );
}
