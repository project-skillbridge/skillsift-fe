import { AssessmentEntry } from "@/components/assessment-taker/assessment-entry";

export default async function AssessmentTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <AssessmentEntry token={token} />;
}
