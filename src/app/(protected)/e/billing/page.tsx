import type { Metadata } from "next";
import { headers } from "next/headers";

import { EmployerBillingPage } from "@/components/dashboard/employer/billing/employer-billing-page";
import { currencyFromHeaders } from "@/lib/pricing-currency";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  return (
    <EmployerBillingPage
      serverCurrency={currencyFromHeaders(await headers())}
    />
  );
}
