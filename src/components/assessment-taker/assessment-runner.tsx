"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { QuestionnaireMobileActions } from "@/components/assessments/questionnaire-mobile-actions";
import { QuestionnaireMobileHeader } from "@/components/assessments/questionnaire-mobile-header";
import { QuestionnaireQuestionCard } from "@/components/assessments/questionnaire-question-card";
import { QuestionnaireSidebar } from "@/components/assessments/questionnaire-sidebar";
import { QuestionnaireToolbar } from "@/components/assessments/questionnaire-toolbar";
import { useCountdown } from "@/hooks/use-countdown";
import { useIntegrityTracker } from "@/hooks/use-integrity-tracker";
import { toQuestionnaireQuestion } from "@/lib/employer-assessment-preview";
import { isAnswerValid } from "@/lib/questionnaire";
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

type Draft = { answers: Record<string, string>; index: number };

function readDraft(key: string): Draft {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as Draft;
  } catch {
    // Fall through to a fresh start.
  }
  return { answers: {}, index: 0 };
}

/**
 * The timed question screen for employer assessments. It is built from the
 * same pieces as the talent questionnaire so both look and behave alike.
 */
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
  const [draft] = useState(() => readDraft(storageKey));
  const [answers, setAnswers] = useState(draft.answers);
  const [index, setIndex] = useState(
    Math.min(Math.max(draft.index, 0), Math.max(questions.length - 1, 0)),
  );
  const secondsLeft = useCountdown(remainingSeconds, !isSubmitting);
  const snapshotIntegrity = useIntegrityTracker(!isSubmitting);
  const submitted = useRef(false);

  // The intro is long; start the test from the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const mapped = useMemo(
    () => questions.map((q) => toQuestionnaireQuestion(q, title)),
    [questions, title],
  );
  const question = mapped[index];
  const value = question ? answers[question.id] : undefined;
  const canProceed = question ? isAnswerValid(question, value) : false;
  const isLast = index === mapped.length - 1;

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ answers, index } satisfies Draft),
      );
    } catch {
      // Saving is a convenience; the test still works without it.
    }
  }, [answers, index, storageKey]);

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

  // Time's up: send whatever has been answered, as the talent flow does.
  useEffect(() => {
    if (secondsLeft === 0) submit();
  }, [secondsLeft, submit]);

  if (!question) return null;

  const handleNext = () => {
    if (!canProceed || isSubmitting) return;
    if (isLast) submit();
    else setIndex((i) => i + 1);
  };
  const handleBack = () => setIndex((i) => Math.max(0, i - 1));
  const total = mapped.length;

  return (
    <div className="pb-32 lg:pb-0">
      <QuestionnaireMobileHeader
        sectionTitle={title}
        progress={(index + 1) / total}
        secondsLeft={secondsLeft}
        className="-mx-4 sm:-mx-6 lg:hidden"
      />
      <div className="hidden lg:block">
        <QuestionnaireToolbar secondsLeft={secondsLeft} />
      </div>
      <div className="mx-auto flex max-w-300 flex-col gap-6 pb-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="hidden lg:block">
          <QuestionnaireSidebar
            sections={[{ number: 1, title }]}
            activeSectionNumber={1}
          />
        </div>
        <QuestionnaireQuestionCard
          question={question}
          value={value}
          otherValue=""
          onChange={(next) =>
            setAnswers((prev) => ({
              ...prev,
              [question.id]: Array.isArray(next) ? next.join(", ") : next,
            }))
          }
          onOtherChange={() => {}}
          onNext={handleNext}
          onBack={handleBack}
          questionNumber={index + 1}
          totalQuestions={total}
          isLast={isLast}
          showBack={index > 0}
          nextDisabled={!canProceed}
          nextLoading={isSubmitting}
        />
      </div>
      <QuestionnaireMobileActions
        questionNumber={index + 1}
        totalQuestions={total}
        onBack={handleBack}
        onNext={handleNext}
        isLast={isLast}
        showBack={index > 0}
        nextDisabled={!canProceed}
        nextLoading={isSubmitting}
        className="lg:hidden"
      />
    </div>
  );
}
