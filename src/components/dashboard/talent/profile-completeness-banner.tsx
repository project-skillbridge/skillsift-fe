"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { useTalentSettings } from "@/hooks/api/use-settings";

/**
 * Employers only see talent with a photo, a resume and a portfolio link, so
 * anyone missing one is invisible to them. This tells the talent exactly
 * what to add.
 */
export function ProfileCompletenessBanner() {
  const pathname = usePathname();
  const { data } = useTalentSettings();

  if (!pathname?.startsWith("/t/dashboard") || !data) return null;

  const missing: string[] = [];
  if (!data.user.avatar_url) missing.push("a profile photo");
  if (!data.profile.resume_url) missing.push("your resume");
  if (!data.profile.personal_website) missing.push("a portfolio link");
  if (missing.length === 0) return null;

  const list =
    missing.length === 1
      ? missing[0]
      : `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]}`;

  return (
    <div
      role="status"
      className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#F5D99A] bg-[#FFF8E6] p-4"
    >
      <AlertCircle className="size-5 shrink-0 text-[#B54708]" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-[#7A2E0E]">
        Employers can&apos;t see your profile yet. Add {list} so you show up in
        their search.
      </p>
      <Link
        href="/t/settings"
        className="rounded-lg bg-[#05060F] px-3 py-2 text-sm font-semibold text-white"
      >
        Complete profile
      </Link>
    </div>
  );
}
