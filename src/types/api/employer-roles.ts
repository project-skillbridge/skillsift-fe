export type EmployerRoleStatus = "active" | "closed";

export type EmployerRoleItem = {
  id: string;
  title: string;
  status: EmployerRoleStatus;
  offersSent: number;
  requirements: string;
  isFull: boolean;
  createdAt: string;
};

import { z } from "zod";
import { createRoleDialogSchema } from "@/types/create-role-schema";

/** Values captured by the Create Role dialog form. */
export type CreateRoleValues = z.infer<typeof createRoleDialogSchema>;

/** Raw API response from POST /employer/roles (snake_case). */
export type RawEmployerRole = {
  id: string;
  employer_user_id: string;
  title: string;
  category: string;
  track?: string | null;
  level?: string | null;
  description: string | null;
  jd_file_url: string | null;
  employment_type: string | null;
  work_arrangement: string | null;
  education: string | null;
  keywords: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  assessment_id: string | null;
  assessment: unknown | null;
  status: EmployerRoleStatus;
  offers_sent_count: number;
  visibility: "public" | "private";
  applicant_cap: number | null;
  interested_count: number;
  created_at: string;
  updated_at: string;
};

/** Single item from GET /employer/assessments/credlane-catalogue */
export type CatalogueAssessmentItem = {
  id: string;
  title: string;
  description: unknown;
  estimated_completion_time: string;
  role_track: string;
  experience_level: string;
};

export type CatalogueResponse = {
  catalogue: CatalogueAssessmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Shape passed to the createRole action from the wizard. */
export type CreateRoleInput = {
  title: string;
  /** Backend track slug, e.g. `frontend_developer`. Required by the API. */
  track: string;
  /** Target level (`junior` | `mid` | `senior` | `expert`). */
  level?: string;
  category: string;
  jdHtml: string;
  jdFile: File | null;
  employmentType: string;
  workArrangement: string;
  education: string;
  keywords: string[];
  salaryMin: string;
  salaryMax: string;
  currency: string;
  visibility?: "public" | "private";
  applicantCap?: number | null;
  assessmentId?: string;
};

/** PATCH /employer/roles/{roleId} body. Every field is optional — caller
 *  sends only what changed. Backend accepts an optional `jdFile` upload via
 *  multipart on the same route. */
export type UpdateRoleInput = {
  title?: string;
  category?: string;
  jdHtml?: string;
  jdFile?: File | null;
  employmentType?: string;
  workArrangement?: string;
  education?: string;
  keywords?: string[];
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  visibility?: "public" | "private";
  applicantCap?: number | null;
  assessmentId?: string | null;
};
