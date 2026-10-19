"use client";

import { useRouter } from "next/navigation";

import { useSendOffer, useUpdateRole } from "@/hooks/api";
import { authFailureMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import type { UpdateRoleInput } from "@/types/api/employer-roles";

type UsePatchAndSendOfferArgs = {
  roleId: string;
  userId: string;
  /** Called after the chain finishes to close the confirm modal. */
  onSettled?: () => void;
};

export function usePatchAndSendOffer({
  roleId,
  userId,
  onSettled,
}: UsePatchAndSendOfferArgs) {
  const router = useRouter();
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole();
  const { mutateAsync: sendOffer, isPending: isSending } = useSendOffer();

  const isSubmitting = isUpdating || isSending;

  async function submit(patch: UpdateRoleInput | null) {
    try {
      if (patch) {
        await updateRole({ roleId, patch });
      }
      const result = await sendOffer({ candidateIds: [userId], roleId });
      onSettled?.();
      if (result.warnings.length > 0) {
        appToast.success(
          `Offer sent with ${result.warnings.length} warning${
            result.warnings.length === 1 ? "" : "s"
          }.`,
        );
      } else {
        appToast.success("Interview invite sent successfully.");
      }
      router.push("/e/shortlist");
    } catch (error) {
      appToast.error(authFailureMessage(error));
    }
  }

  return { submit, isSubmitting };
}
