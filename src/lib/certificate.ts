import type { Certificate } from "@/types/api";

const ISSUER = "SkillSift";

export function certificateUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/c/${encodeURIComponent(code)}`;
}

export function certificateTitle(cert: Certificate): string {
  return `${cert.level_label} ${cert.track_label}`;
}

/** Prefilled "Add to profile" link for LinkedIn's licenses & certifications. */
export function linkedInAddUrl(cert: Certificate): string {
  const issued = new Date(cert.issued_at);
  const expires = new Date(cert.expires_at);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `${certificateTitle(cert)} Assessment`,
    organizationName: ISSUER,
    issueYear: String(issued.getUTCFullYear()),
    issueMonth: String(issued.getUTCMonth() + 1),
    expirationYear: String(expires.getUTCFullYear()),
    expirationMonth: String(expires.getUTCMonth() + 1),
    certUrl: certificateUrl(cert.code),
    certId: cert.code,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export function whatsAppShareUrl(cert: Certificate): string {
  const text = `I passed the ${ISSUER} ${certificateTitle(cert)} assessment. Check it here: ${certificateUrl(cert.code)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
