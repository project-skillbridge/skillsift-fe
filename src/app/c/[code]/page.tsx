import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";

import { getPublicCertificate } from "@/actions/certificates";
import { CertificateConfetti } from "@/components/certificates/certificate-confetti";
import { CertificateSeal } from "@/components/certificates/certificate-seal";
import { formatAbsoluteDate } from "@/lib/format-date";
import { certificateTitle, certificateUrl } from "@/lib/certificate";
import type { Certificate } from "@/types/api";

type PageProps = { params: Promise<{ code: string }> };

async function load(code: string): Promise<Certificate | null> {
  try {
    return await getPublicCertificate(code);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;
  const cert = await load(code);
  if (!cert) return { title: "Certificate not found" };
  const title = `${cert.holder_name} passed the SkillSift ${certificateTitle(cert)} assessment`;
  return {
    title,
    description: `Assessment certificate issued by SkillSift. ID ${cert.code}.`,
    openGraph: { title },
  };
}

const STATUS = {
  valid: {
    label: "Authentic & valid",
    badge: "bg-[#E7F7F0] text-verified-strong ring-verified/30",
    note: "This certificate was issued by SkillSift and is currently valid. It records a pass on SkillSift's online skills assessment; individual scores are not shown.",
  },
  expired: {
    label: "Expired",
    badge: "bg-orange-50 text-orange-700 ring-orange-300",
    note: "This certificate was issued by SkillSift but its validity period has ended.",
  },
  revoked: {
    label: "Revoked",
    badge: "bg-red-50 text-red-700 ring-red-300",
    note: "SkillSift has withdrawn this certificate. It should not be relied on.",
  },
} as const;

export default async function CertificatePage({ params }: PageProps) {
  const { code } = await params;
  const cert = await load(code);

  if (!cert) notFound();

  const status = STATUS[cert.status];
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  const inactive = cert.status !== "valid";
  // Generated from our own certificate URL, so the markup is safe to inline.
  const qrSvg = await QRCode.toString(certificateUrl(cert.code), {
    type: "svg",
    margin: 0,
    color: { dark: "#1B2935", light: "#0000" },
  });

  return (
    <>
      {!inactive && <CertificateConfetti />}

      <div
        className={`mx-auto mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${status.badge}`}
      >
        <ShieldCheck className="size-4" />
        {status.label}
      </div>

      <article
        className={cn(
          "relative mx-auto max-w-3xl rounded-[20px] sm:rounded-[28px]",
          "bg-gradient-to-br from-[#C9A24A] via-[#F3DC9B] to-[#B8892F] p-[3px]",
          "shadow-[0_30px_80px_-30px_rgba(0,132,88,0.45)]",
          inactive && "grayscale-[0.6]",
        )}
      >
        <div className="relative overflow-hidden rounded-[17px] sm:rounded-[25px] bg-[#FFFEF9] p-1.5 sm:p-3">
          <div className="relative rounded-[12px] sm:rounded-[18px] border border-[#C9A24A]/60 px-4 pb-6 pt-7 text-center sm:px-14 sm:pb-14 sm:pt-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,159,106,0.10),transparent_60%)]"
            />
            {cert.status === "revoked" && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="-rotate-12 text-5xl font-black uppercase tracking-widest text-red-600/15 sm:text-8xl">
                  Revoked
                </span>
              </div>
            )}

            <div className="relative flex flex-col items-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A6A22] sm:text-xs sm:tracking-[0.35em]">
                Certificate of Assessment
              </p>

              <div className="mt-4 sm:mt-6">
                <CertificateSeal tone={cert.status} />
              </div>

              <p className="mt-5 text-sm text-muted-foreground sm:mt-8">
                This certifies that
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-cert-serif)] break-words text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
                {cert.holder_name}
              </h1>
              <div
                aria-hidden
                className="mt-4 h-px w-32 sm:mt-5 sm:w-40 bg-gradient-to-r from-transparent via-[#C9A24A] to-transparent"
              />
              <p className="mt-4 text-xs text-muted-foreground sm:mt-5 sm:text-sm">
                has passed the SkillSift skills assessment at the level of
              </p>
              <p className="mt-2 font-[family-name:var(--font-cert-serif)] text-xl font-medium text-verified-strong sm:text-4xl">
                {certificateTitle(cert)}
              </p>

              <dl className="mt-6 grid w-full grid-cols-2 gap-x-3 gap-y-4 border-t border-[#C9A24A]/40 pt-5 text-center sm:mt-10 sm:grid-cols-3 sm:gap-6 sm:pt-8">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Issued
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {formatAbsoluteDate(cert.issued_at, dateOptions)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Valid until
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {formatAbsoluteDate(cert.expires_at, dateOptions)}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Certificate ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-sm font-semibold text-foreground">
                    {cert.code}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col items-center gap-2 sm:mt-8">
                <div
                  aria-hidden
                  className="size-20 sm:size-24 [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <p className="text-xs text-muted-foreground">
                  Scan to check this certificate is genuine
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <p className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <BadgeCheck
          className={`size-4 shrink-0 ${inactive ? "text-orange-600" : "text-verified"}`}
        />
        {status.note}
      </p>
    </>
  );
}
