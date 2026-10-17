"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Timer, X } from "lucide-react";

import { QuestionnaireMobileActions } from "@/components/assessments/questionnaire-mobile-actions";
import { QuestionnaireMobileHeader } from "@/components/assessments/questionnaire-mobile-header";
import { QuestionnaireQuestionCard } from "@/components/assessments/questionnaire-question-card";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_DEFAULT_DURATION_SECONDS } from "@/constants/question-bank";
import {
  useCheckPracticeAnswer,
  usePracticeSet,
} from "@/hooks/api/use-assessment";
import { authFailureMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { PracticeCheckResponseData, PracticeQuestion } from "@/types/api";
import type { Question } from "@/types/questionnaire";

const REAL_TEST_QUESTIONS = 20;
const READY_AT = 8;
const REVIEW_AT = 5;

const NAVY_BUTTON =
  "rounded-full bg-[#1B2935] text-white hover:bg-[#1B2935]/85";

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(safe / 60)}:${(safe % 60).toString().padStart(2, "0")}`;
}

function toQuestion(q: PracticeQuestion): Question {
  return {
    id: q.question_id,
    key: q.question_id,
    inputType: "single",
    prompt: q.question_text,
    required: true,
    options: q.options,
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-10 w-full max-w-2xl px-3 sm:my-16">
      {children}
    </div>
  );
}

function PracticeBar({ elapsed }: { elapsed?: number }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#CCB0EB] px-4 py-2 text-sm font-medium text-[#1B2935]">
      <p>Practice, not scored</p>
      {elapsed != null ? (
        <p className="inline-flex items-center gap-1.5 tabular-nums">
          <Timer className="size-4" aria-hidden />
          <span className="sr-only">Time so far:</span>
          {formatClock(elapsed)}
        </p>
      ) : null}
    </div>
  );
}

export function PracticeAssessment() {
  const { data, isLoading, error, refetch, isFetching } = usePracticeSet();
  const check = useCheckPracticeAnswer();

  const [phase, setPhase] = useState<"intro" | "run" | "review">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<Record<
    string,
    PracticeCheckResponseData
  > | null>(null);
  const [checkError, setCheckError] = useState<unknown>(null);

  const questions = useMemo(
    () => (data ? data.questions.map(toQuestion) : []),
    [data],
  );

  // Soft pace clock: counts up, never cuts the attempt off.
  useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [phase, startedAt]);

  if (isLoading) {
    return (
      <Shell>
        <p className="text-muted-foreground">Loading practice questions...</p>
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">
          Practice isn&apos;t available yet
        </h1>
        <p className="mt-2 text-muted-foreground">
          {error ? authFailureMessage(error) : "Please try again later."}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/t/assessments">Go to assessments</Link>
        </Button>
      </Shell>
    );
  }

  const total = questions.length;

  function start() {
    setStartedAt(Date.now());
    setElapsed(0);
    setPhase("run");
  }

  async function finish() {
    const finalElapsed = Math.floor((Date.now() - startedAt) / 1000);
    setElapsed(finalElapsed);
    setPhase("review");
    setCheckError(null);
    try {
      const checked = await Promise.all(
        questions.map(async (q) => {
          const outcome = await check.mutateAsync({
            questionId: q.id,
            answer: answers[q.id],
          });
          return [q.id, outcome] as const;
        }),
      );
      setResults(Object.fromEntries(checked));
    } catch (e) {
      setCheckError(e);
    }
  }

  function restart() {
    setPhase("intro");
    setIndex(0);
    setAnswers({});
    setResults(null);
    setCheckError(null);
    void refetch();
  }

  if (phase === "intro") {
    return (
      <Shell>
        <section className="rounded-3xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935] sm:p-8">
          <p className="inline-block rounded-full bg-[#CCB0EB] px-3 py-1 text-xs font-semibold">
            Practice, not scored
          </p>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            Before you start
          </h1>
          <ul className="mt-4 space-y-2 text-[#1B2935]/85">
            <li>{total} questions, about 15 minutes.</li>
            <li>
              Take it the way you would take the real thing: no searching for
              answers, no looking things up.
            </li>
            <li>
              You will see no answers until you finish. Then you get each
              correct answer with an explanation.
            </li>
            <li>
              Practice does not use up an attempt and does not change your
              level.
            </li>
          </ul>
          <Button onClick={start} className={cn("mt-6", NAVY_BUTTON)}>
            Start practice
            <ArrowRight className="size-4" />
          </Button>
        </section>
      </Shell>
    );
  }

  if (phase === "run") {
    const question = questions[index];
    const answered = answers[question.id];
    const isLast = index === total - 1;
    const go = () => (isLast ? void finish() : setIndex((i) => i + 1));
    const back = () => setIndex((i) => Math.max(0, i - 1));

    return (
      <div className="pb-32 lg:pb-0">
        <PracticeBar elapsed={elapsed} />
        <QuestionnaireMobileHeader
          sectionTitle="Practice questions"
          progress={(index + 1) / total}
          className="lg:hidden"
        />
        <div className="mx-auto flex max-w-300 flex-col gap-6 py-6 pb-10 lg:flex-row lg:items-start lg:gap-10">
          <aside className="hidden w-80 shrink-0 rounded-xl border border-border bg-white p-5 lg:block">
            <p className="mb-3 text-sm font-medium">Questions</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "step" : undefined}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border text-sm",
                    i === index && "border-[#1B2935] font-semibold",
                    i !== index && answers[q.id] && "bg-[#EEF7FF]",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </aside>
          <QuestionnaireQuestionCard
            question={question}
            value={answered}
            otherValue=""
            onChange={(v) =>
              setAnswers((a) => ({ ...a, [question.id]: v as string }))
            }
            onOtherChange={() => {}}
            onNext={go}
            onBack={back}
            questionNumber={index + 1}
            totalQuestions={total}
            isLast={isLast}
            showBack={index > 0}
            nextDisabled={!answered}
          />
        </div>
        <QuestionnaireMobileActions
          questionNumber={index + 1}
          totalQuestions={total}
          onBack={back}
          onNext={go}
          isLast={isLast}
          lastStepLabel="Finish practice"
          showBack={index > 0}
          nextDisabled={!answered}
          className="lg:hidden"
        />
      </div>
    );
  }

  // Review
  if (checkError) {
    return (
      <Shell>
        <h1 className="text-xl font-bold">We couldn&apos;t load your review</h1>
        <p role="alert" className="mt-2 text-sm text-red-600">
          {authFailureMessage(checkError)}
        </p>
        <Button
          onClick={() => void finish()}
          className={cn("mt-4", NAVY_BUTTON)}
        >
          Try again
        </Button>
      </Shell>
    );
  }

  if (!results) {
    return (
      <Shell>
        <p className="text-muted-foreground">Marking your answers...</p>
      </Shell>
    );
  }

  const correct = questions.filter((q) => results[q.id]?.correct).length;
  const verdict =
    correct >= READY_AT
      ? {
          title: "You look ready",
          body: "You answered at the level the real assessment expects. Go for it when you have a quiet 30 minutes.",
        }
      : correct >= REVIEW_AT
        ? {
            title: "Review before you test",
            body: "You are close. Read the explanations for the questions you missed, then try practice again.",
          }
        : {
            title: "More study first",
            body: "Work through the explanations below and the learning resources, then practise again before using an attempt.",
          };
  const avgSeconds = total > 0 ? Math.round(elapsed / total) : 0;
  const realAvg = Math.round(
    ASSESSMENT_DEFAULT_DURATION_SECONDS / REAL_TEST_QUESTIONS,
  );

  return (
    <div>
      <PracticeBar />
      <Shell>
        <section className="rounded-3xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935] sm:p-8">
          <p className="text-sm font-semibold text-[#1B2935]/70">
            Practice complete
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {correct} of {total} correct. {verdict.title}.
          </h1>
          <p className="mt-3 text-[#1B2935]/80">{verdict.body}</p>
          <p className="mt-3 text-sm text-[#1B2935]/80">
            You took {formatClock(elapsed)}, about {avgSeconds} seconds per
            question. The real test allows{" "}
            {formatClock(ASSESSMENT_DEFAULT_DURATION_SECONDS)} for{" "}
            {REAL_TEST_QUESTIONS} questions, about {realAvg} seconds each.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className={NAVY_BUTTON}>
              <Link href="/t/assessments/skill">
                Go to the assessment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={restart}
              disabled={isFetching}
            >
              Practice again
            </Button>
          </div>
        </section>

        <h2 className="mt-10 text-lg font-bold">Review your answers</h2>
        <ol className="mt-4 space-y-6">
          {questions.map((q, i) => {
            const r = results[q.id];
            const mine = answers[q.id];
            return (
              <li
                key={q.id}
                className="rounded-2xl border border-border bg-white p-4 sm:p-5"
              >
                <p className="text-sm text-muted-foreground">
                  Question {i + 1}
                </p>
                <p className="mt-1 font-semibold leading-relaxed">{q.prompt}</p>
                <ul className="mt-3 space-y-2">
                  {q.options?.map((option) => {
                    const isRight = option === r.correct_answer;
                    const isWrongPick = option === mine && !r.correct;
                    return (
                      <li
                        key={option}
                        className={cn(
                          "flex items-start gap-2 rounded-xl border p-3 text-sm",
                          isRight && "border-[#009F6A] bg-[#E7F7F0]",
                          isWrongPick && "border-[#FE9667] bg-[#FFF1EA]",
                          !isRight && !isWrongPick && "opacity-60",
                        )}
                      >
                        <span className="flex-1">
                          {option}
                          {isRight ? (
                            <span className="sr-only"> (correct answer)</span>
                          ) : null}
                          {isWrongPick ? (
                            <span className="sr-only"> (your answer)</span>
                          ) : null}
                        </span>
                        {isRight ? (
                          <Check
                            className="size-4 shrink-0 text-[#009F6A]"
                            aria-hidden
                          />
                        ) : isWrongPick ? (
                          <X
                            className="size-4 shrink-0 text-[#E4572E]"
                            aria-hidden
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                {r.explanation ? (
                  <p className="mt-3 rounded-xl bg-[#CCB0EB]/30 p-3 text-sm leading-relaxed">
                    {r.explanation}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Shell>
    </div>
  );
}
