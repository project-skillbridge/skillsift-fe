"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { useSavedCandidates } from "@/hooks/api/use-employer-discovery";
import { useEmployerAssessments } from "@/hooks/api/use-employer-assessments";
import { useEmployerOffers } from "@/hooks/api/use-employer-offers";

type Stage = { label: string; value: number; color: string };

/** From assessment to hire, across everything the employer has run. */
export function HiringFunnel() {
  const assessments = useEmployerAssessments({ page: 1, limit: 100 });
  const saved = useSavedCandidates({ page: 1, limit: 1 });
  const offers = useEmployerOffers({ page: 1, limit: 100 });

  if (assessments.isLoading || saved.isLoading || offers.isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  const items = assessments.data?.assessments ?? [];
  const assessed = items.reduce((n, a) => n + (a.submissionsCount ?? 0), 0);
  const passed = items.reduce(
    (n, a) =>
      n + Math.round(((a.submissionsCount ?? 0) * (a.passRate ?? 0)) / 100),
    0,
  );
  const live = (offers.data?.offers ?? []).filter(
    (o) => o.status !== "withdrawn",
  );
  const accepted = live.filter((o) =>
    ["accepted", "interview_accepted", "hired"].includes(o.status),
  ).length;
  const hired = live.filter((o) => o.status === "hired").length;

  const stages: Stage[] = [
    { label: "Took your assessments", value: assessed, color: "#EDEEF2" },
    { label: "Passed", value: passed, color: "#D3E6DF" },
    { label: "Shortlisted", value: saved.data?.total ?? 0, color: "#F9E796" },
    { label: "Invited to interview", value: live.length, color: "#CBB0EB" },
    { label: "Accepted", value: accepted, color: "#D3E6DF" },
    { label: "Hired", value: hired, color: "#009f6a" },
  ];
  const max = Math.max(...stages.map((s) => s.value), 1);
  const empty = stages.every((s) => s.value === 0);

  // Best performing assessment by pass rate, needing a few takers to mean anything.
  const best = items
    .filter((a) => (a.submissionsCount ?? 0) >= 3 && a.passRate != null)
    .sort((a, b) => (b.passRate ?? 0) - (a.passRate ?? 0))[0];

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-sans text-lg font-semibold text-[#0D2025]">
          Your hiring funnel
        </h2>
        {best ? (
          <Link
            href={`/e/assessments/${best.id}`}
            className="text-xs text-[#667085] hover:underline"
          >
            Best performing: {best.title} · {best.passRate}% pass
          </Link>
        ) : null}
      </div>
      {empty ? (
        <p className="text-sm text-[#667085]">
          Once candidates take your assessments, you will see how many make it
          from first test to hire.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {stages.map((s, i) => {
            const prev = i > 0 ? stages[i - 1].value : 0;
            const keep =
              i > 0 && prev > 0 ? Math.round((s.value / prev) * 100) : null;
            return (
              <li key={s.label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-[#344054]">
                  {s.label}
                </span>
                <div className="h-7 flex-1 rounded-md bg-[#F7F8FA]">
                  <div
                    className="flex h-full min-w-8 items-center rounded-md px-2 text-xs font-semibold text-[#0d2025]"
                    style={{
                      width: `${Math.max((s.value / max) * 100, 4)}%`,
                      backgroundColor: s.color,
                      color: s.color === "#009f6a" ? "#fff" : undefined,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
                <span className="w-14 shrink-0 text-right text-xs text-[#667085]">
                  {keep == null ? "" : `${Math.min(keep, 100)}%`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {!empty ? (
        <p className="text-xs text-[#667085]">
          Percentages show how many moved on from the step before. Invited,
          accepted and hired count offers you have sent.
        </p>
      ) : null}
    </section>
  );
}
