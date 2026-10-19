import type { Metadata } from "next";

import { PracticeAssessment } from "@/components/assessments/practice-assessment";

export const metadata: Metadata = { title: "Practice questions" };

export default function PracticePage() {
  return <PracticeAssessment />;
}
