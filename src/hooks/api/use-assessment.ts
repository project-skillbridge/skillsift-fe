"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  flagAssessmentEvent,
  getAssessmentSession,
  getPersonalAssessmentSession,
  getSkillAssessmentAvailability,
  resolveAdvancedAssessmentSession,
  startAdvancedAssessment,
  startPersonalAssessment,
  startSkillAssessment,
  submitAdvancedAssessment,
  submitPersonalAssessment,
  submitSkillAssessment,
} from "@/actions/assessment";
import type {
  AdvancedAssessmentSubmitInput,
  AssessmentFlagInput,
  PersonalAssessmentSubmitInput,
  SkillAssessmentSubmitInput,
} from "@/types/api";

import { assessmentKeys, dashboardKeys } from "./keys";

export function useStartPersonalAssessment() {
  return useMutation({
    mutationFn: () => startPersonalAssessment(),
  });
}

export function usePersonalAssessmentSession(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: assessmentKeys.personalSession(),
    queryFn: () => getPersonalAssessmentSession(),
    enabled: options?.enabled ?? false,
  });
}

export function useSubmitPersonalAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PersonalAssessmentSubmitInput) =>
      submitPersonalAssessment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.home() });
    },
  });
}

// ─── Skill Assessment ─────────────────────────────────────────────────────────

/** Whether a skill assessment can start now, so the UI can say "available soon". */
export function useSkillAvailability(enabled = true) {
  return useQuery({
    queryKey: assessmentKeys.skillAvailability(),
    queryFn: () => getSkillAssessmentAvailability(),
    enabled,
    staleTime: 60_000,
  });
}

export function useStartSkillAssessment() {
  return useMutation({
    mutationFn: () => startSkillAssessment(),
  });
}

export function useSubmitSkillAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SkillAssessmentSubmitInput) =>
      submitSkillAssessment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.home() });
    },
  });
}

// ─── Advanced Assessment ──────────────────────────────────────────────────────

export function useStartAdvancedAssessment() {
  return useMutation({
    mutationFn: () => startAdvancedAssessment(),
  });
}

/**
 * Start a new advanced session, or transparently resume the existing one when
 * the server returns 409. Same response shape either way.
 */
export function useResolveAdvancedAssessmentSession() {
  return useMutation({
    mutationFn: () => resolveAdvancedAssessmentSession(),
  });
}

/** Pass `enabled: true` only when you have a valid session id. */
export function useAssessmentSession(
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: assessmentKeys.session(id),
    queryFn: () => getAssessmentSession(id),
    enabled: options?.enabled ?? false,
  });
}

export function useSubmitAdvancedAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdvancedAssessmentSubmitInput) =>
      submitAdvancedAssessment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.home() });
    },
  });
}

export function useFlagAssessmentEvent(
  type: "advanced" | "skill",
  sessionId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AssessmentFlagInput) =>
      flagAssessmentEvent(type, sessionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.home() });
    },
  });
}
