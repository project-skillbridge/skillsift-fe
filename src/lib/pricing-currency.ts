import type { PricingCurrency } from "@/constants/employer-pricing";

/** Nigeria pays in naira; everyone else sees dollars. */
export function currencyForCountry(
  country: string | null | undefined,
): PricingCurrency | null {
  if (!country) return null;
  return country.trim().toUpperCase() === "NG" ? "NGN" : "USD";
}

/** Country from the CDN's geo headers, then the browser's language region. */
export function currencyFromHeaders(headers: Headers): PricingCurrency | null {
  const country =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("cloudfront-viewer-country");
  const fromIp = currencyForCountry(country);
  if (fromIp) return fromIp;

  const region = headers
    .get("accept-language")
    ?.split(",")[0]
    ?.match(/-([A-Za-z]{2})\b/)?.[1];
  return currencyForCountry(region);
}

/** Last resort when no server hint exists (local dev, unknown network). */
export function currencyFromTimeZone(): PricingCurrency {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === "Africa/Lagos"
      ? "NGN"
      : "USD";
  } catch {
    return "USD";
  }
}
