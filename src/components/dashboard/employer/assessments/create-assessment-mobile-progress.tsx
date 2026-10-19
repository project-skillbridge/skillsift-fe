"use client";

import { Check } from "lucide-react";

import type { CreateAssessmentStep } from "@/constants/create-assessment-wizard";

type CreateAssessmentMobileProgressProps = {
  steps: readonly CreateAssessmentStep[];
  currentStepIndex: number;
};

export function CreateAssessmentMobileProgress({
  steps,
  currentStepIndex,
}: CreateAssessmentMobileProgressProps) {
  const width = `${((currentStepIndex + 1) / steps.length) * 100}%`;

  return (
    <div className="lg:hidden">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded-full bg-google-green text-white">
          <Check className="size-3 stroke-[2.5]" />
        </div>
        <p className="font-sans text-sm font-semibold text-[#101828]">
          Step {currentStepIndex + 1} of {steps.length} ·{" "}
          {steps[currentStepIndex].title}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={currentStepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        className="h-1 w-full overflow-hidden rounded-full bg-[#E5E7EB]"
      >
        <div
          className="h-full rounded-full bg-[#EF4444] transition-[width] duration-300"
          style={{ width }}
        />
      </div>
    </div>
  );
}
