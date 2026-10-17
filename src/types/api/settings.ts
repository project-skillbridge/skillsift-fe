export type TalentSettingsUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
};

export type TalentSettingsProfile = {
  id: string;
  role_track: string | null;
  role_label: string | null;
  linkedin_url: string | null;
  bio: string | null;
  personal_website: string | null;
  resume_url: string | null;
  availability_status: string | null;
  is_published: boolean;
  status: string;
  profile_verified: boolean;
};

export type TalentSettingsNotificationPrefs = {
  newOffers: boolean;
  assessmentReminders: boolean;
  retakeWindowOpen: boolean;
};

export type TalentSettingsCommunicationPreferences = {
  email: TalentSettingsNotificationPrefs;
  inApp: TalentSettingsNotificationPrefs;
};

export type RawTalentSettingsNotificationPrefs = {
  newOffers?: boolean;
  assessmentReminders?: boolean;
  retakeWindowOpen?: boolean;
  new_offers?: boolean;
  assessment_reminders?: boolean;
  retake_window_open?: boolean;
};

export type RawTalentSettingsCommunicationPreferences = {
  email?: RawTalentSettingsNotificationPrefs;
  inApp?: RawTalentSettingsNotificationPrefs;
  in_app?: RawTalentSettingsNotificationPrefs;
};

export type TalentSettingsCommunicationPreferencesResponseData = {
  communication_preferences: RawTalentSettingsCommunicationPreferences;
};

export type TalentSettingsActiveSession = {
  label: string;
  is_current: boolean;
};

export type TalentSettingsAccount = {
  password_set: boolean;
  active_sessions: TalentSettingsActiveSession[];
};

export type TalentAvailabilityStatus =
  "actively_looking" | "open_to_opportunities" | "not_looking";

export type UpdateTalentAvailabilityInput = {
  availabilityStatus: TalentAvailabilityStatus;
};

export type UpdateTalentAvailabilityResponseData = {
  availability_status: TalentAvailabilityStatus;
  is_published: boolean;
};

export type AccountDataExport = {
  generated_at?: string;
  user?: Record<string, unknown>;
  talent_profile?: Record<string, unknown> | null;
  [key: string]: unknown;
};

export type AccountDataExportResponseData = {
  data_export: AccountDataExport;
  download_url?: string;
  email_sent?: boolean;
};

export type DeleteAccountInput = {
  confirmation: "DELETE";
};

export type UpdateTalentSettingsProfileInput = {
  firstName?: string;
  lastName?: string;
  roleTrack?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
};

export type TalentSettingsResponseData = {
  user: TalentSettingsUser;
  profile: TalentSettingsProfile;
  communication_preferences: TalentSettingsCommunicationPreferences;
  account: TalentSettingsAccount;
};
