import type { AssessmentPreviewRule } from "@/constants/assessment-previews";

type AssessmentPreviewRulesProps = {
  rules?: AssessmentPreviewRule[];
};

function AssessmentPreviewRules({ rules }: AssessmentPreviewRulesProps) {
  if (!rules?.length) return null;

  return (
    <section aria-labelledby="preview-rules-heading" className="mt-6">
      <h2
        id="preview-rules-heading"
        className="font-sans text-sm font-bold text-foreground 2xl:text-base"
      >
        What to expect
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {rules.map((rule, i) => (
          <li
            key={rule.title}
            className={
              i % 2 === 0
                ? "rounded-xl border border-[#D5E5F4] bg-[#EEF7FF] p-4"
                : "rounded-xl bg-[#CCB0EB]/30 p-4"
            }
          >
            <p className="font-sans text-sm font-bold text-[#1B2935]">
              {rule.title}
            </p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-[#1B2935]/75 2xl:text-sm">
              {rule.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { AssessmentPreviewRules };
