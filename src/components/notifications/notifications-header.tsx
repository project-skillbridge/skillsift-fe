import Link from "next/link";
import { Settings } from "lucide-react";

type NotificationsHeaderProps = {
  settingsHref: string;
};

const NotificationsHeader = ({ settingsHref }: NotificationsHeaderProps) => {
  return (
    <div className="flex flex-row items-start justify-between gap-4 rounded-2xl bg-[#dfe4e2] px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#151515]">
          Notifications
        </h1>
        <p className="text-sm text-[#3d3d3d] md:text-base">
          Everything that needs your attention, newest first.
        </p>
      </div>
      <Link
        href={settingsHref}
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-[#151515] transition-colors hover:bg-white/70"
      >
        <Settings className="size-4" aria-hidden />
        Settings
      </Link>
    </div>
  );
};

export default NotificationsHeader;
