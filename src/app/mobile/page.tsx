import type { Metadata } from "next";
import { CursorMobilePage } from "@/components/sites/cursor/CursorMobilePage";

export const metadata: Metadata = {
  title: "Cursor · Mobile",
  description:
    "Build from anywhere via the Cursor mobile app on iOS. Launch agents when ideas strike, get notified when work is ready for review, and merge PRs on the go.",
};

export default function MobilePage() {
  return <CursorMobilePage />;
}
