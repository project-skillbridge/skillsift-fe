"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CreateAssessmentStepCardProps = {
  title: string;
  description: string;
  currentStepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  assessmentType?: "external" | "internal";
  showBack?: boolean;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  onBack?: () => void;
  onNext: () => void;
  children: ReactNode;
  className?: string;
};

export function CreateAssessmentStepCard({
  title,
  description,
  currentStepIndex,
  totalSteps,
  isLastStep,
  assessmentType,
  showBack = false,
  nextDisabled = false,
  nextLoading = false,
  onBack,
  onNext,
  children,
  className,
}: CreateAssessmentStepCardProps) {
  const progressWidth = `${((currentStepIndex + 1) / totalSteps) * 100}%`;

  return (
    <Card
      className={cn(
        "min-h-96 flex-1 gap-0 rounded-none border-0 bg-transparent py-0 ring-0 shadow-none",
        "lg:min-h-128 lg:rounded-xl lg:border lg:bg-card lg:ring-1 lg:shadow-sm",
        className,
      )}
    >
      <CardContent className="flex flex-1 flex-col px-0 py-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <h1 className="font-sans text-xl font-bold leading-tight text-[#101828]">
            {title}
          </h1>
          <p className="mt-1 font-sans text-sm leading-6 text-[#667085]">
            {description}
          </p>
        </div>
        {children}
      </CardContent>

      <CardFooter className="hidden flex-col gap-0 border-t border-border/60 p-0 lg:flex">
        <div
          className="h-1 w-full overflow-hidden bg-[#F2F4F7]"
          role="progressbar"
          aria-valuenow={currentStepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label="Assessment creation progress"
        >
          <div
            className="h-full bg-[#EF4444] transition-[width] duration-300 ease-out"
            style={{ width: progressWidth }}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-4 px-8 py-5">
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={nextLoading}
              className="h-9 rounded-xl border border-[#E5E7EB] px-5 text-sm text-[#667085] hover:bg-[#F9FAFB]"
            >
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || nextLoading}
            className="h-9 min-w-24 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white hover:bg-[#111827]/90 disabled:opacity-40"
          >
            {nextLoading
              ? "Saving..."
              : isLastStep
                ? assessmentType === "external"
                  ? "Create link"
                  : "Publish and invite"
                : "Next"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
