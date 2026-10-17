import Link from "next/link";

import { Button } from "@/components/ui/button";

import Image from "next/image";

export function EmployerDashboardHero() {
  return (
    <section className="rounded-t-2xl bg-[#dfe4e2] px-5 py-6 sm:px-6 lg:pl-8 lg:py-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-semibold leading-normal text-[#081536]">
            Hire with confidence, verify skills before interviews.
          </h2>
          <p className="text-base leading-normal tracking-[0.017em] text-[#081536]">
            SkillSift helps you discover pre-assisted talent, create custom
            assessments, and shortlist talents who are ready to contribute from
            day one
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              asChild
              className="h-10 w-50 rounded-lg bg-primary px-2.5 text-base font-semibold tracking-[0.016em] text-white hover:bg-[#05060f]/90"
            >
              <Link href="/e/talents">Explore verified talent</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 w-50 rounded-lg border-[#05060f] bg-white px-2.5 text-base font-semibold tracking-[0.016em] text-[#151515] hover:bg-white/50"
            >
              <Link href="/e/roles">Create a Role</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/assets/employer-dashboard/employer-dashboard-hero.svg"
          alt="Verified talent profile with employability score and skill verification checklist"
          width={407}
          height={219}
          className="h-auto w-full hidden lg:block"
          priority
        />
      </div>
    </section>
  );
}
