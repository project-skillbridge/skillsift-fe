import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FloatingIcons } from "../landing-page/floating-icons";

export function AboutCTASection() {
  return (
    <section className="bg-[#05060F]">
      <div className="relative w-full">
        <FloatingIcons layout="intrinsic" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 py-16 md:py-20">
          <div className="flex w-full max-w-160 flex-col items-center gap-5">
            <h2 className="text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              Ready To Get Started?
            </h2>
            <p className="text-center text-base leading-relaxed text-white/80">
              Join SkillSift and discover a smarter, faster way to prove skills,
              connect with opportunities, and hire verified talent.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-[#F1F5F9] px-6 text-gray-900 hover:bg-white"
            >
              <Link href="/waitlist">Join the waitlist</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
