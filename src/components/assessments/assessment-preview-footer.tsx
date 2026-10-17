import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AssessmentPreviewFooterProps = {
  assessmentSlug: string;
  /** Marketing-provided paragraph with `{terms}` and `{helpCenter}` tokens —
   *  the renderer below substitutes them for inline links. */
  consent: string;
  /** Where the CTA should navigate. Defaults to `/t/assessments/${slug}/q`. */
  startHref?: string;
  /** CTA label. Defaults to "Start". */
  startLabel?: string;
  startDisabled?: boolean;
};

const START_BUTTON_CLASS =
  "h-8 min-w-43 rounded-md bg-primary text-xs font-semibold text-white hover:bg-[#322B2D]/90 2xl:h-11 2xl:min-w-60 2xl:text-base";

const CONSENT_LINK_CLASS =
  "font-semibold text-foreground underline underline-offset-2";

/** Canonical href + display label for each consent-template token. Centralised
 *  here so a future "Help Center" route swap is a one-line change. */
const CONSENT_LINKS: Record<string, { href: string; label: string }> = {
  terms: { href: "/terms-of-use", label: "SkillSift Terms and Conditions" },
  helpCenter: { href: "/contact", label: "Help Center" },
};

const CONSENT_TOKEN_REGEX = /\{(terms|helpCenter)\}/g;

/** Split the consent string on `{terms}` / `{helpCenter}` tokens and render
 *  the matching segments as inline `<Link>`s. Unknown tokens fall through as
 *  literal text so a stray placeholder is visible rather than silently gone. */
function renderConsent(template: string): ReactNode[] {
  const segments = template.split(CONSENT_TOKEN_REGEX);
  return segments.map((segment, index) => {
    const link = CONSENT_LINKS[segment];
    if (!link) return <Fragment key={index}>{segment}</Fragment>;
    return (
      <Link key={index} href={link.href} className={CONSENT_LINK_CLASS}>
        {link.label}
      </Link>
    );
  });
}

function AssessmentPreviewFooter({
  assessmentSlug,
  consent,
  startHref,
  startLabel = "Start",
  startDisabled = false,
}: AssessmentPreviewFooterProps) {
  const href = startHref ?? `/t/assessments/${assessmentSlug}/q`;

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-[#D9D9D9] pt-4 sm:flex-row sm:items-end sm:justify-between 2xl:mt-8 2xl:pt-6">
      <p className="max-w-105 font-sans text-[10px] leading-3.5 text-muted-foreground 2xl:max-w-150 2xl:text-sm 2xl:leading-5">
        {renderConsent(consent)}
      </p>

      {startDisabled ? (
        <Button type="button" disabled className={START_BUTTON_CLASS}>
          {startLabel}
        </Button>
      ) : (
        <Button asChild className={START_BUTTON_CLASS}>
          <Link href={href}>{startLabel}</Link>
        </Button>
      )}
    </div>
  );
}

export { AssessmentPreviewFooter };
export type { AssessmentPreviewFooterProps };
