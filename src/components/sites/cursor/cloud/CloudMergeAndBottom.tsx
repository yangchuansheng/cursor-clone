"use client";

import React, { useEffect, useState } from "react";

const CURSOR_ICONS_STYLE = `
  @font-face {
    font-family: 'CursorIcons16';
    src: url('/marketing-static/fonts/cursor-icons-16.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(2px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes fadeSlideRight { from { opacity: 0; transform: translateX(-2px) } to { opacity: 1; transform: translateX(0) } }
  @keyframes barGrow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
  @keyframes tilePopIn { from { opacity: 0; transform: scale(0.7) translateY(3px) } to { opacity: 1; transform: scale(1) translateY(0) } }
`;

interface ToolCallStep {
  runningLabel: string;
  doneLabel: string;
  target: string;
}

const SELF_TESTING_STEPS: ToolCallStep[] = [
  {
    runningLabel: "Running",
    doneLabel: "Ran",
    target: "terminal command",
  },
  {
    runningLabel: "Creating",
    doneLabel: "Created",
    target: "clipboard-permission-demo.html",
  },
  {
    runningLabel: "Starting",
    doneLabel: "Started",
    target: "screen recording",
  },
];

export function CloudMergeAndBottom() {
  // Card 0: Self-testing step animation state (3 = all completed and demo shimmering)
  const [activeStep, setActiveStep] = useState<number>(3);

  // Card 1: Demos over diffs interactive playback state
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [demoTick, setDemoTick] = useState<number>(0);

  // Card 2: Remote desktop interactive control state
  const [isControllingDesktop, setIsControllingDesktop] = useState<boolean>(false);
  const [activeDesktopWindow, setActiveDesktopWindow] = useState<"terminal" | "dashboard">("dashboard");
  const [cursorPos, setCursorPos] = useState<{ left: number; top: number }>({
    left: 15,
    top: 76,
  });

  useEffect(() => {
    if (activeStep >= 3) return;
    const timer = window.setTimeout(() => {
      setActiveStep((prev) => Math.min(prev + 1, 3));
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [activeStep]);

  useEffect(() => {
    if (!isPlayingDemo) return;
    const interval = window.setInterval(() => {
      setDemoTick((prev) => (prev + 1) % 6);
    }, 650);
    const stopTimer = window.setTimeout(() => {
      setIsPlayingDemo(false);
      setDemoTick(0);
    }, 5200);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stopTimer);
    };
  }, [isPlayingDemo]);

  const handleDesktopPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControllingDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nextLeft = Math.min(88, Math.max(4, ((e.clientX - rect.left) / rect.width) * 100));
    const nextTop = Math.min(86, Math.max(6, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ left: nextLeft, top: nextTop });
  };

  const blueCursorLeft = isPlayingDemo ? 54 + ((demoTick * 7) % 24) : 54;
  const greenCursorLeft = isPlayingDemo ? 42 + ((demoTick * 9) % 28) : 63;
  const amberCursorLeft = isPlayingDemo ? 36 + ((demoTick * 6) % 22) : 48;

  return (
    <>
      {/* Section 4: Get merge-ready PRs */}
      <section className="section bg-theme-bg text-theme-text">
        <div className="container my-v2">
          <div className="text-left  mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance ">Get merge-ready PRs</h2>
            <div className="flex justify-start mb-v1">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Cursor can test the software it builds to verify and demo its work.
              </div>
            </div>
            <div className="flex justify-start gap-x-g1 items-center">
              <a
                href="https://cursor.com/docs/cloud-agent/capabilities"
                className="btn"
              >
                Learn about cloud agents
                <div aria-hidden="true" className="btn-icon">
                  <span className="" aria-hidden="true">
                    →
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch">
            {/* Card 0: Self-testing */}
            <div className="undefined h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Self-testing</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Agents test changes in their own sandbox and iterate until they&apos;ve validated their output.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible max-h-mobile"
                    style={
                      {
                        "--layered-media-bg-light": "#E9E8E5",
                        "--layered-media-bg-dark": "#2E2D2A",
                        "--max-h-mobile": "420px",
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="media-light absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(233, 232, 229)" }}
                    />
                    <div
                      className="media-dark absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(46, 45, 42)" }}
                    />
                    <div className="z-20 col-span-full row-span-full h-full min-h-0">
                      <div
                        className="relative w-full"
                        style={{
                          height: "378px",
                          fontFamily: "var(--font-system)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            style={{
                              minWidth: "180px",
                              maxWidth: "min(83.3333%, 360px)",
                              width: "100%",
                            }}
                          >
                            <div className="flex h-full w-full flex-col overflow-hidden">
                              <div className="flex-1 overflow-hidden p-3">
                                <div className="min-h-[260px] max-w-[calc(100%-12px)] space-y-2">
                                  <div
                                    className="bg-theme-card-04-hex border-theme-border-02 text-theme-text type-product-lg rounded-md border px-3 py-2 cursor-pointer"
                                    style={{ opacity: 1, transform: "none" }}
                                    onClick={() => setActiveStep(0)}
                                    title="Click to replay self-testing sequence"
                                  >
                                    Reproduce the clipboard exfiltration vulnerability described in this ticket
                                  </div>
                                  <div className="space-y-2 pl-2">
                                    {SELF_TESTING_STEPS.map((step, idx) => {
                                      const isRunning = activeStep === idx;
                                      return (
                                        <div
                                          key={step.target}
                                          className="type-product-lg text-theme-text-sec leading-snug"
                                          style={{
                                            opacity: activeStep >= idx ? 1 : 0.45,
                                            transform: "none",
                                            transition: "opacity 200ms ease",
                                          }}
                                        >
                                          <span className="inline-grid max-w-full align-baseline">
                                            <span
                                              className="col-start-1 row-start-1 flex min-w-0 items-baseline gap-1 overflow-hidden data-[hidden]:invisible"
                                              aria-hidden={isRunning ? "false" : "true"}
                                              {...(!isRunning ? { "data-hidden": "true" } : {})}
                                            >
                                              <span
                                                className="shimmer flex-shrink-0"
                                                style={
                                                  {
                                                    "--shimmer-color": "var(--color-theme-text-sec)",
                                                    "--shimmer-intensity": "92%",
                                                    "--shimmer-duration": "1.15s",
                                                  } as React.CSSProperties
                                                }
                                              >
                                                {step.runningLabel}
                                              </span>
                                              <span className="min-w-0 truncate opacity-60">
                                                {step.target}
                                              </span>
                                            </span>
                                            <span
                                              className="col-start-1 row-start-1 flex min-w-0 items-baseline gap-1 overflow-hidden data-[hidden]:invisible"
                                              aria-hidden={isRunning ? "true" : "false"}
                                              {...(isRunning ? { "data-hidden": "true" } : {})}
                                            >
                                              <span className="flex-shrink-0 text-theme-text-sec">
                                                {step.doneLabel}
                                              </span>
                                              <span className="min-w-0 truncate opacity-60">
                                                {step.target}
                                              </span>
                                            </span>
                                          </span>
                                        </div>
                                      );
                                    })}

                                    <div style={{ opacity: 1, transform: "none" }}>
                                      <div
                                        className="rounded-lg border border-theme-border-02 bg-theme-card-02-hex overflow-hidden cursor-pointer"
                                        style={{ opacity: 1, transform: "none" }}
                                        onClick={() => setActiveStep(0)}
                                      >
                                        <div className="flex items-stretch">
                                          <div
                                            className="relative w-[88px] flex-shrink-0 overflow-hidden rounded-l-md"
                                            aria-label="$ node exploit-test.js"
                                          >
                                            <img
                                              alt=""
                                              className="absolute inset-0 h-full w-full object-cover"
                                              draggable={false}
                                              src="/sites/cursor/blob/assets/wallpapers/cloud-agents-3.webp"
                                            />
                                            <div className="absolute inset-0 bg-black/[0.06]" />
                                            <div
                                              className="absolute inset-x-2 top-2.5 bottom-2 overflow-hidden rounded-[3px] bg-theme-bg"
                                              style={{
                                                boxShadow:
                                                  "rgba(0, 0, 0, 0.25) 0px 2px 8px, rgba(0, 0, 0, 0.12) 0px 0px 0px 0.5px",
                                              }}
                                            >
                                              <div
                                                className="flex items-center gap-[3px] px-1.5 py-1"
                                                style={{
                                                  borderBottom:
                                                    "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                }}
                                              >
                                                <div
                                                  className="h-[3px] w-[3px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[3px] w-[3px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[3px] w-[3px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                              </div>
                                              <div className="px-1.5 pt-1 space-y-[3px]">
                                                <div
                                                  className="h-[2px] w-[65%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.1,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[45%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.07,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[55%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.07,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[35%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.05,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[50%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.07,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[40%] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.05,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div className="absolute bottom-1.5 right-1.5 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]">
                                              <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                className="-scale-x-100"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M14.4775 2.375C15.1508 2.37522 15.5719 3.10428 15.2353 3.6875L8.63861 15.1143C8.19099 15.8892 7.00618 15.5716 7.00579 14.6768V7.56348L0.845638 4.00781C0.0708241 3.56015 0.388339 2.37535 1.28314 2.375H14.4775ZM7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                                  fill="white"
                                                />
                                                <path
                                                  d="M7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                                  fill="#1a1a1a"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                          <div className="min-w-0 flex flex-col justify-center px-3 py-3">
                                            <div
                                              className="type-product-lg leading-snug shimmer"
                                              style={
                                                {
                                                  "--shimmer-color": "var(--color-theme-text)",
                                                  "--shimmer-intensity": "96%",
                                                  "--shimmer-duration": "1.25s",
                                                } as React.CSSProperties
                                              }
                                            >
                                              Clipboard exfiltration vulnerability demo
                                            </div>
                                            <div className="type-product-sm text-theme-text-tertiary leading-snug mt-1">
                                              Worked for 4m 30s
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
                    </div>
                  </div>
                </figure>
              </div>
            </div>

            {/* Card 1: Demos over diffs */}
            <div className="undefined h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Demos over diffs</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Cursor produces artifacts like videos, screenshots, and logs, so you can quickly validate its work.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible max-h-mobile"
                    style={
                      {
                        "--layered-media-bg-light": "#E8E4DF",
                        "--layered-media-bg-dark": "#2E2B27",
                        "--max-h-mobile": "420px",
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="media-light absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(232, 228, 223)" }}
                    />
                    <div
                      className="media-dark absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(46, 43, 39)" }}
                    />
                    <div className="z-20 col-span-full row-span-full h-full min-h-0">
                      <div className="relative h-[378px] w-full">
                        <div
                          className="relative h-full w-full"
                          style={{ fontFamily: "var(--font-system)" }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full min-w-[180px] max-w-[min(83.333333%,360px)]">
                              <div className="flex w-full flex-col overflow-visible p-3">
                                <div className="space-y-2">
                                  <div style={{ opacity: 1, transform: "none" }}>
                                    <div className="type-product-lg text-theme-text-sec flex items-baseline gap-1 overflow-hidden leading-snug">
                                      <span className="flex-shrink-0">Processed</span>
                                      <span className="min-w-0 truncate opacity-60">
                                        screen recording
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{ opacity: 1, transform: "none" }}>
                                    <div
                                      className="group/rec relative cursor-pointer overflow-hidden rounded-[3px]"
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => setIsPlayingDemo((prev) => !prev)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          setIsPlayingDemo((prev) => !prev);
                                        }
                                      }}
                                    >
                                      <div className="relative aspect-[16/9]">
                                        <div
                                          className="group/desktop relative max-h-full w-full overflow-hidden rounded-md aspect-[16/9]"
                                          style={
                                            {
                                              "--rd-base-width": "302.375px",
                                              "--rd-base-height": "170.078125px",
                                              "--rd-content-scale": 1,
                                            } as React.CSSProperties
                                          }
                                        >
                                          <img
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover"
                                            draggable={false}
                                            src="/sites/cursor/blob/assets/wallpapers/cloud-agents-1.webp"
                                          />
                                          {/* Terminal window */}
                                          <div
                                            className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px] rounded-[3px]"
                                            style={{
                                              top: "31%",
                                              left: "6%",
                                              width: "42%",
                                              height: "42%",
                                              zIndex: 2,
                                              boxShadow:
                                                "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                                              borderRadius: "3px",
                                            }}
                                          >
                                            <div
                                              className="flex origin-top-left flex-col"
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                transform: "scale(1)",
                                              }}
                                            >
                                              <div
                                                className="flex h-[7px] shrink-0 items-center gap-[1.5px] px-[3px]"
                                                style={{
                                                  borderBottom:
                                                    "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                }}
                                              >
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                              </div>
                                              <div
                                                className="flex-1 px-[4px] pt-[3px] pb-0"
                                                style={{
                                                  fontFamily:
                                                    "var(--font-berkeley-mono, var(--font-mono, ui-monospace, monospace))",
                                                  fontSize: "5px",
                                                  lineHeight: 1.35,
                                                  letterSpacing: "-0.02em",
                                                  color: "var(--color-theme-fg)",
                                                }}
                                              >
                                                <div className="space-y-[1px] whitespace-nowrap">
                                                  <div style={{ opacity: 0.4 }}>$ pnpm dev</div>
                                                  <div style={{ opacity: 0.25 }}>
                                                    ready - notes app localhost:3000
                                                  </div>
                                                  <div style={{ opacity: 0.25 }}>
                                                    ws sync connected
                                                  </div>
                                                  <div style={{ opacity: 0.25 }}>
                                                    rich text editor loaded
                                                  </div>
                                                  <div style={{ opacity: 0.25 }}>
                                                    version snapshot saved
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Collaborative rich-text editor window */}
                                          <div
                                            className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px] rounded-[3px]"
                                            style={{
                                              top: "10%",
                                              left: "26%",
                                              width: "62%",
                                              height: "64%",
                                              zIndex: 4,
                                              boxShadow:
                                                "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                                              borderRadius: "3px",
                                            }}
                                          >
                                            <div
                                              className="flex origin-top-left flex-col"
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                transform: "scale(1)",
                                              }}
                                            >
                                              <div
                                                className="flex h-[7px] shrink-0 items-center gap-[1.5px] px-[3px]"
                                                style={{
                                                  borderBottom:
                                                    "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                }}
                                              >
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                                <div
                                                  className="h-[2px] w-[2px] rounded-full"
                                                  style={{
                                                    backgroundColor: "var(--color-theme-fg)",
                                                    opacity: 0.15,
                                                  }}
                                                />
                                              </div>
                                              <div className="flex min-h-0 flex-1">
                                                <div
                                                  className="flex w-[16%] shrink-0 flex-col gap-[2px] overflow-hidden p-[2px]"
                                                  style={{
                                                    borderRight:
                                                      "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                  }}
                                                >
                                                  <div
                                                    className="mb-[1px] h-[2.5px] w-[62%] rounded-sm"
                                                    style={{
                                                      backgroundColor: "var(--color-theme-fg)",
                                                      opacity: 0.12,
                                                    }}
                                                  />
                                                  <div
                                                    className="flex items-center gap-[1.5px] rounded-[2px] px-[1.5px] py-[1.5px]"
                                                    style={{ backgroundColor: "transparent" }}
                                                  >
                                                    <div
                                                      className="h-[3.5px] w-[3.5px] rounded-[1px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                    <div
                                                      className="h-[1.5px] rounded-sm"
                                                      style={{
                                                        width: "62%",
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                  </div>
                                                  <div
                                                    className="flex items-center gap-[1.5px] rounded-[2px] px-[1.5px] py-[1.5px]"
                                                    style={{
                                                      backgroundColor:
                                                        "color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                    }}
                                                  >
                                                    <div
                                                      className="h-[3.5px] w-[3.5px] rounded-[1px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.18,
                                                      }}
                                                    />
                                                    <div
                                                      className="h-[1.5px] rounded-sm"
                                                      style={{
                                                        width: "76%",
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                  </div>
                                                  <div
                                                    className="flex items-center gap-[1.5px] rounded-[2px] px-[1.5px] py-[1.5px]"
                                                    style={{ backgroundColor: "transparent" }}
                                                  >
                                                    <div
                                                      className="h-[3.5px] w-[3.5px] rounded-[1px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                    <div
                                                      className="h-[1.5px] rounded-sm"
                                                      style={{
                                                        width: "50%",
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                  </div>
                                                  <div
                                                    className="flex items-center gap-[1.5px] rounded-[2px] px-[1.5px] py-[1.5px]"
                                                    style={{ backgroundColor: "transparent" }}
                                                  >
                                                    <div
                                                      className="h-[3.5px] w-[3.5px] rounded-[1px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                    <div
                                                      className="h-[1.5px] rounded-sm"
                                                      style={{
                                                        width: "68%",
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                  </div>
                                                  <div
                                                    className="flex items-center gap-[1.5px] rounded-[2px] px-[1.5px] py-[1.5px]"
                                                    style={{ backgroundColor: "transparent" }}
                                                  >
                                                    <div
                                                      className="h-[3.5px] w-[3.5px] rounded-[1px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                    <div
                                                      className="h-[1.5px] rounded-sm"
                                                      style={{
                                                        width: "56%",
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.08,
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                  <div
                                                    className="flex h-[12px] shrink-0 items-center px-[3px]"
                                                    style={{
                                                      borderBottom:
                                                        "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                    }}
                                                  >
                                                    <div
                                                      className="h-[2px] w-[34%] rounded-sm"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-fg)",
                                                        opacity: 0.1,
                                                      }}
                                                    />
                                                    <div className="flex-1" />
                                                    <div
                                                      className="relative flex shrink-0 items-center"
                                                      style={{
                                                        isolation: "isolate",
                                                        paddingRight: "1px",
                                                      }}
                                                    >
                                                      <div
                                                        className="relative shrink-0 rounded-full"
                                                        style={{
                                                          width: "9px",
                                                          height: "9px",
                                                          marginLeft: "0px",
                                                          zIndex: 1,
                                                          backgroundColor: "rgb(74, 143, 212)",
                                                          border: "1px solid var(--color-theme-bg)",
                                                          boxSizing: "border-box",
                                                        }}
                                                      />
                                                      <div
                                                        className="relative shrink-0 rounded-full"
                                                        style={{
                                                          width: "9px",
                                                          height: "9px",
                                                          marginLeft: "-3.5px",
                                                          zIndex: 2,
                                                          backgroundColor: "rgb(31, 138, 101)",
                                                          border: "1px solid var(--color-theme-bg)",
                                                          boxSizing: "border-box",
                                                        }}
                                                      />
                                                      <div
                                                        className="relative shrink-0 rounded-full"
                                                        style={{
                                                          width: "9px",
                                                          height: "9px",
                                                          marginLeft: "-3.5px",
                                                          zIndex: 3,
                                                          backgroundColor: "rgb(212, 160, 23)",
                                                          border: "1px solid var(--color-theme-bg)",
                                                          boxSizing: "border-box",
                                                        }}
                                                      />
                                                      <div
                                                        className="relative shrink-0 rounded-full"
                                                        style={{
                                                          width: "9px",
                                                          height: "9px",
                                                          marginLeft: "-3.5px",
                                                          zIndex: 4,
                                                          backgroundColor: "rgb(192, 132, 252)",
                                                          border: "1px solid var(--color-theme-bg)",
                                                          boxSizing: "border-box",
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="flex min-h-0 flex-1 px-[3px] pt-[6px] pb-[2px]">
                                                    <div
                                                      className="relative mx-auto h-full w-[72%] rounded-[2px] px-[5px] pt-[5px]"
                                                      style={{
                                                        backgroundColor: "var(--color-theme-bg)",
                                                        borderTop:
                                                          "0.5px solid color-mix(in srgb, var(--color-theme-fg) 12%, transparent)",
                                                      }}
                                                    >
                                                      <div
                                                        className="mb-[4px] h-[3px] w-[58%] rounded-sm"
                                                        style={{
                                                          backgroundColor: "var(--color-theme-fg)",
                                                          opacity: 0.14,
                                                        }}
                                                      />
                                                      <div className="flex flex-col gap-[2.5px]">
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm"
                                                            style={{
                                                              width: "90%",
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm"
                                                            style={{
                                                              width: "78%",
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm transition-all duration-300"
                                                            style={{
                                                              width: `${Math.min(92, blueCursorLeft + 30)}%`,
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute top-0 h-[2px] w-[1px] transition-all duration-300"
                                                            style={{
                                                              left: `${blueCursorLeft}%`,
                                                              backgroundColor: "rgb(74, 143, 212)",
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute -top-[3px] h-[2px] rounded-full transition-all duration-300"
                                                            style={{
                                                              left: `calc(${blueCursorLeft}% + 1px)`,
                                                              width: "11px",
                                                              backgroundColor: "rgb(74, 143, 212)",
                                                              opacity: 0.22,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm"
                                                            style={{
                                                              width: "47%",
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm transition-all duration-300"
                                                            style={{
                                                              width: `${Math.min(88, greenCursorLeft + 9)}%`,
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute top-0 h-[2px] w-[1px] transition-all duration-300"
                                                            style={{
                                                              left: `${greenCursorLeft}%`,
                                                              backgroundColor: "rgb(31, 138, 101)",
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute -top-[3px] h-[2px] rounded-full transition-all duration-300"
                                                            style={{
                                                              left: `calc(${greenCursorLeft}% + 1px)`,
                                                              width: "11px",
                                                              backgroundColor: "rgb(31, 138, 101)",
                                                              opacity: 0.22,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm"
                                                            style={{
                                                              width: "86%",
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm transition-all duration-300"
                                                            style={{
                                                              width: `${Math.min(85, amberCursorLeft + 15)}%`,
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute top-0 h-[2px] w-[1px] transition-all duration-300"
                                                            style={{
                                                              left: `${amberCursorLeft}%`,
                                                              backgroundColor: "rgb(212, 160, 23)",
                                                            }}
                                                          />
                                                          <div
                                                            className="absolute -top-[3px] h-[2px] rounded-full transition-all duration-300"
                                                            style={{
                                                              left: `calc(${amberCursorLeft}% + 1px)`,
                                                              width: "11px",
                                                              backgroundColor: "rgb(212, 160, 23)",
                                                              opacity: 0.22,
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="relative h-[2px]">
                                                          <div
                                                            className="h-full rounded-sm"
                                                            style={{
                                                              width: "74%",
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="mt-[5px] flex items-start gap-[3px]">
                                                        <div
                                                          className="h-[12px] w-[12px] shrink-0 rounded-[2px]"
                                                          style={{
                                                            backgroundColor:
                                                              "color-mix(in srgb, var(--color-theme-fg) 6%, transparent)",
                                                            border:
                                                              "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                                          }}
                                                        />
                                                        <div className="flex flex-1 flex-col gap-[2px] pt-[1px]">
                                                          <div
                                                            className="h-[2px] w-[84%] rounded-sm"
                                                            style={{
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                          <div
                                                            className="h-[2px] w-[60%] rounded-sm"
                                                            style={{
                                                              backgroundColor: "var(--color-theme-fg)",
                                                              opacity: 0.1,
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <style dangerouslySetInnerHTML={{ __html: CURSOR_ICONS_STYLE }} />

                                          {/* Bottom dock */}
                                          <div
                                            className="absolute left-1/2 z-10 bottom-1"
                                            style={{
                                              transform: "translateX(-50%) scale(1)",
                                              transformOrigin: "center bottom",
                                            }}
                                          >
                                            <div className="rd-interactive flex items-center bg-black/15 ring-1 ring-white/10 backdrop-blur-[6px] backdrop-saturate-150 gap-0.5 rounded-[5px] px-1 py-0.5">
                                              <div className="flex cursor-pointer items-center justify-center transition-all duration-300 bg-white/20 size-3.5 rounded-[4px]">
                                                <div className="flex items-center justify-center transition-all duration-300 opacity-40 [&_*:not(style)]:!h-[8px] [&_*:not(style)]:!w-[8px] [&_*:not(style)]:!text-[8px]">
                                                  <span
                                                    className="text-white"
                                                    style={{
                                                      fontFamily: "CursorIcons16",
                                                      fontSize: "16px",
                                                      lineHeight: 1,
                                                      display: "inline-block",
                                                      width: "16px",
                                                      height: "16px",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex cursor-pointer items-center justify-center transition-all duration-300 bg-white/20 size-3.5 rounded-[4px]">
                                                <div className="flex items-center justify-center transition-all duration-300 opacity-40 [&_*:not(style)]:!h-[8px] [&_*:not(style)]:!w-[8px] [&_*:not(style)]:!text-[8px]">
                                                  <span
                                                    className="text-white"
                                                    style={{
                                                      fontFamily: "CursorIcons16",
                                                      fontSize: "16px",
                                                      lineHeight: 1,
                                                      display: "inline-block",
                                                      width: "16px",
                                                      height: "16px",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Play button overlay */}
                                        <div
                                          className="absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-200"
                                          style={{ opacity: isPlayingDemo ? 0 : 1 }}
                                        >
                                          <div className="flex items-center justify-center rounded-full bg-black/50 transition-all duration-150 hover:scale-110 h-8 w-8">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              fill="currentColor"
                                              viewBox="0 0 256 256"
                                              className="-ml-px text-white"
                                            >
                                              <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ opacity: 1, transform: "none" }}>
                                    <div>
                                      <div className="type-product-lg text-theme-text leading-snug font-medium">
                                        Summary
                                      </div>
                                      <div className="type-product-lg text-theme-text mt-1 leading-snug">
                                        Added real-time collaboration to the note-taking app with WebSocket syncing, rich text editing, and version history.
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
                </figure>
              </div>
            </div>

            {/* Card 2: Remote desktop control */}
            <div className="undefined h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Remote desktop control</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Interact with the software from the agent&apos;s remote desktop, without checking out the branch locally.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 max-h-mobile"
                    style={
                      {
                        "--layered-media-bg-light": "#B6B9BE",
                        "--layered-media-bg-dark": "#3C3935",
                        "--max-h-mobile": "420px",
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="media-light absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(182, 185, 190)" }}
                    />
                    <div
                      className="media-dark absolute inset-0 z-0"
                      style={{ backgroundColor: "rgb(60, 57, 53)" }}
                    />
                    <div className="z-20 col-span-full row-span-full h-full min-h-0">
                      <div
                        className="bg-theme-card-02-hex flex w-full items-center justify-center p-4"
                        style={{
                          height: "378px",
                          fontFamily: "var(--font-system)",
                        }}
                      >
                        <div
                          className="bg-theme-product-chrome flex w-full max-w-[430px] flex-col overflow-hidden rounded-[5px] xl:max-w-[520px]"
                          style={{
                            boxShadow:
                              "rgba(0, 0, 0, 0.15) 0px 4px 16px, rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px",
                          }}
                        >
                          <div
                            className="flex h-5 shrink-0 items-center px-2"
                            style={{
                              borderBottom:
                                "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                            }}
                          >
                            <div className="flex items-center gap-[3px]">
                              <div
                                className="h-[5px] w-[5px] rounded-full"
                                style={{
                                  backgroundColor: "var(--color-theme-fg)",
                                  opacity: 0.15,
                                }}
                              />
                              <div
                                className="h-[5px] w-[5px] rounded-full"
                                style={{
                                  backgroundColor: "var(--color-theme-fg)",
                                  opacity: 0.15,
                                }}
                              />
                              <div
                                className="h-[5px] w-[5px] rounded-full"
                                style={{
                                  backgroundColor: "var(--color-theme-fg)",
                                  opacity: 0.15,
                                }}
                              />
                            </div>
                            <span className="flex-1" aria-hidden="true" />
                            <div className="w-[27px]" />
                          </div>
                          <div
                            className="group/desktop relative max-h-full w-full overflow-hidden rounded-md aspect-[4/3] !rounded-none"
                            style={
                              {
                                "--rd-base-width": "359.65625px",
                                "--rd-base-height": "269.734375px",
                                "--rd-content-scale": 1,
                              } as React.CSSProperties
                            }
                            onMouseMove={handleDesktopPointerMove}
                            onMouseLeave={() => {
                              if (isControllingDesktop) {
                                setIsControllingDesktop(false);
                                setCursorPos({ left: 15, top: 76 });
                              }
                            }}
                          >
                            <img
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                              draggable={false}
                              src="/sites/cursor/blob/assets/wallpapers/cloud-agents-4.webp"
                            />

                            {/* Terminal window ($ npm run dev) */}
                            <div
                              className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px] transition-shadow duration-150"
                              style={{
                                top: "9%",
                                left: "46%",
                                width: "40%",
                                height: "42%",
                                zIndex: activeDesktopWindow === "terminal" ? 5 : 2,
                                boxShadow:
                                  "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                              }}
                              onClick={() => {
                                if (isControllingDesktop) {
                                  setActiveDesktopWindow("terminal");
                                }
                              }}
                            >
                              <div
                                className="flex origin-top-left flex-col"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  transform: "scale(1)",
                                }}
                              >
                                <div
                                  className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
                                  style={{
                                    borderBottom:
                                      "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                  }}
                                >
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                </div>
                                <div
                                  className="flex-1 px-[4px] pt-[3px] pb-0"
                                  style={{
                                    fontFamily:
                                      "var(--font-berkeley-mono, var(--font-mono, ui-monospace, monospace))",
                                    fontSize: "5px",
                                    lineHeight: 1.35,
                                    letterSpacing: "-0.02em",
                                    color: "var(--color-theme-fg)",
                                  }}
                                >
                                  <div className="space-y-[1px] whitespace-nowrap">
                                    <div style={{ opacity: 0.4 }}>$ npm run dev</div>
                                    <div style={{ opacity: 0.25 }}>
                                      ready - started on 0.0.0.0:3000
                                    </div>
                                    <div style={{ opacity: 0.25 }}>✓ compiled in 1.2s</div>
                                    <div style={{ opacity: 0.25 }}>
                                      ○ compiling /dashboard...
                                    </div>
                                    <div style={{ opacity: 0.25 }}>✓ compiled in 340ms</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dashboard window */}
                            <div
                              className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px] transition-shadow duration-150"
                              style={{
                                top: "24%",
                                left: "9%",
                                width: "56%",
                                height: "58%",
                                zIndex: activeDesktopWindow === "dashboard" ? 4 : 3,
                                boxShadow:
                                  "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                              }}
                              onClick={() => {
                                if (isControllingDesktop) {
                                  setActiveDesktopWindow("dashboard");
                                }
                              }}
                            >
                              <div
                                className="flex origin-top-left flex-col"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  transform: "scale(1)",
                                }}
                              >
                                <div
                                  className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
                                  style={{
                                    borderBottom:
                                      "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                  }}
                                >
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                  <div
                                    className="h-[3px] w-[3px] rounded-full"
                                    style={{
                                      backgroundColor: "var(--color-theme-fg)",
                                      opacity: 0.15,
                                    }}
                                  />
                                </div>
                                <div className="flex flex-1 overflow-hidden">
                                  <div
                                    className="flex w-[22%] shrink-0 flex-col gap-[3px] p-[4px]"
                                    style={{
                                      borderRight:
                                        "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                    }}
                                  >
                                    <div
                                      className="h-[2px] w-[70%] rounded-sm"
                                      style={{
                                        backgroundColor: "var(--color-theme-fg)",
                                        opacity: 0.12,
                                      }}
                                    />
                                    <div
                                      className="h-[2px] w-[50%] rounded-sm"
                                      style={{
                                        backgroundColor: "var(--color-theme-fg)",
                                        opacity: 0.06,
                                      }}
                                    />
                                    <div
                                      className="h-[2px] w-[60%] rounded-sm"
                                      style={{
                                        backgroundColor: "var(--color-theme-fg)",
                                        opacity: 0.06,
                                      }}
                                    />
                                    <div
                                      className="h-[2px] w-[45%] rounded-sm"
                                      style={{
                                        backgroundColor: "var(--color-theme-fg)",
                                        opacity: 0.06,
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 p-[5px]">
                                    <div className="mb-[4px] flex gap-[3px]">
                                      <div
                                        className="flex-1 rounded-[2px] p-[3px]"
                                        style={{
                                          border:
                                            "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                        }}
                                      >
                                        <div
                                          className="mb-[2px] h-[1.5px] w-[50%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.08,
                                          }}
                                        />
                                        <div
                                          className="h-[2px] w-[70%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.12,
                                          }}
                                        />
                                      </div>
                                      <div
                                        className="flex-1 rounded-[2px] p-[3px]"
                                        style={{
                                          border:
                                            "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                        }}
                                      >
                                        <div
                                          className="mb-[2px] h-[1.5px] w-[50%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.08,
                                          }}
                                        />
                                        <div
                                          className="h-[2px] w-[60%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.12,
                                          }}
                                        />
                                      </div>
                                      <div
                                        className="flex-1 rounded-[2px] p-[3px]"
                                        style={{
                                          border:
                                            "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                        }}
                                      >
                                        <div
                                          className="mb-[2px] h-[1.5px] w-[50%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.08,
                                          }}
                                        />
                                        <div
                                          className="h-[2px] w-[65%] rounded-sm"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.12,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className="mb-[4px] rounded-[2px]"
                                      style={{
                                        height: "40%",
                                        backgroundColor:
                                          "color-mix(in srgb, var(--color-theme-fg) 4%, transparent)",
                                        border:
                                          "0.5px solid color-mix(in srgb, var(--color-theme-fg) 6%, transparent)",
                                      }}
                                    />
                                    <div className="flex flex-col gap-[2px]">
                                      {[75, 60, 50, 65].map((widthPct, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-[3px]"
                                          style={{
                                            borderBottom:
                                              "0.5px solid color-mix(in srgb, var(--color-theme-fg) 5%, transparent)",
                                          }}
                                        >
                                          <div
                                            className="h-[1.5px] w-[8px] shrink-0 rounded-sm"
                                            style={{
                                              backgroundColor: "var(--color-theme-fg)",
                                              opacity: 0.08,
                                            }}
                                          />
                                          <div
                                            className="h-[1.5px] rounded-sm"
                                            style={{
                                              width: `${widthPct}%`,
                                              backgroundColor: "var(--color-theme-fg)",
                                              opacity: 0.06,
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Animated Agent cursor */}
                            <div
                              className="pointer-events-none absolute z-20 mt-1.5"
                              style={{
                                left: `${cursorPos.left}%`,
                                top: `${cursorPos.top}%`,
                                transition: isControllingDesktop
                                  ? "left 60ms linear, top 60ms linear"
                                  : "left 300ms ease, top 300ms ease",
                              }}
                            >
                              <div className="flex items-start gap-0">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  data-cursor-arrow=""
                                  className="-scale-x-100 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)] shrink-0 transition-opacity duration-200"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.4775 2.375C15.1508 2.37522 15.5719 3.10428 15.2353 3.6875L8.63861 15.1143C8.19099 15.8892 7.00618 15.5716 7.00579 14.6768V7.56348L0.845638 4.00781C0.0708241 3.56015 0.388339 2.37535 1.28314 2.375H14.4775ZM7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                    fill="#1a1a1a"
                                  />
                                </svg>
                                <span className="mt-2.5 -ml-0.5 whitespace-nowrap rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                                  {isControllingDesktop ? "You" : "Agent"}
                                </span>
                              </div>
                            </div>

                            {/* Take control overlay button */}
                            {!isControllingDesktop && (
                              <div
                                className="absolute inset-0 z-25 flex cursor-pointer items-center justify-center"
                                role="button"
                                tabIndex={0}
                                aria-label="Take control"
                                onClick={() => setIsControllingDesktop(true)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setIsControllingDesktop(true);
                                  }
                                }}
                              >
                                <div className="rd-interactive pointer-events-none flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-[8px] transition-all group-hover/desktop:scale-105 group-hover/desktop:bg-black/60 opacity-100">
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="-scale-x-100"
                                  >
                                    <path
                                      d="M7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                      fill="white"
                                    />
                                  </svg>
                                  Take control
                                </div>
                              </div>
                            )}

                            <style dangerouslySetInnerHTML={{ __html: CURSOR_ICONS_STYLE }} />
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

      {/* Section 5: Recent highlights */}
      <section className="section bg-theme-card-hex text-theme-text">
        <div className="container">
          <div className="grid-cursor gap-0">
            <div className="col-span-full md:col-start-1 md:col-end-7 lg:col-start-1 lg:col-end-9 xl:col-start-1 xl:col-end-7">
              <h2 className="type-base text-theme-text mb-v1 sticky top-[var(--site-sticky-top)] lg:mb-0">
                Recent highlights
              </h2>
            </div>
            <div className="col-span-full md:col-start-7 md:col-end-25 lg:col-start-9 lg:col-end-25 xl:col-start-7 xl:col-end-19">
              <article className="flex grow-1 flex-col mb-g1">
                <a
                  className="card card--text grow-1 card--bg-02 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                  href="/blog/third-era"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        The third era of AI software development
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        A third era of AI software development is emerging as autonomous cloud agents take on larger tasks over longer timescales.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="capitalize">Ideas&nbsp;·&nbsp;</span>
                      <time dateTime="2026-02-26T19:35:24.000Z" className="type-base">
                        Feb 26, 2026
                      </time>
                    </div>
                  </div>
                </a>
              </article>
              <article className="flex grow-1 flex-col mb-g1">
                <a
                  className="card card--text grow-1 card--bg-02 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                  href="/blog/agent-computer-use"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        Cursor agents can now control their own computers
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        Cloud agents use the software they create to verify changes and demo their work.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="capitalize">Product&nbsp;·&nbsp;</span>
                      <time dateTime="2026-02-24T00:00:00.000Z" className="type-base">
                        Feb 24, 2026
                      </time>
                    </div>
                  </div>
                </a>
              </article>
              <article className="flex grow-1 flex-col">
                <a
                  className="card card--text grow-1 card--bg-02 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                  href="/blog/bugbot-autofix"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        Closing the code review loop with Bugbot Autofix
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        Bugbot Autofix can find and automatically fix issues in PRs by spawning cloud agents to test your changes.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="capitalize">Product&nbsp;·&nbsp;</span>
                      <time dateTime="2026-02-26T12:00:00.000Z" className="type-base">
                        Feb 26, 2026
                      </time>
                    </div>
                  </div>
                </a>
              </article>
              <a className="btn-text mt-v1 inline-flex" href="/blog">
                View more posts →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Try cloud agents. */}
      <section className="section bg-theme-bg text-theme-text section--headline">
        <div className="container">
          <div className="text-center mx-auto max-w-prose-medium-wide">
            <h2 className="type-xl sm:type-2xl text-balance mx-auto mb-v1">
              Try cloud agents.
            </h2>
            <div className="flex justify-center gap-x-g1 items-center">
              <a href="https://cursor.com/agents" className="btn">
                Get started
                <div aria-hidden="true" className="btn-icon">
                  <span className="" aria-hidden="true">
                    →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
