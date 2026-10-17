"use client";

import Link from "next/link";
import { Box } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useCloseRole, useReopenRole } from "@/hooks/api";
import { formatRoleCardDate } from "@/lib/format-date";
import type { EmployerRoleItem } from "@/types/api/employer-roles";
import { StatusBadge } from "@/components/ui/status-badge";

export function RoleCard({ role }: { role: EmployerRoleItem }) {
  const { mutate: close, isPending: isClosing } = useCloseRole();
  const { mutate: reopen, isPending: isReopening } = useReopenRole();
  const isPending = isClosing || isReopening;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      reopen(role.id);
    } else {
      close(role.id);
    }
  };

  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors has-[a:hover]:border-[#D0D5DD]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#E4E7EC] text-[#667085]">
          <Box className="size-4 stroke-[1.7]" />
        </div>
        <Switch
          checked={role.status === "active"}
          onCheckedChange={handleToggle}
          disabled={isPending}
          aria-label={`Toggle ${role.title} status`}
          className="data-checked:bg-[#079455]"
        />
      </div>

      <div className="mt-6">
        <h3 className="line-clamp-2 text-[15px] font-medium leading-6">
          <Link
            href={`/e/roles/${role.id}`}
            className="text-[#101828] transition-colors hover:text-[#475467] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05060F]"
          >
            {role.title}
          </Link>
          {role.isFull && <StatusBadge variant="full" className="ml-2" />}
        </h3>

        <div className="mt-5 flex items-end gap-2">
          <p className="text-[48px] font-medium leading-none tracking-[-0.02em] text-[#101828]">
            {role.offersSent}
          </p>
          <p className="pb-1 text-xs text-[#667085]">Invite sent</p>
        </div>

        <p className="mt-4 text-sm text-[#475467]">{role.requirements}</p>
        <p className="mt-10 text-xs text-[#98A2B3]">
          {formatRoleCardDate(role.createdAt)}
        </p>
      </div>
    </article>
  );
}
