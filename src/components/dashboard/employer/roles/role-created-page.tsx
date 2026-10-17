"use client";

import { educationLabel } from "@/constants/employer-roles";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Box, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ASSESSMENT_OPTIONS,
  CURRENCY_SYMBOLS,
} from "@/constants/create-role-wizard";
import { useCreatedRoleStore } from "@/stores/created-role-store";

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#98A2B3]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#101828]">
        {value || "—"}
      </p>
    </div>
  );
}

export function RoleCreatedPage() {
  const router = useRouter();
  const role = useCreatedRoleStore((s) => s.role);

  useEffect(() => {
    if (!role) router.replace("/e/roles");
  }, [role, router]);

  if (!role) return null;

  const {
    title,
    category,
    companyUrl,
    uploadJd,
    workPreferences,
    selectedAssessments,
  } = role;
  const {
    employmentType,
    workArrangement,
    education,
    keywords,
    salaryMin,
    salaryMax,
    currency,
  } = workPreferences;

  const normalizedUrl =
    companyUrl && !companyUrl.startsWith("http")
      ? `https://${companyUrl}`
      : companyUrl;

  const hasSalary = !!(salaryMin || salaryMax);
  const symbol = currency ? (CURRENCY_SYMBOLS[currency] ?? currency) : "";
  const salaryDisplay = hasSalary
    ? `${symbol}${symbol ? " " : ""}${salaryMin ?? ""}${salaryMin && salaryMax ? " – " : ""}${salaryMax ?? ""}`
    : "—";

  const selectedOptions = selectedAssessments
    .map((id) => ASSESSMENT_OPTIONS.find((o) => o.id === id))
    .filter((o): o is (typeof ASSESSMENT_OPTIONS)[number] => !!o);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Role context header */}
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085]">
            <Box className="size-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#101828]">
              {title || "New Role"}
            </p>
            {(category || companyUrl) && (
              <p className="flex items-center gap-1 truncate text-xs text-[#667085]">
                {category && <span>{category}</span>}
                {category && companyUrl && <span>•</span>}
                {companyUrl && (
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[#101828]"
                  >
                    {companyUrl}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/e/talents")}
          className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101828] shadow-none ring-1 ring-[#E5E7EB] hover:bg-[#F9FAFB]"
        >
          Browse Talents
          <ArrowUpRight className="size-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Outer card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8">
          <h1 className="text-2xl font-bold text-[#101828]">
            Congrats, your role is now live!
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            You can now use this to send offer to job ready talents.
          </p>

          {/* Primary follow-ups. "View role" deep-links to the role's
              detail page when we have the backend id (newly-created roles
              will, older drafts read from the store may not). */}
          <div className="mt-6 flex flex-wrap gap-3">
            {role.id ? (
              <Button asChild className="h-10 rounded-lg">
                <Link href={`/e/roles/${role.id}`}>View role</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" className="h-10 rounded-lg">
              <Link href="/e/roles">View all roles</Link>
            </Button>
          </div>

          {/* Inner role details card */}
          <div className="mt-6 rounded-2xl border border-[#E5E7EB] p-8">
            <h2 className="text-xl font-bold text-[#101828]">{title}</h2>

            {/* Work preferences grid */}
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
              <PreviewField label="Employment type" value={employmentType} />
              <PreviewField label="Work arrangement" value={workArrangement} />
              <PreviewField
                label="Education"
                value={educationLabel(education)}
              />
              <PreviewField label="Salary range" value={salaryDisplay} />
              {keywords && keywords.length > 0 && (
                <PreviewField
                  label="Keywords"
                  value={keywords.map((k) => `#${k}`).join(" ")}
                />
              )}
            </div>

            <hr className="my-8 border-[#F2F4F7]" />

            {/* JD */}
            <div>
              <p className="font-bold text-[#101828]">Job Description:</p>
              {uploadJd.jdFile ? (
                <p className="mt-3 text-sm text-[#667085]">
                  {uploadJd.jdFile.name}
                </p>
              ) : (
                <div
                  className="mt-4 text-sm leading-7 text-[#344054] [&_b]:font-semibold [&_i]:italic [&_u]:underline"
                  dangerouslySetInnerHTML={{ __html: uploadJd.jdHtml }}
                />
              )}
            </div>

            {/* Assessments */}
            {selectedOptions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#101828]">
                  Assessment attached
                </h3>
                <div className="mt-3 flex flex-col gap-3">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] p-4"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0D2025]">
                        <FlaskConical
                          className="size-5 text-[#4BB3C9]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#101828]">
                          {option.name}
                        </p>
                        <p className="mt-1 text-sm text-[#667085]">
                          {option.description}
                        </p>
                        <p className="mt-2 text-xs text-[#98A2B3]">
                          Estimated time: {option.estimatedTime}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-sm font-medium text-[#101828] underline underline-offset-2 transition-colors hover:text-[#667085]"
                      >
                        View assessment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
