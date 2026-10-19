import { cn } from "@/lib/utils";

/** Talent are SkillSift accounts; link takers only left an email, even if they later joined. */
export function CandidateSourceBadge({
  source,
  joined = false,
}: {
  source: "talent" | "external";
  /** A link taker who has since made a verified SkillSift account. */
  joined?: boolean;
}) {
  const verified = source === "talent";
  const label = verified
    ? "Verified"
    : joined
      ? "Joined SkillSift"
      : "Unverified";
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-medium",
        verified
          ? "bg-[#D1FAE5] text-[#065F46]"
          : joined
            ? "bg-[#DBEAFE] text-[#1E40AF]"
            : "bg-[#F3F4F6] text-[#4B5563]",
      )}
    >
      {label}
    </span>
  );
}
