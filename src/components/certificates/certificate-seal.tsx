import { Check } from "lucide-react";

/** Scalloped rosette seal with a check, used as the certificate's mark of authenticity. */
export function CertificateSeal({
  tone = "valid",
}: {
  tone?: "valid" | "expired" | "revoked";
}) {
  const fill =
    tone === "valid" ? "#009F6A" : tone === "expired" ? "#EA580C" : "#DC2626";
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 === 0 ? 48 : 43;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <div className="relative size-16 drop-shadow-md sm:size-28">
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
        <polygon points={points} fill={fill} />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
      </svg>
      <Check
        className="absolute inset-0 m-auto size-7 text-white sm:size-12"
        strokeWidth={3}
      />
    </div>
  );
}
