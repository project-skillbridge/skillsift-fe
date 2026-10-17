import { cn } from "@/lib/utils";

/** Talent are identity-verified on SkillSift; link takers are not. */
export function CandidateSourceBadge({
  source,
}: {
  source: "talent" | "external";
}) {
  const verified = source === "talent";
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-medium",
        verified
          ? "bg-[#D1FAE5] text-[#065F46]"
          : "bg-[#F3F4F6] text-[#4B5563]",
      )}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}
