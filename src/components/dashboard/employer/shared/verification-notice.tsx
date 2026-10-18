"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { useEmployerVerificationStatus } from "@/hooks/api";
import type { EmployerVerificationCriterion } from "@/types/api";

export const VERIFICATION_STEPS: Record<EmployerVerificationCriterion, string> =
  {
    email_verified: "Verify your work email",
    website_resolvable: "Add a company website that opens",
    linkedin_provided: "Add your LinkedIn company page",
  };

/** True once we know the employer is not verified (false while loading). */
export function useNeedsVerification(): boolean {
  const { data } = useEmployerVerificationStatus();
  return Boolean(data && !data.verified);
}

type Props = {
  /** What verification unlocks here, e.g. "unlock profiles". */
  action: string;
  className?: string;
};

/** Shows what an unverified employer still needs to do, with a link to do it. */
export function VerificationNotice({ action, className }: Props) {
  const { data } = useEmployerVerificationStatus();
  if (!data || data.verified) return null;

  const missing = (
    Object.keys(VERIFICATION_STEPS) as EmployerVerificationCriterion[]
  ).filter((key) => !data.criteria[key]);

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-[#F9E796] bg-[#FFFBEA] p-4 ${className ?? ""}`}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#B45309]" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-[#0d2025]">
          Verify your company to {action}
        </p>
        {missing.length > 0 ? (
          <ul className="list-disc pl-4 text-xs text-[#475467]">
            {missing.map((key) => (
              <li key={key}>{VERIFICATION_STEPS[key]}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#475467]">
            Everything is in. Verification will refresh shortly.
          </p>
        )}
        <Link
          href="/e/settings"
          className="w-fit text-xs font-semibold text-[#0d2025] underline underline-offset-2"
        >
          Go to company settings
        </Link>
      </div>
    </div>
  );
}
