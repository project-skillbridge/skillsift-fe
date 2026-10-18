import { Dispatch, SetStateAction } from "react";

import { NotificationTab } from "@/constants/notifications";
import { cn } from "@/lib/utils";

const NotificationTabButton = ({
  activeTab,
  tab,
  setTab,
  count,
}: {
  activeTab: NotificationTab;
  tab: NotificationTab;
  setTab: Dispatch<SetStateAction<NotificationTab>>;
  count?: number;
}) => {
  const isActive = tab === activeTab;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg px-4 text-sm transition-colors",
        isActive
          ? "bg-white font-semibold text-[#151515] shadow-sm"
          : "font-medium text-[#667085] hover:text-[#151515]",
      )}
      onClick={() => setTab(tab)}
    >
      {tab}
      {count ? (
        <span className="rounded-full bg-[#009f6a] px-1.5 text-xs leading-5 font-semibold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
};

export default NotificationTabButton;
