"use client";

import Link from "next/link";
import Image from "next/image";

export function TalentsHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#DFE4E2] px-5 py-6 sm:px-6 sm:py-8">
      <div className="relative z-10 flex flex-col gap-6 sm:max-w-[55%]">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold text-[#081536] sm:text-2xl">
            Verified candidate discovery
          </h2>
          <p className="text-sm font-normal tracking-[0.017em] text-[#081536] sm:text-base">
            Every candidate here has passed a skills assessment. Shortlist the
            ones you want to talk to.
          </p>
        </div>

        <Link
          href="/e/shortlist"
          className="flex w-fit items-center justify-center rounded-lg bg-[#05060F] px-4 py-2 text-sm font-semibold text-white sm:text-base"
        >
          View Shortlist
        </Link>
      </div>

      <div className="pointer-events-none absolute top-0 right-0 hidden h-full w-[40%] max-w-105 sm:block">
        <Image
          src="/assets/images/employer-talent-hero.svg"
          alt="Hero Preview Illustration"
          fill
          className="object-contain object-right"
          priority
        />
      </div>
    </section>
  );
}
