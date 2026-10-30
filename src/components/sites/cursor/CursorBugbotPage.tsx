"use client";

import React, { useEffect, useRef, useState } from "react";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import { BUGBOT_LOGO_GARDEN_HTML } from "./bugbot/bugbotLogoHtml";

const LOGO_GARDEN_INNER_HTML = BUGBOT_LOGO_GARDEN_HTML.replace(
  /^<section[^>]*>|<\/section>$/g,
  ""
);

interface TestimonialQuote {
  quote: string;
  author: string;
  role: string;
  avatarSrc: string;
}

const SOCIAL_QUOTES: TestimonialQuote[] = [
  {
    quote:
      "The hit rate from Bugbot is insane. Catching bugs early saves huge downstream cost.",
    author: "David Cramer",
    role: "Co-Founder & CPO, Sentry",
    avatarSrc: "/sites/cursor/blob/assets/misc/asset-6995f3620e1a2ad598b0.webp",
  },
  {
    quote:
      "Bugbot is particularly helpful for large MRs. The summary it generates accurately describes the actual code changes. I've seen it catch implementation errors that received a pass of human code review.",
    author: "Tim Froehliche",
    role: "Staff Engineer, Maven",
    avatarSrc: "/sites/cursor/blob/assets/avatars/tim-froehlich-avatar.jpeg",
  },
  {
    quote: "Bugbot helps give back 40% of time spent on code reviews.",
    author: "Ankur Bhatt",
    role: "Head of AI Engineering, Rippling",
    avatarSrc: "/sites/cursor/blob/assets/misc/asset-3a170211ccca18f65735.jpg",
  },
  {
    quote:
      "Bugbot finds real bugs after human approval. Avoiding one sev pays for itself.",
    author: "Kodie Goodwin",
    role: "AI Engineering Leader, Discord",
    avatarSrc: "/sites/cursor/blob/assets/misc/asset-f94bba6b4353915fb140.jpg",
  },
  {
    quote: "Incredibly strong at reviewing AI-generated code.",
    author: "Vijay Iyengar",
    role: "AI Engineering Leader, Sierra",
    avatarSrc: "/sites/cursor/blob/assets/misc/asset-a3dd9b9ce97e7903fdf8.jpg",
  },
  {
    quote:
      "Bugbot finds really solid issues, not just in the files or lines of code directly touched by a PR, but also in how the changes interact with existing components and assumptions made elsewhere in the code.",
    author: "Prabhav Chawla",
    role: "Engineer, Decagon",
    avatarSrc: "/sites/cursor/blob/assets/avatars/prabhav-chawla-avatar.jpeg",
  },
];

interface FaqItem {
  id: string;
  panelId: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "radix-_r_1_",
    panelId: "radix-_r_2_",
    question: "How does Bugbot integrate with my existing workflow?",
    answer:
      "Bugbot finds bugs directly in GitHub. It automatically reviews PRs, comments on potential issues, and provides fixes directly in your Cursor editor or through our Background Agent.",
  },
  {
    id: "radix-_r_3_",
    panelId: "radix-_r_4_",
    question: "Can I customize how Bugbot does reviews?",
    answer:
      "Yes! Bugbot Rules allows you to define custom coding standards, enforce proven approaches, and set up project-specific guidelines to match your team's needs.",
  },
  {
    id: "radix-_r_5_",
    panelId: "radix-_r_6_",
    question: "How accurate is Bugbot's bug detection?",
    answer:
      "Bugbot uses a combination of frontier and in-house models to review code. More than half of the bugs that we find are ultimately fixed by engineers.",
  },
  {
    id: "radix-_r_7_",
    panelId: "radix-_r_8_",
    question: "Can I try Bugbot before purchasing?",
    answer:
      "Bugbot is usage-based on Individual and Teams plans, so there's no separate Bugbot subscription. On Individual plans, reviews use your plan's included usage first, then on-demand usage if you've turned it on. On Teams plans, reviews bill from on-demand usage. The average review costs $1.00–$1.50, depending on PR size and complexity. Enterprise teams can arrange a Bugbot trial through their account team.",
  },
];

export function CursorBugbotPage() {
  const [heartCount, setHeartCount] = useState<number>(3);
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});
  const [bugbotCheckRunning, setBugbotCheckRunning] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBugbotCheckRunning((prev) => !prev);
    }, 3600);
    return () => window.clearInterval(interval);
  }, []);

  const handleWindowPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if ((event.target as HTMLElement).closest("button, a")) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: dragOffset.x,
      originY: dragOffset.y,
    };
  };

  const handleWindowPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragStartRef.current) return;
    const dx = event.clientX - dragStartRef.current.startX;
    const dy = event.clientY - dragStartRef.current.startY;
    setDragOffset({
      x: Math.max(-180, Math.min(180, dragStartRef.current.originX + dx)),
      y: Math.max(-90, Math.min(90, dragStartRef.current.originY + dy)),
    });
  };

  const handleWindowPointerUp = () => {
    dragStartRef.current = null;
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const heroStageStyle: React.CSSProperties & { "--demo-pad": string } = {
    height: "min(780px, 70vh)",
    minHeight: 650,
    "--demo-pad": "32px",
  };

  const rulesStageStyle: React.CSSProperties & { "--demo-pad": string } = {
    height: 378,
    "--demo-pad": "0px",
  };

  return (
    <>
      <CursorHeader />

      <div className="section section--breadcrumb">
        <nav className="container">
          <ol className="flex items-center">
            <li>
              <span className="text-theme-text-sec" aria-current="page">
                Bugbot
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <main id="main" lang="en-US">
        {/* Section 0: Hero + Interactive GitHub Pull Request Demo */}
        <section className="section bg-theme-bg text-theme-text">
          <div className="container">
            <div className="text-left mb-v2.5 max-w-prose-medium-wide">
              <h1 className="type-lg text-balance">
                AI code review that catches real bugs
              </h1>
              <div className="flex justify-start mb-v1">
                <div className="type-lg text-theme-text-sec stack text-balance">
                  Bugbot detects the hardest logic bugs with a low false
                  positive rate.
                </div>
              </div>
              <div className="flex justify-start gap-x-g1 items-center">
                <a href="https://cursor.com/dashboard/bugbot" className="btn">
                  Get started with Bugbot
                  <div aria-hidden="true" className="btn-icon">
                    <span aria-hidden="true">→</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
                <div className="z-20 col-span-full row-span-full h-full min-h-0">
                  <div
                    className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                    data-demo-pad-scope="_r_0_"
                    style={heroStageStyle}
                  >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        alt=""
                        decoding="async"
                        className="media-light absolute inset-0 object-cover"
                        sizes="100vw"
                        src="/sites/cursor/blob/assets/misc/asset-00a586c62c8782e65c0a.jpg"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: "0px",
                          color: "transparent",
                        }}
                      />
                      <img
                        alt=""
                        decoding="async"
                        className="media-dark absolute inset-0 object-cover"
                        sizes="100vw"
                        src="/sites/cursor/blob/assets/misc/asset-00a586c62c8782e65c0a.jpg"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: "0px",
                          color: "transparent",
                        }}
                      />
                    </div>

                    <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full max-[767px]:pointer-events-none max-[767px]:opacity-0">
                      <div className="sr-only" aria-live="polite">
                        This element contains an interactive demo for sighted
                        users. It&apos;s a demonstration of Cursor integrated
                        within GitHub, showing AI-powered code review and
                        debugging assistance. The interface is displayed over a
                        scenic painted landscape wallpaper, giving the demo an
                        artistic backdrop.
                      </div>

                      <div
                        aria-hidden="true"
                        id="demo-window-github-pr"
                        className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                        style={{
                          left: "clamp(calc(var(--demo-pad) + 340px), 50%, calc(100% - var(--demo-pad) - 340px))",
                          top: "clamp(calc(var(--demo-pad) + 237.5px), 50%, calc(100% - var(--demo-pad) - 237.5px))",
                          width: "680px",
                          minWidth: "420px",
                          height: "475px",
                          maxHeight: "calc(100% - 2 * var(--demo-pad))",
                          minHeight: "260px",
                          transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px)) scale(1)`,
                          transformOrigin: "center center",
                          zIndex: 15,
                          boxShadow:
                            "0 28px 70px rgba(0, 0, 0, 0.14), 0 14px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--color-theme-border-02)",
                        }}
                      >
                        <div
                          className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-grab active:cursor-grabbing"
                          onPointerDown={handleWindowPointerDown}
                          onPointerMove={handleWindowPointerMove}
                          onPointerUp={handleWindowPointerUp}
                          onPointerCancel={handleWindowPointerUp}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: "var(--color-theme-fg-20)",
                              }}
                            />
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: "var(--color-theme-fg-20)",
                              }}
                            />
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: "var(--color-theme-fg-20)",
                              }}
                            />
                          </div>
                          <div className="type-product-base pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 truncate text-center opacity-70">
                            GitHub Pull Request
                          </div>
                          <div className="-mr-1 flex items-center">
                            <button
                              type="button"
                              onClick={() => {
                                window.location.href =
                                  "https://cursor.com/dashboard/bugbot";
                              }}
                              className="transition-opacity duration-200 type-product-base rounded px-2 py-1 text-theme-text-sec hover:bg-theme-bg-hover cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              Get BugBot
                            </button>
                          </div>
                        </div>

                        <div
                          className="min-h-0 w-full flex-1 overflow-hidden"
                          data-demo-desktop-content="true"
                        >
                          <div className="h-full min-h-0 w-full">
                            <div className="w-full h-full overflow-hidden">
                              <div className="type-product-base text-theme-text h-full px-5 pt-5 pb-6 overflow-hidden">
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
                                        style={{ color: "transparent" }}
                                      />
                                    </div>
                                    <div className="w-px flex-1 bg-theme-border-02 min-h-2" />
                                  </div>
                                  <div className="flex-1 min-w-0 pb-3">
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
                                              reviewed 1 hour ago
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mx-3 mt-3 mb-2 rounded overflow-hidden border border-theme-border-02">
                                          <div className="px-2.5 py-1.5 bg-theme-card-02-hex border-b border-theme-border-02">
                                            <span className="text-[11px] font-berkeley-mono text-theme-text-ter/60 tracking-tight truncate block">
                                              src/waymo/planner/route.ts
                                            </span>
                                          </div>
                                          <div className="font-berkeley-mono text-[11px] tracking-tight bg-theme-card-hex">
                                            <div className="flex">
                                              <div
                                                className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                style={{
                                                  backgroundColor: "transparent",
                                                }}
                                              >
                                                4
                                              </div>
                                              <div
                                                className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              />
                                              <div
                                                className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              >
                                                {
                                                  "const DEFAULT_ROUTE_OPTIONS = { maxSpeed: 65, avoidTolls: false };"
                                                }
                                              </div>
                                            </div>
                                            <div className="flex">
                                              <div
                                                className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                style={{
                                                  backgroundColor: "transparent",
                                                }}
                                              >
                                                5
                                              </div>
                                              <div
                                                className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              />
                                              <div
                                                className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              >
                                                {
                                                  "export function planWaymoRoute(dest, options = {}) {"
                                                }
                                              </div>
                                            </div>
                                            <div className="flex">
                                              <div
                                                className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                style={{
                                                  backgroundColor:
                                                    "var(--color-theme-product-removed-line-background)",
                                                }}
                                              >
                                                6
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
                                                {
                                                  "  return planner.compute({ ...DEFAULT_ROUTE_OPTIONS, ...options });"
                                                }
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
                                                6
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
                                                {
                                                  "  return planner.compute(Object.assign(DEFAULT_ROUTE_OPTIONS, options));"
                                                }
                                              </div>
                                            </div>
                                            <div className="flex">
                                              <div
                                                className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                style={{
                                                  backgroundColor: "transparent",
                                                }}
                                              >
                                                7
                                              </div>
                                              <div
                                                className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              />
                                              <div
                                                className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              >
                                                {"}"}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="px-3 pt-1 pb-3">
                                          <h4 className="text-theme-text font-semibold text-[15px] leading-snug mb-1.5">
                                            Route settings leak between riders
                                          </h4>
                                          <p className="text-[13px] text-theme-text leading-relaxed">
                                            Using{" "}
                                            <code className="px-1 py-0.5 rounded bg-theme-card-02-hex text-[12px] font-berkeley-mono">
                                              Object.assign
                                            </code>{" "}
                                            mutates the shared{" "}
                                            <code className="px-1 py-0.5 rounded bg-theme-card-02-hex text-[12px] font-berkeley-mono">
                                              DEFAULT_ROUTE_OPTIONS
                                            </code>{" "}
                                            object in place. One rider&apos;s
                                            route preferences will leak to all
                                            subsequent trips.
                                          </p>
                                          <div className="mt-2.5">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setHeartCount(
                                                  (count) => count + 1
                                                )
                                              }
                                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-theme-card-02-hex border border-theme-border-02 text-[12px] hover:bg-theme-card-03-hex hover:border-theme-border-02-5 active:scale-95 cursor-pointer transition-all"
                                            >
                                              <span>❤️</span>
                                              <span className="text-theme-text-ter tabular-nums">
                                                {heartCount}
                                              </span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="relative flex gap-3">
                                  <div className="flex flex-col items-center w-8 flex-shrink-0">
                                    <img
                                      alt=""
                                      loading="lazy"
                                      width={32}
                                      height={32}
                                      decoding="async"
                                      className="h-8 w-8 rounded-full"
                                      src="/marketing-static/users/jon-kaplan.jpg"
                                      style={{ color: "transparent" }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                      <div className="px-3 py-1.5 bg-theme-card-02-hex/50 border-b border-theme-border-02">
                                        <div
                                          className="flex items-baseline gap-1.5"
                                          style={{ fontSize: "13px" }}
                                        >
                                          <span className="text-theme-text font-semibold">
                                            jonkaplan
                                          </span>
                                          <span className="text-theme-text-ter/60">
                                            just now
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="px-3 py-2 text-theme-text"
                                        style={{ fontSize: "13px" }}
                                      >
                                        checks out, let&apos;s push to prod
                                      </div>
                                      <div className="px-3 pb-2 flex gap-1.5">
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-theme-card-02-hex border border-theme-border-02 text-[11px]">
                                          <span>✅</span>
                                          <span className="text-theme-text-ter">
                                            1
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

                      <div className="pointer-events-none absolute inset-0 z-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Logo Garden */}
        <section
          className="section bg-theme-bg text-theme-text pb-v1.5 pt-0"
          id="logo-garden"
          dangerouslySetInnerHTML={{ __html: LOGO_GARDEN_INNER_HTML }}
        />

        {/* Section 2: Features */}
        <section className="section" id="features">
          <section className="section bg-theme-bg text-theme-text section--flush">
            <div className="container my-v2">
              <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
                {/* Card 0: Ship with confidence */}
                <div className="h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>Ship with confidence</h2>
                        <div className="text-theme-text-sec text-pretty">
                          When enabled, Bugbot automatically runs AI code review
                          in the background on new PRs.
                        </div>
                      </div>
                    </div>
                    <figure className="pt-g1.75">
                      <div
                        className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-03-hex"
                        style={{ height: "378px" }}
                      >
                        <div className="z-20 col-span-full row-span-full h-full min-h-0">
                          <div className="h-full w-full p-4 flex justify-center">
                            <div className="h-full w-full max-w-sm rounded-lg bg-theme-card-03-hex overflow-hidden">
                              <div
                                className="w-full h-full overflow-hidden"
                                style={{ height: "100%" }}
                              >
                                <div
                                  className="type-product-base text-theme-text h-full px-3 pt-3 pb-5 overflow-hidden"
                                  style={{ fontSize: "13px" }}
                                >
                                  <div className="relative flex gap-3">
                                    <div className="flex flex-col items-center w-8 flex-shrink-0">
                                      <img
                                        alt=""
                                        loading="lazy"
                                        width={32}
                                        height={32}
                                        decoding="async"
                                        className="h-8 w-8 rounded-full"
                                        src="/marketing-static/users/ryo.png"
                                        style={{ color: "transparent" }}
                                      />
                                      <div className="w-px flex-1 bg-theme-border-02 mt-2 min-h-2" />
                                    </div>
                                    <div className="flex-1 min-w-0 pb-3">
                                      <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                        <div className="px-3 py-1.5 bg-theme-card-02-hex border-b border-theme-border-02">
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="text-theme-text font-semibold">
                                              ryokun6
                                            </span>
                                            <span className="text-theme-text-ter/60">
                                              7 minutes ago
                                            </span>
                                          </div>
                                        </div>
                                        <div className="px-3 py-2 text-theme-text">
                                          just one more thing!
                                        </div>
                                      </div>
                                      <div className="mt-3 flex items-center gap-2">
                                        <div className="relative flex flex-col items-center flex-shrink-0">
                                          <div className="w-px h-2 bg-theme-border-02 absolute -top-2" />
                                          <div className="h-6 w-6 rounded-full bg-theme-card-02-hex/70 flex items-center justify-center">
                                            <svg
                                              className="h-3 w-3 text-theme-text-quat"
                                              viewBox="0 0 16 16"
                                              fill="currentColor"
                                            >
                                              <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
                                            </svg>
                                          </div>
                                          <div className="w-px h-3 bg-theme-border-02 absolute -bottom-3" />
                                        </div>
                                        <div className="flex items-center -space-x-1.5 flex-shrink-0">
                                          <img
                                            alt="Cursor"
                                            loading="lazy"
                                            width={20}
                                            height={20}
                                            decoding="async"
                                            className="h-5 w-5 rounded-full ring-2 ring-theme-card-03-hex"
                                            src="/marketing-static/icon-192x192.png"
                                            style={{ color: "transparent" }}
                                          />
                                          <img
                                            alt=""
                                            loading="lazy"
                                            width={20}
                                            height={20}
                                            decoding="async"
                                            className="h-5 w-5 rounded-full ring-2 ring-theme-card-03-hex"
                                            src="/marketing-static/users/ryo.png"
                                            style={{ color: "transparent" }}
                                          />
                                        </div>
                                        <span className="inline-flex items-center gap-1">
                                          <span className="text-theme-text font-semibold">
                                            ryokun6
                                          </span>
                                          <span className="text-theme-text-ter/60">
                                            committed
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="relative flex gap-3">
                                    <div className="flex flex-col items-center w-8 flex-shrink-0">
                                      <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 bg-[#1a7f37] dark:bg-[#238636]">
                                        <svg
                                          className="h-4 w-4 transition-colors duration-300 text-white"
                                          viewBox="0 0 16 16"
                                          fill="currentColor"
                                        >
                                          <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                        <div className="px-3 py-3 flex items-start gap-3 bg-theme-card-02-hex/50">
                                          <div className="h-6 w-6 flex-shrink-0">
                                            <svg
                                              className="h-6 w-6"
                                              viewBox="0 0 24 24"
                                            >
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                className="text-[#1a7f37] dark:text-[#238636]"
                                                style={{
                                                  strokeDasharray:
                                                    bugbotCheckRunning
                                                      ? "41.88, 62.83"
                                                      : "62.83, 62.83",
                                                  transform: "rotate(-90deg)",
                                                  transformOrigin:
                                                    "center center",
                                                  transition:
                                                    "stroke-dasharray 400ms ease-out",
                                                }}
                                              />
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                style={{
                                                  strokeDasharray:
                                                    bugbotCheckRunning
                                                      ? "20.95, 62.83"
                                                      : "0, 62.83",
                                                  transform: bugbotCheckRunning
                                                    ? "rotate(150deg)"
                                                    : "rotate(270deg)",
                                                  transformOrigin:
                                                    "center center",
                                                  transition:
                                                    "stroke-dasharray 400ms ease-out, transform 400ms ease-out",
                                                }}
                                              />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-theme-text font-semibold">
                                              {bugbotCheckRunning
                                                ? "Some checks haven't completed yet"
                                                : "All checks have passed"}
                                            </div>
                                            <div className="text-theme-text-ter/60 mt-0.5">
                                              {bugbotCheckRunning
                                                ? "1 in progress, 2 successful"
                                                : "3 successful"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="divide-y divide-theme-border-02 border-t border-theme-border-02">
                                          <div className="px-3 py-2 flex items-center gap-2 min-w-0">
                                            <svg
                                              className="h-4 w-4 text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                              viewBox="0 0 16 16"
                                              fill="currentColor"
                                            >
                                              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                                            </svg>
                                            <img
                                              alt="Cursor"
                                              loading="lazy"
                                              width={16}
                                              height={16}
                                              decoding="async"
                                              className="h-4 w-4 rounded flex-shrink-0"
                                              src="/marketing-static/icon-192x192.png"
                                              style={{ color: "transparent" }}
                                            />
                                            <span className="text-theme-text truncate">
                                              Cursor / Integration
                                            </span>
                                          </div>
                                          <div className="px-3 py-2 flex items-center gap-2 min-w-0">
                                            <svg
                                              className="h-4 w-4 text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                              viewBox="0 0 16 16"
                                              fill="currentColor"
                                            >
                                              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                                            </svg>
                                            <img
                                              alt="Cursor"
                                              loading="lazy"
                                              width={16}
                                              height={16}
                                              decoding="async"
                                              className="h-4 w-4 rounded flex-shrink-0"
                                              src="/marketing-static/icon-192x192.png"
                                              style={{ color: "transparent" }}
                                            />
                                            <span className="text-theme-text truncate">
                                              Cursor / Smoke Tests
                                            </span>
                                          </div>
                                          <div className="px-3 py-2 flex items-center gap-2 min-w-0">
                                            {bugbotCheckRunning ? (
                                              <span className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                                                <span className="h-2.5 w-2.5 rounded-full bg-[#bf8700] dark:bg-[#d29922] animate-pulse" />
                                              </span>
                                            ) : (
                                              <svg
                                                className="h-4 w-4 text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                              >
                                                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                                              </svg>
                                            )}
                                            <img
                                              alt="Cursor"
                                              loading="lazy"
                                              width={16}
                                              height={16}
                                              decoding="async"
                                              className="h-4 w-4 rounded flex-shrink-0"
                                              src="/marketing-static/icon-192x192.png"
                                              style={{ color: "transparent" }}
                                            />
                                            <span className="text-theme-text truncate">
                                              Cursor Bugbot
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <button
                                          type="button"
                                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md font-semibold text-sm transition-all duration-300 bg-[#1a7f37] dark:bg-[#238636] text-white cursor-pointer hover:bg-[#15692d] dark:hover:bg-[#1f7530]"
                                        >
                                          Merge pull request
                                          <svg
                                            className="h-3 w-3"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                          >
                                            <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
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
                    </figure>
                  </div>
                </div>

                {/* Card 1: Adapts to your standards */}
                <div className="h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>Adapts to your standards</h2>
                        <div className="text-theme-text-sec text-pretty">
                          Bugbot improves as you define and iterate on custom
                          rules and best practices.
                        </div>
                      </div>
                    </div>
                    <figure className="pt-g1.75">
                      <div
                        className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]"
                        style={{ height: "378px" }}
                      >
                        <div className="relative z-1 col-span-full row-span-full overflow-hidden">
                          <img
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="media-light absolute inset-0 object-cover scale-[1.1] transform wallpaper-brightness-dark"
                            sizes="100vw"
                            src="/sites/cursor/blob/assets/misc/asset-e6375f83012e4a76ff15.png"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              inset: "0px",
                              color: "transparent",
                            }}
                          />
                          <img
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="media-dark absolute inset-0 object-cover scale-[1.1] transform wallpaper-brightness-dark"
                            sizes="100vw"
                            src="/sites/cursor/blob/assets/misc/asset-0f82efbbc1a26deeca19.png"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              inset: "0px",
                              color: "transparent",
                            }}
                          />
                        </div>
                        <div className="z-20 col-span-full row-span-full h-full min-h-0">
                          <div style={{ height: "378px", width: "100%" }}>
                            <div
                              className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                              data-demo-pad-scope="_r_9_"
                              style={rulesStageStyle}
                            >
                              <div
                                className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full"
                                style={{ opacity: 1 }}
                              >
                                <div className="sr-only" aria-live="polite">
                                  Interactive demo with multiple windows showing
                                  Cursor&apos;s AI-powered features. The
                                  interface is displayed over a subtle, solid
                                  brand background.
                                </div>
                                <div
                                  aria-hidden="true"
                                  id="demo-window-fcd-top-left-391.6640625-378"
                                  className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-editor"
                                  style={{
                                    left: "58.2132%",
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
                                            <div className="flex h-full min-h-0 flex-1 flex-col">
                                              <div
                                                className="flex min-h-0 min-w-0"
                                                style={{ height: "100%" }}
                                              >
                                                <div
                                                  className="flex min-h-0 min-w-0 flex-col"
                                                  style={{ width: "100%" }}
                                                >
                                                  <div className="min-h-0 flex-1 bg-theme-product-editor">
                                                    <div className="h-full w-full">
                                                      <div className="flex h-full w-full flex-col overflow-hidden">
                                                        <div className="font-berkeley-mono text-[12px] leading-relaxed tracking-tight p-4">
                                                          <div className="text-theme-text-ter select-none">
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
                                                              &quot;Enforce API
                                                              security standards
                                                              and auth patterns
                                                              across all
                                                              services in code
                                                              reviews&quot;
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
                                                              src/api/**/*.ts
                                                            </span>
                                                          </div>
                                                          <div className="text-theme-text-ter select-none">
                                                            ---
                                                          </div>
                                                          <div className="mt-3" />
                                                          <div>
                                                            <span className="text-theme-product-syntax-keyword font-semibold">
                                                              #{" "}
                                                            </span>
                                                            <span className="text-theme-text font-semibold">
                                                              API Security
                                                              Standards
                                                            </span>
                                                          </div>
                                                          <div className="mt-3" />
                                                          <div className="mb-1">
                                                            <span className="text-theme-product-syntax-keyword">
                                                              ##{" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              Flag when
                                                            </span>
                                                          </div>
                                                          <div className="space-y-0.5">
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                Endpoints
                                                                missing{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  authenticate()
                                                                </span>{" "}
                                                                middleware
                                                              </span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                User input
                                                                passed to{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  query()
                                                                </span>{" "}
                                                                without{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  sanitize()
                                                                </span>
                                                              </span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                Secrets
                                                                hardcoded as{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  string
                                                                </span>{" "}
                                                                literals
                                                              </span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                Missing{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  rateLimit()
                                                                </span>{" "}
                                                                on public-facing
                                                                routes
                                                              </span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  {
                                                                    "cors({ origin: '*' })"
                                                                  }
                                                                </span>{" "}
                                                                in production
                                                                config
                                                              </span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                              <span className="text-theme-text-ter">
                                                                -
                                                              </span>
                                                              <span className="text-theme-text-sec">
                                                                Response exposes
                                                                internal{" "}
                                                                <span
                                                                  className="text-theme-product-syntax-string rounded px-1 mx-0.5"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "rgba(136, 136, 136, 0.12)",
                                                                  }}
                                                                >
                                                                  stackTrace
                                                                </span>{" "}
                                                                fields
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
                                    </div>
                                  </div>
                                </div>
                                <div className="pointer-events-none absolute inset-0 z-20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>

                {/* Card 2: High signal, low noise */}
                <div className="h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>High signal, low noise</h2>
                        <div className="text-theme-text-sec text-pretty">
                          Bugbot optimizes for bugs that get fixed. 70%+ of
                          flags get resolved before merge.
                        </div>
                      </div>
                    </div>
                    <figure className="pt-g1.75">
                      <div
                        className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-03-hex"
                        style={{ height: "378px" }}
                      >
                        <div className="z-20 col-span-full row-span-full h-full min-h-0">
                          <div className="h-full w-full p-4 flex justify-center items-center">
                            <div className="w-full max-w-sm rounded-lg bg-theme-card-03-hex overflow-hidden">
                              <div className="w-full h-full overflow-hidden">
                                <div className="type-product-base text-theme-text h-full px-5 pt-5 pb-6 overflow-hidden">
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
                                          style={{ color: "transparent" }}
                                        />
                                      </div>
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
                                              cursor
                                            </span>
                                            <span className="text-[10px] text-theme-text-ter/70 border-theme-border-02 rounded-full border px-1.5 py-0.5 leading-tight">
                                              bot
                                            </span>
                                            <span className="text-theme-text-ter/60">
                                              reviewed just now
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mx-3 mt-3 mb-2 rounded overflow-hidden border border-theme-border-02">
                                          <div className="px-2.5 py-1.5 bg-theme-card-02-hex border-b border-theme-border-02">
                                            <span className="text-[11px] font-berkeley-mono text-theme-text-ter/60 tracking-tight truncate block">
                                              src/auth/validateToken.ts
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
                                                18
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
                                                {" if (token.exp > Date.now()) {"}
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
                                                18
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
                                                {
                                                  " const nowSeconds = Math.floor(Date.now() / 1000);"
                                                }
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
                                                19
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
                                                {" if (token.exp > nowSeconds) {"}
                                              </div>
                                            </div>
                                            <div className="flex">
                                              <div
                                                className="w-8 min-w-[2rem] px-1 py-0.5 text-right select-none text-theme-text-ter/40 flex-shrink-0 tabular-nums"
                                                style={{
                                                  backgroundColor: "transparent",
                                                }}
                                              >
                                                20
                                              </div>
                                              <div
                                                className="w-6 px-1 py-0.5 text-center select-none flex-shrink-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              />
                                              <div
                                                className="flex-1 pl-1 pr-3 py-0.5 whitespace-pre min-w-0"
                                                style={{
                                                  backgroundColor: "transparent",
                                                  color: "inherit",
                                                }}
                                              >
                                                {
                                                  "    return { valid: true, user: token.sub };"
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="px-3 pt-1 pb-2 text-theme-text"
                                          style={{ fontSize: "13px" }}
                                        >
                                          <p>Fixed the unit mismatch.</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="relative flex gap-3">
                                    <div className="flex flex-col items-center w-8 flex-shrink-0">
                                      <img
                                        alt=""
                                        loading="lazy"
                                        width={32}
                                        height={32}
                                        decoding="async"
                                        className="h-8 w-8 rounded-full"
                                        src="/marketing-static/users/jon-kaplan.jpg"
                                        style={{ color: "transparent" }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="rounded border border-theme-border-02 bg-theme-card-hex overflow-hidden">
                                        <div className="px-3 py-1.5 bg-theme-card-02-hex/50 border-b border-theme-border-02">
                                          <div
                                            className="flex items-baseline gap-1.5"
                                            style={{ fontSize: "13px" }}
                                          >
                                            <span className="text-theme-text font-semibold">
                                              jonkaplan
                                            </span>
                                            <span className="text-theme-text-ter/60">
                                              just now
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className="px-3 py-2 text-theme-text"
                                          style={{ fontSize: "13px" }}
                                        >
                                          nice catch, merging!
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
              </div>
            </div>
          </section>
        </section>

        {/* Section 3: Social Quotes */}
        <section
          className="section bg-theme-bg text-theme-text"
          id="social-quotes"
        >
          <div className="container">
            <div className="gap-g1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {SOCIAL_QUOTES.map((item) => (
                <div
                  key={item.author}
                  className="card md:aspect-2/1-box lg:aspect-8/5-box"
                >
                  <figure className="flex flex-col col-span-full row-span-full">
                    <blockquote className="grow-1">
                      <p className="type-base whitespace-pre-wrap">
                        {item.quote}
                      </p>
                    </blockquote>
                    <div className="mt-v2 flex items-center space-x-(--grid-gap)">
                      <div className="avatar-border-container h-[2.5rem] w-[2.5rem] shrink-0">
                        <img
                          alt=""
                          loading="lazy"
                          width={42}
                          height={42}
                          decoding="async"
                          className="h-full w-full object-cover"
                          src={item.avatarSrc}
                          style={{ color: "transparent" }}
                        />
                      </div>
                      <figcaption>
                        <div className="type-sm">
                          {item.author}{" "}
                          <span className="type-sm text-theme-text-sec block">
                            {item.role}
                          </span>
                        </div>
                      </figcaption>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Questions & Answers */}
        <section className="section bg-theme-card-hex text-theme-text">
          <div className="container">
            <div className="grid-cursor-v1 gap-0">
              <div className="col-span-full lg:col-end-7">
                <div className="max-lg:mb-v2 sticky top-[var(--site-sticky-top)]">
                  <h2 className="type-lg text-pretty">Questions &amp; Answers</h2>
                </div>
              </div>
              <div className="col-span-full lg:col-start-7 lg:col-end-[-1]">
                <div
                  className="text-theme-text w-full"
                  data-slot="accordion-root"
                  data-orientation="vertical"
                >
                  {FAQ_ITEMS.map((faq) => {
                    const isOpen = Boolean(openFaqIds[faq.id]);
                    const state = isOpen ? "open" : "closed";
                    return (
                      <div
                        key={faq.id}
                        data-state={state}
                        data-orientation="vertical"
                        className="border-theme-border-02 border-t last:border-b focus-within:relative focus-within:z-1"
                        data-slot="accordion-item"
                      >
                        <h3
                          data-orientation="vertical"
                          data-state={state}
                          className="flex"
                        >
                          <button
                            type="button"
                            aria-controls={faq.panelId}
                            aria-expanded={isOpen}
                            data-state={state}
                            data-orientation="vertical"
                            id={faq.id}
                            onClick={() => toggleFaq(faq.id)}
                            className="group pt-[0.98rem] pb-[1.05rem] flex flex-1 cursor-pointer items-center justify-between text-left"
                            data-slot="accordion-trigger"
                            data-radix-collection-item=""
                          >
                            {faq.question}
                            <span className="ml-g1 h-5 w-5">
                              <span className="inline group-data-[state=open]:hidden">
                                <span className="icon-glyph-11" aria-hidden="true">
                                  ↓
                                </span>
                              </span>
                              <span className="hidden group-data-[state=open]:inline">
                                <span className="icon-glyph-11" aria-hidden="true">
                                  ↑
                                </span>
                              </span>
                            </span>
                          </button>
                        </h3>
                        <div
                          data-state={state}
                          id={faq.panelId}
                          role="region"
                          aria-labelledby={faq.id}
                          data-orientation="vertical"
                          className="overflow-hidden"
                          data-slot="accordion-content"
                          hidden={!isOpen}
                        >
                          <div className="pb-v1 text-theme-text">
                            <div className="prose">{faq.answer}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Final CTA */}
        <section className="section bg-theme-bg text-theme-text section--headline">
          <div className="container">
            <div className="text-center mx-auto max-w-prose-medium-wide">
              <h2 className="type-xl text-balance mx-auto mb-v1">
                Get started with Bugbot.
              </h2>
              <div className="flex justify-center gap-x-g1 items-center">
                <a href="https://cursor.com/dashboard/bugbot" className="btn">
                  Get started with Bugbot
                  <div aria-hidden="true" className="btn-icon">
                    <span aria-hidden="true">→</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CursorFooter />
    </>
  );
}
