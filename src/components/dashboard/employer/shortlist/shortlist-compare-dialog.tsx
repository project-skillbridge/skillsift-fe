"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHiringBrief } from "@/hooks/api/use-employer-discovery";
import type { EmployerSavedCandidate } from "@/types/api/employer-discovery";

import { CandidateAvatar } from "../shared/candidate-avatar";

function pct(value: number | null | undefined) {
  return value == null ? "—" : `${Math.round(value)}%`;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-[#EEF0F3] pt-3">
      <span className="text-xs font-medium tracking-wide text-[#667085] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Column({ candidate }: { candidate: EmployerSavedCandidate }) {
  const { data, isLoading } = useHiringBrief(candidate.userId);
  const ready = data?.status === "ready" ? data : null;

  return (
    <div className="flex min-w-60 flex-1 flex-col gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-4">
      <div className="flex items-center gap-3">
        <CandidateAvatar
          avatarUrl={candidate.avatarUrl}
          fullName={candidate.fullName}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0d2025]">
            {candidate.fullName}
          </p>
          <p className="truncate text-xs text-[#667085]">
            {candidate.role || candidate.roleTrack}
            {candidate.validatedLevel ? ` · ${candidate.validatedLevel}` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Overall" value={pct(candidate.score)} />
        <Stat label="Skills" value={pct(ready?.stats.skill_percentage)} />
        <Stat
          label="Job ready"
          value={pct(ready?.stats.job_ready_percentage)}
        />
      </div>

      <Section label="Availability">
        <p className="text-sm text-[#0d2025]">
          {candidate.availabilityLabel || candidate.availability || "—"}
        </p>
      </Section>

      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-lg" />
      ) : ready ? (
        <>
          <Section label="Our read">
            <p className="text-sm font-medium text-[#0d2025]">
              {ready.brief.headline}
            </p>
          </Section>
          <Section label="Strengths">
            <ul className="list-disc space-y-1 pl-4 text-sm text-[#344054]">
              {ready.brief.strengths.slice(0, 3).map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
          </Section>
          <Section label="To check">
            <ul className="list-disc space-y-1 pl-4 text-sm text-[#344054]">
              {ready.brief.gaps.slice(0, 3).map((g) => (
                <li key={g.title}>{g.title}</li>
              ))}
            </ul>
          </Section>
          <Section label="Written answers">
            <p className="text-sm text-[#344054]">
              {ready.stats.open_answers_reviewed} read · confidence{" "}
              {ready.brief.confidence}
            </p>
          </Section>
        </>
      ) : (
        <p className="rounded-lg bg-[#F2F2F2] p-3 text-xs text-[#667085]">
          {data?.status === "generating"
            ? "Writing the AI summary…"
            : "No AI summary available yet."}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F2F2F2] px-2 py-2">
      <p className="text-base font-semibold text-[#0d2025]">{value}</p>
      <p className="text-[11px] text-[#667085]">{label}</p>
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: EmployerSavedCandidate[];
};

export function ShortlistCompareDialog({
  open,
  onOpenChange,
  candidates,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Compare shortlisted talent</DialogTitle>
          <DialogDescription>
            Side by side, from their skills test, job evaluation and written
            answers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 sm:flex-row">
          {candidates.map((c) => (
            <Column key={c.userId} candidate={c} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
