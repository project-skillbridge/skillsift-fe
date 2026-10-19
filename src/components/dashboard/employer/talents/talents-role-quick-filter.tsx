"use client";

import { Target } from "lucide-react";

import { useEmployerRoles } from "@/hooks/api/use-employer-roles";
import { cn } from "@/lib/utils";
import type { TalentFilters } from "@/types/employer-talents";

type Props = {
  filters: TalentFilters;
  onPick: (next: Pick<TalentFilters, "roleTrack" | "experience">) => void;
};

/** One-tap "show me people for this open role" using the role's track and level. */
export function TalentsRoleQuickFilter({ filters, onPick }: Props) {
  const { data } = useEmployerRoles();
  const roles = (data ?? []).filter((r) => r.status === "active" && r.track);
  if (roles.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#344054]">
        <Target className="size-4 text-[#009f6a]" aria-hidden />
        Find talent for
      </span>
      {roles.map((role) => {
        const track = role.track as string;
        const experience = role.level ? [role.level] : [];
        const active =
          filters.roleTrack.length === 1 &&
          filters.roleTrack[0] === track &&
          filters.experience.join() === experience.join();
        return (
          <button
            key={role.id}
            type="button"
            onClick={() =>
              onPick(
                active
                  ? { roleTrack: [], experience: [] }
                  : { roleTrack: [track], experience },
              )
            }
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-[#009f6a] bg-[#D3E6DF] text-[#0d2025]"
                : "border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#F2F2F2]",
            )}
          >
            {role.title}
          </button>
        );
      })}
    </div>
  );
}
