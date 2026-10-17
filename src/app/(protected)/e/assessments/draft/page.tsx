import type { Metadata } from "next";

import { CreateAssessmentPage } from "@/components/dashboard/employer/assessments/create-assessment-page";

export const metadata: Metadata = {
  title: "Create Assessment",
};

export default function Page() {
  return <CreateAssessmentPage />;
}
