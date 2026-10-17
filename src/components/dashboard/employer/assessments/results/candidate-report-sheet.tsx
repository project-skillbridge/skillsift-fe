"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEmployerAssessmentResultDetail } from "@/hooks/api/use-employer-assessments";
import { cn } from "@/lib/utils";

import { CandidateSourceBadge } from "./candidate-source-badge";
import {
  candidateLabel,
  formatDuration,
  percentileLabel,
} from "./results-utils";

type Props = {
  assessmentId: string;
  submissionId: string | null;
  onClose: () => void;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] p-3">
      <p className="text-xs text-[#757575]">{label}</p>
      <p className="text-base font-semibold text-[#151515]">{value}</p>
    </div>
  );
}

export function CandidateReportSheet({
  assessmentId,
  submissionId,
  onClose,
}: Props) {
  const { data, isLoading, isError } = useEmployerAssessmentResultDetail(
    assessmentId,
    submissionId,
  );

  return (
    <Sheet open={!!submissionId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {data ? candidateLabel(data) : "Candidate report"}
          </SheetTitle>
          <SheetDescription>
            {data ? `Ranked #${data.rank}` : "Loading the full report"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </>
          ) : isError || !data ? (
            <p className="text-sm text-[#757575]">
              Couldn&apos;t load this report. Close it and try again.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CandidateSourceBadge source={data.source} />
                {data.source === "external" ? (
                  <span className="text-xs text-[#757575]">
                    Took the test by link, identity not verified. Ask them to
                    join SkillSift to get verified.
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Score" value={`${data.score}%`} />
                <Stat
                  label="Result"
                  value={data.status === "pass" ? "Passed" : "Not passed"}
                />
                <Stat
                  label="Correct answers"
                  value={`${data.correctCount} of ${data.questionCount}`}
                />
                <Stat
                  label="Versus others"
                  value={percentileLabel(data.percentile)}
                />
                <Stat
                  label="Time taken"
                  value={formatDuration(data.timeTakenSeconds)}
                />
              </div>

              <ol className="flex flex-col gap-3">
                {data.questions.map((q, i) => (
                  <li
                    key={q.questionId}
                    className={cn(
                      "rounded-xl border p-4",
                      q.isCorrect
                        ? "border-[#A7F3D0] bg-[#F0FDF9]"
                        : "border-[#FECACA] bg-[#FEF8F8]",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {q.isCorrect ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#059669]" />
                      ) : (
                        <XCircle className="mt-0.5 size-4 shrink-0 text-[#DC2626]" />
                      )}
                      <p className="text-sm font-medium text-[#151515]">
                        {i + 1}. {q.questionText}
                      </p>
                    </div>
                    <dl className="mt-2 space-y-1 pl-6 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-[#757575]">Their answer:</dt>
                        <dd className="text-[#151515]">
                          {q.givenAnswer ?? "No answer"}
                        </dd>
                      </div>
                      {!q.isCorrect ? (
                        <div className="flex gap-2">
                          <dt className="text-[#757575]">Correct answer:</dt>
                          <dd className="text-[#151515]">{q.correctAnswer}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
