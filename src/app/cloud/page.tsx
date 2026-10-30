import type { Metadata } from "next";
import { CursorCloudPage } from "@/components/sites/cursor/CursorCloudPage";

export const metadata: Metadata = {
  title: "Cursor · Cloud Agents",
  description:
    "Run Cursor from your browser or phone. Cloud agents control their own computers to build ambitious software.",
};

export default function CloudPage() {
  return <CursorCloudPage />;
}
