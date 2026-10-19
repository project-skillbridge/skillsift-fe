"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildAssessmentDraftUrl } from "@/lib/create-assessment-url";
import type { CreateAssessmentValues } from "@/types/create-assessment-schema";

import { PageHeader } from "../shared/page-header";
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
      <PageHeader
        title="Assessments"
        description="Test candidates on the skills a role needs, then rank and compare the results."
        actions={
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-11 gap-1.5 rounded-xl bg-[#0D2025] px-5 font-semibold text-white hover:bg-[#0D2025]/90"
          >
            <Plus className="size-4" aria-hidden />
            Create assessment
          </Button>
        }
      />

      <CreateAssessmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onContinue={handleContinue}
      />
    </>
  );
}
