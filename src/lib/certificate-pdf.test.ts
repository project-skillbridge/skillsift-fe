import { describe, expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";

import { downloadCertificatePdf } from "./certificate-pdf";

const cert = {
  code: "SK7Q2M9X4A",
  holder_name: "Aisha Agunbiade",
  track: "frontend_developer",
  track_label: "Frontend Developer",
  level: "senior",
  level_label: "Senior",
  issued_at: "2026-10-17T10:00:00.000Z",
  expires_at: "2028-04-17T10:00:00.000Z",
  status: "valid" as const,
};

const saved: { name: string; bytes: Buffer }[] = [];

vi.mock("jspdf", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jspdf")>();
  class CapturingPdf extends actual.jsPDF {
    // jsPDF defines save() per instance, so capture it here instead of
    // letting it try to write a file or trigger a browser download.
    constructor(...args: ConstructorParameters<typeof actual.jsPDF>) {
      super(...args);
      this.save = ((name: string) => {
        saved.push({ name, bytes: Buffer.from(this.output("arraybuffer")) });
        return this;
      }) as unknown as typeof this.save;
    }
  }
  return { ...actual, jsPDF: CapturingPdf };
});

describe("certificate PDF", () => {
  it("downloads a valid PDF named after the certificate code", async () => {
    await downloadCertificatePdf(cert);

    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe("skillsift-certificate-SK7Q2M9X4A.pdf");
    expect(saved[0].bytes.subarray(0, 5).toString()).toBe("%PDF-");
    if (process.env.CERT_PDF_OUT) {
      writeFileSync(process.env.CERT_PDF_OUT, saved[0].bytes);
    }
  });
});
