import type { AssessmentPreview } from "@/constants/assessment-previews";
import type {
  PublicAssessment,
  TakerQuestion,
} from "@/types/api/assessment-taker";
import type { Question } from "@/types/questionnaire";

/** Maps an employer question onto the shape the talent questionnaire renders. */
export function toQuestionnaireQuestion(
  question: TakerQuestion,
  sectionTitle: string,
): Question {
  const isText = question.question_type === "short_answer";
  return {
    id: question.id,
    key: question.id,
    sourceSection: 1,
    sourceSectionTitle: sectionTitle,
    inputType: isText ? "text_required" : "single",
    prompt: question.question_text,
    required: true,
    options: isText ? undefined : (question.options ?? ["True", "False"]),
    rawOptions: true,
    minLength: isText ? 1 : undefined,
  };
}

/** Intro-card copy for an employer assessment, in the same shape talent previews use. */
export function buildEmployerAssessmentPreview(
  assessment: PublicAssessment,
): AssessmentPreview {
  const minutes = assessment.time_limit_minutes;
  const count = assessment.questions.length;
  return {
    slug: "employer",
    title: assessment.title,
    description: assessment.employer_name
      ? `${assessment.employer_name} invited you to complete this skills assessment.`
      : "You were invited to complete this skills assessment.",
    iconSrc: "/assets/assessments/skill-assessment-icon.svg",
    questionCount: `${count} Questions`,
    duration: `${minutes} minutes`,
    attempts: "1 attempt",
    rules: [
      {
        title: "Timed",
        detail: `A ${minutes}-minute countdown runs on our server, so reloading or reopening the page does not reset it. Your answers are submitted automatically at zero.`,
      },
      {
        title: "Reloading won't lose your answers",
        detail:
          "Your answers are saved on this device as you go. If the page reloads or your connection drops, reopen the link on the same browser to pick up where you stopped.",
      },
      {
        title: "Pass mark",
        detail: `${assessment.passing_threshold}% or more passes. The employer sees your score.`,
      },
      {
        title: "Stay on this page",
        detail:
          "We note tab switches and copy or paste attempts and share them with the employer as a prompt for a closer look, not as proof of anything.",
      },
    ],
    sectionTitle: "Before you begin",
    points: [
      "Answer every question to move on. You can go back to change an answer before you submit.",
      "Work on your own and without outside help, as you would in a real interview.",
      "Your result goes to the employer who invited you.",
    ],
    consent:
      "By starting, you agree to follow the assessment rules and the {terms}. Kindly visit the {helpCenter} if you require any assistance.",
  };
}
