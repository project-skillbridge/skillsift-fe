"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useInviteToAssessment } from "@/hooks/api/use-employer-assessments";
import { useEmployerBillingSummary } from "@/hooks/api/use-employer-billing";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssessmentInviteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
};

export function AssessmentInviteModal({
  open,
  onOpenChange,
  assessmentId,
}: AssessmentInviteModalProps) {
  const [email, setEmail] = useState("");
  const { mutate: inviteToAssessment, isPending } = useInviteToAssessment();
  const { data: billing } = useEmployerBillingSummary();
  const outOfInvites = billing?.invitesRemaining === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setEmail("");
    onOpenChange(nextOpen);
  };

  const handleInvite = () => {
    if (!email) {
      toast.error("Please enter an email or name to invite.");
      return;
    }

    const payload = email.includes("@")
      ? { emails: [email] }
      : { talentIds: [email] };

    inviteToAssessment(
      { assessmentId, ...payload },
      {
        onSuccess: () => {
          toast.success(`Invite sent to ${email} for assessment`);
          setEmail("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : "Failed to send invite",
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Assessment</DialogTitle>
          <DialogDescription>
            Search for internal talents by name or email, or enter an external
            email address to invite them to this assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-input">Name or Email</Label>
            <Input
              id="invite-input"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {billing ? (
              <p className="text-xs text-[#667085]">
                {outOfInvites ? (
                  <>
                    You&apos;re out of invites this month.{" "}
                    <Link href="/e/billing" className="underline">
                      Get more
                    </Link>
                  </>
                ) : (
                  `${billing.invitesRemaining} invite${billing.invitesRemaining === 1 ? "" : "s"} left. Each candidate uses one.`
                )}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={isPending || !email || outOfInvites}
          >
            {isPending ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
