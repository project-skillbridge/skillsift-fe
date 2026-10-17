"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditRoleFooterProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
};

export function EditRoleFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isLastStep,
}: EditRoleFooterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#b01e1e] transition-[width] duration-300 ease-out"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
      <div
        className={cn(
          "flex items-center",
          currentStep === 0 ? "justify-end" : "justify-between",
        )}
      >
        {currentStep > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-10 w-31 rounded-lg"
          >
            Back
          </Button>
        ) : null}
        <Button onClick={onNext} className="h-10 w-31 rounded-lg">
          {isLastStep ? "Send invite" : "Next"}
        </Button>
      </div>
    </div>
  );
}
