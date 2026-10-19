"use client";

import { educationLabel } from "@/constants/employer-roles";
import { FlaskConical } from "lucide-react";

import {
  ASSESSMENT_OPTIONS,
  CURRENCY_SYMBOLS,
} from "@/constants/create-role-wizard";
import type { WorkPreferencesValues } from "@/types/create-role-schema";
import type { UploadJdValues } from "./step-upload-jd";

type StepPreviewProps = {
  uploadJd: UploadJdValues;
  workPreferences: WorkPreferencesValues;
  selectedAssessments: string[];
};

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

export function StepPreview({
  uploadJd,
  workPreferences,
  selectedAssessments,
}: StepPreviewProps) {
  const {
    employmentType,
    workArrangement,
    education,
    keywords,
    salaryMin,
    salaryMax,
    currency,
  } = workPreferences;

  const hasSalary = !!(salaryMin || salaryMax);
  const symbol = currency ? (CURRENCY_SYMBOLS[currency] ?? currency) : "";
  const salaryDisplay = hasSalary
    ? `${symbol}${symbol ? " " : ""}${salaryMin ?? ""}${salaryMin && salaryMax ? " – " : ""}${salaryMax ?? ""}`
    : "—";

  const selectedOptions = selectedAssessments
    .map((id) => ASSESSMENT_OPTIONS.find((o) => o.id === id))
    .filter((o): o is (typeof ASSESSMENT_OPTIONS)[number] => !!o);

  return (
    <div className="flex flex-col gap-4">
      {/* JD card */}
      <div className="rounded-xl border border-[#E5E7EB] p-5">
        <p className="text-sm font-bold text-[#101828]">Job Description:</p>
        {uploadJd.jdFile ? (
          <p className="mt-3 text-sm text-[#667085]">{uploadJd.jdFile.name}</p>
        ) : (
          <div
            className="mt-3 max-h-52 overflow-y-auto text-sm leading-6 text-[#344054] [&_b]:font-semibold [&_i]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: uploadJd.jdHtml }}
          />
        )}
      </div>

      {/* Work preferences card */}
      <div className="rounded-xl border border-[#E5E7EB] p-5">
        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
          <PreviewField label="Employment type" value={employmentType} />
          <PreviewField label="Work arrangement" value={workArrangement} />
          <PreviewField label="Salary range" value={salaryDisplay} />
          <PreviewField label="Education" value={educationLabel(education)} />
          {keywords && keywords.length > 0 && (
            <PreviewField
              label="Keywords"
              value={keywords.map((k) => `#${k}`).join(" ")}
            />
          )}
        </div>
      </div>

      {/* Assessment cards */}
      {selectedOptions.map((option) => (
        <div
          key={option.id}
          className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] p-5"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0D2025]">
            <FlaskConical className="size-5 text-[#4BB3C9]" strokeWidth={1.5} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#101828]">
              {option.name}
            </p>
            <p className="mt-1 text-sm text-[#667085]">{option.description}</p>
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
  );
}
