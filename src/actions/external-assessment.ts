import { authApi, publicApi } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api";
import type {
  ExternalRegistration,
  IntegrityEvents,
  PublicAssessment,
  TalentAttempt,
} from "@/types/api/assessment-taker";
import type { ExternalAssessmentSubmission } from "@/types/api/external-applicant";
import { unwrapData } from "./utils";

/** Works for both link types; `type` says which flow to run. */
export async function getPublicAssessment(token: string) {
  const res = await publicApi.get<ApiEnvelope<PublicAssessment>>(
    `/assessments/link/${token}`,
  );
  return unwrapData(res);
}

export async function registerExternalApplicant(input: {
  token: string;
  email: string;
  consentedMarketing: boolean;
}) {
  const { token, email, consentedMarketing } = input;
  const res = await publicApi.post<ApiEnvelope<ExternalRegistration>>(
    `/assessments/external/${token}/register`,
    { email, consented_marketing: consentedMarketing },
  );
  return unwrapData(res);
}

export async function submitExternalAssessment(input: {
  token: string;
  sessionToken: string;
  externalApplicantId: string;
  answers: Record<string, string>;
  integrity: IntegrityEvents;
}) {
  const { token, sessionToken, externalApplicantId, answers, integrity } =
    input;
  const res = await publicApi.post<ApiEnvelope<ExternalAssessmentSubmission>>(
    `/assessments/external/${token}/submit`,
    {
      external_applicant_id: externalApplicantId,
      responses: [
        {
          moduleId: token,
          // Nested keys inside arrays aren't case-converted server side.
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        },
      ],
      integrity,
    },
    { headers: { "x-session-token": sessionToken } },
  );
  return unwrapData(res);
}

export async function startTalentAssessment(token: string) {
  const res = await authApi.post<ApiEnvelope<TalentAttempt>>(
    `/assessments/link/${token}/start`,
  );
  return unwrapData(res);
}

export async function submitTalentAssessment(input: {
  token: string;
  answers: Record<string, string>;
  timeTakenSeconds: number;
  integrity: IntegrityEvents;
}) {
  const { token, answers, timeTakenSeconds, integrity } = input;
  const res = await authApi.post<ApiEnvelope<{ id: string; score: number }>>(
    `/assessments/link/${token}/submissions`,
    {
      time_taken_seconds: timeTakenSeconds,
      delivery_mode: "link",
      answers,
      integrity,
    },
  );
  return unwrapData(res);
}
