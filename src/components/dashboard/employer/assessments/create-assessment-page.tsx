"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuestionnaireMobileActions } from "@/components/assessments/questionnaire-mobile-actions";
import {
  CREATE_ASSESSMENT_STEP_META,
  getCreateAssessmentSteps,
} from "@/constants/create-assessment-wizard";
import {
  ASSESSMENT_LEVEL_OPTIONS,
  DEFAULT_ASSESSMENT_PASS_RATE,
  MAX_ASSESSMENT_PASS_RATE,
  MIN_ASSESSMENT_PASS_RATE,
} from "@/constants/employer-assessments";
import { levelLabel, trackLabel } from "@/constants/employer-roles";
import {
  useCreateEmployerAssessment,
  useLibraryAssessments,
} from "@/hooks/api/use-employer-assessments";
import {
  areCompanyQuestionsValid,
  createDraftQuestion,
  defaultQuestionCount,
  toApiQuestions,
  type DraftQuestion,
} from "@/lib/employer-assessment-questions";
import { appToast } from "@/lib/toast";
import type { AssessmentTalentOption } from "@/types/api/employer-assessments";

import { AssessmentShareLinkModal } from "./assessment-share-link-modal";
import { CreateAssessmentHeader } from "./create-assessment-header";
import { CreateAssessmentMobileProgress } from "./create-assessment-mobile-progress";
import { CreateAssessmentPreviewStep } from "./create-assessment-preview-step";
import {
  CreateAssessmentSourceStep,
  type QuestionSource,
} from "./create-assessment-source-step";
import { CreateAssessmentRecipientsStep } from "./create-assessment-recipients-step";
import { CreateAssessmentSidebar } from "./create-assessment-sidebar";
import { CreateAssessmentStepCard } from "./create-assessment-step-card";

type TimeLimit = 20 | 30 | 40 | 60;
const TIME_LIMITS: readonly number[] = [20, 30, 40, 60];

function parseLevel(value: string | null): "junior" | "mid" | "senior" {
  return ASSESSMENT_LEVEL_OPTIONS.some((o) => o.value === value)
    ? (value as "junior" | "mid" | "senior")
    : "mid";
}

export function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get("title") ?? "";
  const roleTrack = searchParams.get("roleTrack") ?? "";
  const level = parseLevel(searchParams.get("level"));
  const timeLimitParam = Number(searchParams.get("timeLimit"));
  const timeLimitMinutes = (
    TIME_LIMITS.includes(timeLimitParam) ? timeLimitParam : 30
  ) as TimeLimit;
  const passRateParam = Number.parseInt(searchParams.get("passRate") ?? "", 10);
  const passRate =
    Number.isFinite(passRateParam) &&
    passRateParam >= MIN_ASSESSMENT_PASS_RATE &&
    passRateParam <= MAX_ASSESSMENT_PASS_RATE
      ? passRateParam
      : DEFAULT_ASSESSMENT_PASS_RATE;
  const type =
    searchParams.get("type") === "external" ? "external" : "internal";

  useEffect(() => {
    // Direct visits (no dialog) have nothing to publish.
    if (!title || !roleTrack) router.replace("/e/assessments");
  }, [title, roleTrack, router]);

  const steps = useMemo(() => getCreateAssessmentSteps(type), [type]);
  const [stepIndex, setStepIndex] = useState(0);
  const [questions, setQuestions] = useState<DraftQuestion[]>(() => [
    createDraftQuestion(),
  ]);
  const [sourceChoice, setSourceChoice] = useState<QuestionSource | null>(null);
  const [libraryId, setLibraryId] = useState<string | null>(null);
  const [libraryCount, setLibraryCount] = useState<number | null>(null);
  const [recipients, setRecipients] = useState<AssessmentTalentOption[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [createdId, setCreatedId] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { mutate: createAssessment, isPending } = useCreateEmployerAssessment();
  const { data: libraryItems, isLoading: libraryLoading } =
    useLibraryAssessments({ roleTrack, experienceLevel: level });

  // Default to our ready-made assessments when there are some for this role.
  const source: QuestionSource =
    sourceChoice ?? (libraryItems?.length ? "library" : "own");
  const selectedLibrary = libraryItems?.find((i) => i.id === libraryId);
  const useLibrary = source === "library";
  const libraryQuestionCount = selectedLibrary
    ? Math.min(
        libraryCount ?? defaultQuestionCount(selectedLibrary.questionCount),
        selectedLibrary.questionCount,
      )
    : 0;

  const [welcomeMessage, setWelcomeMessage] = useState("");

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const meta = CREATE_ASSESSMENT_STEP_META[currentStep.id];

  const nextDisabled =
    isPending ||
    (currentStep.id === "questions" &&
      (useLibrary
        ? !selectedLibrary
        : !areCompanyQuestionsValid(questions) ||
          questions.some((q) => q.aiDrafted))) ||
    (currentStep.id === "recipients" && recipients.length === 0);

  const handlePublish = () => {
    if (isPending) return;
    createAssessment(
      {
        title,
        roleTrack,
        experienceLevel: level,
        timeLimitMinutes,
        passingThreshold: passRate,
        welcomeMessage: welcomeMessage.trim() || undefined,
        ...(useLibrary && selectedLibrary
          ? {
              questionSource: "credlane_bank" as const,
              credlaneAssessmentId: selectedLibrary.id,
              questionCount: libraryQuestionCount,
            }
          : {
              questionSource: "company_questions" as const,
              questions: toApiQuestions(questions),
            }),
        shareViaLink: type === "external",
        sendToCandidates: type === "internal",
        type,
        candidateUserIds:
          type === "internal" ? recipients.map((r) => r.userId) : undefined,
      },
      {
        onSuccess: (data) => {
          if (type === "external") {
            setCreatedId(data.id);
            setShareLink(`${window.location.origin}/assessment/${data.token}`);
            setShareModalOpen(true);
            return;
          }
          appToast.success(
            `Assessment sent to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}.`,
          );
          router.push("/e/assessments");
        },
        onError: (err: unknown) =>
          appToast.error(
            err instanceof Error ? err.message : "Failed to publish assessment",
          ),
      },
    );
  };

  const handleNext = () => {
    if (isLastStep) {
      handlePublish();
      return;
    }
    setStepIndex((i) => i + 1);
  };
  const handleBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const stepContent = (() => {
    if (currentStep.id === "questions") {
      return (
        <CreateAssessmentSourceStep
          source={source}
          onSourceChange={setSourceChoice}
          level={level}
          libraryItems={libraryItems}
          libraryLoading={libraryLoading}
          libraryId={selectedLibrary?.id ?? null}
          onLibraryChange={(id) => {
            setLibraryId(id);
            setLibraryCount(null);
          }}
          libraryQuestionCount={libraryQuestionCount}
          onLibraryQuestionCountChange={setLibraryCount}
          questions={questions}
          onQuestionsChange={setQuestions}
        />
      );
    }
    if (currentStep.id === "recipients") {
      return (
        <CreateAssessmentRecipientsStep
          roleTrack={roleTrack}
          selected={recipients}
          onSelectedChange={setRecipients}
        />
      );
    }
    return (
      <CreateAssessmentPreviewStep
        roleTrack={roleTrack}
        level={level}
        timeLimitMinutes={timeLimitMinutes}
        passRate={passRate}
        questionCount={useLibrary ? libraryQuestionCount : questions.length}
        recipientCount={type === "internal" ? recipients.length : null}
        type={type}
        welcomeMessage={welcomeMessage}
        onWelcomeMessageChange={setWelcomeMessage}
      />
    );
  })();

  const publishLabel = isPending
    ? "Publishing..."
    : type === "external"
      ? "Create link"
      : "Publish and invite";

  if (!title || !roleTrack) return null;

  return (
    <div className="pb-32 lg:pb-10">
      <CreateAssessmentHeader
        title={title}
        subtitle={[trackLabel(roleTrack), levelLabel(level)]
          .filter(Boolean)
          .join(" • ")}
      />
      <CreateAssessmentMobileProgress
        steps={steps}
        currentStepIndex={stepIndex}
      />
      <div className="mx-auto flex max-w-300 flex-col gap-6 pb-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="hidden lg:block">
          <CreateAssessmentSidebar steps={steps} currentStepIndex={stepIndex} />
        </div>
        <CreateAssessmentStepCard
          title={meta.title}
          description={meta.description}
          currentStepIndex={stepIndex}
          totalSteps={steps.length}
          isLastStep={isLastStep}
          assessmentType={type}
          showBack={stepIndex > 0}
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={nextDisabled}
          nextLoading={isPending}
        >
          {stepContent}
        </CreateAssessmentStepCard>
      </div>

      <QuestionnaireMobileActions
        questionNumber={stepIndex + 1}
        totalQuestions={steps.length}
        onBack={stepIndex > 0 ? handleBack : undefined}
        onNext={handleNext}
        isLast={isLastStep}
        showBack={stepIndex > 0}
        nextDisabled={nextDisabled}
        nextLoading={isPending}
        lastStepLabel={publishLabel}
        className="lg:hidden"
      />

      <AssessmentShareLinkModal
        open={shareModalOpen}
        onOpenChange={(open) => {
          setShareModalOpen(open);
          if (!open) router.push("/e/assessments");
        }}
        link={shareLink}
        assessmentId={createdId}
      />
    </div>
  );
}
