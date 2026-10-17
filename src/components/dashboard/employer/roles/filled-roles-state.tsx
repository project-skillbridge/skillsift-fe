"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Search, SquarePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  EmployerRoleItem,
  EmployerRoleStatus,
} from "@/types/api/employer-roles";
import { RoleCard } from "@/components/dashboard/employer/roles/role-card";
import { RolesSummaryCard } from "@/components/dashboard/employer/roles/roles-summary-card";

const OFFERS_SENT = "/assets/employer-roles/offers-sent.svg";
const COLORED_CASE = "/assets/employer-roles/colored-case.svg";

type FilledRolesStateProps = {
  roles: EmployerRoleItem[];
  onCreateRole: () => void;
};

export function FilledRolesState({
  roles,
  onCreateRole,
}: FilledRolesStateProps) {
  const [activeTab, setActiveTab] = useState<EmployerRoleStatus>("active");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesStatus = role.status === activeTab;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 ||
        role.title.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, roles, searchQuery]);

  const activeCount = roles.filter((role) => role.status === "active").length;
  const closedCount = roles.filter((role) => role.status === "closed").length;

  return (
    <>
      <section className="rounded-lg bg-[#F7F7F8] p-3">
        <div className="grid gap-3 md:grid-cols-2">
          <RolesSummaryCard
            icon={
              <Image
                src={COLORED_CASE}
                alt=""
                width={28}
                height={28}
                className="h-20 w-20 object-contain"
              />
            }
            label="My Roles"
            value={roles.length}
            helperText=" Top candidates aligned with your hiring"
            actionLabel="Create a Role"
            onActionClick={onCreateRole}
            actionIcon={<SquarePlus className="size-3.5" />}
          />
          <RolesSummaryCard
            icon={
              <Image
                src={OFFERS_SENT}
                alt=""
                width={28}
                height={28}
                className="h-20 w-20 object-contain"
              />
            }
            label="Invites sent"
            value={0}
            helperText="Candidates saved for interviews or next review."
            actionLabel="View shortlists"
            actionIcon={<ArrowRight className="size-3.5" />}
            actionIconPosition="after"
          />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98A2B3]" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search talent's name, level"
              className="h-10 rounded-full border-[#E5E7EB] bg-white pl-9 text-sm placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "active"
                  ? "bg-[#F2F4F7] text-[#111827]"
                  : "border border-[#D0D5DD] bg-white text-[#667085]",
              )}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("closed")}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "closed"
                  ? "bg-[#F2F4F7] text-[#111827]"
                  : "border border-[#D0D5DD] bg-white text-[#667085]",
              )}
            >
              Closed ({closedCount})
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        <p className="mt-4 text-sm text-[#667085]">
          Showing {filteredRoles.length} result
          {filteredRoles.length === 1 ? "" : "s"}
        </p>
      </section>
    </>
  );
}
