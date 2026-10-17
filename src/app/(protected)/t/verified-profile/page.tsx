import VerifiedReportPage from "@/components/verified-report/verified-report-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Profile",
  description: "Verified profile page for SkillSift",
  keywords: ["SkillSift", "verified profile skillsift"],
};

const Page = () => {
  return <VerifiedReportPage />;
};

export default Page;
