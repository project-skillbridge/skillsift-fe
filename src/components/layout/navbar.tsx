"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const logoWithText = "/assets/logo/logo-with-text-white.svg";

const navLinks = [
  { label: "About", href: "/about-us" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact Us", href: "/contact" },
] as const;

const SCROLL_DELTA = 8;

function getHeroMidpoint() {
  const hero = document.getElementById("home");
  if (!hero) return window.innerHeight / 2;
  return hero.offsetTop + hero.offsetHeight / 2;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { status, data: session } = useSession();
  const isAuthed = status === "authenticated";
  const dashboardHref =
    session?.user?.role === "talent" ? "/t/dashboard" : "/e/dashboard";

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const heroMidpoint = getHeroMidpoint();

      if (currentScrollY < heroMidpoint) {
        setIsVisible(true);
      } else {
        const delta = currentScrollY - lastScrollY.current;
        if (delta > SCROLL_DELTA) {
          setIsVisible(false);
        } else if (delta < -SCROLL_DELTA) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-[#05060F] backdrop-blur transition-transform duration-300 ease-in-out",
        !isVisible && !mobileOpen && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="relative h-9 w-32 shrink-0 md:h-10 md:w-40">
          <Image
            src={logoWithText}
            alt="SkillSift"
            fill
            className="object-contain object-left"
            priority
            sizes="(max-width: 768px) 128px, 160px"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav
            className="flex items-center gap-8 text-[15px] font-medium text-white"
            aria-label="Main"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <span
              className="h-4 w-px shrink-0 bg-white/30"
              aria-hidden="true"
            />

            <Link
              href="/signup?user=employer"
              className="py-1 text-[15px] font-medium text-white transition-colors hover:text-white/90"
            >
              Hire a Talent
            </Link>
          </nav>

          {status === "loading" ? null : (
            <Button
              asChild
              className="rounded-lg bg-white px-6 py-5 text-sm font-semibold text-[#05060F] hover:bg-white/90"
            >
              <Link href={isAuthed ? dashboardHref : "/login"}>
                {isAuthed ? "Dashboard" : "Login"}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {status === "loading" ? null : (
            <Button
              asChild
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#05060F] hover:bg-white/90"
            >
              <Link href={isAuthed ? dashboardHref : "/login"}>
                {isAuthed ? "Dashboard" : "Login"}
              </Link>
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
                aria-label={mobileOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={mobileOpen}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 border-white/10 bg-[#05060F] text-white"
              aria-describedby={undefined}
            >
              <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-6 pl-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-white/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/signup?user=employer"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-white/80 hover:text-white"
                >
                  Hire a Talent
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
