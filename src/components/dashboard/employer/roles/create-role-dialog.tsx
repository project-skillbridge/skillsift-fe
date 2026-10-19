"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEmployerProfile } from "@/hooks/api";
import type { CreateRoleValues } from "@/types/api/employer-roles";
import { createRoleDialogSchema } from "@/types/create-role-schema";
import { CreateRoleDialogFields } from "./create-role-dialog-fields";

type CreateRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRole: (values: CreateRoleValues) => void;
};

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreateRole,
}: CreateRoleDialogProps) {
  const { data: profile } = useEmployerProfile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateRoleValues>({
    resolver: zodResolver(createRoleDialogSchema),
    mode: "onChange",
    values: {
      companyName: profile?.companyName ?? "",
      companyUrl: profile?.companyWebsite ?? "",
      roleTitle: "",
      track: "",
      level: "",
      showOnExploreJobs: true,
      applicantCap: null,
    },
    resetOptions: { keepDirtyValues: true },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: CreateRoleValues) => {
    onCreateRole(values);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-110 gap-4 rounded-[24px] p-6">
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-base font-semibold text-[#101828]">
            Create a Role
          </DialogTitle>
          <DialogDescription className="text-xs leading-5 text-[#667085]">
            Quickest way to send offers to your talents
          </DialogDescription>
        </DialogHeader>

        <CreateRoleDialogFields
          register={register}
          control={control}
          errors={errors}
          profilePrefilled={!!profile}
        />

        <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-md bg-[#8D8D8D] text-xs text-white hover:bg-[#8D8D8D]/90"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="h-9 rounded-md bg-[#111827] text-xs text-white hover:bg-[#111827]/90"
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
