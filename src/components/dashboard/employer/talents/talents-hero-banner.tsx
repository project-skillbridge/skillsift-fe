"use client";

import Link from "next/link";
import { BadgeCheck, Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  /** Candidates matching the current filters; shown once known. */
  total?: number;
};

/** Compact intro band: what this page is, and the way to the shortlist. */
export function TalentsHeroBanner({ total }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0B1220] px-6 py-7 text-white sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full bg-[#19A878]/25 blur-3xl"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            <BadgeCheck className="size-3.5 text-[#6EE7B7]" aria-hidden />
            {total == null
              ? "Skills-assessed talent"
              : `${total.toLocaleString()} skills-assessed talent`}
          </p>
          <h1 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
            Find talent who can already do the job
          </h1>
          <p className="text-sm text-white/70 sm:text-base">
            Everyone here passed a skills assessment. Filter by role and level,
            then shortlist the people you want to talk to.
          </p>
        </div>
        <Button
          asChild
          className="h-11 w-fit rounded-xl bg-white px-5 font-semibold text-[#0B1220] hover:bg-white/90"
        >
          <Link href="/e/shortlist">
            <Bookmark className="size-4" aria-hidden />
            View shortlist
          </Link>
        </Button>
      </div>
    </section>
  );
}
