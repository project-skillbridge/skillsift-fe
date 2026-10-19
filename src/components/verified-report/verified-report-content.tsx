import type { VerifiedProfileResponseData } from "@/types/api";

import { CertificatesSection } from "@/components/certificates/certificates-section";
import { getSkillBreakdownTabs } from "./verified-report-utils";
import { VerifiedReportHeader } from "./verified-report-header";
import { VerifiedReportSkillsSection } from "./verified-report-skills-section";
import {
  VerifiedReportSummary,
  type VerifiedProfileTrackRecordData,
  type VerifiedProfileViewerMode,
} from "./verified-report-summary";

type VerifiedReportContentProps = {
  data: VerifiedProfileResponseData;
  viewerMode?: VerifiedProfileViewerMode;
  trackRecord?: VerifiedProfileTrackRecordData | null;
  preview?: boolean;
};

export function VerifiedReportContent({
  data,
  viewerMode = "owner",
  trackRecord = null,
  preview = false,
}: VerifiedReportContentProps) {
  return (
    <>
      <VerifiedReportHeader
        downloadDisabled={preview}
        viewerMode={viewerMode}
        resumeUrl={data.resume_url}
        shareUrl={data.share_url}
        qrCodeUrl={data.qr_code_url}
      />
      <section className="flex flex-col gap-y-5">
        <VerifiedReportSummary
          data={data}
          viewerMode={viewerMode}
          trackRecord={trackRecord}
        />
        {viewerMode === "owner" && !preview ? <CertificatesSection /> : null}
        <VerifiedReportSkillsSection skills={getSkillBreakdownTabs(data)} />
      </section>
    </>
  );
}
