"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerAssessments } from "@/hooks/api/use-employer-assessments";
import { useSavedCandidates } from "@/hooks/api/use-employer-discovery";
import { useEmployerOffers } from "@/hooks/api/use-employer-offers";
import { useEmployerVerificationStatus } from "@/hooks/api/use-employer-profile";
import { useEmployerRoles } from "@/hooks/api/use-employer-roles";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  title: string;
  hint: string;
  cta: string;
  href: string;
  done: boolean;
};

/** Guided checklist: one highlighted next action, in the order a hire happens. */
export function EmployerNextSteps() {
  const verification = useEmployerVerificationStatus();
  const roles = useEmployerRoles();
  const assessments = useEmployerAssessments();
  const saved = useSavedCandidates({ page: 1, limit: 1 });
  const offers = useEmployerOffers({ page: 1, limit: 1 });

  const isLoading =
    verification.isLoading ||
    roles.isLoading ||
    assessments.isLoading ||
    saved.isLoading ||
    offers.isLoading;

  if (isLoading) return <Skeleton className="h-56 w-full rounded-2xl" />;

  const assessmentList = assessments.data?.assessments ?? [];

  const steps: Step[] = [
    {
      id: "verify",
      title: "Verify your company",
      hint: "Add your LinkedIn page and website so you can invite talent.",
      cta: "Complete verification",
      href: "/e/settings",
      done: Boolean(verification.data?.verified),
    },
    {
      id: "role",
      title: "Create a role",
      hint: "Tell us who you're hiring so we show the right talent.",
      cta: "Create a role",
      href: "/e/roles",
      done: (roles.data?.length ?? 0) > 0,
    },
    {
      id: "assessment",
      title: "Create an assessment",
      hint: "Test candidates on the skills this role needs.",
      cta: "Create an assessment",
      href: "/e/assessments",
      done: assessmentList.length > 0,
    },
    {
      id: "shortlist",
      title: "Shortlist verified talent",
      hint: "Browse assessed talent and save the ones you like.",
      cta: "Browse talent",
      href: "/e/talents",
      done: (saved.data?.total ?? 0) > 0,
    },
    {
      id: "invite",
      title: "Invite talent to interview",
      hint: "Send an invite for one of your roles.",
      cta: "Open shortlist",
      href: "/e/shortlist",
      done: (offers.data?.total ?? 0) > 0,
    },
    {
      id: "results",
      title: "Review assessment results",
      hint: "See who passed and compare scores.",
      cta: "See results",
      href: "/e/assessments",
      done: assessmentList.some((a) => (a.submissionsCount ?? 0) > 0),
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;
  const nextId = steps.find((s) => !s.done)?.id;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#151515]">
          Your hiring checklist
        </h2>
        <span className="text-sm text-[#757575]">
          {doneCount} of {steps.length} done
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#19A878] transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const isNext = step.id === nextId;
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                isNext ? "border-[#19A878] bg-[#F0FBF6]" : "border-transparent",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  step.done
                    ? "bg-[#19A878] text-white"
                    : "border border-[#D0D5DD] text-[#667085]",
                )}
              >
                {step.done ? <Check className="size-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.done
                      ? "text-[#757575] line-through"
                      : "text-[#151515]",
                  )}
                >
                  {step.title}
                </p>
                {isNext ? (
                  <p className="text-sm text-[#52525B]">{step.hint}</p>
                ) : null}
              </div>
              {isNext ? (
                <Link
                  href={step.href}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#05060F] px-3 py-2 text-sm font-semibold text-white"
                >
                  {step.cta}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
