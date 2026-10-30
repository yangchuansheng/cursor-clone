import type { Metadata } from "next";
import { CursorCliPage } from "@/components/sites/cursor/CursorCliPage";

export const metadata: Metadata = {
  title: "Cursor CLI — Run Agents in Terminal, GitHub Actions and Automations & Scripts",
  description: "Built to help you ship, right from your terminal. Same commands, any environment.",
};

export default function CliRoutePage() {
  return <CursorCliPage />;
}
