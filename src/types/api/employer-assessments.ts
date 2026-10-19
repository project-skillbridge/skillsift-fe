export type EmployerAssessmentStatus = "active" | "inactive";

export type EmployerAssessmentQuestionInput = {
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correctAnswer?: string | string[];
};

export type CreateEmployerAssessmentInput = {
  title: string;
  roleTrack: string;
  experienceLevel: "junior" | "mid" | "senior";
  timeLimitMinutes: 20 | 30 | 40 | 60;
  passingThreshold: number;
  welcomeMessage?: string;
  questionSource: "credlane_bank" | "company_questions";
  /** Required when `questionSource` is `credlane_bank`. */
  credlaneAssessmentId?: string;
  /** Library only: how many questions to take (5 up to what the entry has). */
  questionCount?: number;
  shareViaLink: boolean;
  sendToCandidates: boolean;
  type: "internal" | "external";
  /** Required (5 or more) when `questionSource` is `company_questions`. */
  questions?: EmployerAssessmentQuestionInput[];
  /** Required when `sendToCandidates` is true. */
  candidateUserIds?: string[];
};

/** Result of POST /employer/assessments/import-questions. */
export type ImportedQuestionsResult = {
  questions: EmployerAssessmentQuestionInput[];
  questionCount: number;
};

/** One row of GET /employer/assessments/search-talent. */
export type AssessmentTalentOption = {
  userId: string;
  fullName: string;
  roleTrack: string | null;
  verifiedLevel: string | null;
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
  submission_count?: number;
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

/** One ranked row from GET /employer/assessments/:id/results. */
export type AssessmentSubmission = {
  id: string;
  /** Talent are verified SkillSift users; external takers only left an email. */
  source: "talent" | "external";
  candidateUserId: string | null;
  candidateName: string | null;
  email: string | null;
  score: number;
  status: "pass" | "fail";
  timeTakenSeconds: number | null;
  dateCompleted: string;
  deliveryMode: string | null;
  /** 1-based by score across all submissions; ties share a rank. */
  rank: number;
  /** Null until there are at least 3 submissions to compare against. */
  percentile: number | null;
  /** Advisory only. Null for results from before integrity checks existed. */
  integrityLevel: "clean" | "review" | "flagged" | null;
  integrityReasons: string[];
  /** Set when a link taker later joined SkillSift with a verified account. */
  joinedSkillsiftUserId: string | null;
};

export type AssessmentResultsSummary = {
  total: number;
  averageScore: number | null;
  medianScore: number | null;
  topScore: number | null;
  passRate: number | null;
};

export type AssessmentResultQuestion = {
  questionId: string;
  position: number;
  questionText: string;
  questionType: string;
  options: string[] | null;
  /** Null for SkillSift library assessments: the key stays private. */
  correctAnswer: string | null;
  givenAnswer: string | null;
  isCorrect: boolean;
};

/** GET /employer/assessments/:id/results/:submissionId */
export type AssessmentResultDetail = AssessmentSubmission & {
  questions: AssessmentResultQuestion[];
  correctCount: number;
  questionCount: number;
  integrityEvents: {
    tabSwitches: number;
    awaySeconds: number;
    pasteAttempts: number;
    copyAttempts: number;
  } | null;
};

export type AssessmentResultsParams = {
  page?: number;
  limit?: number;
  status?: "pass" | "fail";
  source?: "talent" | "external";
  sort?: "score" | "date";
};

export type EmployerAssessmentDetail = {
  assessment: EmployerAssessmentItem;
  shareUrl: string | null;
  isExternal: boolean;
  questions: EmployerAssessmentQuestion[];
  submissions: AssessmentSubmission[];
  submissionsTotal: number;
};

export type ListEmployerAssessmentResultsResponse = {
  submissions: AssessmentSubmission[];
  summary: AssessmentResultsSummary;
  total: number;
  emptyState?: string | null;
};

export type DraftAssessmentQuestionsInput = {
  jobDescription: string;
  experienceLevel?: "junior" | "mid" | "senior";
  count?: number;
};

export type DraftAssessmentQuestionsResult = {
  questions: EmployerAssessmentQuestionInput[];
  dropped: number;
};

/** A ready-made SkillSift assessment an employer can pick instead of writing questions. */
export type LibraryAssessmentItem = {
  id: string;
  title: string;
  description: string | null;
  estimatedCompletionTime: string;
  roleTrack: string;
  experienceLevel: string;
  questionCount: number;
};

/** Preview of a library assessment. SkillSift never sends the answer key. */
export type LibraryAssessmentDetail = LibraryAssessmentItem & {
  questions: {
    position: number;
    questionText: string;
    questionType: "multiple_choice" | "true_false" | "short_answer";
    options: string[] | null;
  }[];
};

/** GET /employer/assessments/overview */
export type EmployerAssessmentsOverview = {
  last30Days: {
    assessed: number;
    passRate: number | null;
    averageScore: number | null;
    /** Results whose integrity level is "review" or "flagged". */
    needsReview: number;
  };
  activeAssessments: number;
  recent: Array<{
    id: string;
    assessmentId: string;
    assessmentTitle: string;
    source: "talent" | "external";
    candidateName: string | null;
    email: string | null;
    score: number;
    passed: boolean;
    integrityLevel: "clean" | "review" | "flagged" | null;
    completedAt: string;
  }>;
};
