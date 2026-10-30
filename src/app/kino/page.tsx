import type { Metadata } from "next";
import "../../../docs/research/kino/kino-exact.css";
import { KinoLanding } from "@/components/sites/kino/kino-landing";

export const metadata: Metadata = {
  title: "Kino — AI video editor for teams and agents",
  description:
    "Store, search and edit your footage with AI. Collaborate with your team and agents on a shared timeline, then collect review notes in one place.",
};

export default function KinoPage() {
  return <KinoLanding />;
}
