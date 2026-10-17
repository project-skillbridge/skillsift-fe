import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectsCard from "./projects-card";
import TalentsCard from "./talents-card";
import { desktopCopy } from "./data";
import SkillsCard from "./skills-card";
import HeroDesktopFloatingImages from "./hero-desktop-floating-images";

type HeroDesktopProps = { onJoinClick: () => void };

const HeroDesktop = ({ onJoinClick }: HeroDesktopProps) => {
  return (
    <section className="relative hidden overflow-hidden bg-[#f5f5f5] pt-16 sm:block">
      <HeroDesktopFloatingImages />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <h1 className="font-extrabold text-5xl leading-15 text-primary-900">
          Find talent. Get hired
        </h1>
        <p className="mx-auto mt-6 max-w-123.25 text-[#151515] text-base leading-[160%]">
          SkillSift helps candidate prove their skills and connects them with
          employers who needs them.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={onJoinClick}
            size="lg"
            className="h-14 rounded-lg bg-primary-900 px-4 text-[22px] font-semibold leading-7 text-primary-foreground border hover:bg-primary-900/90"
          >
            Join the Waitlist
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 w-full max-w-230.5 px-6">
        <div className="flex items-start justify-center gap-1.5">
          <SkillsCard
            title={desktopCopy.skills.title}
            body={desktopCopy.skills.body}
            className="z-10 h-76.25 w-75 -rotate-3"
          />
          <ProjectsCard
            title={desktopCopy.projects.title}
            body={desktopCopy.projects.body}
            className="z-20 h-76.25 w-75 translate-y-[2.5px] rotate-2"
          />
          <TalentsCard
            title={desktopCopy.talents.title}
            body={desktopCopy.talents.body}
            className="z-10 h-76.25 w-75 translate-y-[2.5px] -rotate-2"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
        <svg
          aria-hidden
          className="block h-24 w-full"
          viewBox="0 0 1440 137"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <ellipse cx="720" cy="720" rx="1275" ry="720" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default HeroDesktop;
