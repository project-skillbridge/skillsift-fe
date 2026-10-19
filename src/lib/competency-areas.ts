import type { SkillCompetencyResult } from "@/types/api";

const ACRONYMS = new Set([
  "api",
  "aws",
  "ci",
  "cd",
  "css",
  "dom",
  "html",
  "http",
  "i18n",
  "json",
  "seo",
  "sql",
  "ssr",
  "ui",
  "ux",
]);

/** "css_layout" -> "CSS layout": sentence case, with known acronyms upper-cased. */
export function formatCompetency(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim().split(/\s+/);
  return words
    .map((w, i) => {
      if (ACRONYMS.has(w.toLowerCase())) return w.toUpperCase();
      return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w;
    })
    .join(" ");
}

// First match wins, so more specific areas come before broader ones.
const AREAS: [RegExp, string][] = [
  [/access|a11y/, "Accessibility"],
  [/performance/, "Performance"],
  [/security|cookies/, "Security"],
  [
    /test|code_quality|code_review|debug|devtools|observab/,
    "Testing and quality",
  ],
  [/^react|state_management|hooks/, "React"],
  [/css|html|forms|responsive|design_systems/, "HTML and CSS"],
  [/javascript|typescript|async|^dom/, "JavaScript and TypeScript"],
  [/data_fetching|api|http|storage/, "Data and APIs"],
  [/git|tooling|build|release|env/, "Tooling and delivery"],
  [
    /architecture|rendering|ssr|migration|i18n|internationalization|estimation/,
    "Architecture and rendering",
  ],
  [/collab|teamwork|leadership|communication/, "Teamwork and leadership"],
];

export function competencyArea(slug: string): string {
  const key = slug.toLowerCase();
  return AREAS.find(([re]) => re.test(key))?.[1] ?? formatCompetency(slug);
}

/**
 * Roll narrow competencies (often one question each per attempt) up into
 * broader areas, weakest first, so each row reflects several questions.
 */
export function groupCompetencies(
  items: SkillCompetencyResult[],
): SkillCompetencyResult[] {
  const byArea = new Map<string, { correct: number; total: number }>();
  for (const item of items) {
    const area = competencyArea(item.competency);
    const acc = byArea.get(area) ?? { correct: 0, total: 0 };
    acc.correct += item.correct;
    acc.total += item.total;
    byArea.set(area, acc);
  }
  return [...byArea.entries()]
    .map(([competency, { correct, total }]) => ({
      competency,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage || b.total - a.total);
}
