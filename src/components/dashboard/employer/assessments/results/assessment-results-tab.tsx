"use client";

import { useState } from "react";
import { Download, GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerAssessmentResults } from "@/hooks/api/use-employer-assessments";
import type { AssessmentResultsParams } from "@/types/api/employer-assessments";

import { CandidateCompareDialog } from "./candidate-compare-dialog";
import { CandidateReportSheet } from "./candidate-report-sheet";
import { ResultsCards } from "./results-cards";
import { ResultsTable } from "./results-table";
import { exportResultsCsv } from "./results-utils";

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
