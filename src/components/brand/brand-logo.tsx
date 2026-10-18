import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** "light" is for dark backgrounds, "dark" for light ones. */
  tone?: "light" | "dark";
  className?: string;
};

/** Icon plus live "SkillSift" text, so the name never depends on an image. */
export function BrandLogo({ tone = "dark", className }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      <Image
        src="/assets/logo/logo.svg"
        alt=""
        width={36}
        height={36}
        className="size-9 object-contain"
        priority
      />
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          tone === "light" ? "text-white" : "text-[#0d2025]",
        )}
      >
        SkillSift
      </span>
    </span>
  );
}
