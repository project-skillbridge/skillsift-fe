import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EMPLOYER_ACTION_ITEMS } from "@/constants/employer-dashboard";
import { cn } from "@/lib/utils";

function EmployerActionCard({
  title,
  description,
  actionLabel,
  href,
  iconSrc,
  iconBg,
}: (typeof EMPLOYER_ACTION_ITEMS)[number]) {
  return (
    <article className="flex h-full flex-col justify-between gap-6 rounded-[10px] border border-[#d9d9d9] bg-white p-4">
      <div className="flex gap-4">
        <div
          className="relative flex size-14 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBg }}
        >
          <Image
            src={iconSrc}
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
            aria-hidden
          />
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="text-base font-semibold leading-normal tracking-[0.017em] text-[#151515]">
            {title}
          </h3>
          <p className="text-base leading-normal text-[#151515]">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={href}
        className={cn(
          "group inline-flex items-center gap-0.5 text-base font-semibold tracking-[0.016em] text-[#05060f]",
          "underline underline-offset-2 transition-opacity hover:opacity-70",
        )}
      >
        {actionLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

export function EmployerDashboardActions() {
  return (
    <section className="rounded-2xl bg-[#f2f2f2] p-4 sm:p-6">
      <h2 className="text-xl font-semibold leading-normal text-[#151515]">
        What can you do on SkillSift
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
        {EMPLOYER_ACTION_ITEMS.map((item) => (
          <EmployerActionCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
