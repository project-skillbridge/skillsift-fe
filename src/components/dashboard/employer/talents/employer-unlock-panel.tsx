"use client";

import Link from "next/link";
import {
  Briefcase,
  Camera,
  Copy,
  ExternalLink,
  FileText,
  Lock,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useNeedsVerification,
  VerificationNotice,
} from "../shared/verification-notice";
import { useUnlockCandidate } from "@/hooks/api/use-employer-discovery";
import { useEmployerBillingSummary } from "@/hooks/api/use-employer-billing";
import { ApiError, authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type { EmployerDiscoveryCandidateProfile } from "@/types/api/employer-discovery";

type EmployerUnlockPanelProps = {
  profile: EmployerDiscoveryCandidateProfile;
};

const UNLOCK_INCLUDES = [
  { icon: Camera, label: "Full name and photo" },
  { icon: FileText, label: "Resume" },
  { icon: Briefcase, label: "Portfolio and LinkedIn" },
  { icon: Mail, label: "Contact email" },
];

function firstName(fullName: string): string {
  return fullName.split(" ")[0] || "this talent";
}

/** Locked: what an unlock includes plus the button. Unlocked: the revealed details. */
export function EmployerUnlockPanel({ profile }: EmployerUnlockPanelProps) {
  const { data: billing } = useEmployerBillingSummary();
  const { mutate: unlock, isPending } = useUnlockCandidate();
  const needsVerification = useNeedsVerification();

  if (profile.isUnlocked) {
    const name = firstName(profile.full_name);
    const links = [
      { label: "Resume", href: profile.resume_url, icon: FileText },
      { label: "Portfolio", href: profile.portfolioUrl, icon: Briefcase },
      { label: "LinkedIn", href: profile.linkedinUrl, icon: ExternalLink },
    ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

    return (
      <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-base font-semibold text-[#151515]">
            Contact {name}
          </h2>
          <p className="text-sm text-[#667085]">
            {profile.offerStatus === "accepted"
              ? `${name} accepted your offer. Reach out to coordinate next steps.`
              : "Unlocked. Their details are yours to reach out with."}
          </p>
          {profile.email ? (
            <a
              className="truncate text-sm font-medium text-[#151515] underline underline-offset-2"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.email ? (
            <>
              <Button asChild className="h-10 rounded-lg">
                <a href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 size-4" aria-hidden />
                  Email
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg"
                onClick={() => {
                  navigator.clipboard
                    .writeText(profile.email ?? "")
                    .then(() => appToast.success("Email copied."))
                    .catch(() =>
                      appToast.error(
                        "Couldn't copy. Select and copy manually.",
                      ),
                    );
                }}
              >
                <Copy className="mr-2 size-4" aria-hidden />
                Copy
              </Button>
            </>
          ) : null}
          {links.map(({ label, href, icon: Icon }) => (
            <Button
              key={label}
              asChild
              variant="outline"
              className="h-10 rounded-lg"
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon className="mr-2 size-4" aria-hidden />
                {label}
              </a>
            </Button>
          ))}
        </div>
      </section>
    );
  }

  if (needsVerification) {
    return <VerificationNotice action="unlock profiles and contact talent" />;
  }

  const remaining = billing?.unlocksRemaining;
  const outOfUnlocks = remaining === 0;

  function handleUnlock() {
    unlock(profile.userId, {
      onSuccess: (result) => {
        appToast.success(
          result.alreadyUnlocked
            ? "Already unlocked."
            : `Profile unlocked. ${result.unlocksRemaining} unlock${result.unlocksRemaining === 1 ? "" : "s"} left.`,
        );
      },
      onError: (error) => {
        appToast.error(
          error instanceof ApiError && error.status === 402
            ? "You're out of unlocks. Get more to see this profile."
            : authFailureMessage(error),
        );
      },
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-[#E4E7EC] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-[#667085]" aria-hidden />
          <h2 className="text-base font-semibold text-[#151515]">
            Unlock {firstName(profile.full_name)}&apos;s full profile
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {UNLOCK_INCLUDES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-[#475467]"
            >
              <Icon className="size-4 text-[#19A878]" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[#757575]">
          Scores, strengths and availability are always free to view.
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        {outOfUnlocks ? (
          <Button asChild>
            <Link href="/e/billing">Get more unlocks</Link>
          </Button>
        ) : (
          <Button type="button" onClick={handleUnlock} disabled={isPending}>
            {isPending ? "Unlocking…" : "Unlock profile · 1 unlock"}
          </Button>
        )}
        {remaining != null ? (
          <span className="text-xs text-[#757575]">
            {remaining} unlock{remaining === 1 ? "" : "s"} left ·{" "}
            <Link href="/e/billing" className="underline">
              Plans
            </Link>
          </span>
        ) : null}
      </div>
    </section>
  );
}
