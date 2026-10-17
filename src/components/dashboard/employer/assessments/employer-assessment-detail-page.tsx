"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { levelLabel, trackLabel } from "@/constants/employer-roles";
import { useEmployerAssessmentDetail } from "@/hooks/api/use-employer-assessments";
import { formatRelativeTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";

import { AssessmentInviteModal } from "./assessment-invite-modal";
import { AssessmentShareLinkModal } from "./assessment-share-link-modal";
import { AssessmentStatusBadge } from "./assessment-status-badge";

type Props = { assessmentId: string };

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#E4E7EC] p-4">
      <span className="text-sm text-[#757575]">{label}</span>
      <span className="text-lg font-semibold text-[#151515]">{value}</span>
    </div>
  );
}

export function EmployerAssessmentDetailPage({ assessmentId }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } =
    useEmployerAssessmentDetail(assessmentId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 py-8">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) notFound();

  const { assessment, questions, submissions, shareUrl, isExternal } = data;
  const passed = submissions.filter((s) => s.status === "pass").length;
  const passRate = submissions.length
    ? `${Math.round((passed / submissions.length) * 100)}%`
    : "—";
  const isActive = assessment.status === "active";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <button
        type="button"
        onClick={() => router.push("/e/assessments")}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#475467] transition-colors hover:text-[#101828]"
      >
        <ChevronLeft className="size-4" />
        Back to assessments
      </button>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-[#151515]">
              {assessment.title}
            </h1>
            <p className="text-sm text-[#757575]">
              {trackLabel(assessment.roleTrack)} ·{" "}
              {levelLabel(assessment.experienceLevel)} ·{" "}
              {isExternal ? "Shared by link" : "Sent to talent"}
            </p>
            <AssessmentStatusBadge assessment={assessment} />
          </div>
          {isActive ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(true)}
              >
                Invite more
              </Button>
              {isExternal && shareUrl ? (
                <Button type="button" onClick={() => setShareOpen(true)}>
                  Share link
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Fact label="Invited" value={String(assessment.talentsCount ?? 0)} />
          <Fact label="Completed" value={String(data.submissionsTotal)} />
          <Fact label="Pass rate" value={passRate} />
          <Fact
            label="Time limit · Pass mark"
            value={`${assessment.timeLimitMinutes} min · ${assessment.passingThreshold}%`}
          />
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#151515]">Results</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-[#757575]">
            No submissions yet. Results appear here as soon as someone finishes.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#52525B]">
                <tr>
                  <th className="py-2 font-medium">Candidate</th>
                  <th className="py-2 font-medium">Score</th>
                  <th className="py-2 font-medium">Result</th>
                  <th className="py-2 font-medium">Time taken</th>
                  <th className="py-2 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-t border-[#EEF0F3]">
                    <td className="py-3 font-medium text-[#151515]">
                      {s.candidateName || "Candidate"}
                    </td>
                    <td className="py-3">{s.score}%</td>
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
                    <td className="py-3">
                      {formatDuration(s.timeTakenSeconds)}
                    </td>
                    <td className="py-3 text-[#757575]">
                      {formatRelativeTime(s.dateCompleted)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#151515]">
          Questions ({questions.length})
        </h2>
        <ol className="flex flex-col gap-3">
          {questions.map((q, i) => (
            <li key={q.id} className="rounded-xl border border-[#EEF0F3] p-4">
              <p className="text-sm font-medium text-[#151515]">
                {i + 1}. {q.questionText}
              </p>
              {q.options?.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-[#52525B]">
                  {q.options.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <AssessmentInviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        assessmentId={assessment.id}
      />
      {shareUrl ? (
        <AssessmentShareLinkModal
          open={shareOpen}
          onOpenChange={setShareOpen}
          link={shareUrl}
        />
      ) : null}
    </div>
  );
}
