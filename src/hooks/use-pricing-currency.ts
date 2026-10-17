"use client";

import { useSyncExternalStore } from "react";

import type { PricingCurrency } from "@/constants/employer-pricing";
import { currencyFromTimeZone } from "@/lib/pricing-currency";

const subscribe = () => () => {};

/**
 * The one currency to show. The server's location guess wins; if it had none,
 * fall back to the browser's time zone once running in the browser.
 */
export function usePricingCurrency(
  serverCurrency: PricingCurrency | null,
): PricingCurrency {
  const fromTimeZone = useSyncExternalStore<PricingCurrency>(
    subscribe,
    currencyFromTimeZone,
    () => "USD",
  );
  return serverCurrency ?? fromTimeZone;
}
