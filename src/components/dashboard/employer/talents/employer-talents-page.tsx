"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getEmployerFilterLabel } from "@/constants/employer-talents";
import { useDiscoveryCandidates } from "@/hooks/api/use-employer-discovery";
import { cn } from "@/lib/utils";
import type { TalentFilters, TalentViewMode } from "@/types/employer-talents";
import { DEFAULT_FILTERS } from "@/types/employer-talents";

import { DataEmptyState } from "../shared/data-empty-state";
import { DataPagination } from "../shared/data-pagination";
import { TalentCard } from "./talent-card";
import { TalentsFilterChips } from "./talents-filter-chips";
import { TalentsFilterSidebar } from "./talents-filter-sidebar";
import { TalentsRoleQuickFilter } from "./talents-role-quick-filter";
import { TalentsHeroBanner } from "./talents-hero-banner";
import { TalentsViewToggle } from "./talents-view-toggle";

const PAGE_SIZE = 20;

export function EmployerTalentsPage() {
  const [view, setView] = useState<TalentViewMode>("list");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingFilters, setPendingFilters] =
    useState<TalentFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<TalentFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isError } = useDiscoveryCandidates(appliedFilters, {
    page,
    limit: PAGE_SIZE,
    search: appliedSearch,
  });

  const candidates = data?.candidates ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const listPage = data?.page ?? page;

  const handleApply = () => {
    setAppliedFilters(pendingFilters);
    setAppliedSearch(search.trim());
    setPage(1);
    setFiltersOpen(false);
  };

  const handleClear = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const removeChip = (
    key: keyof Pick<
      TalentFilters,
      "roleTrack" | "experience" | "availability" | "region"
    >,
    val: string,
  ) => {
    const updated = {
      ...appliedFilters,
      [key]: (appliedFilters[key] as string[]).filter((v) => v !== val),
    };
    setAppliedFilters(updated);
    setPendingFilters(updated);
    setPage(1);
  };

  const activeChips = [
    ...appliedFilters.experience.map((val) => ({
      key: "experience" as const,
      val,
      label: getEmployerFilterLabel("experience", val),
    })),
    ...appliedFilters.roleTrack.map((val) => ({
      key: "roleTrack" as const,
      val,
      label: getEmployerFilterLabel("roleTrack", val),
    })),
    ...appliedFilters.availability.map((val) => ({
      key: "availability" as const,
      val,
      label: getEmployerFilterLabel("availability", val),
    })),
    ...appliedFilters.region.map((val) => ({
      key: "region" as const,
      val,
      label: getEmployerFilterLabel("region", val),
    })),
  ];

  const activeFilterCount = activeChips.length;

  const sidebarProps = {
    filters: pendingFilters,
    search,
    onSearchChange: setSearch,
    onChange: setPendingFilters,
    onApply: handleApply,
    onClear: handleClear,
  };

  const emptyTitle = isError
    ? "Unable to load talents"
    : "No talents match your filters";
  const emptyDescription = isError
    ? "Something went wrong while loading candidates. Please try again."
    : (data?.emptyStateMessage ??
      "Try adjusting your filters or clear them to see more results.");

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-6 sm:py-8">
      <TalentsHeroBanner total={data?.total} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-sans text-lg font-semibold text-[#0D2025]">
          Talent list
        </h2>
        <TalentsViewToggle view={view} onChange={setView} />
      </div>

      <TalentsRoleQuickFilter
        filters={appliedFilters}
        onPick={(next) => {
          const updated = { ...appliedFilters, ...next };
          setAppliedFilters(updated);
          setPendingFilters(updated);
          setPage(1);
        }}
      />

      <TalentsFilterChips
        chips={activeChips}
        onRemove={removeChip}
        onClear={handleClear}
      />

      <Collapsible
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        className="lg:hidden"
      >
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              Filters
              {activeFilterCount > 0 ? (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform",
                filtersOpen && "rotate-180",
              )}
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <TalentsFilterSidebar {...sidebarProps} />
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <aside className="hidden lg:block">
          <TalentsFilterSidebar
            {...sidebarProps}
            className="lg:sticky lg:top-24"
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div
            className={cn(
              view === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
                : "flex flex-col gap-4 sm:gap-6",
            )}
          >
            {isLoading && candidates.length === 0 ? (
              <div className="py-12 text-center text-base text-muted-foreground">
                Loading talents…
              </div>
            ) : candidates.length === 0 ? (
              <DataEmptyState
                icon="/assets/icons/icon-shortlisted-candidates.svg"
                title={emptyTitle}
                description={emptyDescription}
              />
            ) : (
              candidates.map((candidate) => (
                <Link
                  key={candidate.userId}
                  href={`/e/talents/${candidate.userId}`}
                >
                  <TalentCard candidate={candidate} view={view} />
                </Link>
              ))
            )}
          </div>
          {!isLoading && total > 0 ? (
            <DataPagination
              page={listPage}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              itemLabel="talents"
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
