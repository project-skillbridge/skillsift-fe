"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyCertificates } from "@/actions/certificates";

import { certificateKeys } from "./keys";

export function useMyCertificates() {
  return useQuery({
    queryKey: certificateKeys.mine(),
    queryFn: () => getMyCertificates(),
    staleTime: 60_000,
  });
}
