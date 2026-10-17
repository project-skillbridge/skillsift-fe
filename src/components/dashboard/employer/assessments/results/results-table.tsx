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

const HEAD =
  "px-3 py-3 text-xs font-medium uppercase tracking-wide text-[#667085]";
const CELL = "px-3 py-3 align-middle";

/** Desktop and tablet layout. Small screens use ResultsCards instead. */
export function ResultsTable({
  rows,
  selected,
  maxSelected,
  onToggle,
  onView,
}: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-190 text-left text-sm">
        <thead className="border-b border-[#EEF0F3]">
          <tr>
            <th className="w-10 px-3 py-3" />
            <th className={`${HEAD} w-14`}>Rank</th>
            <th className={HEAD}>Candidate</th>
            <th className={`${HEAD} w-44`}>Score</th>
            <th className={`${HEAD} w-32`}>Result</th>
            <th className={`${HEAD} w-28`}>Time taken</th>
            <th className={`${HEAD} w-32`}>Completed</th>
            <th className="w-32 px-3 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr
              key={s.id}
              className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#FAFAFA]"
            >
              <td className={CELL}>
                <Checkbox
                  aria-label={`Select ${candidateLabel(s)}`}
                  checked={selected.includes(s.id)}
                  disabled={
                    !selected.includes(s.id) && selected.length >= maxSelected
                  }
                  onCheckedChange={(c) => onToggle(s.id, c === true)}
                />
              </td>
              <td className={CELL}>
                <RankChip rank={s.rank} />
              </td>
              <td className={CELL}>
                <div className="flex min-w-0 flex-col items-start gap-1">
                  <span className="max-w-64 truncate font-medium text-[#151515]">
                    {candidateLabel(s)}
                  </span>
                  <CandidateSourceBadge source={s.source} />
                </div>
              </td>
              <td className={CELL}>
                <div className="flex flex-col gap-1">
                  <ScoreBar score={s.score} />
                  <span className="text-xs text-[#667085]">
                    {percentileLabel(s.percentile)}
                  </span>
                </div>
              </td>
              <td className={CELL}>
                <ResultPill passed={s.status === "pass"} />
              </td>
              <td className={`${CELL} whitespace-nowrap text-[#344054]`}>
                {formatDuration(s.timeTakenSeconds)}
              </td>
              <td className={`${CELL} whitespace-nowrap text-[#667085]`}>
                {formatRelativeTime(s.dateCompleted)}
              </td>
              <td className={`${CELL} text-right`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onView(s.id)}
                >
                  View report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
