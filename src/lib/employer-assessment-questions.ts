import { MIN_COMPANY_QUESTIONS } from "@/constants/employer-assessments";
import type { EmployerAssessmentQuestionInput } from "@/types/api/employer-assessments";

export type DraftQuestionType = EmployerAssessmentQuestionInput["questionType"];

export type DraftQuestion = {
  /** Local key only; never sent to the API. */
  id: string;
  questionText: string;
  questionType: DraftQuestionType;
  /** Multiple choice: 2 to 4 options. True/false: fixed. Short answer: empty. */
  options: string[];
  correctAnswer: string;
};

export const QUESTION_TYPE_OPTIONS: {
  value: DraftQuestionType;
  label: string;
}[] = [
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "true_false", label: "True / False" },
  { value: "short_answer", label: "Short answer" },
];

export const MAX_MC_OPTIONS = 4;

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);
}

export function optionsForType(type: DraftQuestionType): string[] {
  if (type === "true_false") return ["True", "False"];
  if (type === "multiple_choice") return ["", ""];
  return [];
}

export function createDraftQuestion(
  type: DraftQuestionType = "multiple_choice",
): DraftQuestion {
  return {
    id: newId(),
    questionText: "",
    questionType: type,
    options: optionsForType(type),
    correctAnswer: type === "true_false" ? "True" : "",
  };
}

export function fromImportedQuestion(
  q: EmployerAssessmentQuestionInput,
): DraftQuestion {
  return {
    id: newId(),
    questionText: q.questionText,
    questionType: q.questionType,
    options: q.options ?? optionsForType(q.questionType),
    correctAnswer: Array.isArray(q.correctAnswer)
      ? (q.correctAnswer[0] ?? "")
      : (q.correctAnswer ?? ""),
  };
}

export function isDraftQuestionValid(q: DraftQuestion): boolean {
  if (!q.questionText.trim() || !q.correctAnswer.trim()) return false;
  if (q.questionType === "short_answer") return true;
  const options = q.options.map((o) => o.trim());
  if (options.some((o) => o.length === 0)) return false;
  if (new Set(options).size !== options.length) return false;
  return options.includes(q.correctAnswer.trim());
}

export function areCompanyQuestionsValid(questions: DraftQuestion[]): boolean {
  return (
    questions.length >= MIN_COMPANY_QUESTIONS &&
    questions.every(isDraftQuestionValid)
  );
}

export function toApiQuestions(
  questions: DraftQuestion[],
): EmployerAssessmentQuestionInput[] {
  return questions.map((q) => ({
    questionText: q.questionText.trim(),
    questionType: q.questionType,
    options:
      q.questionType === "short_answer"
        ? undefined
        : q.options.map((o) => o.trim()),
    correctAnswer: q.correctAnswer.trim(),
  }));
}
