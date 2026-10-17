"use client";

import { motion } from "motion/react";
import { FloatingIcons } from "@/components/sections/floating-icons";

const ease = [0.4, 0, 0.2, 1] as const;

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <FloatingIcons />

      {/* Hero text */}
      <div className="relative z-10 mx-auto max-w-2xl px-7 pt-16 pb-56 text-center sm:px-6 md:pt-32 md:pb-72">
        <motion.h1
          className="text-[27px] leading-[1.08] font-bold tracking-tight text-gray-900 sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          How it works
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-76 text-sm leading-relaxed text-gray-600 sm:max-w-none md:mt-5 md:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          SkillSift helps professionals prove what they can actually do through
          structured assessments, verified profiles, and skill-based
          opportunities.
        </motion.p>
      </div>

      {/* Background Curve */}
      <motion.div
        className="absolute z-0 bottom-0 w-full pointer-events-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease }}
      >
        <svg
          className="w-full h-12 md:h-auto"
          viewBox="0 0 1440 137"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <ellipse cx="720" cy="720" rx="1275" ry="720" fill="white" />
        </svg>
      </motion.div>
    </section>
  );
}
