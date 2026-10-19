"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmSendOfferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
  scorePercentage?: number;
  sendScoreUpdates: boolean;
  onSendScoreUpdatesChange: (checked: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function ConfirmSendOfferDialog({
  open,
  onOpenChange,
  candidateName,
  scorePercentage,
  sendScoreUpdates,
  onSendScoreUpdatesChange,
  onSubmit,
  isSubmitting,
}: ConfirmSendOfferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-137.5 gap-6 rounded-3xl p-6 text-center">
        <DialogHeader className="items-center gap-3">
          <DialogTitle className="text-3xl font-bold text-[#151515]">
            Send offer to Talent
          </DialogTitle>
          <DialogDescription className="text-base font-light tracking-[0.017em] text-[#151515]">
            You are about to send an offer to{" "}
            <span className="font-bold">{candidateName}</span> with
            employability score{" "}
            <span className="font-semibold text-google-green">
              {scorePercentage}%
            </span>
          </DialogDescription>
        </DialogHeader>

        <label className="flex cursor-pointer items-center gap-2 text-left">
          <Checkbox
            checked={sendScoreUpdates}
            onCheckedChange={(checked) =>
              onSendScoreUpdatesChange(checked === true)
            }
          />
          <span className="text-sm font-normal tracking-[0.016em] text-[#757575]">
            I would like SkillSift to send email updates of job ready talents
            that have similar score of this role.
          </span>
        </label>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mx-auto h-10 w-60 rounded-lg"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
