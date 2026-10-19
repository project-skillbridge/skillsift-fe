import { BrandLogo } from "@/components/brand/brand-logo";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";

const serif = Fraunces({ variable: "--font-cert-serif", subsets: ["latin"] });

/**
 * Standalone layout for the public, unauthenticated share page — no
 * dashboard chrome, no full marketing nav/footer. This needs to stand on
 * its own when opened from a bio link on a phone, so it's just a minimal
 * brand mark plus the content.
 */
export default function PublicCertificateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${serif.variable} min-h-screen bg-gradient-to-b from-[#E7F7F0] via-[#F3FBF8] to-white`}
    >
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <Link href="/" className="flex items-center">
          <BrandLogo tone="dark" />
        </Link>
        <span className="text-sm font-medium text-[#757575]">
          Skill Certificate
        </span>
      </header>
      <main className="mx-auto w-full max-w-4xl px-3 pb-10 sm:px-6 sm:pb-16">
        {children}
      </main>
    </div>
  );
}
