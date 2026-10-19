"use client";

import { educationLabel } from "@/constants/employer-roles";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useCloseRole, useEmployerRole, useReopenRole } from "@/hooks/api";
import { formatRoleCardDate } from "@/lib/format-date";
import { StatusBadge } from "@/components/ui/status-badge";

type EmployerRoleDetailPageProps = {
  roleId: string;
};

function formatCompensation(
  min: number | null,
  max: number | null,
  currency: string | null,
): string | null {
  if (min == null && max == null) return null;
  const prefix = currency ?? "";
  if (min != null && max != null) {
    return `${prefix} ${min.toLocaleString()} - ${max.toLocaleString()}`.trim();
  }
  return `${prefix} ${(min ?? max)?.toLocaleString()}`.trim();
}

export function EmployerRoleDetailPage({
  roleId,
}: EmployerRoleDetailPageProps) {
  const router = useRouter();
  const { data: role, isLoading, isError } = useEmployerRole(roleId);
  const { mutate: close, isPending: isClosing } = useCloseRole();
  const { mutate: reopen, isPending: isReopening } = useReopenRole();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 py-8">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !role) {
    notFound();
  }

  const togglePending = isClosing || isReopening;
  const compensation = formatCompensation(
    role.salary_min,
    role.salary_max,
    role.currency,
  );

  const handleToggle = (checked: boolean) => {
    if (checked) {
      reopen(role.id);
    } else {
      close(role.id);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-8">
      <button
        type="button"
        onClick={() => router.push("/e/roles")}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#475467] transition-colors hover:text-[#101828]"
      >
        <ChevronLeft className="size-4" />
        Back to roles
      </button>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E4E7EC] text-[#667085]">
              <Package className="size-5 stroke-[1.7]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold leading-tight text-[#101828]">
                {role.title}
              </h1>
              <p className="text-sm text-[#475467]">{role.category}</p>
              <p className="text-xs text-[#98A2B3]">
                {formatRoleCardDate(role.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 text-sm text-[#475467]">
              <span>{role.status === "active" ? "Active" : "Closed"}</span>
              <Switch
                checked={role.status === "active"}
                onCheckedChange={handleToggle}
                disabled={togglePending}
                aria-label={`Toggle ${role.title} status`}
                className="data-checked:bg-[#079455]"
              />
            </div>
            <p className="text-sm font-medium text-[#101828]">
              <span className="text-2xl font-semibold">
                {role.offers_sent_count}
              </span>{" "}
              <span className="text-[#667085]">invites sent</span>
            </p>
            {role.applicant_cap !== null && (
              <p className="text-sm font-medium text-[#101828]">
                <span className="text-2xl font-semibold">
                  {role.interested_count}
                </span>{" "}
                <span className="text-[#667085]">
                  / {role.applicant_cap} applicants
                </span>
              </p>
            )}
            {role.applicant_cap !== null &&
              role.interested_count >= role.applicant_cap && (
                <StatusBadge variant="full" />
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {role.employment_type ? (
            <DetailField label="Employment type" value={role.employment_type} />
          ) : null}
          {role.work_arrangement ? (
            <DetailField
              label="Work arrangement"
              value={role.work_arrangement}
            />
          ) : null}
          {role.education ? (
            <DetailField
              label="Education"
              value={educationLabel(role.education)}
            />
          ) : null}
          {compensation ? (
            <DetailField label="Salary range" value={compensation} />
          ) : null}
          <DetailField
            label="Visibility"
            value={
              role.visibility === "public"
                ? "Shown on Explore Jobs"
                : "Private (Best Match only)"
            }
          />
        </div>

        {role.description ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#475467]">Description</p>
            <div
              className="text-base text-[#101828]"
              dangerouslySetInnerHTML={{ __html: role.description }}
            />
          </div>
        ) : null}

        {role.keywords && role.keywords.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#475467]">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {role.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-[#F2F4F7] px-3 py-1 text-sm text-[#344054]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="outline" className="h-10 rounded-lg">
            <Link href="/e/talents">Find candidates</Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-lg bg-[#111827] text-white hover:bg-[#111827]/90"
          >
            <Link href={`/e/roles/${role.id}/candidates`}>View Candidates</Link>
          </Button>
          <Button asChild variant="secondary" className="h-10 rounded-lg">
            <Link href="/e/shortlist">View invites sent</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-[#667085]">{label}</p>
      <p className="text-base font-medium text-[#101828]">{value}</p>
    </div>
  );
}
