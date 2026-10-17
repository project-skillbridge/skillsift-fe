"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerBillingSummary } from "@/hooks/api/use-employer-billing";
import { formatAbsoluteDate } from "@/lib/format-date";
import { InvitePacks } from "@/components/pricing/invite-packs";
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

  const inviteTotal = data.monthlyInvites;
  const inviteLeft = Math.max(inviteTotal - data.invitesUsedThisPeriod, 0);
  const invitePct = inviteTotal
    ? Math.min(100, (inviteLeft / inviteTotal) * 100)
    : 0;
  const unlockTotal = data.monthlyUnlocks;
  const unlockLeft = Math.max(unlockTotal - data.usedThisPeriod, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#151515]">
          Plan and invites
        </h1>
        <p className="text-sm text-[#757575]">
          Each candidate you invite or admit to an assessment uses one invite.
          Results, compare and export are free on every plan.
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-2xl border border-[#E4E7EC] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#757575]">Invites available</p>
            <p className="text-4xl font-semibold text-[#151515]">
              {data.invitesRemaining}
            </p>
          </div>
          <div className="text-right text-sm text-[#757575]">
            <p>
              Plan:{" "}
              <span className="font-medium text-[#151515]">
                {data.planName}
              </span>
            </p>
            {data.periodResetsAt ? (
              <p>Resets {formatAbsoluteDate(data.periodResetsAt)}</p>
            ) : null}
          </div>
        </div>

        {inviteTotal > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-[#475467]">
              <span>
                {inviteLeft} of {inviteTotal} monthly invites left
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#19A878]"
                style={{ width: `${invitePct}%` }}
              />
            </div>
          </div>
        ) : null}

        {data.inviteBonusCredits > 0 ? (
          <p className="text-sm text-[#475467]">
            Plus {data.inviteBonusCredits} pack invite
            {data.inviteBonusCredits === 1 ? "" : "s"} that never expire.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF0F3] pt-4 text-sm text-[#475467]">
          <span>
            Profile unlocks: {data.unlocksRemaining} available
            {unlockTotal > 0
              ? ` (${unlockLeft} of ${unlockTotal} monthly left)`
              : ""}
          </span>
          <span>{data.totalUnlocked} talent unlocked so far</span>
        </div>
      </section>

      <PlanCards currentPlanId={data.plan} />
      <InvitePacks />
    </div>
  );
}
