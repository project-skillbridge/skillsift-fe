export type TakerQuestionType =
  "multiple_choice" | "true_false" | "short_answer";

export type TakerQuestion = {
  id: string;
  position: number;
  question_text: string;
  question_type: TakerQuestionType;
  options: string[] | null;
};

export type PublicAssessment = {
  id: string;
  title: string;
  type: "internal" | "external";
  employer_name: string | null;
  welcome_message?: string | null;
  /** Link assessments hide their questions until sign in. */
  question_count?: number;
  requires_access_code?: boolean;
  role_track: string;
  experience_level: string;
  time_limit_minutes: number;
  passing_threshold: number;
  questions: TakerQuestion[];
};

/** Browser signals sent with a submission. The server treats them as advisory. */
export type IntegrityEvents = {
  tabSwitches: number;
  awaySeconds: number;
  pasteAttempts: number;
  copyAttempts: number;
};

export type ExternalRegistration = {
  session_token: string;
  external_applicant_id: string;
  email: string;
  time_limit_minutes: number;
  remaining_seconds: number;
  submitted: boolean;
  questions: TakerQuestion[];
};

export type TalentAttempt = {
  started_at: string;
  time_limit_seconds: number;
  remaining_seconds: number;
};
