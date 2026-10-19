"use client";

import { Check, Plus, PlusCircle } from "lucide-react";

import { buildDiscoveryCandidateTags } from "@/constants/employer-talents";
import { useSaveCandidate } from "@/hooks/api/use-employer-discovery";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { EmployerDiscoveryCandidate } from "@/types/api/employer-discovery";
import type { TalentViewMode } from "@/types/employer-talents";

import { CandidateAvatar } from "../shared/candidate-avatar";
import { VerifiedProfileTrackRecord } from "@/components/verified-report/verified-profile-track-record";
import { ScoreBadge } from "../shared/score-badge";

type TalentCardProps = {
  candidate: EmployerDiscoveryCandidate;
  view?: TalentViewMode;
};

const shortlistButtonBase = cn(
  "shrink-0 rounded-lg border border-[#D0D5DD] bg-white transition-colors",
  "text-[#0D2025] hover:bg-[#F2F4F7] disabled:cursor-not-allowed",
);
const shortlistedStyle =
  "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] hover:bg-[#ECFDF5]";

export function TalentCard({ candidate, view = "list" }: TalentCardProps) {
  const { mutate: saveCandidate, isPending: isSaving } = useSaveCandidate();

  function handleAddToShortlist(event: React.MouseEvent) {
    event.preventDefault();
    if (candidate.isSaved || isSaving) return;

    saveCandidate(candidate.userId, {
      onSuccess: () => {
        appToast.success(`${candidate.fullName} added to shortlist.`);
      },
      onError: (error) => {
        appToast.error(authFailureMessage(error));
      },
    });
  }

  const tags = buildDiscoveryCandidateTags(candidate);
  const level = candidate.seniorityBadge || candidate.validatedLevel;
  const isGrid = view === "grid";

  const shortlistIcon = candidate.isSaved ? (
    <Check className="size-4" aria-hidden />
  ) : (
    <Plus className="size-4" aria-hidden />
  );

  return (
    <div className="box-border w-full rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <ScoreBadge
            value={candidate.score}
            className={cn(
              "shrink-0 font-bold",
              isGrid
                ? "size-14 text-lg"
                : "size-14 text-lg sm:size-20 sm:text-2xl",
            )}
          />

          <CandidateAvatar
            avatarUrl={candidate.avatarUrl}
            fullName={candidate.fullName}
            className={cn(
              "shrink-0 border-3 border-white",
              isGrid
                ? "size-14 text-base"
                : "size-14 text-base sm:size-20 sm:text-xl",
            )}
          />

          <div className="flex min-w-0 flex-col gap-1 pl-0.5">
            <p
              className={cn(
                "truncate font-bold leading-normal text-[#151515]",
                isGrid ? "text-lg" : "text-lg sm:text-xl",
              )}
            >
              {candidate.fullName}
            </p>
            <div className="flex items-center gap-2 text-sm font-light text-[#151515] sm:text-base">
              <span className="truncate">{candidate.role}</span>
              {level ? (
                <>
                  <span className="size-0.75 shrink-0 rounded-full bg-[#151515]" />
                  <span className="truncate">{level}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {isGrid ? (
          <button
            type="button"
            onClick={handleAddToShortlist}
            disabled={candidate.isSaved || isSaving}
            aria-label={candidate.isSaved ? "Shortlisted" : "Add to shortlist"}
            className={cn(
              shortlistButtonBase,
              candidate.isSaved && shortlistedStyle,
              "flex size-8 items-center justify-center",
            )}
          >
            {shortlistIcon}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleAddToShortlist}
              disabled={candidate.isSaved || isSaving}
              aria-label={
                candidate.isSaved ? "Shortlisted" : "Add to shortlist"
              }
              className={cn(
                shortlistButtonBase,
                candidate.isSaved && shortlistedStyle,
                "flex size-8 items-center justify-center sm:hidden",
              )}
            >
              {shortlistIcon}
            </button>
            <button
              type="button"
              onClick={handleAddToShortlist}
              disabled={candidate.isSaved || isSaving}
              aria-label={
                candidate.isSaved ? "Shortlisted" : "Add to shortlist"
              }
              className={cn(
                shortlistButtonBase,
                candidate.isSaved && shortlistedStyle,
                "hidden items-center gap-1.5 px-3 py-2 text-sm font-medium sm:flex",
              )}
            >
              {candidate.isSaved ? "Shortlisted" : "Add to shortlist"}
              {candidate.isSaved ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <PlusCircle className="size-4" aria-hidden />
              )}
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="box-border rounded-full bg-[#F2F4F7] px-3 py-1.5 text-xs font-medium text-[#344054] sm:px-4 sm:text-sm"
          >
            {tag}
          </span>
        ))}
        <VerifiedProfileTrackRecord
          averageRating={candidate.averageHireRating}
          ratingCount={candidate.hireRatingCount}
          wouldHireAgainRate={candidate.wouldHireAgainRate}
        />
      </div>
    </div>
  );
}
