"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployerAssessment,
  deactivateEmployerAssessment,
  draftAssessmentQuestions,
  getEmployerAssessment,
  getEmployerAssessmentDetail,
  getEmployerAssessmentResultDetail,
  getLibraryAssessment,
  getLibraryAssessments,
  getEmployerAssessmentResults,
  getEmployerAssessments,
  importAssessmentQuestions,
  inviteToAssessment,
  searchAssessmentTalent,
} from "@/actions/employer-assessments";
import type {
  AssessmentResultsParams,
  CreateEmployerAssessmentInput,
  DraftAssessmentQuestionsInput,
  InviteToAssessmentInput,
} from "@/types/api/employer-assessments";
import { employerAssessmentsKeys } from "./keys";

export function useEmployerAssessments(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: employerAssessmentsKeys.list(params),
    queryFn: () => getEmployerAssessments(params),
  });
}

export function useEmployerAssessment(assessmentId: string) {
  return useQuery({
    queryKey: employerAssessmentsKeys.detail(assessmentId),
    queryFn: () => getEmployerAssessment(assessmentId),
    enabled: !!assessmentId,
  });
}

export function useEmployerAssessmentDetail(assessmentId: string) {
  return useQuery({
    queryKey: [...employerAssessmentsKeys.detail(assessmentId), "full"],
    queryFn: () => getEmployerAssessmentDetail(assessmentId),
    enabled: !!assessmentId,
  });
}

export function useEmployerAssessmentResults(
  assessmentId: string,
  params?: AssessmentResultsParams,
) {
  return useQuery({
    queryKey: [...employerAssessmentsKeys.results(assessmentId), params ?? {}],
    queryFn: () => getEmployerAssessmentResults(assessmentId, params),
    enabled: !!assessmentId,
  });
}

export function useEmployerAssessmentResultDetail(
  assessmentId: string,
  submissionId: string | null,
) {
  return useQuery({
    queryKey: [
      ...employerAssessmentsKeys.results(assessmentId),
      "detail",
      submissionId,
    ],
    queryFn: () =>
      getEmployerAssessmentResultDetail(assessmentId, submissionId as string),
    enabled: !!assessmentId && !!submissionId,
  });
}

export function useCreateEmployerAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEmployerAssessmentInput) =>
      createEmployerAssessment(input),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: employerAssessmentsKeys.lists() });
      void qc.invalidateQueries({ queryKey: ["employer-metrics"] });
    },
  });
}

export function useDeactivateEmployerAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: string) =>
      deactivateEmployerAssessment(assessmentId),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: employerAssessmentsKeys.lists(),
        exact: false,
      });
    },
  });
}

export function useInviteToAssessment() {
  return useMutation({
    mutationFn: (input: InviteToAssessmentInput) => inviteToAssessment(input),
  });
}

export function useLibraryAssessments(params: {
  roleTrack?: string;
  experienceLevel?: string;
}) {
  return useQuery({
    queryKey: employerAssessmentsKeys.library(params),
    queryFn: () => getLibraryAssessments(params),
    enabled: !!params.roleTrack,
  });
}

export function useLibraryAssessment(id: string | null) {
  return useQuery({
    queryKey: employerAssessmentsKeys.libraryEntry(id ?? ""),
    queryFn: () => getLibraryAssessment(id as string),
    enabled: !!id,
  });
}

export function useDraftAssessmentQuestions() {
  return useMutation({
    mutationFn: (input: DraftAssessmentQuestionsInput) =>
      draftAssessmentQuestions(input),
  });
}

export function useImportAssessmentQuestions() {
  return useMutation({
    mutationFn: (file: File) => importAssessmentQuestions(file),
  });
}

export function useSearchAssessmentTalent(q: string, track?: string) {
  return useQuery({
    queryKey: [...employerAssessmentsKeys.all, "talent-search", q, track ?? ""],
    queryFn: () => searchAssessmentTalent(q, track),
    staleTime: 30_000,
  });
}
