import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

type JobReadyVerifiedProfileProps = {
  firstName?: string;
  verifiedAt?: string;
  avatarUrl?: string;
  role?: string;
};

/** Returns "" on a missing/invalid date rather than a placeholder date —
 *  showing a fabricated verification date would be worse than showing
 *  nothing. Callers hide the "verified on" line when this is empty. */
function formatVerifiedDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function JobReadyVerifiedProfile({
  firstName,
  verifiedAt,
  avatarUrl,
  role,
}: JobReadyVerifiedProfileProps = {}) {
  const displayName = firstName || "Alex Smith";
  const verifiedOn = formatVerifiedDate(verifiedAt);
  const displayRole = role || "Frontend Developer";

  return (
    <section className="p-6 flex flex-col gap-0 w-full border border-border rounded-2xl bg-[#FAFAFA] text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[18px] font-bold tracking-tight">
          Verified profile
        </h2>
        <Link
          href="/t/verified-profile"
          className="flex items-center text-foreground text-[15px] font-medium hover:opacity-70 transition-opacity group label shrink-0"
        >
          <span className="underline underline-offset-4 decoration-gray-900">
            See full profile
          </span>
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Avatar */}
      <div className="mb-6">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={`${displayName} avatar`} />
          ) : null}
          <AvatarFallback className="bg-[#E5E5E5]">
            <Image
              src="/assets/user.svg"
              alt=""
              width={32}
              height={32}
              className="size-14 text-white"
            />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col mb-2">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-[32px] font-bold tracking-tight text-gray-900 leading-none">
            {displayName}
          </h3>
          <Badge className="bg-verified hover:bg-verified/90 text-white rounded-sm px-1.5 py-3.5 text-[12px] font-bold tracking-wider uppercase border-none shadow-none mt-1">
            Verified Talent
          </Badge>
        </div>
        <p className="text-[20px] text-gray-800 mb-2 font-normal">
          {displayRole}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 text-[15px] text-[#4B5563]">
        <span className="font-normal">Verified by SkillSift</span>
        {verifiedOn ? (
          <>
            <Separator
              orientation="vertical"
              className="h-4 bg-[#D1D5DB] hidden sm:block"
            />
            <span className="font-normal">
              Profile verified on {verifiedOn}
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}
