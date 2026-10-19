import { authApi } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api/common";
import type {
  EmployerBillingSummary,
  RawEmployerBillingSummary,
} from "@/types/api/employer-billing";

import { unwrapData } from "./utils";

export async function getEmployerBillingSummary(): Promise<EmployerBillingSummary> {
  const res = await authApi.get<ApiEnvelope<RawEmployerBillingSummary>>(
    "/employer/billing/summary",
  );
  const raw = unwrapData(res);
  return {
    plan: raw.plan,
    planName: raw.plan_name,
    monthlyUnlocks: raw.monthly_unlocks,
    usedThisPeriod: raw.used_this_period,
    bonusCredits: raw.bonus_credits,
    unlocksRemaining: raw.unlocks_remaining,
    periodResetsAt: raw.period_resets_at,
    totalUnlocked: raw.total_unlocked,
    monthlyInvites: raw.monthly_invites,
    invitesUsedThisPeriod: raw.invites_used_this_period,
    inviteBonusCredits: raw.invite_bonus_credits,
    invitesRemaining: raw.invites_remaining,
    plans: raw.plans,
  };
}
