"use client";

import Link from "next/link";

import AssessmentContainer from "@/components/assessments/assessment-container";
import { isSkillExhausted } from "@/components/assessments/dashboard-home-state";
import { groupCompetencies } from "@/lib/competency-areas";
import { useDashboardHome } from "@/hooks/api/use-dashboard";
import { useMe } from "@/hooks/api";
import { useAssessmentSummaryStore } from "@/stores/assessment-summary-store";

import NextUpCard from "./next-up-card";
import { Button } from "../ui/button";

function formatLevel(level: string | undefined, fallback: string) {
  if (!level) return fallback;

  return level
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const SkillAssessementSummary = () => {
  const { data: user } = useMe({ enabled: true });
  const { data: dashboardHome } = useDashboardHome();
  const result = useAssessmentSummaryStore((state) =>
    user?.id ? state.resultsByUser[user.id]?.skill : null,
  );
  const storedClaimedLevel = useAssessmentSummaryStore((state) =>
    user?.id ? state.skillClaimedLevelsByUser[user.id] : null,
  );
  const isUserContextReady = Boolean(user?.id);
  const validatedLevel = formatLevel(result?.validated_level, "Junior");
  const claimedLevel = formatLevel(
    result?.claimed_level ?? storedClaimedLevel ?? undefined,
    "your selected level",
  );
  const percentage =
    result?.percentage ?? dashboardHome?.performance?.skill?.percentage;
  const breakdown = groupCompetencies(result?.competency_breakdown ?? []);
  const skillPassed =
    result?.passed ?? dashboardHome?.performance?.skill?.passed === true;
  const isDowngraded = result?.downgraded ?? !skillPassed;
  // const feedback =
  //   result?.personalised_message ??
  //   result?.guidance_report?.summary ??
  //   "This does not define your potential. It helps us tailor your assessment accurately.";

  // Attempt counts come from /dashboard/home, not the submit response — the
  // skill submit doesn't carry the user's running attempt tally. Exhaustion
  // goes through the shared helper so partial payloads (e.g. only the
  // top-level skillAttemptsUsed/skillMaxAttempts mirrors) still hide retake.
  const skillPerf = dashboardHome?.performance?.skill;
  const attemptsUsed =
    skillPerf?.attemptsUsed ?? dashboardHome?.skillAttemptsUsed;
  const maxAttempts = dashboardHome?.skillMaxAttempts;
  const hasAttemptsInfo = attemptsUsed != null && maxAttempts != null;
  const noAttemptsLeft = isSkillExhausted(dashboardHome);
  const advancedStatus = dashboardHome?.journeyOverview?.find(
    (item) => item.key === "advanced",
  )?.status;
  const canContinueToAdvanced = advancedStatus === "available";
  // Retake stays available whenever attempts remain, even after a pass —
  // users can try for a higher validated level up to the attempt cap before
  // they're required to move on with the level they were given.
  const showRetakeButton = !noAttemptsLeft;
  return !isUserContextReady ? (
    <AssessmentContainer>
      <p className="text-base text-muted-foreground">
        Loading your assessment summary...
      </p>
    </AssessmentContainer>
  ) : (
    <AssessmentContainer>
      <section className="mt-2 rounded-3xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935] md:p-8">
        <p className="text-sm font-semibold text-[#1B2935]/70">
          Skill Level Evaluation
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
          {skillPassed
            ? `You passed at ${validatedLevel} level`
            : "Not there yet, and you can try again"}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1B2935]/80">
          {!skillPassed ? (
            <>
              Your score didn&apos;t reach the 50% minimum to verify a level.
              The topics below show where to focus before you retake.
            </>
          ) : isDowngraded ? (
            <>
              Your validated level is{" "}
              <span className="font-bold">{validatedLevel}</span> instead of
              your claim of <span className="font-bold">{claimedLevel}</span>.
              You can continue to the next assessment.
            </>
          ) : (
            <>
              Your skill certificate is ready on your dashboard. Continue to the
              Job Readiness Evaluation to become visible to employers.
            </>
          )}
        </p>

        {percentage != null ? (
          <div className="mt-6 max-w-md">
            <p className="text-5xl font-bold leading-none">
              {percentage}
              <span className="text-2xl">%</span>
            </p>
            <div
              className="relative mt-3 h-3 rounded-full bg-white ring-1 ring-[#D5E5F4]"
              role="img"
              aria-label={`Score ${percentage}%, pass mark 50%`}
            >
              <div
                className="h-full rounded-full bg-[#FE9667]"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              <span className="absolute -top-1 left-1/2 h-5 w-0.5 bg-[#1B2935]" />
            </div>
            <p className="mt-1.5 text-right text-xs font-medium text-[#1B2935]/70">
              pass mark 50%
            </p>
          </div>
        ) : null}

        {hasAttemptsInfo ? (
          <p className="mt-4 text-sm text-[#1B2935]/70">
            {attemptsUsed} of {maxAttempts} skill attempts used.
            {noAttemptsLeft ? " No retakes remaining." : null}
          </p>
        ) : null}
      </section>

      {breakdown.length > 0 ? (
        <section className="mt-8" aria-labelledby="breakdown-heading">
          <h3 id="breakdown-heading" className="text-lg font-bold">
            How you did by topic
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Weakest first, so you know where to start.
          </p>
          <ul className="mt-4 space-y-4">
            {breakdown.map((item) => (
              <li key={item.competency}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold">{item.competency}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {item.correct} of {item.total} correct
                  </p>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-[#EEF7FF] ring-1 ring-[#D5E5F4]">
                  <div
                    className={
                      item.percentage >= 50
                        ? "h-full rounded-full bg-[#CCB0EB]"
                        : "h-full rounded-full bg-[#FE9667]"
                    }
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col">
        {/* {isDowngraded && (
          <div className="border mt-6 w-fit border-[#FF7854] bg-[#FFF1EE] flex flex-row gap-x-4 items-center py-2.5 px-3 rounded-lg">
            <Image
              src={"/assets/icons/alert-icon.svg"}
              height={24}
              width={24}
              alt="Alert icon"
            />
            <p className="text-[#757575] text-[14px]">{feedback}</p>
          </div>
        )} */}
        <div className="flex flex-col gap-y-4 sm:flex-row items-center self-center mt-10 gap-x-2">
          {showRetakeButton && (
            <Button
              asChild
              className="bg-[#322B2B] text-white disabled:text-white rounded-lg h-10 min-w-fit md:w-52.25 hover:bg-[#322B2B]/70 transition-all disabled:bg-[#0F1724]/50 duration-300 cursor-pointer"
            >
              <Link href="/t/assessments/skill">Retake </Link>
            </Button>
          )}
          <Button
            asChild
            className={
              skillPassed && canContinueToAdvanced
                ? "bg-primary text-primary-foreground rounded-lg h-10 w-fit md:min-w-60 hover:bg-primary/90 transition-all duration-300 cursor-pointer"
                : "bg-muted text-foreground rounded-lg h-10 w-fit md:min-w-60 hover:bg-muted/70 transition-all duration-300 cursor-pointer"
            }
          >
            <Link
              href={
                canContinueToAdvanced
                  ? "/t/assessments/advanced"
                  : "/t/dashboard"
              }
            >
              {canContinueToAdvanced
                ? "Accept & continue"
                : "Return to dashboard"}
            </Link>
          </Button>
        </div>
      </div>
      <NextUpCard
        assessement="skill"
        duration="60 minutes"
        title="Job Readiness Evaluation"
      />
    </AssessmentContainer>
  );
};

export default SkillAssessementSummary;
