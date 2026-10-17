export const CREATE_ROLE_STEPS = [
  { id: "upload-jd", title: "Upload JD" },
  { id: "work-preferences", title: "Setup work preferences" },
  { id: "talent-assessment", title: "Talent assessment" },
  { id: "preview", title: "Preview" },
] as const;

export type CreateRoleStepId = (typeof CREATE_ROLE_STEPS)[number]["id"];

export const JD_MAX_CHARS = 2000;

export const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

export const WORK_ARRANGEMENT_OPTIONS = [
  "Remote",
  "Hybrid",
  "On-site",
] as const;

export const EXPERIENCE_OPTIONS = [
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
] as const;

export { ROLE_EDUCATION_OPTIONS as EDUCATION_OPTIONS } from "./employer-roles";

export const KEYWORD_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "AWS",
  "UI/UX Design",
  "Product Management",
  "Data Analysis",
  "Mobile Development",
] as const;

export const CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "NGN",
  "CAD",
  "AUD",
] as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  CAD: "CA$",
  AUD: "A$",
};

export type AssessmentOption = {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
};

export const ASSESSMENT_OPTIONS: AssessmentOption[] = [
  {
    id: "practical",
    name: "Practical assessment",
    description:
      "To get verified score and become discoverable to top employers.",
    estimatedTime: "30 minutes",
  },
  {
    id: "portfolio-review",
    name: "Portfolio review",
    description:
      "Receive detailed feedback from industry experts to showcase your skills effectively.",
    estimatedTime: "1 hour",
  },
  {
    id: "skill-workshop",
    name: "Skill-building workshop",
    description:
      "Participate in hands-on sessions to improve key competencies relevant to your field.",
    estimatedTime: "2 hours",
  },
  {
    id: "skill-workshop-advanced",
    name: "Skill-building workshop",
    description:
      "Advanced hands-on sessions for deeper competency development in your domain.",
    estimatedTime: "3 hours",
  },
  {
    id: "technical-interview",
    name: "Technical interview prep",
    description:
      "Practice and prepare for technical interviews with structured guidance.",
    estimatedTime: "1 hour",
  },
];

export const CREATE_ROLE_STEP_META: Record<
  CreateRoleStepId,
  { title: string; description: string; tip: string }
> = {
  "upload-jd": {
    title: "Upload your Job description",
    description:
      "Upload JD document or copy and paste details of your job description.",
    tip: "Tip: A clear JD helps match the right candidates faster.",
  },
  "work-preferences": {
    title: "Setup work preferences",
    description:
      "Define the employment type, experience level, and compensation for this role.",
    tip: "Tip: Setting clear preferences reduces unqualified applicants.",
  },
  "talent-assessment": {
    title: "Choose assessment for this offer",
    description: "Choose the assessment you would like your talent to take.",
    tip: "Tip: Skill-based assessments improve hire quality significantly.",
  },
  preview: {
    title: "Preview and create role",
    description: "Choose the assessment you would like your talent to take.",
    tip: "Tip: Double-check your JD before going live.",
  },
};
