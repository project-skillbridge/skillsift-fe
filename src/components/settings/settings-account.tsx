"use client";

import { SettingsChangePasswordDialog } from "@/components/settings/settings-change-password-dialog";
import { SettingsDeleteAccountDialog } from "@/components/settings/settings-delete-account-dialog";
import { SettingsExportAccountDialog } from "@/components/settings/settings-export-account-dialog";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { AccountRow } from "./account-row";
import { ActiveSessionsCard } from "./active-sessions-card";

export function SettingsAccount() {
  const { email } = useSessionUserProfile();

  return (
    <div className="flex flex-col gap-3">
      {/* <AccountRow
        title="Email Address"
        description={email || "—"}
        action={
          <SettingsAccountActionLink
            icon={<HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />}
          >
            Change email
          </SettingsAccountActionLink>
        }
      /> */}

      <AccountRow
        title="Password"
        description="**************"
        action={<SettingsChangePasswordDialog />}
      />

      <ActiveSessionsCard />

      <AccountRow
        title="Download Personal Data"
        description="Request a copy of your data for export. You will receive an email when your export is ready for download"
        action={<SettingsExportAccountDialog />}
      />
      {/* <AccountRow
        title="Deactivate my account"
        description="Your account will be hidden but not deleted"
        action={
          <SettingsAccountActionLink>
            Deactivate my account
          </SettingsAccountActionLink>
        }
      /> */}

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-sm font-semibold text-destructive">WARNING!</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <AccountRow
        title="Delete my account"
        description="This will permanently and irreversibly remove all your SkillSift data."
        action={<SettingsDeleteAccountDialog email={email} />}
      />
    </div>
  );
}
