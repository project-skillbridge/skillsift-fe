"use client";

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

export function CandidateCompareDialog({
  assessmentId,
  submissionIds,
  open,
  onOpenChange,
}: Props) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare candidates</DialogTitle>
          <DialogDescription>
            Side by side on the same questions. The highest score is
            highlighted.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EEF0F3]">
                  <th className="py-2 pr-4 font-medium text-[#52525B]" />
                  {reports.map((r) => (
                    <th key={r.id} className="px-3 py-2 font-semibold">
                      {candidateLabel(r)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#EEF0F3]">
                  <td className="py-3 pr-4 text-[#757575]">Score</td>
                  {reports.map((r) => (
                    <td
                      key={r.id}
                      className={cn(
                        "px-3 py-3 font-semibold",
                        r.score === bestScore && "text-[#059669]",
                      )}
                    >
                      {r.score}%
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#EEF0F3]">
                  <td className="py-3 pr-4 text-[#757575]">Rank</td>
                  {reports.map((r) => (
                    <td key={r.id} className="px-3 py-3">
                      #{r.rank} · {percentileLabel(r.percentile)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#EEF0F3]">
                  <td className="py-3 pr-4 text-[#757575]">Correct answers</td>
                  {reports.map((r) => (
                    <td key={r.id} className="px-3 py-3">
                      {r.correctCount} of {r.questionCount}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#EEF0F3]">
                  <td className="py-3 pr-4 text-[#757575]">Time taken</td>
                  {reports.map((r) => (
                    <td key={r.id} className="px-3 py-3">
                      {formatDuration(r.timeTakenSeconds)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#EEF0F3]">
                  <td className="py-3 pr-4 text-[#757575]">Identity</td>
                  {reports.map((r) => (
                    <td key={r.id} className="px-3 py-3">
                      {r.source === "talent" ? "Verified" : "Unverified"}
                    </td>
                  ))}
                </tr>
                {questions.map((q, i) => (
                  <tr key={q.questionId} className="border-b border-[#F4F5F7]">
                    <td className="max-w-56 py-2 pr-4 text-xs text-[#52525B]">
                      {i + 1}. {q.questionText}
                    </td>
                    {reports.map((r) => {
                      const answer = r.questions.find(
                        (x) => x.questionId === q.questionId,
                      );
                      return (
                        <td
                          key={r.id}
                          className={cn(
                            "px-3 py-2 text-xs",
                            answer?.isCorrect
                              ? "text-[#065F46]"
                              : "text-[#991B1B]",
                          )}
                        >
                          {answer?.isCorrect ? "Correct" : "Wrong"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
