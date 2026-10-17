import { authApi } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api";
import type {
  CreateEmployerAssessmentInput,
  EmployerAssessmentItem,
  ListEmployerAssessmentsResponse,
  ListEmployerAssessmentResultsResponse,
  RawEmployerAssessment,
  InviteToAssessmentInput,
  AssessmentTalentOption,
  ImportedQuestionsResult,
  EmployerAssessmentDetail,
  AssessmentResultDetail,
  DraftAssessmentQuestionsInput,
  DraftAssessmentQuestionsResult,
  AssessmentResultsParams,
  AssessmentSubmission,
  LibraryAssessmentDetail,
  LibraryAssessmentItem,
} from "@/types/api/employer-assessments";
import { unwrapData } from "./utils";

function normalizeAssessment(
  raw: RawEmployerAssessment,
): EmployerAssessmentItem {
  return {
    id: raw.id,
    title: raw.title,
    roleTrack: raw.role_track,
    experienceLevel: raw.experience_level,
    timeLimitMinutes: raw.time_limit_minutes,
    passingThreshold: raw.passing_threshold,
    status: raw.is_active ? "active" : "inactive",
    token: raw.share_token ?? null,
    questionsCount: raw.questions?.length ?? 0,
    submissionsCount: raw.submission_count ?? raw.submissions_count ?? null,
    talentsCount: raw.talents_count ?? null,
    passRate: raw.pass_rate ?? null,
    closesAt: raw.closes_at ?? null,
    lastActivityAt: raw.last_activity_at ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function createEmployerAssessment(
  input: CreateEmployerAssessmentInput,
): Promise<EmployerAssessmentItem> {
  const body: Record<string, unknown> = {
    title: input.title,
    roleTrack: input.roleTrack,
    experienceLevel: input.experienceLevel,
    timeLimitMinutes: input.timeLimitMinutes,
    passingThreshold: input.passingThreshold,
    questionSource: input.questionSource,
    shareViaLink: input.shareViaLink,
    sendToCandidates: input.sendToCandidates,
    type: input.type,
  };

  if (input.questions && input.questions.length) {
    body.questions = input.questions;
  }
  if (input.credlaneAssessmentId) {
    body.credlaneAssessmentId = input.credlaneAssessmentId;
  }
  if (input.questionCount) {
    body.questionCount = input.questionCount;
  }
  if (input.candidateUserIds && input.candidateUserIds.length) {
    body.candidateUserIds = input.candidateUserIds;
  }

  const res = await authApi.post<ApiEnvelope<RawEmployerAssessment>>(
    "/employer/assessments",
    body,
  );
  return normalizeAssessment(unwrapData(res));
}

export async function getEmployerAssessments(params?: {
  page?: number;
  limit?: number;
}): Promise<{ assessments: EmployerAssessmentItem[]; total: number }> {
  const res = await authApi.get<ApiEnvelope<ListEmployerAssessmentsResponse>>(
    "/employer/assessments",
    { params },
  );
  const data = unwrapData(res);
  const assessments = (data.assessments ?? []).map(normalizeAssessment);
  return {
    assessments,
    // The backend doesn't send `total` — fall back to the page's own
    // count so "is this account empty" never depends on a field that
    // isn't actually on the wire.
    total: data.total ?? assessments.length,
  };
}

export async function getEmployerAssessment(
  assessmentId: string,
): Promise<EmployerAssessmentItem> {
  const res = await authApi.get<ApiEnvelope<RawEmployerAssessment>>(
    `/employer/assessments/${assessmentId}`,
  );
  return normalizeAssessment(unwrapData(res));
}

/** Detail view: the assessment plus its questions and submissions. */
export async function getEmployerAssessmentDetail(
  assessmentId: string,
): Promise<EmployerAssessmentDetail> {
  const res = await authApi.get<
    ApiEnvelope<
      RawEmployerAssessment & {
        type?: string;
        results?: { submissions?: AssessmentSubmission[]; total?: number };
      }
    >
  >(`/employer/assessments/${assessmentId}`);
  const raw = unwrapData(res);
  const submissions = raw.results?.submissions ?? [];
  const assessment = normalizeAssessment(raw);
  return {
    assessment: {
      ...assessment,
      submissionsCount: raw.results?.total ?? submissions.length,
    },
    shareUrl: raw.shareUrl ?? null,
    isExternal: raw.type === "external",
    questions: (raw.questions ?? []).map((q) => {
      const r = q as unknown as Record<string, unknown>;
      return {
        ...q,
        questionText: String(r.question_text ?? q.questionText ?? ""),
        options: (r.options as string[] | null) ?? q.options ?? null,
      };
    }),
    submissions,
    submissionsTotal: raw.results?.total ?? submissions.length,
  };
}

export async function deactivateEmployerAssessment(
  assessmentId: string,
): Promise<void> {
  await authApi.patch(`/employer/assessments/${assessmentId}/deactivate`);
}

export async function getEmployerAssessmentResults(
  assessmentId: string,
  params?: AssessmentResultsParams,
): Promise<ListEmployerAssessmentResultsResponse> {
  const res = await authApi.get<
    ApiEnvelope<ListEmployerAssessmentResultsResponse>
  >(`/employer/assessments/${assessmentId}/results`, { params });
  return unwrapData(res);
}

export async function getEmployerAssessmentResultDetail(
  assessmentId: string,
  submissionId: string,
): Promise<AssessmentResultDetail> {
  const res = await authApi.get<ApiEnvelope<AssessmentResultDetail>>(
    `/employer/assessments/${assessmentId}/results/${submissionId}`,
  );
  return unwrapData(res);
}

export async function getAssessmentToken(
  assessmentId: string,
): Promise<{ token: string }> {
  const res = await authApi.get<ApiEnvelope<{ token: string }>>(
    `/employer/assessments/${assessmentId}/token`,
  );
  return unwrapData(res);
}

export async function inviteToAssessment(
  input: InviteToAssessmentInput,
): Promise<void> {
  const { assessmentId, talentIds, emails } = input;
  const body: Record<string, unknown> = {};
  if (talentIds && talentIds.length > 0) body.talent_ids = talentIds;
  if (emails && emails.length > 0) body.emails = emails;

  await authApi.post(`/employer/assessments/${assessmentId}/invite`, body);
}

type RawLibraryItem = {
  id: string;
  title: string;
  description: string | null;
  estimated_completion_time: string;
  role_track: string;
  experience_level: string;
  question_count: number;
};

function normalizeLibraryItem(raw: RawLibraryItem): LibraryAssessmentItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    estimatedCompletionTime: raw.estimated_completion_time,
    roleTrack: raw.role_track,
    experienceLevel: raw.experience_level,
    questionCount: raw.question_count,
  };
}

/** Ready-made SkillSift assessments for a role track and level. */
export async function getLibraryAssessments(params: {
  roleTrack?: string;
  experienceLevel?: string;
}): Promise<LibraryAssessmentItem[]> {
  const res = await authApi.get<ApiEnvelope<{ catalogue: RawLibraryItem[] }>>(
    "/employer/assessments/credlane-catalogue",
    {
      params: { ...params, limit: 50 },
    },
  );
  return (unwrapData(res).catalogue ?? []).map(normalizeLibraryItem);
}

export async function getLibraryAssessment(
  id: string,
): Promise<LibraryAssessmentDetail> {
  const res = await authApi.get<
    ApiEnvelope<
      RawLibraryItem & {
        questions: LibraryAssessmentDetail["questions"];
      }
    >
  >(`/employer/assessments/credlane-catalogue/${id}`);
  const raw = unwrapData(res);
  return { ...normalizeLibraryItem(raw), questions: raw.questions };
}

/** AI starting point only; nothing is saved and the employer reviews it. */
export async function draftAssessmentQuestions(
  input: DraftAssessmentQuestionsInput,
): Promise<DraftAssessmentQuestionsResult> {
  const res = await authApi.post<ApiEnvelope<DraftAssessmentQuestionsResult>>(
    "/employer/assessments/draft-questions",
    input,
  );
  return unwrapData(res);
}

/** Parses a CSV/XLSX question file server-side; nothing is saved yet. */
export async function importAssessmentQuestions(
  file: File,
): Promise<ImportedQuestionsResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await authApi.post<ApiEnvelope<ImportedQuestionsResult>>(
    "/employer/assessments/import-questions",
    formData,
  );
  return unwrapData(res);
}

type RawTalentSearchRow = {
  user_id: string;
  full_name: string;
  /** Verified level (`junior` | `mid` | ...). */
  role: string | null;
  role_track: string | null;
};

export async function searchAssessmentTalent(
  q: string,
  track?: string,
): Promise<AssessmentTalentOption[]> {
  const res = await authApi.get<ApiEnvelope<{ results: RawTalentSearchRow[] }>>(
    "/employer/assessments/search-talent",
    { params: { q, limit: 20, track: track || undefined } },
  );
  return unwrapData(res).results.map((row) => ({
    userId: row.user_id,
    fullName: row.full_name,
    roleTrack: row.role_track,
    verifiedLevel: row.role,
  }));
}
