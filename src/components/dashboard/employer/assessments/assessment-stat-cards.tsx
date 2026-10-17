import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
type StatCardDef = {
  key: string;
  label: string;
  value: number | null;
  deltaPct: number | null;
  description: string;
  /** Green value text, used for the live "Active" count. */
  positive?: boolean;
};

type AssessmentStatCardsProps = {
  total: number;
  active: number;
  /** Submissions received across all assessments. */
  completed: number;
  /** Talent invited across all assessments. */
  candidates: number;
  isLoading: boolean;
};

function TrendPill({ deltaPct }: { deltaPct: number }) {
  const isUp = deltaPct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
        isUp ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]",
      )}
    >
      {Math.abs(Math.round(deltaPct))}%
      <TrendingUp className={cn("size-3", !isUp && "rotate-180")} aria-hidden />
    </span>
  );
}

function StatCard({
  label,
  value,
  deltaPct,
  description,
  positive,
}: StatCardDef) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#D9D9D9] bg-white p-4">
      <p className="text-sm text-[#757575]">{label}</p>
      <div className="flex items-center gap-2">
        {value == null ? (
          <span className="h-8 w-12 animate-pulse rounded bg-[#EBEBEB]" />
        ) : (
          <span
            className={cn(
              "text-[32px] leading-tight font-semibold",
              positive ? "text-[#047857]" : "text-[#151515]",
            )}
          >
            {value.toLocaleString()}
          </span>
        )}
        {deltaPct != null ? <TrendPill deltaPct={deltaPct} /> : null}
      </div>
      <p className="text-sm text-[#757575]">{description}</p>
    </div>
  );
}

export function AssessmentStatCards({
  total,
  active,
  completed,
  candidates,
  isLoading,
}: AssessmentStatCardsProps) {
  const val = (n: number) => (isLoading ? null : n);

  const cards: StatCardDef[] = [
    {
      key: "total",
      label: "Total assessments",
      value: val(total),
      deltaPct: null,
      description: "Created by you",
    },
    {
      key: "active",
      label: "Active",
      value: val(active),
      deltaPct: null,
      description: "Currently running",
      positive: active > 0,
    },
    {
      key: "completed",
      label: "Completed",
      value: val(completed),
      deltaPct: null,
      description: "Submissions received",
    },
    {
      key: "candidates",
      label: "Total candidates",
      value: val(candidates),
      deltaPct: null,
      description: "Invited across all assessments",
    },
  ];

  return (
    <div className="rounded-2xl bg-[#F2F2F2] p-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ key, ...card }) => (
          <StatCard key={key} {...card} />
        ))}
      </div>
    </div>
  );
}
