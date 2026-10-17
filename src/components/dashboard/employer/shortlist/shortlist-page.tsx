"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { type ShortlistTabId } from "@/constants/employer-shortlist";
import { useSavedCandidates } from "@/hooks/api/use-employer-discovery";
import { useEmployerOffers } from "@/hooks/api/use-employer-offers";
import { authFailureMessage } from "@/lib/api";

import { DataPagination } from "../shared/data-pagination";
import { OffersTable } from "./offers-table";
import { ShortlistHeroBanner } from "./shortlist-hero-banner";
import { ShortlistTable } from "./shortlist-table";
import {
  PipelineStageStrip,
  STAGE_STATUSES,
  type PipelineStageId,
} from "./pipeline-stage-strip";
import { SHORTLIST_TAB_IDS, ShortlistToolbar } from "./shortlist-toolbar";

const PAGE_SIZE = 20;

export function ShortlistPage() {
  const searchParams = useSearchParams();
  // Deep-linkable — e.g. links from the dashboard's pending-feedback banner
  // need to land straight on "Offers Sent", not the default shortlist tab.
  const [activeTab, setActiveTab] = useState<ShortlistTabId>(
    searchParams.get("tab") === "offers" ? "offers" : "shortlist",
  );
  const [page, setPage] = useState(1);
  const [offersPage, setOffersPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [stage, setStage] = useState<PipelineStageId>(
    searchParams.get("tab") === "offers" ? "invited" : "shortlisted",
  );

  const { data: savedData, isLoading: isSavedLoading } = useSavedCandidates({
    page,
    limit: PAGE_SIZE,
  });

  const {
    data: offersData,
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
  } = useEmployerOffers(
    { page: offersPage, limit: PAGE_SIZE },
    { enabled: activeTab === "offers" },
  );

  // Whole-funnel counts for the stage strip (invites aren't paged here).
  const { data: allOffers } = useEmployerOffers({ page: 1, limit: 100 });
  const stageCounts = useMemo(() => {
    const live = (allOffers?.offers ?? []).filter(
      (o) => o.status !== "withdrawn",
    );
    const inStage = (id: "accepted" | "hired") =>
      live.filter((o) => STAGE_STATUSES[id]?.includes(o.status)).length;
    return {
      shortlisted: savedData?.total ?? 0,
      invited: live.length,
      accepted: inStage("accepted"),
      hired: inStage("hired"),
    };
  }, [allOffers?.offers, savedData?.total]);

  const savedTotal = savedData?.total ?? 0;
  const savedTotalPages = savedData?.totalPages ?? 1;
  const savedPage = savedData?.page ?? page;

  const offersTotal = offersData?.total ?? 0;
  const offersTotalPages = offersData?.totalPages ?? 1;
  const offersListPage = offersData?.page ?? offersPage;

  const searchTerm = searchValue.trim().toLowerCase();
  const filteredCandidates = useMemo(() => {
    const candidates = savedData?.candidates ?? [];
    if (!searchTerm) return candidates;
    return candidates.filter((c) =>
      [c.fullName, c.role, c.roleTrack, c.validatedLevel]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm)),
    );
  }, [savedData?.candidates, searchTerm]);

  const filteredOffers = useMemo(() => {
    let offers = offersData?.offers ?? [];
    const statuses = stage === "shortlisted" ? null : STAGE_STATUSES[stage];
    offers = statuses
      ? offers.filter((o) => statuses.includes(o.status))
      : offers.filter((o) => o.status !== "withdrawn");
    if (!searchTerm) return offers;
    return offers.filter((o) =>
      [o.candidateName, o.jobTitle, o.roleTrack ?? ""]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm)),
    );
  }, [offersData?.offers, searchTerm, stage]);

  const searchPlaceholder =
    activeTab === "shortlist"
      ? "Search talent's name, level"
      : "Search talent's name, Job title";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-8">
      <ShortlistHeroBanner />

      <PipelineStageStrip
        counts={stageCounts}
        active={stage}
        onSelect={(next) => {
          setStage(next);
          setActiveTab(next === "shortlisted" ? "shortlist" : "offers");
          setSearchValue("");
          setPage(1);
          setOffersPage(1);
        }}
      />

      <ShortlistToolbar
        activeTab={activeTab}
        shortlistCount={savedTotal}
        offersCount={stageCounts.invited}
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setStage(tab === "shortlist" ? "shortlisted" : "invited");
          setSearchValue("");
          setPage(1);
          setOffersPage(1);
        }}
        onSearchChange={setSearchValue}
      />

      {searchTerm ? (
        <p className="text-sm text-[#757575]">
          Search applies to the current page only. Browse pages or clear search
          to see more results.
        </p>
      ) : null}

      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        {activeTab === "shortlist" ? (
          <div
            role="tabpanel"
            id={SHORTLIST_TAB_IDS.shortlist.panelId}
            aria-labelledby={SHORTLIST_TAB_IDS.shortlist.tabId}
          >
            <ShortlistTable
              candidates={filteredCandidates}
              isLoading={isSavedLoading}
            />
            <DataPagination
              page={savedPage}
              totalPages={savedTotalPages}
              total={savedTotal}
              pageSize={PAGE_SIZE}
              itemLabel="talents"
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div
            role="tabpanel"
            id={SHORTLIST_TAB_IDS.offers.panelId}
            aria-labelledby={SHORTLIST_TAB_IDS.offers.tabId}
          >
            <OffersTable
              offers={filteredOffers}
              isLoading={isOffersLoading}
              isError={isOffersError}
              errorMessage={
                offersError ? authFailureMessage(offersError) : undefined
              }
            />
            <DataPagination
              page={offersListPage}
              totalPages={offersTotalPages}
              total={offersTotal}
              pageSize={PAGE_SIZE}
              itemLabel="offers"
              onPageChange={setOffersPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
