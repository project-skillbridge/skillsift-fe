"use client";

import { Download, FileUp, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MIN_COMPANY_QUESTIONS } from "@/constants/employer-assessments";
import { useImportAssessmentQuestions } from "@/hooks/api/use-employer-assessments";
import {
  createDraftQuestion,
  fromImportedQuestion,
  isDraftQuestionValid,
  MAX_MC_OPTIONS,
  optionsForType,
  QUESTION_TYPE_OPTIONS,
  type DraftQuestion,
  type DraftQuestionType,
} from "@/lib/employer-assessment-questions";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type CreateAssessmentQuestionsStepProps = {
  questions: DraftQuestion[];
  onQuestionsChange: (questions: DraftQuestion[]) => void;
};

function QuestionCard({
  index,
  question,
  onChange,
  onRemove,
}: {
  index: number;
  question: DraftQuestion;
  onChange: (next: DraftQuestion) => void;
  onRemove: () => void;
}) {
  const isChoice = question.questionType === "multiple_choice";

  const changeType = (type: DraftQuestionType) =>
    onChange({
      ...question,
      questionType: type,
      options: optionsForType(type),
      correctAnswer: type === "true_false" ? "True" : "",
    });

  const setOption = (optionIndex: number, value: string) => {
    const wasCorrect = question.options[optionIndex] === question.correctAnswer;
    const options = question.options.map((o, i) =>
      i === optionIndex ? value : o,
    );
    onChange({
      ...question,
      options,
      correctAnswer: wasCorrect ? value : question.correctAnswer,
    });
  };

  const removeOption = (optionIndex: number) => {
    const removed = question.options[optionIndex];
    onChange({
      ...question,
      options: question.options.filter((_, i) => i !== optionIndex),
      correctAnswer:
        removed === question.correctAnswer ? "" : question.correctAnswer,
    });
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-sans text-sm font-semibold text-[#101828]">
          Question {index + 1}
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={question.questionType}
            onValueChange={(v) => changeType(v as DraftQuestionType)}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-[#667085]"
            aria-label={`Remove question ${index + 1}`}
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Textarea
        value={question.questionText}
        onChange={(e) =>
          onChange({ ...question, questionText: e.target.value })
        }
        placeholder="Type the question"
        className="min-h-16 text-sm"
      />

      {question.questionType === "short_answer" ? (
        <div className="mt-3">
          <label className="text-xs font-medium text-[#344054]">
            Expected answer
          </label>
          <Input
            value={question.correctAnswer}
            onChange={(e) =>
              onChange({ ...question, correctAnswer: e.target.value })
            }
            placeholder="The answer a strong candidate would give"
            className="mt-1 h-9 text-sm"
          />
        </div>
      ) : (
        <fieldset className="mt-3 flex flex-col gap-2">
          <legend className="mb-1 text-xs font-medium text-[#344054]">
            Pick the correct answer
          </legend>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                aria-label={`Mark option ${optionIndex + 1} as correct`}
                checked={option !== "" && option === question.correctAnswer}
                disabled={option.trim() === ""}
                onChange={() =>
                  onChange({ ...question, correctAnswer: option })
                }
                className="size-4 accent-[#19A878]"
              />
              {isChoice ? (
                <Input
                  value={option}
                  onChange={(e) => setOption(optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="h-9 flex-1 text-sm"
                />
              ) : (
                <span className="text-sm text-[#101828]">{option}</span>
              )}
              {isChoice && question.options.length > 2 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-[#667085]"
                  aria-label={`Remove option ${optionIndex + 1}`}
                  onClick={() => removeOption(optionIndex)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              ) : null}
            </div>
          ))}
          {isChoice && question.options.length < MAX_MC_OPTIONS ? (
            <button
              type="button"
              onClick={() =>
                onChange({ ...question, options: [...question.options, ""] })
              }
              className="w-fit text-xs font-medium text-[#101828] underline underline-offset-2"
            >
              Add option
            </button>
          ) : null}
        </fieldset>
      )}
    </div>
  );
}

export function CreateAssessmentQuestionsStep({
  questions,
  onQuestionsChange,
}: CreateAssessmentQuestionsStepProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const importMutation = useImportAssessmentQuestions();

  const validCount = questions.filter(isDraftQuestionValid).length;
  const remaining = Math.max(0, MIN_COMPANY_QUESTIONS - validCount);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    importMutation.mutate(file, {
      onSuccess: (result) => {
        onQuestionsChange([
          ...questions.filter(
            (q) => q.questionText.trim() || q.correctAnswer.trim(),
          ),
          ...result.questions.map(fromImportedQuestion),
        ]);
        appToast.success(`Imported ${result.questionCount} questions.`);
      },
      onError: (err: unknown) =>
        appToast.error(
          err instanceof Error
            ? err.message
            : "We couldn't read that file. Use the template and try again.",
        ),
    });
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#D0D5DD] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-sm font-semibold text-[#101828]">
            Have a spreadsheet?
          </p>
          <p className="font-sans text-xs text-[#667085]">
            Download the template, fill it in, and upload it (CSV or XLSX).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
            <a href="/backend/employer/assessments/template.csv" download>
              <Download className="size-4" /> CSV template
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
            <a href="/backend/employer/assessments/template.xlsx" download>
              <Download className="size-4" /> XLSX template
            </a>
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 bg-[#111827] text-white"
            disabled={importMutation.isPending}
            onClick={() => fileInput.current?.click()}
          >
            <FileUp className="size-4" />
            {importMutation.isPending ? "Reading..." : "Upload file"}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          onChange={(next) =>
            onQuestionsChange(
              questions.map((q) => (q.id === question.id ? next : q)),
            )
          }
          onRemove={() =>
            onQuestionsChange(questions.filter((q) => q.id !== question.id))
          }
        />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-1.5"
          onClick={() =>
            onQuestionsChange([...questions, createDraftQuestion()])
          }
        >
          <Plus className="size-4" /> Add question
        </Button>
        <p
          className={cn(
            "font-sans text-xs",
            remaining === 0 ? "text-[#19A878]" : "text-[#667085]",
          )}
        >
          {remaining === 0
            ? `${validCount} questions ready`
            : `${validCount} ready · ${remaining} more needed`}
        </p>
      </div>
    </div>
  );
}
