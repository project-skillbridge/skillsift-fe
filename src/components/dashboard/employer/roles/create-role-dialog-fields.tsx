"use client";

import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLOYER_ROLE_TRACKS } from "@/constants/employer-onboarding";
import { ROLE_LEVEL_OPTIONS } from "@/constants/employer-roles";
import type { CreateRoleValues } from "@/types/api/employer-roles";

type CreateRoleDialogFieldsProps = {
  register: UseFormRegister<CreateRoleValues>;
  control: Control<CreateRoleValues>;
  errors: FieldErrors<CreateRoleValues>;
  profilePrefilled?: boolean;
};

export function CreateRoleDialogFields({
  register,
  control,
  errors,
  profilePrefilled,
}: CreateRoleDialogFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="company-name"
          className="text-xs font-medium text-[#344054]"
        >
          Company Name
        </label>
        <Input
          id="company-name"
          {...register("companyName")}
          placeholder="Enter your company name"
          disabled={profilePrefilled}
          className="h-10 rounded-lg border-[#D0D5DD] bg-white text-sm placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="role-title"
          className="text-xs font-medium text-[#344054]"
        >
          Role Title
        </label>
        <Input
          id="role-title"
          {...register("roleTitle")}
          placeholder="Enter your role title"
          className="h-10 rounded-lg border-[#D0D5DD] bg-white text-sm placeholder:text-[#98A2B3]"
        />
        {errors.roleTitle && (
          <p className="text-[11px] text-red-500">{errors.roleTitle.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#344054]">Role track</label>
        <Controller
          name="track"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10 w-full rounded-lg border-[#D0D5DD] bg-white text-sm text-[#101828] data-placeholder:text-[#98A2B3]">
                <SelectValue placeholder="Select the closest track" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {EMPLOYER_ROLE_TRACKS.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-[11px] text-[#98A2B3]">
          We match this role to verified talent on the same track.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#344054]">
          Experience level
        </label>
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10 w-full rounded-lg border-[#D0D5DD] bg-white text-sm text-[#101828] data-placeholder:text-[#98A2B3]">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {ROLE_LEVEL_OPTIONS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="company-url"
          className="text-xs font-medium text-[#344054]"
        >
          Company URL
        </label>
        <Input
          id="company-url"
          {...register("companyUrl")}
          placeholder="Enter your website url"
          disabled={profilePrefilled}
          className="h-10 rounded-lg border-[#D0D5DD] bg-white text-sm placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label
            htmlFor="show-explore-jobs"
            className="text-xs font-medium text-[#344054]"
          >
            Show on Explore Jobs
          </label>
          <p className="text-[11px] text-[#667085]">
            Make this role visible to all matched talent.
          </p>
        </div>
        <Controller
          name="showOnExploreJobs"
          control={control}
          render={({ field }) => (
            <Switch
              id="show-explore-jobs"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-checked:bg-[#079455]"
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="applicant-cap"
          className="text-xs font-medium text-[#344054]"
        >
          Applicant Cap (Optional)
        </label>
        <Input
          id="applicant-cap"
          type="number"
          min={1}
          {...register("applicantCap", { valueAsNumber: true })}
          placeholder="e.g. 50"
          className="h-10 rounded-lg border-[#D0D5DD] bg-white text-sm placeholder:text-[#98A2B3]"
        />
        <p className="text-[11px] text-[#667085]">
          Maximum number of talent who can express interest.
        </p>
      </div>
    </div>
  );
}
