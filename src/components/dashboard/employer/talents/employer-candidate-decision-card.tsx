"use client";

import Image from "next/image";
import { BadgeCheck, FileSearch } from "lucide-react";

import { ProgressRing } from "../shared/progress-ring";
import { useHiringBrief } from "@/hooks/api/use-employer-discovery";
import { formatAbsoluteDate } from "@/lib/format-date";
import type { EmployerDiscoveryCandidateProfile } from "@/types/api/employer-discovery";

const CONFIDENCE = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-white/70 px-4 py-3">
      <span className="text-xs font-medium text-[#475467]">{label}</span>
      <span className="text-lg font-semibold text-[#151515]">{value}</span>
    </div>
  );
}

/** First thing an employer sees: who this is and whether to take them forward. */
export function EmployerCandidateDecisionCard({
  profile,
}: {
  profile: EmployerDiscoveryCandidateProfile;
}) {
  const { data } = useHiringBrief(profile.userId);
  const ready = data?.status === "ready" ? data : null;
  const noEvidence = data?.status === "no_assessment";

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-[#dfe4e2] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              width={72}
              height={72}
              className="size-18 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-18 shrink-0 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#151515]"
            >
              {initials(profile.full_name)}
            </span>
          )}
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="truncate text-2xl font-bold tracking-tight text-[#151515] sm:text-3xl">
              {profile.full_name}
            </h1>
            <p className="text-base text-[#344054]">
              {profile.role} · {profile.seniority_badge}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-[#475467]">
              <BadgeCheck className="size-4 text-[#009f6a]" aria-hidden />
              Assessed on SkillSift · {formatAbsoluteDate(profile.verified_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/70 py-3 pr-5 pl-3">
          <ProgressRing
            fraction={profile.score_percentage / 100}
            size={72}
            stroke={8}
            trackClassName="stroke-[#E4E7EC]"
            barClassName="stroke-[#009f6a]"
          >
            <span className="text-lg font-bold text-[#151515]">
              {profile.score_percentage}%
            </span>
          </ProgressRing>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#151515]">
              {profile.tier_label}
            </span>
            <span className="text-xs text-[#475467]">Overall score</span>
          </div>
        </div>
      </div>

      {ready ? (
        <>
          <p className="max-w-3xl text-lg font-semibold text-[#151515] sm:text-xl">
            {ready.brief.headline}
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Fact
              label="Skills test"
              value={
                ready.stats.skill_percentage == null
                  ? "Not taken"
                  : `${ready.stats.skill_percentage}%`
              }
            />
            <Fact
              label="Job readiness"
              value={
                ready.stats.job_ready_percentage == null
                  ? "Not taken"
                  : `${ready.stats.job_ready_percentage}%`
              }
            />
            <Fact
              label="Written answers read"
              value={String(ready.stats.open_answers_reviewed)}
            />
            <Fact
              label="Brief confidence"
              value={CONFIDENCE[ready.brief.confidence]}
            />
          </div>
        </>
      ) : noEvidence ? (
        <p className="flex max-w-3xl items-start gap-2 text-sm text-[#344054]">
          <FileSearch className="mt-0.5 size-4 shrink-0" aria-hidden />
          The question-by-question answers behind this score are not on record
          yet, so there is no written breakdown. The score and level below are
          all we can show.
        </p>
      ) : (
        <p className="text-sm text-[#475467]">
          Reading how they answered each question…
        </p>
      )}
    </section>
  );
}
