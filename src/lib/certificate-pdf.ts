import { certificateTitle, certificateUrl } from "@/lib/certificate";
import type { Certificate } from "@/types/api";

const GOLD: [number, number, number] = [201, 162, 74];
const INK: [number, number, number] = [27, 41, 53];
const GREEN: [number, number, number] = [0, 159, 106];
const MUTED: [number, number, number] = [110, 120, 130];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Builds the certificate as an A4 landscape PDF in the browser and downloads
 * it. The QR code points at the public verification page, so a printed copy
 * can still be checked against the live status.
 */
export async function downloadCertificatePdf(cert: Certificate) {
  const [{ jsPDF }, QRCode] = await Promise.all([
    import("jspdf"),
    import("qrcode"),
  ]);

  const url = certificateUrl(cert.code);
  const qr = await QRCode.toDataURL(url, {
    margin: 0,
    width: 400,
    color: { dark: "#1B2935", light: "#FFFEF9" },
  });

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;
  const cx = W / 2;

  doc.setFillColor(255, 254, 249);
  doc.rect(0, 0, W, H, "F");

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.4);
  doc.rect(9, 9, W - 18, H - 18);
  doc.setLineWidth(0.3);
  doc.rect(13, 13, W - 26, H - 26);

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("SkillSift", cx, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text("C E R T I F I C A T E   O F   A S S E S S M E N T", cx, 40, {
    align: "center",
  });

  doc.setTextColor(...MUTED);
  doc.setFontSize(12);
  doc.text("This certifies that", cx, 64, { align: "center" });

  doc.setTextColor(...INK);
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.text(cert.holder_name, cx, 86, { align: "center", maxWidth: W - 60 });

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(cx - 35, 95, cx + 35, 95);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(12);
  doc.text(
    "has passed the SkillSift skills assessment at the level of",
    cx,
    108,
    {
      align: "center",
    },
  );

  doc.setFont("times", "bold");
  doc.setTextColor(...GREEN);
  doc.setFontSize(26);
  doc.text(certificateTitle(cert), cx, 123, {
    align: "center",
    maxWidth: W - 60,
  });

  const row = 150;
  const cols: [string, string, number][] = [
    ["ISSUED", formatDate(cert.issued_at), 62],
    ["VALID UNTIL", formatDate(cert.expires_at), 128],
    ["CERTIFICATE ID", cert.code, 194],
  ];
  for (const [label, value, x] of cols) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label, x, row);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(value, x, row + 6);
  }

  // Seal
  doc.setFillColor(...GREEN);
  doc.circle(40, 172, 11, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.6);
  doc.lines(
    [
      [3.2, 3.4],
      [6.4, -7.2],
    ],
    34.8,
    172.4,
    [1, 1],
    "S",
  );

  // QR + verification line
  doc.addImage(qr, "PNG", W - 53, H - 56, 30, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Scan to verify", W - 38, H - 21, { align: "center" });

  doc.setFontSize(8);
  doc.text(`Verify this certificate at ${url}`, 60, H - 21);
  doc.text(
    "Records a pass on SkillSift's online skills assessment. Individual scores are not shown.",
    60,
    H - 17,
  );

  doc.save(`skillsift-certificate-${cert.code}.pdf`);
}
