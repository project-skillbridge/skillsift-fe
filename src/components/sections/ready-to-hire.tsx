import Image from "next/image";

import { FloatingIcons } from "@/components/sections/floating-icons";
import { Button } from "@/components/ui/button";

const readyFloatingIcons = "/assets/images/floating-icons-ready.png";

function MobileReadyIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden ">
      <Image
        src={readyFloatingIcons}
        alt=""
        aria-hidden
        width={661}
        height={800}
        sizes="620px"
        className="relative -right-57.5 top-1 h-auto w-157.5 max-w-none -translate-x-1/2"
        priority={false}
      />
    </div>
  );
}

export function ReadyForHireSection() {
  return (
    <section
      id="contact"
      className="bg-[#05060F]"
      aria-labelledby="ready-for-hire-heading"
    >
      <div className="relative w-full bg-[#05060F] sm:m-0">
        <FloatingIcons layout="intrinsic" className="hidden md:block" />
        <MobileReadyIcons />
        <div className="relative z-10 flex min-h-90 items-start justify-center px-8 pb-70 pt-50 md:absolute md:inset-0 md:min-h-0 md:items-center md:px-6 md:py-20">
          <div className="flex w-full max-w-160 flex-col items-center gap-5">
            <h2
              id="ready-for-hire-heading"
              className="max-w-[18rem] text-center text-[22px] font-bold leading-tight text-white sm:max-w-none sm:text-3xl md:text-4xl"
            >
              Ready for hiring built on proof, not promises?
            </h2>
            <p className="max-w-[18rem] text-center text-[15px] leading-relaxed text-white/90 sm:max-w-none sm:text-base">
              Join SkillSift and discover a smarter way to hire and get hired
            </p>

            <Button
              asChild
              variant="secondary"
              className="rounded-lg bg-secondary px-6 py-5 text-sm font-semibold text-[#334155]"
            >
              <a href="/signup">Join for free</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
