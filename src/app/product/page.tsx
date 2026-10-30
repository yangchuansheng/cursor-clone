import type { Metadata } from "next";
import { CursorProductPage } from "@/components/sites/cursor/CursorProductPage";

export const metadata: Metadata = {
  title: "Cursor — Build Software with AI Agents",
  description:
    "Cursor is an AI coding agent that helps you build software faster. Delegate tasks across desktop, CLI, mobile, and cloud.",
};

export default function ProductPage() {
  return <CursorProductPage />;
}
