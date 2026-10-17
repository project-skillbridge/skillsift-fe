/**
 * Public pricing copy. Plan limits mirror `employer-billing.constants.ts` in
 * the API; prices are indicative until validated with employers.
 */
export type PricingPlan = {
  id: "free" | "starter" | "growth";
  name: string;
  tagline: string;
  priceUsd: number;
  priceNgn: number;
  unlocksLabel: string;
  features: string[];
  highlighted?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "See the quality before you pay.",
    priceUsd: 0,
    priceNgn: 0,
    unlocksLabel: "3 welcome unlocks",
    features: [
      "Browse verified, assessed talent",
      "Scores, strengths and availability",
      "Shortlist talent and send interview invites",
      "Create roles and custom assessments",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For teams hiring a few roles.",
    priceUsd: 49,
    priceNgn: 49000,
    unlocksLabel: "15 unlocks every month",
    features: [
      "Everything in Free",
      "Full name, photo, resume, portfolio and contact",
      "Buy extra unlocks any time",
    ],
    highlighted: true,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams hiring all year.",
    priceUsd: 129,
    priceNgn: 129000,
    unlocksLabel: "50 unlocks every month",
    features: [
      "Everything in Starter",
      "Best price per unlock",
      "Priority support",
    ],
  },
];

export const PRICING_COMPARISON: {
  label: string;
  free: boolean;
  paid: boolean;
}[] = [
  { label: "Browse verified talent", free: true, paid: true },
  { label: "Skill score, level and strengths", free: true, paid: true },
  { label: "Shortlist and pipeline", free: true, paid: true },
  { label: "Send interview invites", free: true, paid: true },
  { label: "Create roles and assessments", free: true, paid: true },
  { label: "Full name and photo", free: false, paid: true },
  { label: "Resume and portfolio", free: false, paid: true },
  { label: "Contact details", free: false, paid: true },
];

export const PRICING_WHY_PAY = [
  {
    title: "Every candidate is already assessed",
    body: "Talent on SkillSift passed a skills assessment, so you skip the CV pile and start with people who can do the job.",
  },
  {
    title: "Judge on skill first",
    body: "Names and photos stay hidden until you unlock, so your first shortlist is based on scores and strengths, not on who someone is.",
  },
  {
    title: "Pay only for people you want",
    body: "One unlock reveals one profile, with resume, portfolio and contact. Unlocking the same person twice never costs twice.",
  },
  {
    title: "Run your whole pipeline in one place",
    body: "Roles, custom assessments, invites and results sit together, so nothing falls through the cracks.",
  },
];

export const PRICING_FAQ = [
  {
    q: "What is an unlock?",
    a: "An unlock reveals one candidate's full name, photo, resume, portfolio and contact details. Their score, level, strengths and availability are always free to see.",
  },
  {
    q: "Do unused unlocks roll over?",
    a: "Monthly plan unlocks reset each month. Extra unlocks you buy never expire.",
  },
  {
    q: "What if a talent accepts my invite?",
    a: "When talent accepts your interview invite they share their details with you, and it doesn't use an unlock.",
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

export function formatPlanPrice(plan: PricingPlan, currency: "USD" | "NGN") {
  const amount = currency === "USD" ? plan.priceUsd : plan.priceNgn;
  if (amount === 0) return "Free";
  return currency === "USD"
    ? `$${amount.toLocaleString("en-US")}`
    : `₦${amount.toLocaleString("en-NG")}`;
}
