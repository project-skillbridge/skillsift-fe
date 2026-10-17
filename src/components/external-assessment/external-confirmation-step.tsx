"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExternalConfirmationStep() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border bg-card p-8 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="size-6 text-green-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Assessment Submitted
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Your answers have been securely recorded and sent to the employer. You
          can safely close this window.
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col space-y-4 border-t pt-8">
        <p className="text-sm font-medium text-foreground">
          Looking for more opportunities?
        </p>
        <Button
          asChild
          className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white"
        >
          <Link href="/signup">Find jobs on SkillSift</Link>
        </Button>
      </div>
    </div>
  );
}
