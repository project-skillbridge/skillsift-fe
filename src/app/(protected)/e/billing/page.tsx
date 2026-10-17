import type { Metadata } from "next";

import { EmployerBillingPage } from "@/components/dashboard/employer/billing/employer-billing-page";

export const metadata: Metadata = {
  title: "Billing",
};

export default function Page() {
  return <EmployerBillingPage />;
}
