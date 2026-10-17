import Image from "next/image";

import {
  getQualitativeLevel,
  qualitativeStepCount,
} from "./verified-report-utils";

type Props = {
  title: string;
  value: number;
  insight?: string;
  levelLabel?: string;
};

const ProfessionalSkillCard = ({
  title,
  value,
  insight,
  levelLabel,
}: Props) => {
  const clamped = Math.max(0, Math.min(100, value));
  const label = levelLabel ?? getQualitativeLevel(clamped);
  const steps = qualitativeStepCount(label, clamped);

  return (
    <div className="border border-[#DBDBDB] rounded-lg bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-lg">{title}</p>
        <span className="bg-verified/10 text-verified-strong rounded-full px-2.5 py-0.5 text-sm font-bold">
          {label}
        </span>
      </div>

      <div
        className="mt-3 flex gap-1.5"
        role="img"
        aria-label={`${label}: ${steps} of 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < steps ? "bg-verified" : "bg-[#E5E7EB]"}`}
          />
        ))}
      </div>

      <div className="mt-3 gap-x-4 flex flex-row py-2 px-4 rounded-lg bg-[#ECFDF5]">
        <Image
          src={"/assets/icons/stars-sparkle.svg"}
          height={24}
          width={24}
          alt="Sparkle icon"
        />
        <p className="text-[#535862] text-sm">
          {insight ?? "No insight available for this area yet."}
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSkillCard;
