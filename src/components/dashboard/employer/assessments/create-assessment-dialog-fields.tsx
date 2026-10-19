"use client";

import {
  type Control,
  Controller,
  type UseFormRegister,
} from "react-hook-form";

import { FormInput } from "@/components/custom/form-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  ASSESSMENT_LEVEL_OPTIONS,
  ASSESSMENT_TIME_LIMIT_OPTIONS,
  MAX_ASSESSMENT_PASS_RATE,
  MIN_ASSESSMENT_PASS_RATE,
} from "@/constants/employer-assessments";
import { TRACK_SELECT_OPTIONS } from "@/constants/talent-onboarding";
import { cn } from "@/lib/utils";
import type { CreateAssessmentValues } from "@/types/create-assessment-schema";

const formFieldLabelClass =
  "inline-flex flex-row items-start gap-0.5 p-0 shadow-none select-none " +
  "font-sans text-base font-medium leading-normal tracking-[0.256px] text-foreground";

const formFieldHintClass =
  "font-sans text-sm font-normal leading-[18px] tracking-[0.016em] text-muted-foreground";

type CreateAssessmentDialogFieldsProps = {
  register: UseFormRegister<CreateAssessmentValues>;
  control: Control<CreateAssessmentValues>;
  passRate: number;
  titleError?: string;
  trackError?: string;
};

export function CreateAssessmentDialogFields({
  register,
  control,
  passRate,
  titleError,
  trackError,
}: CreateAssessmentDialogFieldsProps) {
  return (
    <div className="space-y-4">
      <FormInput
        label="Assessment title"
        placeholder="e.g. frontend developer assessment"
        error={titleError}
        {...register("title")}
      />

      <Controller
        name="roleTrack"
        control={control}
        render={({ field }) => (
          <FormInput
            mode="select"
            label="Role track"
            placeholder="Select the closest track"
            description="Matches the track talent are verified on."
            options={TRACK_SELECT_OPTIONS}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            error={trackError}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="experienceLevel"
          control={control}
          render={({ field }) => (
            <FormInput
              mode="select"
              label="Level"
              options={[...ASSESSMENT_LEVEL_OPTIONS]}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <Controller
          name="timeLimitMinutes"
          control={control}
          render={({ field }) => (
            <FormInput
              mode="select"
              label="Time limit"
              options={[...ASSESSMENT_TIME_LIMIT_OPTIONS]}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex w-full flex-col items-stretch gap-1.5">
        <Label className={formFieldLabelClass}>Pass mark</Label>
        <Controller
          name="passRate"
          control={control}
          render={({ field }) => (
            <div className="relative pt-0.5">
              <Slider
                min={MIN_ASSESSMENT_PASS_RATE}
                max={MAX_ASSESSMENT_PASS_RATE}
                step={1}
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0] ?? 0)}
                className={cn(
                  "**:data-[slot=slider-track]:h-2",
                  "**:data-[slot=slider-track]:rounded-full",
                  "**:data-[slot=slider-track]:bg-[#E5E7EB]",
                  "**:data-[slot=slider-range]:rounded-full",
                  "**:data-[slot=slider-range]:bg-[#34A853]",
                  "**:data-[slot=slider-thumb]:size-5",
                  "**:data-[slot=slider-thumb]:border-0",
                  "**:data-[slot=slider-thumb]:bg-[#34A853]",
                  "**:data-[slot=slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
                  "**:data-[slot=slider-thumb]:ring-0",
                  "**:data-[slot=slider-thumb]:hover:ring-0",
                  "**:data-[slot=slider-thumb]:focus-visible:ring-0",
                )}
              />
              <span
                className="pointer-events-none absolute top-7 -translate-x-1/2 rounded-md bg-[#151515] px-2 py-0.5 text-xs font-semibold text-white"
                style={{
                  left: `${((passRate - MIN_ASSESSMENT_PASS_RATE) / (MAX_ASSESSMENT_PASS_RATE - MIN_ASSESSMENT_PASS_RATE)) * 100}%`,
                }}
              >
                {passRate}%
              </span>
              <div className="mt-1 flex justify-between">
                <div className="flex flex-col items-start gap-1">
                  <span className="ml-2 h-2 w-px bg-[#34A853]" aria-hidden />
                  <span className="text-[10px] font-semibold tracking-wide text-[#34A853]">
                    WEAK
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="mr-2 h-2 w-px bg-[#34A853]" aria-hidden />
                  <span className="text-[10px] font-semibold tracking-wide text-[#34A853]">
                    STRONG
                  </span>
                </div>
              </div>
            </div>
          )}
        />
        <p className={formFieldHintClass}>
          Candidates scoring below this do not pass.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <Label htmlFor="assessment-type" className={formFieldLabelClass}>
            Share by link
          </Label>
          <p className={formFieldHintClass}>
            Anyone with the link can take it. Leave off to invite verified
            SkillSift talent.
          </p>
        </div>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Switch
              id="assessment-type"
              checked={field.value === "external"}
              onCheckedChange={(checked) =>
                field.onChange(checked ? "external" : "internal")
              }
              className="data-checked:bg-[#079455]"
            />
          )}
        />
      </div>
    </div>
  );
}
