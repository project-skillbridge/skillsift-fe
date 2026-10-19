"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/layout/footer-social-icons";

type NavLink = { label: string; href: string; hash?: string };

const mainNavColumn: { title: string; links: NavLink[] } = {
  title: "Navigate",
  links: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const footerColumns: { title: string; links: NavLink[] }[] = [
  mainNavColumn,
  {
    title: "Resources",
    links: [
      { label: "FAQs", href: "/#faq", hash: "faq" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
];

type SocialItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const socialLinks: SocialItem[] = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@credlanehq",
    icon: <TikTokIcon />,
  },
  { label: "X", href: "https://x.com/CredLaneHQ", icon: <XIcon /> },
  {
    label: "Instagram",
    href: "https://www.instagram.com/credlanehq",
    icon: <InstagramIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/credlanehq",
    icon: <LinkedInIcon />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@credlanehq",
    icon: <YouTubeIcon />,
  },
];

function FooterColumn({
  title,
  links,
  onLinkClick,
}: {
  title: string;
  links: NavLink[];
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={(e) => onLinkClick(e, link)}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLinkClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink,
  ) {
    if (!link.hash) return;
    e.preventDefault();
    if (pathname === "/") {
      document
        .getElementById(link.hash)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(link.href);
    }
  }

  return (
    <footer className={cn("bg-[#05060F] text-white", className)}>
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-12 lg:gap-16">
          <div className="flex max-w-xs flex-col gap-6">
            <Link href="/" className="relative block h-10 w-42 shrink-0">
              <BrandLogo tone="light" />
            </Link>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-opacity hover:opacity-90"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 lg:gap-x-16">
            {footerColumns.map((col) => (
              <FooterColumn
                key={col.title}
                title={col.title}
                links={col.links}
                onLinkClick={handleLinkClick}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} SkillSift. All rights reserved.
          </p>
          <p>Verified talent for early-career roles across Africa.</p>
        </div>
      </div>
    </footer>
  );
}
