"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionnaireMobileActions } from "@/components/assessments/questionnaire-mobile-actions";
import { QuestionnaireMobileHeader } from "@/components/assessments/questionnaire-mobile-header";
import { hasOtherReveal } from "@/components/assessments/questionnaire-question-field-body";
import { QuestionnaireQuestionCard } from "@/components/assessments/questionnaire-question-card";
import { QuestionnaireSidebar } from "@/components/assessments/questionnaire-sidebar";
import {
  QuestionnaireEmptyState,
  QuestionnaireLoadingState,
} from "@/components/assessments/questionnaire-states";
import { QuestionnaireToolbar } from "@/components/assessments/questionnaire-toolbar";
import { isAssessmentSlug } from "@/constants/assessment-previews";
import { ASSESSMENT_DEFAULT_DURATION_SECONDS } from "@/constants/question-bank";
import { ApiError, authFailureMessage } from "@/lib/api";
import {
  clearAssessmentDraft,
  deadlineIn,
  loadAssessmentDraft,
  saveAssessmentDraft,
  secondsUntil,
} from "@/lib/assessment-draft";
import { buildAnswers, isAnswerValid } from "@/lib/questionnaire";
import { appToast } from "@/lib/toast";
import { useMe } from "@/hooks/api";
import { useCountdown } from "@/hooks/use-countdown";
import { useQuestionTimer } from "@/hooks/use-question-timer";
import { useQuestionnaireSections } from "@/hooks/use-questionnaire-sections";
import { useAssessmentSummaryStore } from "@/stores/assessment-summary-store";
import type { Question } from "@/types/questionnaire";

/**
 * Minimum character count for the free-text "Other" follow-up. A single
 * character isn't a meaningful answer ("X") and tends to mean the user
 * tapped Next by accident — bump the floor so the form pushes back.
 */
const OTHER_MIN_LENGTH = 2;

export type QuestionnaireFlowProps = {
  questions: Question[];
  isLoading: boolean;
  isSubmitting: boolean;
  initialSeconds?: number;
  prefillAnswers?: Record<string, string | string[]>;
  totalQuestions?: number;
  /** Server session id. When set, answers are saved locally and restored on reload. */
  persistKey?: string;
  onSubmit: (
    answers: Record<string, string | string[]>,
    timeSpentByKey?: Record<string, number>,
  ) => Promise<unknown>;
};

export function QuestionnaireFlow({
  questions,
  isLoading,
  isSubmitting,
  initialSeconds,
  prefillAnswers,
  totalQuestions,
  persistKey,
  onSubmit,
}: QuestionnaireFlowProps) {
  const router = useRouter();
  const { name } = useParams<{ name: string }>();
  const { data: user } = useMe({ enabled: true });
  const setSummaryResult = useAssessmentSummaryStore(
    (state) => state.setResult,
  );
  const clearSummaryResult = useAssessmentSummaryStore(
    (state) => state.clearResult,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [otherAnswers, setOtherAnswers] = useState<Record<string, string>>({});

  const showTimer = name !== "personal";
  // Timers the server doesn't own are anchored to a stored deadline so a
  // reload resumes the clock instead of restarting it.
  const [restoredSeconds, setRestoredSeconds] = useState<number | undefined>();
  // The key can arrive after mount (session id comes from the server), so
  // readiness is tracked per key rather than as a one-off flag.
  const [restoredFor, setRestoredFor] = useState<string | undefined>();
  const draftReady = !persistKey || restoredFor === persistKey;
  const [deadline, setDeadline] = useState<number | undefined>();
  const tickingSeconds = useCountdown(
    initialSeconds ?? restoredSeconds ?? ASSESSMENT_DEFAULT_DURATION_SECONDS,
    showTimer && !isLoading,
  );
  const secondsLeft = showTimer ? tickingSeconds : undefined;

  // Restore a saved draft once the questions have loaded. Set during render
  // (React's "adjust state on prop change" pattern), same as useCountdown.
  if (persistKey && !isLoading && !draftReady) {
    const draft = loadAssessmentDraft(persistKey);
    if (draft) {
      setUserAnswers(draft.answers ?? {});
      setOtherAnswers(draft.other ?? {});
      setCurrentIndex(
        Math.min(
          Math.max(draft.index ?? 0, 0),
          Math.max(questions.length - 1, 0),
        ),
      );
    }
    if (showTimer && initialSeconds == null) {
      const end =
        draft?.deadline ?? deadlineIn(ASSESSMENT_DEFAULT_DURATION_SECONDS);
      setDeadline(end);
      setRestoredSeconds(secondsUntil(end));
    }
    setRestoredFor(persistKey);
  }

  useEffect(() => {
    if (!persistKey || !draftReady) return;
    saveAssessmentDraft(persistKey, {
      answers: userAnswers,
      other: otherAnswers,
      index: currentIndex,
      deadline,
    });
  }, [
    persistKey,
    draftReady,
    userAnswers,
    otherAnswers,
    currentIndex,
    deadline,
  ]);

  const answers = { ...prefillAnswers, ...userAnswers };

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const displayedTotal = totalQuestions ?? questions.length;
  const displayedIsLast = currentIndex === displayedTotal - 1;

  // Tracks per-question elapsed time + captures the "ready" start moment.
  const timer = useQuestionTimer(question, !isLoading);

  // Sidebar section list + the "which section is active right now" index.
  const { sections, activeSectionNumber } = useQuestionnaireSections(
    questions,
    name,
    question,
  );

  const currentValue = question ? answers[question.id] : undefined;
  const currentOther = question ? (otherAnswers[question.id] ?? "") : "";

  const otherSatisfied =
    !question ||
    !hasOtherReveal(question, currentValue) ||
    currentOther.trim().length >= OTHER_MIN_LENGTH;
  const canProceed = question
    ? isAnswerValid(question, currentValue) && otherSatisfied
    : false;

  const handleChange = (next: string | string[]) => {
    if (!question) return;
    setUserAnswers((prev) => ({ ...prev, [question.id]: next }));
  };

  const handleOtherChange = (next: string) => {
    if (!question) return;
    setOtherAnswers((prev) => ({ ...prev, [question.id]: next }));
  };

  const handleBack = () => {
    timer.accumulate();
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  // The server rejects a submit that arrives long after the deadline and uses
  // up the attempt. Nothing is left to resume, so drop the draft and leave.
  const handleTimeExpired = (e: unknown) => {
    const data = e instanceof ApiError ? e.data : undefined;
    const code =
      data && typeof data === "object" && "error" in data
        ? (data as { error?: unknown }).error
        : undefined;
    if (code !== "SKILL_TIME_EXPIRED") return false;
    if (persistKey) clearAssessmentDraft(persistKey);
    appToast.error(authFailureMessage(e));
    router.replace("/t/assessments");
    return true;
  };

  const handleNext = async () => {
    if (!question || !canProceed || isSubmitting) return;

    timer.accumulate();

    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    const builtAnswers = buildAnswers(questions, answers, otherAnswers);
    const builtTimeByKey = timer.buildByKey(questions);

    try {
      const result = await onSubmit(builtAnswers, builtTimeByKey);
      if (persistKey) clearAssessmentDraft(persistKey);
      if (isAssessmentSlug(name) && name !== "advanced" && user?.id) {
        if (result != null) {
          setSummaryResult(user.id, name, result);
        } else {
          clearSummaryResult(user.id, name);
        }
      }
      // `replace`, not `push` — a submitted test must not sit in browser
      // history. Otherwise the back button re-mounts this page with its
      // last client-side state (stale session, frozen timer) instead of
      // re-running the start/eligibility check, letting a submitted or
      // retake-locked assessment appear re-enterable when it isn't.
      router.replace(`/t/assessments/${name}/summary`);
    } catch (e) {
      if (handleTimeExpired(e)) return;
      appToast.error(authFailureMessage(e));
    }
  };

  // Timer hitting zero didn't force a submission anywhere in this flow —
  // the countdown just froze at 0:00 with no result and no way to retake
  // (the session stayed open server-side). Auto-submit whatever's been
  // answered so far, same as a manual submit on the last question.
  const autoSubmittedRef = useRef(false);
  useEffect(() => {
    if (!showTimer || secondsLeft !== 0) return;
    if (autoSubmittedRef.current || isSubmitting) return;
    autoSubmittedRef.current = true;

    timer.accumulate();
    const builtAnswers = buildAnswers(questions, answers, otherAnswers);
    const builtTimeByKey = timer.buildByKey(questions);

    onSubmit(builtAnswers, builtTimeByKey)
      .then((result) => {
        if (persistKey) clearAssessmentDraft(persistKey);
        if (isAssessmentSlug(name) && name !== "advanced" && user?.id) {
          if (result != null) {
            setSummaryResult(user.id, name, result);
          } else {
            clearSummaryResult(user.id, name);
          }
        }
        appToast.warning(
          "Time's up — your assessment was submitted automatically.",
        );
        // See handleNext — `replace`, not `push`, keeps this out of history.
        router.replace(`/t/assessments/${name}/summary`);
      })
      .catch((e) => {
        // Retrying a rejected late submit would loop, so leave it set.
        if (handleTimeExpired(e)) return;
        autoSubmittedRef.current = false;
        appToast.error(authFailureMessage(e));
      });
    // Answers/questions intentionally excluded — this must fire exactly once,
    // capturing whatever was filled in at the moment the clock hit zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, showTimer, isSubmitting]);

  if (isLoading) return <QuestionnaireLoadingState />;
  if (!question) return <QuestionnaireEmptyState />;

  const overallProgress =
    displayedTotal > 0 ? (currentIndex + 1) / displayedTotal : 0;
  const mobileSectionTitle =
    sections[activeSectionNumber - 1]?.title ?? "Assessment";

  return (
    <div className="pb-32 lg:pb-0">
      <QuestionnaireMobileHeader
        sectionTitle={mobileSectionTitle}
        progress={overallProgress}
        secondsLeft={secondsLeft}
        className="lg:hidden"
      />
      <div className="hidden lg:block">
        <QuestionnaireToolbar secondsLeft={secondsLeft} />
      </div>
      <div className="mx-auto flex max-w-300 flex-col gap-6 pb-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="hidden lg:block">
          <QuestionnaireSidebar
            sections={sections}
            activeSectionNumber={activeSectionNumber}
          />
        </div>
        <QuestionnaireQuestionCard
          question={question}
          value={currentValue}
          otherValue={otherAnswers[question.id] ?? ""}
          onChange={handleChange}
          onOtherChange={handleOtherChange}
          onNext={handleNext}
          onBack={handleBack}
          questionNumber={currentIndex + 1}
          totalQuestions={displayedTotal}
          isLast={displayedIsLast}
          showBack={currentIndex > 0}
          nextDisabled={!canProceed}
          nextLoading={isSubmitting}
        />
      </div>
      <QuestionnaireMobileActions
        questionNumber={currentIndex + 1}
        totalQuestions={displayedTotal}
        onBack={handleBack}
        onNext={handleNext}
        isLast={displayedIsLast}
        showBack={currentIndex > 0}
        nextDisabled={!canProceed}
        nextLoading={isSubmitting}
        className="lg:hidden"
      />
    </div>
  );
}
