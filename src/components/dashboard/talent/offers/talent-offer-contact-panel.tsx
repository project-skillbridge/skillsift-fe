"use client";

import { BadgeCheck, Copy, Mail, MapPin } from "lucide-react";
import { useState } from "react";

import { CandidateAvatar } from "@/components/dashboard/employer/shared/candidate-avatar";
import { Button } from "@/components/ui/button";
import { appToast } from "@/lib/toast";
import type { TalentOffer } from "@/types/api/talent-offers";
import { RequestCallButton } from "./request-call-button";

type TalentOfferContactPanelProps = {
  offer: TalentOffer;
};

function buildMailto(email: string, roleTitle: string): string {
  const subject = `Re: ${roleTitle}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/** Returns true on a successful clipboard write so callers can flip
 *  optimistic UI (e.g. a "Copied" label) only when the write actually
 *  landed. Toasts handle the user-facing feedback. */
async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    appToast.success("Email copied.");
    return true;
  } catch {
    appToast.error("Couldn't copy. Select and copy manually.");
    return false;
  }
}

export function TalentOfferContactPanel({
  offer,
}: TalentOfferContactPanelProps) {
  const { employer, roleTitle, interviewLink } = offer;
  // Reflect copy-button state for ~1.5s so the user sees confirmation.
  const [copied, setCopied] = useState(false);
  const hasEmail = Boolean(employer.email);

  async function handleCopy() {
    if (!employer.email) return;
    const ok = await copyToClipboard(employer.email);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section
      aria-label="Contact employer"
      className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-[#FAFAFA] p-5"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <CandidateAvatar
              avatarUrl={employer.avatarUrl}
              fullName={employer.fullName}
              className="size-10"
            />
            {employer.isVerified ? (
              <BadgeCheck
                className="absolute -right-1 -bottom-1 size-4 text-[#34A853]"
                fill="white"
                aria-label="Verified employer"
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#101828]">
              Contact {employer.fullName}
            </p>
            <p className="text-xs text-[#667085]">
              Reach out by email to coordinate next steps.
            </p>
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-[#667085]">Email</dt>
          <dd className="text-sm font-medium text-[#101828]">
            {employer.email ?? "—"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-[#667085]">Country</dt>
          <dd className="flex items-center gap-1 text-sm font-medium text-[#101828]">
            <MapPin className="size-3.5 text-[#98A2B3]" aria-hidden />
            {employer.country ?? "Unknown"}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          disabled={!hasEmail}
          className="h-10 rounded-lg"
          aria-disabled={!hasEmail}
        >
          {hasEmail ? (
            <a href={buildMailto(employer.email ?? "", roleTitle)}>
              <Mail className="mr-2 size-4" aria-hidden />
              Email employer
            </a>
          ) : (
            <span>
              <Mail className="mr-2 size-4" aria-hidden />
              Email unavailable
            </span>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          disabled={!hasEmail}
          className="h-10 rounded-lg"
        >
          <Copy className="mr-2 size-4" aria-hidden />
          {copied ? "Copied" : "Copy email"}
        </Button>
        {interviewLink ? (
          <Button asChild className="h-10 rounded-lg">
            <a href={interviewLink} target="_blank" rel="noopener noreferrer">
              Schedule Interview
            </a>
          </Button>
        ) : (
          <RequestCallButton offerId={offer.id} />
        )}
      </div>
    </section>
  );
}
