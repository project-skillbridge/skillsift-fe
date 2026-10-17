import type { ReactNode } from "react";
import DashboardNavbar from "@/components/dashboard/navbar";
import { ProfileCompletenessBanner } from "@/components/dashboard/talent/profile-completeness-banner";
import { AssessmentDemoShell } from "@/mock/assessment/assessment-demo-shell";

const TalentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col bg-[#FCFCFC]">
      <AssessmentDemoShell>
        <DashboardNavbar />
        <main className="flex-1">
          <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
            <ProfileCompletenessBanner />
            {children}
          </div>
        </main>
      </AssessmentDemoShell>
    </div>
  );
};

export default TalentLayout;
