"use client";

import { Box, LogOut } from "lucide-react";
import Link from "next/link";

type CreateAssessmentHeaderProps = {
  title: string;
  subtitle?: string;
};

export function CreateAssessmentHeader({
  title,
  subtitle,
}: CreateAssessmentHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-4 lg:gap-4 lg:py-6">
      <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#667085] lg:size-10">
          <Box className="size-4 lg:size-5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-semibold text-[#101828] lg:text-base">
            {title}
          </p>
          {subtitle ? (
            <p className="truncate font-sans text-xs text-[#667085] lg:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <Link
        href="/e/assessments"
        className="inline-flex shrink-0 items-center gap-1.5 font-sans text-xs font-medium text-[#667085] transition-colors hover:text-[#101828] lg:gap-2 lg:text-sm"
      >
        Exit
        <LogOut className="size-3.5 lg:size-4" aria-hidden />
      </Link>
    </div>
  );
}
