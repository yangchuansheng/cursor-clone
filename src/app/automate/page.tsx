import type { Metadata } from "next";
import { CursorAutomatePage } from "@/components/sites/cursor/CursorAutomatePage";

export const metadata: Metadata = {
  title: "Cursor · Automations",
  description:
    "Delegate repetitive work to always-on agents. Set up Cursor Automations that run on schedules or event-based triggers to build, maintain, and fix software.",
};

export default function AutomatePage() {
  return <CursorAutomatePage />;
}
