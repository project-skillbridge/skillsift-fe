"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ShareProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  qrCodeUrl?: string;
};

export function ShareProfileModal({
  open,
  onOpenChange,
  shareUrl,
  qrCodeUrl,
}: ShareProfileModalProps) {
  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share your verified profile</DialogTitle>
          <DialogDescription>
            Anyone with this link can view your profile — no SkillSift account
            required. Add it to your bio, resume, or LinkedIn.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-center space-x-2">
          <Input readOnly value={shareUrl} className="flex-1" />
          <Button
            type="button"
            size="icon"
            onClick={handleCopy}
            title="Copy link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {qrCodeUrl ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Image
              src={qrCodeUrl}
              alt="QR code linking to your verified profile"
              width={160}
              height={160}
              unoptimized
              className="rounded-lg border border-[#D9D9D9]"
            />
            <p className="text-xs text-[#757575]">
              Scan to open on another device
            </p>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
