"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/custom/auth-shell";
import {
  EmployerFinalSignupForm,
  TalentSignupForm,
} from "@/components/auth/signup";

function SignupContent() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  const isEmployer = userParam === "employer";

  const talentSubtitle =
    "Prove your skills and get discovered by employers hiring verified talent.";

  const toggleHref = "/signup?user=employer";

  return (
    <AuthShell
      simpleFooter={isEmployer}
      headerTrailing={
        isEmployer ? (
          <p className="text-right text-sm">
            <Link
              href="/"
              className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Back to Homepage
            </Link>
          </p>
        ) : (
          <div className="body-2 flex flex-col items-end text-right font-light text-muted-foreground sm:flex-row sm:items-center sm:gap-1">
            <span>Are you looking for Talents?</span>

            <Link
              href={toggleHref}
              className="font-normal text-foreground underline decoration-foreground underline-offset-4 transition-all hover:opacity-80"
            >
              Click here
            </Link>
          </div>
        )
      }
    >
      {isEmployer ? (
        <div className="mx-auto flex w-full max-w-360 flex-col px-4 pt-8 pb-20 lg:min-h-[72vh] lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:pt-16 lg:pb-16 xl:px-16">
          {/* LEFT CONTENT */}
          <div className="w-full max-w-92.5 lg:max-w-140">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-3 lg:mb-10">
              <h1 className="flex flex-col text-[24px] leading-[110%] font-bold tracking-[-0.03em] text-foreground lg:text-[32px]">
                <span>Create your employer account</span>
              </h1>

              <p className="max-w-130 text-[18px] leading-[160%] font-medium text-foreground lg:text-[22px]">
                Every candidate on SkillSift is assessed, scored and verified
                before becoming visible to employers.
              </p>
            </div>

            {/* FORM */}
            <div className="flex flex-col gap-6">
              <EmployerFinalSignupForm />
            </div>
          </div>

          {/* RIGHT IMAGE - DESKTOP ONLY */}
          <div className="relative hidden w-full max-w-135 shrink-0 lg:flex lg:items-center lg:justify-center">
            <Image
              src="/assets/hire.svg"
              alt="Hire with confidence — every candidate is assessed, scored, and verified"
              width={540}
              height={540}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-360 flex-col items-center px-4 py-6 lg:px-14 lg:py-8 xl:px-16">
          <div className="w-full max-w-130 mx-auto">
            {/* HEADER */}
            <div className="mb-4 text-center flex flex-col gap-2 lg:mb-6">
              <h1 className="text-[32px] leading-[110%] font-semibold tracking-[-0.02em] text-foreground lg:text-[48px]">
                Create your account
              </h1>

              <p className="text-[16px] leading-[160%] text-muted-foreground lg:text-[18px]">
                {talentSubtitle}
              </p>
            </div>

            {/* FORM */}
            <div className="flex flex-col gap-6">
              <TalentSignupForm />
            </div>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex-1 bg-secondary" aria-hidden />
      }
    >
      <SignupContent />
    </Suspense>
  );
}
