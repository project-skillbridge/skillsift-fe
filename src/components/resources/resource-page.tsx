"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTalentResources } from "@/hooks/api/use-resources";
import { CAREER_RESOURCE_SECTIONS } from "@/constants/career-resources";
import type { ResourceSection } from "@/types/resources";

import ResourcesHeroBanner from "./resources-hero-banner";
import ResourcesSection from "./resources-section";

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function sectionMatchesSearch(section: ResourceSection, query: string) {
  if (!query) return section;

  const items = section.items.filter((item) => {
    const visibleValues = [
      item.title,
      "description" in item ? item.description : undefined,
      item.duration,
    ];

    return visibleValues.some((value) =>
      String(value).toLowerCase().includes(query),
    );
  });

  return items.length ? { ...section, items } : undefined;
}

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { data, isPending, isError } = useTalentResources();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  // Sections render after the data loads, so the browser can't honour a
  // #hash on its own; jump to it once they exist.
  const loaded = !isPending && Boolean(data);
  useEffect(() => {
    if (!loaded || !window.location.hash) return;
    document
      .getElementById(decodeURIComponent(window.location.hash.slice(1)))
      ?.scrollIntoView({ block: "start" });
  }, [loaded]);

  const sections: ResourceSection[] = useMemo(
    () =>
      data
        ? [
            {
              id: "recommended-courses",
              title: "Recommended Courses",
              type: "article",
              items: data.resources.map((item) => ({
                url: item.url,
                title: item.title,
                description: item.description,
                duration: item.duration,
              })),
            },
            {
              id: "recommended-videos",
              title: "Recommended Videos",
              type: "video",
              items: data.videos.map((item) => ({
                url: item.url,
                title: item.title,
                duration: item.duration,
              })),
            },
          ]
        : [],
    [data],
  );
  const normalizedSearchQuery = normalizeSearchValue(debouncedSearchQuery);
  const filteredSections = useMemo(
    () =>
      [...sections, ...CAREER_RESOURCE_SECTIONS]
        .map((section) => sectionMatchesSearch(section, normalizedSearchQuery))
        .filter((section): section is ResourceSection => Boolean(section)),
    [sections, normalizedSearchQuery],
  );
  const hasSearchResults = filteredSections.length > 0;

  if (isPending) {
    return (
      <div className="flex flex-col gap-y-8 my-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="body-2">Loading resources…</span>
        </div>
        <div className="animate-pulse flex flex-col gap-y-8">
          <div className="w-full rounded-2xl min-h-40 md:min-h-57.75 bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center my-8 min-h-64">
        <p className="body text-muted-foreground">
          Failed to load resources. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-8 my-8">
      <ResourcesHeroBanner
        title={data.banner_title}
        description={data.banner_description}
      />
      <div className="flex flex-col gap-y-4">
        <InputGroup className="h-11 max-w-md border border-border bg-background shadow-none">
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground"
          >
            <Search className="size-4" aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search resources"
            aria-label="Search resources"
            className="bg-transparent text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery ? (
            <InputGroupAddon
              align="inline-end"
              className="pr-2 text-muted-foreground"
            >
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                className="text-muted-foreground opacity-100 hover:bg-muted hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-4 shrink-0" aria-hidden />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
        {hasSearchResults ? (
          filteredSections.map((section) => (
            <ResourcesSection key={section.id} {...section} />
          ))
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-muted/40 px-4 text-center">
            <p className="body text-muted-foreground">
              No resources match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
