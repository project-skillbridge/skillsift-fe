"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import {
  formatPlanPrice,
  PRICING_CONTACT_EMAIL,
  PRICING_PLANS,
} from "@/constants/employer-pricing";
import { cn } from "@/lib/utils";

type PlanCardsProps = {
  /** Highlights the employer's current plan and swaps the buttons for "Current plan". */
  currentPlanId?: string;
  /** Where the primary button goes for signed-out visitors. */
  signUpHref?: string;
};

export function PlanCards({ currentPlanId, signUpHref }: PlanCardsProps) {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="Currency"
        className="mx-auto inline-flex rounded-full border border-[#E4E7EC] bg-white p-1"
      >
        {(["USD", "NGN"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={currency === c}
            onClick={() => setCurrency(c)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              currency === c ? "bg-[#05060F] text-white" : "text-[#475467]",
            )}
          >
            {c === "USD" ? "US dollars" : "Naira"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          return (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col gap-5 rounded-2xl border bg-white p-6",
                plan.highlighted
                  ? "border-[#19A878] shadow-[0_8px_30px_rgba(25,168,120,0.12)]"
                  : "border-[#E4E7EC]",
              )}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#151515]">
                    {plan.name}
                  </h3>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-xs font-semibold text-[#065F46]">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-[#757575]">{plan.tagline}</p>
              </div>
              <p className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-[#151515]">
                  {formatPlanPrice(plan, currency)}
                </span>
                {plan.priceUsd > 0 ? (
                  <span className="text-sm text-[#757575]">/ month</span>
                ) : null}
              </p>
              <p className="rounded-lg bg-[#F2F4F7] px-3 py-2 text-sm font-medium text-[#151515]">
                {plan.unlocksLabel}
              </p>
              <ul className="flex flex-1 flex-col gap-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[#475467]"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[#19A878]"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <span className="rounded-lg border border-[#E4E7EC] py-2.5 text-center text-sm font-semibold text-[#475467]">
                  Current plan
                </span>
              ) : plan.id === "free" && signUpHref ? (
                <Link
                  href={signUpHref}
                  className="rounded-lg bg-[#05060F] py-2.5 text-center text-sm font-semibold text-white"
                >
                  Start free
                </Link>
              ) : plan.id === "free" ? null : (
                <a
                  href={`mailto:${PRICING_CONTACT_EMAIL}?subject=${encodeURIComponent(`SkillSift ${plan.name} plan`)}`}
                  className="rounded-lg bg-[#05060F] py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get {plan.name}
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
