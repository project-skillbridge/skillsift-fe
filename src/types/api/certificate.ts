export type CertificateStatus = "valid" | "expired" | "revoked";

export type Certificate = {
  code: string;
  holder_name: string;
  track: string;
  track_label: string;
  level: string;
  level_label: string;
  /** ISO timestamps. */
  issued_at: string;
  expires_at: string;
  status: CertificateStatus;
};
