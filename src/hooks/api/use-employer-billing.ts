"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployerBillingSummary } from "@/actions/employer-billing";

import { employerBillingKeys } from "./keys";

export function useEmployerBillingSummary() {
  return useQuery({
    queryKey: employerBillingKeys.summary(),
    queryFn: () => getEmployerBillingSummary(),
  });
}
