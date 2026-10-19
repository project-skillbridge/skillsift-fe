import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SHORTLIST_HERO } from "@/constants/employer-shortlist";

export function ShortlistHeroBanner() {
  return (
    <section
      className="relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-[#dfe4e2] px-6 py-6 text-[#0d2025] sm:px-8 sm:py-8"
      aria-label="Promotion"
    >
      <div className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans text-xl font-semibold leading-tight sm:text-2xl">
            {SHORTLIST_HERO.title}
          </h2>
          <p className="font-sans text-sm leading-6 text-[#0d2025]/70 sm:text-base">
            {SHORTLIST_HERO.description}
          </p>
        </div>
        <Button
          asChild
          className="h-10 w-fit rounded-md bg-[#0d2025] px-4 text-sm font-semibold text-white hover:bg-[#0d2025]/90"
        >
          <Link href={SHORTLIST_HERO.ctaHref}>{SHORTLIST_HERO.ctaLabel}</Link>
        </Button>
      </div>
      <div
        aria-hidden
        className="hidden h-32 w-48 shrink-0 sm:block lg:h-40 lg:w-64"
      >
        <Image
          src={SHORTLIST_HERO.illustration}
          alt=""
          width={256}
          height={160}
          className="size-full object-contain"
        />
      </div>
    </section>
  );
}
