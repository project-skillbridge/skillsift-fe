"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FormStep from "./form-step";
import SuccessStep from "./success-step";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step = "form" | "success";

const WaitlistModal = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState<Step>("form");

  function close() {
    onOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90vh] sm:w-full sm:max-w-133 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:shadow-2xl",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {step === "form"
              ? "Join the SkillSift waitlist"
              : "Congratulations"}
          </DialogPrimitive.Title>

          <div className="flex items-center border-b border-black/5 px-6 py-5 sm:hidden">
            <BrandLogo tone="dark" />
          </div>

          <DialogPrimitive.Close
            className="absolute right-5 top-5 hidden rounded-full p-1 text-primary-900/60 transition-colors hover:bg-black/5 hover:text-primary-900 sm:inline-flex"
            aria-label="Close"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          {step === "form" ? (
            <FormStep onSubmit={() => setStep("success")} onCancel={close} />
          ) : (
            <SuccessStep onBack={close} />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default WaitlistModal;
