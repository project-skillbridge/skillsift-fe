"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  CREATE_ROLE_STEPS,
  CREATE_ROLE_STEP_META,
  type CreateRoleStepId,
} from "@/constants/create-role-wizard";
import { workPreferencesSchema } from "@/types/create-role-schema";
import { useCreatedRoleStore } from "@/stores/created-role-store";
import { useCreateRole } from "@/hooks/api/use-employer-roles";
import { appToast } from "@/lib/toast";
import { trackLabel } from "@/constants/employer-roles";

import { WizardRoleHeader } from "./wizard-role-header";
import { WizardSidebar } from "./wizard-sidebar";
import { WizardMobileProgress } from "./wizard-mobile-progress";
import { WizardCardFooter } from "./wizard-card-footer";
import { StepUploadJd, type UploadJdValues } from "./step-upload-jd";
import {
  StepWorkPreferences,
  INITIAL_WORK_PREFERENCES,
} from "./step-work-preferences";
import type { WorkPreferencesValues } from "@/types/create-role-schema";
import { StepTalentAssessment } from "./step-talent-assessment";
import { StepPreview } from "./step-preview";

type WizardState = {
  uploadJd: UploadJdValues;
  workPreferences: WorkPreferencesValues;
  selectedAssessments: string[];
};

const INITIAL_STATE: WizardState = {
  uploadJd: { jdHtml: "", jdFile: null },
  workPreferences: INITIAL_WORK_PREFERENCES,
  selectedAssessments: [],
};

function isStepValid(stepId: CreateRoleStepId, state: WizardState): boolean {
  if (stepId === "upload-jd") {
    const { jdHtml, jdFile } = state.uploadJd;
    const hasText = jdHtml.replace(/<[^>]*>/g, "").trim().length > 0;
    return hasText || jdFile !== null;
  }
  if (stepId === "work-preferences") {
    return workPreferencesSchema.safeParse(state.workPreferences).success;
  }
  return true;
}

export function CreateRoleWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleTitle = searchParams.get("title") ?? "";
  const track = searchParams.get("track") ?? "";
  const level = searchParams.get("level") ?? "";
  const visibility =
    searchParams.get("visibility") === "private" ? "private" : "public";
  const capParam = Number(searchParams.get("applicantCap"));
  const applicantCap =
    Number.isInteger(capParam) && capParam > 0 ? capParam : null;
  const category = trackLabel(track);
  const companyUrl = searchParams.get("companyUrl") ?? "";

  useEffect(() => {
    // Direct visits (no dialog) would otherwise fail at submit with a 400.
    if (!roleTitle || !track || !level) router.replace("/e/roles");
  }, [roleTitle, track, level, router]);

  const [currentStepId, setCurrentStepId] =
    useState<CreateRoleStepId>("upload-jd");
  const [wizardState, setWizardState] = useState<WizardState>(INITIAL_STATE);

  const { mutate: submitRole, isPending } = useCreateRole();

  const currentIndex = CREATE_ROLE_STEPS.findIndex(
    (s) => s.id === currentStepId,
  );
  const isLastStep = currentIndex === CREATE_ROLE_STEPS.length - 1;
  const meta = CREATE_ROLE_STEP_META[currentStepId];
  const nextDisabled = !isStepValid(currentStepId, wizardState) || isPending;

  const handleNext = () => {
    if (isLastStep) {
      const { uploadJd, workPreferences, selectedAssessments } = wizardState;
      submitRole(
        {
          title: roleTitle,
          track,
          level,
          category,
          visibility,
          applicantCap,
          jdHtml: uploadJd.jdHtml,
          jdFile: uploadJd.jdFile,
          employmentType: workPreferences.employmentType,
          workArrangement: workPreferences.workArrangement,
          education: workPreferences.education,
          keywords: workPreferences.keywords ?? [],
          salaryMin: workPreferences.salaryMin ?? "",
          salaryMax: workPreferences.salaryMax ?? "",
          currency: workPreferences.currency ?? "",
          assessmentId: selectedAssessments[0],
        },
        {
          onSuccess: (createdRole) => {
            useCreatedRoleStore.getState().setRole({
              id: createdRole.id,
              title: roleTitle,
              category,
              companyUrl,
              uploadJd,
              workPreferences,
              selectedAssessments,
            });
            router.push("/e/roles/create/success");
          },
          onError: () => {
            appToast.error("Failed to create role. Please try again.");
          },
        },
      );
      return;
    }
    setCurrentStepId(CREATE_ROLE_STEPS[currentIndex + 1].id);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      router.push("/e/roles");
      return;
    }
    setCurrentStepId(CREATE_ROLE_STEPS[currentIndex - 1].id);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-8">
      <WizardRoleHeader
        title={roleTitle}
        category={category}
        companyUrl={companyUrl}
      />

      <WizardMobileProgress currentIndex={currentIndex} />

      <div className="flex items-start gap-5">
        <aside className="hidden w-56 shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm lg:block">
          <WizardSidebar currentStepId={currentStepId} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="px-8 pt-8">
            <h1 className="text-xl font-bold leading-tight text-[#101828]">
              {meta.title}
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#667085]">
              {meta.description}
            </p>
          </div>

          <div className="flex-1 px-8 py-6">
            {currentStepId === "upload-jd" && (
              <StepUploadJd
                values={wizardState.uploadJd}
                onChange={(uploadJd) =>
                  setWizardState((s) => ({ ...s, uploadJd }))
                }
              />
            )}
            {currentStepId === "work-preferences" && (
              <StepWorkPreferences
                values={wizardState.workPreferences}
                onChange={(workPreferences) =>
                  setWizardState((s) => ({ ...s, workPreferences }))
                }
              />
            )}
            {currentStepId === "talent-assessment" && (
              <StepTalentAssessment
                selectedAssessments={wizardState.selectedAssessments}
                onSelectionChange={(selectedAssessments) =>
                  setWizardState((s) => ({ ...s, selectedAssessments }))
                }
              />
            )}
            {currentStepId === "preview" && (
              <StepPreview
                uploadJd={wizardState.uploadJd}
                workPreferences={wizardState.workPreferences}
                selectedAssessments={wizardState.selectedAssessments}
              />
            )}
          </div>

          <WizardCardFooter
            currentIndex={currentIndex}
            isLastStep={isLastStep}
            isPending={isPending}
            nextDisabled={nextDisabled}
            tip={meta.tip}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
