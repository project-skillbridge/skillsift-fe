import type { Metadata } from "next";

import { EmployerAssessmentDetailPage } from "@/components/dashboard/employer/assessments/employer-assessment-detail-page";

export const metadata: Metadata = {
  title: "Assessment",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployerAssessmentDetailPage assessmentId={id} />;
}
