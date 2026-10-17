"use client";

import { useMemo, useState } from "react";

import { useEmployerAssessments } from "@/hooks/api/use-employer-assessments";

import { AssessmentHeroBanner } from "./assessment-hero-banner";
import { AssessmentStatCards } from "./assessment-stat-cards";
import { AssessmentsPageHeader } from "./assessments-page-header";
import { AssessmentsTable } from "./assessments-table";
import {
  AssessmentsToolbar,
  type AssessmentsViewTab,
} from "./assessments-toolbar";
import { DataPagination } from "../shared/data-pagination";

const PAGE_SIZE = 10;

export function EmployerAssessmentsPage() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<AssessmentsViewTab>("all");

  // The API returns every assessment (it ignores page/limit), so the
  // stats are computed from the full list and paging happens here.
  const { data, isLoading, isError } = useEmployerAssessments();

  const total = data?.total ?? 0;

  // Once we've confirmed the account has assessments, don't swap back to
  // the full-page empty-state banner just because a background refetch
  // transiently reports total: 0 (react-query refetches on window focus
  // by default, and this list hits a staging API that's been flaky
  // elsewhere). "Storing info from previous renders" pattern — setting
  // state during render is intentional here, see React docs.
  const [hasConfirmedAssessments, setHasConfirmedAssessments] = useState(false);
  if (!hasConfirmedAssessments && total > 0) {
    setHasConfirmedAssessments(true);
  }

  const assessments = useMemo(
    () => (data?.assessments ?? []).filter((a) => a.status !== "inactive"),
    [data?.assessments],
  );

  const totals = useMemo(
    () => ({
      active: assessments.filter((a) => a.status === "active").length,
      completed: assessments.reduce((n, a) => n + (a.submissionsCount ?? 0), 0),
      candidates: assessments.reduce((n, a) => n + (a.talentsCount ?? 0), 0),
    }),
    [assessments],
  );

  const searchTerm = searchValue.trim().toLowerCase();
  const visibleAssessments = useMemo(() => {
    let list = assessments;

    if (searchTerm) {
      list = list.filter((a) =>
        [a.title, a.roleTrack, a.status]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchTerm)),
      );
    }

    if (activeTab === "activity") {
      list = list.filter((a) => a.lastActivityAt);
      list = [...list].sort((a, b) => {
        const aTime = a.lastActivityAt ? Date.parse(a.lastActivityAt) : 0;
        const bTime = b.lastActivityAt ? Date.parse(b.lastActivityAt) : 0;
        return bTime - aTime;
      });
    }

    return list;
  }, [assessments, searchTerm, activeTab]);

  const pageCount = Math.max(
    1,
    Math.ceil(visibleAssessments.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const pagedAssessments = visibleAssessments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const isEmpty =
    !isLoading && !isError && total === 0 && !hasConfirmedAssessments;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col gap-8 py-6 sm:min-h-[calc(100dvh-4.5rem)] sm:py-8">
      {isEmpty ? (
        <AssessmentHeroBanner />
      ) : (
        <>
          <AssessmentsPageHeader />
          <AssessmentStatCards
            total={assessments.length}
            active={totals.active}
            completed={totals.completed}
            candidates={totals.candidates}
            isLoading={isLoading}
          />
          <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <AssessmentsToolbar
              searchValue={searchValue}
              onSearchChange={(v) => {
                setSearchValue(v);
                setPage(1);
              }}
              activeTab={activeTab}
              onTabChange={(t) => {
                setActiveTab(t);
                setPage(1);
              }}
            />

            {searchTerm ? (
              <p className="text-sm text-[#757575]">
                Showing results for &ldquo;{searchValue.trim()}&rdquo;.
              </p>
            ) : null}

            <AssessmentsTable
              assessments={pagedAssessments}
              isLoading={isLoading}
              isError={isError}
            />

            {!isError && visibleAssessments.length > 0 ? (
              <DataPagination
                page={currentPage}
                totalPages={pageCount}
                total={visibleAssessments.length}
                pageSize={PAGE_SIZE}
                itemLabel="assessments"
                onPageChange={setPage}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
