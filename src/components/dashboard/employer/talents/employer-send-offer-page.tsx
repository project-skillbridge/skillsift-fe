"use client";

import { educationLabel } from "@/constants/employer-roles";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { FlaskConical, Package, PencilLine } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerRole, useSendOffer } from "@/hooks/api";
import { useDiscoveryCandidateProfile } from "@/hooks/api/use-employer-discovery";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";

import { CandidateAvatar } from "../shared/candidate-avatar";
import { ConfirmSendOfferDialog } from "./edit-role-wizard/confirm-send-offer-dialog";

type EmployerSendOfferPageProps = {
  userId: string;
  roleId: string;
};

/** Compact compensation summary. Returns `null` when there's nothing to show. */
function formatCompensation(
  min: number | null,
  max: number | null,
  currency: string | null,
): string | null {
  if (min == null && max == null) return null;
  const prefix = currency ?? "";
  if (min != null && max != null) {
    return `${prefix} ${min.toLocaleString()} - ${max.toLocaleString()}`.trim();
  }
  return `${prefix} ${(min ?? max)?.toLocaleString()}`.trim();
}

export function EmployerSendOfferPage({
  userId,
  roleId,
}: EmployerSendOfferPageProps) {
  const router = useRouter();
  const { data: candidate, isPending: isCandidatePending } =
    useDiscoveryCandidateProfile(userId);
  const {
    data: role,
    isLoading: isRoleLoading,
    isError: isRoleError,
  } = useEmployerRole(roleId);
  const { mutate: sendOffer, isPending: isSubmitting } = useSendOffer();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sendScoreUpdates, setSendScoreUpdates] = useState(false);

  if (isRoleLoading) {
    return (
      <div className="mx-auto max-w-274 space-y-6 py-6 sm:py-8">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isRoleError || !role) {
    notFound();
  }

  function handleSubmitOffer() {
    sendOffer(
      { candidateIds: [userId], roleId },
      {
        onSuccess: (result) => {
          setIsConfirmOpen(false);
          // The API answers 200 even when nothing was sent (e.g. the role has
          // no pay set), so don't tell the employer it went out.
          if (result.sentCount === 0) {
            const first = result.warnings[0] as { reason?: string } | undefined;
            appToast.error(
              first?.reason
                ? `Invite not sent: ${first.reason}. Update the role and try again.`
                : "Invite not sent. Check the role details and try again.",
            );
            return;
          }
          if (result.warnings.length > 0) {
            appToast.success(
              `Interview invite sent with ${result.warnings.length} warning${
                result.warnings.length === 1 ? "" : "s"
              }.`,
            );
          } else {
            appToast.success("Interview invite sent successfully.");
          }
          router.push("/e/shortlist");
        },
        onError: (error) => {
          appToast.error(authFailureMessage(error));
        },
      },
    );
  }

  function handleViewAssessment() {
    if (!role?.assessment_id) return;
    window.open(
      `/e/assessments/${encodeURIComponent(role.assessment_id)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const compensation = formatCompensation(
    role.salary_min,
    role.salary_max,
    role.currency,
  );

  return (
    <div className="mx-auto max-w-274 space-y-6 py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <CandidateAvatar
            avatarUrl={candidate?.avatar_url ?? null}
            fullName={candidate?.full_name ?? ""}
            className="size-14 text-base"
          />
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[#151515]">
              {isCandidatePending ? "Loading…" : candidate?.full_name}
            </p>
            <div className="flex items-center gap-2 text-sm font-light tracking-[0.017em] text-[#151515]">
              <span>{candidate?.role}</span>
              {candidate?.seniority_badge ? (
                <>
                  <span className="size-0.75 shrink-0 rounded-full bg-[#151515]" />
                  <span>{candidate.seniority_badge}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="h-10 rounded-lg">
            <Link href={`/e/talents/${userId}`}>Cancel</Link>
          </Button>
          <Button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isSubmitting}
            className="h-10 rounded-lg"
          >
            Send Interview Invite
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dbdbdb] bg-white p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#ebebeb]">
              <Package className="size-7 text-[#151515]" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-[#151515]">{role.title}</p>
              <div className="flex items-center gap-2 text-sm font-light tracking-[0.017em] text-[#151515]">
                <span>{role.category}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/e/talents/${userId}/offer/${roleId}/edit`}
            className="flex items-center gap-1 font-semibold text-[#05060f] underline"
          >
            Edit this role
            <PencilLine className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-6 space-y-6 rounded-lg border border-[#dbdbdb] bg-white p-4">
          <p className="text-xl font-medium tracking-[0.02em] text-[#151515]">
            {role.title}
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {role.employment_type ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium tracking-[0.017em] text-[#757575]">
                  Employment type
                </p>
                <p className="text-base font-medium tracking-[0.017em] text-[#151515]">
                  {role.employment_type}
                </p>
              </div>
            ) : null}
            {role.work_arrangement ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium tracking-[0.017em] text-[#757575]">
                  Work arrangement
                </p>
                <p className="text-base font-medium tracking-[0.017em] text-[#151515]">
                  {role.work_arrangement}
                </p>
              </div>
            ) : null}
            {role.education ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium tracking-[0.017em] text-[#757575]">
                  Education
                </p>
                <p className="text-base font-medium tracking-[0.017em] text-[#151515]">
                  {educationLabel(role.education)}
                </p>
              </div>
            ) : null}
            {compensation ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium tracking-[0.017em] text-[#757575]">
                  Salary range
                </p>
                <p className="text-base font-medium tracking-[0.017em] text-[#151515]">
                  {compensation}
                </p>
              </div>
            ) : null}
          </div>

          {role.description ? (
            <div
              className="text-base text-[#151515]"
              dangerouslySetInnerHTML={{ __html: role.description }}
            />
          ) : null}

          {role.keywords && role.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {role.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-[#f2f4f7] px-3 py-1 text-sm text-[#344054]"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : null}

          {role.assessment_id ? (
            <div className="space-y-2">
              <p className="text-xl font-medium tracking-[0.02em] text-[#151515]">
                Assessment attached
              </p>
              <div className="flex flex-col gap-4 rounded-lg border border-[#dbdbdb] bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#10242f]">
                    <FlaskConical className="size-6 text-white" aria-hidden />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-[#151515]">
                      Practical assessment
                    </p>
                    <p className="text-base text-[#151515]">
                      Sent automatically with this offer.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleViewAssessment}
                  className="shrink-0 font-semibold text-[#05060f] underline"
                >
                  View assessment
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmSendOfferDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        candidateName={candidate?.full_name}
        scorePercentage={candidate?.score_percentage}
        sendScoreUpdates={sendScoreUpdates}
        onSendScoreUpdatesChange={setSendScoreUpdates}
        onSubmit={handleSubmitOffer}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
