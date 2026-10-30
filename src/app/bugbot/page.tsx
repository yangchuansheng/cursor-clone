import type { Metadata } from "next";
import { CursorBugbotPage } from "@/components/sites/cursor/CursorBugbotPage";

export const metadata: Metadata = {
  title: "AI Code Review Built for Production | Bugbot by Cursor",
  description:
    "AI code review that catches real bugs. Bugbot detects the hardest logic bugs with a low false positive rate.",
};

export default function BugbotPage() {
  return <CursorBugbotPage />;
}
