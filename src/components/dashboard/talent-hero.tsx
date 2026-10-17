"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";

import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/types/api";

const LEVELS: { key: SkillLevel; label: string }[] = [
  { key: "junior", label: "Junior" },
  { key: "mid", label: "Mid" },
  { key: "senior", label: "Senior" },
  { key: "expert", label: "Expert" },
];

type TalentHeroProps = {
  firstName?: string;
  goal?: string;
  profileCompletion?: number;
  /** Latest skill score, 0-100. */
  percentage: number;
  passed: boolean;
  level: SkillLevel;
  attemptsLeft: number;
  attemptsMax: number;
  nextTitle: string;
  nextBody: string;
  nextCta: string;
  nextHref?: string;
  /** Correct answers still needed to reach the pass mark; 0 or unset hides it. */
  answersToPass?: number;
};

function ScoreBlock({ value }: { value: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(Math.min(value, 100)));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div className="w-full min-w-44 max-w-56">
      <p className="text-5xl font-bold leading-none tracking-tight text-[#1B2935]">
        {value}
        <span className="text-2xl">%</span>
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1B2935]/70">
        latest score
      </p>
      <div
        className="relative mt-3 h-3 rounded-full bg-white ring-1 ring-[#D5E5F4]"
        role="img"
        aria-label={`Score ${value}%, pass mark 50%`}
      >
        <div
          className={cn("h-full rounded-full", "bg-[#FE9667]")}
          style={{
            width: `${shown}%`,
            transition: "width 1s cubic-bezier(.2,.8,.2,1)",
          }}
        />
        <span className="absolute -top-1 left-1/2 h-5 w-0.5 bg-[#1B2935]" />
      </div>
      <p className="mt-1.5 text-right text-xs font-medium text-[#1B2935]/70">
        pass mark 50%
      </p>
    </div>
  );
}

function LevelLadder({
  level,
  passed,
}: {
  level: SkillLevel;
  passed: boolean;
}) {
  const currentIndex = passed ? LEVELS.findIndex((l) => l.key === level) : -1;

  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Skill levels">
      {LEVELS.map((l, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <li
            key={l.key}
            className={cn(
              "flex flex-col gap-1 rounded-xl px-3 py-2.5 text-sm font-bold",
              current
                ? "bg-[#1B2935] text-white"
                : reached
                  ? "bg-[#CCB0EB] text-[#1B2935]"
                  : "border border-dashed border-[#1B2935]/30 bg-white/60 text-[#1B2935]/55",
            )}
          >
            {reached ? (
              <Check className="size-4" strokeWidth={3} />
            ) : (
              <Lock className="size-4" />
            )}
            {l.label}
          </li>
        );
      })}
    </ol>
  );
}

export function TalentHero({
  firstName,
  goal,
  profileCompletion,
  percentage,
  passed,
  level,
  attemptsLeft,
  attemptsMax,
  nextTitle,
  nextBody,
  nextCta,
  nextHref = "/t/assessments",
  answersToPass,
}: TalentHeroProps) {
  const { fullName } = useSessionUserProfile();
  const name = firstName || fullName?.split(" ")[0] || "there";
  const levelLabel = LEVELS.find((l) => l.key === level)?.label ?? level;

  return (
    <section className="rounded-3xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0 space-y-6">
          <div>
            <p className="text-sm font-semibold text-[#1B2935]/70">
              {goal ? `Working toward: ${goal}` : "Your skill journey"}
            </p>
            <h1 className="mt-1 max-w-2xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {passed
                ? `${name}, you're verified at ${levelLabel} level`
                : `Welcome back, ${name}`}
            </h1>
          </div>

          <LevelLadder level={level} passed={passed} />

          <div className="max-w-xl rounded-2xl bg-[#CCB0EB] p-5 text-[#1B2935]">
            <p className="font-bold">{nextTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#1B2935]/80">
              {nextBody}
            </p>
            <Link
              href={nextHref}
              className="group mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1B2935] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-85"
            >
              {nextCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <ScoreBlock value={percentage} />
          {!passed && answersToPass ? (
            <p className="max-w-56 rounded-xl bg-[#CCB0EB]/40 px-3 py-2 text-sm font-semibold">
              {answersToPass} more correct{" "}
              {answersToPass === 1 ? "answer" : "answers"} to verify{" "}
              {levelLabel}
            </p>
          ) : null}
          <div className="flex gap-6 text-sm font-medium text-[#1B2935]/70">
            <p>
              <span className="block text-lg font-bold text-[#1B2935]">
                {attemptsLeft} of {attemptsMax}
              </span>
              attempts left
            </p>
            {profileCompletion != null && profileCompletion < 100 ? (
              <Link href="/t/settings" className="hover:underline">
                <span className="block text-lg font-bold text-[#1B2935]">
                  {profileCompletion}%
                </span>
                profile complete
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
