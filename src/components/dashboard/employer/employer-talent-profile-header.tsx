"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarPlus,
  Check,
  ChevronLeft,
  Clock,
  Link2,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMarkOfferHired, useWithdrawOffer } from "@/hooks/api";
import {
  useRemoveCandidate,
  useSaveCandidate,
} from "@/hooks/api/use-employer-discovery";
import { useAddInterviewLink } from "@/hooks/api/use-employer-offers";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type { EmployerDiscoveryCandidateProfile } from "@/types/api/employer-discovery";

import { AddInterviewLinkDialog } from "./pipeline/add-interview-link-dialog";
import { RateHireDialog } from "./shortlist/rate-hire-dialog";
import { SendOfferTrigger } from "./talents/send-offer-trigger";

type Props = {
  userId: string;
  isSaved: boolean;
  /** Full profile, when loaded; drives the stage-aware actions. */
  profile?: EmployerDiscoveryCandidateProfile;
};

type Stage = "none" | "invited" | "accepted" | "hired" | "closed";

function stageOf(profile?: EmployerDiscoveryCandidateProfile): Stage {
  const p = profile?.pipeline;
  if (!p) return "none";
  if (p.status === "pending") return "invited";
  if (p.status === "accepted") return p.hired ? "hired" : "accepted";
  return "closed";
}

const CLOSED_LABEL = {
  declined: "Declined your invite",
  expired: "Invite expired",
  withdrawn: "Invite withdrawn",
} as const;

/** Opens Google Calendar with the interview details filled in. No sign-in needed on our side. */
function calendarUrl(profile: EmployerDiscoveryCandidateProfile): string {
  const p = profile.pipeline;
  const name = profile.full_name.split(" ")[0] || "candidate";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Interview: ${name}${p ? ` for ${p.roleTitle}` : ""}`,
    details: p?.interviewLink
      ? `Join here: ${p.interviewLink}\n\nScheduled through SkillSift.`
      : "Scheduled through SkillSift.",
  });
  if (profile.isUnlocked && profile.email) params.set("add", profile.email);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function StageChip({
  stage,
  profile,
}: {
  stage: Stage;
  profile?: Props["profile"];
}) {
  const p = profile?.pipeline;
  if (!p || stage === "none") return null;
  const map = {
    invited: {
      icon: Clock,
      text: `Invited for ${p.roleTitle}. Waiting for a reply`,
      cls: "bg-[#F9E796] text-[#6b5400]",
    },
    accepted: {
      icon: UserCheck,
      text: `Accepted your invite for ${p.roleTitle}`,
      cls: "bg-[#D3E6DF] text-[#0E7A55]",
    },
    hired: {
      icon: BadgeCheck,
      text: `Hired for ${p.roleTitle}`,
      cls: "bg-[#009f6a] text-white",
    },
    closed: {
      icon: XCircle,
      text:
        p.status === "declined" ||
        p.status === "expired" ||
        p.status === "withdrawn"
          ? `${CLOSED_LABEL[p.status]} (${p.roleTitle})`
          : "Invite closed",
      cls: "bg-[#EDEEF2] text-[#344054]",
    },
  } as const;
  const { icon: Icon, text, cls } = map[stage];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${cls}`}
    >
      <Icon className="size-4" aria-hidden />
      {text}
    </span>
  );
}

export function EmployerTalentProfileHeader({
  userId,
  isSaved,
  profile,
}: Props) {
  const router = useRouter();
  const stage = stageOf(profile);
  const pipeline = profile?.pipeline ?? null;
  const name = profile?.full_name.split(" ")[0] || "this talent";

  const { mutate: saveCandidate, isPending: isSaving } = useSaveCandidate();
  const { mutate: removeCandidate, isPending: isRemoving } =
    useRemoveCandidate();
  const { mutate: markHired, isPending: isMarking } = useMarkOfferHired();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawOffer();
  const { mutate: addLink, isPending: isAddingLink } = useAddInterviewLink();

  const [confirm, setConfirm] = useState<"hire" | "withdraw" | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);

  function toggleShortlist() {
    if (isSaving || isRemoving) return;
    if (isSaved) {
      removeCandidate(userId, {
        onSuccess: () => appToast.success("Removed from shortlist."),
        onError: (e) => appToast.error(authFailureMessage(e)),
      });
      return;
    }
    saveCandidate(userId, {
      onSuccess: () => appToast.success("Added to shortlist."),
      onError: (e) => appToast.error(authFailureMessage(e)),
    });
  }

  function runConfirm() {
    if (!pipeline || !confirm) return;
    const done = {
      onSuccess: () => {
        setConfirm(null);
        appToast.success(
          confirm === "hire" ? "Marked as hired." : "Invite withdrawn.",
        );
      },
      onError: (e: unknown) => appToast.error(authFailureMessage(e)),
    };
    if (confirm === "hire") markHired(pipeline.offerId, done);
    else withdraw(pipeline.offerId, done);
  }

  const busy = isMarking || isWithdrawing;

  return (
    <div className="flex w-full flex-col gap-3 border-b border-[#EBEBEB] pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {stage === "none" ? (
          <Link
            href="/e/talents"
            className="flex items-center gap-x-2 font-medium text-[#757575] transition-colors hover:text-[#151515]"
          >
            <ChevronLeft size={20} />
            Back to Talents
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-x-2 font-semibold text-[#05060f] underline transition-colors hover:text-[#151515]"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {stage === "none" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={toggleShortlist}
                disabled={isSaving || isRemoving}
                className="h-10 rounded-lg border-[#05060F] font-semibold"
              >
                {isSaved ? (
                  <>
                    <Check className="mr-1.5 size-4 text-[#009f6a]" />
                    Shortlisted
                  </>
                ) : (
                  "Add to Shortlist"
                )}
              </Button>
              <SendOfferTrigger userId={userId} />
            </>
          ) : null}

          {stage === "invited" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg"
                onClick={() => setLinkOpen(true)}
              >
                <Link2 className="mr-1.5 size-4" />
                {pipeline?.interviewLink
                  ? "Change meeting link"
                  : "Add meeting link"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg text-[#B42318]"
                onClick={() => setConfirm("withdraw")}
              >
                Withdraw invite
              </Button>
            </>
          ) : null}

          {stage === "accepted" && profile ? (
            <>
              <Button asChild variant="outline" className="h-10 rounded-lg">
                <a
                  href={calendarUrl(profile)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarPlus className="mr-1.5 size-4" />
                  Schedule interview
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg"
                onClick={() => setLinkOpen(true)}
              >
                <Link2 className="mr-1.5 size-4" />
                {pipeline?.interviewLink
                  ? "Change meeting link"
                  : "Add meeting link"}
              </Button>
              <Button
                type="button"
                className="h-10 rounded-lg bg-[#05060F] text-white hover:bg-[#151515]/90"
                onClick={() => setConfirm("hire")}
              >
                Mark as hired
              </Button>
            </>
          ) : null}

          {stage === "hired" ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg"
              onClick={() => setRateOpen(true)}
            >
              <Star className="mr-1.5 size-4" />
              Rate this hire
            </Button>
          ) : null}

          {stage === "closed" ? (
            <SendOfferTrigger userId={userId} label="Invite again" />
          ) : null}

          {stage !== "none" ? (
            <Button asChild variant="ghost" className="h-10 rounded-lg">
              <Link href="/e/shortlist?tab=offers">All invites</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StageChip stage={stage} profile={profile} />
        {stage === "invited" || stage === "accepted" ? (
          pipeline?.interviewLink ? (
            <a
              href={pipeline.interviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#344054] underline underline-offset-2"
            >
              Meeting link
            </a>
          ) : (
            <span className="text-sm text-[#667085]">
              No meeting link yet. Add one so {name} knows where to join.
            </span>
          )
        ) : null}
      </div>

      <Dialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!busy && !open) setConfirm(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirm === "hire" ? "Mark as hired?" : "Withdraw invite?"}
            </DialogTitle>
            <DialogDescription>
              {confirm === "hire"
                ? `Confirm you hired ${name}. This updates your hiring record and can't be undone.`
                : `${name} will be told the invite was withdrawn. You can't re-send it for the same role.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={runConfirm}
              disabled={busy}
              className={
                confirm === "withdraw"
                  ? "bg-[#B42318] text-white hover:bg-[#B42318]/90"
                  : undefined
              }
            >
              {busy
                ? "Working…"
                : confirm === "hire"
                  ? "Mark as hired"
                  : "Withdraw invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddInterviewLinkDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        candidateName={name}
        isSubmitting={isAddingLink}
        onSubmit={(link) => {
          if (!pipeline) return;
          addLink(
            { offerId: pipeline.offerId, link },
            {
              onSuccess: () => {
                setLinkOpen(false);
                appToast.success("Meeting link saved.");
              },
              onError: (e) => appToast.error(authFailureMessage(e)),
            },
          );
        }}
      />

      {pipeline ? (
        <RateHireDialog
          open={rateOpen}
          onOpenChange={setRateOpen}
          offerId={pipeline.offerId}
          candidateName={name}
        />
      ) : null}
    </div>
  );
}
