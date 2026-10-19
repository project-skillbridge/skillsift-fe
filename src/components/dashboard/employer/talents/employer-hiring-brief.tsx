"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useHiringBrief } from "@/hooks/api/use-employer-discovery";
import { cn } from "@/lib/utils";
import type {
  EmployerHiringBrief,
  EmployerHiringBriefStats,
  HiringBriefSource,
} from "@/types/api/employer-discovery";

const SOURCE_LABEL: Record<HiringBriefSource, string> = {
  skills: "Skills test",
  job_ready: "Job readiness",
  open_ended: "Written answer",
};

const SEVERITY_STYLE = {
  minor: "bg-[#EDEEF2] text-[#344054]",
  moderate: "bg-[#FFF0D1] text-[#B45309]",
  significant: "bg-[#FDE2E7] text-[#BE123C]",
} as const;

const QUALITY_STYLE = {
  strong: "bg-[#D3E6DF] text-[#0E7A55]",
  solid: "bg-[#EDEEF2] text-[#344054]",
  basic: "bg-[#FFF0D1] text-[#B45309]",
  weak: "bg-[#FDE2E7] text-[#BE123C]",
} as const;

function SourceChip({ source }: { source: HiringBriefSource }) {
  return (
    <span className="rounded-full bg-[#F2F2F2] px-2 py-0.5 text-xs font-medium text-[#475467]">
      {SOURCE_LABEL[source]}
    </span>
  );
}

const PREVIEW_ROWS = 6;

/** Shows the strongest and weakest few; the full list is one click away. */
function previewRows<T extends { score: number }>(rows: T[]): T[] {
  if (rows.length <= PREVIEW_ROWS) return rows;
  const half = PREVIEW_ROWS / 2;
  return [...rows.slice(0, half), ...rows.slice(-half)];
}

function CompetencyBars({ stats }: { stats: EmployerHiringBriefStats }) {
  const [showAll, setShowAll] = useState(false);
  const groups = [
    { key: "skill", title: "Skills test" },
    { key: "job_ready", title: "Job readiness" },
  ] as const;
  const shown = groups
    .map((g) => ({
      ...g,
      rows: stats.competencies.filter((c) => c.assessment === g.key),
    }))
    .filter((g) => g.rows.length > 0);
  if (shown.length === 0) return null;
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <h3 className="text-base font-semibold text-[#151515]">
        Where they scored
      </h3>
      <div className="flex flex-col gap-6">
        {shown.map((g) => (
          <div key={g.key} className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wide text-[#667085] uppercase">
              {g.title}
            </p>
            <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
              {(showAll ? g.rows : previewRows(g.rows)).map((c) => (
                <div key={c.name} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-[#151515] first-letter:uppercase">
                      {c.name}
                    </span>
                    <span className="shrink-0 font-semibold text-[#151515]">
                      {c.score}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#EDEEF2]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        c.score >= 70
                          ? "bg-[#009f6a]"
                          : c.score >= 50
                            ? "bg-[#F59E0B]"
                            : "bg-[#E5484D]",
                      )}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {shown.some((g) => g.rows.length > PREVIEW_ROWS) ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="w-fit text-sm font-semibold text-[#151515] underline underline-offset-4"
        >
          {showAll ? "Show fewer" : "Show all scores"}
        </button>
      ) : null}
    </section>
  );
}

function BriefBody({
  brief,
  stats,
}: {
  brief: EmployerHiringBrief;
  stats: EmployerHiringBriefStats;
}) {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-5 rounded-2xl bg-[#dfe4e2] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#151515]">
            <Sparkles className="size-3.5" aria-hidden />
            AI hiring brief
          </span>
          <span className="text-xs text-[#475467]">
            Written from their actual answers in the skills and job-readiness
            assessments
          </span>
        </div>
        <p className="max-w-3xl text-base text-[#151515]">{brief.hire_case}</p>
        <p className="text-xs text-[#475467]">{brief.confidence_note}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
          <h3 className="text-base font-semibold text-[#151515]">
            Why they stand out
          </h3>
          {brief.strengths.length === 0 ? (
            <p className="text-sm text-[#667085]">
              No clear strengths stood out from the results.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {brief.strengths.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-[#009f6a]"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#151515]">
                        {s.title}
                      </p>
                      <SourceChip source={s.source} />
                    </div>
                    <p className="text-sm text-[#475467]">{s.evidence}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
          <h3 className="text-base font-semibold text-[#151515]">
            What to check in the interview
          </h3>
          {brief.gaps.length === 0 ? (
            <p className="text-sm text-[#667085]">
              No meaningful gaps showed up in the results.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {brief.gaps.map((g) => (
                <li key={g.title} className="flex gap-3">
                  <AlertTriangle
                    className="mt-0.5 size-5 shrink-0 text-[#B45309]"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#151515]">
                        {g.title}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          SEVERITY_STYLE[g.severity],
                        )}
                      >
                        {g.severity}
                      </span>
                      <SourceChip source={g.source} />
                    </div>
                    <p className="text-sm text-[#475467]">{g.evidence}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <CompetencyBars stats={stats} />

      {brief.open_ended.length > 0 ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-[#151515]">
              How they think in their own words
            </h3>
            <span className="text-xs text-[#667085]">
              {stats.open_answers_reviewed} written answer
              {stats.open_answers_reviewed === 1 ? "" : "s"} reviewed
            </span>
          </div>
          <ul className="flex flex-col divide-y divide-[#EEF0F3]">
            {brief.open_ended.map((o) => (
              <li
                key={o.topic}
                className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#151515]">
                    {o.topic}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      QUALITY_STYLE[o.quality],
                    )}
                  >
                    {o.quality}
                  </span>
                </div>
                <p className="text-sm text-[#475467]">{o.takeaway}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#151515]">
          <MessageSquareQuote className="size-5" aria-hidden />
          Questions to ask them
        </h3>
        <ol className="flex flex-col gap-3">
          {brief.interview_questions.map((q, i) => (
            <li key={q} className="flex gap-3 text-sm text-[#151515]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-xs font-semibold">
                {i + 1}
              </span>
              {q}
            </li>
          ))}
        </ol>
      </section>

      <p className="text-xs text-[#667085]">
        This brief is AI-generated from assessment results and written answers.
        Use it to decide who to interview, then confirm in conversation.
      </p>
    </div>
  );
}

/** Why-hire section on the employer's candidate page. */
export function EmployerHiringBrief({ userId }: { userId: string }) {
  const { data, isPending, isError, refetch } = useHiringBrief(userId);

  if (isPending || data?.status === "generating") {
    return (
      <section
        aria-busy
        className="flex flex-col gap-4 rounded-2xl bg-[#dfe4e2] p-6 sm:p-8"
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#151515]">
          <Sparkles className="size-3.5 animate-pulse" aria-hidden />
          Writing the hiring brief
        </span>
        <Skeleton className="h-7 w-2/3 bg-white/60" />
        <Skeleton className="h-4 w-full bg-white/60" />
        <Skeleton className="h-4 w-4/5 bg-white/60" />
        <p className="text-sm text-[#475467]">
          Reading how they answered each question. This takes a few seconds the
          first time.
        </p>
      </section>
    );
  }

  if (isError || data?.status === "unavailable") {
    return (
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-5">
        <p className="text-sm text-[#475467]">
          The hiring brief isn&apos;t available right now. Their scores below
          are still accurate.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-[#151515] underline underline-offset-4"
        >
          Try again
        </button>
      </section>
    );
  }

  if (data?.status !== "ready") return null;
  return <BriefBody brief={data.brief} stats={data.stats} />;
}
