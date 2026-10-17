"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDraftAssessmentQuestions } from "@/hooks/api/use-employer-assessments";
import {
  fromImportedQuestion,
  type DraftQuestion,
} from "@/lib/employer-assessment-questions";
import { appToast } from "@/lib/toast";

const MIN_JD_LENGTH = 40;
const MAX_JD_LENGTH = 4000;

type Props = {
  level: "junior" | "mid" | "senior";
  onDrafted: (questions: DraftQuestion[]) => void;
};

export function AssessmentAiDraftPanel({ level, onDrafted }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const draft = useDraftAssessmentQuestions();
  const length = jobDescription.trim().length;
  const tooShort = length < MIN_JD_LENGTH;

  const handleDraft = () =>
    draft.mutate(
      { jobDescription: jobDescription.trim(), experienceLevel: level },
      {
        onSuccess: ({ questions }) => {
          onDrafted(
            questions.map((q) => ({
              ...fromImportedQuestion(q),
              aiDrafted: true,
            })),
          );
          appToast.success(
            `${questions.length} questions drafted. Check every answer before you continue.`,
          );
        },
        onError: (err: unknown) =>
          appToast.error(
            err instanceof Error
              ? err.message
              : "We couldn't draft questions right now. Try again or add your own.",
          ),
      },
    );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#D0D5DD] bg-white p-4">
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-[#19A878]" />
        <div>
          <p className="font-sans text-sm font-semibold text-[#101828]">
            Draft questions from a job description
          </p>
          <p className="font-sans text-xs text-[#667085]">
            Paste the role or the skills you need. AI suggests a starting set,
            but it can be wrong, so you check and edit every question and answer
            before it goes out.
          </p>
        </div>
      </div>
      <Textarea
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value.slice(0, MAX_JD_LENGTH))
        }
        placeholder="e.g. We need a React engineer who builds accessible, well-tested interfaces and works with REST APIs..."
        className="min-h-24 text-sm"
        aria-label="Job description"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[#667085]">
          {tooShort
            ? `Add ${MIN_JD_LENGTH - length} more characters`
            : `${length}/${MAX_JD_LENGTH}`}
        </span>
        <Button
          type="button"
          size="sm"
          className="h-9 gap-1.5 bg-[#111827] text-white"
          disabled={tooShort || draft.isPending}
          onClick={handleDraft}
        >
          <Sparkles className="size-4" />
          {draft.isPending ? "Drafting..." : "Draft questions"}
        </Button>
      </div>
    </div>
  );
}
