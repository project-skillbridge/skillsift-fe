import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

/**
 * Standalone layout for the public, unauthenticated share page — no
 * dashboard chrome, no full marketing nav/footer. This needs to stand on
 * its own when opened from a bio link on a phone, so it's just a minimal
 * brand mark plus the content.
 */
export default function PublicVerifiedProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3FBF8] to-white">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo/logo-with-text.svg"
            alt="SkillSift"
            width={140}
            height={32}
            priority
          />
        </Link>
        <span className="text-sm font-medium text-[#757575]">
          Verified Talent Profile
        </span>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        {children}
      </main>
    </div>
  );
}
