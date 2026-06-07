"use client";

import { Users } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function DriversPage() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Drivers Directory"
      description="Manage assigned drivers, view their contact information, trip history, and which EVs are assigned to them. Track driver behavior, certifications, and shift assignments."
      features={[
        "Driver profiles with contact info and license details",
        "Assigned EV pairings with quick reassign",
        "Trip history with route playback",
        "Behavior scores: harsh braking, acceleration, idling",
        "Shift schedules and availability calendar",
        "Certifications and training records",
      ]}
    />
  );
}
