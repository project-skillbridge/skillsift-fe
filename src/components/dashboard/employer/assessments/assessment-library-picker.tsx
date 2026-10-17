"use client";

import { useState } from "react";
import { BookOpen, Check, Clock, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLibraryAssessment } from "@/hooks/api/use-employer-assessments";
import { cn } from "@/lib/utils";
import type { LibraryAssessmentItem } from "@/types/api/employer-assessments";

type Props = {
  items: LibraryAssessmentItem[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function PreviewDialog({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useLibraryAssessment(id);
  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{data?.title ?? "Preview"}</DialogTitle>
          <DialogDescription>
            The questions candidates will see. Answers stay private to
            SkillSift.
          </DialogDescription>
        </DialogHeader>
        {isLoading || !data ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <ol className="flex flex-col gap-3">
            {data.questions.map((q) => (
              <li
                key={q.position}
                className="rounded-xl border border-[#EEF0F3] p-4"
              >
                <p className="text-sm font-medium text-[#151515]">
                  {q.position}. {q.questionText}
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
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AssessmentLibraryPicker({
  items,
  isLoading,
  selectedId,
  onSelect,
}: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#D0D5DD] bg-[#FAFAFA] p-8 text-center">
        <BookOpen className="size-6 text-[#667085]" />
        <p className="text-sm font-semibold text-[#101828]">
          No ready-made assessment for this role and level yet
        </p>
        <p className="text-xs text-[#667085]">
          We are adding more all the time. For now, write your own questions or
          draft them from a job description.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <div
            key={item.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-4",
              selected
                ? "border-[#19A878] bg-[#F0FDF9]"
                : "border-[#E5E7EB] bg-white",
            )}
          >
            <div className="flex flex-col gap-1">
              <p className="font-sans text-sm font-semibold text-[#101828]">
                {item.title}
              </p>
              {item.description ? (
                <p className="font-sans text-xs text-[#667085]">
                  {item.description}
                </p>
              ) : null}
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#52525B]">
                <span className="inline-flex items-center gap-1">
                  <ListChecks className="size-3.5" />
                  {item.questionCount} questions
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {item.estimatedCompletionTime}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setPreviewId(item.id)}
              >
                Preview questions
              </Button>
              <Button
                type="button"
                size="sm"
                className={cn(
                  "h-9 gap-1.5",
                  selected
                    ? "bg-[#19A878] text-white"
                    : "bg-[#111827] text-white",
                )}
                onClick={() => onSelect(selected ? null : item.id)}
              >
                {selected ? (
                  <>
                    <Check className="size-4" /> Selected
                  </>
                ) : (
                  "Use this assessment"
                )}
              </Button>
            </div>
          </div>
        );
      })}
      <PreviewDialog id={previewId} onClose={() => setPreviewId(null)} />
    </div>
  );
}
