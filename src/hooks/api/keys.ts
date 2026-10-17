export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...usersKeys.lists(), params ?? {}] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

export const healthKeys = {
  all: ["health"] as const,
  check: () => [...healthKeys.all, "check"] as const,
};

export const assessmentKeys = {
  all: ["assessment"] as const,
  personalSession: () =>
    [...assessmentKeys.all, "personal", "session"] as const,
  session: (id: string) => [...assessmentKeys.all, "session", id] as const,
  skillAvailability: () =>
    [...assessmentKeys.all, "skill", "availability"] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  home: () => [...dashboardKeys.all, "home"] as const,
};

export const employerDashboardKeys = {
  all: ["employer-dashboard"] as const,
  home: () => [...employerDashboardKeys.all, "home"] as const,
};

export const employerDiscoveryKeys = {
  all: ["employer-discovery"] as const,
  candidateLists: () => [...employerDiscoveryKeys.all, "candidates"] as const,
  candidateList: (params?: Record<string, unknown>) =>
    [...employerDiscoveryKeys.candidateLists(), params ?? {}] as const,
  profiles: () => [...employerDiscoveryKeys.all, "profile"] as const,
  profile: (userId: string) =>
    [...employerDiscoveryKeys.profiles(), userId] as const,
  savedLists: () => [...employerDiscoveryKeys.all, "saved"] as const,
  savedList: (params?: { page?: number; limit?: number }) =>
    [...employerDiscoveryKeys.savedLists(), params ?? {}] as const,
};

export const employerOffersKeys = {
  all: ["employer-offers"] as const,
  lists: () => [...employerOffersKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...employerOffersKeys.lists(), params ?? {}] as const,
  details: () => [...employerOffersKeys.all, "detail"] as const,
  detail: (offerId: string) =>
    [...employerOffersKeys.details(), offerId] as const,
};

export const talentOffersKeys = {
  all: ["talent-offers"] as const,
  lists: () => [...talentOffersKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...talentOffersKeys.lists(), params ?? {}] as const,
  details: () => [...talentOffersKeys.all, "detail"] as const,
  detail: (offerId: string) =>
    [...talentOffersKeys.details(), offerId] as const,
};

export const resourcesKeys = {
  all: ["resources"] as const,
  talent: () => [...resourcesKeys.all, "talent"] as const,
};

export const verifiedProfileKeys = {
  all: ["verified-profile"] as const,
  talent: () => [...verifiedProfileKeys.all, "talent"] as const,
};

export const talentSettingsKeys = {
  all: ["talent-settings"] as const,
  detail: () => [...talentSettingsKeys.all, "detail"] as const,
};

export const employerProfileKeys = {
  all: ["employer-profile"] as const,
  detail: () => [...employerProfileKeys.all, "detail"] as const,
  verificationStatus: () =>
    [...employerProfileKeys.all, "verification-status"] as const,
};

export const aiGuidanceReport = {
  all: ["ai-guidance-report"] as const,
};

export const employerRolesKeys = {
  all: ["employer-roles"] as const,
  lists: () => [...employerRolesKeys.all, "list"] as const,
  details: () => [...employerRolesKeys.all, "detail"] as const,
  detail: (roleId: string) => [...employerRolesKeys.details(), roleId] as const,
  catalogue: (params?: { page?: number; limit?: number }) =>
    [...employerRolesKeys.all, "catalogue", params ?? {}] as const,
};

export const notificationsKeys = {
  all: ["notifications"] as const,
  // Role-scoped so talent and employer caches stay isolated
  list: (role: "talent" | "employer") =>
    [...notificationsKeys.all, role, "list"] as const,
  unreadCount: (role: "talent" | "employer") =>
    [...notificationsKeys.all, role, "unread-count"] as const,
};

export const publicVerifiedProfileKeys = {
  all: ["public-verified-profile"] as const,
  detail: (shareToken: string) =>
    [...publicVerifiedProfileKeys.all, shareToken] as const,
};

export const hireFeedbackKeys = {
  all: ["hire-feedback"] as const,
  pending: () => [...hireFeedbackKeys.all, "pending"] as const,
  talentTrackRecord: () =>
    [...hireFeedbackKeys.all, "talent-track-record"] as const,
};

export const employerAssessmentsKeys = {
  all: ["employer-assessments"] as const,
  lists: () => [...employerAssessmentsKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...employerAssessmentsKeys.lists(), params ?? {}] as const,
  details: () => [...employerAssessmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...employerAssessmentsKeys.details(), id] as const,
  results: (id: string) =>
    [...employerAssessmentsKeys.all, "results", id] as const,
};
