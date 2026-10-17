"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ResourceSection } from "@/types/resources";
import ResourceArticleCard from "./resource-article-card";
import ResourceVideoCard from "./resource-video-card";

const PAGE_SIZE = 3;

const ResourcesSection = (section: ResourceSection) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const maxIndex = Math.max(0, section.items.length - PAGE_SIZE);

  const goNext = () => {
    setDirection(1);
    setPage((p) => Math.min(maxIndex, p + 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setPage((p) => Math.max(0, p - 1));
  };

  return (
    <div id={section.id} className="flex scroll-mt-24 flex-col gap-y-6">
      <div className="flex flex-row justify-between items-center">
        <h2 className="section-h4 font-semibold text-foreground">
          {section.title}
        </h2>
        <div className="flex flex-row gap-x-2">
          <button
            aria-label="Previous"
            disabled={page === 0}
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft
              size={24}
              className="text-foreground"
              strokeWidth={1.5}
            />
          </button>
          <button
            aria-label="Next"
            disabled={page >= maxIndex}
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight
              size={24}
              className="text-foreground"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {section.type === "article"
              ? section.items
                  .slice(page, page + PAGE_SIZE)
                  .map((item) => (
                    <ResourceArticleCard key={item.url} {...item} />
                  ))
              : section.items
                  .slice(page, page + PAGE_SIZE)
                  .map((item) => (
                    <ResourceVideoCard key={item.url} {...item} />
                  ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcesSection;
