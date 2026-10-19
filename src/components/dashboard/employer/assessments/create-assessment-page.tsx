"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { QuestionnaireMobileActions } from "@/components/assessments/questionnaire-mobile-actions";
import {
  CREATE_ASSESSMENT_STEP_META,
  CREATE_ASSESSMENT_STEPS,
  DEFAULT_SELECTED_QUESTION_IDS,
  DEFAULT_WELCOME_MESSAGE_HTML,
  type AssessmentGuidelineId,
  type AssessmentQuestionOptionId,
  type CreateAssessmentStepId,
} from "@/constants/create-assessment-wizard";
import { DEFAULT_ASSESSMENT_PASS_RATE } from "@/constants/employer-assessments";
import { useCreateEmployerAssessment } from "@/hooks/api/use-employer-assessments";
import { buildAssessmentHeaderSubtitle } from "@/lib/create-assessment-utils";
import { CreateAssessmentDetailsStep } from "./create-assessment-details-step";
import { CreateAssessmentQuestionsStep } from "./create-assessment-questions-step";
import { CreateAssessmentPreviewStep } from "./create-assessment-preview-step";
import { CreateAssessmentHeader } from "./create-assessment-header";
import { CreateAssessmentMobileProgress } from "./create-assessment-mobile-progress";
import { CreateAssessmentSidebar } from "./create-assessment-sidebar";
import { CreateAssessmentStepCard } from "./create-assessment-step-card";
import { AssessmentShareLinkModal } from "./assessment-share-link-modal";

type AssessmentWizardState = {
  welcomeMessageHtml: string;
  guidelines: Record<AssessmentGuidelineId, boolean>;
  selectedQuestionIds: AssessmentQuestionOptionId[];
};

const INITIAL_GUIDELINES: Record<AssessmentGuidelineId, boolean> = {
  attempts: true,
  timeout: true,
  captcha: true,
};

const INITIAL_STATE: AssessmentWizardState = {
  welcomeMessageHtml: DEFAULT_WELCOME_MESSAGE_HTML,
  guidelines: INITIAL_GUIDELINES,
  selectedQuestionIds: DEFAULT_SELECTED_QUESTION_IDS,
};

export function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createAssessmentMutation = useCreateEmployerAssessment();
  const createAssessment = createAssessmentMutation.mutate;
  const isPending = createAssessmentMutation.isPending;

  const title = searchParams.get("title") ?? "New assessment";
  const category = searchParams.get("category") ?? "";
  const deadlineParam = searchParams.get("deadline");
  const passRateParam = searchParams.get("passRate");
  const passRate = passRateParam
    ? Number.parseInt(passRateParam, 10)
    : DEFAULT_ASSESSMENT_PASS_RATE;
  const typeParam = searchParams.get("type");
  const type = typeParam === "external" ? "external" : "internal";

  const [currentStepId, setCurrentStepId] =
    useState<CreateAssessmentStepId>("details");
  const [wizardState, setWizardState] =
    useState<AssessmentWizardState>(INITIAL_STATE);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mockShareLink, setMockShareLink] = useState("");

  const selectedQuestionIds =
    wizardState.selectedQuestionIds ?? DEFAULT_SELECTED_QUESTION_IDS;
  const currentStepIndex = CREATE_ASSESSMENT_STEPS.findIndex(
    (step) => step.id === currentStepId,
  );
  const isLastStep = currentStepIndex === CREATE_ASSESSMENT_STEPS.length - 1;
  const meta = CREATE_ASSESSMENT_STEP_META[currentStepId];
  const nextDisabled =
    currentStepId === "questions" && selectedQuestionIds.length === 0;

  const resolvedPassRate = useMemo(
    () =>
      Number.isFinite(passRate) && passRate >= 50 && passRate <= 90
        ? Math.floor(passRate)
        : 70,
    [passRate],
  );

  const headerSubtitle = useMemo(() => {
    const deadline = deadlineParam ? new Date(deadlineParam) : undefined;
    return buildAssessmentHeaderSubtitle(category, deadline);
  }, [category, deadlineParam]);

  const previewDeadline = useMemo(
    () => (deadlineParam ? new Date(deadlineParam) : undefined),
    [deadlineParam],
  );

  const handleGuidelineChange = (
    guidelineId: AssessmentGuidelineId,
    checked: boolean,
  ) => {
    setWizardState((state) => ({
      ...state,
      guidelines: { ...state.guidelines, [guidelineId]: checked },
    }));
  };

  const handlePublish = () => {
    if (isPending) return;

    createAssessment(
      {
        title,
        roleTrack: category.slice(0, 100) || "General Track",
        experienceLevel: "mid",
        timeLimitMinutes: 30,
        passingThreshold: resolvedPassRate,
        questionSource: "manual",
        shareViaLink: type === "external",
        sendToCandidates: type === "internal",
        type,
      },
      {
        onSuccess: (data) => {
          toast.success("Assessment published successfully.");
          if (type === "external") {
            const domain =
              typeof window !== "undefined"
                ? window.location.origin
                : "https://skillsift.online";
            setMockShareLink(
              `${domain}/assessment/${data.token || "mock-external-link"}`,
            );
            setShareModalOpen(true);
          } else {
            router.push("/e/assessments");
          }
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to publish assessment";
          toast.error(message);
        },
      },
    );
  };

  const handleNext = () => {
    if (isLastStep) {
      handlePublish();
      return;
    }
    setCurrentStepId(CREATE_ASSESSMENT_STEPS[currentStepIndex + 1].id);
  };

  const handleBack = () => {
    if (currentStepIndex === 0) return;
    setCurrentStepId(CREATE_ASSESSMENT_STEPS[currentStepIndex - 1].id);
  };

  const stepContent = (() => {
    if (currentStepId === "details") {
      return (
        <CreateAssessmentDetailsStep
          welcomeMessageHtml={wizardState.welcomeMessageHtml}
          onWelcomeMessageChange={(html) =>
            setWizardState((s) => ({ ...s, welcomeMessageHtml: html }))
          }
          guidelines={wizardState.guidelines}
          onGuidelineChange={handleGuidelineChange}
        />
      );
    }
    if (currentStepId === "questions") {
      return (
        <CreateAssessmentQuestionsStep
          selectedQuestionIds={selectedQuestionIds}
          onSelectionChange={(ids) =>
            setWizardState((s) => ({ ...s, selectedQuestionIds: ids }))
          }
        />
      );
    }
    return (
      <CreateAssessmentPreviewStep
        welcomeMessageHtml={wizardState.welcomeMessageHtml}
        category={category}
        passRate={resolvedPassRate}
        deadline={previewDeadline}
        selectedQuestionIds={selectedQuestionIds}
      />
    );
  })();

  return (
    <div className="pb-32 lg:pb-10">
      <CreateAssessmentHeader title={title} subtitle={headerSubtitle} />
      <CreateAssessmentMobileProgress currentStepIndex={currentStepIndex} />
      <div className="mx-auto flex max-w-300 flex-col gap-6 pb-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="hidden lg:block">
          <CreateAssessmentSidebar currentStepIndex={currentStepIndex} />
        </div>
        <CreateAssessmentStepCard
          title={meta.title}
          description={meta.description}
          currentStepIndex={currentStepIndex}
          isLastStep={isLastStep}
          assessmentType={type}
          showBack={currentStepIndex > 0}
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={nextDisabled || isPending}
          nextLoading={isPending}
        >
          {stepContent}
        </CreateAssessmentStepCard>
      </div>

      <QuestionnaireMobileActions
        questionNumber={currentStepIndex + 1}
        totalQuestions={CREATE_ASSESSMENT_STEPS.length}
        onBack={currentStepIndex > 0 ? handleBack : undefined}
        onNext={handleNext}
        isLast={isLastStep}
        showBack={currentStepIndex > 0}
        nextDisabled={nextDisabled || isPending}
        nextLoading={isPending}
        lastStepLabel={
          isPending
            ? "Publishing..."
            : type === "external"
              ? "Generate Link"
              : "Send Assessment"
        }
        className="lg:hidden"
      />

      <AssessmentShareLinkModal
        open={shareModalOpen}
        onOpenChange={(open) => {
          setShareModalOpen(open);
          if (!open) {
            router.push("/e/assessments");
          }
        }}
        link={mockShareLink}
      />
    </div>
  );
}
