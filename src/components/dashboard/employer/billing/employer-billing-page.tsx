"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerBillingSummary } from "@/hooks/api/use-employer-billing";
import { formatAbsoluteDate } from "@/lib/format-date";
import { PlanCards } from "@/components/pricing/plan-cards";

export function EmployerBillingPage() {
  const { data, isLoading, isError } = useEmployerBillingSummary();

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6 py-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="mx-auto max-w-5xl py-12 text-center text-sm text-[#757575]">
        Couldn&apos;t load your billing details. Please try again.
      </p>
    );
  }

  const planTotal = data.monthlyUnlocks;
  const planLeft = Math.max(planTotal - data.usedThisPeriod, 0);
  const pct = planTotal ? Math.min(100, (planLeft / planTotal) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#151515]">
          Plan and unlocks
        </h1>
        <p className="text-sm text-[#757575]">
          An unlock reveals one talent&apos;s full name, photo, resume,
          portfolio and contact.
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-2xl border border-[#E4E7EC] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#757575]">Unlocks available</p>
            <p className="text-4xl font-semibold text-[#151515]">
              {data.unlocksRemaining}
            </p>
          </div>
          <div className="text-right text-sm text-[#757575]">
            <p>
              Plan:{" "}
              <span className="font-medium text-[#151515]">
                {data.planName}
              </span>
            </p>
            <p>{data.totalUnlocked} talent unlocked so far</p>
          </div>
        </div>

        {planTotal > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-[#475467]">
              <span>
                {planLeft} of {planTotal} monthly unlocks left
              </span>
              {data.periodResetsAt ? (
                <span>Resets {formatAbsoluteDate(data.periodResetsAt)}</span>
              ) : null}
            </div>
            <div className="h-2 w-full rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#19A878]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}

        {data.bonusCredits > 0 ? (
          <p className="text-sm text-[#475467]">
            Plus {data.bonusCredits} extra unlock
            {data.bonusCredits === 1 ? "" : "s"} that never expire.
          </p>
        ) : null}
      </section>

      <PlanCards currentPlanId={data.plan} />
    </div>
  );
}
