"use client";

import { motion } from "motion/react";
import Image from "next/image";

const processSteps = [
  {
    id: "assessments",
    eyebrow: "Assessments",
    title: "Complete Assessments",
    description:
      "Candidates complete structured assessments, practical tasks, and interviews designed to measure real-world ability and target-role readiness.",
    img: "/assets/step-assessments.svg",
    accent: "bg-sky-200",
    reverse: false,
  },
  {
    id: "verification",
    eyebrow: "Verification",
    title: "Get Verified",
    description:
      "SkillSift evaluates overall performance and assigns a standardized employability score employers can trust and compare easily.",
    img: "/assets/step-verification.svg",
    accent: "bg-violet-200",
    reverse: true,
  },
  {
    id: "connect",
    eyebrow: "Connect",
    title: "Connect Directly",
    description:
      "Job-ready candidates become discoverable to employers actively hiring verified talent for real opportunities and open roles.",
    img: "/assets/step-connect.svg",
    accent: "bg-orange-300",
    reverse: false,
  },
];

const ease = [0.4, 0, 0.2, 1] as const;
const viewport = { once: true, margin: "-100px" } as const;

export function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-16 pb-20 sm:py-16 lg:pt-20 lg:pb-56"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-4">
          {processSteps.map((step) => {
            const imgX = step.reverse ? 60 : -60;
            const textX = step.reverse ? -60 : 60;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-6 sm:gap-10 lg:gap-24 ${
                  step.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Image */}
                <motion.div
                  className="w-full lg:w-1/2 flex justify-center"
                  initial={{ opacity: 0, x: imgX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease }}
                  viewport={viewport}
                >
                  <div className="relative flex h-64 sm:h-80 lg:h-87.5 w-full max-w-xl items-center justify-center overflow-hidden">
                    <div className="relative h-full w-full">
                      <Image
                        src={step.img}
                        alt={step.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  className="w-full lg:w-1/2 max-w-xl"
                  initial={{ opacity: 0, x: textX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                  viewport={viewport}
                >
                  <p className="mb-4 text-sm font-bold tracking-[0.15em] text-slate-500 uppercase">
                    {step.eyebrow}
                  </p>
                  <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute z-0 bottom-0 w-full pointer-events-none">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="720" cy="720" rx="1275" ry="720" fill="#05060F" />
        </svg>
      </div>
    </section>
  );
}
