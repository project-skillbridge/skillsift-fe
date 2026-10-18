"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateRoleDialog } from "@/components/dashboard/employer/roles/create-role-dialog";
import { buildCreateRoleUrl } from "@/lib/create-role-url";
import type { CreateRoleValues } from "@/types/api/employer-roles";
import { cn } from "@/lib/utils";
import { appToast } from "@/lib/toast";
import { useNeedsVerification } from "../shared/verification-notice";

import { SendOfferDialog } from "./send-offer-dialog";

type SendOfferTriggerProps = {
  userId: string;
  label?: string;
  className?: string;
};

/** Send-Offer split button: main button opens the role picker (the most
 *  common path), the chevron exposes "Create a new role" for first-time
 *  employers.
 */
export function SendOfferTrigger({
  userId,
  label = "Invite to Interview",
  className,
}: SendOfferTriggerProps) {
  const router = useRouter();
  const needsVerification = useNeedsVerification();
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  function handleCreateDialogContinue(values: CreateRoleValues) {
    setIsCreateDialogOpen(false);
    router.push(buildCreateRoleUrl(values));
  }

  return (
    <>
      <div
        className={cn(
          "inline-flex h-10 items-stretch overflow-hidden rounded-lg bg-[#05060F] text-white",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (needsVerification) {
              appToast.error(
                "Verify your company in settings before inviting talent.",
              );
              router.push("/e/settings");
              return;
            }
            setIsSelectDialogOpen(true);
          }}
          className="px-4 text-base font-semibold leading-5 tracking-[0.016em] transition-colors hover:bg-[#151515]/90"
        >
          {label}
        </button>
        <span className="my-1.5 w-px bg-white/20" aria-hidden />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More send-offer options"
              className="flex items-center justify-center px-2 transition-colors hover:bg-[#151515]/90"
            >
              <ChevronDown className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-52 rounded-xl border border-[#E4E7EC] bg-white p-2 shadow-[0_12px_32px_rgba(16,24,40,0.14)]"
          >
            <DropdownMenuItem
              onSelect={() => setIsSelectDialogOpen(true)}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
            >
              Select a role
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsCreateDialogOpen(true)}
              className="h-9 cursor-pointer rounded-md px-2 text-sm text-[#344054]"
            >
              Create a new role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role picker  */}
      <SendOfferDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        userId={userId}
      />

      <CreateRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateRole={handleCreateDialogContinue}
      />
    </>
  );
}
