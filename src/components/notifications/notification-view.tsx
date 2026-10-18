"use client";
import { useRouter } from "next/navigation";
import { BellOff } from "lucide-react";
import { useState } from "react";
import { notificationTabs, NotificationTab } from "@/constants/notifications";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationItem from "./notification-item";
import NotificationTabButton from "./notification-tab-button";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/api";
import type {
  NotificationApiItem,
  NotificationRole,
} from "@/types/api/notifications";

type NotificationViewProps = {
  role: NotificationRole;
};

/** Pulls an offer id off the notification's freeform `data` bag. Backend
 *  hasn't committed to a key yet, so we read either `offerId` or `offer_id`
 *  defensively. */
function extractOfferId(data: NotificationApiItem["data"]): string | undefined {
  const candidate = data?.offerId ?? data?.offer_id;
  return typeof candidate === "string" && candidate.length > 0
    ? candidate
    : undefined;
}

/** Best-effort target route per notification. Returns null when there's
 *  nothing useful to navigate to — the item then falls back to just
 *  marking-read on click.
 *
 *  Today this only routes offer-related notifications; broader heuristics
 *  (by `type`) can be added once the backend documents the type vocabulary. */
function notificationHref(
  notification: NotificationApiItem,
  role: NotificationRole,
): string | null {
  const offerId = extractOfferId(notification.data);
  const looksOfferRelated =
    Boolean(offerId) ||
    notification.type?.toLowerCase().includes("offer") === true ||
    notification.type === "interview_invite_received";

  if (notification.type === "employer_viewed_profile") {
    // If we have an employerId or just route them to somewhere
    // For now no action for passive notifications
    return null;
  }

  // Employer-only: the backend decided outcome feedback is due for a past
  // hire. Route straight to the Offers Sent tab where "Rate this hire" lives.
  if (notification.type === "hire_feedback_requested") {
    return role === "employer" ? "/e/shortlist?tab=offers" : null;
  }

  // Skill results live on the talent dashboard (certificate) or the retake page.
  if (role === "talent" && notification.type === "skill_assessment_passed") {
    return "/t/dashboard";
  }
  if (role === "talent" && notification.type === "skill_assessment_failed") {
    return "/t/assessments/skill";
  }
  if (role === "talent" && notification.type === "skill_assessment_ready") {
    return "/t/assessments/skill";
  }
  if (
    role === "talent" &&
    notification.type === "advanced_assessment_score_ready"
  ) {
    return "/t/dashboard";
  }

  // Job-ready talent matching an open role (or the weekly digest).
  if (role === "employer" && notification.type === "new_matching_talent") {
    const link = notification.data?.link as
      { entity_id?: string | null; entity_type?: string } | undefined;
    return link?.entity_type === "candidate" && link.entity_id
      ? `/e/talents/${encodeURIComponent(link.entity_id)}`
      : "/e/talents";
  }

  if (role === "employer" && notification.type?.includes("assessment")) {
    const assessmentId = notification.data?.assessmentId;
    return typeof assessmentId === "string" && assessmentId
      ? `/e/assessments/${encodeURIComponent(assessmentId)}`
      : "/e/assessments";
  }

  if (!looksOfferRelated) return null;

  if (role === "talent") {
    // Encode defensively — `offerId` is read from a freeform notification
    // payload, so an unexpected value shouldn't reshape the route.
    return offerId ? `/t/offers/${encodeURIComponent(offerId)}` : "/t/offers";
  }
  // Employer side has no per-offer detail page yet — drop into the offers
  // tab of /e/shortlist so the user can still find what changed.
  return "/e/shortlist";
}

function groupLabel(iso: string): string {
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  if (days < 1) return "Today";
  if (days < 7) return "This week";
  return "Earlier";
}

const NotificationView = ({ role }: NotificationViewProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useNotifications(role);
  const { data: unreadData } = useUnreadCount(role);
  const { mutate: markAsRead } = useMarkAsRead(role);
  const { mutate: markAllAsRead } = useMarkAllAsRead(role);

  const notifications = notificationsData?.items ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const filtered =
    activeTab === "Unread"
      ? notifications.filter((n) => !n.isRead)
      : activeTab === "Read"
        ? notifications.filter((n) => n.isRead)
        : notifications;

  const emptyMessage =
    activeTab === "Unread"
      ? "You're all caught up — no unread notifications."
      : activeTab === "Read"
        ? "No read notifications yet."
        : "No notifications yet.";

  const groups = ["Today", "This week", "Earlier"]
    .map((label) => ({
      label,
      items: filtered.filter((n) => groupLabel(n.createdAt) === label),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="flex w-fit gap-1 rounded-xl bg-[#F2F2F2] p-1"
        >
          {notificationTabs.map((tab) => (
            <NotificationTabButton
              key={tab}
              tab={tab}
              activeTab={activeTab}
              setTab={setActiveTab}
              count={tab === "Unread" ? unreadCount : undefined}
            />
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-sm font-semibold text-[#151515] underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col gap-y-2 rounded-xl border border-[#E4E7EC] bg-white p-6">
          <p className="body text-destructive">
            Couldn&apos;t load notifications. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="body w-fit text-muted-foreground underline"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[#EDEEF2] text-[#151515]">
            <BellOff className="size-6" aria-hidden />
          </span>
          <p className="text-sm text-[#475467]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold tracking-wide text-[#667085] uppercase">
                {group.label}
              </h2>
              <ul className="flex flex-col gap-3">
                {group.items.map((notification) => {
                  const href = notificationHref(notification, role);
                  return (
                    <NotificationItem
                      key={notification.id}
                      notification={{
                        boldText: notification.title,
                        normalText: notification.body,
                        time: notification.createdAt,
                        type: notification.type,
                      }}
                      isRead={notification.isRead}
                      onMarkRead={() => markAsRead(notification.id)}
                      onActivate={href ? () => router.push(href) : undefined}
                    />
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationView;
