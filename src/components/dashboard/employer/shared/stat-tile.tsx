import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  green: { chip: "bg-[#DDF5EA] text-[#0E7A55]", bar: "bg-[#19A878]" },
  blue: { chip: "bg-[#E0EDFF] text-[#1D4FD8]", bar: "bg-[#3B82F6]" },
  amber: { chip: "bg-[#FFF0D1] text-[#B45309]", bar: "bg-[#F59E0B]" },
  rose: { chip: "bg-[#FDE2E7] text-[#BE123C]", bar: "bg-[#F43F5E]" },
  violet: { chip: "bg-[#EDE5FF] text-[#6D28D9]", bar: "bg-[#8B5CF6]" },
} as const;

export type StatTone = keyof typeof TONES;

type Props = {
  icon: LucideIcon;
  tone: StatTone;
  label: string;
  value: string;
  hint?: string;
};

/** A headline number with an icon chip and one line of context. */
export function StatTile({ icon: Icon, tone, label, value, hint }: Props) {
  const colors = TONES[tone];
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <span className={cn("absolute inset-x-0 top-0 h-1", colors.bar)} />
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-sm font-medium text-[#667085]">{label}</p>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            colors.chip,
          )}
        >
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-sans text-3xl font-bold tracking-tight text-[#0B1220]">
          {value}
        </p>
        {hint ? (
          <p className="font-sans text-xs text-[#667085]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
