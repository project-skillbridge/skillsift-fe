"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

const PRACTICE_SLIDE: Slide = {
  id: "practice",
  title: "Practice before you test",
  body: "Ten questions at your level, with an explanation for each. They don't use up an attempt and don't change your result.",
  cta: "Start practice",
  href: "/t/assessments/practice",
};

const RESOURCE_SLIDES: Slide[] = [
  {
    id: "interviews",
    title: "Get ready for interviews",
    body: "How the process works, how to answer behavioural questions, and how to negotiate an offer.",
    cta: "Read the guides",
    href: "/t/resources#career-interviews",
  },
  {
    id: "teamwork",
    title: "See how teams work together",
    body: "How code review, pull requests and healthy teams work day to day.",
    cta: "Explore teamwork",
    href: "/t/resources#career-teamwork",
  },
  {
    id: "growth",
    title: "Grow beyond the job hunt",
    body: "Ask better questions, write clearly and talk about pay with confidence.",
    cta: "Keep learning",
    href: "/t/resources#career-growth",
  },
];

const ROTATE_MS = 7000;

/**
 * Rotating prompts under the skill result: practice (while it's useful) then
 * career reading. Slides cross-fade; rotation pauses on hover or focus and
 * stays off for people who prefer reduced motion.
 */
export function TalentCarousel({ showPractice }: { showPractice: boolean }) {
  const slides = showPractice
    ? [PRACTICE_SLIDE, ...RESOURCE_SLIDES]
    : RESOURCE_SLIDES;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const current = Math.min(active, slides.length - 1);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Tips and resources"
      className="rounded-2xl border border-[#D5E5F4] bg-[#EEF7FF] p-6 text-[#1B2935]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== current}
            className={cn(
              "col-start-1 row-start-1 flex flex-col transition-opacity duration-700 motion-reduce:transition-none",
              i === current ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <h2 className="text-[18px] font-bold tracking-tight">
              {slide.title}
            </h2>
            <p className="body-3 mt-1 text-[#1B2935]/75">{slide.body}</p>
            <Link
              href={slide.href}
              tabIndex={i === current ? 0 : -1}
              className="group mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1B2935] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            >
              {slide.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2" role="tablist" aria-label="Choose a tip">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={slide.title}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === current ? "w-6 bg-[#1B2935]" : "w-1.5 bg-[#CCB0EB]",
            )}
          />
        ))}
      </div>
    </section>
  );
}
