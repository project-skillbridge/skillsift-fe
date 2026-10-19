import { CircleAlert } from "lucide-react";

export default function CertificateNotFound() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-white p-8 text-center">
      <CircleAlert className="mx-auto size-10 text-muted-foreground" />
      <h1 className="mt-3 text-xl font-bold">Certificate not found</h1>
      <p className="body mt-2 text-muted-foreground">
        Check the ID and try again. Codes are 10 characters and contain no zero,
        one, O or I.
      </p>
    </div>
  );
}
