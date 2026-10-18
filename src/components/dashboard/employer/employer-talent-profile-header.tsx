"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";

import { useSaveCandidate } from "@/hooks/api/use-employer-discovery";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { SendOfferTrigger } from "./talents/send-offer-trigger";

type EmployerTalentProfileHeaderProps = {
  userId: string;
  isSaved: boolean;
  offerSent: boolean;
};

export function EmployerTalentProfileHeader({
  userId,
  isSaved,
  offerSent,
}: EmployerTalentProfileHeaderProps) {
  const router = useRouter();
  const { mutate: saveCandidate, isPending: isSaving } = useSaveCandidate();

  function handleAddToShortlist() {
    if (isSaved || isSaving) return;

    saveCandidate(userId, {
      onSuccess: () => {
        appToast.success("Added to shortlist.");
      },
      onError: (error) => {
        appToast.error(authFailureMessage(error));
      },
    });
  }

  if (offerSent) {
    return (
      <div className="flex w-full flex-row items-center justify-between border-b border-[#EBEBEB] pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-x-2 font-semibold text-[#05060f] underline transition-colors hover:text-[#151515]"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex flex-row gap-x-4">
          <Link
            href="/e/shortlist"
            className="flex h-10 items-center justify-center rounded-lg bg-[#05060F] px-4 text-base font-semibold leading-5 tracking-[0.016em] text-white transition-colors hover:bg-[#151515]/90"
          >
            View in Shortlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row items-center justify-between border-b border-[#EBEBEB] pb-4">
      <Link
        href="/e/talents"
        className="flex items-center gap-x-2 font-medium text-[#757575] transition-colors hover:text-[#151515]"
      >
        <ChevronLeft size={20} />
        Back to Talents
      </Link>

      <div className="flex flex-row gap-x-3">
        <button
          type="button"
          onClick={handleAddToShortlist}
          disabled={isSaved || isSaving}
          className={cn(
            "flex h-10 w-40 items-center justify-center rounded-lg border border-[#05060F] text-base font-semibold leading-5 tracking-[0.016em] text-[#151515] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isSaved ? "Shortlisted" : "Add to Shortlist"}
        </button>
        <SendOfferTrigger userId={userId} />
      </div>
    </div>
  );
}
