"use client";

import { useState } from "react";
import { useExpressInterest } from "@/hooks/api/use-talent-explore-jobs";
import type { ExploreJobRole } from "@/types/api/talent-explore-jobs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Briefcase, MapPin, Building2 } from "lucide-react";
import { AssessmentRequiredModal } from "./assessment-required-modal";

export function ExploreJobCard({ role }: { role: ExploreJobRole }) {
  const { mutate: expressInterest, isPending } = useExpressInterest();
  const [showModal, setShowModal] = useState(false);

  const handleInterest = () => {
    expressInterest(role.id, {
      onSuccess: () => toast.success(`Expressed interest in ${role.title}`),
      onError: (err: unknown) => {
        const errorObj = err as Record<string, unknown>;
        const responseObj = errorObj?.response as
          Record<string, unknown> | undefined;
        if (errorObj?.status === 403 || responseObj?.status === 403) {
          setShowModal(true);
        } else {
          toast.error(
            err instanceof Error ? err.message : "Failed to express interest",
          );
        }
      },
    });
  };

  const renderDate = (dateString: string) => {
    try {
      const parsed = parseISO(dateString);
      return isValid(parsed)
        ? formatDistanceToNow(parsed, { addSuffix: true })
        : "—";
    } catch {
      return "—";
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30">
            {role.employerLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={role.employerLogoUrl}
                alt={role.employerName}
                className="size-8 object-contain"
              />
            ) : (
              <Building2 className="size-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {role.title}
            </h3>
            <p className="text-sm text-muted-foreground">{role.employerName}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {role.employmentType && (
          <div className="flex items-center gap-1">
            <Briefcase className="size-3.5" />
            {role.employmentType}
          </div>
        )}
        {role.workArrangement && (
          <div className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {role.workArrangement}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {role.keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {renderDate(role.createdAt)}
        </span>

        <Button
          onClick={handleInterest}
          disabled={isPending || role.alreadyInterested || role.isFull}
          className="h-8 rounded-full px-4 text-xs font-medium"
          variant={role.alreadyInterested ? "secondary" : "default"}
        >
          {isPending
            ? "Sending..."
            : role.alreadyInterested
              ? "Interested"
              : role.isFull
                ? "Full"
                : "I'm interested"}
        </Button>
      </div>

      <AssessmentRequiredModal open={showModal} onOpenChange={setShowModal} />
    </article>
  );
}
