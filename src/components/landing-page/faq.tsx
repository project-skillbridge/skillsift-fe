"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqs } from "@/constants/landing-page";

const ease = [0.4, 0, 0.2, 1] as const;
const viewport = { once: true, margin: "-80px" } as const;

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 bg-[#EFF7FF] px-5 pb-16 pt-12 sm:px-8 sm:pb-28 sm:pt-20 md:pb-48 md:pt-24"
    >
      <div className="mx-auto w-full max-w-102.5 sm:max-w-160 md:max-w-3xl">
        <motion.h2
          className="whitespace-nowrap text-center text-[22px] font-bold leading-tight text-[#1F2629] min-[390px]:text-[24px] sm:text-[34px] md:text-[42px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          viewport={viewport}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className="mb-14 mt-5 text-center text-[17px] leading-snug text-[#1F2629] sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
          viewport={viewport}
        >
          Everything you need to know about SkillSift
        </motion.p>

        <motion.div
          className="space-y-3 rounded-xl bg-[#DFEDFD] px-4 pb-16 pt-4 sm:px-5 sm:pt-5 md:space-y-4 md:px-10 md:pb-20 md:pt-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease }}
          viewport={viewport}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-[#D7DFEA] bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex min-h-18.5 w-full cursor-pointer items-center justify-between gap-4 px-7 py-5 text-left text-[17px] font-medium leading-snug text-[#1F2629] sm:text-lg md:text-xl"
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="shrink-0 text-[#333333]"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="px-7 pb-8 text-[15px] leading-snug text-[#5A667A] sm:text-base md:text-lg">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-full">
        <svg
          className="h-auto w-full"
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
