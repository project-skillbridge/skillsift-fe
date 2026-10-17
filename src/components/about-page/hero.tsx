"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FloatingIcons } from "../landing-page/floating-icons";

const ease = [0.4, 0, 0.2, 1] as const;

export function AboutHeroSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden min-h-[calc(100svh-73px)] md:min-h-0 bg-[#EFEFEF]"
    >
      <FloatingIcons />

      <div className="relative z-10 mx-auto max-w-2xl px-7 pt-16 pb-32 text-center sm:px-6 md:pt-32 md:pb-48">
        <motion.h1
          className="text-[27px] leading-[1.08] font-bold tracking-tight text-gray-900 sm:text-3xl md:text-[51px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          Building a Better Path for Early&#8209;Career Talent
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-76 text-sm leading-relaxed text-gray-600 sm:max-w-none sm:text-base md:mt-5 md:text-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          SkillSift helps early-career talents build in-demand skills, prove
          their capabilities through verified performance, and connect with
          opportunities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease }}
        >
          <Button
            className="mt-6 rounded-lg bg-primary-900 px-6 py-5 text-sm font-semibold text-white hover:bg-[#1B2935] md:mt-8"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute z-10 bottom-0 w-full pointer-events-none"
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
