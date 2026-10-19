"use client";

import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, MoreHorizontal } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, Tick01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AssessmentCatalogStep } from "@/constants/assessment-roadmap";
import { cn } from "@/lib/utils";

type AssessmentCatalogCardProps = {
  step: AssessmentCatalogStep & { href?: string };
};

export function AssessmentCatalogCard({ step }: AssessmentCatalogCardProps) {
  const PanelIcon = step.panelIcon;
  const isComingSoon = step.comingSoon === true;
  const isCompleted = !isComingSoon && step.state === "completed";
  const isLocked = !isComingSoon && step.state === "locked";

  const hasViewableSummary = isCompleted || step.ctaLabel === "Retake";
  const startHref =
    step.href ??
    (step.state === "available" && step.slug != null
      ? `/t/assessments/${step.slug}`
      : null);
  const canStart =
    !isComingSoon && !isLocked && !isCompleted && startHref != null;

  return (
    <article className="animate-in fade-in slide-in-from-bottom-1 overflow-hidden rounded-2xl border border-[#DBDBDB] bg-white duration-300 transition-all hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div
          className={cn(
            "flex min-h-42.5 w-full flex-col justify-between px-4 py-4 lg:w-54.25 lg:px-5",
            step.panelClassName,
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-base leading-6 font-semibold tracking-[0.017em]">
              {step.panelTitle}
            </p>
            {isComingSoon ? (
              <Badge
                variant="outline"
                className="shrink-0 rounded-lg border-transparent bg-white px-2 py-1 text-[12px] leading-4 font-normal tracking-[0.016em] text-[#151515] sm:hidden"
              >
                Coming Soon
                <HugeiconsIcon icon={SparklesIcon} size={14} />
              </Badge>
            ) : isLocked ? (
              <Badge
                variant="outline"
                className="shrink-0 rounded-lg border-transparent bg-white px-2 py-1 text-[12px] leading-4 font-normal tracking-[0.016em] text-[#151515] sm:hidden"
              >
                Locked
                <LockKeyhole className="size-3.5" />
              </Badge>
            ) : null}
          </div>
          {step.panelIconSrc ? (
            <Image
              src={step.panelIconSrc}
              alt=""
              width={56}
              height={56}
              aria-hidden
              className="size-14 shrink-0"
            />
          ) : (
            <PanelIcon
              className={cn("size-16 shrink-0", step.panelIconClassName)}
              strokeWidth={1.8}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-5 px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex size-6 items-center justify-center rounded-full border border-[#D9D9D9] text-sm font-extrabold tracking-[0.016em] text-[#151515]">
                  {step.order}
                </span>
                <h2 className="text-base leading-6 font-semibold tracking-[0.017em] text-[#151515]">
                  {step.title}
                </h2>
              </div>

              <p className="max-w-140 text-sm leading-6 tracking-[0.016em] text-[#151515]/80 sm:text-base sm:tracking-[0.017em]">
                {step.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isComingSoon ? (
                <Badge
                  variant="outline"
                  className="hidden rounded-lg border-[#D9D9D9] bg-[#EBEBEB] px-2 py-1 text-[12px] leading-4 font-normal tracking-[0.016em] text-[#151515] sm:inline-flex"
                >
                  Coming Soon
                  <HugeiconsIcon icon={SparklesIcon} size={14} />
                </Badge>
              ) : isLocked ? (
                <Badge
                  variant="outline"
                  className="hidden rounded-lg border-[#D9D9D9] bg-[#EBEBEB] px-2 py-1 text-[12px] leading-4 font-normal tracking-[0.016em] text-[#151515] sm:inline-flex"
                >
                  {step.lockLabel ?? "Unlock Assessment"}
                  <LockKeyhole className="size-3.5" />
                </Badge>
              ) : null}

              {hasViewableSummary && step.slug ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/t/assessments/${step.slug}/summary`}>
                        View Summary
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {isComingSoon ? (
              <Button
                size="lg"
                disabled
                className="h-10 w-full rounded-lg bg-[#757575] text-base font-semibold tracking-[0.016em] text-white hover:bg-[#757575] disabled:bg-[#757575] disabled:text-white sm:w-42.5"
              >
                Coming Soon
              </Button>
            ) : isCompleted ? (
              <Button
                size="lg"
                disabled
                className="h-10 w-full rounded-lg bg-[#CCCCCC] text-base font-semibold tracking-[0.016em] text-[#151515] hover:bg-[#CCCCCC] disabled:bg-[#CCCCCC] disabled:text-[#151515] sm:w-42.5"
              >
                {step.ctaLabel}
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#34A853]">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={12}
                    strokeWidth={3}
                    className="text-white"
                  />
                </span>
              </Button>
            ) : canStart ? (
              <Button
                asChild
                size="lg"
                className="h-10 w-full rounded-lg bg-primary text-base font-semibold tracking-[0.016em] text-white hover:bg-primary/95 sm:w-42.5"
              >
                <Link href={startHref}>{step.ctaLabel}</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                disabled={isLocked}
                className="h-10 w-full rounded-lg bg-[#757575] text-base font-semibold tracking-[0.016em] text-white hover:bg-[#757575] disabled:bg-[#757575] disabled:text-white sm:w-42.5"
              >
                {step.ctaLabel}
              </Button>
            )}

            {step.slug === "skill" && !isComingSoon && !isLocked ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-10 w-full rounded-lg text-base font-semibold sm:w-auto"
              >
                <Link href="/t/assessments/practice">Practice first</Link>
              </Button>
            ) : null}

            {step.cooldownLabel ? (
              <p className="text-center text-sm leading-6 tracking-[0.016em] text-[#757575] sm:text-left">
                {step.cooldownLabel}
              </p>
            ) : null}

            {!step.cooldownLabel && step.estimatedTime ? (
              <p className="text-center text-sm leading-6 tracking-[0.016em] text-[#757575] sm:text-left">
                Estimated time: {step.estimatedTime}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
