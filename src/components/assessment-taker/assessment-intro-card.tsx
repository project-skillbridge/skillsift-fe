"use client";

import type { ReactNode } from "react";
import { Clock, ListChecks, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PublicAssessment } from "@/types/api/assessment-taker";

type Props = {
  assessment: PublicAssessment;
  /** Extra inputs shown above the start button (email and consent for external takers). */
  children?: ReactNode;
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
};

export function AssessmentIntroCard({
  assessment,
  children,
  canStart,
  isStarting,
  onStart,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-6">
      <div className="flex flex-col gap-1">
        {assessment.employer_name ? (
          <p className="text-sm text-[#757575]">{assessment.employer_name}</p>
        ) : null}
        <h1 className="text-2xl font-semibold text-[#151515]">
          {assessment.title}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-xl border border-[#E4E7EC] p-3">
          <ListChecks className="size-4 text-[#757575]" />
          {assessment.questions.length} questions
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E4E7EC] p-3">
          <Clock className="size-4 text-[#757575]" />
          {assessment.time_limit_minutes} minutes
        </div>
      </div>

      <div className="flex gap-3 rounded-xl bg-[#F9FAFB] p-4 text-sm text-[#475467]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        <p>
          The timer starts when you begin and keeps running if you leave the
          page. We note when you switch tabs or try to copy and paste, and the
          employer sees this with your result as a prompt for a closer look, not
          as proof of anything.
        </p>
      </div>

      {children}

      <Button
        type="button"
        size="lg"
        disabled={!canStart || isStarting}
        onClick={onStart}
      >
        {isStarting ? "Starting..." : "Start assessment"}
      </Button>
    </div>
  );
}
