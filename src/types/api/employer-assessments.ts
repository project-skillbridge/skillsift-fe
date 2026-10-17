export type EmployerAssessmentStatus = "active" | "inactive";

export type EmployerAssessmentQuestionInput = {
  questionText: string;
  questionType: "single_pick" | "multi_pick" | "required_text";
  options?: string[];
  correctAnswer?: string | string[];
  points?: number;
};

export type CreateEmployerAssessmentInput = {
  title: string;
  roleTrack: string;
  experienceLevel: "junior" | "mid" | "senior";
  timeLimitMinutes: 20 | 30 | 40 | 60;
  passingThreshold: number;
  questionSource:
    "credlane_bank" | "company_questions" | "manual" | "admin_upload";
  shareViaLink: boolean;
  sendToCandidates: boolean;
  type: "internal" | "external";
  questions?: EmployerAssessmentQuestionInput[];
};

export type InviteToAssessmentInput = {
  assessmentId: string;
  talentIds?: string[];
  emails?: string[];
};

export type EmployerAssessmentQuestion = {
  id: string;
  questionText: string;
  questionType: "single_pick" | "multi_pick" | "required_text";
  options: string[] | null;
  points: number;
};

/**
 * Matches the actual backend swagger contract — confirmed by inspection,
 * NOT the shape this file assumed before. Notably: no `status` enum (it's
 * `is_active: boolean`), no `token` (it's `share_token`, plus a redundant
 * `shareUrl`), and no `type`/`submissions_count` on the wire at all.
 */
export type RawEmployerAssessment = {
  id: string;
  employer_user_id: string;
  title: string;
  role_track: string;
  experience_level: string;
  time_limit_minutes: number;
  passing_threshold: number;
  question_source: string;
  share_via_link: boolean;
  send_to_candidates: boolean;
  is_active: boolean;
  share_token: string | null;
  shareUrl?: string | null;
  questions?: EmployerAssessmentQuestion[];
  /** None of the below are on the wire yet. Kept optional so the UI can
   *  light up the moment backend adds them, without another rewrite. */
  submissions_count?: number;
  talents_count?: number;
  /** 0–100. */
  pass_rate?: number;
  /** ISO date-time the assessment closes/closed. */
  closes_at?: string | null;
  /** ISO date-time of the most recent activity on this assessment. */
  last_activity_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type EmployerAssessmentItem = {
  id: string;
  title: string;
  roleTrack: string;
  experienceLevel: string;
  timeLimitMinutes: number;
  passingThreshold: number;
  status: EmployerAssessmentStatus;
  token: string | null;
  questionsCount: number;
  /** `null`, not 0, when the backend hasn't sent this — "no data" and
   *  "zero" are different facts and the UI shouldn't blur them. */
  submissionsCount: number | null;
  talentsCount: number | null;
  passRate: number | null;
  closesAt: string | null;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Aggregate counts for the assessments overview cards (active/completed
 * counts, total candidates, trend deltas). Confirmed there's no backend
 * endpoint for this — the swagger contract has nothing matching it, and
 * the `/employer/assessments/stats` guess this file previously called was
 * almost certainly hitting `/employer/assessments/{id}` with `id="stats"`,
 * which explains the 400 (invalid id, not "not found"). Kept as a typed
 * shape so the UI has something to bind to the moment backend adds this;
 * nothing currently constructs one.
 */
export type EmployerAssessmentsStats = {
  totalAssessments: number;
  totalAssessmentsDeltaPct: number | null;
  active: number;
  activeDeltaPct: number | null;
  completed: number;
  completedDeltaPct: number | null;
  totalCandidates: number;
  totalCandidatesDeltaPct: number | null;
};

/** The real response has no `total`/`page`/`limit` — just `assessments`
 *  and an (currently unused) `emptyState`. Kept optional rather than
 *  assumed, in case backend adds real pagination later. */
export type ListEmployerAssessmentsResponse = {
  assessments: RawEmployerAssessment[];
  total?: number;
  page?: number;
  limit?: number;
};

export type AssessmentResultItem = {
  candidateId: string;
  candidateName: string;
  score: number;
  passed: boolean;
  submittedAt: string;
};

export type ListEmployerAssessmentResultsResponse = {
  results: AssessmentResultItem[];
  total: number;
};
