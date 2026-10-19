export const EDIT_ROLE_STEPS = [
  "Role description",
  "Role details",
  "Talent assessment",
  "Preview",
] as const;

export const EDIT_ROLE_STEP_META = [
  {
    title: "Role description",
    description: "Update your role title and role description",
  },
  {
    title: "Role details",
    description: "Refine and setup your preferences for this job",
  },
  {
    title: "Choose assessment for this offer",
    description: "Choose the assessment you would like your talent to take",
  },
  {
    title: "Review and send invite",
    description: "Take a last look at your information before sending.",
  },
];

export const SELECT_TRIGGER_CLASS =
  "!h-11 w-full rounded-lg border-[#d9d9d9] bg-white text-base font-medium tracking-[0.017em] text-[#151515]";
