"use client";

import * as React from "react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import CompleteProfileStep from "@/components/onboarding/steps/complete-profile-step";
import { GenerateRoadmapStep } from "@/components/onboarding/steps/generating-step";
import { SetGoalStep } from "@/components/onboarding/steps/set-goal-step";
import { SelectTrackStep } from "@/components/onboarding/steps/select-track-step";
import {
  goalIdToApiGoal,
  ONBOARDING_STEPS,
  trackIdsToApiRoleTracks,
  type OnboardingStepId,
} from "@/constants/talent-onboarding";
import {
  useSaveTalentOnboardingGoal,
  useSaveTalentOnboardingTrack,
  useUpdateTalentOnboardingGoal,
  useSaveTalentOnboardingProfile,
} from "@/hooks/api/use-talent-onboarding";

import { useUploadAvatar } from "@/hooks/api/use-avatar";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import { useTalentOnboardingStore } from "@/stores/talent-onboarding-store";
import { getMe } from "@/actions/auth";
import { signInWithVerifiedUser } from "@/lib/auth-client";

function stepIndex(id: OnboardingStepId): number {
  return ONBOARDING_STEPS.findIndex((s) => s.id === id);
}

function OnboardingPageClient() {
  const {
    userId,
    fullName: userName,
    isLoading: isSessionLoading,
  } = useSessionUserProfile();

  const {
    ownerUserId,
    currentStepId,
    selectedGoalId,
    selectedTrackIds,
    goalSaved,
    tracksSaved,
    profileRegion,
    profileEducation,
    profileLinkedin,
    profileSaved,
    setCurrentStepId,
    setSelectedGoalId,
    setSelectedTrackIds,
    setGoalSaved,
    setTracksSaved,
    setProfileRegion,
    setProfileEducation,
    setProfileLinkedin,
    setProfileSaved,
    resetForUser,
  } = useTalentOnboardingStore();

  const [profileStepReady, setProfileStepReady] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!userId || ownerUserId === userId) return;
    resetForUser(userId);
  }, [ownerUserId, resetForUser, userId]);

  const { mutateAsync: saveGoal, isPending: isSavingGoal } =
    useSaveTalentOnboardingGoal();
  const { mutateAsync: updateGoal, isPending: isUpdatingGoal } =
    useUpdateTalentOnboardingGoal();
  const { mutateAsync: saveTrack, isPending: isSavingTrack } =
    useSaveTalentOnboardingTrack();
  const { mutateAsync: saveProfile, isPending: isSavingProfile } =
    useSaveTalentOnboardingProfile();
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();

  const isSaving =
    isSavingGoal ||
    isUpdatingGoal ||
    isSavingTrack ||
    isSavingProfile ||
    isUploadingAvatar;

  const canGoNext =
    currentStepId === "set-goal"
      ? Boolean(selectedGoalId)
      : currentStepId === "select-track"
        ? selectedTrackIds.length > 0
        : currentStepId === "complete-profile"
          ? profileStepReady
          : false;

  const i = stepIndex(currentStepId);
  const isFirst = i <= 0;
  const isLast = i >= ONBOARDING_STEPS.length - 1;

  const advanceStep = () => {
    setProfileStepReady(false);
    setCurrentStepId(ONBOARDING_STEPS[i + 1].id as OnboardingStepId);
  };

  const onProfileValueChange = React.useCallback(
    ({
      region,
      education,
      linkedin,
    }: {
      region: string;
      education: string;
      linkedin: string;
    }) => {
      setProfileRegion(region);
      setProfileEducation(education);
      setProfileLinkedin(linkedin);
    },
    [setProfileRegion, setProfileEducation, setProfileLinkedin],
  );

  if (userId && ownerUserId !== userId) {
    return null;
  }

  const goNext = async () => {
    if (isLast || !canGoNext || isSaving) return;

    try {
      if (currentStepId === "set-goal" && selectedGoalId) {
        const body = { goal: goalIdToApiGoal(selectedGoalId) };
        if (goalSaved) {
          await updateGoal(body);
        } else {
          await saveGoal(body);
          setGoalSaved(true);
        }
        advanceStep();
        return;
      }

      if (currentStepId === "select-track" && selectedTrackIds.length > 0) {
        const apiTracks = trackIdsToApiRoleTracks(selectedTrackIds);
        await saveTrack({ track: apiTracks[0] });
        if (!tracksSaved) setTracksSaved(true);
        advanceStep();
        return;
      }

      if (currentStepId === "complete-profile" && profileStepReady) {
        const avatarResult = profileImage
          ? ((await uploadAvatar(profileImage)) as { avatarUrl: string })
          : null;
        await saveProfile({
          region: profileRegion,
          educationLevel: profileEducation,
          ...(profileLinkedin ? { linkedinUrl: profileLinkedin } : {}),
          ...(avatarResult ? { avatarUrl: avatarResult.avatarUrl } : {}),
        });
        if (!profileSaved) setProfileSaved(true);
        const updatedUser = await getMe();
        await signInWithVerifiedUser(updatedUser);
        advanceStep();
        return;
      }

      advanceStep();
    } catch (error) {
      appToast.error(authFailureMessage(error));
    }
  };

  const goBack = () => {
    if (isFirst || isSaving) return;
    setCurrentStepId(ONBOARDING_STEPS[i - 1].id as OnboardingStepId);
  };

  let title: React.ReactNode | undefined;
  let description: React.ReactNode | undefined;
  let content: React.ReactNode;

  switch (currentStepId) {
    case "set-goal":
      title =
        !isSessionLoading && userName ? `Hello, ${userName}! 👋` : "Hello! 👋";
      description =
        "Help us personalize your experience using our app. Get started by telling us your goal.";
      content = (
        <SetGoalStep
          value={selectedGoalId ?? undefined}
          onValueChange={setSelectedGoalId}
        />
      );
      break;
    case "select-track":
      description =
        "Choose the path that best matches how you want to use SkillSift.";
      content = (
        <SelectTrackStep
          value={selectedTrackIds}
          onValueChange={setSelectedTrackIds}
        />
      );
      break;
    case "complete-profile":
      title = "Great choice! Tell us about yourself";
      description =
        "Please provide your details below to help us verify your identity and customize your learning journey.";
      content = (
        <CompleteProfileStep
          onReadyChange={setProfileStepReady}
          onValueChange={onProfileValueChange}
          onImageChange={setProfileImage}
        />
      );
      break;
    case "generate-roadmap":
      content = <GenerateRoadmapStep />;
      break;
    default:
      title = undefined;
      description = undefined;
      content = null;
  }

  return (
    <OnboardingShell
      currentStepId={currentStepId}
      title={title}
      description={description}
      onNext={goNext}
      onBack={goBack}
      showBack={!isFirst}
      showNext={!isLast}
      nextDisabled={!canGoNext}
      nextLoading={isSaving}
    >
      {content}
    </OnboardingShell>
  );
}

export { OnboardingPageClient };
