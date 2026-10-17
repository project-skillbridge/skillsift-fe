export type CreateAssessmentStepId = "questions" | "recipients" | "preview";

type AssessmentType = "internal" | "external";

const QUESTIONS_STEP = { id: "questions", title: "Questions" } as const;
const RECIPIENTS_STEP = { id: "recipients", title: "Who takes it" } as const;
const PREVIEW_STEP = { id: "preview", title: "Review" } as const;

/** Link assessments skip the recipient step; anyone with the link can take it. */
export function getCreateAssessmentSteps(type: AssessmentType) {
  return type === "internal"
    ? [QUESTIONS_STEP, RECIPIENTS_STEP, PREVIEW_STEP]
    : [QUESTIONS_STEP, PREVIEW_STEP];
}

export type CreateAssessmentStep = ReturnType<
  typeof getCreateAssessmentSteps
>[number];

export const CREATE_ASSESSMENT_STEP_META: Record<
  CreateAssessmentStepId,
  { title: string; description: string }
> = {
  questions: {
    title: "Choose your questions",
    description:
      "Pick a ready-made SkillSift assessment, or write your own. Your own needs at least 5 questions.",
  },
  recipients: {
    title: "Choose who takes it",
    description:
      "Pick verified SkillSift talent to invite. They get a notification right away.",
  },
  preview: {
    title: "Review and publish",
    description: "Take a last look before this goes out.",
  },
};
