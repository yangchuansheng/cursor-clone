import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Coding Agent for Building Ambitious Software | Cursor",
  description: "Cursor is your coding agent for building ambitious software.",
  icons: {
    icon: "/marketing-static/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      data-os="mac"
      data-device="default"
      data-theme="dark"
      className="Sj65MG_variable aDRXRq_variable -Zg_XW_variable _8qwdia_variable"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="bg-theme-bg text-theme-text min-h-screen pt-[var(--site-header-height)]">
        {children}
      </body>
    </html>
  );
}
