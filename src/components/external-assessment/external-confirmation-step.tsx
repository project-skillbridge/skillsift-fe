"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SIGNUP_EMAIL_KEY } from "@/lib/signup-prefill";

/** Shown after a link taker submits; invites them to keep the result on a SkillSift profile. */
export function ExternalConfirmationStep({ email }: { email: string }) {
  // Kept out of the URL so the address never lands in logs or history.
  const rememberEmail = () => {
    try {
      window.sessionStorage.setItem(SIGNUP_EMAIL_KEY, email);
    } catch {
      // Signup just starts with an empty email field.
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="size-6 text-green-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-[#151515]">
          Assessment submitted
        </h2>
        <p className="max-w-md text-sm text-[#475467]">
          Your answers were sent to the employer. You can close this window now.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-xl bg-[#F9FAFB] p-5 text-left">
        <p className="text-sm font-semibold text-[#151515]">
          Get verified and get discovered
        </p>
        <p className="text-sm text-[#475467]">
          Join SkillSift with {email} and the employer will see you as verified.
          You can also take skills assessments that other employers search by.
        </p>
        <Button asChild onClick={rememberEmail}>
          <Link href="/signup">Create my SkillSift profile</Link>
        </Button>
      </div>
    </div>
  );
}
