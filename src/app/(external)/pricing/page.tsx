import type { Metadata } from "next";

import { PricingPageContent } from "@/components/pricing/pricing-page-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Browse and shortlist verified talent for free. Pay only to unlock the people you want to talk to.",
};

export default function Page() {
  return <PricingPageContent />;
}
