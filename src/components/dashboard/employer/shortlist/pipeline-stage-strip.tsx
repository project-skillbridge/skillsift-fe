"use client";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type PipelineStageId = "shortlisted" | "invited" | "accepted" | "hired";

export const PIPELINE_STAGES: { id: PipelineStageId; label: string }[] = [
  { id: "shortlisted", label: "Shortlisted" },
  { id: "invited", label: "Invited" },
  { id: "accepted", label: "Accepted" },
  { id: "hired", label: "Hired" },
];

/** Which invite statuses belong to each stage after "Shortlisted". */
export const STAGE_STATUSES: Record<
  Exclude<PipelineStageId, "shortlisted">,
  readonly string[] | null
> = {
  // null = every invite that wasn't withdrawn.
  invited: null,
  accepted: ["accepted", "interview_accepted"],
  hired: ["hired"],
};

type PipelineStageStripProps = {
  counts: Record<PipelineStageId, number>;
  active: PipelineStageId;
  onSelect: (stage: PipelineStageId) => void;
};

/** Hiring funnel at a glance; each stage filters the list below it. */
export function PipelineStageStrip({
  counts,
  active,
  onSelect,
}: PipelineStageStripProps) {
  return (
    <nav
      aria-label="Hiring pipeline stages"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = stage.id === active;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl border p-4 text-left transition-colors",
              isActive
                ? "border-[#19A878] bg-[#F0FBF6]"
                : "border-[#E4E7EC] bg-white hover:bg-[#FAFAFA]",
            )}
          >
            <span className="flex flex-col">
              <span className="text-sm text-[#757575]">{stage.label}</span>
              <span className="text-2xl font-semibold text-[#151515]">
                {counts[stage.id]}
              </span>
            </span>
            {i < PIPELINE_STAGES.length - 1 ? (
              <ChevronRight
                className="hidden size-4 text-[#A1A1AA] sm:block"
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
