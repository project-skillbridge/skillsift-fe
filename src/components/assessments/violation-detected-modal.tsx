"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViolationDetectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  violationCount?: number;
  violationLimit?: number;
  onNeedHelp?: () => void;
  onContinue?: () => void;
}

const ViolationDetectedModal = ({
  isOpen,
  onClose,
  violationCount = 1,
  violationLimit = 3,
  onNeedHelp,
  onContinue,
}: ViolationDetectedModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="flex flex-col items-center gap-8 px-6 py-8 rounded-2xl max-w-xl w-full border-none shadow-xl">
      <DialogHeader className="sr-only">
        <DialogTitle>Violation Detected</DialogTitle>
      </DialogHeader>

      <div className="flex justify-center w-full">
        <Image
          src="/assets/icons/violation-detected-icon.svg"
          width={100}
          height={120}
          alt="Violation detected icon"
        />
      </div>

      <div className="flex flex-col items-center gap-3.5 w-full">
        <h2 className="text-center font-bold text-2xl text-foreground">
          Violation detected ({violationCount}/{violationLimit})
        </h2>

        <div className="flex flex-col items-center gap-3.5 w-full">
          <p className="text-center text-base text-foreground max-w-122.5">
            Leaving the assessment environment counts as a violation. If you
            exceed the violation limit, you&apos;ll be logged out of the
            assessment
          </p>
          <p className="text-center text-sm text-[#757575] w-full">
            Please note that by clicking continue, you agree to{" "}
            <span className="font-semibold text-foreground underline cursor-pointer">
              SkillSift&apos;s assessment terms and guidelines
            </span>
            .
          </p>
        </div>

        <div className="flex flex-row gap-4 w-full mt-2">
          <Button
            onClick={onNeedHelp}
            className="flex-1 h-10 bg-[#757575] hover:bg-[#757575]/80 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer"
          >
            Need help?
          </Button>
          <Button
            onClick={onContinue ?? onClose}
            className="flex-1 h-10 bg-[#05060F] hover:bg-[#05060F]/80 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer"
          >
            Continue
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default ViolationDetectedModal;
