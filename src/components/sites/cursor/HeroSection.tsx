"use client";

import React, { useMemo, useState } from "react";
import { CursorCliWindow } from "./CursorCliWindow";
import { CursorIdeWindow } from "./CursorIdeWindow";
import { DemoWindowStage } from "./DemoWindowStage";

export function HeroSection() {
  const [userInteracted, setUserInteracted] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const windows = useMemo(
    () => [
      {
        id: "cursor-ide",
        title: "Cursor Desktop",
        xPercent: 50,
        yPercent: 50,
        widthPx: 1080,
        heightPx: 620,
        zIndex: 10,
        ctaHref: "/download",
        ctaLabel: "Get Cursor",
        showSettingsButton: true,
        content: (
          <CursorIdeWindow
            key={`ide-${resetCount}`}
            initialScenario="websiteBuilder"
            showAgentsSidebar
            autoCycle={!userInteracted}
            onUserInteract={() => setUserInteracted(true)}
          />
        ),
      },
      {
        id: "cursor-agent-cli",
        title: "Cursor CLI",
        xPercent: 78.78,
        yPercent: 70.56,
        widthPx: 480,
        heightPx: 360,
        zIndex: 15,
        ctaHref: "/download",
        ctaLabel: "Get CLI",
        content: <CursorCliWindow key={`cli-${resetCount}`} />,
      },
    ],
    [userInteracted, resetCount]
  );

  return (
    <section className="section bg-theme-bg text-theme-text">
      <div className="container">
        <div className="text-left mb-v2.5 max-w-prose">
          <h1 className="type-md-lg text-balance mb-v1">
            Cursor is your coding agent for building ambitious software.
          </h1>
          <div className="flex justify-start gap-x-g1 items-center">
            <div>
              <div className="hidden items-center md:flex">
                <a
                  className="btn"
                  href="https://api2.cursor.sh/updates/download/golden/darwin-arm64/cursor/3.27"
                >
                  Download for macOS
                  <div aria-hidden="true" className="btn-icon">
                    <span className="icon-glyph-08" aria-hidden="true">
                      ⤓
                    </span>
                  </div>
                </a>
              </div>
              <div className="flex items-center md:hidden">
                <a className="btn" href="/login">
                  Get started
                  <div aria-hidden="true" className="btn-icon">
                    <span aria-hidden="true">→</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <a
                className="btn btn--secondary"
                href="/contact-sales?source=hero_request_demo"
              >
                Request a demo
                <div aria-hidden="true" className="btn-icon">
                  <span aria-hidden="true">→</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
            <div className="relative z-1 col-span-full row-span-full overflow-hidden">
              <img
                alt=""
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover wallpaper-brightness-dark"
                sizes="100vw"
                src="/sites/cursor/blob/assets/misc/asset-cc24ca462279ca23250c.jpg"
              />
            </div>
            <div className="z-20 col-span-full row-span-full h-full min-h-0">
              <div
                className="relative"
                onPointerDownCapture={() => {
                  if (!userInteracted) setUserInteracted(true);
                }}
              >
                <DemoWindowStage
                  windows={windows}
                  height="min(780px, 70vh)"
                  minHeight={720}
                  innerPaddingPx={32}
                  allowMobileInteractions
                  externalLayoutAdjusted={userInteracted}
                  onInteract={() => setUserInteracted(true)}
                  onReset={() => {
                    setUserInteracted(false);
                    setResetCount((c) => c + 1);
                  }}
                  srDescription="This element contains an interactive demo for sighted users showing multiple Cursor interfaces: Cursor Desktop interface, Cursor CLI interface. The interface is displayed over a subtle, solid brand background."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
