"use client";

import { useState } from "react";
import { Check, Copy, Download, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  certificateUrl,
  linkedInAddUrl,
  whatsAppShareUrl,
} from "@/lib/certificate";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";
import { appToast } from "@/lib/toast";
import type { Certificate } from "@/types/api";

export function CertificateShareActions({ cert }: { cert: Certificate }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const disabled = cert.status !== "valid";

  async function copy() {
    try {
      await navigator.clipboard.writeText(certificateUrl(cert.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link is still visible on the page.
    }
  }

  async function download() {
    setDownloading(true);
    try {
      await downloadCertificatePdf(cert);
    } catch {
      appToast.error("Couldn't create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copy} disabled={disabled}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={download}
        disabled={disabled || downloading}
      >
        <Download className="size-4" />
        {downloading ? "Preparing PDF" : "Download PDF"}
      </Button>
      <Button variant="outline" size="sm" asChild disabled={disabled}>
        <a
          href={linkedInAddUrl(cert)}
          target="_blank"
          rel="noreferrer"
          aria-disabled={disabled}
        >
          Add to LinkedIn
          <ExternalLink className="size-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild disabled={disabled}>
        <a
          href={whatsAppShareUrl(cert)}
          target="_blank"
          rel="noreferrer"
          aria-disabled={disabled}
        >
          Share on WhatsApp
          <ExternalLink className="size-4" />
        </a>
      </Button>
    </div>
  );
}
