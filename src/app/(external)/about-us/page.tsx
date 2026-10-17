import { AboutHeroSection } from "@/components/about-page/hero";
import { AboutStorySection } from "@/components/about-page/story";
import { AboutTeamSection } from "@/components/about-page/team";
import { AboutMissionSection } from "@/components/about-page/mission";
import { AboutCTASection } from "@/components/about-page/cta";

export const metadata = {
  title: "About Us | SkillSift",
  description:
    "SkillSift helps early-career talents build in-demand skills, prove their capabilities through verified performance, and connect with opportunities.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHeroSection />
      <AboutStorySection />
      <AboutTeamSection />
      <AboutMissionSection />
      <AboutCTASection />
    </main>
  );
}
