"use client";

import Link from "next/link";

import { AuthShell } from "@/components/custom/auth-shell";
import { SignInForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <AuthShell
      headerTrailing={
        <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-1 body-2 font-light text-muted-foreground text-right">
          <span>Are you looking for Talents?</span>
          <Link
            href="/signup?user=employer"
            className="font-normal text-foreground underline decoration-foreground underline-offset-4 hover:opacity-80 transition-all"
          >
            Click here
          </Link>
        </div>
      }
    >
      <div className="mx-auto flex w-full min-w-0 max-w-md flex-col items-center px-0">
        <h1 className="section-h2 font-bold! text-center text-foreground">
          Login to SkillSift
        </h1>

        <p className="body mt-4 text-center text-muted-foreground">
          Jump back in to continue making strides
        </p>

        <div className="mt-8 w-full">
          <SignInForm />
        </div>
      </div>
    </AuthShell>
  );
}
