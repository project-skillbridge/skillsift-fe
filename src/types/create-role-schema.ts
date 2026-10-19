import { z } from "zod";

export const createRoleDialogSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z
    .string()
    .min(1, "Role title is required")
    .refine((val) => !/\d/.test(val), "Role title cannot contain numbers"),
  track: z.string().min(1, "Role track is required"),
  level: z.string().min(1, "Experience level is required"),
  companyUrl: z.string(),
  showOnExploreJobs: z.boolean(),
  applicantCap: z
    .number()
    .min(1, "Minimum cap is 1")
    .nullable()
    .optional()
    .or(z.nan().transform(() => null)),
});

export const workPreferencesSchema = z.object({
  employmentType: z.string().min(1, "Employment type is required"),
  workArrangement: z.string().min(1, "Work arrangement is required"),
  education: z.string().min(1, "Education level is required"),
  keywords: z.array(z.string()).optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  currency: z.string().optional(),
});

export type WorkPreferencesValues = z.infer<typeof workPreferencesSchema>;
