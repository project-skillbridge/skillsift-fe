import type {
  EmployerCompanySize,
  EmployerHiringCountRange,
  EmployerJoiningRoleId,
  EmployerRegion,
  EmployerRoleTrackId,
} from "@/constants/employer-onboarding";

import type { AuthTokens, AuthUser } from "./auth";

export type TalentOnboardingGoalInput = {
  goal: string;
};

export type TalentOnboardingTrackCreateInput = {
  track: string;
};

export type TalentOnboardingTracksUpdateInput = {
  roleTracks: string[];
};

export type TalentOnboardingGoalResponseData = {
  goal: string;
};

export type TalentOnboardingTrackCreateResponseData = {
  track: string;
};

export type TalentOnboardingTracksUpdateResponseData = {
  roleTracks: string[];
};

export type CandidateOnboardingInput = {
  roleTrack: string;
  bio: string;
};

export type CandidateProfile = {
  id: string;
  userId: string;
  roleTrack: string;
  bio: string;
  isPublished: boolean;
  readinessScore: number;
};

export type CandidateOnboardingResponseData = {
  user: AuthUser;
  profile: CandidateProfile;
  tokens: AuthTokens;
};

export type EmployerOnboardingInput = {
  joiningAs: EmployerJoiningRoleId;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: EmployerCompanySize;
  region: EmployerRegion;
  linkedinCompanyPageUrl?: string;
  desiredRoles: EmployerRoleTrackId[];
  hiringCountRange?: EmployerHiringCountRange;
};

export type EmployerProfile = {
  id: string;
  userId: string;
  joiningAs: EmployerJoiningRoleId;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: EmployerCompanySize;
  region: EmployerRegion;
  linkedinCompanyPageUrl?: string;
  desiredRoles: EmployerRoleTrackId[];
  hiringCountRange?: EmployerHiringCountRange;
};

export type EmployerOnboardingResponseData = {
  user: AuthUser;
  profile: EmployerProfile;
  tokens: AuthTokens;
};

export type TalentOnboardingProfileInput = {
  region?: string;
  educationLevel?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  portfolioUrl?: string;
};

export type TalentOnboardingProfileResponseData = {
  region: string;
  education_level: string;
  onboarding_step: number;
  onboardingComplete: boolean;
};

export type TalentOnboardingPersonaliseResponseData = {
  message: string;
  status: string;
};

export type UploadAvatarResponseData = {
  avatarUrl: string;
};
