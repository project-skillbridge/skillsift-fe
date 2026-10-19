import Link from "next/link";
import { footerLinks } from "./data";

const SiteFooter = () => {
  return (
    <footer className="bg-[#05060F] text-white">
      <div className="mx-auto flex w-full max-w-360 flex-col items-start justify-between gap-4 px-6 py-6 sm:h-14 sm:flex-row sm:items-center sm:gap-0 sm:px-16 sm:py-0">
        <p className="text-sm font-light leading-[150%] tracking-[0.024em] text-white">
          &copy; {new Date().getFullYear()} SkillSift Inc. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {footerLinks.map((link, idx) => (
            <div key={link.label} className="flex items-center gap-x-2">
              <Link
                href={link.href}
                className="text-sm font-light leading-[150%] tracking-[0.024em] text-white transition-colors hover:text-white/80"
              >
                {link.label}
              </Link>
              {idx < footerLinks.length - 1 && (
                <span
                  aria-hidden
                  className="size-0.75 rounded-full bg-white/40"
                />
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
};
export default SiteFooter;
