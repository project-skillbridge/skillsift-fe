"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPublicAssessment,
  registerExternalApplicant,
  startTalentAssessment,
  submitExternalAssessment,
  submitTalentAssessment,
} from "@/actions/external-assessment";

export function usePublicAssessment(token: string) {
  return useQuery({
    queryKey: ["publicAssessment", token],
    queryFn: () => getPublicAssessment(token),
    enabled: !!token,
    retry: false,
  });
}

export function useRegisterExternalApplicant() {
  return useMutation({ mutationFn: registerExternalApplicant });
}

export function useSubmitExternalAssessment() {
  return useMutation({ mutationFn: submitExternalAssessment });
}

export function useStartTalentAssessment() {
  return useMutation({ mutationFn: startTalentAssessment });
}

export function useSubmitTalentAssessment() {
  return useMutation({ mutationFn: submitTalentAssessment });
}
