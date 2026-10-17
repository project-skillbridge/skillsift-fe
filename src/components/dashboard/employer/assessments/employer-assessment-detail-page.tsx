"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { levelLabel, trackLabel } from "@/constants/employer-roles";
import {
  useEmployerAssessmentDetail,
  useEmployerAssessmentResults,
} from "@/hooks/api/use-employer-assessments";

import { AssessmentInviteModal } from "./assessment-invite-modal";
import { AssessmentShareLinkModal } from "./assessment-share-link-modal";
import { AssessmentStatusBadge } from "./assessment-status-badge";
import { AssessmentResultsTab } from "./results/assessment-results-tab";

type Props = { assessmentId: string };

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-[#F8FAFC] p-4">
      <span className="text-xs font-medium tracking-wide text-[#667085] uppercase">
        {label}
      </span>
      <span className="text-xl font-semibold text-[#0B1220]">{value}</span>
    </div>
  );
}

export function EmployerAssessmentDetailPage({ assessmentId }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } =
    useEmployerAssessmentDetail(assessmentId);
  const { data: results } = useEmployerAssessmentResults(assessmentId, {
    limit: 1,
  });
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

  const { assessment, questions, shareUrl, isExternal } = data;
  const summary = results?.summary;
  const passRate = summary?.passRate == null ? "—" : `${summary.passRate}%`;
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

      <div className="flex flex-col gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-[#0B1220]">
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
          {isExternal ? null : (
            <Fact
              label="Invited"
              value={String(assessment.talentsCount ?? 0)}
            />
          )}
          <Fact label="Completed" value={String(summary?.total ?? 0)} />
          <Fact label="Pass rate" value={passRate} />
          <Fact
            label="Time limit · Pass mark"
            value={`${assessment.timeLimitMinutes} min · ${assessment.passingThreshold}%`}
          />
        </div>
      </div>

      <Tabs defaultValue="candidates">
        <TabsList>
          <TabsTrigger value="candidates">
            Candidates ({summary?.total ?? data.submissionsTotal})
          </TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({questions.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="candidates" className="mt-4">
          <AssessmentResultsTab
            assessmentId={assessment.id}
            title={assessment.title}
          />
        </TabsContent>
        <TabsContent value="questions" className="mt-4">
          <section className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <ol className="flex flex-col gap-3">
              {questions.map((q, i) => (
                <li
                  key={q.id}
                  className="rounded-xl border border-[#EEF0F3] p-4"
                >
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
        </TabsContent>
      </Tabs>

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
