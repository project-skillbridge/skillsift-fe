"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SIGNUP_EMAIL_KEY } from "@/lib/signup-prefill";

type Props = { email: string; employerName?: string | null };

/** Shown after a link taker submits. */
export function ExternalConfirmationStep({ email, employerName }: Props) {
  // Kept out of the URL so the address never lands in logs or history.
  const rememberEmail = () => {
    try {
      window.sessionStorage.setItem(SIGNUP_EMAIL_KEY, email);
    } catch {
      // Signup just starts with an empty email field.
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-72px)] items-start justify-center px-0 pt-8 pb-14 sm:pt-12 lg:pt-14">
      <Card className="w-full max-w-160 rounded-xl border border-[#D9D9D9] bg-white py-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="size-7 text-success" aria-hidden />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-sans text-2xl font-bold text-foreground">
              Assessment submitted
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              Your answers were sent to {employerName ?? "the employer"}. You
              can close this window now.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-xl border border-[#D5E5F4] bg-[#EEF7FF] p-5 text-left">
            <p className="font-sans text-sm font-bold text-[#1B2935]">
              Want to be found by other employers?
            </p>
            <p className="font-sans text-sm leading-relaxed text-[#1B2935]/75">
              This test is only shared with {employerName ?? "the employer"}. To
              appear to other employers on SkillSift, create a profile and
              complete our own skills and job readiness evaluations. That is how
              talent get verified.
            </p>
            <Button asChild variant="outline" className="w-fit rounded-lg">
              <Link href="/signup" onClick={rememberEmail}>
                Create a SkillSift profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
