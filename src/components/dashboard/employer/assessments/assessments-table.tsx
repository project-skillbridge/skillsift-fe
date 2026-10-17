"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { levelLabel, trackLabel } from "@/constants/employer-roles";
import { useDataTable } from "@/hooks/use-data-table";
import { formatRelativeTime } from "@/lib/format-date";
import type { EmployerAssessmentItem } from "@/types/api/employer-assessments";

import { AssessmentStatusBadge } from "./assessment-status-badge";
import { AssessmentsRowActions } from "./assessments-row-actions";
import { DataEmptyState } from "../shared/data-empty-state";

type AssessmentsTableProps = {
  assessments: EmployerAssessmentItem[];
  isLoading?: boolean;
  isError?: boolean;
};

function jobTitleFor(assessment: EmployerAssessmentItem): string {
  const track = trackLabel(assessment.roleTrack) || "—";
  const level = levelLabel(assessment.experienceLevel);
  return level ? `${track} (${level})` : track;
}

const columns: ColumnDef<EmployerAssessmentItem>[] = [
  {
    id: "select",
    header: () => <Checkbox aria-label="Select all assessments" />,
    cell: () => <Checkbox aria-label="Select row" />,
  },
  {
    id: "assessment",
    header: "Assessments",
    cell: ({ row }) => (
      <Link
        href={`/e/assessments/${row.original.id}`}
        className="flex items-center gap-3"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0B1220] text-white">
          <FlaskConical className="size-4" aria-hidden />
        </span>
        <span className="font-sans text-sm font-medium text-[#151515] hover:underline">
          {row.original.title}
        </span>
      </Link>
    ),
  },
  {
    id: "jobTitle",
    header: "Job Title (Role track)",
    cell: ({ row }) => (
      <span className="font-sans text-sm text-[#151515]">
        {jobTitleFor(row.original)}
      </span>
    ),
  },
  {
    id: "talents",
    header: "Talents",
    cell: ({ row }) => (
      <div className="font-sans text-sm">
        <p className="font-medium text-[#151515]">
          {row.original.talentsCount ?? "—"}
        </p>
        {row.original.submissionsCount != null ? (
          <p className="text-xs text-[#757575]">
            {row.original.submissionsCount} completed
          </p>
        ) : null}
      </div>
    ),
  },
  {
    id: "passRate",
    header: "Pass Rate",
    cell: ({ row }) => {
      const rate = row.original.passRate;
      if (rate == null) {
        return <span className="font-sans text-sm text-[#A1A1AA]">—</span>;
      }
      return (
        <div className="flex flex-col gap-1">
          <span className="font-sans text-sm font-medium text-[#151515]">
            {rate}%
          </span>
          <div className="h-1.5 w-20 rounded-full bg-[#E5E7EB]">
            <div
              className="bg-verified h-full rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, rate))}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <AssessmentStatusBadge assessment={row.original} />,
  },
  {
    id: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => (
      <span className="font-sans text-sm text-[#151515]">
        {row.original.lastActivityAt
          ? formatRelativeTime(row.original.lastActivityAt)
          : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <AssessmentsRowActions assessment={row.original} />
      </div>
    ),
  },
];

export function AssessmentsTable({
  assessments,
  isLoading = false,
  isError = false,
}: AssessmentsTableProps) {
  const table = useDataTable({
    data: assessments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <DataEmptyState
        icon="/assets/assessments/no-assessments.svg"
        title="Unable to load assessments"
        description="Something went wrong while loading assessments. Please try again."
      />
    );
  }

  if (isLoading && assessments.length === 0) {
    return (
      <div className="flex min-h-70 items-center justify-center py-12 text-sm text-[#757575]">
        Loading assessments…
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <DataEmptyState
        icon="/assets/assessments/no-assessments.svg"
        title="Nothing here yet"
        description="No assessments match this view. Try another tab or search."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#FAFAFA]">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-sm font-medium text-[#52525B] whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
