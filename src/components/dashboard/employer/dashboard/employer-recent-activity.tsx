"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  DEFAULT_EMPLOYER_ACTIVITY_META,
  EMPLOYER_ACTIVITY_TYPE_META,
} from "@/constants/employer-dashboard";
import { formatRelativeTime } from "@/lib/format-date";
import type { EmployerRecentActivityItem } from "@/types/api/employer-dashboard";

type EmployerRecentActivityProps = {
  items: EmployerRecentActivityItem[];
};

function ActivityCard({ item }: { item: EmployerRecentActivityItem }) {
  const meta =
    EMPLOYER_ACTIVITY_TYPE_META[item.type] ?? DEFAULT_EMPLOYER_ACTIVITY_META;
  return (
    <Link
      href={meta.route}
      className="flex items-center gap-6 rounded-xl px-3 py-3.5 transition-colors hover:bg-[#F9FAFB]"
    >
      <div className="flex flex-1 items-center gap-4">
        <div
          className="flex size-6 shrink-0 items-center justify-center rounded-[3.43px]"
          style={{ backgroundColor: meta.iconBg }}
        >
          <Image src={meta.icon} alt="" width={17} height={17} />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-sans text-sm font-semibold text-[#0D2025]">
            {item.title}
          </p>
          {item.description ? (
            <p className="font-sans text-xs text-[#667085]">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
      <span className="shrink-0 font-sans text-xs text-[#667085]">
        {formatRelativeTime(item.occurredAt)}
      </span>
    </Link>
  );
}

export function EmployerRecentActivity({ items }: EmployerRecentActivityProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-lg font-semibold text-[#0D2025]">
          Recent activity
        </h2>
        <Link
          href="/e/notifications"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#475467] hover:text-[#0D2025]"
        >
          See all
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="flex flex-col divide-y divide-[#EEF0F3]">
        {items.map((item) => (
          <ActivityCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
