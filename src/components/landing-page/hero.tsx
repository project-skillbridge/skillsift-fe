"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TEAL = "#A5C8D8";
const PURPLE = "#CBB0EB";
const DARK = "#1B2935";

const ease = [0.4, 0, 0.2, 1] as const;

const checklistItems = [
  { checked: true, width: 60 },
  { checked: true, width: 85 },
  { checked: true, width: 55 },
  { checked: false, width: 95 },
  { checked: false, width: 45 },
];

const profileBars: { w: number; faded: boolean }[][] = [
  [
    { w: 75, faded: false },
    { w: 92, faded: false },
    { w: 60, faded: false },
    { w: 78, faded: false },
    { w: 48, faded: true },
  ],
  [
    { w: 82, faded: false },
    { w: 65, faded: false },
    { w: 88, faded: false },
    { w: 70, faded: false },
    { w: 38, faded: true },
  ],
];

function CandidateCard() {
  return (
    <div
      className="rounded-[24px] md:rounded-[28px] p-6 md:p-8 min-h-75 md:min-h-95 rotate-1 md:rotate-3"
      style={{ backgroundColor: TEAL }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
        Your assessment path
      </h3>
      <p className="mt-1 md:mt-2 text-sm md:text-[15px] leading-snug text-gray-700">
        Complete role-specific tasks and assessments at your own pace.
      </p>

      <div
        className="mt-5 md:mt-6 overflow-hidden rounded-[18px] md:rounded-[20px]"
        style={{ backgroundColor: DARK }}
      >
        <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5 pt-5 md:pt-6 pb-4 md:pb-5">
          <span className="whitespace-nowrap text-[10px] md:text-xs text-gray-300">
            Online course (3/5)
          </span>
          <div
            className="h-1.5 w-full max-w-25 md:w-28 overflow-hidden rounded-full"
            style={{ backgroundColor: "#2E4252" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#3A9EC5" }}
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 0.9, delay: 1.0, ease }}
            />
          </div>
        </div>

        <div
          className="mx-2 md:mx-3 mb-3 md:mb-4 rounded-[12px] md:rounded-[14px] p-4 md:p-5"
          style={{ backgroundColor: TEAL }}
        >
          <div className="space-y-3 md:space-y-4">
            {checklistItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.05 + i * 0.07, ease }}
              >
                <div
                  className="flex h-4 w-4 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.checked ? DARK : "#7B8E9A" }}
                >
                  {item.checked && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 md:h-3 md:w-3"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div
                  className="h-2.5 md:h-3 rounded-full"
                  style={{
                    width: `${item.width}%`,
                    backgroundColor: item.checked ? DARK : "#8CAAB5",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployerCard() {
  const candidates = [
    { name: "Paul Gongo", score: 87, bars: profileBars[0] },
    { name: "Sarah Lee", score: 95, bars: profileBars[1] },
  ];

  return (
    <div
      className="rounded-[24px] md:rounded-[28px] p-4 md:p-6 min-h-90 md:min-h-115 -rotate-1 md:-rotate-3"
      style={{ backgroundColor: PURPLE }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
        Your talent pipeline
      </h3>
      <p className="mt-1 md:mt-2 text-sm md:text-[15px] leading-snug text-gray-700">
        Browse pre-screened candidates ranked by employability score.
      </p>

      <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4">
        {candidates.map((c, ci) => (
          <div
            key={c.name}
            className="flex min-h-45 md:min-h-55 flex-col overflow-hidden rounded-[18px] md:rounded-[20px]"
            style={{ backgroundColor: DARK }}
          >
            <div className="px-3 md:px-4 pt-5 md:pt-6 pb-4 md:pb-5">
              <p className="text-[11px] md:text-sm font-bold text-white truncate">
                {c.name}
              </p>
              <p className="mt-1 text-[9px] md:text-xs text-gray-400">
                Score: {c.score}%
              </p>
            </div>

            <div
              className="mx-2 md:mx-3 mb-4 md:mb-5 mt-auto rounded-[10px] md:rounded-[14px] p-4 md:p-6"
              style={{ backgroundColor: PURPLE }}
            >
              <div className="space-y-3 md:space-y-4">
                {c.bars.map((bar, i) => (
                  <motion.div
                    key={i}
                    className="h-2.5 md:h-3.5 rounded-full"
                    style={{
                      backgroundColor: bar.faded ? "#8B78A8" : DARK,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.w}%` }}
                    transition={{
                      duration: 0.5,
                      delay: 1.1 + ci * 0.18 + i * 0.06,
                      ease,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[calc(100svh-73px)] md:min-h-[calc(100vh-73px)] bg-[#EFEFEF]"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-2 pt-16 pb-10 text-center sm:px-6 md:pt-25 md:pb-16 space-y-10">
        <motion.h1
          className="text-[27px] leading-[1.08] font-bold tracking-tight text-[#151515] sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          Prove Your Skills. Make Better Hiring Decisions
        </motion.h1>
        <motion.p
          className="mx-auto max-w-76 text-base leading-relaxed text-[#151515] sm:max-w-none md:text-lg font-light"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          SkillSift verifies talents’ skills through structured assessments so
          employers can confidently discover and hire qualified talent faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease }}
          className="flex flex-col md:flex-row gap-2 mt-6 w-full items-center justify-center "
        >
          <Button
            className="rounded-[8px] bg-primary-900 px-4.5 py-3 text-base font-semibold text-white hover:bg-[#1B2935]"
            asChild
          >
            <Link href="/signup">Get Started as a Talent</Link>
          </Button>
          <Button
            className="rounded-[8px] bg-white px-4.5 py-3 text-base font-semibold text-[#05060F] hover:bg-white/80 border-[0.5px] border-[#05060F]"
            asChild
          >
            <Link href="/signup?user=employer">Join as an employer</Link>
          </Button>
        </motion.div>
      </div>

      {/* Product preview cards */}
      <div
        className="relative z-10 mx-auto max-w-5xl px-3 pb-18 sm:px-4 md:px-6 md:pb-0"
        style={{ perspective: "1500px" }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease }}
          >
            <div className="md:transform-[rotateY(10deg)] md:origin-[right_center]">
              <CandidateCard />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.48, ease }}
          >
            <div className="md:transform-[rotateY(-10deg)] md:origin-[left_center]">
              <EmployerCard />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Curve */}
      <motion.div
        className="absolute z-10 bottom-0 left-1/2 w-[130%] -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease }}
      >
        <svg
          className="w-full h-10 md:h-auto"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <ellipse cx="720" cy="720" rx="1200" ry="720" fill="white" />
        </svg>
      </motion.div>
    </section>
  );
}
