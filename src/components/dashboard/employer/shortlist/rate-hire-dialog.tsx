"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitHireFeedback } from "@/hooks/api";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";

type RateHireDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string;
  candidateName: string;
};

export function RateHireDialog({
  open,
  onOpenChange,
  offerId,
  candidateName,
}: RateHireDialogProps) {
  const [rating, setRating] = useState(0);
  const [wouldHireAgain, setWouldHireAgain] = useState(true);
  const [comment, setComment] = useState("");

  const { mutate: submit, isPending } = useSubmitHireFeedback();

  function reset() {
    setRating(0);
    setWouldHireAgain(true);
    setComment("");
  }

  function handleSubmit() {
    if (rating === 0) return;

    submit(
      {
        offerId,
        overallRating: rating,
        wouldHireAgain,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          appToast.success("Thanks — your feedback helps other employers.");
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          appToast.error(authFailureMessage(error));
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How did the hire go?</DialogTitle>
          <DialogDescription>
            Your rating of {candidateName} helps other employers trust SkillSift
            scores, and helps {candidateName} build their track record.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label>Overall, how would you rate this hire?</Label>
            <StarRating value={rating} onChange={setRating} size={28} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E4E7EC] px-3 py-2.5">
            <Label htmlFor="would-hire-again" className="text-sm font-normal">
              Would you hire this candidate again?
            </Label>
            <Switch
              id="would-hire-again"
              checked={wouldHireAgain}
              onCheckedChange={setWouldHireAgain}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="hire-feedback-comment"
              className="text-sm font-normal"
            >
              Anything else worth sharing? (optional)
            </Label>
            <Textarea
              id="hire-feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Strong communicator, ramped up fast, great with the design system…"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
          >
            {isPending ? "Submitting…" : "Submit feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
