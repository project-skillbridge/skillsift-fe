"use client";

import { useState } from "react";
import { Download, GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerAssessmentResults } from "@/hooks/api/use-employer-assessments";
import { formatRelativeTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { AssessmentResultsParams } from "@/types/api/employer-assessments";

import { CandidateCompareDialog } from "./candidate-compare-dialog";
import { CandidateReportSheet } from "./candidate-report-sheet";
import { CandidateSourceBadge } from "./candidate-source-badge";
import {
  candidateLabel,
  exportResultsCsv,
  formatDuration,
  percentileLabel,
} from "./results-utils";

const MAX_COMPARE = 4;

type Props = { assessmentId: string; title: string };

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#E4E7EC] p-4">
      <span className="text-sm text-[#757575]">{label}</span>
      <span className="text-lg font-semibold text-[#151515]">{value}</span>
    </div>
  );
}

const pct = (n: number | null | undefined) => (n == null ? "—" : `${n}%`);

export function AssessmentResultsTab({ assessmentId, title }: Props) {
  const [status, setStatus] = useState<"" | "pass" | "fail">("");
  const [source, setSource] = useState<"" | "talent" | "external">("");
  const [sort, setSort] = useState<"score" | "date">("score");
  const [selected, setSelected] = useState<string[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const params: AssessmentResultsParams = {
    limit: 100,
    sort,
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
  };
  const { data, isLoading } = useEmployerAssessmentResults(
    assessmentId,
    params,
  );
  const rows = data?.submissions ?? [];
  const summary = data?.summary;

  function toggle(id: string, checked: boolean) {
    setSelected((prev) =>
      checked
        ? prev.length >= MAX_COMPARE
          ? prev
          : [...prev, id]
        : prev.filter((x) => x !== id),
    );
  }

  if (isLoading) return <Skeleton className="h-72 w-full rounded-2xl" />;

  if (!summary || summary.total === 0) {
    return (
      <p className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-sm text-[#757575]">
        {data?.emptyState ??
          "No submissions yet. Results appear here as soon as someone finishes."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Completed" value={String(summary.total)} />
        <SummaryCard label="Average score" value={pct(summary.averageScore)} />
        <SummaryCard label="Top score" value={pct(summary.topScore)} />
        <SummaryCard label="Pass rate" value={pct(summary.passRate)} />
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <NativeSelect
            size="sm"
            aria-label="Filter by result"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <NativeSelectOption value="">All results</NativeSelectOption>
            <NativeSelectOption value="pass">Passed</NativeSelectOption>
            <NativeSelectOption value="fail">Not passed</NativeSelectOption>
          </NativeSelect>
          <NativeSelect
            size="sm"
            aria-label="Filter by candidate type"
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
          >
            <NativeSelectOption value="">All candidates</NativeSelectOption>
            <NativeSelectOption value="talent">
              Verified talent
            </NativeSelectOption>
            <NativeSelectOption value="external">
              Link takers (unverified)
            </NativeSelectOption>
          </NativeSelect>
          <NativeSelect
            size="sm"
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
          >
            <NativeSelectOption value="score">Highest score</NativeSelectOption>
            <NativeSelectOption value="date">Most recent</NativeSelectOption>
          </NativeSelect>
          <div className="ml-auto flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={selected.length < 2}
              onClick={() => setCompareOpen(true)}
            >
              <GitCompareArrows className="size-4" />
              Compare{selected.length ? ` (${selected.length})` : ""}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportResultsCsv(title, rows)}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <p className="text-xs text-[#757575]">
          Tick 2 to {MAX_COMPARE} candidates to compare them side by side.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#52525B]">
              <tr>
                <th className="w-8 py-2" />
                <th className="py-2 font-medium">Rank</th>
                <th className="py-2 font-medium">Candidate</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium">Versus others</th>
                <th className="py-2 font-medium">Result</th>
                <th className="py-2 font-medium">Time taken</th>
                <th className="py-2 font-medium">Completed</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-t border-[#EEF0F3]">
                  <td className="py-3">
                    <Checkbox
                      aria-label={`Select ${candidateLabel(s)}`}
                      checked={selected.includes(s.id)}
                      disabled={
                        !selected.includes(s.id) &&
                        selected.length >= MAX_COMPARE
                      }
                      onCheckedChange={(c) => toggle(s.id, c === true)}
                    />
                  </td>
                  <td className="py-3 font-semibold text-[#151515]">
                    #{s.rank}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-[#151515]">
                        {candidateLabel(s)}
                      </span>
                      <CandidateSourceBadge source={s.source} />
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EEF0F3]">
                        <div
                          className="h-full rounded-full bg-[#059669]"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <span className="font-medium">{s.score}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#52525B]">
                    {percentileLabel(s.percentile)}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold",
                        s.status === "pass"
                          ? "bg-[#D1FAE5] text-[#065F46]"
                          : "bg-[#FEE2E2] text-[#991B1B]",
                      )}
                    >
                      {s.status === "pass" ? "Passed" : "Not passed"}
                    </span>
                  </td>
                  <td className="py-3">{formatDuration(s.timeTakenSeconds)}</td>
                  <td className="py-3 text-[#757575]">
                    {formatRelativeTime(s.dateCompleted)}
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReportId(s.id)}
                    >
                      View report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#757575]">
              No candidates match these filters.
            </p>
          ) : null}
        </div>
      </section>

      <CandidateReportSheet
        assessmentId={assessmentId}
        submissionId={reportId}
        onClose={() => setReportId(null)}
      />
      <CandidateCompareDialog
        assessmentId={assessmentId}
        submissionIds={selected}
        open={compareOpen}
        onOpenChange={setCompareOpen}
      />
    </div>
  );
}
