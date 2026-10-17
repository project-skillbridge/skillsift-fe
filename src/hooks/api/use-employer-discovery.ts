"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  discoverCandidates,
  getDiscoveryCandidateProfile,
  getSavedCandidates,
  removeCandidate,
  saveCandidate,
  unlockCandidate,
} from "@/actions/employer-discovery";
import { toDiscoveryCandidatesParams } from "@/lib/employer-discovery-params";
import type {
  DiscoveryCandidatesParams,
  EmployerDiscoveryCandidatesListData,
  EmployerSavedCandidatesListParams,
} from "@/types/api/employer-discovery";
import type { TalentFilters } from "@/types/employer-talents";

import { employerBillingKeys, employerDiscoveryKeys } from "./keys";

export function useDiscoveryCandidates(
  filters: TalentFilters,
  opts: { page: number; limit: number; search?: string },
  options?: { enabled?: boolean },
) {
  const params = toDiscoveryCandidatesParams(filters, opts);

  return useQuery({
    queryKey: employerDiscoveryKeys.candidateList(params),
    queryFn: () => discoverCandidates(params),
    enabled: options?.enabled ?? true,
  });
}

export function useDiscoveryCandidateProfile(
  userId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: employerDiscoveryKeys.profile(userId),
    queryFn: () => getDiscoveryCandidateProfile(userId),
    enabled: (options?.enabled ?? true) && Boolean(userId),
  });
}

export function useSavedCandidates(
  params?: EmployerSavedCandidatesListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: employerDiscoveryKeys.savedList(params),
    queryFn: () => getSavedCandidates(params),
    enabled: options?.enabled ?? true,
  });
}

export function useSaveCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => saveCandidate(userId),
    onSettled: () => {
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.savedLists(),
      });
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.candidateLists(),
      });
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.profiles(),
      });
    },
  });
}

/** Spend an unlock on a candidate; refreshes everything that shows their details. */
export function useUnlockCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unlockCandidate(userId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: employerDiscoveryKeys.all });
      void qc.invalidateQueries({ queryKey: employerBillingKeys.all });
    },
  });
}

export function useRemoveCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeCandidate(userId),
    onMutate: async (userId: string) => {
      await qc.cancelQueries({
        queryKey: employerDiscoveryKeys.savedLists(),
      });

      const previousSnapshots =
        qc.getQueriesData<EmployerDiscoveryCandidatesListData>({
          queryKey: employerDiscoveryKeys.savedLists(),
        });

      qc.setQueriesData<EmployerDiscoveryCandidatesListData>(
        { queryKey: employerDiscoveryKeys.savedLists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            candidates: old.candidates.filter((c) => c.userId !== userId),
            total: Math.max(0, old.total - 1),
          };
        },
      );

      return { previousSnapshots };
    },
    onError: (_err, _userId, context) => {
      if (context?.previousSnapshots) {
        for (const [key, data] of context.previousSnapshots) {
          qc.setQueryData(key, data);
        }
      }
    },
    onSettled: (_data, _error, userId) => {
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.savedLists(),
      });
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.candidateLists(),
      });
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.profiles(),
      });
      if (userId) {
        void qc.invalidateQueries({
          queryKey: employerDiscoveryKeys.profile(userId),
        });
      }
    },
  });
}

export type { DiscoveryCandidatesParams };
