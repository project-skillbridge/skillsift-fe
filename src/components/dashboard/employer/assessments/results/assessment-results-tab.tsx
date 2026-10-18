"use client";

import { useState } from "react";
import {
  Download,
  Gauge,
  GitCompareArrows,
  Trophy,
  Users,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEmployerAssessmentResults } from "@/hooks/api/use-employer-assessments";
import type { AssessmentResultsParams } from "@/types/api/employer-assessments";

import { StatTile } from "../../shared/stat-tile";
import { CandidateCompareDialog } from "./candidate-compare-dialog";
import { CandidateReportSheet } from "./candidate-report-sheet";
import { ResultsCards } from "./results-cards";
import { ResultsTable } from "./results-table";
import { exportResultsCsv } from "./results-utils";

const MAX_COMPARE = 4;

type Props = {
  assessmentId: string;
  title: string;
  passingThreshold?: number;
};

const BUCKETS = [
  { label: "0-19", min: 0, max: 19 },
  { label: "20-39", min: 20, max: 39 },
  { label: "40-59", min: 40, max: 59 },
  { label: "60-79", min: 60, max: 79 },
  { label: "80-100", min: 80, max: 100 },
];

function ScoreSpread({
  scores,
  passingThreshold,
}: {
  scores: number[];
  passingThreshold?: number;
}) {
  const counts = BUCKETS.map(
    (b) => scores.filter((x) => x >= b.min && x <= b.max).length,
  );
  const tallest = Math.max(1, ...counts);
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-[#151515]">
          How scores are spread
        </h3>
        {passingThreshold != null ? (
          <span className="text-xs text-[#667085]">
            Pass mark {passingThreshold}%
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-5 items-end gap-3">
        {BUCKETS.map((b, i) => {
          const passing = passingThreshold != null && b.max >= passingThreshold;
          return (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-[#151515]">
                {counts[i]}
              </span>
              <div className="flex h-24 w-full items-end rounded-lg bg-[#F2F2F2]">
                <div
                  className={cn(
                    "w-full rounded-lg transition-all",
                    passing ? "bg-[#009f6a]" : "bg-[#C9CDD2]",
                  )}
                  style={{
                    height: `${counts[i] ? Math.max(8, (counts[i] / tallest) * 100) : 0}%`,
                  }}
                />
              </div>
              <span className="text-xs text-[#667085]">{b.label}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const pct = (n: number | null | undefined) => (n == null ? "—" : `${n}%`);

export function AssessmentResultsTab({
  assessmentId,
  title,
  passingThreshold,
}: Props) {
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
      <div className="grid gap-4 rounded-2xl bg-[#F2F2F2] p-4 sm:grid-cols-2">
        <StatTile
          icon={Users}
          tone="green"
          label="Completed"
          value={String(summary.total)}
          hint="Finished the test."
        />
        <StatTile
          icon={Gauge}
          tone="sand"
          label="Average score"
          value={pct(summary.averageScore)}
          hint="Across everyone."
        />
        <StatTile
          icon={Trophy}
          tone="violet"
          label="Top score"
          value={pct(summary.topScore)}
          hint="Best result so far."
        />
        <StatTile
          icon={CheckCircle2}
          tone="grey"
          label="Pass rate"
          value={pct(summary.passRate)}
          hint="Met the pass mark."
        />
      </div>

      <ScoreSpread
        scores={rows.map((r) => r.score)}
        passingThreshold={passingThreshold}
      />

      <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
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
              SkillSift talent
            </NativeSelectOption>
            <NativeSelectOption value="external">
              Link takers
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

        <ResultsTable
          rows={rows}
          selected={selected}
          maxSelected={MAX_COMPARE}
          onToggle={toggle}
          onView={setReportId}
        />
        <ResultsCards
          rows={rows}
          selected={selected}
          maxSelected={MAX_COMPARE}
          onToggle={toggle}
          onView={setReportId}
        />
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#757575]">
            No candidates match these filters.
          </p>
        ) : null}
      </section>

      {selected.length > 0 ? (
        <div className="sticky bottom-4 z-10 mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-[#0d2025] py-2 pr-2 pl-5 text-white shadow-lg">
          <span className="text-sm font-medium">
            {selected.length} selected
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelected([])}
              className="rounded-full px-3 py-1.5 text-sm text-white/80 hover:text-white"
            >
              Clear
            </button>
            <Button
              type="button"
              size="sm"
              disabled={selected.length < 2}
              onClick={() => setCompareOpen(true)}
              className="rounded-full bg-white text-[#151515] hover:bg-white/90"
            >
              <GitCompareArrows className="size-4" />
              {selected.length < 2 ? "Pick one more" : "Compare"}
            </Button>
          </div>
        </div>
      ) : null}

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
