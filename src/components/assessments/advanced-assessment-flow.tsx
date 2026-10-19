"use client";

import { useCallback, useState, useEffect, useMemo } from "react";

import { AssessmentStartBlocked } from "@/components/assessments/assessment-start-blocked";
import { QuestionnaireFlow } from "@/components/assessments/questionnaire-flow";
import ViolationDetector from "@/components/assessments/violation-detector";
import {
  useResolveAdvancedAssessmentSession,
  useSubmitAdvancedAssessment,
} from "@/hooks/api";
import { useFlagAssessmentEvent } from "@/hooks/api/use-assessment";
import {
  mapAdvancedQuestions,
  toAdvancedSubmitAnswers,
} from "@/lib/assessment-questions";
import {
  ASSESSMENT_PREPARING_MESSAGE,
  ASSESSMENT_PREPARING_TITLE,
  ASSESSMENT_START_FAILED_MESSAGE,
  ASSESSMENT_START_TIMEOUT_MESSAGE,
  isAssessmentPreparingError,
  isAssessmentStartTimeoutError,
  withAssessmentStartTimeout,
} from "@/lib/assessment-start";
import { ApiError, isServiceUnavailableError } from "@/lib/api";
import type { AdvancedAssessmentApiQuestion } from "@/types/api";

type AdvancedStartState =
  | "loading"
  | "ready"
  | "preparing"
  | "unavailable"
  | "retake-locked"
  | "failed";

const ADVANCED_PREVIEW_PATH = "/t/assessments/advanced";

function formatRetakeDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function readRetakeLockedDate(error: unknown): string | undefined {
  if (!(error instanceof ApiError) || error.status !== 403) return undefined;
  const data = error.data as
    { error?: string; probation_ends_at?: string } | undefined;
  if (data?.error !== "ADVANCED_RETAKE_LOCKED") return undefined;
  return typeof data.probation_ends_at === "string"
    ? data.probation_ends_at
    : undefined;
}

export function AdvancedAssessmentFlow() {
  const [sessionId, setSessionId] = useState("");
  const [apiQuestions, setApiQuestions] = useState<
    AdvancedAssessmentApiQuestion[]
  >([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | undefined>(
    undefined,
  );
  const [startState, setStartState] = useState<AdvancedStartState>("loading");
  const [retakeUnlocksAt, setRetakeUnlocksAt] = useState<string | undefined>(
    undefined,
  );
  const [failedMessage, setFailedMessage] = useState(
    ASSESSMENT_START_FAILED_MESSAGE,
  );
  const [startAttempt, setStartAttempt] = useState(0);

  const { mutateAsync: resolveSession } = useResolveAdvancedAssessmentSession();
  const { mutateAsync: submitAssessment, isPending: isSubmitting } =
    useSubmitAdvancedAssessment();
  const flagViolation = useFlagAssessmentEvent("advanced", sessionId);

  const handleRetry = useCallback(() => {
    setFailedMessage(ASSESSMENT_START_FAILED_MESSAGE);
    setStartState("loading");
    setStartAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    withAssessmentStartTimeout(resolveSession())
      .then((data) => {
        if (cancelled) return;
        setSessionId(data.session_id);
        setApiQuestions(data.questions ?? []);
        setRemainingSeconds(data.remaining_seconds);
        setStartState("ready");
      })
      .catch((e) => {
        if (cancelled) return;

        if (isAssessmentPreparingError(e)) {
          setStartState("preparing");
          return;
        }
        if (isServiceUnavailableError(e)) {
          setStartState("unavailable");
          return;
        }
        const retakeDate = readRetakeLockedDate(e);
        if (retakeDate !== undefined) {
          setRetakeUnlocksAt(retakeDate);
          setStartState("retake-locked");
          return;
        }
        setFailedMessage(
          isAssessmentStartTimeoutError(e)
            ? ASSESSMENT_START_TIMEOUT_MESSAGE
            : ASSESSMENT_START_FAILED_MESSAGE,
        );
        setStartState("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [resolveSession, startAttempt]);

  const questions = useMemo(
    () => mapAdvancedQuestions(apiQuestions),
    [apiQuestions],
  );

  if (startState === "preparing") {
    return (
      <AssessmentStartBlocked
        title={ASSESSMENT_PREPARING_TITLE}
        message={ASSESSMENT_PREPARING_MESSAGE}
        backHref={ADVANCED_PREVIEW_PATH}
        backLabel="Back to assessments"
      />
    );
  }

  if (startState === "unavailable") {
    return (
      <AssessmentStartBlocked
        title="Assessment temporarily unavailable"
        message="Our assessment service is temporarily unavailable. Please check back later."
        backHref={ADVANCED_PREVIEW_PATH}
      />
    );
  }

  if (startState === "retake-locked") {
    const dateLabel = formatRetakeDate(retakeUnlocksAt);
    return (
      <AssessmentStartBlocked
        title="Retake locked"
        message={
          dateLabel
            ? `You can retake the Job Readiness Evaluation on ${dateLabel}.`
            : "You're currently in the 14-day retake cooldown period."
        }
        backHref={ADVANCED_PREVIEW_PATH}
      />
    );
  }

  if (startState === "failed") {
    return (
      <AssessmentStartBlocked
        title="Couldn't start assessment"
        message={failedMessage}
        backHref={ADVANCED_PREVIEW_PATH}
        onRetry={handleRetry}
      />
    );
  }

  const submit = (
    answersByKey: Record<string, string | string[]>,
    timeSpentByKey?: Record<string, number>,
  ) =>
    submitAssessment({
      sessionId,
      answers: toAdvancedSubmitAnswers(questions, answersByKey, timeSpentByKey),
    }).then(() => {});

  // Every violation goes to the server, which keeps the count and ends the
  // session at the limit, so the rule holds even if this page is tampered with.
  const recordViolation = () => {
    flagViolation.mutate({ eventType: "tab_switch" });
  };

  return (
    <ViolationDetector
      enabled={startState === "ready"}
      onViolation={recordViolation}
      submissionConfirmed={flagViolation.data?.sessionVoided === true}
    >
      <QuestionnaireFlow
        questions={questions}
        isLoading={startState === "loading"}
        isSubmitting={isSubmitting}
        initialSeconds={remainingSeconds}
        totalQuestions={apiQuestions.length}
        persistKey={sessionId || undefined}
        onSubmit={submit}
      />
    </ViolationDetector>
  );
}
