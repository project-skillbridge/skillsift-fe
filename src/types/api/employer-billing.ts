export type EmployerPlanId = "free" | "starter" | "growth";

export type EmployerPlan = {
  id: EmployerPlanId;
  name: string;
  monthlyInvites: number;
  monthlyUnlocks: number;
  priceUsd: number;
  priceNgn: number;
  highlights: string[];
};

export type EmployerBillingSummary = {
  plan: EmployerPlanId;
  planName: string;
  monthlyUnlocks: number;
  usedThisPeriod: number;
  bonusCredits: number;
  /** Unlocks the employer can spend right now. */
  unlocksRemaining: number;
  periodResetsAt: string | null;
  totalUnlocked: number;
  monthlyInvites: number;
  invitesUsedThisPeriod: number;
  inviteBonusCredits: number;
  /** Candidates the employer can still assess right now. */
  invitesRemaining: number;
  plans: EmployerPlan[];
};

export type RawEmployerBillingSummary = {
  plan: EmployerPlanId;
  plan_name: string;
  monthly_unlocks: number;
  used_this_period: number;
  bonus_credits: number;
  unlocks_remaining: number;
  period_resets_at: string | null;
  total_unlocked: number;
  monthly_invites: number;
  invites_used_this_period: number;
  invite_bonus_credits: number;
  invites_remaining: number;
  plans: Array<{
    id: EmployerPlanId;
    name: string;
    monthlyInvites: number;
    monthlyUnlocks: number;
    priceUsd: number;
    priceNgn: number;
    highlights: string[];
  }>;
};
