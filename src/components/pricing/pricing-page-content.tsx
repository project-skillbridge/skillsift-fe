import Link from "next/link";
import { Check, Minus } from "lucide-react";

import {
  PRICING_COMPARISON,
  PRICING_FAQ,
  PRICING_WHY_PAY,
} from "@/constants/employer-pricing";

import { InvitePacks } from "./invite-packs";
import { PlanCards } from "./plan-cards";

export function PricingPageContent() {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <section className="bg-[#EFEFEF] px-6 pt-20 pb-12 text-center md:pt-28">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Hire people who&apos;ve already proven their skills
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
          Every feature is on every plan. You pay for how many candidates you
          assess, in naira or dollars, with no annual contract.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <PlanCards signUpHref="/signup" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-4">
        <InvitePacks />
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#151515]">
          What&apos;s free and what you pay for
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAFA] text-[#52525B]">
              <tr>
                <th className="px-4 py-3 font-medium">Feature</th>
                <th className="px-4 py-3 text-center font-medium">Free</th>
                <th className="px-4 py-3 text-center font-medium">
                  On a paid plan
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICING_COMPARISON.map((row) => (
                <tr key={row.label} className="border-t border-[#EEF0F3]">
                  <td className="px-4 py-3 text-[#151515]">{row.label}</td>
                  {[row.free, row.paid].map((on, i) => (
                    <td key={i} className="px-4 py-3">
                      <span className="flex justify-center">
                        {on ? (
                          <Check
                            className="size-4 text-[#19A878]"
                            aria-label="Included"
                          />
                        ) : (
                          <Minus
                            className="size-4 text-[#A1A1AA]"
                            aria-label="Not included"
                          />
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#151515]">
          Why employers pay
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PRICING_WHY_PAY.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E4E7EC] bg-white p-6"
            >
              <h3 className="text-base font-semibold text-[#151515]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[#475467]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#151515]">
          Questions
        </h2>
        <dl className="flex flex-col gap-4">
          {PRICING_FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-[#E4E7EC] bg-white p-5"
            >
              <dt className="text-sm font-semibold text-[#151515]">{item.q}</dt>
              <dd className="mt-1 text-sm text-[#475467]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-6 py-16 text-center">
        <Link
          href="/signup"
          className="inline-flex rounded-lg bg-[#05060F] px-6 py-3 text-sm font-semibold text-white"
        >
          Start hiring free
        </Link>
      </section>
    </main>
  );
}
