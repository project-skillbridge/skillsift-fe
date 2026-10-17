import { Button } from "@/components/ui/button";
import CTAFloatingImages from "./cta-floating-images";

type Props = { onJoinClick: () => void };

const CtaSection = ({ onJoinClick }: Props) => {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden font-sans bg-background text-primary-foreground"
    >
      <div className="pointer-events-none w-full">
        <svg
          aria-hidden
          className="block h-20 w-full sm:h-32"
          viewBox="0 0 1440 137"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <ellipse cx="720" cy="720" rx="1275" ry="720" fill="#05060F" />
        </svg>
      </div>
      <div className="relative bg-[#05060F] max-sm:px-3 pb-16 pt-6 sm:min-h-141.25 sm:pb-24 sm:pt-25.75">
        <CTAFloatingImages />

        <div className="relative z-10 mx-auto max-w-138 text-center">
          <h2 className="text-2xl font-medium leading-tight text-white sm:hidden">
            Your score is waiting!
          </h2>
          <h2 className="hidden text-white text-[40px] font-bold leading-12.5 sm:block">
            Ready for hiring built on
            <br /> proof, not promises
          </h2>

          <p className="mx-auto mt-3 max-w-md text-white/70 sm:hidden">
            Take the assessment, prove your skills, and let the right
            opportunities find you.
          </p>
          <p className="mx-auto mt-12.5 hidden max-w-138 text-white font-semibold text-base leading-5 sm:block">
            Join the SkillSift waitlist and get early access to a smarter way to
            hire and get hired.
          </p>

          <div className="mt-7 flex justify-center sm:mt-12.5">
            <Button
              type="button"
              onClick={onJoinClick}
              size="lg"
              className="h-12 rounded-md bg-white px-6 text-primary-900 hover:bg-white/90 sm:hidden"
            >
              Join the Waitlist
            </Button>
            <Button
              type="button"
              onClick={onJoinClick}
              size="lg"
              className="hidden h-14 w-60 rounded-lg bg-white text-xl font-bold leading-6.25 text-[#05060F] hover:bg-white/90 sm:inline-flex"
            >
              Reserve My Spot
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
