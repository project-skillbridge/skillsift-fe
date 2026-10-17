"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Link2,
  Plus,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEmployerAssessments,
  useEmployerAssessmentsOverview,
} from "@/hooks/api/use-employer-assessments";
import { useEmployerBillingSummary } from "@/hooks/api/use-employer-billing";
import { formatRelativeTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";

import { IntegrityBadge } from "../assessments/results/results-shared";
import { ProgressRing } from "../shared/progress-ring";
import { StatTile } from "../shared/stat-tile";

type Props = {
  companyName?: string;
  /** 0 to 100, shown as a nudge until the company profile is complete. */
  profileCompletion?: number;
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type Attention = {
  id: string;
  tone: "rose" | "amber" | "green";
  title: string;
  body: string;
  href: string;
  cta: string;
};

const ATTENTION_STYLES = {
  rose: "bg-[#FDE2E7] text-[#BE123C]",
  amber: "bg-[#FFF0D1] text-[#B45309]",
  green: "bg-[#D3E6DF] text-[#0E7A55]",
} as const;

/** The returning employer's home: where they stand, what came in, what needs them. */
export function EmployerCommandCenter({
  companyName,
  profileCompletion,
}: Props) {
  const overview = useEmployerAssessmentsOverview();
  const billing = useEmployerBillingSummary();
  const assessments = useEmployerAssessments();

  const stats = overview.data?.last30Days;
  const invitesLeft = billing.data?.invitesRemaining;
  const invitesTotal =
    (billing.data?.monthlyInvites ?? 0) +
    (billing.data?.inviteBonusCredits ?? 0);
  const firstName = companyName?.split(" ")[0];

  const attention: Attention[] = [];
  if ((stats?.needsReview ?? 0) > 0) {
    attention.push({
      id: "review",
      tone: "rose",
      title:
        stats?.needsReview === 1
          ? "1 result needs a closer look"
          : `${stats?.needsReview} results need a closer look`,
      body: "Tab switching, copy and paste, or very fast finishes were recorded.",
      href: "/e/assessments",
      cta: "Review results",
    });
  }
  if (invitesLeft != null && invitesLeft <= 3) {
    attention.push({
      id: "invites",
      tone: "amber",
      title:
        invitesLeft === 0
          ? "You're out of invites"
          : `Only ${invitesLeft} invite${invitesLeft === 1 ? "" : "s"} left`,
      body: "Candidates can't start a test when you run out. Top up before you share a link.",
      href: "/e/billing",
      cta: "Get more invites",
    });
  }
  const quiet = (assessments.data?.assessments ?? []).find(
    (a) => a.status === "active" && (a.submissionsCount ?? 0) === 0,
  );
  if (quiet) {
    attention.push({
      id: "quiet",
      tone: "green",
      title: `Nobody has taken ${quiet.title} yet`,
      body: "Share the link in your job post or send invites by email.",
      href: `/e/assessments/${quiet.id}`,
      cta: "Share it",
    });
  }
  if (profileCompletion != null && profileCompletion < 100) {
    attention.push({
      id: "profile",
      tone: "green",
      title: `Your company profile is ${profileCompletion}% complete`,
      body: "A complete profile helps talent trust your invites.",
      href: "/e/settings",
      cta: "Finish profile",
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#dfe4e2] p-6 text-[#151515] sm:p-8">
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col gap-4">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#151515]">
              <Sparkles className="size-3.5" aria-hidden />
              Hiring overview
            </p>
            <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
              {greeting()}
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-base text-[#3d3d3d]">
              {stats && stats.assessed > 0
                ? `${stats.assessed} candidate${stats.assessed === 1 ? "" : "s"} completed your assessments in the last 30 days.`
                : "Send your first assessment and see how candidates really perform."}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#05060f]/90"
              >
                <Link href="/e/assessments">
                  <Plus className="size-4" aria-hidden />
                  Create assessment
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg border-[#05060f] bg-white px-5 font-semibold text-[#151515] hover:bg-white/60"
              >
                <Link href="/e/talents">Browse verified talent</Link>
              </Button>
            </div>
          </div>

          <Link
            href="/e/billing"
            className="flex items-center gap-5 rounded-xl border border-[#D9D9D9] bg-white p-5 transition-colors hover:bg-white/70"
          >
            {invitesLeft == null ? (
              <Skeleton className="size-24 rounded-full" />
            ) : (
              <ProgressRing
                fraction={invitesTotal ? invitesLeft / invitesTotal : 0}
                trackClassName="stroke-[#E4E7EC]"
                barClassName="stroke-[#009f6a]"
              >
                <span className="text-2xl font-bold">{invitesLeft}</span>
              </ProgressRing>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[#667085]">Invites left</p>
              <p className="text-base font-semibold">
                {billing.data?.planName ?? "Your plan"}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#008458]">
                Manage plan
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section
        aria-label="Last 30 days"
        className="grid gap-4 rounded-2xl bg-[#F2F2F2] p-4 sm:grid-cols-2"
      >
        {overview.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[10px]" />
          ))
        ) : (
          <>
            <StatTile
              icon={Users}
              tone="green"
              label="Candidates assessed"
              value={String(stats?.assessed ?? 0)}
              hint="Completed one of your assessments in the last 30 days."
              linkLabel="View assessments"
              linkHref="/e/assessments"
            />
            <StatTile
              icon={CheckCircle2}
              tone="sand"
              label="Pass rate"
              value={stats?.passRate == null ? "-" : `${stats.passRate}%`}
              hint="Scored at or above the pass mark."
              linkLabel="See results"
              linkHref="/e/assessments"
            />
            <StatTile
              icon={Gauge}
              tone="violet"
              label="Average score"
              value={
                stats?.averageScore == null ? "-" : `${stats.averageScore}%`
              }
              hint="Across everyone who finished."
              linkLabel="See results"
              linkHref="/e/assessments"
            />
            <StatTile
              icon={ShieldAlert}
              tone={(stats?.needsReview ?? 0) > 0 ? "rose" : "grey"}
              label="Needs a closer look"
              value={String(stats?.needsReview ?? 0)}
              hint={
                (stats?.needsReview ?? 0) > 0
                  ? "Integrity signals worth checking."
                  : "No integrity concerns."
              }
              linkLabel="Review results"
              linkHref="/e/assessments"
            />
          </>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-sans text-lg font-semibold text-[#0D2025]">
              Latest results
            </h2>
            <Link
              href="/e/assessments"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#475467] hover:text-[#0D2025]"
            >
              All assessments
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {overview.isLoading ? (
            <Skeleton className="h-56 rounded-xl" />
          ) : (overview.data?.recent.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#D0D5DD] px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#D3E6DF] text-[#0E7A55]">
                <ClipboardCheck className="size-6" aria-hidden />
              </span>
              <p className="font-semibold text-[#0D2025]">No results yet</p>
              <p className="max-w-xs text-sm text-[#667085]">
                When candidates finish a test, their scores show up here ranked
                and ready to compare.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-[#EEF0F3]">
              {overview.data?.recent.map((r) => {
                const label = r.candidateName ?? r.email ?? "Candidate";
                return (
                  <li key={r.id}>
                    <Link
                      href={`/e/assessments/${r.assessmentId}`}
                      className="flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-[#F9FAFB]"
                    >
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          r.passed
                            ? "bg-[#DDF5EA] text-[#0E7A55]"
                            : "bg-[#FDE2E7] text-[#BE123C]",
                        )}
                      >
                        {r.score}%
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate text-sm font-semibold text-[#0D2025]">
                          {label}
                        </p>
                        <p className="truncate text-xs text-[#667085]">
                          {r.assessmentTitle} ·{" "}
                          {formatRelativeTime(r.completedAt)}
                        </p>
                      </div>
                      {r.integrityLevel && r.integrityLevel !== "clean" ? (
                        <IntegrityBadge level={r.integrityLevel} />
                      ) : null}
                      <span
                        className={cn(
                          "hidden rounded-md px-2.5 py-1 text-xs font-semibold sm:inline-flex",
                          r.passed
                            ? "bg-[#D1FAE5] text-[#065F46]"
                            : "bg-[#FEE2E2] text-[#991B1B]",
                        )}
                      >
                        {r.passed ? "Passed" : "Not passed"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 lg:col-span-2">
          <h2 className="font-sans text-lg font-semibold text-[#0D2025]">
            Needs your attention
          </h2>
          {attention.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-[#F0FDF7] px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#DDF5EA] text-[#0E7A55]">
                <CheckCircle2 className="size-6" aria-hidden />
              </span>
              <p className="font-semibold text-[#0D2025]">
                You&apos;re all caught up
              </p>
              <p className="max-w-xs text-sm text-[#667085]">
                Nothing is waiting on you. A good time to invite more
                candidates.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {attention.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-[#EEF0F3] p-4"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl",
                      ATTENTION_STYLES[item.tone],
                    )}
                  >
                    {item.id === "review" ? (
                      <AlertTriangle className="size-4.5" aria-hidden />
                    ) : item.id === "quiet" ? (
                      <Link2 className="size-4.5" aria-hidden />
                    ) : (
                      <Sparkles className="size-4.5" aria-hidden />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-semibold text-[#0D2025]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#667085]">{item.body}</p>
                    <Link
                      href={item.href}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0D2025] underline underline-offset-4"
                    >
                      {item.cta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
