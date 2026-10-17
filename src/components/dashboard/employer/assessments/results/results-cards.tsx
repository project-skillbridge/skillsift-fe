import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format-date";
import type { AssessmentSubmission } from "@/types/api/employer-assessments";

import { CandidateSourceBadge } from "./candidate-source-badge";
import { RankChip, ResultPill, ScoreBar } from "./results-shared";
import {
  candidateLabel,
  formatDuration,
  percentileLabel,
} from "./results-utils";

type Props = {
  rows: AssessmentSubmission[];
  selected: string[];
  maxSelected: number;
  onToggle: (id: string, checked: boolean) => void;
  onView: (id: string) => void;
};

/** Phone layout: one card per candidate instead of a cramped table. */
export function ResultsCards({
  rows,
  selected,
  maxSelected,
  onToggle,
  onView,
}: Props) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {rows.map((s) => (
        <li
          key={s.id}
          className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4"
        >
          <div className="flex items-start gap-3">
            <Checkbox
              className="mt-2"
              aria-label={`Select ${candidateLabel(s)}`}
              checked={selected.includes(s.id)}
              disabled={
                !selected.includes(s.id) && selected.length >= maxSelected
              }
              onCheckedChange={(c) => onToggle(s.id, c === true)}
            />
            <RankChip rank={s.rank} />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <span className="w-full truncate font-medium text-[#151515]">
                {candidateLabel(s)}
              </span>
              <CandidateSourceBadge source={s.source} />
            </div>
            <ResultPill passed={s.status === "pass"} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <ScoreBar score={s.score} />
            <span className="text-xs text-[#667085]">
              {percentileLabel(s.percentile)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-[#667085]">
            <span>
              {s.timeTakenSeconds == null
                ? "Time not recorded"
                : `Took ${formatDuration(s.timeTakenSeconds)}`}
            </span>
            <span>{formatRelativeTime(s.dateCompleted)}</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onView(s.id)}
          >
            View report
          </Button>
        </li>
      ))}
    </ul>
  );
}
