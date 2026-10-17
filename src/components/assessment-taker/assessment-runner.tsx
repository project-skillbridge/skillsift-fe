"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCountdown } from "@/hooks/use-countdown";
import { useIntegrityTracker } from "@/hooks/use-integrity-tracker";
import { cn } from "@/lib/utils";
import type {
  IntegrityEvents,
  TakerQuestion,
} from "@/types/api/assessment-taker";

type Props = {
  title: string;
  questions: TakerQuestion[];
  timeLimitSeconds: number;
  /** Server-measured time left; the clock never trusts the browser's start time. */
  remainingSeconds: number;
  storageKey: string;
  isSubmitting: boolean;
  /** Bumps after a failed submit so the runner allows another attempt. */
  failureCount?: number;
  onSubmit: (input: {
    answers: Record<string, string>;
    integrity: IntegrityEvents;
    timeTakenSeconds: number;
  }) => void;
};

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readSaved(key: string): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function AssessmentRunner({
  title,
  questions,
  timeLimitSeconds,
  remainingSeconds,
  storageKey,
  isSubmitting,
  failureCount = 0,
  onSubmit,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    readSaved(storageKey),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const secondsLeft = useCountdown(remainingSeconds, !isSubmitting);
  const snapshotIntegrity = useIntegrityTracker(!isSubmitting);
  const submitted = useRef(false);

  const question = questions[index];
  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;
  const unanswered = questions.length - answeredCount;

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Saving is a convenience; the test still works without it.
    }
  }, [answers, storageKey]);

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    onSubmit({
      answers,
      integrity: snapshotIntegrity(),
      timeTakenSeconds: Math.max(0, timeLimitSeconds - secondsLeft),
    });
  }, [answers, onSubmit, secondsLeft, snapshotIntegrity, timeLimitSeconds]);

  useEffect(() => {
    submitted.current = false;
  }, [failureCount]);

  useEffect(() => {
    if (secondsLeft === 0) submit();
  }, [secondsLeft, submit]);

  if (!question) return null;

  const setAnswer = (value: string) =>
    setAnswers((current) => ({ ...current, [question.id]: value }));
  const isLast = index === questions.length - 1;
  const lowTime = secondsLeft <= 60;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#151515]">{title}</p>
          <p className="text-xs text-[#757575]">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-semibold",
            lowTime ? "bg-red-50 text-red-600" : "bg-[#F2F4F7] text-[#151515]",
          )}
          aria-live="off"
        >
          <Clock className="size-4" />
          {formatClock(secondsLeft)}
        </div>
      </div>

      <Progress value={((index + 1) / questions.length) * 100} />

      <section className="flex flex-col gap-5 rounded-2xl border border-[#E4E7EC] bg-white p-6 select-none">
        <p className="text-xs font-medium text-[#757575]">
          Question {index + 1} of {questions.length}
        </p>
        <h2 className="text-lg font-semibold text-[#151515]">
          {question.question_text}
        </h2>

        {question.question_type === "short_answer" ? (
          <Input
            value={answers[question.id] ?? ""}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
            autoComplete="off"
            className="select-text"
          />
        ) : (
          <RadioGroup
            value={answers[question.id] ?? ""}
            onValueChange={setAnswer}
          >
            {(question.options ?? ["True", "False"]).map((option, i) => {
              const id = `${question.id}-${i}`;
              return (
                <label
                  key={option}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm",
                    answers[question.id] === option
                      ? "border-[#111827] bg-[#F9FAFB]"
                      : "border-[#E4E7EC]",
                  )}
                >
                  <RadioGroupItem id={id} value={option} />
                  <span>{option}</span>
                </label>
              );
            })}
          </RadioGroup>
        )}
      </section>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        {isLast ? (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => (unanswered > 0 ? setConfirmOpen(true) : submit())}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button type="button" onClick={() => setIndex((i) => i + 1)}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit with unanswered questions?</DialogTitle>
            <DialogDescription>
              You have {unanswered} unanswered{" "}
              {unanswered === 1 ? "question" : "questions"}. You can&apos;t
              change your answers after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep going
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                submit();
              }}
            >
              Submit anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
