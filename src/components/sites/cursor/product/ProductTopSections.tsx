"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CursorCliWindow } from "../CursorCliWindow";
import { CursorIdeWindow } from "../CursorIdeWindow";
import { DemoWindowStage } from "../DemoWindowStage";

type SubagentStatus = "pending" | "running" | "completed";

interface SubagentItem {
  title: string;
  task: string;
  model: string;
  status: SubagentStatus;
}

const SUBAGENT_PHASES: Array<{
  header: string;
  items: SubagentItem[];
}> = [
  {
    header: "Started 4 subagents",
    items: [
      {
        title: "Set up model architecture",
        task: "Editing files",
        model: "Opus-5.5",
        status: "running",
      },
      {
        title: "Mission Control Interface",
        task: "Building dashboard",
        model: "Grok 4.7",
        status: "running",
      },
      {
        title: "Add evaluation metrics",
        task: "Writing tests",
        model: "GPT-5.6 Sol",
        status: "running",
      },
      {
        title: "Implement training loop with AMP",
        task: "Pending",
        model: "Gemini 3.1 Pro",
        status: "pending",
      },
    ],
  },
  {
    header: "Running 4 subagents",
    items: [
      {
        title: "Set up model architecture",
        task: "Completed",
        model: "Opus-5.5",
        status: "completed",
      },
      {
        title: "Mission Control Interface",
        task: "Building dashboard",
        model: "Grok 4.7",
        status: "running",
      },
      {
        title: "Add evaluation metrics",
        task: "Completed",
        model: "GPT-5.6 Sol",
        status: "completed",
      },
      {
        title: "Implement training loop with AMP",
        task: "Optimizing gradients",
        model: "Gemini 3.1 Pro",
        status: "running",
      },
    ],
  },
  {
    header: "Completed 4 subagents",
    items: [
      {
        title: "Set up model architecture",
        task: "Completed",
        model: "Opus-5.5",
        status: "completed",
      },
      {
        title: "Mission Control Interface",
        task: "Completed",
        model: "Grok 4.7",
        status: "completed",
      },
      {
        title: "Add evaluation metrics",
        task: "Completed",
        model: "GPT-5.6 Sol",
        status: "completed",
      },
      {
        title: "Implement training loop with AMP",
        task: "Completed",
        model: "Gemini 3.1 Pro",
        status: "completed",
      },
    ],
  },
];

const SEARCH_TOOL_CALLS: Array<{ verb: string; target: string }> = [
  { verb: "Searched", target: "payment retry logic" },
  { verb: "Read", target: "checkout/PaymentService.ts" },
  { verb: "Read", target: "lib/stripe/webhooks.ts" },
  { verb: "Read", target: "db/transactions.ts" },
  { verb: "Grepped", target: "handleFailedPayment" },
];

const SPINNER_MASK_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='black'%3E%3Cpath d='M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm33.25,62.75a12,12,0,0,0,8.49-3.52L204.37,68.6a12,12,0,0,0-17-17L164.77,74.26a12,12,0,0,0,8.48,20.49ZM224,116H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z'/%3E%3C/svg%3E") center center / contain no-repeat`;

function SubagentStatusIcon({ status }: { status: SubagentStatus }) {
  if (status === "pending") {
    return (
      <div className="flex h-5 w-5 items-center justify-center">
        <div
          className="rounded-full border-[1.5px] border-theme-border-02"
          style={{ width: "15px", height: "15px" }}
        />
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex h-5 w-5 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="text-theme-product-ansi-green"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-5 w-5 items-center justify-center">
      <div className="relative h-[18px] w-[18px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="absolute inset-0 text-theme-text-sec opacity-30"
        >
          <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" />
        </svg>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            mask: SPINNER_MASK_URL,
            WebkitMask: SPINNER_MASK_URL,
          }}
        >
          <div
            className="absolute animate-spin"
            style={{
              width: "200%",
              height: "200%",
              top: "-50%",
              left: "-50%",
              animationDuration: "1s",
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 50%, var(--color-theme-text-sec) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProductTopSections() {
  const [userInteracted, setUserInteracted] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [mobileTab, setMobileTab] = useState<"agent" | "dashboard">("agent");
  const [cliPulseStep, setCliPulseStep] = useState(0);
  const [subagentPhaseIdx, setSubagentPhaseIdx] = useState(0);
  const [activeSearchStep, setActiveSearchStep] = useState(0);

  useEffect(() => {
    const cliTimer = window.setInterval(() => {
      setCliPulseStep((prev) => (prev + 1) % 4);
    }, 1200);
    const subagentTimer = window.setInterval(() => {
      setSubagentPhaseIdx((prev) => (prev + 1) % SUBAGENT_PHASES.length);
    }, 2800);
    const searchTimer = window.setInterval(() => {
      setActiveSearchStep((prev) => (prev + 1) % (SEARCH_TOOL_CALLS.length + 1));
    }, 1100);

    return () => {
      window.clearInterval(cliTimer);
      window.clearInterval(subagentTimer);
      window.clearInterval(searchTimer);
    };
  }, []);

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
            initialScenario="productPlanning"
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

  const currentSubagentPhase = SUBAGENT_PHASES[subagentPhaseIdx];

  return (
    <>
      {/* Section 0 — Hero */}
      <section className="section bg-theme-bg text-theme-text">
        <div className="container">
          <div className="text-left mb-v2.5 max-w-prose-medium-wide">
            <h1 className="type-lg text-balance">Turn ideas into code</h1>
            <div className="flex justify-start mb-v1">
              <div className="type-lg text-theme-text-sec stack text-balance">
                Delegate implementation to focus on higher-level direction.
              </div>
            </div>
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
                <a href="/agents" className="btn">
                  Try mobile agent
                  <div aria-hidden="true" className="btn-icon">
                    <span aria-hidden="true">→</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
              <div className="z-20 col-span-full row-span-full h-full min-h-0">
                <div
                  className="relative w-full overflow-hidden rounded-xs"
                  onPointerDownCapture={() => {
                    if (!userInteracted) setUserInteracted(true);
                  }}
                >
                  <div
                    className="media-light absolute inset-0"
                    style={{ backgroundColor: "rgb(207, 206, 188)" }}
                  />
                  <div
                    className="media-dark absolute inset-0"
                    style={{ backgroundColor: "rgb(74, 68, 59)" }}
                  />
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

      {/* Section 1 — #surfaces */}
      <section className="section" id="surfaces">
        <div className="container">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">Everywhere you work</h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                One agent across every surface.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="container my-v2">
            <div className="grid gap-g1 grid-cols-1 xl:grid-cols-4 items-stretch mb-g1">
              {/* Card 0: Desktop */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Desktop</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Manual to agentic coding, in one familiar editor.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a className="btn-tertiary" href="/download">
                        Download →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#747066",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(217, 213, 207)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(116, 112, 102)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                          style={
                            {
                              height: "378px",
                              "--demo-pad": "24px",
                            } as React.CSSProperties
                          }
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full">
                            <div className="sr-only" aria-live="polite">
                              Interactive demo with multiple windows showing
                              Cursor&apos;s AI-powered features. The interface is
                              displayed over a subtle, solid brand background.
                            </div>
                            <div
                              aria-hidden="true"
                              id="demo-window-agent-ide"
                              className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                              style={{
                                left: "clamp(calc(var(--demo-pad) + 230px), 91.36690647482014%, calc(100% - var(--demo-pad) - 230px))",
                                top: "clamp(calc(var(--demo-pad) + 165px), 50%, calc(100% - var(--demo-pad) - 165px))",
                                width: "460px",
                                minWidth: "420px",
                                height: "330px",
                                maxHeight: "calc(100% - 2 * var(--demo-pad))",
                                minHeight: "260px",
                                transform: "translate(-50%, -50%) scale(1)",
                                transformOrigin: "center center",
                                zIndex: 10,
                                boxShadow:
                                  "0 0 0 1px var(--color-theme-border-02)",
                              }}
                            >
                              <div className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-default">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                </div>
                                <div className="-mr-1 flex items-center" />
                              </div>
                              <div
                                className="min-h-0 w-full flex-1 overflow-hidden pointer-events-none"
                                data-demo-desktop-content="true"
                              >
                                <div className="h-full min-h-0 w-full">
                                  <div className="bg-theme-product-chrome relative flex h-full w-full flex-col overflow-hidden">
                                    <div className="flex h-full w-full flex-col overflow-hidden p-3">
                                      <div className="space-y-2">
                                        <div className="bg-theme-product-editor border-theme-border-02 text-theme-text type-product-lg rounded-lg border px-2 py-1.5">
                                          let&apos;s add a spotlight-style search
                                        </div>
                                        <div className="space-y-1.5 pl-2">
                                          <div className="type-product-lg text-theme-text-sec leading-snug">
                                            <span className="flex-shrink-0">
                                              Read
                                            </span>{" "}
                                            <span className="opacity-60">
                                              App.tsx, Menu.tsx
                                            </span>
                                          </div>
                                          <div className="type-product-lg text-theme-text-sec leading-snug">
                                            <span className="flex-shrink-0">
                                              Searched
                                            </span>{" "}
                                            <span className="opacity-60">
                                              ⌘K shortcut handlers
                                            </span>
                                          </div>
                                          <div className="type-product-lg text-theme-text-sec leading-snug">
                                            <span className="flex-shrink-0">
                                              Edited
                                            </span>{" "}
                                            <span className="opacity-60">
                                              Search.tsx
                                            </span>
                                          </div>
                                          <div className="type-product-lg text-theme-text leading-snug pt-0.5">
                                            Done. Press ⌘K to search files,
                                            actions, and settings.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3">
                                      <div className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg">
                                        <div
                                          className="text-theme-text-ter type-product-lg w-full bg-transparent px-3 pt-2.5 pb-2 opacity-50"
                                          style={{ lineHeight: 1.8 }}
                                        >
                                          Ask Cursor to plan or build anything
                                        </div>
                                        <div className="px-2 py-2 pt-1">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <button
                                                type="button"
                                                className="bg-theme-card-03-hex type-product-sm text-theme-text-sec flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75"
                                              >
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24.7969 11.3555"
                                                  fill="currentColor"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="opacity-60"
                                                >
                                                  <path d="M0 5.67188C0 9.11719 2.13281 11.3438 5.30859 11.3438C6.98438 11.3438 8.41406 10.6406 9.9375 9.17578L12.2227 6.96094L14.5078 9.17578C16.0312 10.6406 17.4609 11.3438 19.1367 11.3438C22.3125 11.3438 24.4453 9.11719 24.4453 5.67188C24.4453 2.22656 22.3125 0 19.1367 0C17.4609 0 16.0312 0.703125 14.5078 2.16797L12.2227 4.38281L9.9375 2.16797C8.41406 0.703125 6.98438 0 5.30859 0C2.13281 0 0 2.22656 0 5.67188ZM1.91016 5.67188C1.91016 3.36328 3.28125 1.91016 5.30859 1.91016C6.44531 1.91016 7.45312 2.44922 8.60156 3.52734L10.8867 5.67188L8.60156 7.81641C7.45312 8.89453 6.44531 9.43359 5.30859 9.43359C3.28125 9.43359 1.91016 7.98047 1.91016 5.67188ZM13.5586 5.67188L15.8438 3.52734C16.9922 2.44922 18 1.91016 19.1367 1.91016C21.1641 1.91016 22.5352 3.36328 22.5352 5.67188C22.5352 7.98047 21.1641 9.43359 19.1367 9.43359C18 9.43359 16.9922 8.89453 15.8438 7.81641Z" />
                                                </svg>
                                                <span>Agent</span>
                                                <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 14 14"
                                                  fill="currentColor"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-3 w-3 opacity-60"
                                                >
                                                  <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                                </svg>
                                              </button>
                                              <button
                                                type="button"
                                                className="text-theme-text-sec type-product-sm flex cursor-pointer items-center gap-0.5 rounded-md bg-transparent py-0.75"
                                              >
                                                <span>Grok 4.7</span>
                                                <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 14 14"
                                                  fill="currentColor"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-3 w-3 opacity-60"
                                                >
                                                  <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                                </svg>
                                              </button>
                                            </div>
                                            <button
                                              type="button"
                                              aria-label="Send message"
                                              className="bg-theme-button-bg text-theme-button-text flex h-5 w-5 items-center justify-center rounded-full"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                fill="currentColor"
                                                viewBox="0 0 256 256"
                                              >
                                                <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-0 z-20" />
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 1: CLI */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>CLI</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Run agents in any terminal, script, or editor.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/cli/overview" className="btn-tertiary">
                        Install →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#747066",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(217, 213, 207)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(116, 112, 102)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                          style={
                            {
                              height: "378px",
                              "--demo-pad": "24px",
                            } as React.CSSProperties
                          }
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full">
                            <div className="sr-only" aria-live="polite">
                              Interactive demo with multiple windows showing
                              Cursor&apos;s AI-powered features. The interface is
                              displayed over a subtle, solid brand background.
                            </div>
                            <div
                              aria-hidden="true"
                              id="demo-window-agent-cli"
                              className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                              style={{
                                left: "clamp(calc(var(--demo-pad) + 230px), 91.36690647482014%, calc(100% - var(--demo-pad) - 230px))",
                                top: "clamp(calc(var(--demo-pad) + 165px), 50%, calc(100% - var(--demo-pad) - 165px))",
                                width: "460px",
                                minWidth: "420px",
                                height: "330px",
                                maxHeight: "calc(100% - 2 * var(--demo-pad))",
                                minHeight: "260px",
                                transform: "translate(-50%, -50%) scale(1)",
                                transformOrigin: "center center",
                                zIndex: 10,
                                boxShadow:
                                  "0 0 0 1px var(--color-theme-border-02)",
                              }}
                            >
                              <div className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-default">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                </div>
                                <div className="-mr-1 flex items-center" />
                              </div>
                              <div
                                className="min-h-0 w-full flex-1 overflow-hidden pointer-events-none"
                                data-demo-desktop-content="true"
                              >
                                <div className="h-full min-h-0 w-full overflow-hidden">
                                  <div
                                    className="bg-theme-product-editor text-theme-text flex h-full min-h-0 w-full flex-col"
                                    style={{ fontSize: "13px" }}
                                  >
                                    <div
                                      className="min-h-0 flex-1 px-4 pt-0 pb-2 overflow-y-hidden"
                                      style={{
                                        scrollbarGutter: "auto",
                                        paddingTop: "1em",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      <div className="type-product-base-mono flex min-h-full flex-col justify-end">
                                        <div className="text-theme-text">
                                          Cursor Agent
                                        </div>
                                        <div className="text-theme-text-sec mb-2">
                                          ~/cursor/cursor-web
                                        </div>
                                        <div className="text-theme-text mb-2">
                                          Bioinformatics Tools
                                        </div>
                                        <div className="border-theme-border-02 bg-theme-bg-muted text-theme-text mb-4 border px-3 py-2">
                                          Add affine gap alignment. We only have
                                          basic NW alignment but I need
                                          Gotoh&apos;s algorithm for better
                                          handling of indels. Also fix the FASTA
                                          parser.
                                        </div>
                                        <div className="space-y-2">
                                          <div className="leading-relaxed">
                                            <div className="flex items-start gap-2">
                                              <span
                                                className={
                                                  cliPulseStep === 0
                                                    ? "text-theme-product-ansi-green animate-pulse"
                                                    : "text-theme-text"
                                                }
                                              >
                                                {cliPulseStep === 0 ? "⬡" : "⬢"}
                                              </span>
                                              <div className="text-theme-text min-w-0 flex-1">
                                                <div className="truncate whitespace-nowrap">
                                                  <span className="opacity-90">
                                                    Thought
                                                  </span>
                                                  <span className="opacity-60">
                                                    {" "}
                                                    5s
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="flex items-start gap-2">
                                              <span
                                                className={
                                                  cliPulseStep === 1
                                                    ? "text-theme-product-ansi-green animate-pulse"
                                                    : "text-theme-text"
                                                }
                                              >
                                                {cliPulseStep === 1 ? "⬡" : "⬢"}
                                              </span>
                                              <div className="text-theme-text min-w-0 flex-1">
                                                <div className="truncate whitespace-nowrap">
                                                  <span className="opacity-90">
                                                    Read
                                                  </span>
                                                  <span className="opacity-60">
                                                    {" "}
                                                    bio/sequence_alignment.py,
                                                    bio/fasta.py,
                                                    bio/translate.py
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="flex items-start gap-2">
                                              <span
                                                className={
                                                  cliPulseStep === 2
                                                    ? "text-theme-product-ansi-green animate-pulse"
                                                    : "text-theme-text"
                                                }
                                              >
                                                {cliPulseStep === 2 ? "⬡" : "⬢"}
                                              </span>
                                              <div className="text-theme-text min-w-0 flex-1">
                                                <div className="truncate whitespace-nowrap">
                                                  <span className="opacity-90">
                                                    Searched
                                                  </span>
                                                  <span className="opacity-60">
                                                    {" "}
                                                    for &apos;gotoh algorithm
                                                    implementation python&apos;
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="text-theme-text whitespace-pre-wrap">
                                              I&apos;ll add Gotoh&apos;s affine
                                              gap algorithm to your alignment
                                              module and fix the FASTA parser.
                                              Let me start with the alignment
                                              code:
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="border-theme-border-02 bg-theme-bg-muted border px-3 py-2">
                                              <div className="flex items-center">
                                                <span className="type-product-base-mono">
                                                  <span className="font-medium">
                                                    {"bio/sequence_alignment.py\n\n+GAP_OPEN"}
                                                  </span>
                                                  <span className="ml-1 text-red-600">
                                                    -10
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="text-theme-text whitespace-pre-wrap">
                                              Good, I&apos;ve added the complete
                                              Gotoh implementation with proper
                                              traceback. Now let me fix the
                                              FASTA parser:
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="border-theme-border-02 bg-theme-bg-muted border px-3 py-2">
                                              <div className="flex items-center">
                                                <span className="type-product-base-mono">
                                                  <span className="font-medium">
                                                    {"bio/fasta.py\n\n-def"}
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="text-theme-text whitespace-pre-wrap">
                                              Perfect! Now let me also add ORF
                                              finding capability to the
                                              translate module since that&apos;s
                                              often needed:
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="border-theme-border-02 bg-theme-bg-muted border px-3 py-2">
                                              <div className="flex items-center">
                                                <span className="type-product-base-mono">
                                                  <span className="font-medium">
                                                    {"bio/translate.py\n\n+def"}
                                                  </span>
                                                  <span className="ml-2 text-green-600">
                                                    +3
                                                  </span>
                                                  <span className="ml-1 text-red-600">
                                                    -1
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="leading-relaxed">
                                            <div className="text-theme-text whitespace-pre-wrap">
                                              {"Great! I've added:\n\n1. "}
                                              <strong className="text-theme-text">
                                                Gotoh&apos;s algorithm
                                              </strong>
                                              {
                                                " with proper affine gap penalties (gap open: -10, extend: -1)\n2. "
                                              }
                                              <strong className="text-theme-text">
                                                Fixed FASTA parser
                                              </strong>
                                              {
                                                " that handles multi-line sequences and cleans up whitespace/numbers\n3. "
                                              }
                                              <strong className="text-theme-text">
                                                ORF finder
                                              </strong>
                                              {
                                                " that searches all three frames for start/stop codons\n4. "
                                              }
                                              <strong className="text-theme-text">
                                                Reverse complement
                                              </strong>
                                              {
                                                " function for searching both strands\n\nThe Gotoh implementation uses three matrices (M, X, Y) to track match/mismatch and gap states separately, which gives much better alignments for sequences with indels. Your existing `nw_align` function is unchanged.\n\nWant me to create a quick test to verify everything works?"
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-3">
                                          <div className="border-theme-text flex items-center gap-2 border px-3 py-2">
                                            <span className="text-theme-text">
                                              →
                                            </span>
                                            <input
                                              placeholder="Add a follow-up"
                                              autoComplete="off"
                                              autoCorrect="off"
                                              autoCapitalize="none"
                                              spellCheck={false}
                                              disabled
                                              className="flex-1 bg-transparent outline-none text-theme-text placeholder:text-theme-text cursor-not-allowed"
                                              type="text"
                                              value=""
                                              name="follow-up"
                                              readOnly
                                            />
                                          </div>
                                        </div>
                                        <div className="text-theme-text-sec mt-3 min-h-[36px]">
                                          Grok 4.7
                                          <br />/ for commands · @ for files
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-0 z-20" />
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 2: Other Surfaces */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Other Surfaces</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Start agents from GitHub, Slack, Linear, JetBrains IDEs,
                        and more.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a
                        className="btn-tertiary"
                        href="https://cursor.com/api/install-slack-app"
                      >
                        Add to Slack ↗
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#747066",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(217, 213, 207)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(116, 112, 102)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                          style={
                            {
                              height: "378px",
                              "--demo-pad": "24px",
                            } as React.CSSProperties
                          }
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full">
                            <div className="sr-only" aria-live="polite">
                              Interactive demo with multiple windows showing
                              Cursor&apos;s AI-powered features. The interface is
                              displayed over a subtle, solid brand background.
                            </div>
                            <div
                              aria-hidden="true"
                              id="demo-window-github-pr"
                              className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                              style={{
                                left: "clamp(calc(var(--demo-pad) + 230px), 91.36690647482014%, calc(100% - var(--demo-pad) - 230px))",
                                top: "clamp(calc(var(--demo-pad) + 165px), 50%, calc(100% - var(--demo-pad) - 165px))",
                                width: "460px",
                                minWidth: "420px",
                                height: "330px",
                                maxHeight: "calc(100% - 2 * var(--demo-pad))",
                                minHeight: "260px",
                                transform: "translate(-50%, -50%) scale(1)",
                                transformOrigin: "center center",
                                zIndex: 20,
                                boxShadow:
                                  "0 0 0 1px var(--color-theme-border-02)",
                              }}
                            >
                              <div className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-default">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        "var(--color-theme-fg-20)",
                                    }}
                                  />
                                </div>
                                <div className="-mr-1 flex items-center" />
                              </div>
                              <div
                                className="min-h-0 w-full flex-1 overflow-hidden pointer-events-none"
                                data-demo-desktop-content="true"
                              >
                                <div className="h-full min-h-0 w-full">
                                  <div className="w-full h-full overflow-hidden">
                                    <div className="type-product-base text-theme-text h-full px-5 pt-5 pb-6 overflow-hidden">
                                      <div className="relative flex gap-3">
                                        <div className="flex flex-col items-center w-8 flex-shrink-0">
                                          <img
                                            alt=""
                                            loading="lazy"
                                            width={32}
                                            height={32}
                                            decoding="async"
                                            className="h-8 w-8 rounded-full"
                                            src="/marketing-static/users/leerob.png"
                                          />
                                          <div className="w-px flex-1 bg-theme-border-02 min-h-2" />
                                        </div>
                                        <div className="flex-1 min-w-0 pb-3">
                                          <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                            <div className="px-3 py-1.5 bg-theme-card-02-hex/50 border-b border-theme-border-02">
                                              <div
                                                className="flex items-baseline gap-1.5"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <span className="text-theme-text font-semibold">
                                                  leerob
                                                </span>
                                                <span className="text-theme-text-ter/60">
                                                  5m ago
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className="px-3 py-2 text-theme-text"
                                              style={{ fontSize: "13px" }}
                                            >
                                              <span className="font-semibold text-theme-text">
                                                @cursor
                                              </span>{" "}
                                              can you review this PR?
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative flex gap-3">
                                        <div className="flex flex-col items-center w-8 flex-shrink-0">
                                          <div className="h-8 w-8 rounded-md bg-theme-card-02-hex/80 flex items-center justify-center">
                                            <img
                                              alt=""
                                              loading="lazy"
                                              width={32}
                                              height={32}
                                              decoding="async"
                                              className="h-8 w-8 rounded-md"
                                              src="/marketing-static/icon-192x192.png"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                            <div>
                                              <div className="px-3 py-1.5 bg-theme-card-02-hex/50 border-b border-theme-border-02">
                                                <div
                                                  className="flex items-baseline gap-1.5"
                                                  style={{ fontSize: "13px" }}
                                                >
                                                  <span className="text-theme-text font-semibold">
                                                    cursor
                                                  </span>
                                                  <span className="text-[10px] text-theme-text-ter/70 border-theme-border-02 rounded-full border px-1.5 py-0.5 leading-tight">
                                                    bot
                                                  </span>
                                                  <span className="text-theme-text-ter/60">
                                                    reviewed 3m ago
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="mx-3 mt-3 mb-2 rounded overflow-hidden border border-theme-border-02">
                                                <div className="px-2.5 py-1.5 bg-theme-card-02-hex border-b border-theme-border-02">
                                                  <span className="text-[11px] font-berkeley-mono text-theme-text-ter/60 tracking-tight truncate block">
                                                    src/vs/workbench/composer/browser/components/ComposerUnifiedDropdown.tsx
                                                  </span>
                                                </div>
                                                <div className="font-berkeley-mono text-[11px] tracking-tight bg-theme-card-hex">
                                                  <div className="flex">
                                                    <div
                                                      className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-removed-line-background)",
                                                      }}
                                                    >
                                                      3292
                                                    </div>
                                                    <div
                                                      className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-removed-line-background)",
                                                        color:
                                                          "var(--color-theme-product-ansi-red)",
                                                      }}
                                                    >
                                                      -
                                                    </div>
                                                    <div
                                                      className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-removed-line-background)",
                                                        color:
                                                          "var(--color-theme-product-ansi-red)",
                                                      }}
                                                    >
                                                      {"  {selectedMode().keybinding}"}
                                                    </div>
                                                  </div>
                                                  <div className="flex">
                                                    <div
                                                      className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-line-inserted-line-background)",
                                                      }}
                                                    >
                                                      3293
                                                    </div>
                                                    <div
                                                      className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-line-inserted-line-background)",
                                                        color:
                                                          "var(--color-theme-product-ansi-green)",
                                                      }}
                                                    >
                                                      +
                                                    </div>
                                                    <div
                                                      className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                      style={{
                                                        backgroundColor:
                                                          "var(--color-theme-product-line-inserted-line-background)",
                                                        color:
                                                          "var(--color-theme-product-ansi-green)",
                                                      }}
                                                    >
                                                      {"  {composerOpenModeToggleKeybinding()}"}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="px-3 pt-1 pb-2 text-theme-text"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <div className="w-full">
                                                  <div
                                                    className="text-theme-text type-product-base"
                                                    style={{ fontSize: "13px" }}
                                                  >
                                                    <div className="min-h-[1.5em]">
                                                      <span className="font-semibold">
                                                        Bug: Function Returns
                                                        Object Instead of String
                                                        (Logic bug)
                                                      </span>
                                                    </div>
                                                    <div className="min-h-[1.5em]">
                                                      The{" "}
                                                      <code className="bg-theme-card-04-hex type-product-base-mono text-theme-text rounded-2xs px-0.5">
                                                        composerOpenModeToggleKeybinding
                                                      </code>{" "}
                                                      is a function that needs
                                                      to be called to get its
                                                      value. This makes the
                                                      condition always truthy.
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1.5 mt-3 px-3 pb-3">
                                                <button
                                                  type="button"
                                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium border bg-theme-card-hex border-theme-border-02 text-theme-text hover:bg-theme-card-02-hex"
                                                >
                                                  <svg
                                                    className="h-3.5 w-3.5 text-theme-text"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 22"
                                                    fill="none"
                                                  >
                                                    <g fill="currentColor">
                                                      <path d="M19.162 5.452 10.698.565a.88.88 0 0 0-.879 0L1.356 5.452a.74.74 0 0 0-.37.64v9.853a.74.74 0 0 0 .37.64l8.464 4.887a.879.879 0 0 0 .879 0l8.464-4.886a.74.74 0 0 0 .37-.64V6.091a.74.74 0 0 0-.37-.64Zm-.531 1.035L10.46 20.639c-.055.095-.201.056-.201-.055v-9.266a.52.52 0 0 0-.26-.45L1.975 6.237c-.096-.056-.057-.202.054-.202h16.34c.233 0 .378.252.262.453Z" />
                                                    </g>
                                                  </svg>
                                                  Fix in Cursor
                                                </button>
                                                <button
                                                  type="button"
                                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium border bg-theme-card-hex border-theme-border-02 text-theme-text hover:bg-theme-card-02-hex"
                                                >
                                                  Fix in Web
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-0 z-20" />
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 3: Web & Mobile */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Web &amp; Mobile</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Run cloud agents from your browser or phone.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a
                        href="https://cursor.com/agents"
                        className="btn-tertiary"
                      >
                        Open in browser ↗
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#747066",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(217, 213, 207)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(116, 112, 102)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="relative w-full overflow-hidden rounded-xs"
                          style={{ height: "378px" }}
                        >
                          <div
                            className="absolute left-1/2 -translate-x-1/2 xl:left-6 xl:translate-x-0"
                            style={{
                              width: "300px",
                              height: "650px",
                              top: "24px",
                            }}
                          >
                            <div
                              className="absolute"
                              style={{
                                right: "-3px",
                                top: "201.938px",
                                height: "76.8999px",
                                width: "4px",
                                borderRadius: "0px 2px 2px 0px",
                                background:
                                  "linear-gradient(to right, rgb(28, 28, 30), rgb(44, 44, 46))",
                              }}
                            />
                            <div
                              className="absolute"
                              style={{
                                left: "-3px",
                                top: "133.076px",
                                height: "29.9779px",
                                width: "4px",
                                borderRadius: "2px 0px 0px 2px",
                                background:
                                  "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                              }}
                            />
                            <div
                              className="absolute"
                              style={{
                                left: "-3px",
                                top: "185.212px",
                                height: "48.6598px",
                                width: "4px",
                                borderRadius: "2px 0px 0px 2px",
                                background:
                                  "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                              }}
                            />
                            <div
                              className="absolute"
                              style={{
                                left: "-3px",
                                top: "246.905px",
                                height: "48.6598px",
                                width: "4px",
                                borderRadius: "2px 0px 0px 2px",
                                background:
                                  "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                              }}
                            />
                            <div
                              className="relative overflow-hidden"
                              style={{
                                width: "300px",
                                height: "650px",
                                borderRadius: "44px",
                                clipPath: "inset(0px round 44px)",
                                contain: "paint",
                                padding: "4px",
                              }}
                            >
                              <div
                                className="absolute inset-0"
                                style={{
                                  borderRadius: "44px",
                                  backgroundColor: "rgb(58, 58, 60)",
                                }}
                              />
                              <div
                                className="bg-theme-product-editor border-theme-border relative h-full w-full overflow-hidden border"
                                style={{
                                  borderRadius: "40px",
                                  clipPath: "inset(0px round 40px)",
                                  contain: "paint",
                                }}
                              >
                                <div className="relative h-[48px]">
                                  <div
                                    className="absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black"
                                    style={{
                                      top: "8px",
                                      width: "96px",
                                      height: "28px",
                                    }}
                                  />
                                </div>
                                <div className="flex items-center justify-between px-4 pb-3 pt-4">
                                  <div className="flex items-center justify-center">
                                    <svg
                                      className="text-theme-text h-6 w-6"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 22"
                                      fill="none"
                                    >
                                      <g fill="currentColor">
                                        <path d="M19.162 5.452 10.698.565a.88.88 0 0 0-.879 0L1.356 5.452a.74.74 0 0 0-.37.64v9.853a.74.74 0 0 0 .37.64l8.464 4.887a.879.879 0 0 0 .879 0l8.464-4.886a.74.74 0 0 0 .37-.64V6.091a.74.74 0 0 0-.37-.64Zm-.531 1.035L10.46 20.639c-.055.095-.201.056-.201-.055v-9.266a.52.52 0 0 0-.26-.45L1.975 6.237c-.096-.056-.057-.202.054-.202h16.34c.233 0 .378.252.262.453Z" />
                                      </g>
                                    </svg>
                                  </div>
                                  <div className="flex items-center gap-0">
                                    <button
                                      type="button"
                                      onClick={() => setMobileTab("agent")}
                                      className={`type-product-base rounded-md px-3 py-1 font-medium cursor-pointer ${
                                        mobileTab === "agent"
                                          ? "bg-theme-card-02-hex text-theme-text"
                                          : "text-theme-text-ter"
                                      }`}
                                    >
                                      Agent
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setMobileTab("dashboard")}
                                      className={`type-product-base rounded-md px-3 py-1 font-medium cursor-pointer ${
                                        mobileTab === "dashboard"
                                          ? "bg-theme-card-02-hex text-theme-text"
                                          : "text-theme-text-ter"
                                      }`}
                                    >
                                      Dashboard
                                    </button>
                                  </div>
                                  <img
                                    alt=""
                                    className="h-6 w-6 rounded-full border border-theme-border-02 object-cover"
                                    src="/marketing-static/users/swhitmore.png"
                                  />
                                </div>
                                <div className="flex-1 overflow-hidden pb-20">
                                  <div className="mb-0.5">
                                    <div className="type-product-base text-theme-text-sec px-4 py-1.5 font-medium">
                                      Today
                                    </div>
                                    <div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                            className="text-theme-text-ter"
                                          >
                                            <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Vercel streaming SDK functionality
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              Analyzing codebase
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              dashboard-ui
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                            className="text-theme-text-ter"
                                          >
                                            <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Model selector dropdown
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              Planning next moves
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              stripe-landing
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <path
                                              d="M8 2L2 5l6 3 6-3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Implement agent window
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              2 models
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              agent-ui
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Fix send button functionality
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              2 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +26
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -12
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              agent-ui
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mb-0.5">
                                    <div className="type-product-base text-theme-text-sec px-4 py-1.5 font-medium">
                                      This Week
                                    </div>
                                    <div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Fix send button functionality
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              2 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +26
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -12
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              agent-ui
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Implement user authentication
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              3 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +45
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -8
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              auth-system
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Design responsive layout
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              5 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +30
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -3
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              frontend
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Set up database schema
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              4 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +35
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -2
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              database
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2 px-4 py-2">
                                        <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                          <svg
                                            className="text-theme-text-ter opacity-30"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                          >
                                            <circle
                                              cx="5"
                                              cy="4"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <circle
                                              cx="11"
                                              cy="12"
                                              r="2"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
                                              stroke="currentColor"
                                              strokeWidth="1"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="type-product-base text-theme-text truncate leading-tight">
                                            Create API endpoints
                                          </div>
                                          <div className="type-product-base mt-0.5 flex items-center gap-1">
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              6 Files
                                            </span>
                                            <span className="text-theme-product-ansi-green font-medium">
                                              +50
                                            </span>
                                            <span className="text-theme-product-ansi-red font-medium">
                                              -5
                                            </span>
                                            <span className="text-theme-text-ter opacity-50">
                                              ·
                                            </span>
                                            <span className="text-theme-text-ter truncate opacity-50">
                                              backend
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute right-4 bottom-8 left-4">
                                  <div
                                    className="border-theme-border-02 bg-theme-card-hex flex items-center rounded-full border p-1"
                                    style={{
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.05) 0px 1px 3px",
                                    }}
                                  >
                                    <div className="bg-theme-card-02-hex flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        className="text-theme-text-ter opacity-40"
                                      >
                                        <path
                                          d="M6 2v8M2 6h8"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </div>
                                    <span className="type-product-base text-theme-text-ter flex-1 truncate px-2 opacity-50">
                                      Ask Cursor to build, plan, fix...
                                    </span>
                                    <div className="bg-theme-card-02-hex flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                      <svg
                                        className="text-theme-text-ter h-3 w-3"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                      >
                                        <path
                                          d="M8 13V3M8 3l4 4M8 3L4 7"
                                          stroke="currentColor"
                                          strokeWidth="1"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[103px] -translate-x-1/2 rounded-full bg-theme-text/30" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Section 2 — #context */}
      <section className="section" id="context">
        <div className="container">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">
              Understands your codebase, no matter the size
            </h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Cursor deeply learns your codebase before writing a single line.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="container my-v2">
            <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
              {/* Card 0: Multiple models */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Multiple models</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Subagents run in parallel to explore your codebase, with
                        each one using the best model for the task.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/context/subagents" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#3C3935",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(217, 213, 207)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(60, 57, 53)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="relative flex w-full items-center justify-center overflow-hidden rounded-xs"
                          style={{ height: "378px" }}
                        >
                          <div className="w-full max-w-[340px] px-4">
                            <div className="w-full">
                              <div className="flex items-center gap-1 pb-2">
                                <span className="type-product-lg text-theme-text-sec">
                                  {currentSubagentPhase.header}
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-theme-text-ter opacity-60"
                                >
                                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                                </svg>
                              </div>
                              <div className="space-y-2">
                                {currentSubagentPhase.items.map((item) => (
                                  <div
                                    key={item.title}
                                    className="bg-theme-card-hex border-theme-border-02 rounded-lg border px-3 py-2 transition-opacity duration-300"
                                    style={{
                                      opacity:
                                        item.status === "pending" ? 0.7 : 1,
                                    }}
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <div className="shrink-0 mt-0.5">
                                        <SubagentStatusIcon
                                          status={item.status}
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <span
                                            className={`type-product-lg leading-snug ${
                                              item.status === "pending"
                                                ? "text-theme-text-sec"
                                                : "text-theme-text"
                                            }`}
                                          >
                                            {item.title}
                                          </span>
                                        </div>
                                        <div className="type-product-sm mt-0.5 leading-snug whitespace-nowrap flex items-center gap-1">
                                          {item.status === "pending" ? (
                                            <span className="text-theme-text-ter opacity-50">
                                              Pending • {item.model}
                                            </span>
                                          ) : (
                                            <>
                                              <span className="text-theme-text-sec">
                                                {item.task}
                                              </span>
                                              <span className="text-theme-text-ter opacity-50">
                                                •
                                              </span>
                                              <span className="text-theme-text-ter opacity-50">
                                                {item.model}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 1: Team rules */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Team rules</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Teach Cursor your preferences, from team conventions to
                        specific architectural decisions.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/context/rules" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#CFCEBC",
                          "--layered-media-bg-dark": "#5C5743",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(207, 206, 188)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(92, 87, 67)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div style={{ height: "378px", width: "100%" }}>
                          <div
                            className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                            style={
                              {
                                height: "378px",
                                "--demo-pad": "0px",
                              } as React.CSSProperties
                            }
                          >
                            <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full">
                              <div className="sr-only" aria-live="polite">
                                Interactive demo with multiple windows showing
                                Cursor&apos;s AI-powered features. The interface
                                is displayed over a subtle, solid brand
                                background.
                              </div>
                              <div
                                aria-hidden="true"
                                id="demo-window-fcd-top-left-385.6640625-378"
                                className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-editor"
                                style={{
                                  left: "59.1188%",
                                  top: "57.4074%",
                                  width: "400px",
                                  height: "378px",
                                  maxHeight:
                                    "calc(100% - 2 * var(--demo-pad))",
                                  transform: "translate(-50%, -50%) scale(1)",
                                  transformOrigin: "center center",
                                  zIndex: 10,
                                }}
                              >
                                <div
                                  className="min-h-0 w-full flex-1 overflow-hidden pointer-events-none"
                                  data-demo-desktop-content="true"
                                >
                                  <div className="h-full min-h-0 w-full">
                                    <div className="bg-theme-product-chrome text-theme-text h-full min-h-0 w-full overflow-hidden relative flex flex-col">
                                      <div className="border-theme-border-02 relative flex h-7 shrink-0 items-center justify-between border-b px-2">
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{
                                              backgroundColor:
                                                "var(--color-theme-fg-20)",
                                            }}
                                          />
                                          <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{
                                              backgroundColor:
                                                "var(--color-theme-fg-20)",
                                            }}
                                          />
                                          <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{
                                              backgroundColor:
                                                "var(--color-theme-fg-20)",
                                            }}
                                          />
                                        </div>
                                        <div />
                                      </div>
                                      <div className="flex w-full min-h-0 flex-1">
                                        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                          <div className="min-h-0 flex-1 bg-theme-product-editor">
                                            <div className="flex h-full w-full flex-col overflow-hidden">
                                              <div className="font-berkeley-mono text-[12px] leading-relaxed tracking-tight p-4">
                                                <div className="text-theme-text-ter">
                                                  ---
                                                </div>
                                                <div>
                                                  <span className="text-theme-product-syntax-property">
                                                    description
                                                  </span>
                                                  <span className="text-theme-text-ter">
                                                    :{" "}
                                                  </span>
                                                  <span className="text-theme-product-syntax-string">
                                                    Notion-inspired block
                                                    architecture
                                                  </span>
                                                </div>
                                                <div>
                                                  <span className="text-theme-product-syntax-property">
                                                    globs
                                                  </span>
                                                  <span className="text-theme-text-ter">
                                                    :{" "}
                                                  </span>
                                                  <span className="text-theme-product-syntax-string">
                                                    components/blocks/**/*
                                                  </span>
                                                </div>
                                                <div className="text-theme-text-ter">
                                                  ---
                                                </div>
                                                <div className="mt-3" />
                                                <div>
                                                  <span className="text-theme-product-syntax-keyword font-semibold">
                                                    #{" "}
                                                  </span>
                                                  <span className="text-theme-text font-semibold">
                                                    Notion Block System
                                                  </span>
                                                </div>
                                                <div className="mt-3" />
                                                <div className="mb-1">
                                                  <span className="text-theme-product-syntax-keyword">
                                                    ##{" "}
                                                  </span>
                                                  <span className="text-theme-text">
                                                    Patterns
                                                  </span>
                                                </div>
                                                <div className="space-y-0.5">
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Use{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        Block
                                                      </span>{" "}
                                                      components for all content
                                                      types
                                                    </span>
                                                  </div>
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Keyboard navigation with{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        ↑
                                                      </span>{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        ↓
                                                      </span>{" "}
                                                      to move between blocks
                                                    </span>
                                                  </div>
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Real-time collaboration
                                                      via{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        CRDT
                                                      </span>{" "}
                                                      operations
                                                    </span>
                                                  </div>
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Animations use{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        150ms ease-out
                                                      </span>{" "}
                                                      timing
                                                    </span>
                                                  </div>
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Spacing follows{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        4px
                                                      </span>{" "}
                                                      grid: 4, 8, 12, 16, 24
                                                    </span>
                                                  </div>
                                                  <div className="flex gap-1.5">
                                                    <span className="text-theme-text-ter">
                                                      -
                                                    </span>
                                                    <span className="text-theme-text-sec">
                                                      Command palette triggered
                                                      with{" "}
                                                      <span
                                                        className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                        style={{
                                                          backgroundColor:
                                                            "rgba(136, 136, 136, 0.12)",
                                                        }}
                                                      >
                                                        /
                                                      </span>
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="pointer-events-none absolute inset-0 z-20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 2: Fast codebase search */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Fast codebase search</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Designed for large codebases, Cursor uses Instant Grep
                        to search millions of files in milliseconds.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a
                        href="/docs/agent/tools/search"
                        className="btn-tertiary"
                      >
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-02-hex">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="aspect-1/1-box"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "378px",
                            backgroundColor: "transparent",
                          }}
                        >
                          <div className="absolute inset-x-0 top-0 flex h-full items-center justify-center xl:inset-0">
                            <div
                              role="region"
                              aria-label="Tool calls"
                              style={{
                                minWidth: "180px",
                                maxWidth: "min(83.3333%, 360px)",
                                width: "100%",
                              }}
                            >
                              <div className="space-y-v9/12">
                                <div className="border-theme-border-02 bg-theme-card-04-hex text-theme-text type-product-lg px-g1 py-g0.75 w-full rounded-md border">
                                  How does the payment flow handle failed
                                  transactions?
                                </div>
                                <ul className="space-y-v6/12 pl-g0.5">
                                  {SEARCH_TOOL_CALLS.map((call, idx) => {
                                    const isActive = activeSearchStep === idx;
                                    return (
                                      <li
                                        key={`${call.verb}-${call.target}`}
                                        className="type-product-lg text-theme-text-sec leading-snug"
                                      >
                                        <div
                                          className={`text-theme-text-sec flex items-baseline gap-1 overflow-hidden ${
                                            isActive ? "shimmer" : ""
                                          }`}
                                        >
                                          <span className="text-theme-text-sec flex-shrink-0">
                                            {call.verb}
                                          </span>
                                          <span className="text-theme-text-sec min-w-0 truncate opacity-60">
                                            {" "}
                                            {call.target}
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
