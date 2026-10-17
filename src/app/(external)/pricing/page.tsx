import type { Metadata } from "next";
import { headers } from "next/headers";

import { PricingPageContent } from "@/components/pricing/pricing-page-content";
import { currencyFromHeaders } from "@/lib/pricing-currency";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Pay for the candidates you assess, in naira or dollars depending on where you are. Every feature is on every plan.",
};

export default async function Page() {
  return (
    <PricingPageContent serverCurrency={currencyFromHeaders(await headers())} />
  );
}
