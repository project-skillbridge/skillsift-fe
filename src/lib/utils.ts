import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "@/constants/talent-onboarding";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Talent onboarding: current step meta, index, and progress bar fill (0–100). */
export function getOnboardingStepProgress(currentStepId: OnboardingStepId) {
  const stepMeta = ONBOARDING_STEPS.find((s) => s.id === currentStepId);
  const stepIndex = Math.max(
    0,
    ONBOARDING_STEPS.findIndex((s) => s.id === currentStepId),
  );
  const progressPercent = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;
  return {
    stepMeta,
    stepIndex,
    progressPercent,
    totalSteps: ONBOARDING_STEPS.length,
  };
}

export function formatOptionLabel(option: string): string {
  // Already human-readable (no underscores): only ensure a leading capital
  if (!option.includes("_"))
    return option.charAt(0).toUpperCase() + option.slice(1);
  const formatted = option
    .replace(/(\d)_(\d)/g, "$1–$2") // 0_1 → 0–1
    .replace(/_plus/g, "+") // _plus → +
    .replace(/_to_/g, " to ") // _to_ → " to "
    .replace(/_/g, " "); // remaining underscores → spaces
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
