"use client";

import Link from "next/link";

import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { cn } from "@/lib/utils";

interface DashboardWelcomeProps {
  firstName?: string;
  goal?: string;
  /** Label that precedes `goal` in the subheading. Defaults to "Your Goal:";
   *  pass an empty string to render the goal text on its own (e.g. for the
   *  employer dashboard where the line is a tagline, not a goal). */
  goalLabel?: string;
  profileCompletion?: number;
  settingsHref?: string;
}

export function DashboardWelcome({
  firstName,
  goal = "Become a global talent",
  goalLabel = "Your Goal:",
  profileCompletion,
  settingsHref = "/t/settings",
}: DashboardWelcomeProps) {
  const { fullName } = useSessionUserProfile();
  const resolvedFirstName = firstName || fullName?.split(" ")[0] || "Alex";

  const showCta = profileCompletion == null || profileCompletion < 100;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#D5E5F4] bg-[#EEF7FF] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
          Welcome, {resolvedFirstName}!
        </h1>
        <p className="body mt-1 text-muted-foreground">
          {goalLabel ? <>{goalLabel} </> : null}
          <span>{goal}</span>
        </p>
      </div>

      {showCta ? (
        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
          <Link
            href={settingsHref}
            className={cn(
              "label text-foreground underline underline-offset-2",
              "hover:opacity-70 transition-opacity",
            )}
          >
            Complete your profile
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white ring-1 ring-[#D5E5F4]">
              <div
                className="h-full rounded-full bg-[#FE9667] transition-all duration-500"
                style={{ width: `${profileCompletion ?? 0}%` }}
              />
            </div>
            <span className="caption text-muted-foreground">
              {profileCompletion ?? 0}%
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
