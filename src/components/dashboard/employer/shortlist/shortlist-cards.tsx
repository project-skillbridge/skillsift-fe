"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { SHORTLIST_EMPTY_STATE } from "@/constants/employer-shortlist";
import { cn } from "@/lib/utils";
import type { EmployerSavedCandidate } from "@/types/api/employer-discovery";

import { CandidateAvatar } from "../shared/candidate-avatar";
import { DataEmptyState } from "../shared/data-empty-state";
import { ShortlistRowActions } from "./shortlist-row-actions";
import { formatTableDate } from "./shortlist-shared";

type ShortlistCardsProps = {
  candidates: EmployerSavedCandidate[];
  isLoading: boolean;
  selected: string[];
  onToggle: (userId: string) => void;
  maxSelected: number;
};

export function ShortlistCards({
  candidates,
  isLoading,
  selected,
  onToggle,
  maxSelected,
}: ShortlistCardsProps) {
  if (isLoading && candidates.length === 0) {
    return (
      <div className="flex min-h-70 items-center justify-center py-12 text-sm text-[#757575]">
        Loading shortlist…
      </div>
    );
  }
  if (candidates.length === 0) {
    return <DataEmptyState {...SHORTLIST_EMPTY_STATE} />;
  }

  return (
    <ul className="grid gap-3 p-4 sm:grid-cols-2">
      {candidates.map((c) => {
        const isSelected = selected.includes(c.userId);
        const locked = !isSelected && selected.length >= maxSelected;
        return (
          <li
            key={c.userId}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-[0_6px_20px_rgba(13,32,37,0.08)]",
              isSelected ? "border-[#009f6a] bg-[#F4FBF8]" : "border-[#E4E7EC]",
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isSelected}
                disabled={locked}
                onCheckedChange={() => onToggle(c.userId)}
                aria-label={`Compare ${c.fullName}`}
                className="mt-3"
              />
              <CandidateAvatar avatarUrl={c.avatarUrl} fullName={c.fullName} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/e/talents/${c.userId}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0d2025] hover:underline"
                >
                  <span className="truncate">{c.fullName}</span>
                  <ArrowUpRight className="size-3.5 shrink-0" />
                </Link>
                <p className="truncate text-xs text-[#667085]">
                  {c.role || c.roleTrack}
                  {c.validatedLevel ? ` · ${c.validatedLevel}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-[#D3E6DF] px-2.5 py-1 text-xs font-semibold text-[#008458]">
                {Math.round(c.score)}%
              </span>
              <ShortlistRowActions
                candidateId={c.userId}
                candidateName={c.fullName}
              />
            </div>

            {c.strongCompetencies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {c.strongCompetencies.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-[#EDEEF2] px-2.5 py-1 text-xs text-[#344054]"
                  >
                    <Check className="size-3 text-[#009f6a]" />
                    {s}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>{c.availabilityLabel || c.availability || "—"}</span>
              <span>Added {formatTableDate(c.dateAdded)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
