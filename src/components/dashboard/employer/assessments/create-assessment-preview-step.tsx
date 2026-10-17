"use client";

import { levelLabel, trackLabel } from "@/constants/employer-roles";
import { ASSESSMENT_TIME_LIMIT_OPTIONS } from "@/constants/employer-assessments";

type CreateAssessmentPreviewStepProps = {
  roleTrack: string;
  level: string;
  timeLimitMinutes: number;
  passRate: number;
  questionCount: number;
  recipientCount: number | null;
  type: "internal" | "external";
};

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="font-sans text-xs text-[#667085]">{label}</p>
      <p className="font-sans text-sm font-semibold text-[#101828]">{value}</p>
    </div>
  );
}

export function CreateAssessmentPreviewStep({
  roleTrack,
  level,
  timeLimitMinutes,
  passRate,
  questionCount,
  recipientCount,
  type,
}: CreateAssessmentPreviewStepProps) {
  const timeLabel =
    ASSESSMENT_TIME_LIMIT_OPTIONS.find(
      (o) => o.value === String(timeLimitMinutes),
    )?.label ?? `${timeLimitMinutes} minutes`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:grid-cols-3">
        <SummaryItem label="Role track" value={trackLabel(roleTrack) || "—"} />
        <SummaryItem label="Level" value={levelLabel(level) || "—"} />
        <SummaryItem label="Time limit" value={timeLabel} />
        <SummaryItem label="Pass mark" value={`${passRate}%`} />
        <SummaryItem label="Questions" value={String(questionCount)} />
        <SummaryItem
          label="Delivery"
          value={
            type === "internal"
              ? `Invite ${recipientCount ?? 0} talent`
              : "Shareable link"
          }
        />
      </div>
      <p className="font-sans text-sm leading-6 text-[#667085]">
        {type === "internal"
          ? "Invited talent are notified straight away and see this under their assessments."
          : "You will get a link to share with anyone. Candidates register with their name and email before they start."}
      </p>
    </div>
  );
}
