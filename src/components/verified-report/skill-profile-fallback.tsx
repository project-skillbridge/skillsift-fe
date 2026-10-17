"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { CertificateShareActions } from "@/components/certificates/certificate-share-actions";
import { formatAbsoluteDate } from "@/lib/format-date";
import { certificateTitle } from "@/lib/certificate";
import { formatOptionLabel } from "@/lib/utils";
import type {
  Certificate,
  DashboardPerformanceSkill,
  GuidanceRating,
} from "@/types/api";

type SkillProfileFallbackProps = {
  firstName: string;
  skill: DashboardPerformanceSkill;
  certificates: Certificate[];
};

function Ratings({ title, items }: { title: string; items: GuidanceRating[] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-xl border border-[#DBDBDB] bg-white p-4">
      <h3 className="font-semibold text-[#151515]">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <p className="text-sm font-medium text-[#151515]">{item.label}</p>
            <p className="text-sm text-[#535862]">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Shown while a talent is not yet visible to employers (the full verified
 * profile needs the advanced assessment). They still get a real page: their
 * level, their shareable certificates, and what to work on next.
 */
export function SkillProfileFallback({
  firstName,
  skill,
  certificates,
}: SkillProfileFallbackProps) {
  const report = skill.guidanceReport;
  const level = skill.passed ? formatOptionLabel(skill.validatedLevel) : null;

  return (
    <div className="my-8.5 flex flex-col gap-y-5">
      <div>
        <h2 className="text-2xl font-bold text-black">Your skill profile</h2>
        <p className="mt-1 text-base font-light">
          {level
            ? `${firstName}, you are verified at ${level} level.`
            : `${firstName}, you have not verified a level yet.`}
        </p>
      </div>

      {certificates.length > 0 ? (
        <section className="flex flex-col gap-3 rounded-xl border border-[#DBDBDB] bg-[#FAFAFA] p-4 md:p-6">
          <h3 className="text-lg font-semibold text-[#151515]">
            Certificates you can share
          </h3>
          {certificates.map((cert) => (
            <div
              key={cert.code}
              className="flex flex-col gap-3 rounded-lg border border-[#DBDBDB] bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-6 shrink-0 text-verified" />
                <div>
                  <Link
                    href={`/c/${cert.code}`}
                    className="font-semibold text-[#151515] underline underline-offset-2"
                  >
                    {certificateTitle(cert)}
                  </Link>
                  <p className="text-sm text-[#535862]">
                    Issued {formatAbsoluteDate(cert.issued_at)}, valid until{" "}
                    {formatAbsoluteDate(cert.expires_at)}. ID {cert.code}
                  </p>
                </div>
              </div>
              <CertificateShareActions cert={cert} />
            </div>
          ))}
        </section>
      ) : null}

      <section className="rounded-xl border border-[#DBDBDB] bg-[#FAFAFA] p-4 md:p-6">
        <h3 className="text-lg font-semibold text-[#151515]">Latest result</h3>
        <p className="mt-1 text-sm text-[#535862]">
          {skill.score} of {skill.maxScore} correct ({skill.percentage}%) on{" "}
          {formatAbsoluteDate(skill.completedAt)}.
        </p>
        {report?.ai_summary ? (
          <p className="mt-3 text-sm text-[#151515]">{report.ai_summary}</p>
        ) : null}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Ratings title="Strengths" items={report?.strength_ratings ?? []} />
          <Ratings
            title="Where to improve"
            items={report?.weak_area_ratings ?? []}
          />
        </div>
      </section>

      <Link
        href="/t/assessments"
        className="group flex items-center justify-between rounded-xl bg-[#151515] px-6 py-4 text-white"
      >
        <span>
          <span className="block font-semibold">
            {skill.passed
              ? "Take the advanced assessment to appear to employers"
              : "Retake the skill assessment"}
          </span>
          <span className="text-sm text-white/80">
            Your full verified profile unlocks once you are job ready.
          </span>
        </span>
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
