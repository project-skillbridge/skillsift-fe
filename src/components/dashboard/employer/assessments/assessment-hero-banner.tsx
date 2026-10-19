"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { buildAssessmentDraftUrl } from "@/lib/create-assessment-url";
import type { CreateAssessmentValues } from "@/types/create-assessment-schema";

import { CreateAssessmentDialog } from "./create-assessment-dialog";

export function AssessmentHeroBanner() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleContinue = (values: CreateAssessmentValues) => {
    router.push(buildAssessmentDraftUrl(values));
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl bg-[#F1F6FE] px-5 py-6 sm:px-6 sm:py-8">
        <div className="relative z-10 flex flex-col gap-16 sm:max-w-[55%]">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold text-[#081536] sm:text-2xl">
              Need role-based assessments for your team?
            </h2>
            <p className="text-sm font-normal tracking-[0.017em] text-[#081536] sm:text-base">
              Create customized assessments tailored to your roles and evaluate
              talents with confidence
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-auto w-fit rounded-lg bg-[#05060F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#05060F]/90 sm:text-base"
          >
            Create assessment
          </Button>
        </div>

        <div className="pointer-events-none absolute top-0 right-2 hidden h-full w-[40%] max-w-105 sm:block">
          <Image
            src="/assets/assessments/assesment-empty.svg"
            alt="Hero Preview Illustration"
            fill
            className="object-contain object-right"
            priority
          />
        </div>
      </section>

      <CreateAssessmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onContinue={handleContinue}
      />
    </>
  );
}
