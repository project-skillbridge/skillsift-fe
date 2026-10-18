"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SHELL_MAX_W = "max-w-shell";

type AuthShellProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: React.ReactNode;
  headerTrailing?: React.ReactNode;
  logoHref?: string;
  mainClassName?: string;
  simpleFooter?: boolean;
};

function AuthShell({
  className,
  children,
  headerTrailing,
  logoHref = "/",
  mainClassName,
  simpleFooter = false,
  ...props
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-col",
        simpleFooter ? "bg-background" : "bg-secondary",
        "font-sans",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col",
          SHELL_MAX_W,
        )}
      >
        <header className="sticky top-0 z-40 flex h-18 w-full flex-col justify-center border-b border-border bg-background px-4 sm:px-15">
          <div className="max-w-360  mx-auto flex w-full items-center justify-between">
            <Link href={logoHref} className="inline-flex shrink-0">
              <BrandLogo tone="dark" />
            </Link>

            {headerTrailing && (
              <div className="flex items-center justify-end flex-1">
                {headerTrailing}
              </div>
            )}
          </div>
        </header>

        <main
          className={cn(
            "flex w-full min-h-0 flex-1 flex-col justify-center-safe px-4 py-6 sm:px-6 sm:py-8 lg:py-10",
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>

      {simpleFooter && (
        <footer className="w-full bg-[#05060F] z-20">
          <div
            className={cn(
              "mx-auto flex min-h-14 w-full flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row sm:py-0 lg:px-16",
              SHELL_MAX_W,
            )}
          >
            <div className="body font-light text-slate-600">
              © 2026 SkillSift Inc. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-slate-600">
              <Link
                href="/terms-of-use"
                className="body font-light hover:opacity-80"
              >
                Terms of use
              </Link>
              <span className="size-0.75" />

              <Link
                href="/privacy-policy"
                className="body font-light hover:opacity-80"
              >
                Privacy Policy
              </Link>
              <span className="size-0.75" />

              <Link
                href="/contact"
                className="body font-light hover:opacity-80"
              >
                Contact us
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export { AuthShell };
export type { AuthShellProps };
