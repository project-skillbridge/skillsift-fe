import Image from "next/image";
import { Check, Download, ExternalLink, Sparkles } from "lucide-react";

import { formatAbsoluteDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { VerifiedProfileResponseData } from "@/types/api";

import { HexagonScoreMark } from "./hexagon-score-mark";
import { VerifiedProfileTrackRecord } from "./verified-profile-track-record";
import {
  getAboutTags,
  describeLevel,
  getAiReport,
  formatValidatedLevel,
  getTopStrengths,
} from "./verified-report-utils";

export type VerifiedProfileViewerMode = "owner" | "employer" | "public";

export type VerifiedProfileTrackRecordData = {
  averageRating: number | null | undefined;
  ratingCount: number | null | undefined;
  wouldHireAgainRate: number | null | undefined;
};

type VerifiedReportSummaryProps = {
  data: VerifiedProfileResponseData;
  viewerMode: VerifiedProfileViewerMode;
  trackRecord?: VerifiedProfileTrackRecordData | null;
  /** Only meaningful for `viewerMode="employer"` — gates the CV download
   *  link. Employers browsing generally don't get a candidate's resume;
   *  once shortlisted, they do (mirrors the existing pattern where contact
   *  details unlock progressively as the relationship with a candidate
   *  advances, see `EmployerTalentContactPanel`). */
  isShortlisted?: boolean;
};

function TagRow({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-[#D9D9D9] bg-white px-3 py-1.5 text-sm text-[#151515]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function VerifiedReportSummary({
  data,
  viewerMode,
  trackRecord,
  isShortlisted = false,
}: VerifiedReportSummaryProps) {
  const verifiedOn = formatAbsoluteDate(data.verified_at);
  const topStrengths = getTopStrengths(data);
  const aboutTags = getAboutTags(data);
  const overview = getAiReport(data);
  const levelMeaning = describeLevel(
    data.skill_proficiency?.validated_level ?? data.seniority_badge,
  );
  const levelName = formatValidatedLevel(
    data.skill_proficiency?.validated_level ?? data.seniority_badge ?? "",
  );
  const canDownloadCv =
    viewerMode === "employer" && isShortlisted && Boolean(data.resume_url);

  return (
    <div className="flex flex-col gap-y-6 rounded-xl border border-[#DBDBDB] bg-[#FAFAFA] p-4 md:p-8">
      {/* Hero: identity + the hexagon score mark, amplified as the page's
          one confident focal point rather than a small corner badge. */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative shrink-0">
            <Image
              src={data.avatar_url ?? "/assets/placeholder-avatar.svg"}
              height={112}
              width={112}
              alt=""
              className="size-28 rounded-full object-cover"
              unoptimized={Boolean(data.avatar_url)}
            />
            {data.verified ? (
              <div
                className={cn(
                  "absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full text-white select-none shadow-sm",
                  "border-4 border-[#FAFAFA] bg-verified",
                )}
                title="Verified"
              >
                <Check className="size-4" strokeWidth={3} aria-hidden />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-3xl leading-tight font-bold text-[#151515]">
              {data.full_name}
            </p>
            <p className="text-lg font-light text-[#151515]">{data.role}</p>
            {verifiedOn ? (
              <p className="text-sm text-[#757575]">Verified {verifiedOn}</p>
            ) : null}
            {trackRecord ? (
              <VerifiedProfileTrackRecord
                averageRating={trackRecord.averageRating}
                ratingCount={trackRecord.ratingCount}
                wouldHireAgainRate={trackRecord.wouldHireAgainRate}
                className="mt-1 w-fit"
              />
            ) : null}
            {data.linkedin_url || canDownloadCv ? (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {data.linkedin_url ? (
                  <a
                    href={data.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-verified-strong flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    LinkedIn
                  </a>
                ) : null}
                {canDownloadCv ? (
                  <a
                    href={data.resume_url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-verified-strong flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    <Download className="size-4" aria-hidden />
                    Download CV
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <HexagonScoreMark
          value={data.score_percentage}
          tierLabel={data.tier_label}
          size={132}
          className="self-center sm:self-auto"
        />
      </div>

      {levelMeaning ? (
        <p className="rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-sm text-[#151515]">
          <span className="font-semibold">What {levelName} means: </span>
          {levelMeaning}
        </p>
      ) : null}

      {topStrengths.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-[#151515]">
            Top strengths
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {topStrengths.map((strength) => (
              <div
                key={strength.label}
                className="flex flex-col gap-1.5 rounded-lg border border-[#DBDBDB] bg-white p-4"
              >
                <p className="font-semibold text-[#151515]">{strength.label}</p>
                <span className="bg-verified/10 text-verified-strong w-fit rounded-full px-2.5 py-0.5 text-sm font-bold">
                  {strength.levelLabel}
                </span>
                {strength.insight ? (
                  <p className="text-sm text-[#535862]">{strength.insight}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.growth_insight ? (
        <section className="flex flex-col gap-2 rounded-lg border border-[#D9D9D9] bg-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-verified-strong" aria-hidden />
            <h3 className="font-semibold text-[#151515]">Growth trajectory</h3>
          </div>
          <p className="text-sm text-[#535862]">{data.growth_insight}</p>
        </section>
      ) : null}

      {aboutTags.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#151515]">About</h3>
          <TagRow items={aboutTags} />
        </section>
      ) : null}

      {data.working_style?.length ? (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#151515]">
            Working style
          </h3>
          <TagRow items={data.working_style} />
        </section>
      ) : null}

      {overview ? (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#151515]">Overview</h3>
          <p className="rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 text-sm text-[#151515]">
            {overview}
          </p>
        </section>
      ) : null}

      {viewerMode === "public" ? (
        <a
          href="/signup?user=employer"
          className="flex flex-col items-center gap-1 rounded-lg bg-[#151515] px-6 py-4 text-center text-white transition-opacity hover:opacity-90"
        >
          <span className="font-semibold">
            Want to hire verified talent like {data.full_name.split(" ")[0]}?
          </span>
          <span className="text-sm text-white/80">
            SkillSift for Employers →
          </span>
        </a>
      ) : null}
    </div>
  );
}
