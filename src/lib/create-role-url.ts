import type { CreateRoleValues } from "@/types/api/employer-roles";

/** Query string the role wizard reads; the dialog collects these up front. */
export function buildCreateRoleUrl(values: CreateRoleValues): string {
  const params = new URLSearchParams({
    title: values.roleTitle.trim(),
    track: values.track,
    level: values.level,
    companyUrl: values.companyUrl.trim(),
    visibility: values.showOnExploreJobs ? "public" : "private",
  });
  if (values.applicantCap)
    params.set("applicantCap", String(values.applicantCap));
  return `/e/roles/create?${params.toString()}`;
}
