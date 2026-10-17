import type {
  EmployerCompanySize,
  EmployerHiringCountRange,
  EmployerJoiningRoleId,
  EmployerRegion,
  EmployerRoleTrackId,
} from "@/constants/employer-onboarding";

export type EmployerExperienceLevel = "junior" | "mid" | "senior" | "expert";

export type EmployerHiringCount = EmployerHiringCountRange | null;

export type RestrictedFieldMeta = {
  locked: boolean;
  last_changed_at: string | null;
  next_editable_at: string | null;
};

export type EmployerRestrictedFieldKey =
  "companyName" | "companyWebsite" | "linkedinCompanyPageUrl";

export type EmployerRestrictedFields = Partial<
  Record<EmployerRestrictedFieldKey, RestrictedFieldMeta>
>;

export type RawEmployerRestrictedFields = Partial<{
  company_name: RestrictedFieldMeta;
  company_website: RestrictedFieldMeta;
  linkedin_url: RestrictedFieldMeta;
}>;

export type RawEmployerProfileResponseData = {
  id: string;
  userId: string;
  joiningAs: EmployerJoiningRoleId;
  employerType?: EmployerJoiningRoleId;
  employer_type?: EmployerJoiningRoleId;
  companyName: string;
  company_name?: string;
  companyWebsite: string;
  company_website?: string;
  industry: string;
  companySize: EmployerCompanySize;
  company_size?: EmployerCompanySize;
  region: EmployerRegion;
  linkedinCompanyPageUrl: string | null;
  linkedin_company_page_url?: string | null;
  desiredRoles?: EmployerRoleTrackId[];
  hiringRoles?: EmployerRoleTrackId[];
  desired_roles?: EmployerRoleTrackId[];
  preferredExperienceLevels?: EmployerExperienceLevel[];
  preferred_experience_levels?: EmployerExperienceLevel[];
  hiringCount?: EmployerHiringCount;
  hiring_count_range?: EmployerHiringCount;
  restricted_fields?: RawEmployerRestrictedFields;
};

/** Slim profile passed to UI. Field names mirror PATCH body. */
export type EmployerProfileDetail = {
  id: string;
  userId: string;
  joiningAs: EmployerJoiningRoleId;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: EmployerCompanySize;
  region: EmployerRegion;
  linkedinCompanyPageUrl: string;
  hiringRoles: EmployerRoleTrackId[];
  preferredExperienceLevels: EmployerExperienceLevel[];
  hiringCount: EmployerHiringCount;
  restrictedFields: EmployerRestrictedFields;
};

export type EmployerTypePayload = "Recruiter" | "Founder" | "Agency";

export type UpdateEmployerProfileInput = {
  employerType?: EmployerTypePayload;
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: EmployerCompanySize;
  region?: EmployerRegion;
  linkedinCompanyPageUrl?: string;
  hiringRoles?: EmployerRoleTrackId[];
  preferredExperienceLevels?: EmployerExperienceLevel[];
  hiringCount?: EmployerHiringCount;
};

export type EmployerVerificationCriterion =
  "email_verified" | "website_resolvable" | "linkedin_provided";

export type RawEmployerVerificationStatusResponseData = {
  verified: boolean;
  criteria: Record<EmployerVerificationCriterion, boolean>;
  banner_visible: boolean;
};

export type EmployerVerificationStatus = {
  verified: boolean;
  criteria: Record<EmployerVerificationCriterion, boolean>;
  bannerVisible: boolean;
};
