import NotificationView from "@/components/notifications/notification-view";
import NotificationsHeader from "@/components/notifications/notifications-header";
import type { NotificationRole } from "@/types/api/notifications";

type NotificationsPageProps = {
  role: NotificationRole;
  settingsHref: string;
};

const NotificationsPage = ({ role, settingsHref }: NotificationsPageProps) => {
  return (
    <div className="mx-auto my-8 flex w-full max-w-4xl flex-col gap-y-6 px-4 sm:px-6 md:my-9 lg:px-8 2xl:px-0">
      <NotificationsHeader settingsHref={settingsHref} />
      <NotificationView role={role} />
    </div>
  );
};

export default NotificationsPage;
