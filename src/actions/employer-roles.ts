import { authApi } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api/common";
import type {
  CatalogueResponse,
  CreateRoleInput,
  EmployerRoleItem,
  EmployerRoleStatus,
  RawEmployerRole,
  UpdateRoleInput,
} from "@/types/api/employer-roles";

import { NO_EDUCATION_REQUIREMENT } from "@/constants/employer-roles";
import { unwrapData } from "./utils";

type RolesListEnvelope = {
  status: string;
  data: RawEmployerRole[];
};

function normalizeRole(raw: RawEmployerRole): EmployerRoleItem {
  const parts = [
    raw.employment_type,
    raw.work_arrangement,
    raw.education,
  ].filter(Boolean);
  return {
    id: raw.id,
    title: raw.title,
    status: raw.status,
    offersSent: raw.offers_sent_count,
    requirements: parts.length > 0 ? parts.join(" · ") : raw.category,
    isFull:
      raw.applicant_cap !== null && raw.interested_count >= raw.applicant_cap,
    createdAt: raw.created_at,
    track: raw.track ?? null,
    level: raw.level ?? null,
  };
}

export async function getRoles(params?: {
  status?: EmployerRoleStatus;
}): Promise<EmployerRoleItem[]> {
  const res = await authApi.get<ApiEnvelope<RolesListEnvelope>>(
    "/employer/roles",
    { params },
  );
  return unwrapData(res).data.map(normalizeRole);
}

export async function getEmployerRole(
  roleId: string,
): Promise<RawEmployerRole> {
  const res = await authApi.get<
    ApiEnvelope<{ status: string; data: RawEmployerRole }>
  >(`/employer/roles/${roleId}`);
  return unwrapData(res).data;
}

export async function closeRole(roleId: string): Promise<void> {
  await authApi.patch(`/employer/roles/${roleId}/close`);
}

export async function reopenRole(roleId: string): Promise<void> {
  await authApi.patch(`/employer/roles/${roleId}/reopen`);
}

function parseSalary(value: string): number | undefined {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0 || n > 99_999_999) return undefined;
  return n;
}

export async function getAssessmentCatalogue(params?: {
  page?: number;
  limit?: number;
}): Promise<CatalogueResponse> {
  const res = await authApi.get<ApiEnvelope<CatalogueResponse>>(
    "/employer/assessments/credlane-catalogue",
    { params },
  );
  return unwrapData(res);
}

export async function createRole(
  input: CreateRoleInput,
): Promise<RawEmployerRole> {
  const {
    title,
    track,
    level,
    category,
    jdHtml,
    jdFile,
    employmentType,
    workArrangement,
    education,
    keywords,
    salaryMin,
    salaryMax,
    currency,
    visibility,
    applicantCap,
    assessmentId,
  } = input;

  const apiEducation =
    education && education !== NO_EDUCATION_REQUIREMENT ? education : undefined;
  const min = parseSalary(salaryMin);
  const max = parseSalary(salaryMax);

  if (jdFile) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("track", track);
    if (level) formData.append("level", level);
    formData.append("jd_file", jdFile);
    if (employmentType) formData.append("employmentType", employmentType);
    if (workArrangement) formData.append("workArrangement", workArrangement);
    if (apiEducation) formData.append("education", apiEducation);
    keywords.forEach((k) => formData.append("keywords", k));
    if (min !== undefined) formData.append("salaryMin", String(min));
    if (max !== undefined) formData.append("salaryMax", String(max));
    if (currency) formData.append("currency", currency);
    if (visibility) formData.append("visibility", visibility);
    if (applicantCap !== undefined)
      formData.append(
        "applicantCap",
        applicantCap === null ? "" : String(applicantCap),
      );
    if (assessmentId) formData.append("assessmentId", assessmentId);
    const res = await authApi.post<ApiEnvelope<RawEmployerRole>>(
      "/employer/roles",
      formData,
    );
    return unwrapData(res);
  }

  const payload: Record<string, unknown> = { title, category, track };
  if (level) payload.level = level;
  if (jdHtml) payload.description = jdHtml;
  if (employmentType) payload.employmentType = employmentType;
  if (workArrangement) payload.workArrangement = workArrangement;
  if (apiEducation) payload.education = apiEducation;
  if (keywords.length > 0) payload.keywords = keywords;
  if (min !== undefined) payload.salaryMin = min;
  if (max !== undefined) payload.salaryMax = max;
  if (currency) payload.currency = currency;
  if (visibility) payload.visibility = visibility;
  if (applicantCap !== undefined) payload.applicantCap = applicantCap;
  if (assessmentId) payload.assessmentId = assessmentId;

  const res = await authApi.post<ApiEnvelope<RawEmployerRole>>(
    "/employer/roles",
    payload,
  );
  return unwrapData(res);
}

/** PATCH /employer/roles/{roleId}. Mirrors `createRole`'s payload contract:
 *  uses multipart when a new `jdFile` is attached, JSON otherwise. Only the
 *  fields the caller passed are forwarded (no defaults are filled in here). */
export async function updateRole(
  roleId: string,
  input: UpdateRoleInput,
): Promise<RawEmployerRole> {
  const {
    title,
    category,
    jdHtml,
    jdFile,
    employmentType,
    workArrangement,
    education,
    keywords,
    salaryMin,
    salaryMax,
    currency,
    visibility,
    applicantCap,
    assessmentId,
  } = input;

  const min = salaryMin !== undefined ? parseSalary(salaryMin) : undefined;
  const max = salaryMax !== undefined ? parseSalary(salaryMax) : undefined;

  if (jdFile) {
    const formData = new FormData();
    formData.append("jd_file", jdFile);
    if (title !== undefined) formData.append("title", title);
    if (category !== undefined) formData.append("category", category);
    if (employmentType !== undefined)
      formData.append("employmentType", employmentType);
    if (workArrangement !== undefined)
      formData.append("workArrangement", workArrangement);
    if (education !== undefined) formData.append("education", education);
    if (keywords) keywords.forEach((k) => formData.append("keywords", k));
    if (min !== undefined) formData.append("salaryMin", String(min));
    if (max !== undefined) formData.append("salaryMax", String(max));
    if (currency !== undefined) formData.append("currency", currency);
    if (visibility !== undefined) formData.append("visibility", visibility);
    if (applicantCap !== undefined)
      formData.append(
        "applicantCap",
        applicantCap === null ? "" : String(applicantCap),
      );
    if (assessmentId !== undefined && assessmentId !== null)
      formData.append("assessmentId", assessmentId);
    const res = await authApi.patch<ApiEnvelope<RawEmployerRole>>(
      `/employer/roles/${roleId}`,
      formData,
    );
    return unwrapData(res);
  }

  const payload: Record<string, unknown> = {};
  if (title !== undefined) payload.title = title;
  if (category !== undefined) payload.category = category;
  if (jdHtml !== undefined) payload.description = jdHtml;
  if (employmentType !== undefined) payload.employmentType = employmentType;
  if (workArrangement !== undefined) payload.workArrangement = workArrangement;
  if (education !== undefined) payload.education = education;
  if (keywords !== undefined) payload.keywords = keywords;
  if (min !== undefined) payload.salaryMin = min;
  if (max !== undefined) payload.salaryMax = max;
  if (currency !== undefined) payload.currency = currency;
  if (visibility !== undefined) payload.visibility = visibility;
  if (applicantCap !== undefined) payload.applicantCap = applicantCap;
  if (assessmentId !== undefined) payload.assessmentId = assessmentId;

  const res = await authApi.patch<ApiEnvelope<RawEmployerRole>>(
    `/employer/roles/${roleId}`,
    payload,
  );
  return unwrapData(res);
}
