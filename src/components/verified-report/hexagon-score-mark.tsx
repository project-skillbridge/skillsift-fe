import { cn } from "@/lib/utils";

type HexagonScoreMarkProps = {
  value: number;
  tierLabel?: string;
  /** Overall footprint of the hexagon, in pixels. Defaults suit a hero
   *  placement; pass a smaller value for inline/table use. */
  size?: number;
  className?: string;
};

/** SkillSift's one recurring verification mark: a hexagon carrying the
 *  score percentage. Single source of truth for the shape/color so it
 *  doesn't keep drifting per call site (previously duplicated with
 *  different colors/stroke widths in the score badge and the verified
 *  report summary). */
export function HexagonScoreMark({
  value,
  tierLabel,
  size = 106,
  className,
}: HexagonScoreMarkProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <polygon
            points="50,4 93,27 93,73 50,96 7,73 7,27"
            fill="var(--color-verified)"
            stroke="var(--color-verified)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="relative font-bold text-white"
          style={{ fontSize: size * 0.28 }}
        >
          {clamped}%
        </span>
      </div>
      {tierLabel ? (
        <p
          className="font-semibold text-verified-strong"
          style={{ fontSize: size * 0.17 }}
        >
          {tierLabel}
        </p>
      ) : null}
    </div>
  );
}
