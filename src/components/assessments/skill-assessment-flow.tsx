"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getSkillAssessmentSession } from "@/actions/assessment";
import { AssessmentStartBlocked } from "@/components/assessments/assessment-start-blocked";
import { QuestionnaireFlow } from "@/components/assessments/questionnaire-flow";
import ViolationDetector from "@/components/assessments/violation-detector";
import {
  useMe,
  useStartSkillAssessment,
  useSubmitSkillAssessment,
} from "@/hooks/api";
import { assessmentKeys, dashboardKeys } from "@/hooks/api/keys";
import { useFlagAssessmentEvent } from "@/hooks/api/use-assessment";
import { useDashboardHome } from "@/hooks/api/use-dashboard";
import {
  mapSkillQuestions,
  toSkillSubmitAnswers,
} from "@/lib/assessment-questions";
import {
  assessmentPreparingCopy,
  ASSESSMENT_START_FAILED_MESSAGE,
  ASSESSMENT_START_TIMEOUT_MESSAGE,
  isAssessmentPreparingError,
  isAssessmentStartTimeoutError,
  withAssessmentStartTimeout,
} from "@/lib/assessment-start";
import { isServiceUnavailableError } from "@/lib/api";
import {
  existingSessionIdFromError,
  loadSkillSessionWithQuestions,
} from "@/lib/skill-assessment-session";
import { useAssessmentSummaryStore } from "@/stores/assessment-summary-store";
import type {
  SkillAssessmentApiQuestion,
  SkillAssessmentStartResponseData,
} from "@/types/api";

type SkillStartState =
  "loading" | "ready" | "preparing" | "unavailable" | "failed";

const SKILL_PREVIEW_PATH = "/t/assessments/skill";

export function SkillAssessmentFlow() {
  const [sessionId, setSessionId] = useState("");
  const [apiQuestions, setApiQuestions] = useState<
    SkillAssessmentApiQuestion[]
  >([]);
  const [claimedLevel, setClaimedLevel] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<
    number | undefined
  >();
  const [startState, setStartState] = useState<SkillStartState>("loading");
  const [failedMessage, setFailedMessage] = useState(
    ASSESSMENT_START_FAILED_MESSAGE,
  );
  const [startAttempt, setStartAttempt] = useState(0);

  const queryClient = useQueryClient();
  const { data: user } = useMe({ enabled: true });
  const { data: dashboardHome } = useDashboardHome();
  const setSkillClaimedLevel = useAssessmentSummaryStore(
    (state) => state.setSkillClaimedLevel,
  );
  const { mutateAsync: startSession } = useStartSkillAssessment();
  const { mutateAsync: submitAssessment, isPending: isSubmitting } =
    useSubmitSkillAssessment();
  const flagViolation = useFlagAssessmentEvent("skill", sessionId);

  const handleRetry = useCallback(() => {
    setFailedMessage(ASSESSMENT_START_FAILED_MESSAGE);
    setStartState("loading");
    setStartAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const applySession = (data: SkillAssessmentStartResponseData) => {
      if (cancelled) return;
      setSessionId(data.session_id);
      setApiQuestions(data.questions ?? []);
      setClaimedLevel(data.verified_level);
      setRemainingSeconds(data.remaining_seconds ?? undefined);
      setStartState("ready");
    };

    const fail = (message: string) => {
      if (cancelled) return;
      setFailedMessage(message);
      setStartState("failed");
    };

    (async () => {
      try {
        const session = await withAssessmentStartTimeout(
          loadSkillSessionWithQuestions(await startSession()),
        );
        applySession(session);
      } catch (e) {
        if (cancelled) return;

        if (isAssessmentStartTimeoutError(e)) {
          fail(ASSESSMENT_START_TIMEOUT_MESSAGE);
          return;
        }

        const existingId = existingSessionIdFromError(e);
        if (existingId) {
          try {
            const resumed = await withAssessmentStartTimeout(
              loadSkillSessionWithQuestions(
                await getSkillAssessmentSession(existingId),
              ),
            );
            applySession(resumed);
          } catch (resumeError) {
            void queryClient.invalidateQueries({
              queryKey: dashboardKeys.home(),
            });
            if (isServiceUnavailableError(resumeError)) {
              setStartState("unavailable");
              return;
            }
            if (isAssessmentStartTimeoutError(resumeError)) {
              fail(ASSESSMENT_START_TIMEOUT_MESSAGE);
              return;
            }
            fail(ASSESSMENT_START_FAILED_MESSAGE);
          }
          return;
        }

        if (isAssessmentPreparingError(e)) {
          void queryClient.invalidateQueries({
            queryKey: assessmentKeys.skillAvailability(),
          });
          setStartState("preparing");
        } else if (isServiceUnavailableError(e)) {
          setStartState("unavailable");
        } else {
          void queryClient.invalidateQueries({
            queryKey: dashboardKeys.home(),
          });
          fail(ASSESSMENT_START_FAILED_MESSAGE);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryClient, startSession, startAttempt]);

  useEffect(() => {
    if (!user?.id) return;
    setSkillClaimedLevel(user.id, claimedLevel);
  }, [claimedLevel, setSkillClaimedLevel, user?.id]);

  const questions = useMemo(
    () => mapSkillQuestions(apiQuestions),
    [apiQuestions],
  );

  if (startState === "preparing") {
    const used =
      dashboardHome?.performance?.skill?.attemptsUsed ??
      dashboardHome?.skillAttemptsUsed ??
      0;
    const copy = assessmentPreparingCopy(used > 0);
    return (
      <AssessmentStartBlocked
        title={copy.title}
        message={copy.message}
        backHref={SKILL_PREVIEW_PATH}
        backLabel="Back to assessments"
      />
    );
  }

  if (startState === "unavailable") {
    return (
      <AssessmentStartBlocked
        title="Assessment temporarily unavailable"
        message="Our assessment service is temporarily unavailable. Please check back later."
        backHref={SKILL_PREVIEW_PATH}
      />
    );
  }

  if (startState === "failed") {
    return (
      <AssessmentStartBlocked
        title="Couldn't start assessment"
        message={failedMessage}
        backHref={SKILL_PREVIEW_PATH}
        onRetry={handleRetry}
      />
    );
  }

  const submit = (answersByKey: Record<string, string | string[]>) =>
    submitAssessment({
      attemptId: sessionId,
      answers: toSkillSubmitAnswers(questions, answersByKey),
    });

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
        persistKey={sessionId || undefined}
        onSubmit={submit}
      />
    </ViolationDetector>
  );
}
