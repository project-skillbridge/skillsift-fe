"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

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
import { DEFAULT_ASSESSMENT_PASS_RATE } from "@/constants/employer-assessments";
import {
  createAssessmentDialogSchema,
  type CreateAssessmentValues,
} from "@/types/create-assessment-schema";

import { CreateAssessmentDialogFields } from "./create-assessment-dialog-fields";

type CreateAssessmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: (values: CreateAssessmentValues) => void;
};

export function CreateAssessmentDialog({
  open,
  onOpenChange,
  onContinue,
}: CreateAssessmentDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAssessmentValues>({
    resolver: zodResolver(createAssessmentDialogSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      roleTrack: "",
      experienceLevel: "mid",
      timeLimitMinutes: "30",
      passRate: DEFAULT_ASSESSMENT_PASS_RATE,
      type: "internal",
    },
  });

  const passRate =
    useWatch({ control, name: "passRate" }) ?? DEFAULT_ASSESSMENT_PASS_RATE;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: CreateAssessmentValues) => {
    onContinue?.(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-110 gap-4 rounded-[24px] p-6">
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-base font-semibold text-[#101828]">
            Create assessment
          </DialogTitle>
          <DialogDescription className="text-xs leading-5 text-[#667085]">
            Set it up in a minute, then add your questions.
          </DialogDescription>
        </DialogHeader>

        <CreateAssessmentDialogFields
          register={register}
          control={control}
          passRate={passRate}
          titleError={errors.title?.message}
          trackError={errors.roleTrack?.message}
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
