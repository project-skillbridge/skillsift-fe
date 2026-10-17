import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TONES = {
  green: "#D3E6DF",
  sand: "#F9E796",
  violet: "#CBB0EB",
  rose: "#F6CFD3",
  grey: "#EDEEF2",
} as const;

export type StatTone = keyof typeof TONES;

type Props = {
  icon: LucideIcon;
  tone: StatTone;
  label: string;
  value: string;
  hint?: string;
  linkLabel?: string;
  linkHref?: string;
};

/** Matches the original overview card: icon chip, label, number, one line of context. */
export function StatTile({
  icon: Icon,
  tone,
  label,
  value,
  hint,
  linkLabel,
  linkHref,
}: Props) {
  return (
    <div className="flex flex-col gap-6 rounded-[10px] border border-[#D9D9D9] bg-white p-4">
      <div className="flex items-start gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-lg text-[#151515]"
          style={{ backgroundColor: TONES[tone] }}
        >
          <Icon className="size-7" aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-sans text-base leading-[150%] font-semibold tracking-[0.017em] text-[#151515]">
            {label}
          </p>
          <p className="font-sans text-[32px] leading-[150%] font-semibold text-[#151515]">
            {value}
          </p>
          {hint ? (
            <p className="font-sans text-base leading-[150%] font-normal text-[#151515]">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className="flex items-center gap-0.5 font-sans text-base leading-[150%] font-semibold tracking-[0.016em] text-[#05060F] underline"
        >
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
