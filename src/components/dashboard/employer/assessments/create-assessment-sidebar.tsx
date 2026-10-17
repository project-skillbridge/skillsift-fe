"use client";

import { Check } from "lucide-react";

import type { CreateAssessmentStep } from "@/constants/create-assessment-wizard";
import { cn } from "@/lib/utils";

type CreateAssessmentSidebarProps = {
  steps: readonly CreateAssessmentStep[];
  currentStepIndex: number;
};

export function CreateAssessmentSidebar({
  steps,
  currentStepIndex,
}: CreateAssessmentSidebarProps) {
  return (
    <aside className="w-80 shrink-0 rounded-xl border border-border bg-white p-5">
      <nav aria-label="Assessment creation steps">
        <ol className="flex flex-col gap-5">
          {steps.map((step, index) => {
            const isDone = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <li key={step.id} className="flex items-center gap-3">
                <div
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    isDone
                      ? "bg-google-green text-white"
                      : isActive
                        ? "border border-google-green text-google-green"
                        : "border border-foreground/25 text-foreground/40",
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "font-sans text-sm leading-snug transition-colors",
                    isActive && "font-medium text-foreground",
                    isDone && "text-foreground/80",
                    !isDone && !isActive && "text-foreground/40",
                  )}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
