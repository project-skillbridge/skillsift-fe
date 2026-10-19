"use client";

import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { SettingsAccountActionLink } from "@/components/settings/settings-account-action-link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteEmployerAccount } from "@/hooks/api";
import { authFailureMessage } from "@/lib/api";
import { clearPersistedSessionState } from "@/lib/client-session-cleanup";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const DELETE_CONFIRMATION_PHRASE = "DELETE MY ACCOUNT";

export function EmployerDeleteAccountDialog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAccount, isPending } = useDeleteEmployerAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const deleteInFlightRef = useRef(false);
  const isConfirmed = confirmation.trim() === DELETE_CONFIRMATION_PHRASE;

  const handleDelete = async () => {
    if (deleteInFlightRef.current || !isConfirmed) return;

    try {
      deleteInFlightRef.current = true;
      await deleteAccount({ confirmation: "DELETE" });
    } catch (error) {
      deleteInFlightRef.current = false;
      appToast.error(authFailureMessage(error));
      return;
    }

    appToast.success("Account deleted successfully.");
    queryClient.clear();
    clearPersistedSessionState();

    try {
      const result = await signOut({ callbackUrl: "/login", redirect: false });
      router.replace(result.url ?? "/login");
    } catch {
      // Sign-out failed: a full reload is the reliable way to reset client state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isPending) return;
        setIsOpen(open);
        if (!open) setConfirmation("");
      }}
    >
      <DialogTrigger asChild>
        <SettingsAccountActionLink destructive disabled={isPending}>
          Delete account
        </SettingsAccountActionLink>
      </DialogTrigger>
      <DialogContent className="max-w-97.5 gap-5 rounded-2xl p-6">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-base font-bold">
            Delete my account
          </DialogTitle>
          <DialogDescription className="max-w-67 text-xs leading-5">
            Are you sure you want to permanently delete your account?
          </DialogDescription>
        </DialogHeader>

        <label className="flex flex-col gap-2 text-xs text-muted-foreground">
          <span>
            Type{" "}
            <span className="font-semibold text-foreground">
              &quot;{DELETE_CONFIRMATION_PHRASE}&quot;
            </span>{" "}
            to confirm that you want to delete your SkillSift account.
          </span>
          <input
            value={confirmation}
            onChange={(event) =>
              setConfirmation(event.target.value.toUpperCase())
            }
            disabled={isPending}
            className={cn(
              "h-9 rounded-md border border-border bg-white px-3",
              "text-sm font-medium text-foreground outline-none",
              "transition-colors focus:border-primary",
              "focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
            )}
          />
        </label>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-md bg-[#D9D9D9] text-xs text-foreground hover:bg-[#D9D9D9]/80"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="h-9 rounded-md bg-[#DE3B46] text-xs text-white hover:bg-[#DE3B46]/90 disabled:bg-[#DE3B46] disabled:text-white disabled:opacity-60"
            disabled={!isConfirmed || isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting…" : "Delete my account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
