"use client";

import Link from "next/link";
import { Target } from "lucide-react";

import { levelLabel, trackLabel } from "@/constants/employer-roles";
import { useEmployerRoles } from "@/hooks/api/use-employer-roles";
import { cn } from "@/lib/utils";
import type { EmployerDiscoveryCandidateProfile } from "@/types/api/employer-discovery";

const LEVELS = ["junior", "mid", "senior", "expert"];

type Fit = { label: string; tone: "good" | "close" | "stretch" };

function levelFit(candidate: string | null, wanted: string | null): Fit | null {
  if (!candidate || !wanted) return null;
  const gap = LEVELS.indexOf(candidate) - LEVELS.indexOf(wanted);
  if (Number.isNaN(gap) || LEVELS.indexOf(candidate) < 0) return null;
  if (gap === 0) return { label: "Level matches", tone: "good" };
  if (gap > 0)
    return {
      label: `${levelLabel(candidate)}, above the ${levelLabel(wanted)} you asked for`,
      tone: "good",
    };
  if (gap === -1)
    return {
      label: `One level below the ${levelLabel(wanted)} you asked for`,
      tone: "close",
    };
  return {
    label: `Below the ${levelLabel(wanted)} you asked for`,
    tone: "stretch",
  };
}

const TONE = {
  good: "bg-[#D3E6DF] text-[#0E7A55]",
  close: "bg-[#FFF0D1] text-[#B45309]",
  stretch: "bg-[#FDE2E7] text-[#BE123C]",
} as const;

/** How this person lines up with the employer's open roles in the same track. */
export function EmployerRoleFit({
  profile,
}: {
  profile: EmployerDiscoveryCandidateProfile;
}) {
  const { data } = useEmployerRoles();
  const roles = (data ?? [])
    .filter(
      (r) =>
        r.status === "active" &&
        profile.roleTrack != null &&
        r.track === profile.roleTrack,
    )
    .slice(0, 3);

  if (roles.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#151515]">
        <Target className="size-5" aria-hidden />
        Fit for your open roles
      </h2>
      <ul className="flex flex-col divide-y divide-[#EEF0F3]">
        {roles.map((role) => {
          const fit = levelFit(profile.validatedLevel, role.level ?? null);
          return (
            <li
              key={role.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-col">
                <Link
                  href={`/e/roles/${role.id}`}
                  className="truncate text-sm font-semibold text-[#151515] hover:underline"
                >
                  {role.title}
                </Link>
                <span className="text-xs text-[#667085]">
                  {trackLabel(role.track)}
                  {role.level ? ` · ${levelLabel(role.level)}` : ""}
                </span>
              </div>
              {fit ? (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    TONE[fit.tone],
                  )}
                >
                  {fit.label}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
