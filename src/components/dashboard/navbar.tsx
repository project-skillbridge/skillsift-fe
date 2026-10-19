"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { DashboardNavLinks } from "@/components/dashboard/nav-links";
import { NavbarMobileMenu } from "@/components/dashboard/navbar-mobile-menu";
import { DASHBOARD_NAV_LINKS } from "@/constants/dashboard-nav";
import { DashboardNavbarUserMenu } from "@/components/dashboard/navbar-user-menu";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { cn } from "@/lib/utils";

const LOGO = "/assets/logo/logo.svg";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-360 items-center px-4 sm:px-6 lg:h-18",
        )}
      >
        <NavbarMobileMenu
          pathname={pathname}
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          links={DASHBOARD_NAV_LINKS}
          navAriaLabel="Dashboard"
          variant="talent"
        />
        <Link
          href="/t/dashboard"
          className="inline-flex shrink-0 items-center gap-2"
          aria-label="SkillSift home"
        >
          <Image
            src={LOGO}
            alt="Credlane logo"
            width={36}
            height={36}
            className="size-9 object-contain"
            priority
          />
          <span className="font-sans text-xl font-bold text-primary-900 sm:text-2xl hidden md:block">
            SkillSift
          </span>
        </Link>

        <nav
          className="hidden items-center lg:ml-17.5 lg:flex"
          aria-label="Dashboard"
        >
          <DashboardNavLinks
            pathname={pathname}
            className="flex items-center gap-8"
          />
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3 lg:flex-none lg:gap-4">
          <NotificationBell href="/t/notifications" role="talent" />
          <DashboardNavbarUserMenu />
        </div>
      </div>
    </header>
  );
}
