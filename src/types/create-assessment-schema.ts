import { z } from "zod";

import {
  MAX_ASSESSMENT_PASS_RATE,
  MIN_ASSESSMENT_PASS_RATE,
} from "@/constants/employer-assessments";

export const createAssessmentDialogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  roleTrack: z.string().min(1, "Role track is required"),
  experienceLevel: z.enum(["junior", "mid", "senior"]),
  timeLimitMinutes: z.enum(["20", "30", "40", "60"]),
  passRate: z
    .number()
    .min(MIN_ASSESSMENT_PASS_RATE)
    .max(MAX_ASSESSMENT_PASS_RATE),
  type: z.enum(["internal", "external"]),
});

export type CreateAssessmentValues = z.infer<
  typeof createAssessmentDialogSchema
>;
