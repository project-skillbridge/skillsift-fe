import { cn } from "@/lib/utils";

export function ResultPill({ passed }: { passed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold",
        passed ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]",
      )}
    >
      {passed ? "Passed" : "Not passed"}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-[#EEF0F3]">
        <div
          className="h-full rounded-full bg-[#059669]"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-[#151515]">{score}%</span>
    </div>
  );
}

export function RankChip({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        rank === 1 ? "bg-[#111827] text-white" : "bg-[#F2F4F7] text-[#344054]",
      )}
    >
      {rank}
    </span>
  );
}

const INTEGRITY_STYLES = {
  clean: { label: "No flags", className: "bg-[#F2F4F7] text-[#344054]" },
  review: { label: "Needs review", className: "bg-[#FEF3C7] text-[#92400E]" },
  flagged: { label: "Flagged", className: "bg-[#FEE2E2] text-[#991B1B]" },
} as const;

export function IntegrityBadge({
  level,
}: {
  level: "clean" | "review" | "flagged" | null;
}) {
  if (!level)
    return <span className="text-xs text-[#98A2B3]">Not checked</span>;
  const { label, className } = INTEGRITY_STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}
