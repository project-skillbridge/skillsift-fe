"use client";

import { AccountRow } from "@/components/settings/account-row";
import { SettingsExportAccountDialog } from "@/components/settings/settings-export-account-dialog";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { EmployerChangePasswordDialog } from "./employer-change-password-dialog";
import { EmployerDeleteAccountDialog } from "./employer-delete-account-dialog";

export function EmployerAccount() {
  const { email } = useSessionUserProfile();

  return (
    <div className="flex flex-col gap-3">
      <AccountRow title="Email" description={email || "—"} action={null} />

      <AccountRow
        title="Password"
        description="**************"
        action={<EmployerChangePasswordDialog />}
      />

      <AccountRow
        title="Download personal data"
        description="Request a copy of your data for export. You will receive an email when your export is ready for download."
        action={<SettingsExportAccountDialog />}
      />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-sm font-semibold text-destructive">WARNING!</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <AccountRow
        title="Delete my account"
        description="This will permanently and irreversibly remove all your SkillSift data."
        action={<EmployerDeleteAccountDialog />}
      />
    </div>
  );
}
