import { CertificatesSection } from "@/components/certificates/certificates-section";
import { DashboardRecommended } from "@/components/dashboard/dashboard-recommended";
import { TalentCarousel } from "@/components/dashboard/talent-carousel";
import { TalentHero } from "@/components/dashboard/talent-hero";
import { DashboardJobRoadmap } from "@/components/dashboard/emerging-user/emerging-user-job-roadmap";
import { apiGoalToLabel } from "@/constants/talent-onboarding";
import { cn } from "@/lib/utils";
import type {
  DashboardHomeResponseData,
  DashboardPerformanceSkill,
  GuidanceRating,
} from "@/types/api";

type InProgressDashboardProps = {
  dashboardHome: DashboardHomeResponseData;
};

type NextStep = { title: string; body: string; cta: string };

function pickNextStep(
  skill: DashboardPerformanceSkill,
  attemptsRemaining: number,
): NextStep {
  if (skill.passed) {
    return {
      title: "Take the advanced assessment",
      body: "Your skill level is verified. The advanced assessment shows employers how you handle real work, and unlocks job matching.",
      cta: "Start advanced assessment",
    };
  }
  if (attemptsRemaining > 0) {
    return {
      title: "Retake the skill assessment",
      body: `You have ${attemptsRemaining} ${attemptsRemaining === 1 ? "attempt" : "attempts"} left. Each attempt uses new questions, so review the areas below first.`,
      cta: "Go to assessments",
    };
  }
  return {
    title: "Keep building your skills",
    body: "You have used all your skill attempts. Use the resources below to strengthen these areas.",
    cta: "View assessments",
  };
}

function RatingList({
  title,
  items,
}: {
  title: string;
  items: GuidanceRating[];
}) {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-border bg-[#FAFAFA] p-6">
      <h2 className="text-[18px] font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <p className="label text-foreground">{item.label}</p>
            <p className="body-3 text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResultCard({
  skill,
  used,
  max,
}: {
  skill: DashboardPerformanceSkill;
  used: number;
  max: number;
}) {
  return (
    <section
      aria-labelledby="result-heading"
      className="rounded-2xl border border-border bg-[#FAFAFA] p-6"
    >
      <h2
        id="result-heading"
        className="text-[18px] font-bold tracking-tight text-foreground"
      >
        Your skill result
      </h2>
      <p className="body-3 mt-1 text-muted-foreground">
        {skill.score} of {skill.maxScore} correct
        {skill.passed
          ? ". Your level is verified."
          : ". You need 50% to verify a level."}
      </p>
      <div className="relative mt-5 h-3 rounded-full bg-gray-200">
        <div
          className={cn(
            "h-full rounded-full",
            skill.passed ? "bg-[#19A878]" : "bg-[#FE9667]",
          )}
          style={{ width: `${Math.min(skill.percentage, 100)}%` }}
        />
        <div
          className="absolute -top-1 h-5 w-0.5 bg-foreground/60"
          style={{ left: "50%" }}
          title="Pass mark: 50%"
        />
      </div>
      <div className="body-3 mt-2 flex justify-between text-muted-foreground">
        <span>{skill.percentage}%</span>
        <span>Pass mark 50%</span>
      </div>
      <div className="mt-5 flex items-center gap-2" aria-label="Attempts used">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < used ? "bg-foreground" : "bg-gray-200",
            )}
          />
        ))}
      </div>
      <p className="body-3 mt-2 text-muted-foreground">
        {used} of {max} attempts used. Every attempt uses new questions.
      </p>
    </section>
  );
}

export function InProgressDashboard({
  dashboardHome,
}: InProgressDashboardProps) {
  const skill = dashboardHome.performance?.skill;
  if (!skill) return null;

  const used = skill.attemptsUsed ?? dashboardHome.skillAttemptsUsed ?? 0;
  const max = dashboardHome.skillMaxAttempts ?? 3;
  const remaining = skill.attemptsRemaining ?? Math.max(max - used, 0);
  const next = pickNextStep(skill, remaining);
  const report = skill.guidanceReport;

  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto">
      <TalentHero
        firstName={dashboardHome.firstName}
        goal={apiGoalToLabel(dashboardHome.goal)}
        profileCompletion={dashboardHome.profileCompletionPercentage}
        percentage={skill.percentage}
        passed={skill.passed}
        level={skill.validatedLevel}
        attemptsLeft={remaining}
        attemptsMax={max}
        nextTitle={next.title}
        nextBody={next.body}
        nextCta={next.cta}
        answersToPass={Math.max(0, Math.ceil(skill.maxScore / 2) - skill.score)}
      />

      {report?.ai_summary ? (
        <p className="body text-muted-foreground">{report.ai_summary}</p>
      ) : null}

      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <div className="[&>section]:h-full">
          <DashboardJobRoadmap
            journeyOverview={dashboardHome.journeyOverview}
          />
        </div>
        <div className="space-y-4">
          <ResultCard skill={skill} used={used} max={max} />
          <TalentCarousel showPractice={remaining > 0 && !skill.passed} />
          <RatingList
            title="Your strengths"
            items={report?.strength_ratings ?? []}
          />
          <RatingList
            title="Where to improve"
            items={report?.weak_area_ratings ?? []}
          />
        </div>
      </div>

      <CertificatesSection />
      <DashboardRecommended />
    </div>
  );
}
