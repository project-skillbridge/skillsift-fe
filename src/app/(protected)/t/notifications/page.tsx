import NotificationsPage from "@/components/notifications/notifications-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "SkillSift notifications webpage",
};

const Page = () => {
  return <NotificationsPage role="talent" settingsHref="/t/settings" />;
};

export default Page;
