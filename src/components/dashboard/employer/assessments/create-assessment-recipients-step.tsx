"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { CandidateAvatar } from "@/components/dashboard/employer/shared/candidate-avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MAX_ASSESSMENT_RECIPIENTS } from "@/constants/employer-assessments";
import { trackLabel } from "@/constants/employer-roles";
import { useSearchAssessmentTalent } from "@/hooks/api/use-employer-assessments";
import { levelLabel } from "@/constants/employer-roles";
import type { AssessmentTalentOption } from "@/types/api/employer-assessments";

type CreateAssessmentRecipientsStepProps = {
  /** Talent on this track are listed first. */
  roleTrack?: string;
  selected: AssessmentTalentOption[];
  onSelectedChange: (next: AssessmentTalentOption[]) => void;
};

/** "Ada Obi" -> "Ada O." until the employer unlocks the full profile. */
function maskedName(fullName: string): string {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last.charAt(0)}.` : first;
}

export function CreateAssessmentRecipientsStep({
  roleTrack,
  selected,
  onSelectedChange,
}: CreateAssessmentRecipientsStepProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [], isLoading } = useSearchAssessmentTalent(
    debounced,
    roleTrack,
  );
  const selectedIds = new Set(selected.map((s) => s.userId));
  const atLimit = selected.length >= MAX_ASSESSMENT_RECIPIENTS;

  const toggle = (person: AssessmentTalentOption, checked: boolean) => {
    if (checked) {
      if (!atLimit) onSelectedChange([...selected, person]);
      return;
    }
    onSelectedChange(selected.filter((s) => s.userId !== person.userId));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verified talent by name"
          className="h-10 pl-9 text-sm"
        />
      </div>

      <p className="font-sans text-xs text-[#667085]">
        {selected.length} selected
        {atLimit ? ` (limit of ${MAX_ASSESSMENT_RECIPIENTS} reached)` : ""}
      </p>

      <ul className="flex max-h-96 flex-col divide-y divide-[#F2F4F7] overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white">
        {isLoading ? (
          <li className="p-4 text-sm text-[#667085]">Searching...</li>
        ) : results.length === 0 ? (
          <li className="p-4 text-sm text-[#667085]">
            No verified talent matches that search.
          </li>
        ) : (
          results.map((person) => {
            const checked = selectedIds.has(person.userId);
            return (
              <li key={person.userId}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA]">
                  <Checkbox
                    checked={checked}
                    disabled={!checked && atLimit}
                    onCheckedChange={(v) => toggle(person, v === true)}
                  />
                  <CandidateAvatar
                    avatarUrl={null}
                    fullName={maskedName(person.fullName)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#101828]">
                      {maskedName(person.fullName)}
                    </span>
                    <span className="block truncate text-xs text-[#667085]">
                      {[
                        trackLabel(person.roleTrack),
                        levelLabel(person.verifiedLevel),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
