import { CheckCircle2, ClipboardList, Radio, Send } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { StatTile } from "../shared/stat-tile";

type AssessmentStatCardsProps = {
  total: number;
  active: number;
  /** Submissions received across all assessments. */
  completed: number;
  /** Talent invited directly across all assessments. */
  candidates: number;
  isLoading: boolean;
};

export function AssessmentStatCards({
  total,
  active,
  completed,
  candidates,
  isLoading,
}: AssessmentStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={ClipboardList}
        tone="green"
        label="Assessments"
        value={String(total)}
        hint="Created by you"
      />
      <StatTile
        icon={Radio}
        tone="sand"
        label="Live now"
        value={String(active)}
        hint="Open to candidates"
      />
      <StatTile
        icon={CheckCircle2}
        tone="violet"
        label="Completed"
        value={String(completed)}
        hint="Submissions received"
      />
      <StatTile
        icon={Send}
        tone="grey"
        label="Direct invites"
        value={String(candidates)}
        hint="SkillSift talent you invited"
      />
    </div>
  );
}
