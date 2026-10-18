import {
  Bell,
  BriefcaseBusiness,
  ClipboardCheck,
  Eye,
  Star,
  type LucideIcon,
} from "lucide-react";

import { Notification } from "@/constants/notifications";
import { formatRelativeTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type NotificationItemProps = {
  notification: Notification;
  isRead?: boolean;
  onMarkRead?: () => void;
  /** Optional follow-up the parent runs after the item is clicked — typically
   *  a navigation. Item-level handler decides whether to mark-read first. */
  onActivate?: () => void;
};

function visualFor(type?: string): { Icon: LucideIcon; bg: string } {
  const t = type?.toLowerCase() ?? "";
  if (t.includes("assessment") || t.includes("skill"))
    return { Icon: ClipboardCheck, bg: "#D3E6DF" };
  if (t.includes("offer") || t.includes("interview") || t.includes("hire_"))
    return { Icon: BriefcaseBusiness, bg: "#CBB0EB" };
  if (t.includes("feedback")) return { Icon: Star, bg: "#F9E796" };
  if (t.includes("viewed")) return { Icon: Eye, bg: "#EDEEF2" };
  return { Icon: Bell, bg: "#EDEEF2" };
}

const NotificationItem = ({
  notification,
  isRead = false,
  onMarkRead,
  onActivate,
}: NotificationItemProps) => {
  const isInteractive = Boolean(onActivate) || (!isRead && onMarkRead);
  const { Icon, bg } = visualFor(notification.type);

  const handleActivate = () => {
    if (!isRead && onMarkRead) onMarkRead();
    onActivate?.();
  };

  return (
    <li
      onClick={() => {
        if (isInteractive) handleActivate();
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && isInteractive) {
          if (e.key === " ") e.preventDefault();
          handleActivate();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={
        isInteractive
          ? !isRead
            ? "Open notification and mark as read"
            : "Open notification"
          : undefined
      }
      className={cn(
        "relative flex items-start gap-4 rounded-xl border p-4 transition-colors md:p-5",
        isRead ? "border-[#E4E7EC] bg-white" : "border-[#D3E6DF] bg-[#F3F8F6]",
        isInteractive
          ? "cursor-pointer hover:border-[#B9D3C8]"
          : "cursor-default",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg text-[#151515]",
          isRead && "opacity-60",
        )}
        style={{ backgroundColor: bg }}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "text-sm leading-5 text-[#151515]",
              isRead ? "font-medium" : "font-semibold",
            )}
          >
            {notification.boldText || notification.normalText}
          </p>
          <span className="flex shrink-0 items-center gap-2 text-xs text-[#667085]">
            {formatRelativeTime(notification.time)}
            {!isRead && (
              <span
                className="size-2 rounded-full bg-[#009f6a]"
                aria-label="Unread"
              />
            )}
          </span>
        </div>
        {notification.boldText && notification.normalText ? (
          <p className="text-sm leading-5 text-[#475467]">
            {notification.normalText}
          </p>
        ) : null}
      </div>
    </li>
  );
};

export default NotificationItem;
