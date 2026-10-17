"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";

import { useMyCertificates } from "@/hooks/api";
import { formatAbsoluteDate } from "@/lib/format-date";
import { certificateTitle } from "@/lib/certificate";

import { CertificateShareActions } from "./certificate-share-actions";

const STATUS_COPY = {
  valid: "Valid",
  expired: "Expired",
  revoked: "Revoked",
} as const;

const RENEW_WINDOW_DAYS = 60;

function daysLeft(expiresAt: string, now: number): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - now) / 86_400_000),
  );
}

export function CertificatesSection() {
  const { data: certs } = useMyCertificates();
  const [now] = useState(() => Date.now());
  if (!certs?.length) return null;

  return (
    <section
      aria-labelledby="certificates-heading"
      className="rounded-2xl border border-border bg-[#FAFAFA] p-6"
    >
      <h2
        id="certificates-heading"
        className="text-[18px] font-bold tracking-tight text-foreground"
      >
        Your certificates
      </h2>
      <p className="body-3 mt-1 text-muted-foreground">
        Share these on LinkedIn or your CV. Anyone can check them with the link.
      </p>
      <ul className="mt-4 space-y-4">
        {certs.map((cert) => (
          <li
            key={cert.code}
            className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck
                className={
                  cert.status === "valid"
                    ? "mt-0.5 size-6 shrink-0 text-verified"
                    : "mt-0.5 size-6 shrink-0 text-muted-foreground"
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/c/${cert.code}`}
                    className="label text-foreground hover:underline"
                  >
                    {certificateTitle(cert)}
                  </Link>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {STATUS_COPY[cert.status]}
                  </span>
                </div>
                <dl className="body-3 mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-muted-foreground">
                  <dt>Issued</dt>
                  <dd className="text-foreground">
                    {formatAbsoluteDate(cert.issued_at)}
                  </dd>
                  <dt>Valid until</dt>
                  <dd className="text-foreground">
                    {formatAbsoluteDate(cert.expires_at)}
                  </dd>
                  <dt>Certificate ID</dt>
                  <dd className="text-foreground">{cert.code}</dd>
                </dl>
                {cert.status === "valid" &&
                daysLeft(cert.expires_at, now) <= RENEW_WINDOW_DAYS ? (
                  <p className="body-3 mt-2 font-semibold text-foreground">
                    Expires in {daysLeft(cert.expires_at, now)} days.{" "}
                    <Link
                      href="/t/assessments/skill"
                      className="underline underline-offset-2"
                    >
                      Retake to renew
                    </Link>
                  </p>
                ) : null}
              </div>
            </div>
            <CertificateShareActions cert={cert} />
          </li>
        ))}
      </ul>
    </section>
  );
}
