"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useExploreJobs,
  useWeeklyCapStatus,
} from "@/hooks/api/use-talent-explore-jobs";
import { ExploreJobCard } from "./explore-job-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Target } from "lucide-react";
import { WeeklyCapBanner } from "./weekly-cap-banner";

export function ExploreJobsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: capStatus, isLoading: isCapLoading } = useWeeklyCapStatus();
  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError,
  } = useExploreJobs({ page, limit });

  const hasHitWeeklyCap = capStatus?.weeklyRemaining === 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explore Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover exclusive roles that match your verified profile and skills.
        </p>
      </div>

      {hasHitWeeklyCap && <WeeklyCapBanner />}

      {!isCapLoading && capStatus && (
        <div className="flex items-start gap-4 rounded-xl border border-[#D0D5DD] bg-white p-4 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Target className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Weekly Interest Cap
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              You have used{" "}
              <strong className="font-medium text-foreground">
                {capStatus.usedThisWeek}
              </strong>{" "}
              out of{" "}
              <strong className="font-medium text-foreground">
                {capStatus.weeklyLimit}
              </strong>{" "}
              expressions of interest this week.
            </p>
            {capStatus.weeklyRemaining === 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle className="size-4" />
                Limit reached. Resets on{" "}
                {new Date(capStatus.resetsAt).toLocaleDateString()}.
              </div>
            )}
          </div>
        </div>
      )}

      {isJobsLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-error">
          <p>Failed to load jobs.</p>
        </div>
      ) : jobsData?.roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-sm font-medium text-foreground">
            No matching roles found.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Roles show up here when employers post openings that fit your
            verified level. Keep your skill result and profile up to date to be
            matched.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/t/dashboard">See your next step</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobsData?.roles.map((role) => (
              <ExploreJobCard key={role.id} role={role} />
            ))}
          </div>

          {(jobsData?.total ?? 0) > limit && (
            <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
              <p>
                Page {page} of {Math.ceil((jobsData?.total ?? 0) / limit)}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setPage((p) =>
                      p * limit < (jobsData?.total ?? 0) ? p + 1 : p,
                    )
                  }
                  disabled={page * limit >= (jobsData?.total ?? 0)}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
