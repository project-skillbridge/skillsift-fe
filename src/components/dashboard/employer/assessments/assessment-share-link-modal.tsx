"use client";

import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useAssessmentShareLink,
  useRegenerateAccessCode,
} from "@/hooks/api/use-employer-assessments";

type AssessmentShareLinkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  /** Shown while the code loads. */
  link?: string;
};

function copy(value: string, label: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(`${label} copied.`))
    .catch(() => toast.error("Couldn't copy. Select and copy manually."));
}

export function AssessmentShareLinkModal({
  open,
  onOpenChange,
  assessmentId,
  link,
}: AssessmentShareLinkModalProps) {
  const { data } = useAssessmentShareLink(assessmentId, open);
  const { mutate: regenerate, isPending } =
    useRegenerateAccessCode(assessmentId);
  const url = data?.shareUrl ?? link ?? "";
  const code = data?.accessCode ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share this assessment</DialogTitle>
          <DialogDescription>
            Candidates open the link, then sign in with their name, email and
            the access code below. Send the code only to the people you want
            taking it.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#667085]">Link</span>
            <div className="flex items-center gap-2">
              <Input readOnly value={url} className="flex-1" />
              <Button
                type="button"
                size="icon"
                onClick={() => copy(url, "Link")}
                title="Copy link"
                disabled={!url}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#667085]">
              Access code
            </span>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={code || "…"}
                className="flex-1 font-mono text-lg font-semibold tracking-[0.3em]"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => copy(code, "Code")}
                title="Copy code"
                disabled={!code}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                title="Make a new code"
                disabled={isPending}
                onClick={() =>
                  regenerate(undefined, {
                    onSuccess: () =>
                      toast.success(
                        "New code ready. The old one no longer works.",
                      ),
                    onError: () => toast.error("Couldn't change the code."),
                  })
                }
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-[#667085]">
              Making a new code stops the old one from working for anyone who
              has not started yet.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
