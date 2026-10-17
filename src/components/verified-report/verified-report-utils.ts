import type {
  VerifiedProfileAssessmentInsights,
  VerifiedProfileDetailedSkill,
  VerifiedProfileResponseData,
  VerifiedProfileSkillBreakdownTab,
} from "@/types/api";

const ASSESSMENT_INSIGHT_KEYS = [
  "skill_proficiency",
  "workplace_readiness",
  "practical_application",
] as const satisfies ReadonlyArray<keyof VerifiedProfileAssessmentInsights>;

function tabToDetailedSkill(
  tab: VerifiedProfileSkillBreakdownTab,
): VerifiedProfileDetailedSkill {
  return {
    title: tab.label,
    skill_info: tab.items.map((item) => ({
      label: item.label,
      value: item.percentage,
      insight: item.insight,
      validated_level: item.validated_level,
    })),
  };
}

/** "mid" -> "Mid-level", "senior" -> "Senior". Mirrors the formatting
 *  already used for assessment results (`skill-assessment-summary.tsx`). */
export function formatValidatedLevel(level: string): string {
  const formatted = level
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return /\blevel\b/i.test(formatted) ? formatted : `${formatted}-level`;
}

const QUALITATIVE_LEVEL_THRESHOLDS = [
  { min: 85, label: "Expert" },
  { min: 70, label: "Advanced" },
  { min: 50, label: "Proficient" },
  { min: 30, label: "Developing" },
  { min: 0, label: "Foundational" },
] as const;

/** Fallback for when the assessor didn't attach a `validated_level` to this
 *  specific competency — buckets the raw score into a plain-language tier
 *  instead of showing a bare percentage with no context. */
export function getQualitativeLevel(value: number): string {
  return (
    QUALITATIVE_LEVEL_THRESHOLDS.find((tier) => value >= tier.min)?.label ??
    "Foundational"
  );
}

export function levelLabelForSkillInfo(item: {
  value: number;
  validated_level?: string;
}): string {
  return item.validated_level
    ? formatValidatedLevel(item.validated_level)
    : getQualitativeLevel(item.value);
}

function getAssessmentInsightPercentage(
  data: VerifiedProfileResponseData,
  key: keyof VerifiedProfileAssessmentInsights,
): number {
  switch (key) {
    case "skill_proficiency":
      return data.skill_proficiency?.skill_assessment_percentage ?? 0;
    case "workplace_readiness":
      return data.workplace_readiness?.percentage ?? 0;
    case "practical_application":
      return data.practical_application?.percentage ?? 0;
  }
}

function buildAssessmentScoresTab(
  data: VerifiedProfileResponseData,
): VerifiedProfileDetailedSkill | null {
  const insights = data.assessment_insights;

  if (insights) {
    const skill_info = ASSESSMENT_INSIGHT_KEYS.flatMap((key) => {
      const insight = insights[key];
      if (!insight) return [];

      return [
        {
          label: insight.label,
          value: getAssessmentInsightPercentage(data, key),
          insight: insight.insight,
        },
      ];
    });

    if (skill_info.length === 0) return null;

    return { title: "Assessment Scores", skill_info };
  }

  if (
    !data.skill_proficiency &&
    !data.workplace_readiness &&
    !data.practical_application
  ) {
    return null;
  }

  const skill_info = [
    {
      label: "Skill Proficiency",
      value: data.skill_proficiency?.skill_assessment_percentage ?? 0,
    },
    {
      label: data.workplace_readiness?.label ?? "Workplace Readiness",
      value: data.workplace_readiness?.percentage ?? 0,
    },
    {
      label: data.practical_application?.label ?? "Practical Application",
      value: data.practical_application?.percentage ?? 0,
    },
  ];

  return { title: "Assessment Scores", skill_info };
}

function buildProfessionalSkillsTab(
  data: VerifiedProfileResponseData,
): VerifiedProfileDetailedSkill | null {
  if (!data.professional_skills?.length) return null;

  return {
    title: "Professional Skills",
    skill_info: data.professional_skills.map((item) => ({
      label: item.label,
      value: item.percentage,
    })),
  };
}

function buildStrengthsTab(
  data: VerifiedProfileResponseData,
): VerifiedProfileDetailedSkill | null {
  if (!data.key_strengths?.length) return null;

  return {
    title: "Strengths",
    skill_info: data.key_strengths.map((item) => ({
      label: item.label,
      value: item.percentage,
    })),
  };
}

function buildTabsFromLegacyFields(
  data: VerifiedProfileResponseData,
): VerifiedProfileDetailedSkill[] {
  return [
    buildAssessmentScoresTab(data),
    buildProfessionalSkillsTab(data),
    buildStrengthsTab(data),
  ].filter((tab): tab is VerifiedProfileDetailedSkill => tab !== null);
}

/** Maps API data to tabbed skill breakdown for SkillsDisplay. */
export function getSkillBreakdownTabs(
  data: VerifiedProfileResponseData,
): VerifiedProfileDetailedSkill[] {
  if (data.skill_breakdown_tabs.length > 0) {
    return data.skill_breakdown_tabs
      .map(tabToDetailedSkill)
      .filter((tab) => tab.skill_info.length > 0);
  }

  if (data.detailed_skills?.length) {
    return data.detailed_skills;
  }

  return buildTabsFromLegacyFields(data);
}

export type TopStrength = {
  label: string;
  value: number;
  insight?: string;
  levelLabel: string;
};

/** Highest-scoring competencies across every skill-breakdown tab, flattened
 *  and ranked — surfaced above the fold instead of requiring a tab click to
 *  discover. */
export function getTopStrengths(
  data: VerifiedProfileResponseData,
  limit = 3,
): TopStrength[] {
  return getSkillBreakdownTabs(data)
    .flatMap((tab) => tab.skill_info)
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((item) => ({
      label: item.label,
      value: item.value,
      insight: item.insight,
      levelLabel: levelLabelForSkillInfo(item),
    }));
}

export function getAboutTags(data: VerifiedProfileResponseData): string[] {
  if (data.about_tags.length > 0) return data.about_tags;
  if (data.about.trim()) return [data.about.trim()];
  return [];
}

export function getAiReport(data: VerifiedProfileResponseData): string {
  return data.ai_report || data.ai_summary || "";
}

const QUALITATIVE_STEPS = [
  "Foundational",
  "Developing",
  "Proficient",
  "Advanced",
  "Expert",
] as const;

/** How many of the five meter steps to fill for a qualitative label. Labels
 *  from the API ("Mid-level", "Senior") map onto the same scale. */
export function qualitativeStepCount(label: string, value: number): number {
  const exact = QUALITATIVE_STEPS.findIndex(
    (step) => step.toLowerCase() === label.toLowerCase(),
  );
  if (exact >= 0) return exact + 1;
  const normalized = label.toLowerCase();
  if (normalized.startsWith("junior")) return 2;
  if (normalized.startsWith("mid")) return 3;
  if (normalized.startsWith("senior")) return 4;
  if (normalized.startsWith("expert")) return 5;
  return (
    QUALITATIVE_STEPS.findIndex((step) => step === getQualitativeLevel(value)) +
    1
  );
}

const LEVEL_MEANING: Record<string, string> = {
  junior:
    "Handles well-defined tasks with guidance and is building solid fundamentals.",
  mid: "Delivers features independently, debugs real problems and works well in a team.",
  senior:
    "Owns features end to end, weighs trade-offs and helps the team make good decisions.",
  expert:
    "Shapes technical direction across teams and handles the hardest, highest-risk problems.",
};

/** One plain sentence on what the verified level means to an employer. */
export function describeLevel(level?: string | null): string | null {
  if (!level) return null;
  const key = level
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .trim()
    .split(" ")[0];
  return LEVEL_MEANING[key] ?? null;
}
