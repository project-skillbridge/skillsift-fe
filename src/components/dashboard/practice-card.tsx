import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PracticeCardProps = {
  className?: string;
  /** Stacked layout for narrow columns. */
  compact?: boolean;
};

/** Entry to the ungraded practice set. Uses no attempts and affects no results. */
export function PracticeCard({ className, compact }: PracticeCardProps) {
  return (
    <section
      aria-labelledby="practice-heading"
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935]",
        !compact && "sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2
          id="practice-heading"
          className="text-[18px] font-bold tracking-tight"
        >
          Practice before you test
        </h2>
        <p className="body-3 mt-1 max-w-xl text-[#1B2935]/75">
          Ten questions at your level, with an explanation after each one. They
          don&apos;t use up an attempt and don&apos;t change your result.
        </p>
      </div>
      <Link
        href="/t/assessments/practice"
        className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#1B2935] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      >
        Start practice
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
