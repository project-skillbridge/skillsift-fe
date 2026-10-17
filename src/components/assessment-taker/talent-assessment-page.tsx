"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useStartTalentAssessment,
  useSubmitTalentAssessment,
} from "@/hooks/api/use-external-assessment";
import type {
  PublicAssessment,
  TalentAttempt,
} from "@/types/api/assessment-taker";

import { AssessmentIntroCard } from "./assessment-intro-card";
import { AssessmentRunner } from "./assessment-runner";

type Props = { token: string; assessment: PublicAssessment };

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
      <h1 className="text-xl font-semibold text-[#151515]">{title}</h1>
      <p className="text-sm text-[#475467]">{body}</p>
      {action}
    </div>
  );
}

/** Invited SkillSift talent: needs a talent sign-in so the result lands on their profile. */
export function TalentAssessmentPage({ token, assessment }: Props) {
  const { data: session, status } = useSession();
  const [attempt, setAttempt] = useState<TalentAttempt | null>(null);
  const [done, setDone] = useState(false);
  const [failures, setFailures] = useState(0);
  const { mutate: start, isPending: isStarting } = useStartTalentAssessment();
  const { mutate: submit, isPending: isSubmitting } =
    useSubmitTalentAssessment();

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <Notice
        title="Sign in to take this assessment"
        body="This assessment was sent to a SkillSift account. Sign in to start."
        action={
          <Button asChild>
            <Link href={`/login?callbackUrl=/assessment/${token}`}>
              Sign in
            </Link>
          </Button>
        }
      />
    );
  }

  if (done) {
    return (
      <Notice
        title="Assessment submitted"
        body="Your answers were sent to the employer. They'll be in touch if you move forward."
        action={
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="size-4" />
            <Button asChild variant="outline">
              <Link href="/t/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        }
      />
    );
  }

  if (!attempt) {
    return (
      <AssessmentIntroCard
        assessment={assessment}
        canStart
        isStarting={isStarting}
        onStart={() =>
          start(token, {
            onSuccess: setAttempt,
            onError: (error) =>
              toast.error(
                error instanceof Error
                  ? error.message
                  : "We couldn't start the assessment.",
              ),
          })
        }
      />
    );
  }

  return (
    <AssessmentRunner
      title={assessment.title}
      questions={assessment.questions}
      timeLimitSeconds={attempt.time_limit_seconds}
      remainingSeconds={attempt.remaining_seconds}
      storageKey={`skillsift:assessment:${token}:${session.user.id ?? "talent"}`}
      isSubmitting={isSubmitting}
      failureCount={failures}
      onSubmit={({ answers, integrity, timeTakenSeconds }) =>
        submit(
          { token, answers, integrity, timeTakenSeconds },
          {
            onSuccess: () => setDone(true),
            onError: () => {
              setFailures((n) => n + 1);
              toast.error(
                "Submission failed. Check your connection and retry.",
              );
            },
          },
        )
      }
    />
  );
}
