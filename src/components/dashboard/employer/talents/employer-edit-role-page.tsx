"use client";

import { educationLabel } from "@/constants/employer-roles";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerRole } from "@/hooks/api";
import { useDiscoveryCandidateProfile } from "@/hooks/api/use-employer-discovery";

import { ConfirmSendOfferDialog } from "./edit-role-wizard/confirm-send-offer-dialog";
import {
  EDIT_ROLE_STEP_META,
  EDIT_ROLE_STEPS,
} from "./edit-role-wizard/constants";
import {
  buildRolePatch,
  buildSalaryRangeLabel,
  deriveInitialDescription,
  deriveInitialDetails,
} from "./edit-role-wizard/derive-state";
import { EditRoleCandidateSummary } from "./edit-role-wizard/edit-role-candidate-summary";
import { EditRoleFooter } from "./edit-role-wizard/edit-role-footer";
import { EditRoleSidebar } from "./edit-role-wizard/edit-role-sidebar";
import {
  StepRoleDescription,
  type RoleDescriptionValues,
} from "./edit-role-wizard/step-role-description";
import {
  StepRoleDetails,
  type RoleDetailsValues,
} from "./edit-role-wizard/step-role-details";
import { StepPreview } from "./edit-role-wizard/step-preview";
import { StepTalentAssessment } from "./edit-role-wizard/step-talent-assessment";
import { usePatchAndSendOffer } from "./edit-role-wizard/use-patch-and-send-offer";

type EmployerEditRolePageProps = {
  userId: string;
  roleId: string;
};

export function EmployerEditRolePage({
  userId,
  roleId,
}: EmployerEditRolePageProps) {
  const { data: candidate, isPending: isCandidatePending } =
    useDiscoveryCandidateProfile(userId);
  const {
    data: role,
    isLoading: isRoleLoading,
    isError: isRoleError,
  } = useEmployerRole(roleId);

  const [currentStep, setCurrentStep] = useState(0);
  const [descriptionDraft, setDescriptionDraft] =
    useState<RoleDescriptionValues | null>(null);
  const [detailsDraft, setDetailsDraft] = useState<RoleDetailsValues | null>(
    null,
  );
  const [assessmentDraft, setAssessmentDraft] = useState<{
    value: string | undefined;
  } | null>(null);
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const [sendScoreUpdates, setSendScoreUpdates] = useState(false);

  const { submit, isSubmitting } = usePatchAndSendOffer({
    roleId,
    userId,
    onSettled: () => setIsSendOfferModalOpen(false),
  });

  const roleDescription: RoleDescriptionValues =
    descriptionDraft ??
    (role ? deriveInitialDescription(role) : { roleTitle: "", jdHtml: "" });
  const roleDetails: RoleDetailsValues =
    detailsDraft ??
    (role
      ? deriveInitialDetails(role)
      : {
          employmentType: "",
          experience: "",
          location: "",
          skills: [],
          acceptsRelocation: "no",
        });
  const selectedAssessmentId: string | undefined = assessmentDraft
    ? assessmentDraft.value
    : (role?.assessment_id ?? undefined);

  const salaryRangeLabel = useMemo(
    () => (role ? buildSalaryRangeLabel(role) : undefined),
    [role],
  );

  if (isRoleLoading) {
    return (
      <div className="mx-auto max-w-274 space-y-6 py-6 sm:py-8">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-112 w-full rounded-3xl" />
      </div>
    );
  }

  if (isRoleError || !role) {
    notFound();
  }

  // `notFound()` returns `never`, but TS won't carry that narrowing into the
  // function expressions below. Re-bind so the closures see the narrowed type.
  const loadedRole = role;

  const isLastStep = currentStep === EDIT_ROLE_STEPS.length - 1;
  const meta = EDIT_ROLE_STEP_META[currentStep];

  function handleNext() {
    if (isLastStep) {
      setIsSendOfferModalOpen(true);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, EDIT_ROLE_STEPS.length - 1));
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function handleSubmitOffer() {
    void submit(
      buildRolePatch({
        role: loadedRole,
        roleDescription,
        roleDetails,
        selectedAssessmentId,
      }),
    );
  }

  function handleViewAssessment() {
    if (!selectedAssessmentId) return;
    window.open(
      `/e/assessments/${encodeURIComponent(selectedAssessmentId)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="mx-auto max-w-274 space-y-6 py-6 sm:py-8">
      <EditRoleCandidateSummary
        fullName={candidate?.full_name}
        role={candidate?.role}
        seniorityBadge={candidate?.seniority_badge}
        avatarUrl={candidate?.avatar_url ?? null}
        isLoading={isCandidatePending}
        exitHref={`/e/talents/${userId}/offer/${roleId}`}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <EditRoleSidebar
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-[#dbdbdb] bg-white p-6">
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-semibold text-[#151515]">
              {meta.title}
            </p>
            <p className="text-base font-light tracking-[0.017em] text-[#151515]">
              {meta.description}
            </p>
          </div>

          {currentStep === 0 ? (
            <StepRoleDescription
              values={roleDescription}
              onChange={setDescriptionDraft}
            />
          ) : currentStep === 1 ? (
            <StepRoleDetails values={roleDetails} onChange={setDetailsDraft} />
          ) : currentStep === 2 ? (
            <StepTalentAssessment
              selectedAssessmentId={selectedAssessmentId}
              onSelect={(value) => setAssessmentDraft({ value })}
            />
          ) : (
            <StepPreview
              roleDescription={roleDescription}
              roleDetails={roleDetails}
              selectedAssessmentId={selectedAssessmentId}
              salaryRangeLabel={salaryRangeLabel}
              educationLabel={educationLabel(loadedRole.education) || undefined}
              onViewAssessment={handleViewAssessment}
            />
          )}

          <EditRoleFooter
            currentStep={currentStep}
            totalSteps={EDIT_ROLE_STEPS.length}
            onBack={handleBack}
            onNext={handleNext}
            isLastStep={isLastStep}
          />
        </div>
      </div>

      <ConfirmSendOfferDialog
        open={isSendOfferModalOpen}
        onOpenChange={setIsSendOfferModalOpen}
        candidateName={candidate?.full_name}
        scorePercentage={candidate?.score_percentage}
        sendScoreUpdates={sendScoreUpdates}
        onSendScoreUpdatesChange={setSendScoreUpdates}
        onSubmit={handleSubmitOffer}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
