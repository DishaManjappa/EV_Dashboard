"use client";

import { Settings } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      title="Workspace Settings"
      description="Configure your admin account, notification preferences, automated status rules, and team access permissions for your fleet operations team."
      features={[
        "Account profile and security",
        "Notification channels: email, SMS, push, Slack",
        "Status rule engine (e.g. alert when battery < 20%)",
        "Team & role-based access control",
        "API keys and webhook integrations",
        "Audit log and activity history",
      ]}
    />
  );
}
