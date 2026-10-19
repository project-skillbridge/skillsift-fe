export type AssessmentPreviewWarning = {
  title: string;
  description: string;
};

export type AssessmentPreviewRule = {
  title: string;
  detail: string;
};

export type AssessmentPreview = {
  slug: string;
  title: string;
  description: string;
  iconSrc: string;
  questionCount: string;
  duration: string;
  attempts: string;
  retakeText?: string;
  warning?: AssessmentPreviewWarning;
  /** "What to expect" rules shown before the start button. */
  rules?: AssessmentPreviewRule[];
  /** Heading shown above the bulleted expectations on the preview card. */
  sectionTitle: string;
  /** Per-assessment expectation/guideline bullets. */
  points: string[];
  /** Footer consent paragraph. Use the `{terms}` and `{helpCenter}` tokens
   *  to embed the inline links — the footer renderer substitutes them with
   *  the canonical hrefs (currently `/terms-of-use` and `/contact`). */
  consent: string;
};

const PERSONAL_POINTS = [
  "There are no right or wrong answers—focus on providing accurate information.",
  "Your responses help us customize assessments to match your specialization and experience.",
  "A complete profile leads to a more relevant and personalized evaluation process.",
  "Your data is securely stored and protected at all times.",
];

const SKILL_POINTS = [
  "This assessment measures your current knowledge and practical understanding of your chosen role.",
  "Your performance helps determine whether your skills align with beginner, intermediate, or advanced expectations.",
  "Once started, do not switch tabs, open other windows, or leave the assessment page.",
];

const ADVANCED_POINTS = [
  "This assessment measures your ability to apply your skills in realistic professional scenarios.",
  "Your results determine your final employability status on SkillSift.",
  "Leaving the assessment page, switching tabs, or taking screenshots will trigger warnings.",
  "After three warnings, your assessment will automatically end and be submitted.",
];

const PERSONAL_CONSENT =
  "By continuing, you confirm that you acknowledge and accept the {terms}. Kindly visit the {helpCenter} if you require any assistance.";

// Skill + advanced share the same consent wording per the marketing copy.
const ASSESSMENT_CONSENT =
  "By starting this assessment, you agree to follow the assessment rules and the {terms}. Kindly visit the {helpCenter} if you require any assistance.";

export const ASSESSMENT_PREVIEWS = {
  personal: {
    slug: "personal",
    title: "Personal Assessment",
    description:
      "Help us understand your background, specialization, tools, and work preferences so we can personalize your assessment journey.",
    iconSrc: "/assets/assessments/personal-assessment-icon.svg",
    questionCount: "15 Questions",
    duration: "No duration",
    attempts: "1 attempt",
    sectionTitle: "Before You Begin",
    points: PERSONAL_POINTS,
    consent: PERSONAL_CONSENT,
  },
  skill: {
    slug: "skill",
    title: "Skill Level Evaluation",
    description:
      "Demonstrate your current ability and validate your professional skill level.",
    iconSrc: "/assets/assessments/skill-assessment-icon.svg",
    questionCount: "20 Questions",
    duration: "30 minutes",
    attempts: "3 attempts (allowed within time limit)",
    rules: [
      {
        title: "Timed",
        detail:
          "A 30-minute countdown stays on screen and runs on our server, so reloading or reopening the page does not reset it. Your answers are submitted automatically at zero.",
      },
      {
        title: "Reloading won't lose your answers",
        detail:
          "Your answers are saved on this device as you go. If the page reloads or your connection drops, reopen the assessment on the same browser to pick up where you stopped.",
      },
      {
        title: "Pass mark",
        detail:
          "Score 50% or more to verify your level and earn your skill certificate.",
      },
      {
        title: "Stay on this page",
        detail:
          "Leaving the tab counts as a violation. Three violations submit your assessment.",
      },
    ],
    sectionTitle: "Important Information",
    points: SKILL_POINTS,
    consent: ASSESSMENT_CONSENT,
  },
  advanced: {
    slug: "advanced",
    title: "Job Readiness Evaluation",
    description:
      "Demonstrate your ability to perform at the level expected by employers.",
    iconSrc: "/assets/assessments/advanced-assessment-icon.svg",
    questionCount: "15 Questions (8 MCQ · 7 Open-ended)",
    duration: "60 minutes",
    attempts: "1 attempt (allowed within time limit)",
    rules: [
      {
        title: "Timed",
        detail:
          "You have 60 minutes. The clock keeps running if you lose connection or close the page, but your answers are saved on this device so you can pick up on the same browser.",
      },
      {
        title: "How it is scored",
        detail:
          "The 8 multiple-choice questions count for 30% and the 7 written answers for 70%. Take your time on the written ones.",
      },
      {
        title: "Stay on this page",
        detail:
          "Leaving the tab or taking screenshots triggers a warning. Three warnings end and submit your assessment.",
      },
      {
        title: "Retakes",
        detail:
          "If you do not reach job-ready, you can retake after 14 days. Use that time to practice.",
      },
    ],
    retakeText: "Retake valid after 14 days",
    sectionTitle: "Assessment Guidelines",
    points: ADVANCED_POINTS,
    consent: ASSESSMENT_CONSENT,
  },
} satisfies Record<string, AssessmentPreview>;

export type AssessmentSlug = keyof typeof ASSESSMENT_PREVIEWS;

/** Fallback questionnaire section label when a question carries no section title. */
export const ASSESSMENT_FALLBACK_SECTION_TITLES: Record<
  AssessmentSlug,
  string
> = {
  personal: "Personal Assessment",
  skill: "Skill Level Evaluation",
  advanced: "Job Readiness Evaluation",
};

export function isAssessmentSlug(slug: string): slug is AssessmentSlug {
  return slug in ASSESSMENT_PREVIEWS;
}

export function getAssessmentPreview(slug: AssessmentSlug): AssessmentPreview {
  return ASSESSMENT_PREVIEWS[slug];
}
