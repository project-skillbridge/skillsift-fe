"use client";

import { useState } from "react";
import { Check, Clock, Crown, X } from "lucide-react";
import { useQueries } from "@tanstack/react-query";

import { getEmployerAssessmentResultDetail } from "@/actions/employer-assessments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { employerAssessmentsKeys } from "@/hooks/api/keys";
import { cn } from "@/lib/utils";

import { CandidateSourceBadge } from "./candidate-source-badge";
import { CandidateAvatar, IntegrityBadge, ResultPill } from "./results-shared";
import {
  candidateLabel,
  formatDuration,
  percentileLabel,
} from "./results-utils";

type Props = {
  assessmentId: string;
  submissionIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LABEL_COL = "w-44 min-w-36 py-3 pr-4 text-sm text-[#667085]";

export function CandidateCompareDialog({
  assessmentId,
  submissionIds,
  open,
  onOpenChange,
}: Props) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const queries = useQueries({
    queries: submissionIds.map((id) => ({
      queryKey: [
        ...employerAssessmentsKeys.results(assessmentId),
        "detail",
        id,
      ],
      queryFn: () => getEmployerAssessmentResultDetail(assessmentId, id),
      enabled: open,
    })),
  });
  const loading = queries.some((q) => q.isLoading);
  const reports = queries.flatMap((q) => (q.data ? [q.data] : []));
  const questions = reports[0]?.questions ?? [];

  const bestScore = Math.max(0, ...reports.map((r) => r.score));
  const times = reports.flatMap((r) =>
    r.timeTakenSeconds == null ? [] : [r.timeTakenSeconds],
  );
  const fastest = times.length > 1 ? Math.min(...times) : null;
  const leaders = reports.filter((r) => r.score === bestScore);

  const rows = questions.map((q, i) => {
    const answers = reports.map(
      (r) => r.questions.find((x) => x.questionId === q.questionId)?.isCorrect,
    );
    return {
      q,
      number: i + 1,
      answers,
      differs: new Set(answers.map(Boolean)).size > 1,
    };
  });
  const shownRows = onlyDifferences ? rows.filter((r) => r.differs) : rows;
  const differCount = rows.filter((r) => r.differs).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Compare candidates</DialogTitle>
          <DialogDescription>
            {leaders.length === 1 && reports.length > 1
              ? `${candidateLabel(leaders[0])} leads with ${bestScore}%. Same questions, side by side.`
              : "Same questions, side by side. The best result in each row is highlighted."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Skeleton className="h-80 w-full rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead>
                <tr className="align-bottom">
                  <th className={LABEL_COL} />
                  {reports.map((r) => (
                    <th
                      key={r.id}
                      className="min-w-44 px-2 pt-4 pb-4 align-top font-normal"
                    >
                      <div
                        className={cn(
                          "relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center",
                          r.score === bestScore
                            ? "border-[#009f6a] bg-[#F3F8F6]"
                            : "border-[#E4E7EC] bg-white",
                        )}
                      >
                        {r.score === bestScore && reports.length > 1 ? (
                          <span className="absolute -top-3 inline-flex items-center gap-1 rounded-full bg-[#009f6a] px-2.5 py-0.5 text-xs font-semibold text-white">
                            <Crown className="size-3" aria-hidden />
                            Top score
                          </span>
                        ) : null}
                        <CandidateAvatar
                          name={candidateLabel(r)}
                          className="size-12 text-base"
                        />
                        <div className="flex min-w-0 flex-col items-center gap-1">
                          <p className="max-w-40 truncate text-sm font-semibold text-[#151515]">
                            {candidateLabel(r)}
                          </p>
                          <CandidateSourceBadge
                            source={r.source}
                            joined={!!r.joinedSkillsiftUserId}
                          />
                        </div>
                        <p className="text-4xl font-bold tracking-tight text-[#151515]">
                          {r.score}%
                        </p>
                        <ResultPill passed={r.status === "pass"} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <Row label="Rank">
                  {reports.map((r) => (
                    <Cell key={r.id}>
                      #{r.rank}
                      <span className="block text-xs font-normal text-[#667085]">
                        {percentileLabel(r.percentile)}
                      </span>
                    </Cell>
                  ))}
                </Row>
                <Row label="Correct answers">
                  {reports.map((r) => (
                    <Cell
                      key={r.id}
                      best={
                        r.correctCount ===
                        Math.max(...reports.map((x) => x.correctCount))
                      }
                    >
                      {r.correctCount} of {r.questionCount}
                    </Cell>
                  ))}
                </Row>
                <Row label="Time taken">
                  {reports.map((r) => (
                    <Cell
                      key={r.id}
                      best={fastest != null && r.timeTakenSeconds === fastest}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Clock
                          className="size-3.5 text-[#667085]"
                          aria-hidden
                        />
                        {formatDuration(r.timeTakenSeconds)}
                      </span>
                    </Cell>
                  ))}
                </Row>
                <Row label="Test integrity">
                  {reports.map((r) => (
                    <Cell key={r.id}>
                      <IntegrityBadge level={r.integrityLevel} />
                    </Cell>
                  ))}
                </Row>

                <tr>
                  <td colSpan={reports.length + 1} className="pt-6 pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#151515]">
                        Question by question
                      </h3>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#344054]">
                        <input
                          type="checkbox"
                          className="size-4 accent-[#0d2025]"
                          checked={onlyDifferences}
                          onChange={(e) => setOnlyDifferences(e.target.checked)}
                        />
                        Only where they differ ({differCount})
                      </label>
                    </div>
                  </td>
                </tr>
                {shownRows.map(({ q, number, answers, differs }) => (
                  <tr
                    key={q.questionId}
                    className={cn(
                      "border-t border-[#F2F4F7]",
                      differs && "bg-[#FFFBEB]",
                    )}
                  >
                    <td className="max-w-56 py-3 pr-4 text-xs text-[#344054]">
                      {number}. {q.questionText}
                    </td>
                    {answers.map((ok, idx) => (
                      <td key={reports[idx].id} className="px-2 py-3">
                        <span
                          className={cn(
                            "mx-auto flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                            ok
                              ? "bg-[#D3E6DF] text-[#0E7A55]"
                              : "bg-[#FDE2E7] text-[#BE123C]",
                          )}
                        >
                          {ok ? (
                            <Check className="size-3" aria-hidden />
                          ) : (
                            <X className="size-3" aria-hidden />
                          )}
                          {ok ? "Correct" : "Wrong"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {shownRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={reports.length + 1}
                      className="py-6 text-center text-sm text-[#667085]"
                    >
                      They answered every question the same way.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-t border-[#F2F4F7]">
      <td className={LABEL_COL}>{label}</td>
      {children}
    </tr>
  );
}

function Cell({
  children,
  best,
}: {
  children: React.ReactNode;
  best?: boolean;
}) {
  return (
    <td className="px-2 py-3 text-center">
      <span
        className={cn(
          "inline-block rounded-lg px-3 py-1 font-semibold text-[#151515]",
          best && "bg-[#D3E6DF] text-[#0E7A55]",
        )}
      >
        {children}
      </span>
    </td>
  );
}
