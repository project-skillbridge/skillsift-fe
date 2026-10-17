"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AssessmentIntroCard } from "@/components/assessment-taker/assessment-intro-card";
import { AssessmentRunner } from "@/components/assessment-taker/assessment-runner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useRegisterExternalApplicant,
  useSubmitExternalAssessment,
} from "@/hooks/api/use-external-assessment";
import type {
  ExternalRegistration,
  PublicAssessment,
} from "@/types/api/assessment-taker";

import { ExternalConfirmationStep } from "./external-confirmation-step";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = { token: string; assessment: PublicAssessment };

/** Takers without a SkillSift account: email, optional consent, then the timed test. */
export function ExternalAssessmentPage({ token, assessment }: Props) {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [registration, setRegistration] = useState<ExternalRegistration | null>(
    null,
  );
  const [done, setDone] = useState(false);
  const [failures, setFailures] = useState(0);

  const { mutate: register, isPending: isRegistering } =
    useRegisterExternalApplicant();
  const { mutate: submit, isPending: isSubmitting } =
    useSubmitExternalAssessment();

  const start = () =>
    register(
      { token, email: email.trim(), consentedMarketing: marketing },
      {
        onSuccess: (data) => {
          if (data.submitted) setDone(true);
          else setRegistration(data);
        },
        onError: () =>
          toast.error("We couldn't start the assessment. Try again."),
      },
    );

  if (done)
    return (
      <ExternalConfirmationStep
        email={registration?.email ?? email}
        employerName={assessment.employer_name}
      />
    );

  if (!registration) {
    return (
      <AssessmentIntroCard
        assessment={assessment}
        canStart={EMAIL_PATTERN.test(email.trim())}
        isStarting={isRegistering}
        onStart={start}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="taker-email">Your email</Label>
            <Input
              id="taker-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
          <label className="flex items-start gap-3 text-sm text-[#475467]">
            <Checkbox
              checked={marketing}
              onCheckedChange={(value) => setMarketing(value === true)}
              className="mt-0.5"
            />
            Send me job opportunities from SkillSift (optional).
          </label>
        </div>
      </AssessmentIntroCard>
    );
  }

  return (
    <AssessmentRunner
      title={assessment.title}
      questions={assessment.questions}
      timeLimitSeconds={registration.time_limit_minutes * 60}
      remainingSeconds={registration.remaining_seconds}
      storageKey={`skillsift:assessment:${token}:${registration.external_applicant_id}`}
      isSubmitting={isSubmitting}
      failureCount={failures}
      onSubmit={({ answers, integrity }) =>
        submit(
          {
            token,
            sessionToken: registration.session_token,
            externalApplicantId: registration.external_applicant_id,
            answers,
            integrity,
          },
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
