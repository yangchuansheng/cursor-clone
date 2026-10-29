"use client";

import React, { useEffect, useState } from "react";

interface FrontierModel {
  label: string;
  tag?: string;
}

const FRONTIER_MODELS: FrontierModel[] = [
  { label: "Auto", tag: "Suggested" },
  { label: "Grok 4.7" },
  { label: "GPT-5.6 Sol" },
  { label: "Fable 5.1", tag: "Max" },
  { label: "Opus 5.5" },
  { label: "Gemini 3.1 Pro" },
  { label: "Composer 2.5" },
];

const MOBILE_AGENT_TASKS = [
  { title: "Fix sign-in redirect on iOS", repo: "cursor/mobile" },
  { title: "Add rate limits to public routes", repo: "cursor/api" },
  { title: "Cache repository search results", repo: "cursor/web" },
  { title: "Investigate flaky CI shard", repo: "cursor/infra" },
  { title: "Retry failed billing webhooks", repo: "cursor/backend" },
  { title: "Polish usage chart loading state", repo: "cursor/dashboard" },
];

export function FrontierSection() {
  const [selectedIndex, setSelectedIndex] = useState(5);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    if (userPaused) return;
    const interval = window.setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % FRONTIER_MODELS.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [userPaused]);

  const currentModel =
    FRONTIER_MODELS[selectedIndex] ?? FRONTIER_MODELS[0];

  return (
    <section className="section bg-theme-bg text-theme-text">
      <div className="container">
        <div className="text-left mb-v1 max-w-prose-narrow">
          <h2 className="type-md text-balance">Stay on the frontier</h2>
        </div>
        <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch">
          {/* Card 1: Use the best model for every task */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h3>Use the best model for every task</h3>
                  <div className="text-theme-text-sec text-pretty">
                    Choose between every cutting-edge model from OpenAI,
                    Anthropic, Gemini, SpaceXAI, and Cursor.
                  </div>
                </div>
                <div className="mt-auto pt-v8/12">
                  <a
                    href="/docs/models"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tertiary"
                  >
                    Explore models ↗
                  </a>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible max-h-mobile bg-theme-card-03-hex"
                  style={{ "--max-h-mobile": "420px" } as React.CSSProperties}
                >
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <div
                      className="aspect-4/3-box md:aspect-1/1-box"
                      style={{
                        position: "relative",
                        width: "100%",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div className="absolute inset-0 flex items-start justify-center pt-[12%]">
                        <div className="relative w-[88%] max-w-[360px]">
                          <div className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg">
                            <div
                              className="text-theme-text-ter type-product-lg w-full bg-transparent px-3 pt-2.5 pb-2 opacity-60"
                              style={{ lineHeight: 1.8 }}
                            >
                              Ask Cursor to plan or build anything
                            </div>
                            <div className="px-2 py-2 pt-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="bg-theme-card-03-hex type-product-sm text-theme-text-sec flex items-center gap-1 rounded-full px-2 py-0.75"
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
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="text-theme-text-sec type-product-sm flex items-center gap-0.5 rounded-md bg-transparent py-0.75"
                                    >
                                      <span>{currentModel.label}</span>
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
                                    <div className="absolute left-0 top-[calc(100%+8px)] transition-all duration-200 ease-out origin-top-left opacity-100 scale-100 translate-y-0">
                                      <div
                                        className="bg-theme-card-hex text-theme-text overflow-hidden rounded-md"
                                        role="menu"
                                        aria-label="Model menu"
                                        onMouseEnter={() => setUserPaused(true)}
                                        onMouseLeave={() => {
                                          setHoveredIndex(null);
                                          setUserPaused(false);
                                        }}
                                        style={{
                                          boxShadow:
                                            "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                          minWidth: "180px",
                                        }}
                                      >
                                        <div className="p-1">
                                          {FRONTIER_MODELS.map((m, idx) => {
                                            const isSelected =
                                              idx === selectedIndex;
                                            const isHighlighted =
                                              hoveredIndex !== null
                                                ? idx === hoveredIndex
                                                : isSelected;
                                            return (
                                              <button
                                                key={m.label}
                                                type="button"
                                                role="menuitem"
                                                onMouseEnter={() =>
                                                  setHoveredIndex(idx)
                                                }
                                                onClick={() => {
                                                  setSelectedIndex(idx);
                                                  setUserPaused(true);
                                                }}
                                                className={`${
                                                  isHighlighted
                                                    ? "text-theme-text"
                                                    : "text-theme-text-sec"
                                                } px-g0.75 type-product-lg py-v3/12 flex w-full cursor-pointer items-center rounded-xs text-left${
                                                  isSelected
                                                    ? " bg-theme-card-02-hex"
                                                    : ""
                                                }`}
                                                style={
                                                  isHighlighted
                                                    ? {
                                                        backgroundColor:
                                                          "var(--color-theme-card-hover-hex)",
                                                      }
                                                    : undefined
                                                }
                                              >
                                                <span className="flex flex-1 items-baseline gap-2">
                                                  <span className="text-theme-text">
                                                    {m.label}
                                                  </span>
                                                  {m.tag && (
                                                    <span className="text-theme-text-tertiary type-product-sm">
                                                      {m.tag}
                                                    </span>
                                                  )}
                                                </span>
                                                {isSelected && (
                                                  <span className="font-feature-case ml-2">
                                                    ✓
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
              </figure>
            </div>
          </div>

          {/* Card 2: Build with autonomous agents */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h3>Build with autonomous agents</h3>
                  <div className="text-theme-text-sec text-pretty">
                    Launch fleets of agents that work in parallel on ambitious
                    tasks for hours or days.
                  </div>
                </div>
                <div className="mt-auto pt-v8/12">
                  <a
                    href="/docs/cloud-agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tertiary"
                  >
                    Learn about cloud agents ↗
                  </a>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1 max-h-mobile"
                  style={
                    {
                      "--layered-media-bg-light": "#CAC6BE",
                      "--layered-media-bg-dark": "#47433C",
                      "--max-h-mobile": "420px",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="media-light absolute inset-0 z-0"
                    style={{ backgroundColor: "rgb(202, 198, 190)" }}
                  />
                  <div
                    className="media-dark absolute inset-0 z-0"
                    style={{ backgroundColor: "rgb(71, 67, 60)" }}
                  />
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <div className="h-full" aria-hidden="true">
                      <div
                        className="relative w-full overflow-hidden rounded-xs"
                        style={{ height: "378px" }}
                      >
                        <div
                          className="absolute left-1/2 top-6 -translate-x-1/2"
                          style={{ width: "300px", height: "650px" }}
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
                              className="bg-theme-product-editor border-theme-border relative h-full w-full overflow-hidden border mobile-phone-screen"
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
                              <div className="relative h-full px-5 pt-6 font-[system-ui]">
                                <h2 className="mb-4 text-[19px] leading-tight font-[510] tracking-[-0.26px] text-[color:var(--mobile-phone-text-primary)]">
                                  All Repos
                                </h2>
                                <p className="mb-1.5 text-[11px] text-[color:var(--mobile-phone-section-label)]">
                                  Recents
                                </p>
                                <div className="-ml-1.5 pl-1.5 [mask-image:linear-gradient(to_bottom,black,black_56%,rgba(0,0,0,0.9)_65%,rgba(0,0,0,0.6)_76%,rgba(0,0,0,0.25))]">
                                  {MOBILE_AGENT_TASKS.map((task) => (
                                    <div key={task.title}>
                                      <button
                                        type="button"
                                        disabled
                                        className="mobile-interaction-pulse mobile-interaction-pulse--workspace-row relative flex w-full items-start gap-2.5 rounded-[12px] px-0 text-left font-[system-ui] cursor-default"
                                      >
                                        <span
                                          className="relative mt-2 -ml-[4.5px] -mr-[4.5px] h-[15px] w-[15px] shrink-0 text-[color:var(--mobile-phone-dot)] data-[active]:text-[color:var(--mobile-phone-blue)]"
                                          data-workspace-interaction-indicator="true"
                                        >
                                          <span
                                            className="mobile-working-icon h-full w-full"
                                            aria-hidden="true"
                                          >
                                            <span className="mobile-working-icon__dot mobile-working-icon__dot--top mobile-working-icon__dot--vertical" />
                                            <span className="mobile-working-icon__dot mobile-working-icon__dot--right mobile-working-icon__dot--horizontal" />
                                            <span className="mobile-working-icon__dot mobile-working-icon__dot--bottom mobile-working-icon__dot--vertical" />
                                            <span className="mobile-working-icon__dot mobile-working-icon__dot--left mobile-working-icon__dot--horizontal" />
                                            <span className="mobile-working-icon__dot mobile-working-icon__dot--center" />
                                          </span>
                                        </span>
                                        <span className="min-w-0 flex-1 border-b border-[color:var(--mobile-phone-row-border)] py-2.5">
                                          <span className="block truncate pb-px text-[12px] leading-[1.35] font-medium text-[color:var(--mobile-phone-text-primary)]">
                                            {task.title}
                                          </span>
                                          <span className="mt-[3px] flex items-center gap-1 truncate text-[12px] leading-[1.25] text-[color:var(--mobile-phone-muted)]">
                                            <span
                                              className="inline-flex h-4 items-center gap-1 align-middle"
                                              data-mobile-status="true"
                                            >
                                              <span
                                                className="shimmer shimmer-synced"
                                                style={
                                                  {
                                                    "--shimmer-color":
                                                      "var(--mobile-phone-muted)",
                                                    "--shimmer-intensity":
                                                      "86%",
                                                    "--shimmer-duration":
                                                      "1.6s",
                                                  } as React.CSSProperties
                                                }
                                              >
                                                Working
                                              </span>
                                            </span>
                                            <span className="shrink-0">·</span>
                                            <span className="shrink-0 truncate">
                                              {task.repo}
                                            </span>
                                          </span>
                                        </span>
                                      </button>
                                    </div>
                                  ))}
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

          {/* Card 3: Develop enduring software */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h3>Develop enduring software</h3>
                  <div className="text-theme-text-sec text-pretty">
                    Trusted by over half of the Fortune 500 to accelerate
                    development, securely and at scale.
                  </div>
                </div>
                <div className="mt-auto pt-v8/12">
                  <a className="btn-tertiary" href="/enterprise">
                    Explore enterprise →
                  </a>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1 max-h-mobile bg-[image:var(--color-theme-card-03)]"
                  style={{ "--max-h-mobile": "420px" } as React.CSSProperties}
                >
                  <div className="z-20 col-span-full row-span-full grid">
                    <img
                      alt=""
                      loading="lazy"
                      width={800}
                      height={450}
                      decoding="async"
                      className="h-auto w-full"
                      src="/sites/cursor/blob/assets/homepage/homepage-team-photo-1.jpg"
                    />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
