"use client";

import React, { useEffect, useRef, useState } from "react";

const IOS_APP_STORE_URL =
  "https://apps.apple.com/app/cursor-ai/id6740196926";

const CLOUD_AGENT_RECENT_TASKS = [
  { title: "Fix sign-in redirect on iOS", repo: "cursor/mobile" },
  { title: "Add rate limits to public routes", repo: "cursor/api" },
  { title: "Cache repository search results", repo: "cursor/web" },
  { title: "Investigate flaky CI shard", repo: "cursor/infra" },
  { title: "Retry failed billing webhooks", repo: "cursor/backend" },
  { title: "Polish usage chart loading state", repo: "cursor/dashboard" },
] as const;

const FOLLOW_UP_PROMPT = "Add analytics too.";

function AppleIcon() {
  return (
    <svg
      className="block size-[1.15em] shrink-0 -translate-y-[0.05em]"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function DashboardMiniWalkthrough({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      data-mobile={isMobile ? "true" : undefined}
      className="border-theme-border-02 relative aspect-[16/9] w-[60%] overflow-hidden rounded-md border data-[mobile]:w-full data-[mobile]:rounded-[12px]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[3px]">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          src="/sites/cursor/blob/assets/wallpapers/cloud-agents-2.webp"
        />
        <div className="absolute inset-0 bg-black/[0.08]" />
        <div
          className="bg-theme-product-chrome absolute overflow-hidden rounded-[3px]"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.35) 0px 8px 30px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
            inset: "8% 8% 10%",
          }}
        >
          <div
            className="flex h-[10px] items-center gap-[2px] px-[4px]"
            style={{
              borderBottom:
                "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
            }}
          >
            <div
              className="h-[3.5px] w-[3.5px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3.5px] w-[3.5px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3.5px] w-[3.5px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
          </div>
          <div className="flex h-[calc(100%-10px)]">
            <div
              className="flex w-[24%] shrink-0 flex-col p-[4px] pt-[5px]"
              style={{
                borderRight:
                  "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
              }}
            >
              <div className="flex flex-col gap-[3px]">
                <div
                  className="flex items-center gap-[3px] rounded-[2px] px-[2px] py-[2.5px] transition-all duration-150"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                  }}
                >
                  <div
                    className="h-[5px] w-[5px] shrink-0 rounded-[1.5px] transition-all duration-150"
                    style={{
                      backgroundColor: "var(--color-theme-fg)",
                      opacity: 0.35,
                    }}
                  />
                  <div
                    className="h-[2px] w-[65%] rounded-sm transition-all duration-150"
                    style={{
                      backgroundColor: "var(--color-theme-fg)",
                      opacity: 0.25,
                    }}
                  />
                </div>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-[3px] rounded-[2px] px-[2px] py-[2.5px] transition-all duration-150"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div
                      className="h-[5px] w-[5px] shrink-0 rounded-[1.5px] transition-all duration-150"
                      style={{
                        backgroundColor: "var(--color-theme-fg)",
                        opacity: 0.14,
                      }}
                    />
                    <div
                      className="h-[2px] w-[65%] rounded-sm transition-all duration-150"
                      style={{
                        backgroundColor: "var(--color-theme-fg)",
                        opacity: 0.1,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1" />
              <div
                className="flex items-center gap-[3px] rounded-[2px] px-[2px] py-[2.5px] transition-all duration-150"
                style={{ backgroundColor: "transparent" }}
              >
                <div
                  className="h-[5px] w-[5px] shrink-0 rounded-[1.5px] transition-all duration-150"
                  style={{
                    backgroundColor: "var(--color-theme-fg)",
                    opacity: 0.14,
                  }}
                />
                <div
                  className="h-[2px] w-[65%] rounded-sm transition-all duration-150"
                  style={{
                    backgroundColor: "var(--color-theme-fg)",
                    opacity: 0.1,
                  }}
                />
              </div>
            </div>
            <div className="bg-theme-bg relative min-w-0 flex-1">
              <div className="h-full" style={{ opacity: 1 }}>
                <div
                  className="h-full animate-[fadeIn_150ms_ease-out_both] overflow-hidden"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-theme-fg) 3%, transparent)",
                  }}
                >
                  <div
                    className="bg-theme-bg px-[6px] pt-[7px] pb-0"
                    style={{ transform: "translateY(0px)", transition: "none" }}
                  >
                    <div
                      className="mb-[3px] h-[4.5px] w-[50%] rounded-sm"
                      style={{
                        backgroundColor: "var(--color-theme-fg)",
                        opacity: 0.14,
                      }}
                    />
                    <div
                      className="mb-[6px] h-[3.5px] w-[70%] rounded-sm"
                      style={{
                        backgroundColor: "var(--color-theme-fg)",
                        opacity: 0.08,
                      }}
                    />
                    <div
                      className="w-full overflow-hidden rounded-[2px]"
                      style={{
                        aspectRatio: "2400 / 1260",
                        border:
                          "0.5px solid color-mix(in srgb, var(--color-theme-fg) 6%, transparent)",
                      }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 240 126"
                        preserveAspectRatio="none"
                      >
                        <line x1="0" y1="20" x2="240" y2="20" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.04" />
                        <line x1="0" y1="40" x2="240" y2="40" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.04" />
                        <line x1="0" y1="60" x2="240" y2="60" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.04" />
                        <line x1="0" y1="80" x2="240" y2="80" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.04" />
                        <line x1="0" y1="100" x2="240" y2="100" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.04" />
                        <line x1="40" y1="0" x2="40" y2="126" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.03" />
                        <line x1="80" y1="0" x2="80" y2="126" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.03" />
                        <line x1="120" y1="0" x2="120" y2="126" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.03" />
                        <line x1="160" y1="0" x2="160" y2="126" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.03" />
                        <line x1="200" y1="0" x2="200" y2="126" stroke="var(--color-theme-fg)" strokeWidth="0.3" opacity="0.03" />
                        <path
                          d="M0 95 C12 90 24 72 40 68 S60 80 80 65 S100 42 120 48 S140 60 160 38 S180 20 200 28 S220 18 240 12"
                          fill="none"
                          stroke="var(--color-theme-fg)"
                          strokeWidth="0.6"
                          opacity="0.18"
                        />
                        <path
                          d="M0 95 C12 90 24 72 40 68 S60 80 80 65 S100 42 120 48 S140 60 160 38 S180 20 200 28 S220 18 240 12 L240 126 L0 126 Z"
                          fill="var(--color-theme-fg)"
                          opacity="0.025"
                        />
                        <path
                          d="M0 105 C20 100 50 88 80 82 S120 70 150 58 S190 42 220 35 L240 30"
                          fill="none"
                          stroke="var(--color-theme-fg)"
                          strokeWidth="0.5"
                          opacity="0.12"
                        />
                        <path
                          d="M0 110 C30 108 60 98 90 95 S130 88 160 78 S200 65 230 58 L240 55"
                          fill="none"
                          stroke="var(--color-theme-fg)"
                          strokeWidth="0.4"
                          opacity="0.08"
                        />
                        <circle cx="40" cy="68" r="1.5" fill="var(--color-theme-fg)" opacity="0.2" />
                        <circle cx="80" cy="65" r="1.5" fill="var(--color-theme-fg)" opacity="0.2" />
                        <circle cx="120" cy="48" r="1.5" fill="var(--color-theme-fg)" opacity="0.2" />
                        <circle cx="160" cy="38" r="1.5" fill="var(--color-theme-fg)" opacity="0.2" />
                        <circle cx="200" cy="28" r="1.5" fill="var(--color-theme-fg)" opacity="0.2" />
                      </svg>
                    </div>
                    <div className="mt-[5px] flex flex-col gap-[2.5px]">
                      <div
                        className="h-[2.5px] w-[92%] rounded-sm"
                        style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.1 }}
                      />
                      <div
                        className="h-[2.5px] w-[86%] rounded-sm"
                        style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.1 }}
                      />
                      <div
                        className="h-[2.5px] w-[70%] rounded-sm"
                        style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.08 }}
                      />
                    </div>
                    <div className="mt-[5px] grid grid-cols-2 gap-[3px]">
                      {["72%", "60%", "68%", "55%"].map((w) => (
                        <div
                          key={w}
                          className="flex items-start gap-[3px] rounded-[2px] p-[3px]"
                          style={{
                            border:
                              "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                          }}
                        >
                          <div
                            className="shrink-0 rounded-full"
                            style={{
                              width: "6px",
                              height: "6px",
                              backgroundColor: "var(--color-theme-fg)",
                              opacity: 0.1,
                            }}
                          />
                          <div className="flex-1 pt-[0.5px]">
                            <div
                              className="mb-[2px] h-[2.5px] rounded-sm"
                              style={{
                                width: w,
                                backgroundColor: "var(--color-theme-fg)",
                                opacity: 0.12,
                              }}
                            />
                            <div
                              className="h-[2px] w-[90%] rounded-sm"
                              style={{
                                backgroundColor: "var(--color-theme-fg)",
                                opacity: 0.07,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-[4px] overflow-hidden rounded-[2px]"
                      style={{
                        height: "45px",
                        border:
                          "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                      }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 200 55"
                        preserveAspectRatio="none"
                      >
                        <line x1="0" y1="12" x2="200" y2="12" stroke="var(--color-theme-fg)" strokeWidth="0.2" opacity="0.06" />
                        <line x1="0" y1="24" x2="200" y2="24" stroke="var(--color-theme-fg)" strokeWidth="0.2" opacity="0.06" />
                        <line x1="0" y1="36" x2="200" y2="36" stroke="var(--color-theme-fg)" strokeWidth="0.2" opacity="0.06" />
                        <line x1="0" y1="48" x2="200" y2="48" stroke="var(--color-theme-fg)" strokeWidth="0.2" opacity="0.06" />
                        <circle cx="15" cy="38" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="25" cy="32" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="35" cy="28" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="42" cy="35" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="55" cy="22" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="65" cy="18" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="72" cy="25" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="88" cy="30" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="95" cy="15" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="108" cy="20" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="115" cy="12" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="125" cy="24" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="138" cy="10" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="148" cy="16" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="155" cy="8" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="165" cy="14" r="1.2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="175" cy="18" r="1.6" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                        <circle cx="188" cy="6" r="2" fill="none" stroke="var(--color-theme-fg)" strokeWidth="0.5" opacity="0.22" />
                      </svg>
                    </div>
                    <div
                      className="-mx-[6px] mt-[6px] px-[6px] py-[5px]"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-theme-fg) 3%, transparent)",
                      }}
                    >
                      <div
                        className="text-theme-text mb-[4px] text-[6px] leading-none font-medium italic opacity-40"
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                        }}
                      >
                        Acme Labs
                      </div>
                      <div className="flex gap-[8px]">
                        {[0, 1].map((col) => (
                          <div key={col} className="flex flex-1 flex-col gap-[2.5px]">
                            {[0, 1, 2, 3].map((row) => (
                              <div
                                key={row}
                                className="h-[1.5px] w-[70%] rounded-sm"
                                style={{
                                  backgroundColor: "var(--color-theme-fg)",
                                  opacity: 0.08,
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div
                        className="mt-[8px] h-[1.5px] w-[45%] rounded-sm"
                        style={{
                          backgroundColor: "var(--color-theme-fg)",
                          opacity: 0.05,
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
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {isMobile ? (
          <div
            data-ignore-play-on-hover="true"
            className="ios-glass flex size-8 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-[1px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="relative z-10 ml-px"
            >
              <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
            </svg>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="-ml-px"
            >
              <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export function MobileHeroAndLocalCloud() {
  const [isPlayingWalkthrough, setIsPlayingWalkthrough] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const walkthroughTimersRef = useRef<number[]>([]);

  // Synced state for Remote Control card (Desktop + iOS Phone)
  const [typedDraft, setTypedDraft] = useState("");
  const [remoteStep, setRemoteStep] = useState<"finished" | "typing" | "working">("finished");
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const triggerWalkthrough = () => {
    walkthroughTimersRef.current.forEach((id) => window.clearTimeout(id));
    walkthroughTimersRef.current = [];

    if (isPlayingWalkthrough) {
      setIsPlayingWalkthrough(false);
      setMenuOpen(false);
      return;
    }

    setIsPlayingWalkthrough(true);
    setMenuOpen(true);

    const t1 = window.setTimeout(() => setMenuOpen(false), 1200);
    const t2 = window.setTimeout(() => setMenuOpen(true), 2100);
    const t3 = window.setTimeout(() => setMenuOpen(false), 3200);
    const t4 = window.setTimeout(() => setIsPlayingWalkthrough(false), 3800);
    walkthroughTimersRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    return () => {
      walkthroughTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const scrollBoth = (toBottom: boolean) => {
      [desktopScrollRef.current, mobileScrollRef.current].forEach((el) => {
        if (!el) return;
        const followUp = el.firstElementChild?.lastElementChild as
          | HTMLElement
          | undefined;
        el.scrollTo({
          top: toBottom ? (followUp ? followUp.offsetTop : el.scrollHeight) : 0,
          behavior: "smooth",
        });
      });
    };

    const runCycle = () => {
      setTypedDraft("");
      setRemoteStep("finished");
      scrollBoth(true);

      // Scroll back to top and start typing "Add analytics too." in sync
      schedule(() => {
        scrollBoth(false);
        setRemoteStep("typing");
        for (let i = 1; i <= FOLLOW_UP_PROMPT.length; i++) {
          schedule(() => {
            setTypedDraft(FOLLOW_UP_PROMPT.slice(0, i));
          }, i * 55);
        }
      }, 3600);

      const finishTypingAt = 3600 + FOLLOW_UP_PROMPT.length * 55 + 450;

      // Send follow-up and show Working state on both screens
      schedule(() => {
        setTypedDraft("");
        setRemoteStep("working");
        scrollBoth(true);
      }, finishTypingAt);

      // Complete follow-up -> Finished now
      schedule(() => {
        setRemoteStep("finished");
        scrollBoth(true);
      }, finishTypingAt + 1400);

      schedule(runCycle, finishTypingAt + 5200);
    };

    const initialTimer = window.setTimeout(runCycle, 600);
    timers.push(initialTimer);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const isTypingActive = typedDraft.length > 0;

  return (
    <>
      <section className="section bg-theme-bg text-theme-text">
        <div className="container">
          <div className="grid items-start gap-v2 lg:grid-cols-2">
            <div className="max-w-prose-medium-wide">
              <small className="type-base text-theme-text-sec mb-v2/12 block">
                Mobile
              </small>
              <h1 className="type-lg mb-v2/12 text-balance">
                Build from anywhere
              </h1>
              <p className="type-lg text-theme-text-sec mb-v1 max-w-[14em] text-balance">
                Work with Cursor on the go from the native mobile app on iOS.
              </p>
              <div className="mt-v1">
                <div className="mobile-ios-only">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--leading-icon justify-center gap-2"
                    href={IOS_APP_STORE_URL}
                  >
                    <span className="inline-flex items-center justify-center gap-2 leading-none">
                      <AppleIcon />
                      <span className="leading-none">iOS</span>
                    </span>
                  </a>
                </div>
                <div className="mobile-non-ios-only w-fit flex-col items-stretch gap-3">
                  <a
                    href={IOS_APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Cursor for iOS on the App Store"
                    className="mobile-app-qr-link"
                  >
                    <img
                      alt="QR code for Cursor for iOS"
                      loading="lazy"
                      width={150}
                      height={150}
                      decoding="async"
                      className="mobile-app-qr-image"
                      src="/sites/cursor/blob/assets/blog/qr-code-mobile-final.png"
                      style={{ color: "transparent" }}
                    />
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--leading-icon w-[140px] justify-center gap-2"
                    href={IOS_APP_STORE_URL}
                  >
                    <span className="inline-flex items-center justify-center gap-2 leading-none">
                      <AppleIcon />
                      <span className="leading-none">iOS</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="media-border-container mobile-hero-media overflow-hidden">
              <div className="relative h-[730px] w-full">
                <div
                  className="relative w-full overflow-hidden rounded-xs"
                  style={{ height: "730px" }}
                >
                  <div
                    className="absolute top-1/2 left-[calc(50%-150px)] -translate-y-1/2"
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
                        className="bg-theme-product-editor border-theme-border mobile-phone-screen relative h-full w-full overflow-hidden border"
                        style={{
                          borderRadius: "40px",
                          clipPath: "inset(0px round 40px)",
                          contain: "paint",
                        }}
                      >
                        <div className="relative h-[48px]">
                          <div
                            className="absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black"
                            style={{ top: "8px", width: "96px", height: "28px" }}
                          />
                        </div>
                        <style>{`
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
                        `}</style>
                        <div className="relative flex h-[calc(100%-48px)] flex-col overflow-hidden">
                          <div className="relative z-50 flex h-11 shrink-0 items-center justify-between px-4">
                            <div className="relative h-7 w-7 shrink-0">
                              <div
                                className="absolute inset-0"
                                style={{
                                  transformOrigin: "center center",
                                  opacity: 1,
                                  transform: "none",
                                }}
                              >
                                <button
                                  type="button"
                                  className="ios-glass mobile-interaction-pulse flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--mobile-phone-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                                  aria-label="Back"
                                  data-interaction-pulse="true"
                                >
                                  <span className="relative z-10 flex items-center justify-center">
                                    <svg
                                      className="h-3.5 w-2.5"
                                      width="11"
                                      height="19"
                                      viewBox="0 0 11 19"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M0 9.26465C0 9.09863 0.0276693 8.94922 0.0830078 8.81641C0.14388 8.68359 0.237956 8.55632 0.365234 8.43457L8.77393 0.308105C8.97868 0.103353 9.23047 0.000976562 9.5293 0.000976562C9.72852 0.000976562 9.90837 0.0507812 10.0688 0.150391C10.2349 0.244466 10.3649 0.371745 10.459 0.532227C10.5586 0.692708 10.6084 0.872559 10.6084 1.07178C10.6084 1.36507 10.5005 1.6224 10.2847 1.84375L2.58154 9.26465L10.2847 16.6772C10.5005 16.8986 10.6084 17.1559 10.6084 17.4492C10.6084 17.654 10.5586 17.8366 10.459 17.9971C10.3649 18.1631 10.2349 18.2931 10.0688 18.3872C9.90837 18.4813 9.72852 18.5283 9.5293 18.5283C9.23047 18.5283 8.97868 18.4259 8.77393 18.2212L0.365234 10.0947C0.237956 9.97298 0.14388 9.8457 0.0830078 9.71289C0.0276693 9.57454 0 9.42513 0 9.26465Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                style={{
                                  transformOrigin: "center center",
                                  opacity: 1,
                                  transform: "none",
                                }}
                              >
                                <button
                                  type="button"
                                  disabled
                                  className="ios-glass flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--mobile-phone-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                                  aria-label="More options"
                                >
                                  <span className="relative z-10 flex items-center justify-center">
                                    <svg
                                      className="h-1.5 w-4"
                                      width="20"
                                      height="5"
                                      viewBox="0 0 20 5"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M2.06689 4.14404C1.68506 4.14404 1.33643 4.04997 1.021 3.86182C0.7111 3.67367 0.462077 3.42464 0.273926 3.11475C0.0913086 2.79932 0 2.45345 0 2.07715C0 1.69531 0.0913086 1.34945 0.273926 1.03955C0.462077 0.724121 0.7111 0.472331 1.021 0.28418C1.33643 0.0960286 1.68506 0.00195312 2.06689 0.00195312C2.44873 0.00195312 2.79736 0.0960286 3.11279 0.28418C3.42822 0.472331 3.67725 0.724121 3.85986 1.03955C4.04801 1.34945 4.14209 1.69531 4.14209 2.07715C4.14209 2.45345 4.04801 2.79932 3.85986 3.11475C3.67725 3.42464 3.42822 3.67367 3.11279 3.86182C2.79736 4.04997 2.44873 4.14404 2.06689 4.14404ZM9.90283 4.14404C9.52653 4.14404 9.18066 4.04997 8.86523 3.86182C8.5498 3.67367 8.29801 3.42464 8.10986 3.11475C7.92725 2.79932 7.83594 2.45345 7.83594 2.07715C7.83594 1.69531 7.92725 1.34945 8.10986 1.03955C8.29801 0.724121 8.5498 0.472331 8.86523 0.28418C9.18066 0.0960286 9.52653 0.00195312 9.90283 0.00195312C10.2847 0.00195312 10.6305 0.0960286 10.9404 0.28418C11.2559 0.472331 11.5049 0.724121 11.6875 1.03955C11.8757 1.34945 11.9697 1.69531 11.9697 2.07715C11.9697 2.45345 11.8757 2.79932 11.6875 3.11475C11.5049 3.42464 11.2559 3.67367 10.9404 3.86182C10.6305 4.04997 10.2847 4.14404 9.90283 4.14404ZM17.7388 4.14404C17.3625 4.14404 17.0166 4.04997 16.7012 3.86182C16.3857 3.67367 16.134 3.42464 15.9458 3.11475C15.7632 2.79932 15.6719 2.45345 15.6719 2.07715C15.6719 1.69531 15.7632 1.34945 15.9458 1.03955C16.134 0.724121 16.3857 0.472331 16.7012 0.28418C17.0166 0.0960286 17.3625 0.00195312 17.7388 0.00195312C18.1261 0.00195312 18.4748 0.0960286 18.7847 0.28418C19.0946 0.472331 19.3436 0.724121 19.5317 1.03955C19.7199 1.34945 19.814 1.69531 19.814 2.07715C19.814 2.45345 19.7199 2.79932 19.5317 3.11475C19.3436 3.42464 19.0946 3.67367 18.7847 3.86182C18.4748 4.04997 18.1261 4.14404 17.7388 4.14404Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="relative min-h-0 flex-1 overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{ opacity: 1, zIndex: 2, transform: "none" }}
                            >
                              <div className="relative flex h-full flex-col">
                                <div className="min-h-0 flex-1 overflow-hidden px-5 pt-1 pb-24">
                                  <div className="space-y-4">
                                    <div className="mobile-chat-enter">
                                      <div className="ml-auto max-w-[210px] rounded-[22px] border border-[color:var(--mobile-phone-bubble-border)] bg-[color:var(--mobile-phone-bubble-bg)] px-3.5 py-2.5 backdrop-blur-md">
                                        <p className="type-product-base text-[12px] leading-[1.35] font-normal text-[color:var(--mobile-phone-text-primary)]">
                                          The menu icon button jitters position
                                          whenever the menu is toggled. Make
                                          sure the positioning is stable.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="mobile-chat-enter">
                                        <p
                                          className="type-product-base text-[11px] leading-none text-[color:var(--mobile-phone-muted)]"
                                          style={{ opacity: 1, transform: "none" }}
                                        >
                                          Finished 5m
                                        </p>
                                      </div>
                                      <div className="mobile-chat-enter">
                                        <p className="type-product-base text-[12px] leading-none font-semibold text-[color:var(--mobile-phone-text-primary)]">
                                          Walkthrough
                                        </p>
                                      </div>
                                      <div className="mobile-chat-enter">
                                        <div
                                          className="group/rec cursor-pointer overflow-hidden rounded-[5px] bg-[#2e5167]"
                                          role="button"
                                          tabIndex={0}
                                          aria-label="Play walkthrough"
                                          onClick={triggerWalkthrough}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            ) {
                                              e.preventDefault();
                                              triggerWalkthrough();
                                            }
                                          }}
                                        >
                                          <div className="relative aspect-16/9 overflow-hidden [container-type:inline-size]">
                                            <img
                                              alt=""
                                              className="absolute inset-0 h-full w-full object-cover"
                                              draggable={false}
                                              src="/sites/cursor/blob/assets/wallpapers/cloud-agents-2.webp"
                                            />
                                            <div className="absolute inset-0 bg-black/10" />
                                            <div className="absolute inset-0 overflow-hidden">
                                              <div
                                                className="absolute inset-0 z-20 bg-black/[0.12] backdrop-blur-[2.2cqw] transition-opacity duration-300"
                                                style={{
                                                  opacity: menuOpen ? 1 : 0,
                                                  pointerEvents: "none",
                                                }}
                                              >
                                                <nav className="flex flex-col gap-[3.8cqw] px-[3.8cqw] pt-[14.5cqw]">
                                                  <div
                                                    className="type-product-base text-[5.8cqw] leading-none font-normal text-white/92 transition-opacity duration-200"
                                                    style={{
                                                      opacity: menuOpen ? 1 : 0,
                                                    }}
                                                  >
                                                    Home
                                                  </div>
                                                  <div
                                                    className="type-product-base text-[5.8cqw] leading-none font-normal text-white/58 transition-opacity duration-200"
                                                    style={{
                                                      opacity: menuOpen ? 1 : 0,
                                                    }}
                                                  >
                                                    Products
                                                  </div>
                                                  <div
                                                    className="type-product-base text-[5.8cqw] leading-none font-normal text-white/58 transition-opacity duration-200"
                                                    style={{
                                                      opacity: menuOpen ? 1 : 0,
                                                    }}
                                                  >
                                                    About
                                                  </div>
                                                </nav>
                                              </div>
                                              <div className="absolute top-[3.8cqw] left-[3.4cqw] z-30 h-[4.6cqw] w-[6.1cqw]">
                                                <div
                                                  className="absolute top-1/2 left-0 h-[0.56cqw] w-full -translate-y-1/2 rounded-full bg-white/92 transition-transform duration-200"
                                                  style={{
                                                    transform: menuOpen
                                                      ? "rotate(45deg)"
                                                      : "translateY(-1.65cqw)",
                                                  }}
                                                />
                                                <div
                                                  className="absolute top-1/2 left-0 h-[0.56cqw] w-full -translate-y-1/2 rounded-full bg-white/92 transition-opacity duration-200"
                                                  style={{
                                                    opacity: menuOpen ? 0 : 1,
                                                  }}
                                                />
                                                <div
                                                  className="absolute top-1/2 left-0 h-[0.56cqw] w-full -translate-y-1/2 rounded-full bg-white/92 transition-transform duration-200"
                                                  style={{
                                                    transform: menuOpen
                                                      ? "rotate(-45deg)"
                                                      : "translateY(1.65cqw)",
                                                  }}
                                                />
                                              </div>
                                              <div className="absolute inset-x-[3.5cqw] bottom-[3.5cqw] z-10 flex flex-col items-start">
                                                <div className="type-product-base text-[6.2cqw] leading-[1.07] tracking-[-0.02em]">
                                                  <div className="text-white/92">
                                                    Acme Labs
                                                  </div>
                                                  <div className="text-white/72">
                                                    Software is changing.
                                                  </div>
                                                </div>
                                                <div className="mt-[5cqw] flex w-fit items-center rounded-full bg-white/25 px-[4cqw] py-[2.3cqw] backdrop-blur-[0.8cqw]">
                                                  <span className="type-product-base text-[4.1cqw] leading-none font-semibold text-white/92">
                                                    Sign up
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                                              style={{
                                                opacity: isPlayingWalkthrough
                                                  ? 0
                                                  : 1,
                                                transform: "none",
                                              }}
                                            >
                                              <div className="ios-glass flex size-8 items-center justify-center rounded-full text-white backdrop-blur-[1px]">
                                                <svg
                                                  className="relative z-10 ml-px size-3.5"
                                                  width="12"
                                                  height="14"
                                                  viewBox="0 0 12 14"
                                                  fill="none"
                                                  aria-hidden="true"
                                                >
                                                  <path
                                                    d="M0.000390604 1.64922C0.000390604 1.24922 0.117057 0.915885 0.350391 0.649218C0.583724 0.382552 0.867057 0.215885 1.20039 0.149219C1.56706 0.0492182 1.91706 0.0992182 2.25039 0.299219L11.0504 5.39922C11.3837 5.56589 11.6004 5.83255 11.7004 6.19922C11.8337 6.53255 11.8337 6.88255 11.7004 7.24922C11.6004 7.58255 11.3837 7.83255 11.0504 7.99922L2.25039 13.0992C1.91706 13.2992 1.56706 13.3659 1.20039 13.2992C0.867057 13.1992 0.583724 13.0159 0.350391 12.7492C0.117057 12.4826 0.000390604 12.1492 0.000390604 11.7492V1.64922Z"
                                                    fill="currentColor"
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mobile-chat-enter">
                                        <p className="type-product-base text-[11px] leading-snug text-[color:var(--mobile-phone-text-soft)]">
                                          Manually verified in Chrome at{" "}
                                          <span className="text-[color:var(--mobile-phone-link)]">
                                            http://localhost:4000/agents
                                          </span>{" "}
                                          that sidebar toggle now stays at a
                                          stable position (12px, 12px) from the
                                          viewport in both open and closed
                                          states.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mobile-chat-fade">
                                  <div className="absolute right-3 bottom-[68px] left-3 flex items-center gap-2">
                                    <button
                                      type="button"
                                      data-interaction-pulse="true"
                                      className="ios-glass mobile-interaction-pulse type-product-base cursor-pointer rounded-full px-2 py-1 text-[11px] font-medium text-[color:var(--mobile-phone-text-primary)]"
                                    >
                                      <span className="relative z-10 flex items-center gap-1">
                                        <span
                                          style={{
                                            fontFamily: "CursorIcons16",
                                            fontSize: "12px",
                                            lineHeight: 1,
                                            display: "inline-block",
                                            width: "12px",
                                            height: "12px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {"\uEAFE"}
                                        </span>
                                        <span>View PR</span>
                                        <span className="text-[color:var(--mobile-phone-green)]">
                                          +2
                                        </span>
                                        <span className="text-[color:var(--mobile-phone-red)]">
                                          −2
                                        </span>
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                <div className="mobile-interaction-pulse absolute right-3 bottom-4 left-3 z-10 h-11 rounded-full">
                                  <div
                                    className="ios-glass absolute inset-0 rounded-full"
                                    style={{ borderRadius: "22px", opacity: 1 }}
                                  />
                                  <div className="relative z-10 flex h-full items-center rounded-full px-2">
                                    <button
                                      type="button"
                                      aria-label="Add context"
                                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                                      style={{ opacity: 1 }}
                                    >
                                      <svg
                                        className="relative z-10 h-4"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M7 3v8M3 7h8"
                                          stroke="currentColor"
                                          strokeWidth="1.4"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      className="type-product-base relative z-10 flex h-7 min-w-0 flex-1 items-center truncate px-3 text-left text-[13px] leading-none text-[color:var(--mobile-phone-placeholder)] enabled:cursor-pointer"
                                    >
                                      Follow up...
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Start voice input"
                                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                                      style={{ opacity: 1 }}
                                    >
                                      <svg
                                        className="relative z-10 h-4"
                                        width="13"
                                        height="18"
                                        viewBox="0 0 13 18"
                                        fill="none"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M11.9398 5.63812C12.1398 5.63812 12.2998 5.71812 12.4198 5.87812C12.5398 5.99812 12.5998 6.13813 12.5998 6.29813V8.03812C12.5998 8.87812 12.4398 9.67812 12.1198 10.4381C11.7998 11.1981 11.3398 11.8781 10.7398 12.4781C10.1798 13.0781 9.4998 13.5381 8.6998 13.8581C8.17981 14.0981 7.61981 14.2381 7.01981 14.2781V16.4381C7.01981 16.6381 6.93981 16.8181 6.77981 16.9781C6.6598 17.0981 6.4998 17.1581 6.2998 17.1581C6.0998 17.1581 5.9198 17.0981 5.7598 16.9781C5.6398 16.8181 5.5798 16.6381 5.5798 16.4381V14.2781C4.9798 14.2381 4.4198 14.0981 3.8998 13.8581C3.0998 13.5381 2.3998 13.0781 1.7998 12.4781C1.2398 11.8781 0.799805 11.1981 0.479805 10.4381C0.159805 9.67812 -0.000195205 8.87812 -0.000195205 8.03812V6.29813C-0.000195205 6.13813 0.0598047 5.99812 0.179805 5.87812C0.299805 5.71812 0.459805 5.63812 0.659805 5.63812C0.859805 5.63812 1.0198 5.71812 1.1398 5.87812C1.2998 5.99812 1.3798 6.13813 1.3798 6.29813V8.03812C1.3798 8.67812 1.4998 9.29812 1.7398 9.89812C1.9798 10.4981 2.3398 11.0381 2.8198 11.5181C3.2998 11.9581 3.8398 12.3181 4.4398 12.5981C5.0398 12.8381 5.6598 12.9581 6.2998 12.9581C6.9398 12.9581 7.5598 12.8381 8.15981 12.5981C8.75981 12.3181 9.29981 11.9581 9.7798 11.5181C10.2598 11.0381 10.6198 10.4981 10.8598 9.89812C11.0998 9.29812 11.2198 8.67812 11.2198 8.03812V6.29813C11.2198 6.13813 11.2798 5.99812 11.3998 5.87812C11.5598 5.71812 11.7398 5.63812 11.9398 5.63812ZM6.2998 -0.0018754C7.0998 -0.0018754 7.7798 0.298125 8.3398 0.898125C8.93981 1.45812 9.23981 2.13813 9.23981 2.93813V8.03812C9.23981 8.83812 8.93981 9.53812 8.3398 10.1381C7.7798 10.6981 7.0998 10.9781 6.2998 10.9781C5.4998 10.9781 4.7998 10.6981 4.19981 10.1381C3.6398 9.53812 3.3598 8.83812 3.3598 8.03812V2.93813C3.3598 2.13813 3.6398 1.45812 4.19981 0.898125C4.7998 0.298125 5.4998 -0.0018754 6.2998 -0.0018754Z"
                                          fill="currentColor"
                                        />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="local-and-cloud">
        <div className="container">
          <div className="mb-v2 max-w-prose text-left">
            <h2 className="type-md-lg text-balance">
              The best of local and cloud
            </h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Manage all your agents on mobile, no matter where they run.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="container my-v2">
            <div className="mb-g1 grid grid-cols-1 items-stretch gap-g1 xl:grid-cols-2">
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Cloud Agents</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Launch always-on agents in parallel. Each one gets its
                        own isolated VM with a full development environment to
                        test and iterate on PRs.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/cloud-agent" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#CAC6BE",
                          "--layered-media-bg-dark": "#47433C",
                          height: "378px",
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
                              className="absolute top-6 left-1/2 -translate-x-1/2"
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
                                  className="bg-theme-product-editor border-theme-border mobile-phone-screen relative h-full w-full overflow-hidden border"
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
                                      {CLOUD_AGENT_RECENT_TASKS.map((item) => (
                                        <div
                                          key={item.title}
                                          style={{ opacity: 1, transform: "none" }}
                                        >
                                          <button
                                            type="button"
                                            disabled
                                            className="mobile-interaction-pulse mobile-interaction-pulse--workspace-row relative flex w-full cursor-default items-start gap-2.5 rounded-[12px] px-0 text-left font-[system-ui]"
                                          >
                                            <span
                                              className="relative mt-2 -mr-[4.5px] -ml-[4.5px] h-[15px] w-[15px] shrink-0 text-[color:var(--mobile-phone-dot)] data-[active]:text-[color:var(--mobile-phone-blue)]"
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
                                                {item.title}
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
                                                <span className="shrink-0">
                                                  ·
                                                </span>
                                                <span className="shrink-0 truncate">
                                                  {item.repo}
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

              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Remote Control</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Control agents running on your computer from your phone.
                        You can also choose to keep your computer awake while
                        connected.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/cloud-agent" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container responsive-media-height bg-theme-card-02-hex relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-height": "378px",
                          "--layered-media-height-mobile": "756px",
                        } as React.CSSProperties
                      }
                    >
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div
                          data-remote-control-demo="true"
                          className="bg-theme-card-02-hex relative h-full w-full overflow-hidden rounded-xs"
                        >
                          {/* Left Pane: Cursor Desktop */}
                          <section className="remote-control-desktop-pane absolute inset-x-0 top-0 h-1/2 overflow-hidden xl:inset-y-0 xl:right-auto xl:h-auto xl:w-1/2">
                            <div className="absolute top-3 bottom-3 left-1/2 z-10 w-[calc(100%-1.5rem)] max-w-[400px] -translate-x-1/2">
                              <div
                                className="bg-theme-card-hex text-theme-text flex h-full w-full flex-col overflow-hidden rounded-[10px]"
                                style={{
                                  boxShadow:
                                    "0 10px 24px -16px rgba(0, 0, 0, 0.35), 0 2px 8px -6px rgba(0, 0, 0, 0.18), 0 0 0 1px var(--color-theme-border-02)",
                                }}
                              >
                                <div className="border-theme-border-02 flex h-7 shrink-0 items-center justify-between border-b px-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{
                                        backgroundColor:
                                          "var(--color-theme-fg-20)",
                                      }}
                                    />
                                    <div
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{
                                        backgroundColor:
                                          "var(--color-theme-fg-20)",
                                      }}
                                    />
                                    <div
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{
                                        backgroundColor:
                                          "var(--color-theme-fg-20)",
                                      }}
                                    />
                                  </div>
                                  <span className="text-theme-text-sec text-[11px] font-medium">
                                    Cursor Desktop
                                  </span>
                                  <div className="w-10" />
                                </div>
                                <div className="min-h-0 flex-1 overflow-hidden">
                                  <div className="bg-theme-product-chrome relative h-full overflow-hidden">
                                    <div
                                      className="absolute inset-0"
                                      style={{ opacity: 1, transform: "none" }}
                                    >
                                      <div
                                        ref={desktopScrollRef}
                                        className="bg-theme-product-chrome h-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain px-3 pt-3 [container-type:size] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                      >
                                        <div>
                                          <div className="bg-theme-product-editor border-theme-border-02 type-product-base text-theme-text ml-auto w-fit max-w-[250px] rounded-[18px] border px-2.5 py-2 text-[11px] leading-[1.4]">
                                            Add dashboard shortcuts to the
                                            command palette.
                                          </div>
                                          <div className="mt-2 space-y-2 px-1">
                                            <div className="space-y-1.5">
                                              <div className="type-product-sm text-theme-text-sec data-[follow-up]:text-theme-text h-4 text-[11px]">
                                                <span
                                                  className="inline-block"
                                                  style={{
                                                    opacity: 1,
                                                    transform: "none",
                                                  }}
                                                >
                                                  Finished 6m
                                                </span>
                                              </div>
                                              <div
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <p className="type-product-base text-theme-text text-[11px] leading-[1.35] data-[mobile]:text-[color:var(--mobile-phone-text-primary)]">
                                                  Added keyboard shortcuts for
                                                  every dashboard view and
                                                  registered them in the command
                                                  palette.
                                                </p>
                                              </div>
                                              <p
                                                className="type-product-base text-theme-text text-[11px] leading-none font-semibold data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Walkthrough
                                              </p>
                                              <div
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <DashboardMiniWalkthrough />
                                              </div>
                                              <p
                                                className="type-product-base text-theme-text pt-0.5 text-[11px] leading-none font-semibold data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Summary
                                              </p>
                                              <p
                                                className="type-product-base text-theme-text text-[11px] leading-[1.35] data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Shortcuts now cover every
                                                dashboard view and are available
                                                from the command palette.
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="min-h-[calc(100cqh+32px)] space-y-2 px-1 pt-4 transition-opacity duration-200"
                                            style={{
                                              opacity:
                                                remoteStep === "typing"
                                                  ? 0.35
                                                  : 1,
                                            }}
                                          >
                                            <div className="bg-theme-product-editor border-theme-border-02 type-product-base text-theme-text ml-auto w-fit max-w-[250px] rounded-[18px] border px-2.5 py-2 text-[11px] leading-[1.4]">
                                              Add analytics too.
                                            </div>
                                            <div className="space-y-1.5">
                                              <div className="type-product-sm text-theme-text-sec data-[follow-up]:text-theme-text h-4 text-[11px]">
                                                <span
                                                  className={
                                                    remoteStep === "working"
                                                      ? "shimmer shimmer-synced inline-block"
                                                      : "inline-block"
                                                  }
                                                  style={{
                                                    opacity: 1,
                                                    transform: "none",
                                                  }}
                                                >
                                                  {remoteStep === "working"
                                                    ? "Working"
                                                    : "Finished now"}
                                                </span>
                                              </div>
                                              <p
                                                className="type-product-base text-theme-text text-[11px] leading-[1.35] transition-opacity duration-200 data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity:
                                                    remoteStep === "working"
                                                      ? 0.25
                                                      : 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Added the analytics shortcut and
                                                updated the command palette
                                                entry.
                                              </p>
                                              <p
                                                className="type-product-base text-theme-text-sec text-[11px] leading-[1.35] transition-opacity duration-200 data-[mobile]:text-[color:var(--mobile-phone-text-soft)]"
                                                style={{
                                                  opacity:
                                                    remoteStep === "working"
                                                      ? 0.25
                                                      : 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Dashboard shortcuts are ready
                                                for navigation and analytics.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      aria-hidden="true"
                                      className="via-theme-product-chrome to-theme-product-chrome pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent"
                                    />
                                    <div className="absolute right-2 bottom-2 left-2 z-20">
                                      <div className="bg-theme-product-editor border-theme-border-02 relative grid h-10 grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-x-2 rounded-[20px] border px-2 data-[multiline]:h-auto data-[multiline]:gap-y-1.5 data-[multiline]:py-2">
                                        <span
                                          className="type-product-base pointer-events-none invisible absolute text-[13px] whitespace-nowrap"
                                          aria-hidden="true"
                                        />
                                        <div className="bg-theme-card-02-hex text-theme-text-sec col-start-1 row-start-1 flex size-6 shrink-0 items-center justify-center rounded-full data-[multiline]:row-start-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                          >
                                            <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                                          </svg>
                                        </div>
                                        <div className="type-product-base col-start-2 row-start-1 min-w-0 overflow-hidden text-[13px] leading-[1.4] whitespace-nowrap data-[multiline]:col-span-3 data-[multiline]:col-start-1 data-[multiline]:w-full data-[multiline]:overflow-visible data-[multiline]:[overflow-wrap:anywhere] data-[multiline]:whitespace-pre-wrap">
                                          <span
                                            className={
                                              isTypingActive
                                                ? "text-theme-text opacity-100"
                                                : "text-theme-text-ter opacity-60"
                                            }
                                          >
                                            {isTypingActive
                                              ? typedDraft
                                              : "Send follow-up"}
                                          </span>
                                        </div>
                                        <div
                                          data-active={
                                            isTypingActive ? "true" : undefined
                                          }
                                          className="bg-theme-card-03-hex text-theme-text-sec data-[active]:bg-theme-button-bg data-[active]:text-theme-button-text col-start-3 row-start-1 flex size-6 shrink-0 items-center justify-center rounded-full data-[multiline]:row-start-2"
                                          style={{ transform: "none" }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="11"
                                            height="11"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                          >
                                            <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="text-theme-text-sec mt-1 flex h-6 items-center gap-3 px-1">
                                        <div className="type-product-sm flex max-w-[190px] min-w-0 items-center gap-1.5">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="13"
                                            height="13"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                          >
                                            <path d="M232,64a32,32,0,1,0-40,31v17a8,8,0,0,1-8,8H96a23.84,23.84,0,0,0-8,1.38V95a32,32,0,1,0-16,0v66a32,32,0,1,0,16,0V144a8,8,0,0,1,8-8h88a24,24,0,0,0,24-24V95A32.06,32.06,0,0,0,232,64ZM64,64A16,16,0,1,1,80,80,16,16,0,0,1,64,64ZM96,192a16,16,0,1,1-16-16A16,16,0,0,1,96,192ZM200,80a16,16,0,1,1,16-16A16,16,0,0,1,200,80Z" />
                                          </svg>
                                          <span className="truncate">
                                            acme/main
                                          </span>
                                        </div>
                                        <div className="relative shrink-0">
                                          <button
                                            type="button"
                                            aria-expanded="false"
                                            aria-label="Select runtime"
                                            className="type-product-sm text-theme-text flex cursor-pointer items-center gap-1.5"
                                          >
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 300 300"
                                              fill="currentColor"
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="text-theme-text-sec"
                                              aria-hidden="true"
                                            >
                                              <path d="M113 26Q117 26 120.5 29.5Q124 33 124.0 37.5Q124 42 120.5 45.5Q117 49 113 49H47Q44 49 42.0 51.0Q40 53 40 56V178Q40 181 42.0 183.0Q44 185 47 185H253Q256 185 258.0 183.0Q260 181 260 178V159Q260 155 263.5 151.5Q267 148 272.0 148.0Q277 148 280.5 151.5Q284 155 284 159V178Q284 191 275.0 200.0Q266 209 253 209H162V251H216Q220 251 223.5 254.5Q227 258 227.0 262.5Q227 267 223.5 270.5Q220 274 216 274H84Q80 274 76.5 270.5Q73 267 73.0 262.5Q73 258 76.5 254.5Q80 251 84 251H138V209H47Q34 209 25.0 200.0Q16 191 16 178V56Q16 44 25.0 35.0Q34 26 47 26ZM151 20Q155 16 159.5 16.0Q164 16 168 20L199 51Q205 57 205.0 65.5Q205 74 199 81L168 111Q164 115 159.5 115.0Q155 115 151.5 111.5Q148 108 148.0 103.0Q148 98 151 95L180 66L151 36Q148 33 148.0 28.0Q148 23 151 20ZM264 20Q267 16 272.0 16.0Q277 16 280.5 19.5Q284 23 284.0 28.0Q284 33 280 36L251 66L280 95Q284 98 284.0 103.0Q284 108 280.5 111.5Q277 115 272.0 115.0Q267 115 264 111L233 81Q227 74 227.0 65.5Q227 57 233 51Z" />
                                            </svg>
                                            <span>Remote Control</span>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="11"
                                              height="11"
                                              fill="currentColor"
                                              viewBox="0 0 256 256"
                                              className="opacity-60"
                                            >
                                              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>

                          {/* Right Pane: iOS Phone */}
                          <section className="remote-control-mobile-pane border-theme-border-02 absolute inset-x-0 bottom-0 h-1/2 overflow-hidden border-t xl:inset-y-0 xl:right-0 xl:left-auto xl:h-auto xl:w-1/2 xl:border-t-0 xl:border-l">
                            <div
                              className="relative h-full w-full overflow-hidden rounded-xs"
                              style={{ height: "100%" }}
                            >
                              <div
                                className="absolute top-3 left-1/2 -translate-x-1/2"
                                style={{ width: "276px", height: "598px" }}
                              >
                                <div
                                  className="absolute"
                                  style={{
                                    right: "-2.76px",
                                    top: "185.783px",
                                    height: "70.7479px",
                                    width: "3.68px",
                                    borderRadius: "0px 1.84px 1.84px 0px",
                                    background:
                                      "linear-gradient(to right, rgb(28, 28, 30), rgb(44, 44, 46))",
                                  }}
                                />
                                <div
                                  className="absolute"
                                  style={{
                                    left: "-2.76px",
                                    top: "122.43px",
                                    height: "27.5797px",
                                    width: "3.68px",
                                    borderRadius: "1.84px 0px 0px 1.84px",
                                    background:
                                      "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                                  }}
                                />
                                <div
                                  className="absolute"
                                  style={{
                                    left: "-2.76px",
                                    top: "170.395px",
                                    height: "44.7671px",
                                    width: "3.68px",
                                    borderRadius: "1.84px 0px 0px 1.84px",
                                    background:
                                      "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                                  }}
                                />
                                <div
                                  className="absolute"
                                  style={{
                                    left: "-2.76px",
                                    top: "227.153px",
                                    height: "44.7671px",
                                    width: "3.68px",
                                    borderRadius: "1.84px 0px 0px 1.84px",
                                    background:
                                      "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
                                  }}
                                />
                                <div
                                  className="relative overflow-hidden"
                                  style={{
                                    width: "276px",
                                    height: "598px",
                                    borderRadius: "40.48px",
                                    clipPath: "inset(0px round 40.48px)",
                                    contain: "paint",
                                    padding: "4px",
                                  }}
                                >
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      borderRadius: "40.48px",
                                      backgroundColor: "rgb(58, 58, 60)",
                                    }}
                                  />
                                  <div
                                    className="bg-theme-product-editor border-theme-border mobile-phone-screen relative h-full w-full overflow-hidden border"
                                    style={{
                                      borderRadius: "36.8px",
                                      clipPath: "inset(0px round 36.8px)",
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
                                    <div className="relative h-[calc(100%-48px)]">
                                      <div
                                        ref={mobileScrollRef}
                                        className="relative z-10 h-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain [container-type:size] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                      >
                                        <div
                                          className="px-4 pt-3 pb-24"
                                          style={{
                                            opacity: 1,
                                            transform: "none",
                                          }}
                                        >
                                          <div className="ml-auto w-fit max-w-[220px] rounded-[18px] border border-[color:var(--mobile-phone-bubble-border)] bg-[color:var(--mobile-phone-bubble-bg)] px-2.5 py-1.5 backdrop-blur-md">
                                            <p className="type-product-base text-[11px] leading-[1.35] text-[color:var(--mobile-phone-text-primary)]">
                                              Add dashboard shortcuts to the
                                              command palette.
                                            </p>
                                          </div>
                                          <div className="mt-2 space-y-2 px-1">
                                            <div className="space-y-1.5">
                                              <div
                                                data-mobile="true"
                                                className="type-product-sm text-theme-text-sec data-[follow-up]:text-theme-text h-4 text-[11px]"
                                                style={{
                                                  color:
                                                    "var(--mobile-phone-muted)",
                                                }}
                                              >
                                                <span
                                                  className="inline-block"
                                                  style={{
                                                    opacity: 1,
                                                    transform: "none",
                                                  }}
                                                >
                                                  Finished 6m
                                                </span>
                                              </div>
                                              <div
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <p
                                                  data-mobile="true"
                                                  className="type-product-base text-theme-text text-[11px] leading-[1.35] data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                >
                                                  Added keyboard shortcuts for
                                                  every dashboard view and
                                                  registered them in the command
                                                  palette.
                                                </p>
                                              </div>
                                              <p
                                                data-mobile="true"
                                                className="type-product-base text-theme-text text-[11px] leading-none font-semibold data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Walkthrough
                                              </p>
                                              <div
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                <DashboardMiniWalkthrough
                                                  isMobile
                                                />
                                              </div>
                                              <p
                                                data-mobile="true"
                                                className="type-product-base text-theme-text pt-0.5 text-[11px] leading-none font-semibold data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Summary
                                              </p>
                                              <p
                                                data-mobile="true"
                                                className="type-product-base text-theme-text text-[11px] leading-[1.35] data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity: 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Shortcuts now cover every
                                                dashboard view and are available
                                                from the command palette.
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="min-h-[calc(100cqh+32px)] space-y-2 px-1 pt-4 transition-opacity duration-200"
                                            style={{
                                              opacity:
                                                remoteStep === "typing"
                                                  ? 0.35
                                                  : 1,
                                            }}
                                          >
                                            <div className="ml-auto w-fit max-w-[220px] rounded-[18px] border border-[color:var(--mobile-phone-bubble-border)] bg-[color:var(--mobile-phone-bubble-bg)] px-2.5 py-1.5 backdrop-blur-md">
                                              <p className="type-product-base text-[11px] leading-[1.35] text-[color:var(--mobile-phone-text-primary)]">
                                                Add analytics too.
                                              </p>
                                            </div>
                                            <div className="space-y-1.5">
                                              <div
                                                data-mobile="true"
                                                className="type-product-sm text-theme-text-sec data-[follow-up]:text-theme-text h-4 text-[11px]"
                                                style={{
                                                  color:
                                                    "var(--mobile-phone-muted)",
                                                }}
                                              >
                                                <span
                                                  className={
                                                    remoteStep === "working"
                                                      ? "shimmer shimmer-synced inline-block"
                                                      : "inline-block"
                                                  }
                                                  style={{
                                                    opacity: 1,
                                                    transform: "none",
                                                  }}
                                                >
                                                  {remoteStep === "working"
                                                    ? "Working"
                                                    : "Finished now"}
                                                </span>
                                              </div>
                                              <p
                                                data-mobile="true"
                                                className="type-product-base text-theme-text text-[11px] leading-[1.35] transition-opacity duration-200 data-[mobile]:text-[color:var(--mobile-phone-text-primary)]"
                                                style={{
                                                  opacity:
                                                    remoteStep === "working"
                                                      ? 0.25
                                                      : 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Added the analytics shortcut and
                                                updated the command palette
                                                entry.
                                              </p>
                                              <p
                                                data-mobile="true"
                                                className="type-product-base text-theme-text-sec text-[11px] leading-[1.35] transition-opacity duration-200 data-[mobile]:text-[color:var(--mobile-phone-text-soft)]"
                                                style={{
                                                  opacity:
                                                    remoteStep === "working"
                                                      ? 0.25
                                                      : 1,
                                                  transform: "none",
                                                }}
                                              >
                                                Dashboard shortcuts are ready
                                                for navigation and analytics.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="pointer-events-none absolute -top-12 right-0 left-0 z-40 h-14 bg-[color:var(--mobile-phone-bg)]" />
                                      <div className="pointer-events-none absolute top-2 right-0 left-0 z-40 h-4 bg-gradient-to-b from-[color:var(--mobile-phone-bg)]/90 to-transparent" />
                                      <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 z-30 h-24 bg-gradient-to-b from-transparent via-[color:var(--mobile-phone-bg)] to-[color:var(--mobile-phone-bg)]"
                                        style={{ bottom: "227px" }}
                                      />
                                      <div
                                        className="absolute right-3 left-3 z-40"
                                        style={{ bottom: "239px" }}
                                      >
                                        <div
                                          data-mobile="true"
                                          className="bg-theme-product-editor border-theme-border-02 text-theme-text-sec flex h-10 items-center gap-2 rounded-[14px] border px-2 shadow-sm data-[mobile]:rounded-full"
                                        >
                                          <div className="bg-theme-card-02-hex flex size-6 shrink-0 items-center justify-center rounded-full">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="12"
                                              height="12"
                                              fill="currentColor"
                                              viewBox="0 0 256 256"
                                            >
                                              <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                                            </svg>
                                          </div>
                                          <span
                                            data-active={
                                              isTypingActive
                                                ? "true"
                                                : undefined
                                            }
                                            className="type-product-base text-theme-text-ter data-[active]:text-theme-text min-w-0 flex-1 truncate text-[13px] data-[active]:opacity-100"
                                          >
                                            {isTypingActive
                                              ? typedDraft
                                              : "Send follow-up"}
                                          </span>
                                          <div
                                            data-active={
                                              isTypingActive
                                                ? "true"
                                                : undefined
                                            }
                                            className="bg-theme-card-03-hex data-[active]:bg-theme-button-bg data-[active]:text-theme-button-text flex size-6 shrink-0 items-center justify-center rounded-full"
                                            style={{ transform: "none" }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="11"
                                              height="11"
                                              fill="currentColor"
                                              viewBox="0 0 256 256"
                                            >
                                              <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
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
