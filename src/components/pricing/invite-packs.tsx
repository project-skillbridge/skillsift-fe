"use client";

import {
  formatMoney,
  INVITE_PACK_OFFERS,
  perInviteLabel,
  PRICING_CONTACT_EMAIL,
  type PricingCurrency,
} from "@/constants/employer-pricing";
import { cn } from "@/lib/utils";

/** Prepaid candidate packs that never expire, for teams that don't want a subscription. */
export function InvitePacks({
  currency,
  className,
}: {
  currency: PricingCurrency;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#151515]">
            Pay as you go
          </h3>
          <p className="text-sm text-[#757575]">
            Invite packs never expire and work alongside any plan.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {INVITE_PACK_OFFERS.map((pack) => (
          <div
            key={pack.id}
            className="flex flex-col gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-5"
          >
            <p className="text-sm text-[#757575]">{pack.invites} candidates</p>
            <p className="text-2xl font-semibold text-[#151515]">
              {formatMoney(pack.priceUsd, pack.priceNgn, currency)}
            </p>
            <p className="text-xs text-[#667085]">
              {perInviteLabel(pack, currency)}
            </p>
            <a
              href={`mailto:${PRICING_CONTACT_EMAIL}?subject=${encodeURIComponent(`SkillSift ${pack.invites} invite pack`)}`}
              className="rounded-lg border border-[#D0D5DD] py-2 text-center text-sm font-semibold text-[#151515]"
            >
              Get this pack
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
