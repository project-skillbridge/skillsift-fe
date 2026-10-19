"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { REGIONS, EDUCATION_LEVELS } from "@/constants/complete-profile";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { ProfileImageUploader } from "../complete-profile/profile-image-holder";
import { ReadOnlyField } from "../complete-profile/read-only-field";
import { SelectField } from "../complete-profile/select-field";
import { LinkedInField } from "../complete-profile/linkedin-field";
import { cn } from "@/lib/utils";

interface ProfileFormValues {
  region: string;
  education: string;
  linkedin: string;
  portfolio: string;
  profileImage?: File;
}

const PORTFOLIO_URL = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
const RESUME_ACCEPT = ".pdf,.doc,.docx,.txt";
const MAX_RESUME_MB = 10;

type CompleteProfileStepProps = {
  onReadyChange?: (ready: boolean) => void;
  onValueChange?: (values: {
    region: string;
    education: string;
    linkedin: string;
  }) => void;
  onImageChange?: (file: File) => void;
  onResumeChange?: (file: File | null) => void;
  onPortfolioChange?: (url: string) => void;
};

const CompleteProfileStep = ({
  onReadyChange,
  onValueChange,
  onImageChange,
  onResumeChange,
  onPortfolioChange,
}: CompleteProfileStepProps) => {
  const { fullName, email } = useSessionUserProfile();

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    mode: "onTouched",
    defaultValues: { region: "", education: "", linkedin: "", portfolio: "" },
  });

  const region = useWatch({ control, name: "region" });
  const education = useWatch({ control, name: "education" });
  const linkedin = useWatch({ control, name: "linkedin" });

  const portfolio = useWatch({ control, name: "portfolio" });

  const [hasImage, setHasImage] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const resumeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onPortfolioChange?.(portfolio.trim());
  }, [portfolio, onPortfolioChange]);

  useEffect(() => {
    onReadyChange?.(
      Boolean(
        region &&
        education &&
        hasImage &&
        resume &&
        PORTFOLIO_URL.test(portfolio.trim()),
      ),
    );
    onValueChange?.({ region, education, linkedin });
  }, [
    region,
    education,
    linkedin,
    portfolio,
    hasImage,
    resume,
    onReadyChange,
    onValueChange,
  ]);

  return (
    <form
      className="flex flex-col items-start gap-6 w-full max-w-2xl font-sans"
      onSubmit={(e) => e.preventDefault()}
    >
      <ProfileImageUploader
        onChange={(file) => {
          setValue("profileImage", file);
          setHasImage(true);
          onImageChange?.(file);
        }}
      />
      <p className="-mt-3 text-sm text-muted-foreground">
        A clear photo of your face is required. Employers hire people, not
        initials.
      </p>

      <div className="flex flex-col w-full gap-7">
        <ReadOnlyField label="Full name" value={fullName} />
        <ReadOnlyField label="Email" value={email} />
        <Controller
          name="region"
          control={control}
          rules={{ required: "Please select your region." }}
          render={({ field }) => (
            <SelectField
              label="Select your region"
              required
              options={REGIONS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.region?.message}
            />
          )}
        />
        <Controller
          name="education"
          control={control}
          rules={{ required: "Please select your highest level of education." }}
          render={({ field }) => (
            <SelectField
              label="What is your highest level of education?"
              required
              options={EDUCATION_LEVELS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.education?.message}
            />
          )}
        />
        <LinkedInField register={register} />

        <div className="flex w-full flex-col gap-1.25">
          <label className="text-base font-medium text-primary leading-5 tracking-tight">
            Portfolio or personal website <span aria-hidden>*</span>
          </label>
          <input
            {...register("portfolio", {
              required: "Add a link to your portfolio.",
              validate: (v) =>
                PORTFOLIO_URL.test(v.trim()) ||
                "Enter a full link, e.g. https://yourname.dev",
            })}
            type="url"
            placeholder="https://yourname.dev"
            className={cn(
              "h-11 w-full rounded-sm border border-border bg-background px-4 py-2.5",
              "text-sm text-primary outline-none transition-colors",
              "placeholder:text-muted-foreground/30 focus:border-primary",
            )}
          />
          {errors.portfolio?.message ? (
            <p className="text-sm text-destructive">
              {errors.portfolio.message}
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-1.25">
          <label className="text-base font-medium text-primary leading-5 tracking-tight">
            Resume <span aria-hidden>*</span>
          </label>
          <button
            type="button"
            onClick={() => resumeInput.current?.click()}
            className="flex h-11 w-full items-center gap-3 rounded-sm border border-dashed border-border px-4 text-left text-sm text-primary transition-colors hover:bg-muted/40"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {resume ? resume.name : "Upload your resume (PDF, DOC, DOCX)"}
            </span>
          </button>
          <input
            ref={resumeInput}
            type="file"
            accept={RESUME_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (file && file.size > MAX_RESUME_MB * 1024 * 1024) {
                setResumeError(`Resume must be under ${MAX_RESUME_MB} MB.`);
                return;
              }
              setResumeError(null);
              setResume(file);
              onResumeChange?.(file);
            }}
          />
          {resumeError ? (
            <p className="text-sm text-destructive">{resumeError}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default CompleteProfileStep;
