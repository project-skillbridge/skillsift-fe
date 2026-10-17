import { AssessmentPreviewExpectations } from "@/components/assessments/assessment-preview-expectations";
import { AssessmentPreviewFooter } from "@/components/assessments/assessment-preview-footer";
import { AssessmentPreviewHeader } from "@/components/assessments/assessment-preview-header";
import { AssessmentPreviewMeta } from "@/components/assessments/assessment-preview-meta";
import { AssessmentPreviewRules } from "@/components/assessments/assessment-preview-rules";
import { AssessmentPreviewWarning } from "@/components/assessments/assessment-preview-warning";
import { Card, CardContent } from "@/components/ui/card";
import type { AssessmentPreview } from "@/constants/assessment-previews";

type AssessmentPreviewCardProps = {
  assessment: AssessmentPreview;
  /** Optional override for the footer CTA's destination. */
  startHref?: string;
  /** Optional override for the footer CTA's label. */
  startLabel?: string;
  /** When true, the footer CTA renders as disabled (no navigation). */
  startDisabled?: boolean;
};

function AssessmentPreviewCard({
  assessment,
  startHref,
  startLabel,
  startDisabled,
}: AssessmentPreviewCardProps) {
  return (
    <Card className="w-full rounded-xl border border-[#D9D9D9] bg-white py-0 shadow-none 2xl:rounded-[24px]">
      <CardContent className="px-4 py-4 sm:px-5 lg:px-6 2xl:p-8">
        <AssessmentPreviewHeader assessment={assessment} />
        <AssessmentPreviewMeta assessment={assessment} />
        <AssessmentPreviewRules rules={assessment.rules} />
        <AssessmentPreviewExpectations
          sectionTitle={assessment.sectionTitle}
          points={assessment.points}
        />
        <AssessmentPreviewWarning warning={assessment.warning} />
        <AssessmentPreviewFooter
          assessmentSlug={assessment.slug}
          consent={assessment.consent}
          startHref={startHref}
          startLabel={startLabel}
          startDisabled={startDisabled}
        />
      </CardContent>
    </Card>
  );
}

export { AssessmentPreviewCard };
export type { AssessmentPreviewCardProps };
