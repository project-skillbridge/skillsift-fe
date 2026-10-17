/**
 * Public pricing copy. Plan limits mirror `employer-billing.constants.ts` in
 * the API; prices are indicative until validated with employers. Naira prices
 * sit a little above the dollar price at about 1,500 per dollar.
 */
export type PricingPlan = {
  id: "free" | "starter" | "growth";
  name: string;
  tagline: string;
  priceUsd: number;
  priceNgn: number;
  invitesLabel: string;
  unlocksLabel: string;
  features: string[];
  highlighted?: boolean;
};

export type InvitePackOffer = {
  id: string;
  invites: number;
  priceUsd: number;
  priceNgn: number;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Launch offer",
    tagline: "Free while we launch. Try it on a real hire.",
    priceUsd: 0,
    priceNgn: 0,
    invitesLabel: "10 candidates a month",
    unlocksLabel: "3 welcome profile unlocks",
    features: [
      "Pick from the SkillSift library or write your own questions",
      "Ranked results, side-by-side compare and CSV export",
      "Integrity checks on every attempt",
      "Browse and shortlist verified talent",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For teams hiring a few roles.",
    priceUsd: 10,
    priceNgn: 15000,
    invitesLabel: "100 candidates a month",
    unlocksLabel: "5 profile unlocks a month",
    features: [
      "Everything in the launch offer",
      "Full name, photo, resume and contact on unlocked talent",
      "Buy extra invite packs any time",
    ],
    highlighted: true,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams hiring all year.",
    priceUsd: 30,
    priceNgn: 45000,
    invitesLabel: "500 candidates a month",
    unlocksLabel: "30 profile unlocks a month",
    features: [
      "Everything in Starter",
      "Lowest cost per candidate",
      "Priority support",
    ],
  },
];

export const INVITE_PACK_OFFERS: InvitePackOffer[] = [
  { id: "pack_25", invites: 25, priceUsd: 6, priceNgn: 10000 },
  { id: "pack_100", invites: 100, priceUsd: 20, priceNgn: 35000 },
  { id: "pack_500", invites: 500, priceUsd: 90, priceNgn: 150000 },
];

export const PRICING_COMPARISON: {
  label: string;
  free: boolean;
  paid: boolean;
}[] = [
  { label: "Assessment library and custom questions", free: true, paid: true },
  { label: "Ranked results and candidate compare", free: true, paid: true },
  { label: "CSV export and integrity checks", free: true, paid: true },
  { label: "Browse and shortlist verified talent", free: true, paid: true },
  { label: "10 candidates a month", free: true, paid: true },
  { label: "100 to 500 candidates a month", free: false, paid: true },
  { label: "Monthly profile unlocks", free: false, paid: true },
  { label: "Priority support (Growth)", free: false, paid: true },
];

export const PRICING_WHY_PAY = [
  {
    title: "Pay for assessing, not for a name",
    body: "Every feature is on every plan. You pay for how many candidates you assess, so a small team never pays for a big team's tools.",
  },
  {
    title: "Ready-made questions, or your own",
    body: "Pick a SkillSift library assessment and choose how many questions to use, or write your own for the exact role.",
  },
  {
    title: "Candidates don't need an account",
    body: "Share a link or email invites. People take the test with just an email, and we invite them to join SkillSift afterwards.",
  },
  {
    title: "Priced for where you hire",
    body: "Prices are set for your region, month to month, with no annual contract. Invite packs never expire.",
  },
];

export const PRICING_FAQ = [
  {
    q: "How long is the launch offer?",
    a: "The free plan is only here while we launch. It will become a limited free trial, so start now and add a paid plan before it ends.",
  },
  {
    q: "What counts as a candidate?",
    a: "One person assessed, once per assessment. Inviting the same person again, or letting them resume a test, never costs twice.",
  },
  {
    q: "What if an invite email bounces?",
    a: "You aren't charged for invites that didn't reach anyone.",
  },
  {
    q: "Do unused invites roll over?",
    a: "Monthly plan invites reset each month. Invite packs you buy never expire, and they're used after your monthly allowance.",
  },
  {
    q: "What is a profile unlock?",
    a: "An unlock reveals one talent's full name, photo, resume, portfolio and contact details. Their score, level and strengths are always free to see, and talent who accept your interview invite share their details without using an unlock.",
  },
  {
    q: "Can I change plan later?",
    a: "Yes. Switch or cancel any time from your billing page.",
  },
  {
    q: "How do I pay?",
    a: "Cards and bank transfer, in naira or US dollars. Online checkout is rolling out; until then, email us and we'll set you up.",
  },
];

export const PRICING_CONTACT_EMAIL = "admin@skillsift.online";

export type PricingCurrency = "USD" | "NGN";

export function formatMoney(
  amountUsd: number,
  amountNgn: number,
  currency: PricingCurrency,
) {
  const amount = currency === "USD" ? amountUsd : amountNgn;
  if (amount === 0) return "Free";
  return currency === "USD"
    ? `$${amount.toLocaleString("en-US")}`
    : `₦${amount.toLocaleString("en-NG")}`;
}

export function formatPlanPrice(plan: PricingPlan, currency: PricingCurrency) {
  return formatMoney(plan.priceUsd, plan.priceNgn, currency);
}

/** Cost of one candidate in a pack, formatted for the chosen currency. */
export function perInviteLabel(
  pack: InvitePackOffer,
  currency: PricingCurrency,
) {
  const each =
    (currency === "USD" ? pack.priceUsd : pack.priceNgn) / pack.invites;
  return currency === "USD"
    ? `$${each.toFixed(2)} each`
    : `₦${Math.round(each).toLocaleString("en-NG")} each`;
}
