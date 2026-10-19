"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface HexagonScoreProps {
  value: number;
  color?: string;
}

function HexagonScore({ value, color = "#009F6A" }: HexagonScoreProps) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: 106, height: 110 }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="hexRounded" clipPathUnits="objectBoundingBox">
            <path
              d="
                                                                                          M 0.456,0.015
                                                                                                        C 0.484,0.0   0.516,0.0   0.544,0.015
                                                                                                                      L 0.956,0.224
                                                                                                                                    C 0.984,0.239  1.0,0.268   1.0,0.299
                                                                                                                                                  V 0.701
                                                                                                                                                                C 1.0,0.732   0.984,0.761  0.956,0.776
                                                                                                                                                                              L 0.544,0.985
                                                                                                                                                                                            C 0.516,1.0   0.484,1.0   0.456,0.985
                                                                                                                                                                                                          L 0.044,0.776
                                                                                                                                                                                                                        C 0.016,0.761  0.0,0.732   0.0,0.701
                                                                                                                                                                                                                                      V 0.299
                                                                                                                                                                                                                                                    C 0.0,0.268   0.016,0.239  0.044,0.224
                                                                                                                                                                                                                                                                  L 0.456,0.015 Z
                                                                                                                                                                                                                                                                              "
            />
          </clipPath>
        </defs>
      </svg>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#ffffffff",
          WebkitClipPath: "url(#hexRounded)",
          clipPath: "url(#hexRounded)",
          transform: "scale(1.08)",
        }}
      />
      {/* Fill layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          WebkitClipPath: "url(#hexRounded)",
          clipPath: "url(#hexRounded)",
        }}
      />
      <span className="relative text-[30px] font-bold text-white leading-none tracking-tight">
        {value}%
      </span>
    </div>
  );
}

interface JobReadyStatusCardProps {
  badge?: string;
  tier?: string;
  description?: string;
  score?: number;
}

export function JobReadyStatusCard({
  badge = "Validated",
  tier = "Job Ready Talent",
  description = "Your next attempt is coming up. Keep preparing while you wait. Use the resources below to strengthen your weak areas and come back stronger.",
  score = 85,
}: JobReadyStatusCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#D5E5F4] bg-[#EEF7FF]">
      {/* Main row */}
      <div className="flex items-start justify-between gap-6 p-6">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex">
            <div className="flex-1 space-y-2.5">
              <h2 className="text-lg font-semibold leading-snug text-foreground">
                {badge}{" "}
                <span className="text-muted-foreground font-normal">•</span>{" "}
                <strong className="font-bold">{tier}</strong>
              </h2>
              <p
                className={cn(
                  "body text-muted-foreground leading-relaxed",
                  "max-w-130",
                )}
              >
                {description}
              </p>
            </div>
            <HexagonScore value={score} />
          </div>
          <div
            className={cn(
              "flex justify-end border-t border-border bg-white px-6 py-3 rounded-2xl",
            )}
          >
            <Link
              href="/t/offers"
              className={cn(
                "flex items-center label shrink-0 text-foreground underline underline-offset-2",
                "hover:opacity-70 transition-opacity group",
              )}
            >
              See job offers
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
