"use client";

import React, { useEffect, useState } from "react";

type BuildDestination = "local" | "cloud";
type LinearAssignee = "cursor" | "eric";

const CHANNELS = ["#bug-reports", "#incidents", "#ci-alerts"] as const;
const REPOS = ["cursor-website", "cursor-core", "agent-runtime"] as const;
const BRANCHES = ["main", "staging", "release"] as const;
const SCHEDULES = ["Every hour", "Every 30m", "Every night"] as const;

const MEMORIES = [
  { title: "Fix flaky CI", time: "Last month" },
  { title: "Update test fixtures", time: "Last week" },
  { title: "Stabilize Playwright", time: "Yesterday" },
  { title: "Repair build script", time: "3h ago" },
] as const;

function CursorCubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 22"
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M19.162 5.452 10.698.565a.88.88 0 0 0-.879 0L1.356 5.452a.74.74 0 0 0-.37.64v9.853a.74.74 0 0 0 .37.64l8.464 4.887a.879.879 0 0 0 .879 0l8.464-4.886a.74.74 0 0 0 .37-.64V6.091a.74.74 0 0 0-.37-.64Zm-.531 1.035L10.46 20.639c-.055.095-.201.056-.201-.055v-9.266a.52.52 0 0 0-.26-.45L1.975 6.237c-.096-.056-.057-.202.054-.202h16.34c.233 0 .378.252.262.453Z" />
      </g>
    </svg>
  );
}

function SpinnerRaysIcon({
  className = "text-theme-text-ter",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      className="text-theme-text-ter opacity-30"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2L2 5l6 3 6-3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitBranchIcon() {
  return (
    <svg
      className="text-theme-text-ter opacity-30"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1" />
      <circle cx="11" cy="12" r="2" stroke="currentColor" strokeWidth="1" />
      <path
        d="M5 6v6M11 10V6c0-1.1-.9-2-2-2H7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlackColorMark({ className = "size-full" }: { className?: string }) {
  return (
    <svg
      viewBox="-2.45 0 2452.5 2452.5"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipRule="evenodd" fillRule="evenodd">
        <path
          d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
          fill="#36c5f0"
        />
        <path
          d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
          fill="#2eb67d"
        />
        <path
          d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
          fill="#ecb22e"
        />
        <path
          d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
          fill="#e01e5a"
        />
      </g>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="text-theme-text-sec"
      aria-hidden="true"
    >
      <path d="M8 13.9766C4.70117 13.9766 2.02344 11.2988 2.02344 8C2.02344 4.70117 4.70117 2.02344 8 2.02344C11.2988 2.02344 13.9766 4.70117 13.9766 8C13.9766 11.2988 11.2988 13.9766 8 13.9766ZM8 12.9805C10.7539 12.9805 12.9805 10.7539 12.9805 8C12.9805 5.24609 10.7539 3.01953 8 3.01953C5.24609 3.01953 3.01953 5.24609 3.01953 8C3.01953 10.7539 5.24609 12.9805 8 12.9805ZM7.35547 10.7832C7.16211 10.7832 7.00391 10.7012 6.85742 10.5078L5.42773 8.75C5.3457 8.63867 5.29297 8.51562 5.29297 8.38672C5.29297 8.12891 5.49219 7.92383 5.74414 7.92383C5.9082 7.92383 6.03711 7.9707 6.17773 8.1582L7.33203 9.65234L9.76367 5.75C9.875 5.58008 10.0215 5.48633 10.168 5.48633C10.4141 5.48633 10.6484 5.65625 10.6484 5.91992C10.6484 6.04883 10.5723 6.17773 10.5078 6.29492L7.83008 10.5078C7.71289 10.6895 7.54883 10.7832 7.35547 10.7832Z" />
    </svg>
  );
}

export function CloudSurfacesAndAutomations() {
  const [buildDestination, setBuildDestination] =
    useState<BuildDestination>("cloud");
  const [linearAssignee, setLinearAssignee] =
    useState<LinearAssignee>("cursor");
  const [channelIdx, setChannelIdx] = useState(0);
  const [repoIdx, setRepoIdx] = useState(0);
  const [branchIdx, setBranchIdx] = useState(0);
  const [scheduleIdx, setScheduleIdx] = useState(0);
  const [extraTriggerVisible, setExtraTriggerVisible] = useState(false);
  const [showTypedInstructions, setShowTypedInstructions] = useState(false);
  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number>(3);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMemoryIndex((prev) => (prev + 1) % MEMORIES.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'CursorIcons16';
          src: url('/marketing-static/fonts/cursor-icons-16.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: block;
        }
      `}</style>
      {/* Section 2: Everywhere you work */}
      <section className="section" id="surfaces">
        <div className="container">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">Everywhere you work</h2>
            <div className="flex justify-start mb-v1">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Kick off and manage more agents in parallel from any surface.
              </div>
            </div>
            <div className="flex justify-start gap-x-g1 items-center">
              <a
                href="https://cursor.com/docs/cloud-agent#how-to-access"
                className="btn"
              >
                Learn about integrations
                <div aria-hidden="true" className="btn-icon">
                  <span aria-hidden="true">→</span>
                </div>
              </a>
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
                        Hand off plans from your local agent to the cloud to run
                        while you&apos;re offline.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-02-hex">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="flex h-full min-h-[378px] w-full items-center justify-center overflow-hidden py-8 xl:justify-end xl:pr-8"
                          style={{ height: "378px" }}
                        >
                          <div className="relative w-[271px] shrink-0">
                            <div className="absolute inset-x-0 bottom-full mb-2 max-xl:hidden">
                              <div className="flex items-center gap-2 opacity-[0.65]">
                                <button
                                  type="button"
                                  className="bg-theme-card-hex border-theme-border-02 text-theme-text/60 type-product-lg flex h-8 items-center gap-1.5 rounded-full border pl-2 pr-1.5"
                                >
                                  <span>Review</span>
                                  <span className="text-theme-product-ansi-green">
                                    +262
                                  </span>
                                  <span className="text-theme-product-ansi-red">
                                    -26
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  className="bg-theme-card-hex border-theme-border-02 text-theme-text/60 type-product-lg flex h-8 items-center gap-2 rounded-full border pl-2 pr-1.5"
                                >
                                  <span>Commit &amp; Push</span>
                                </button>
                              </div>
                            </div>

                            <div className="bg-theme-product-editor border-theme-border-02 relative w-full rounded-[12px] border shadow-sm">
                              <div className="px-2.5 pt-2.5">
                                <span className="text-theme-text/25 type-product-lg">
                                  Review Plan
                                </span>
                              </div>
                              <div className="px-2.5 pt-1.5 pb-1.5">
                                <p className="text-theme-text/25 type-product-lg leading-snug">
                                  Add dark mode toggle
                                </p>
                                <p className="text-theme-text/25 type-product-lg mt-1.5 leading-snug">
                                  The shell already has full light/dark CSS
                                  variables driven by OS preference.
                                </p>
                              </div>
                              <div className="relative flex items-end justify-end px-2.5 pt-0.5 pb-2">
                                <div className="relative">
                                  <div className="absolute right-0 bottom-full mb-2">
                                    <div
                                      className="bg-theme-card-hex type-product-lg text-theme-text min-w-[172px] overflow-hidden rounded-lg p-1"
                                      role="listbox"
                                      aria-label="Build destination"
                                      style={{
                                        boxShadow:
                                          "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                      }}
                                    >
                                      <div
                                        role="option"
                                        aria-selected={
                                          buildDestination === "local"
                                        }
                                        onMouseEnter={() =>
                                          setBuildDestination("local")
                                        }
                                        onClick={() =>
                                          setBuildDestination("local")
                                        }
                                        className={`hover:bg-theme-card-hover-hex flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 ${
                                          buildDestination === "local"
                                            ? "bg-theme-card-hover-hex"
                                            : ""
                                        }`}
                                      >
                                        <span
                                          className="text-theme-text-sec inline-flex h-4 w-4 shrink-0 items-center justify-center"
                                          aria-hidden="true"
                                        >
                                          <span
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "15px",
                                              lineHeight: 1,
                                              display: "block",
                                              width: "15px",
                                              height: "15px",
                                              textAlign: "center",
                                              transform: "translateY(0.5px)",
                                            }}
                                          >
                                            {"\uEA7A"}
                                          </span>
                                        </span>
                                        <span>Build Locally</span>
                                      </div>
                                      <div
                                        role="option"
                                        aria-selected={
                                          buildDestination === "cloud"
                                        }
                                        onMouseEnter={() =>
                                          setBuildDestination("cloud")
                                        }
                                        onClick={() =>
                                          setBuildDestination("cloud")
                                        }
                                        className={`hover:bg-theme-card-hover-hex flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 ${
                                          buildDestination === "cloud"
                                            ? "bg-theme-card-hover-hex"
                                            : ""
                                        }`}
                                      >
                                        <span
                                          className="text-theme-text-sec inline-flex h-4 w-4 shrink-0 items-center justify-center"
                                          aria-hidden="true"
                                        >
                                          <span
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "15px",
                                              lineHeight: 1,
                                              display: "block",
                                              width: "15px",
                                              height: "15px",
                                              textAlign: "center",
                                              transform: "translateY(0.5px)",
                                            }}
                                          >
                                            {"\uEbaa"}
                                          </span>
                                        </span>
                                        <span>Build in Cloud</span>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setBuildDestination((prev) =>
                                        prev === "cloud" ? "local" : "cloud"
                                      )
                                    }
                                    className="flex h-7 w-fit shrink-0 cursor-pointer overflow-hidden rounded-md shadow-sm transition-all hover:brightness-110"
                                  >
                                    <div
                                      className="type-product-lg flex items-center gap-1.5 pl-2.5 pr-1.5 font-medium text-white"
                                      style={{
                                        backgroundColor: "rgb(192, 133, 50)",
                                      }}
                                    >
                                      <span>Build</span>
                                      <span className="flex items-center gap-px opacity-85">
                                        <svg
                                          width="8"
                                          height="8"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          aria-hidden="true"
                                        >
                                          <path
                                            d="M3.83301 0.875C5.28276 0.875 6.45801 2.05025 6.45801 3.5V5.20801H9.54199V3.5C9.54199 2.05025 10.7172 0.875 12.167 0.875H12.5C13.9497 0.875 15.125 2.05025 15.125 3.5V3.83301C15.125 5.28275 13.9497 6.45801 12.5 6.45801H10.792V9.54199H12.5C13.9497 9.54199 15.125 10.7172 15.125 12.167V12.5C15.125 13.9497 13.9497 15.125 12.5 15.125H12.167C10.7172 15.125 9.54199 13.9497 9.54199 12.5V10.792H6.45801V12.5C6.45801 13.9497 5.28275 15.125 3.83301 15.125H3.5C2.05025 15.125 0.875 13.9497 0.875 12.5V12.167C0.875 10.7172 2.05025 9.54199 3.5 9.54199H5.20801V6.45801H3.5C2.05025 6.45801 0.875 5.28276 0.875 3.83301V3.5C0.875 2.05025 2.05025 0.875 3.5 0.875H3.83301ZM3.5 10.792C2.74061 10.792 2.125 11.4076 2.125 12.167V12.5C2.125 13.2594 2.74061 13.875 3.5 13.875H3.83301C4.5924 13.875 5.20801 13.2594 5.20801 12.5V10.792H3.5ZM10.792 12.5C10.792 13.2594 11.4076 13.875 12.167 13.875H12.5C13.2594 13.875 13.875 13.2594 13.875 12.5V12.167C13.875 11.4076 13.2594 10.792 12.5 10.792H10.792V12.5ZM6.45801 9.54199H9.54199V6.45801H6.45801V9.54199ZM3.5 2.125C2.74061 2.125 2.125 2.74061 2.125 3.5V3.83301C2.125 4.5924 2.74061 5.20801 3.5 5.20801H5.20801V3.5C5.20801 2.74061 4.5924 2.125 3.83301 2.125H3.5ZM12.167 2.125C11.4076 2.125 10.792 2.74061 10.792 3.5V5.20801H12.5C13.2594 5.20801 13.875 4.5924 13.875 3.83301V3.5C13.875 2.74061 13.2594 2.125 12.5 2.125H12.167Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                        <svg
                                          width="8"
                                          height="8"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          aria-hidden="true"
                                        >
                                          <path
                                            d="M14.9995 1.875C15.3447 1.875 15.6245 2.15482 15.6245 2.5V8.5C15.6245 9.39746 14.897 10.125 13.9995 10.125H2.50928L5.44189 13.0576C5.68597 13.3017 5.68597 13.6983 5.44189 13.9424C5.1978 14.1862 4.80113 14.1864 4.55713 13.9424L0.557129 9.94238C0.313345 9.69836 0.313345 9.30164 0.557129 9.05762L4.55713 5.05762C4.80113 4.81361 5.1978 4.81376 5.44189 5.05762C5.68597 5.30169 5.68597 5.69831 5.44189 5.94238L2.50928 8.875H13.9995C14.2066 8.875 14.3745 8.70711 14.3745 8.5V2.5C14.3745 2.15497 14.6545 1.87524 14.9995 1.875Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                    <div
                                      className="flex items-center border-l border-white/25 px-[5px] text-white"
                                      aria-hidden="true"
                                      style={{
                                        backgroundColor: "rgb(192, 133, 50)",
                                      }}
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                      >
                                        <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                      </svg>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="absolute inset-x-0 top-full mt-2">
                              <div className="bg-theme-card-hex border-theme-border-02 flex h-10 items-center gap-2 rounded-full border px-1.5 opacity-70">
                                <button
                                  type="button"
                                  className="border-theme-border-02 text-theme-text/45 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                                  aria-label="Add context"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M8 2.25V13.75M2.25 8H13.75"
                                      stroke="currentColor"
                                      strokeWidth="1.45"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                                <div className="text-theme-text/25 type-product-lg min-w-0 flex-1 truncate text-left">
                                  Build, Plan, Ask Cursor anything
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

              {/* Card 1: Mobile */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Mobile</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Spawn cloud agents on the go directly from your phone.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-02-hex">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          className="relative w-full overflow-hidden rounded-xs"
                          style={{ height: "min(378px, -64px + 100vw)" }}
                        >
                          <div
                            className="absolute left-1/2 -translate-x-1/2 xl:left-6 xl:translate-x-0"
                            style={{
                              width: "300px",
                              height: "650px",
                              bottom: "24px",
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
                                <div className="flex h-[calc(100%-48px)] flex-col">
                                  <div className="flex items-center justify-between px-4 pb-3 pt-4">
                                    <div className="flex items-center justify-center">
                                      <CursorCubeIcon className="text-theme-text h-6 w-6" />
                                    </div>
                                    <div className="flex items-center gap-0">
                                      <button
                                        type="button"
                                        className="type-product-base bg-theme-card-02-hex text-theme-text rounded-md px-3 py-1 font-medium"
                                      >
                                        Agent
                                      </button>
                                      <button
                                        type="button"
                                        className="type-product-base text-theme-text-ter px-3 py-1 font-medium"
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

                                  <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
                                    <div>
                                      <div className="mb-0.5">
                                        <div className="type-product-base text-theme-text-sec px-4 py-1 font-medium">
                                          Today
                                        </div>
                                        <div>
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <SpinnerRaysIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Vercel streaming SDK
                                                functionality
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <SpinnerRaysIcon />
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <LayersIcon />
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <GitBranchIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Fix send button functionality
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  2 Files
                                                </span>
                                                <span className="text-theme-product-ansi-green">
                                                  +26
                                                </span>
                                                <span className="text-theme-product-ansi-red">
                                                  −12
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
                                        <div className="type-product-base text-theme-text-sec px-4 py-1 font-medium">
                                          This Week
                                        </div>
                                        <div>
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <GitBranchIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Fix send button functionality
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  2 Files
                                                </span>
                                                <span className="text-theme-product-ansi-green">
                                                  +26
                                                </span>
                                                <span className="text-theme-product-ansi-red">
                                                  −12
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <GitBranchIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Implement user authentication
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  3 Files
                                                </span>
                                                <span className="text-theme-product-ansi-green">
                                                  +45
                                                </span>
                                                <span className="text-theme-product-ansi-red">
                                                  −8
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <SpinnerRaysIcon className="text-theme-text-ter animate-spin" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Design responsive layout
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  Analyzing codebase
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <LayersIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Set up database schema
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  3 models
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
                                          <div className="flex items-start gap-2 px-4 py-1.5">
                                            <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                              <GitBranchIcon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="type-product-base text-theme-text truncate leading-tight">
                                                Create API endpoints
                                              </div>
                                              <div className="type-product-base mt-0.5 flex items-center gap-1">
                                                <span className="text-theme-text-ter truncate opacity-50">
                                                  6 Files
                                                </span>
                                                <span className="text-theme-product-ansi-green">
                                                  +50
                                                </span>
                                                <span className="text-theme-product-ansi-red">
                                                  −5
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
                                  </div>

                                  <div className="px-4 pb-8">
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
                                          aria-hidden="true"
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
                                          aria-hidden="true"
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

              {/* Card 2: Slack and Microsoft Teams */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Slack and Microsoft Teams</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Mention @Cursor to delegate tasks with full context in
                        the thread.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-02-hex">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-[378px] w-full items-center overflow-hidden min-[1140px]:justify-start">
                          <div
                            className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs !w-[380px] mx-auto max-w-none shrink-0 min-[1140px]:mx-0"
                            style={{
                              height: "380px",
                              ["--demo-pad" as string]: "24px",
                            }}
                          >
                            <div className="absolute inset-0 z-10 h-full w-full">
                              <div className="sr-only" aria-live="polite">
                                This element contains an interactive demo for
                                sighted users. It&apos;s a demonstration of
                                Cursor integrated within Slack, showing
                                AI-powered assistance inside team communication.
                              </div>
                              <div
                                aria-hidden="true"
                                id="demo-window-slack-cloud"
                                className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                                style={{
                                  left: "clamp(calc(var(--demo-pad) + 160px), 50%, calc(100% - var(--demo-pad) - 160px))",
                                  top: "clamp(calc(var(--demo-pad) + 155px), 47.10526315789474%, calc(100% - var(--demo-pad) - 155px))",
                                  width: "320px",
                                  minWidth: "320px",
                                  height: "310px",
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
                                  <div className="type-product-base pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 truncate text-center opacity-70">
                                    Slack
                                  </div>
                                  <div className="-mr-1 flex items-center" />
                                </div>

                                <div className="min-h-0 w-full flex-1 overflow-hidden">
                                  <div className="h-full min-h-0 w-full">
                                    <div
                                      className="slack-ui-demo flex flex-col overflow-hidden bg-theme-card-hex rounded-lg"
                                      style={{
                                        height: "100%",
                                        fontFamily: "var(--font-system)",
                                      }}
                                    >
                                      <div className="border-theme-border-02 bg-theme-card-hex type-slack-base flex items-center justify-between border-b px-3 py-2">
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                          <button
                                            type="button"
                                            className="flex min-w-0 flex-1 items-center gap-2 rounded transition-colors hover:bg-theme-bg-hover px-0 py-1"
                                            aria-label="Channel info for team-eng"
                                          >
                                            <div className="min-w-0 flex-1 gap-1 text-left">
                                              <div className="flex items-center gap-2">
                                                <h2
                                                  className="text-theme-text-pri type-slack-lg-semibold truncate"
                                                  style={{
                                                    fontSize: "13px",
                                                    fontWeight: 600,
                                                    lineHeight: 1.2,
                                                  }}
                                                >
                                                  #team-eng
                                                </h2>
                                              </div>
                                              <div
                                                className="text-theme-text-sec type-slack-sm"
                                                style={{
                                                  fontSize: "11px",
                                                  lineHeight: 1.25,
                                                }}
                                              >
                                                <span className="flex-shrink-0">
                                                  12 members
                                                </span>
                                              </div>
                                            </div>
                                          </button>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="border-theme-border-02 type-product-base flex items-center rounded-md border px-1 py-1">
                                            <img
                                              alt="member-1"
                                              loading="lazy"
                                              width={20}
                                              height={20}
                                              className="border-theme-card-hex -ml-2 rounded-full border object-cover first:ml-0 h-5 w-5"
                                              src="/marketing-static/users/swhitmore.png"
                                            />
                                            <img
                                              alt="member-2"
                                              loading="lazy"
                                              width={20}
                                              height={20}
                                              className="border-theme-card-hex -ml-2 rounded-full border object-cover first:ml-0 h-5 w-5"
                                              src="/marketing-static/users/eric.jpeg"
                                            />
                                            <img
                                              alt="member-3"
                                              loading="lazy"
                                              width={20}
                                              height={20}
                                              className="border-theme-card-hex -ml-2 rounded-full border object-cover first:ml-0 h-5 w-5"
                                              src="/marketing-static/users/rikki.jpg"
                                            />
                                            <img
                                              alt="member-4"
                                              loading="lazy"
                                              width={20}
                                              height={20}
                                              className="border-theme-card-hex -ml-2 rounded-full border object-cover first:ml-0 h-5 w-5"
                                              src="/marketing-static/users/ryo.png"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex-1 bg-theme-card-hex flex flex-col justify-start overflow-clip">
                                        <div>
                                          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-3 py-1 pt-2 pb-1">
                                            <div className="flex items-start gap-2.5">
                                              <div className="relative flex-shrink-0 w-7 mt-1">
                                                <img
                                                  alt="rikki avatar"
                                                  loading="lazy"
                                                  width={28}
                                                  height={28}
                                                  className="h-7 w-7 rounded object-cover"
                                                  src="/marketing-static/users/rikki.jpg"
                                                />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div
                                                  className="text-theme-text type-slack-base flex items-center gap-1.5"
                                                  style={{
                                                    fontSize: "12.5px",
                                                    lineHeight: 1.25,
                                                  }}
                                                >
                                                  <span className="text-theme-text type-slack-base-semibold">
                                                    rikki
                                                  </span>
                                                  <span
                                                    className="text-theme-text-tertiary type-slack-sm"
                                                    style={{
                                                      fontSize: "11px",
                                                      lineHeight: 1.25,
                                                    }}
                                                  >
                                                    3m
                                                  </span>
                                                </div>
                                                <div>
                                                  <div className="w-full">
                                                    <div
                                                      className="text-theme-text type-slack-base"
                                                      style={{
                                                        fontSize: "12.5px",
                                                      }}
                                                    >
                                                      <div className="min-h-[1.5em]">
                                                        <span className="font-semibold">
                                                          @Cursor
                                                        </span>{" "}
                                                        add unit tests to check
                                                        for edge cases in the
                                                        URL utility functions
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="mt-2 flex flex-wrap gap-1">
                                                    <button
                                                      type="button"
                                                      disabled
                                                      className="bg-theme-card-02-hex border-theme-border-02 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 type-slack-sm transition-all"
                                                    >
                                                      <span>⌛</span>
                                                      <span className="text-theme-text-sec tabular-nums">
                                                        1
                                                      </span>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-3 py-1 pt-2 pb-1">
                                            <div className="flex items-start gap-2.5">
                                              <div className="relative flex-shrink-0 w-7 mt-1">
                                                <img
                                                  alt="Cursor avatar"
                                                  loading="lazy"
                                                  width={28}
                                                  height={28}
                                                  className="h-7 w-7 rounded object-cover"
                                                  src="/marketing-static/icon-192x192.png"
                                                />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div
                                                  className="text-theme-text type-slack-base flex items-center gap-1.5"
                                                  style={{
                                                    fontSize: "12.5px",
                                                    lineHeight: 1.25,
                                                  }}
                                                >
                                                  <span className="text-theme-text type-slack-base-semibold">
                                                    Cursor
                                                  </span>
                                                  <span
                                                    className="text-theme-text-sec bg-theme-border-02 rounded-sm px-1 py-0.5 font-semibold leading-tight"
                                                    style={{
                                                      fontSize: "10.5px",
                                                    }}
                                                  >
                                                    APP
                                                  </span>
                                                  <span
                                                    className="text-theme-text-tertiary type-slack-sm"
                                                    style={{
                                                      fontSize: "11px",
                                                      lineHeight: 1.25,
                                                    }}
                                                  >
                                                    2m
                                                  </span>
                                                </div>
                                                <div>
                                                  <div className="w-full">
                                                    <div
                                                      className="text-theme-text type-slack-base"
                                                      style={{
                                                        fontSize: "12.5px",
                                                      }}
                                                    >
                                                      <div className="min-h-[1.5em]">
                                                        Launched an agent,
                                                        I&apos;ll notify here
                                                        when it&apos;s finished.
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="mt-3 flex flex-wrap gap-2">
                                                    <span className="type-slack-sm-semibold rounded px-2.5 py-1.5 transition-colors border bg-theme-bg-01 border-theme-border-02 text-theme-text-pri hover:bg-theme-bg-hover">
                                                      Open in Cursor
                                                    </span>
                                                    <span className="type-slack-sm-semibold rounded px-2.5 py-1.5 transition-colors border bg-theme-bg-01 border-theme-border-02 text-theme-text-pri hover:bg-theme-bg-hover">
                                                      Open in Web
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
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 3: Linear and Jira */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Linear and Jira</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Assign Cursor to turn issues into PRs.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible bg-theme-card-02-hex">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-[378px] w-full items-center overflow-hidden min-[1140px]:justify-start">
                          <div
                            className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs !w-[380px] mx-auto max-w-none shrink-0 min-[1140px]:mx-0"
                            style={{
                              height: "380px",
                              ["--demo-pad" as string]: "24px",
                            }}
                          >
                            <div className="absolute inset-0 z-10 h-full w-full">
                              <div className="sr-only" aria-live="polite">
                                Interactive demo showing Linear. The interface
                                is displayed over a subtle, solid brand
                                background.
                              </div>
                              <div
                                aria-hidden="true"
                                id="demo-window-linear-cloud"
                                className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                                style={{
                                  left: "clamp(calc(var(--demo-pad) + 160px), 50%, calc(100% - var(--demo-pad) - 160px))",
                                  top: "clamp(calc(var(--demo-pad) + 155px), 47.10526315789474%, calc(100% - var(--demo-pad) - 155px))",
                                  width: "320px",
                                  minWidth: "320px",
                                  height: "310px",
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
                                  <div className="type-product-base pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 truncate text-center opacity-70">
                                    Linear
                                  </div>
                                  <div className="-mr-1 flex items-center" />
                                </div>

                                <div className="min-h-0 w-full flex-1 overflow-visible">
                                  <div className="h-full min-h-0 w-full">
                                    <div
                                      className="bg-theme-product-editor text-theme-text h-full w-full overflow-visible"
                                      style={{
                                        fontFamily: "var(--font-system)",
                                      }}
                                    >
                                      <div className="flex items-center justify-between gap-2 px-4 pt-3 opacity-45">
                                        <div
                                          className="flex min-w-0 items-center gap-1 whitespace-nowrap font-normal"
                                          style={{ fontSize: "11px" }}
                                        >
                                          <span className="text-theme-text-sec flex shrink-0 items-center gap-1">
                                            <svg
                                              viewBox="0 0 100 100"
                                              fill="none"
                                              className="h-3 w-3 opacity-70"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                fill="currentColor"
                                                d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                                              />
                                            </svg>
                                            <span>Acme Core</span>
                                          </span>
                                          <span className="text-theme-text-ter shrink-0 opacity-60">
                                            /
                                          </span>
                                          <span className="text-theme-text shrink-0">
                                            New Issue
                                          </span>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                          <button
                                            type="button"
                                            className="text-theme-text-ter p-1"
                                          >
                                            <svg
                                              viewBox="0 0 16 16"
                                              className="h-3.5 w-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              aria-hidden="true"
                                            >
                                              <path d="M9.5 3h3.5v3.5M13 3l-4.5 4.5M6.5 13H3V9.5M3 13l4.5-4.5" />
                                            </svg>
                                          </button>
                                          <button
                                            type="button"
                                            className="text-theme-text-ter p-1"
                                          >
                                            <svg
                                              viewBox="0 0 16 16"
                                              className="h-3.5 w-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              aria-hidden="true"
                                            >
                                              <path d="M4 4l8 8M12 4l-4 4-4 4" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>

                                      <div className="px-4 pt-3 pb-1 opacity-45">
                                        <div
                                          className="text-theme-text font-semibold leading-tight"
                                          style={{ fontSize: "13.5px" }}
                                        >
                                          Add CI pipeline
                                        </div>
                                        <div
                                          className="text-theme-text-sec mt-1 leading-snug"
                                          style={{ fontSize: "12px" }}
                                        >
                                          Add a GitHub Actions workflow that
                                          checks out the repo and runs test
                                          against it
                                        </div>
                                      </div>

                                      <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center gap-1.5">
                                          <div className="relative">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setLinearAssignee((prev) =>
                                                  prev === "cursor"
                                                    ? "eric"
                                                    : "cursor"
                                                )
                                              }
                                              className="border-theme-border-02 inline-flex h-[22px] items-center gap-1 rounded-[6px] border text-[11px] px-2 bg-theme-card-02-hex text-theme-text cursor-pointer"
                                            >
                                              <svg
                                                viewBox="0 0 16 16"
                                                className="text-theme-text-sec h-3.5 w-3.5"
                                                fill="currentColor"
                                                aria-hidden="true"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M10.25 6.75C10.25 7.99264 9.24264 9 8 9C6.75736 9 5.75 7.99264 5.75 6.75C5.75 5.50736 6.75736 4.5 8 4.5C9.24264 4.5 10.25 5.50736 10.25 6.75Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M8.5752 10C9.97242 10 11.2611 10.6106 12.1436 11.6143C12.1563 11.5997 12.17 11.586 12.1826 11.5713C12.4518 11.2567 12.9255 11.2202 13.2402 11.4893C13.5548 11.7585 13.5913 12.2321 13.3223 12.5469C13.0953 12.8123 12.8478 13.0593 12.584 13.2881C12.5484 13.3246 12.5106 13.3593 12.4668 13.3887C11.3913 14.2811 10.0437 14.8571 8.56738 14.9756C8.56118 14.9762 8.55508 14.978 8.54883 14.9785C8.51409 14.9812 8.4792 14.9822 8.44434 14.9844C8.38882 14.9879 8.3332 14.991 8.27734 14.9932C8.18529 14.9968 8.09287 15 8 15C7.90681 15 7.81406 14.9968 7.72168 14.9932C7.66583 14.991 7.6102 14.9879 7.55469 14.9844C7.52015 14.9822 7.48558 14.9812 7.45117 14.9785C7.44459 14.978 7.43816 14.9763 7.43164 14.9756C5.94988 14.8564 4.59683 14.2772 3.51953 13.3789C3.50616 13.3677 3.49384 13.3556 3.48145 13.3438C3.47213 13.3365 3.46218 13.33 3.45312 13.3223C3.17492 13.0844 2.91561 12.8251 2.67773 12.5469C2.40865 12.2321 2.44515 11.7585 2.75977 11.4893C3.07452 11.2202 3.54818 11.2567 3.81738 11.5713C3.83028 11.5864 3.84339 11.6013 3.85645 11.6162C4.73898 10.612 6.02721 10.0001 7.4248 10H8.5752ZM7.4248 11.5C6.47086 11.5001 5.59107 11.9168 4.9873 12.6016C5.85267 13.1696 6.88689 13.5 8 13.5C9.11327 13.5 10.1472 13.1687 11.0127 12.6006C10.4088 11.9164 9.52878 11.5 8.5752 11.5H7.4248Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M1.82715 6.76172C2.24007 6.79385 2.54868 7.15444 2.5166 7.56738C2.50553 7.70999 2.5 7.85427 2.5 8C2.5 8.14573 2.50553 8.29001 2.5166 8.43262C2.54868 8.84556 2.24007 9.20615 1.82715 9.23828C1.41418 9.27036 1.05357 8.9618 1.02148 8.54883C1.00741 8.36759 1 8.18457 1 8C1 7.81543 1.00741 7.63241 1.02148 7.45117C1.05357 7.0382 1.41418 6.72964 1.82715 6.76172Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M14.1729 6.76172C14.5858 6.72964 14.9464 7.0382 14.9785 7.45117C14.9926 7.63241 15 7.81543 15 8C15 8.18457 14.9926 8.36759 14.9785 8.54883C14.9464 8.9618 14.5858 9.27036 14.1729 9.23828C13.7599 9.20615 13.4513 8.84556 13.4834 8.43262C13.4945 8.29001 13.5 8.14573 13.5 8C13.5 7.85427 13.4945 7.70999 13.4834 7.56738C13.4513 7.15444 13.7599 6.79385 14.1729 6.76172Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M3.45312 2.67773C3.76789 2.40865 4.24155 2.44515 4.51074 2.75977C4.77982 3.07452 4.74329 3.54818 4.42871 3.81738C4.20954 4.00475 4.00475 4.20954 3.81738 4.42871C3.54818 4.74329 3.07452 4.77982 2.75977 4.51074C2.44515 4.24155 2.40865 3.76789 2.67773 3.45312C2.91561 3.17492 3.17492 2.91561 3.45312 2.67773Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M11.4893 2.75977C11.7585 2.44515 12.2321 2.40865 12.5469 2.67773C12.8251 2.91561 13.0844 3.17492 13.3223 3.45312C13.5913 3.76789 13.5548 4.24155 13.2402 4.51074C12.9255 4.77982 12.4518 4.74329 12.1826 4.42871C11.9953 4.20954 11.7905 4.00475 11.5713 3.81738C11.2567 3.54818 11.2202 3.07452 11.4893 2.75977Z"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M8 1C8.18457 1 8.36759 1.00741 8.54883 1.02148C8.9618 1.05357 9.27036 1.41418 9.23828 1.82715C9.20615 2.24007 8.84556 2.54868 8.43262 2.5166C8.29001 2.50553 8.14573 2.5 8 2.5C7.85427 2.5 7.70999 2.50553 7.56738 2.5166C7.15444 2.54868 6.79385 2.24007 6.76172 1.82715C6.72964 1.41418 7.0382 1.05357 7.45117 1.02148C7.63241 1.00741 7.81543 1 8 1Z"
                                                />
                                              </svg>
                                              <span>Assignee</span>
                                            </button>
                                            <div
                                              className="bg-theme-card-hex absolute left-0 z-10 w-[160px] overflow-hidden rounded-md p-1 sm:w-[220px]"
                                              style={{
                                                top: "calc(100% + 4px)",
                                                boxShadow:
                                                  "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                              }}
                                            >
                                              <div
                                                className="text-theme-text-ter px-2 pb-0.5 pt-1.5 opacity-50"
                                                style={{
                                                  fontSize: "11px",
                                                  lineHeight: 1.25,
                                                }}
                                              >
                                                Members
                                              </div>
                                              <div
                                                onMouseEnter={() =>
                                                  setLinearAssignee("eric")
                                                }
                                                onClick={() =>
                                                  setLinearAssignee("eric")
                                                }
                                                className="text-theme-text flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
                                                style={{
                                                  backgroundColor:
                                                    linearAssignee === "eric"
                                                      ? "var(--color-theme-card-hover-hex)"
                                                      : undefined,
                                                  fontSize: "12px",
                                                  lineHeight: 1.25,
                                                }}
                                              >
                                                <img
                                                  alt="eric"
                                                  loading="lazy"
                                                  width={14}
                                                  height={14}
                                                  className="h-3.5 w-3.5 shrink-0 rounded-full object-cover"
                                                  src="/marketing-static/users/eric.jpeg"
                                                />
                                                <span>Eric Zakariasson</span>
                                              </div>
                                              <div
                                                className="text-theme-text-ter px-2 pb-0.5 pt-1.5 opacity-50"
                                                style={{
                                                  fontSize: "11px",
                                                  lineHeight: 1.25,
                                                }}
                                              >
                                                Agents
                                              </div>
                                              <div
                                                onMouseEnter={() =>
                                                  setLinearAssignee("cursor")
                                                }
                                                onClick={() =>
                                                  setLinearAssignee("cursor")
                                                }
                                                className="text-theme-text flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
                                                style={{
                                                  backgroundColor:
                                                    linearAssignee === "cursor"
                                                      ? "var(--color-theme-card-hover-hex)"
                                                      : undefined,
                                                  fontSize: "12px",
                                                  lineHeight: 1.25,
                                                }}
                                              >
                                                <CursorCubeIcon className="text-theme-text h-3.5 w-3.5" />
                                                <span>Cursor</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="opacity-45">
                                            <button
                                              type="button"
                                              className="border-theme-border-02 inline-flex h-[22px] items-center gap-1 rounded-[6px] border text-[11px] px-2 bg-theme-product-editor text-theme-text-sec"
                                            >
                                              <svg
                                                viewBox="0 0 14 14"
                                                className="text-theme-text-ter h-3.5 w-3.5"
                                                fill="currentColor"
                                                aria-hidden="true"
                                              >
                                                <path d="M13.9408 7.91426L11.9576 7.65557C11.9855 7.4419 12 7.22314 12 7C12 6.77686 11.9855 6.5581 11.9576 6.34443L13.9408 6.08573C13.9799 6.38496 14 6.69013 14 7C14 7.30987 13.9799 7.61504 13.9408 7.91426ZM13.4688 4.32049C13.2328 3.7514 12.9239 3.22019 12.5538 2.73851L10.968 3.95716C11.2328 4.30185 11.4533 4.68119 11.6214 5.08659L13.4688 4.32049ZM11.2615 1.4462L10.0428 3.03204C9.69815 2.76716 9.31881 2.54673 8.91341 2.37862L9.67951 0.531163C10.2486 0.767153 10.7798 1.07605 11.2615 1.4462ZM7.91426 0.0591659L7.65557 2.04237C7.4419 2.01449 7.22314 2 7 2C6.77686 2 6.5581 2.01449 6.34443 2.04237L6.08574 0.059166C6.38496 0.0201343 6.69013 0 7 0C7.30987 0 7.61504 0.0201343 7.91426 0.0591659ZM4.32049 0.531164L5.08659 2.37862C4.68119 2.54673 4.30185 2.76716 3.95716 3.03204L2.73851 1.4462C3.22019 1.07605 3.7514 0.767153 4.32049 0.531164ZM1.4462 2.73851L3.03204 3.95716C2.76716 4.30185 2.54673 4.68119 2.37862 5.08659L0.531164 4.32049C0.767153 3.7514 1.07605 3.22019 1.4462 2.73851ZM0.0591659 6.08574C0.0201343 6.38496 0 6.69013 0 7C0 7.30987 0.0201343 7.61504 0.059166 7.91426L2.04237 7.65557C2.01449 7.4419 2 7.22314 2 7C2 6.77686 2.01449 6.5581 2.04237 6.34443L0.0591659 6.08574ZM0.531164 9.67951L2.37862 8.91341C2.54673 9.31881 2.76716 9.69815 3.03204 10.0428L1.4462 11.2615C1.07605 10.7798 0.767153 10.2486 0.531164 9.67951ZM2.73851 12.5538L3.95716 10.968C4.30185 11.2328 4.68119 11.4533 5.08659 11.6214L4.32049 13.4688C3.7514 13.2328 3.22019 12.9239 2.73851 12.5538ZM6.08574 13.9408L6.34443 11.9576C6.5581 11.9855 6.77686 12 7 12C7.22314 12 7.4419 11.9855 7.65557 11.9576L7.91427 13.9408C7.61504 13.9799 7.30987 14 7 14C6.69013 14 6.38496 13.9799 6.08574 13.9408ZM9.67951 13.4688L8.91341 11.6214C9.31881 11.4533 9.69815 11.2328 10.0428 10.968L11.2615 12.5538C10.7798 12.9239 10.2486 13.2328 9.67951 13.4688ZM12.5538 11.2615L10.968 10.0428C11.2328 9.69815 11.4533 9.31881 11.6214 8.91341L13.4688 9.67951C13.2328 10.2486 12.924 10.7798 12.5538 11.2615Z" />
                                              </svg>
                                              <span>R&amp;D</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border-theme-border-02 flex items-center justify-between border-t px-3 py-2 opacity-45">
                                        <button
                                          type="button"
                                          className="text-theme-text-ter p-1 opacity-50"
                                        >
                                          <svg
                                            viewBox="0 0 100 100"
                                            fill="none"
                                            className="h-3.5 w-3.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                                            />
                                          </svg>
                                        </button>
                                        <div className="flex items-center gap-3">
                                          <label
                                            className="text-theme-text-sec flex items-center gap-1.5"
                                            style={{ fontSize: "11.5px" }}
                                          >
                                            <span>Create more</span>
                                          </label>
                                          <button
                                            type="button"
                                            className="rounded-[6px] px-2.5 py-1 text-[11.5px] font-medium text-white"
                                            style={{
                                              backgroundColor:
                                                "rgb(94, 106, 210)",
                                            }}
                                          >
                                            Create issue
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
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Section 3: Save time with always-on agents */}
      <section className="section bg-theme-bg text-theme-text">
        <div className="container my-v2">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">
              Save time with always-on agents
            </h2>
            <div className="flex justify-start mb-v1">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Cursor Automations continuously monitor and improve your
                codebase.
              </div>
            </div>
            <div className="flex justify-start gap-x-g1 items-center">
              <a className="btn" href="https://cursor.com/automations">
                Learn about automations
                <div aria-hidden="true" className="btn-icon">
                  <span aria-hidden="true">→</span>
                </div>
              </a>
            </div>
          </div>

          <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch">
            {/* Card 0: Runs automatically */}
            <div className="h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Runs automatically</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Agents run on schedules or are triggered by events from
                      GitHub, Slack, Linear, webhooks, and more.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 max-h-mobile"
                    style={{
                      ["--layered-media-bg-light" as string]: "#B6B9BE",
                      ["--layered-media-bg-dark" as string]: "#3C3935",
                      ["--max-h-mobile" as string]: "420px",
                    }}
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
                      <div className="relative w-full bg-transparent max-h-[420px] overflow-hidden aspect-4/3-box md:aspect-1/1-box">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5 py-4 max-sm:px-4 max-sm:py-3">
                          <div className="w-full" style={{ maxWidth: "380px" }}>
                            <div
                              className="relative w-full"
                              style={{
                                transition:
                                  "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                              }}
                            >
                              <div className="border-theme-border-02 bg-theme-product-editor w-full overflow-hidden rounded-lg border shadow-lg">
                                <div className="border-theme-border-02 overflow-hidden border-b">
                                  <div className="group/trigger px-3 py-2">
                                    <div className="group/trigger-row type-product-lg flex items-start gap-2">
                                      <div className="flex flex-col items-center self-stretch">
                                        <span className="inline-flex size-3.5 shrink-0 items-center justify-center text-theme-text-sec mt-[calc((1lh_-_0.875rem)/2)]">
                                          <svg
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="size-full"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle cx="8" cy="8" r="6.25" />
                                            <path
                                              d="M8 4.5V8l2.5 1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </span>
                                        <div
                                          aria-hidden="true"
                                          className="bg-theme-border-02 mt-[6px] w-px flex-1 mb-[4px]"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1 pb-4">
                                        <div className="text-theme-text flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setScheduleIdx(
                                                (prev) =>
                                                  (prev + 1) % SCHEDULES.length
                                              )
                                            }
                                            className="cursor-pointer text-left hover:opacity-80"
                                          >
                                            {SCHEDULES[scheduleIdx]}
                                          </button>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        aria-label="Remove Every hour trigger"
                                        onClick={() =>
                                          setScheduleIdx(
                                            (prev) =>
                                              (prev + 1) % SCHEDULES.length
                                          )
                                        }
                                        className="text-theme-text-sec hover:text-theme-text -mr-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-hover/trigger-row:opacity-100 mt-[calc((1lh_-_1.25rem)/2)]"
                                      >
                                        <span
                                          style={{
                                            fontFamily: "CursorIcons16",
                                            fontSize: "14px",
                                            lineHeight: 1,
                                            display: "inline-block",
                                            width: "14px",
                                            height: "14px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {"\uEA81"}
                                        </span>
                                      </button>
                                    </div>

                                    <div className="group/trigger-row type-product-lg flex items-start gap-2">
                                      <div className="flex flex-col items-center self-stretch">
                                        <span className="inline-flex size-3.5 shrink-0 items-center justify-center text-theme-text-sec mt-[calc((1lh_+_6px_-_0.875rem)/2)]">
                                          <SlackColorMark className="size-full origin-center scale-[0.92]" />
                                        </span>
                                        {extraTriggerVisible && (
                                          <div
                                            aria-hidden="true"
                                            className="bg-theme-border-02 mt-[6px] w-px flex-1 mb-[4px]"
                                          />
                                        )}
                                      </div>
                                      <div
                                        className={`min-w-0 flex-1 ${
                                          extraTriggerVisible ? "pb-3" : ""
                                        }`}
                                      >
                                        <div className="text-theme-text flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                                          <span>New message in</span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setChannelIdx(
                                                (prev) =>
                                                  (prev + 1) % CHANNELS.length
                                              )
                                            }
                                            className="type-product-lg inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 whitespace-nowrap transition-opacity hover:opacity-85"
                                            style={{
                                              color: "rgb(78, 140, 181)",
                                              borderColor:
                                                "rgba(78, 140, 181, 0.28)",
                                              backgroundColor:
                                                "rgba(78, 140, 181, 0.12)",
                                            }}
                                          >
                                            {CHANNELS[channelIdx]}
                                            <svg
                                              viewBox="0 0 12 12"
                                              fill="none"
                                              className="size-3 shrink-0 opacity-70"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M3 4.75L6 7.75L9 4.75"
                                                stroke="currentColor"
                                                strokeWidth="1.25"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                        <div className="mt-1 flex items-start">
                                          <div className="border-theme-border-02 ml-[7px] h-[14px] w-[10px] shrink-0 rounded-bl-[3px] border-b border-l" />
                                          <div className="text-theme-text ml-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                            <span>in</span>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setRepoIdx(
                                                  (prev) =>
                                                    (prev + 1) % REPOS.length
                                                )
                                              }
                                              className="type-product-lg inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 whitespace-nowrap transition-opacity hover:opacity-85"
                                              style={{
                                                color: "rgb(78, 140, 181)",
                                                borderColor:
                                                  "rgba(78, 140, 181, 0.28)",
                                                backgroundColor:
                                                  "rgba(78, 140, 181, 0.12)",
                                              }}
                                            >
                                              {REPOS[repoIdx]}
                                              <svg
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                className="size-3 shrink-0 opacity-70"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M3 4.75L6 7.75L9 4.75"
                                                  stroke="currentColor"
                                                  strokeWidth="1.25"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </button>
                                            <span>on</span>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setBranchIdx(
                                                  (prev) =>
                                                    (prev + 1) % BRANCHES.length
                                                )
                                              }
                                              className="type-product-lg inline-flex cursor-pointer items-center gap-1 rounded border px-1.5 py-0.5 whitespace-nowrap transition-opacity hover:opacity-85"
                                              style={{
                                                color: "rgb(78, 140, 181)",
                                                borderColor:
                                                  "rgba(78, 140, 181, 0.28)",
                                                backgroundColor:
                                                  "rgba(78, 140, 181, 0.12)",
                                              }}
                                            >
                                              {BRANCHES[branchIdx]}
                                              <svg
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                className="size-3 shrink-0 opacity-70"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M3 4.75L6 7.75L9 4.75"
                                                  stroke="currentColor"
                                                  strokeWidth="1.25"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        aria-label="Remove New message trigger"
                                        onClick={() =>
                                          setChannelIdx(
                                            (prev) =>
                                              (prev + 1) % CHANNELS.length
                                          )
                                        }
                                        className="text-theme-text-sec hover:text-theme-text -mr-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-hover/trigger-row:opacity-100 mt-[calc((1lh_+_6px_-_1.25rem)/2)]"
                                      >
                                        <span
                                          style={{
                                            fontFamily: "CursorIcons16",
                                            fontSize: "14px",
                                            lineHeight: 1,
                                            display: "inline-block",
                                            width: "14px",
                                            height: "14px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {"\uEA81"}
                                        </span>
                                      </button>
                                    </div>

                                    {extraTriggerVisible && (
                                      <div className="group/trigger-row type-product-lg flex items-start gap-2">
                                        <div className="flex flex-col items-center self-stretch">
                                          <span className="inline-flex size-3.5 shrink-0 items-center justify-center text-theme-text-sec mt-[calc((1lh_-_0.875rem)/2)]">
                                            <GitBranchIcon />
                                          </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="text-theme-text flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                                            <span>Pull request opened on</span>
                                            <span
                                              className="type-product-lg inline-flex items-center gap-1 rounded border px-1.5 py-0.5 whitespace-nowrap"
                                              style={{
                                                color: "rgb(78, 140, 181)",
                                                borderColor:
                                                  "rgba(78, 140, 181, 0.28)",
                                                backgroundColor:
                                                  "rgba(78, 140, 181, 0.12)",
                                              }}
                                            >
                                              {BRANCHES[branchIdx]}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          aria-label="Remove PR trigger"
                                          onClick={() =>
                                            setExtraTriggerVisible(false)
                                          }
                                          className="text-theme-text-sec hover:text-theme-text -mr-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-70 hover:opacity-100"
                                        >
                                          <span
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "14px",
                                              lineHeight: 1,
                                              display: "inline-block",
                                              width: "14px",
                                              height: "14px",
                                              textAlign: "center",
                                            }}
                                          >
                                            {"\uEA81"}
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExtraTriggerVisible((prev) => !prev)
                                  }
                                  className="group/add-trigger relative flex w-full items-center gap-1.5 px-3 py-2 leading-[1.8] type-product-lg transition-colors cursor-pointer text-left text-theme-text-ter hover:text-theme-text opacity-60 hover:opacity-100"
                                >
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-1 rounded-md transition-colors group-hover/add-trigger:bg-theme-card-hover-hex bg-transparent"
                                  />
                                  <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-1.5">
                                    <span
                                      style={{
                                        fontFamily: "CursorIcons16",
                                        fontSize: "14px",
                                        lineHeight: 1,
                                        display: "inline-block",
                                        width: "14px",
                                        height: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {"\uEA60"}
                                    </span>
                                    Add trigger
                                  </div>
                                </button>
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

            {/* Card 1: Works independently */}
            <div className="h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Works independently</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Automated agents follow instructions you define and use
                      your tools through MCP.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible max-h-mobile bg-theme-card-02-hex"
                    style={{ ["--max-h-mobile" as string]: "520px" }}
                  >
                    <div className="z-20 col-span-full row-span-full h-full min-h-0">
                      <div className="aspect-8/9-box md:aspect-1/1-box relative w-full min-[660px]:max-[1139px]:aspect-auto min-[660px]:max-[1139px]:h-full">
                        <div className="absolute inset-0 overflow-hidden px-5 py-4 max-sm:px-4 max-sm:py-3">
                          <div className="flex h-full w-full items-center justify-center">
                            <div
                              className="w-full"
                              style={{ maxWidth: "380px" }}
                            >
                              <div className="w-full space-y-3 max-sm:space-y-2">
                                <div>
                                  <p className="type-product-base text-theme-text-sec mb-1.5 pl-2">
                                    Instructions
                                  </p>
                                  <div
                                    onMouseEnter={() =>
                                      setShowTypedInstructions(true)
                                    }
                                    onMouseLeave={() =>
                                      setShowTypedInstructions(false)
                                    }
                                    onClick={() =>
                                      setShowTypedInstructions((prev) => !prev)
                                    }
                                    className="border-theme-border-02 bg-theme-product-editor relative w-full cursor-pointer rounded-lg border shadow-lg"
                                  >
                                    <div className="relative overflow-hidden px-3 pt-2.5 pb-6">
                                      <p
                                        aria-hidden="true"
                                        className="type-product-lg pointer-events-none invisible leading-normal"
                                      >
                                        Enter prompt text... (type @ for tools
                                        &amp; MCPs, / for skills and commands)
                                      </p>
                                      <div
                                        aria-hidden="true"
                                        className={`type-product-lg pointer-events-none absolute top-2.5 right-3 left-3 leading-normal transition-opacity duration-200 ${
                                          showTypedInstructions
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                        style={{ minHeight: "1.4em" }}
                                      >
                                        Your task is to fix CI failures on main.
                                        Avoid racing other agents. Root cause by
                                        checking logs. Report with{" "}
                                        <span
                                          className="rounded whitespace-nowrap"
                                          style={{
                                            fontSize: "inherit",
                                            lineHeight: "inherit",
                                            padding: "1px 5px 2px",
                                            backgroundColor:
                                              "rgba(201, 162, 39, 0.15)",
                                            color: "rgb(201, 162, 39)",
                                          }}
                                        >
                                          /apply-report-format
                                        </span>
                                      </div>
                                      <p
                                        className="type-product-lg text-theme-text-ter absolute top-2.5 right-3 left-3 leading-normal transition-opacity duration-200"
                                        style={{
                                          opacity: showTypedInstructions
                                            ? 0
                                            : 0.35,
                                        }}
                                      >
                                        Enter prompt text... (type @ for tools
                                        &amp; MCPs, / for skills and commands)
                                      </p>
                                    </div>
                                    <div className="flex items-center px-3 pb-2">
                                      <div className="relative">
                                        <button
                                          type="button"
                                          className="text-theme-text-sec type-product-sm hover:text-theme-text flex cursor-pointer items-center gap-0.5 rounded-md py-0.75 transition-colors"
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
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <p className="type-product-base text-theme-text-sec mb-1.5 pl-2">
                                    Tools
                                  </p>
                                  <div className="border-theme-border-02 bg-theme-product-editor w-full rounded-lg border shadow-lg">
                                    <div className="group/added border-theme-border-02 relative flex items-center gap-2 overflow-hidden border-b px-3 py-2">
                                      <span className="inline-flex size-3.5 shrink-0 items-center justify-center text-theme-text-sec">
                                        <SlackColorMark />
                                      </span>
                                      <span className="type-product-lg text-theme-text min-w-0 flex-1 truncate">
                                        Send to Slack
                                      </span>
                                      <button
                                        type="button"
                                        aria-label="Remove Send to Slack"
                                        className="text-theme-text-sec hover:text-theme-text -mr-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity group-hover/added:opacity-100"
                                      >
                                        <span
                                          style={{
                                            fontFamily: "CursorIcons16",
                                            fontSize: "14px",
                                            lineHeight: 1,
                                            display: "inline-block",
                                            width: "14px",
                                            height: "14px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {"\uEA81"}
                                        </span>
                                      </button>
                                    </div>
                                    <div className="relative">
                                      <button
                                        type="button"
                                        className="group/add-tool relative flex w-full items-center gap-1.5 px-3 py-2 leading-[1.8] type-product-lg transition-colors cursor-pointer text-theme-text-ter hover:text-theme-text opacity-60 hover:opacity-100"
                                      >
                                        <div
                                          aria-hidden="true"
                                          className="pointer-events-none absolute inset-1 rounded-md transition-colors group-hover/add-tool:bg-theme-card-hover-hex bg-transparent"
                                        />
                                        <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-1.5">
                                          <span
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "14px",
                                              lineHeight: 1,
                                              display: "inline-block",
                                              width: "14px",
                                              height: "14px",
                                              textAlign: "center",
                                            }}
                                          >
                                            {"\uEA60"}
                                          </span>
                                          Add Tool or MCP
                                        </div>
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
                </figure>
              </div>
            </div>

            {/* Card 2: Learns from past runs */}
            <div className="h-full">
              <div className="card flex h-full grow-1 flex-col">
                <div className="type-base max-w-prose flex grow flex-col">
                  <div>
                    <h3>Learns from past runs</h3>
                    <div className="text-theme-text-sec text-pretty">
                      Cursor can access a memory tool to learn from past runs
                      and improve with repetition.
                    </div>
                  </div>
                </div>
                <figure className="pt-g1.75">
                  <div
                    className="media-border-container relative grid grid-cols-1 grid-rows-1 overflow-hidden xl:overflow-visible max-h-mobile"
                    style={{
                      ["--layered-media-bg-light" as string]: "#CFCEBC",
                      ["--layered-media-bg-dark" as string]: "#747066",
                      ["--max-h-mobile" as string]: "520px",
                    }}
                  >
                    <div
                      className="media-light absolute inset-0 z-0"
                      style={{ backgroundColor: "#CFCEBC" }}
                    />
                    <div
                      className="media-dark absolute inset-0 z-0"
                      style={{ backgroundColor: "#747066" }}
                    />
                    <div className="z-20 col-span-full row-span-full h-full min-h-0">
                      <div
                        className="aspect-1/1-box md:aspect-1/1-box overflow-hidden min-[660px]:max-[1139px]:aspect-auto min-[660px]:max-[1139px]:h-full"
                        style={{ position: "relative", width: "100%" }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-4 max-sm:px-4 max-sm:py-3">
                          <div
                            className="flex w-full flex-col items-center"
                            style={{ maxWidth: "270px" }}
                          >
                            <div className="relative flex w-full justify-center">
                              <div
                                className="relative w-full"
                                style={{ maxWidth: "210px" }}
                              >
                                <div className="border-theme-border-02 bg-theme-product-editor relative z-10 flex w-full items-center gap-2 overflow-hidden rounded-lg border px-3 py-2 shadow-lg">
                                  <span className="text-theme-text-sec relative z-10 inline-flex size-3.5 shrink-0 items-center justify-center">
                                    <svg
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="size-full"
                                      aria-hidden="true"
                                    >
                                      <path d="M9.59961 0.875C11.2703 0.875 12.625 2.22973 12.625 3.90039V3.93848C14.0513 4.22809 15.125 5.48822 15.125 7V9C15.125 10.5118 14.0514 11.773 12.625 12.0625V12.0996C12.625 13.7703 11.2703 15.125 9.59961 15.125C9.57376 15.125 9.5481 15.122 9.52246 15.1211H9.65039C8.45102 15.1211 7.99609 14.0996 7.99609 14.0996C7.99609 14.0996 7.5918 15.1211 6.34961 15.1211H6.47754C6.4519 15.122 6.42624 15.125 6.40039 15.125C4.72973 15.125 3.375 13.7703 3.375 12.0996V12.0615C1.94869 11.7719 0.875 10.5118 0.875 9V7C0.875 5.48815 1.9486 4.22704 3.375 3.9375V3.90039C3.375 2.22973 4.72973 0.875 6.40039 0.875C6.42624 0.875004 6.4519 0.878026 6.47754 0.878906H6.34961C7.54898 0.878906 8.00391 1.90039 8.00391 1.90039C8.00391 1.90039 8.4082 0.878906 9.65039 0.878906H9.52246C9.5481 0.878026 9.57376 0.875004 9.59961 0.875ZM6.40039 2.125C5.42009 2.125 4.625 2.92009 4.625 3.90039V4.88184C4.625 5.33031 4.87817 5.74084 5.2793 5.94141C5.58803 6.09577 5.71296 6.47056 5.55859 6.7793C5.40423 7.08803 5.02944 7.21296 4.7207 7.05859C3.99963 6.69806 3.51084 6.00852 3.39941 5.22461C2.65866 5.47511 2.125 6.17467 2.125 7V9C2.125 10.0355 2.96447 10.875 4 10.875C4.34518 10.875 4.625 11.1548 4.625 11.5V12.0996C4.625 13.0799 5.42009 13.875 6.40039 13.875C6.93856 13.8748 7.37479 13.4386 7.375 12.9004V3.09961C7.37479 2.56144 6.93856 2.12521 6.40039 2.125ZM9.59961 2.125C9.06144 2.12521 8.62521 2.56144 8.625 3.09961V12.9004C8.62521 13.4386 9.06144 13.8748 9.59961 13.875C10.5799 13.875 11.375 13.0799 11.375 12.0996V11.1182C11.375 10.6697 11.1218 10.2592 10.7207 10.0586C10.412 9.90423 10.287 9.52944 10.4414 9.2207C10.5958 8.91197 10.9706 8.78704 11.2793 8.94141C12 9.30178 12.4879 9.99095 12.5996 10.7744C13.3407 10.5241 13.875 9.82554 13.875 9V7C13.875 5.96447 13.0355 5.125 12 5.125C11.6548 5.125 11.375 4.84518 11.375 4.5V3.90039C11.375 2.92008 10.5799 2.125 9.59961 2.125Z" />
                                    </svg>
                                  </span>
                                  <span className="type-product-base text-theme-text relative z-10 min-w-0 flex-1 truncate font-medium">
                                    Memories
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 w-full space-y-1.5">
                              {MEMORIES.map((memory, index) => {
                                const isHighlighted =
                                  activeMemoryIndex === index;
                                return (
                                  <div
                                    key={memory.title}
                                    onMouseEnter={() =>
                                      setActiveMemoryIndex(index)
                                    }
                                    onClick={() => setActiveMemoryIndex(index)}
                                    className={`bg-theme-card-hex border-theme-border-02 relative w-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 ${
                                      isHighlighted
                                        ? "shadow-md ring-1 ring-white/15 -translate-y-px"
                                        : "opacity-90 hover:opacity-100"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                                      <div className="flex size-4 shrink-0 items-center justify-center">
                                        <CheckCircleIcon />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="type-product-base flex min-w-0 items-center leading-tight">
                                          <span className="text-theme-text truncate">
                                            {memory.title}
                                          </span>
                                        </div>
                                        <p className="type-product-sm text-theme-text-sec mt-0.5 flex items-center gap-1.5">
                                          <span>{memory.time}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
    </>
  );
}
