"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarkOfferHired, useWithdrawOffer } from "@/hooks/api";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type {
  EmployerOfferListItem,
  EmployerOfferStatus,
} from "@/types/api/employer-offers";
import { useAddInterviewLink } from "@/hooks/api/use-employer-offers";
import { AddInterviewLinkDialog } from "@/components/dashboard/employer/pipeline/add-interview-link-dialog";
import { RateHireDialog } from "./rate-hire-dialog";

type OffersRowActionsProps = {
  offer: EmployerOfferListItem;
};

type ConfirmKind = "mark-hired" | "withdraw" | null;

const CONFIRM_COPY: Record<
  Exclude<ConfirmKind, null>,
  {
    title: string;
    description: (name: string) => string;
    actionLabel: string;
    pendingLabel: string;
    successLabel: string;
    destructive?: boolean;
  }
> = {
  "mark-hired": {
    title: "Mark candidate as hired?",
    description: (name) =>
      `Marking the offer to ${name} as hired closes out this hire and updates the candidate's record. You can't undo this.`,
    actionLabel: "Mark as hired",
    pendingLabel: "Marking…",
    successLabel: "Marked as hired.",
  },
  withdraw: {
    title: "Withdraw offer?",
    description: (name) =>
      `Withdrawing will revoke the offer to ${name}. They'll be notified, and the offer can't be re-sent for the same role.`,
    actionLabel: "Withdraw offer",
    pendingLabel: "Withdrawing…",
    successLabel: "Invite withdrawn.",
    destructive: true,
  },
};

/** Status → which mutating actions are available. Keeps the dropdown menu
 *  context-aware so we never show "Mark as hired" on a pending offer. */
function actionsForStatus(status: EmployerOfferStatus): {
  canMarkHired: boolean;
  canWithdraw: boolean;
  canAddInterviewLink: boolean;
} {
  return {
    canMarkHired: status === "accepted" || status === "interview_accepted",
    canWithdraw: status === "pending" || status === "interview_invited",
    canAddInterviewLink: status === "interview_accepted",
  };
}

export function OffersRowActions({ offer }: OffersRowActionsProps) {
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);

  const { mutate: markHired, isPending: isMarking } = useMarkOfferHired();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawOffer();
  const { mutate: addInterviewLink, isPending: isAddingLink } =
    useAddInterviewLink();

  const { canMarkHired, canWithdraw, canAddInterviewLink } = actionsForStatus(
    offer.status,
  );
  const canRateHire = offer.status === "hired" && offer.pendingHireFeedback;
  const isSubmitting = isMarking || isWithdrawing || isAddingLink;

  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isRateHireOpen, setIsRateHireOpen] = useState(false);

  function handleConfirm() {
    if (!confirmKind) return;
    const copy = CONFIRM_COPY[confirmKind];
    const mutate = confirmKind === "mark-hired" ? markHired : withdraw;

    mutate(offer.offerId, {
      onSuccess: () => {
        setConfirmKind(null);
        appToast.success(copy.successLabel);
      },
      onError: (error) => {
        appToast.error(authFailureMessage(error));
      },
    });
  }

  const confirmCopy = confirmKind ? CONFIRM_COPY[confirmKind] : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-[#52525B]"
            aria-label={`Actions for ${offer.candidateName}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="w-44 rounded-xl border border-[#E4E7EC] bg-white p-2 shadow-[0_12px_32px_rgba(16,24,40,0.14)]"
        >
          <DropdownMenuItem
            asChild
            className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
          >
            <Link href={`/e/talents/${offer.candidateUserId}`}>
              View candidate
            </Link>
          </DropdownMenuItem>

          {canMarkHired ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setConfirmKind("mark-hired");
              }}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
            >
              Mark as hired
            </DropdownMenuItem>
          ) : null}

          {canAddInterviewLink ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsAddLinkOpen(true);
              }}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
            >
              Add interview link
            </DropdownMenuItem>
          ) : null}

          {canRateHire ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsRateHireOpen(true);
              }}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
            >
              Rate this hire
            </DropdownMenuItem>
          ) : null}

          {canWithdraw ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setConfirmKind("withdraw");
              }}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#B42318]"
            >
              Withdraw offer
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirmKind !== null}
        onOpenChange={(open) => {
          if (!isSubmitting && !open) setConfirmKind(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {confirmCopy ? (
            <>
              <DialogHeader>
                <DialogTitle>{confirmCopy.title}</DialogTitle>
                <DialogDescription>
                  {confirmCopy.description(offer.candidateName)}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmKind(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={
                    confirmCopy.destructive
                      ? "bg-[#B42318] text-white hover:bg-[#B42318]/90"
                      : undefined
                  }
                >
                  {isSubmitting
                    ? confirmCopy.pendingLabel
                    : confirmCopy.actionLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AddInterviewLinkDialog
        open={isAddLinkOpen}
        onOpenChange={setIsAddLinkOpen}
        candidateName={offer.candidateName}
        isSubmitting={isAddingLink}
        onSubmit={(link) => {
          addInterviewLink(
            { offerId: offer.offerId, link },
            {
              onSuccess: () => {
                setIsAddLinkOpen(false);
                appToast.success("Interview link added.");
              },
              onError: (error) => {
                appToast.error(authFailureMessage(error));
              },
            },
          );
        }}
      />

      <RateHireDialog
        open={isRateHireOpen}
        onOpenChange={setIsRateHireOpen}
        offerId={offer.offerId}
        candidateName={offer.candidateName}
      />
    </>
  );
}
