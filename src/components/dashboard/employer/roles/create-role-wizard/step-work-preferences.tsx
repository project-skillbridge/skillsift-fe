"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  WORK_ARRANGEMENT_OPTIONS,
} from "@/constants/create-role-wizard";
import {
  workPreferencesSchema,
  type WorkPreferencesValues,
} from "@/types/create-role-schema";
import { KeywordInput } from "./keyword-input";
import { SalaryRangeField } from "./salary-range-field";

export const INITIAL_WORK_PREFERENCES: WorkPreferencesValues = {
  employmentType: "",
  workArrangement: "",
  education: "",
  keywords: [],
  salaryMin: "",
  salaryMax: "",
  currency: "",
};

type StepWorkPreferencesProps = {
  values: WorkPreferencesValues;
  onChange: (values: WorkPreferencesValues) => void;
};

const TRIGGER_CLASS =
  "!h-12 w-full rounded-lg border-[#D0D5DD] bg-white text-sm text-[#101828] data-placeholder:text-[#98A2B3]";

export function StepWorkPreferences({
  values,
  onChange,
}: StepWorkPreferencesProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useForm<WorkPreferencesValues>({
    resolver: zodResolver(workPreferencesSchema),
    defaultValues: values,
    mode: "onChange",
  });

  const formValues = useWatch({ control });
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    onChangeRef.current(formValues as WorkPreferencesValues);
  }, [formValues]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#101828]">Employment type</p>
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={TRIGGER_CLASS}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employmentType && (
          <p className="mt-0.5 text-xs text-error">
            {errors.employmentType.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#101828]">Work arrangement</p>
        <Controller
          name="workArrangement"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={TRIGGER_CLASS}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {WORK_ARRANGEMENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.workArrangement && (
          <p className="mt-0.5 text-xs text-error">
            {errors.workArrangement.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#101828]">Education</p>
        <Controller
          name="education"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={TRIGGER_CLASS}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.education && (
          <p className="mt-0.5 text-xs text-error">
            {errors.education.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[#101828]">Keywords</p>
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <KeywordInput value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </div>

      <SalaryRangeField register={register} control={control} />
    </div>
  );
}
