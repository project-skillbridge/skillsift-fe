"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addInterviewLink,
  getEmployerOffers,
  markOfferHireComplete,
  markOfferHired,
  sendOffer,
  withdrawOffer,
  type EmployerOffersListParams,
} from "@/actions/employer-offers";
import type { SendOfferInput } from "@/types/api/employer-offers";

import {
  employerDiscoveryKeys,
  employerOffersKeys,
  employerRolesKeys,
} from "./keys";

export function useEmployerOffers(
  params?: EmployerOffersListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: employerOffersKeys.list(params),
    queryFn: () => getEmployerOffers(params),
    enabled: options?.enabled ?? true,
  });
}

/** Send an offer to one or more candidates for a role. */
export function useSendOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SendOfferInput) => sendOffer(input),
    onSuccess: (_, input) => {
      void qc.invalidateQueries({ queryKey: employerOffersKeys.lists() });
      void qc.invalidateQueries({ queryKey: employerRolesKeys.lists() });
      void qc.invalidateQueries({
        queryKey: employerRolesKeys.detail(input.roleId),
      });
      void qc.invalidateQueries({
        queryKey: employerDiscoveryKeys.savedLists(),
      });
      void qc.invalidateQueries({ queryKey: employerDiscoveryKeys.profiles() });
    },
  });
}

function invalidateOffersList(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: employerOffersKeys.lists() });
  // The talent profile shows where this offer stands.
  void qc.invalidateQueries({ queryKey: employerDiscoveryKeys.profiles() });
}

/** Mark an accepted offer as hire-complete (the candidate has been hired). */
export function useMarkOfferHireComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => markOfferHireComplete(offerId),
    onSuccess: () => invalidateOffersList(qc),
  });
}

/** Alias endpoint for `useMarkOfferHireComplete`. */
export function useMarkOfferHired() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => markOfferHired(offerId),
    onSuccess: () => invalidateOffersList(qc),
  });
}

/** Withdraw a pending offer. */
export function useWithdrawOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => withdrawOffer(offerId),
    onSuccess: () => invalidateOffersList(qc),
  });
}

export function useAddInterviewLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, link }: { offerId: string; link: string }) =>
      addInterviewLink(offerId, link),
    onSuccess: (_, { offerId }) => {
      void qc.invalidateQueries({ queryKey: employerOffersKeys.lists() });
      void qc.invalidateQueries({
        queryKey: employerOffersKeys.detail(offerId),
      });
    },
  });
}
