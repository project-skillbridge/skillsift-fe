"use client";

import { motion } from "motion/react";
import { CheckIcon } from "lucide-react";
import { missionBullets } from "@/constants/about-page";

const ease = [0.4, 0, 0.2, 1] as const;
const viewport = { once: true, margin: "-60px" } as const;

export function AboutMissionSection() {
  return (
    <section className="bg-[#05060F]">
      <div className="mx-auto max-w-6xl px-6 pt-4 pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={viewport}
          >
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              Why Early&#8209;Career Professionals Trust SkillSift With Their
              Growth
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-white/70 md:text-base">
              We&apos;re building a long-term platform focused on helping
              ambitious talent grow with clarity.
            </p>
          </motion.div>

          {/* Right — checklist */}
          <motion.ul
            className="space-y-6"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            viewport={viewport}
          >
            {missionBullets.map((text, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease }}
                viewport={viewport}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6B21A8]">
                  <CheckIcon
                    className="h-3.5 w-3.5 text-white"
                    strokeWidth={3}
                  />
                </span>
                <span className="text-[15px] leading-relaxed text-white/85 md:text-base">
                  {text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
