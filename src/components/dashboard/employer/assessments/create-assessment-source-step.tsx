"use client";

import { cn } from "@/lib/utils";
import type { LibraryAssessmentItem } from "@/types/api/employer-assessments";
import type { DraftQuestion } from "@/lib/employer-assessment-questions";

import { AssessmentLibraryPicker } from "./assessment-library-picker";
import { CreateAssessmentQuestionsStep } from "./create-assessment-questions-step";

export type QuestionSource = "library" | "own";

type Props = {
  source: QuestionSource;
  onSourceChange: (source: QuestionSource) => void;
  level: "junior" | "mid" | "senior";
  libraryItems: LibraryAssessmentItem[] | undefined;
  libraryLoading: boolean;
  libraryId: string | null;
  onLibraryChange: (id: string | null) => void;
  questions: DraftQuestion[];
  onQuestionsChange: (questions: DraftQuestion[]) => void;
};

const OPTIONS: { value: QuestionSource; title: string; body: string }[] = [
  {
    value: "library",
    title: "Pick from SkillSift",
    body: "Ready-made questions, nothing to write.",
  },
  {
    value: "own",
    title: "Write my own",
    body: "Add, import or draft your own questions.",
  },
];

/** First choice in the wizard: use our bank, or build the questions yourself. */
export function CreateAssessmentSourceStep({
  source,
  onSourceChange,
  level,
  libraryItems,
  libraryLoading,
  libraryId,
  onLibraryChange,
  questions,
  onQuestionsChange,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div
        role="radiogroup"
        aria-label="Where do the questions come from"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {OPTIONS.map((option) => {
          const active = option.value === source;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSourceChange(option.value)}
              className={cn(
                "flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors",
                active
                  ? "border-[#101828] bg-[#F9FAFB]"
                  : "border-[#E5E7EB] bg-white hover:border-[#98A2B3]",
              )}
            >
              <span className="font-sans text-sm font-semibold text-[#101828]">
                {option.title}
              </span>
              <span className="font-sans text-xs text-[#667085]">
                {option.body}
              </span>
            </button>
          );
        })}
      </div>

      {source === "library" ? (
        <AssessmentLibraryPicker
          items={libraryItems}
          isLoading={libraryLoading}
          selectedId={libraryId}
          onSelect={onLibraryChange}
        />
      ) : (
        <CreateAssessmentQuestionsStep
          level={level}
          questions={questions}
          onQuestionsChange={onQuestionsChange}
        />
      )}
    </div>
  );
}
