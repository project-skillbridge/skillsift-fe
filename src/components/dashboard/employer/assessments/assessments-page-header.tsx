"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildAssessmentDraftUrl } from "@/lib/create-assessment-url";
import type { CreateAssessmentValues } from "@/types/create-assessment-schema";

import { CreateAssessmentDialog } from "./create-assessment-dialog";

/** Compact header shown once there's at least one assessment — the bigger
 *  illustrated `AssessmentHeroBanner` stays reserved for the empty state. */
export function AssessmentsPageHeader() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleContinue(values: CreateAssessmentValues) {
    router.push(buildAssessmentDraftUrl(values));
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#151515]">Assessments</h1>
          <p className="text-sm text-[#757575]">
            Create and manage custom assessments to evaluate and hire Job ready
            talents
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreateOpen(true)}
          className="w-fit gap-1.5 rounded-lg border-[#D9D9D9] font-semibold"
        >
          <Plus className="size-4" aria-hidden />
          Create assessment
        </Button>
      </div>

      <CreateAssessmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onContinue={handleContinue}
      />
    </>
  );
}
