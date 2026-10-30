"use client";

import React, { useEffect, useId, useRef, useState } from "react";

const MOVE_WORK_PROMPT =
  "/simplify the onboarding flow and remove duplicate setup steps";
const MOVE_WORK_SKILLS = ["simplify", "explain", "create-skill"] as const;
const VOICE_TRANSCRIPT =
  "I want to implement a new layout and tiling system that gives users more flexibility based on their workflow";
const VISUAL_FEEDBACK_COMMENT = "Use the actual app icon here";

function PlusIcon({ className = "relative z-10 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function MicIcon({ className = "relative z-10 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function ArrowUpIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden="true"
    >
      <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
    </svg>
  );
}

function CaretDownIcon({
  size = 11,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden="true"
    >
      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

function ArrowUpRightIcon({
  size = 13,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z" />
    </svg>
  );
}

function PlayTriangleIcon({ className = "relative z-10 ml-px size-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function WalkthroughPreview() {
  const [step, setStep] = useState<"idle" | "cursor" | "menu" | "menu-closing">("idle");

  useEffect(() => {
    if (step !== "cursor") return;
    const t1 = window.setTimeout(() => setStep("menu"), 680);
    const t2 = window.setTimeout(() => setStep("menu-closing"), 1550);
    const t3 = window.setTimeout(() => setStep("idle"), 2350);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [step]);

  const handleToggle = () => {
    setStep((prev) => (prev === "idle" ? "cursor" : "idle"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  const cursorActive = step !== "idle";
  const menuOpen = step === "menu";
  const rippleActive = step === "menu" || step === "menu-closing";

  return (
    <div
      className="group/rec cursor-pointer overflow-hidden rounded-[5px] bg-[#2e5167]"
      role="button"
      tabIndex={0}
      aria-label="Play walkthrough"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className="[container-type:inline-size] relative aspect-16/9 overflow-hidden">
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
              pointerEvents: menuOpen ? "auto" : "none",
            }}
          >
            <nav className="flex flex-col gap-[3.8cqw] px-[3.8cqw] pt-[14.5cqw]">
              <div
                className="type-product-base text-[5.8cqw] leading-none font-normal text-white/92 transition-opacity duration-200"
                style={{ opacity: menuOpen ? 1 : 0 }}
              >
                Home
              </div>
              <div
                className="type-product-base text-[5.8cqw] leading-none font-normal text-white/58 transition-opacity duration-200"
                style={{ opacity: menuOpen ? 1 : 0 }}
              >
                Products
              </div>
              <div
                className="type-product-base text-[5.8cqw] leading-none font-normal text-white/58 transition-opacity duration-200"
                style={{ opacity: menuOpen ? 1 : 0 }}
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
                  ? "translateY(0) rotate(45deg)"
                  : "translateY(-1.65cqw)",
              }}
            />
            <div
              className="absolute top-1/2 left-0 h-[0.56cqw] w-full -translate-y-1/2 rounded-full bg-white/92 transition-opacity duration-150"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <div
              className="absolute top-1/2 left-0 h-[0.56cqw] w-full -translate-y-1/2 rounded-full bg-white/92 transition-transform duration-200"
              style={{
                transform: menuOpen
                  ? "translateY(0) rotate(-45deg)"
                  : "translateY(1.65cqw)",
              }}
            />
          </div>
          <div className="absolute inset-x-[3.5cqw] bottom-[3.5cqw] z-10 flex flex-col items-start">
            <div className="type-product-base text-[6.2cqw] leading-[1.07] tracking-[-0.02em]">
              <div className="text-white/92">Acme Labs</div>
              <div className="text-white/72">Software is changing.</div>
            </div>
            <div className="mt-[5cqw] flex w-fit items-center rounded-full bg-white/25 px-[4cqw] py-[2.3cqw] backdrop-blur-[0.8cqw]">
              <span className="type-product-base text-[4.1cqw] leading-none font-semibold text-white/92">
                Sign up
              </span>
            </div>
          </div>
        </div>
        {cursorActive && (
          <div
            className="pointer-events-none absolute z-30 mt-[2.2cqw] transition-all duration-500"
            style={{
              left: "6.5%",
              top: "10.8%",
              transform: "scale(0.72)",
              transformOrigin: "top left",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white drop-shadow"
            >
              <path
                d="M2 2L14 6.5L8.5 8.5L6.5 14L2 2Z"
                fill="currentColor"
                stroke="#000"
                strokeWidth="1"
              />
            </svg>
            <span className="mt-1 inline-block rounded-full bg-black/80 px-2 py-0.5 text-[9px] font-medium text-white">
              Agent
            </span>
          </div>
        )}
        {rippleActive && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "calc(6.5% + 2.2cqw)",
              top: "calc(10.8% + 4.4cqw)",
            }}
          >
            <div className="size-[9.5cqw] animate-ping rounded-full border border-white/80" />
          </div>
        )}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
          style={{
            opacity: cursorActive ? 0 : 1,
            transform: cursorActive ? "scale(0.9)" : "none",
          }}
        >
          <div className="ios-glass flex size-8 items-center justify-center rounded-full text-white backdrop-blur-[1px]">
            <PlayTriangleIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneHardwareFrame({
  children,
  containerClassName,
}: {
  children: React.ReactNode;
  containerClassName: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-xs" style={{ height: 378 }}>
      <div
        className={containerClassName}
        style={{ width: 300, height: 650 }}
      >
        <div
          className="absolute"
          style={{
            right: -3,
            top: 201.938,
            height: 76.8999,
            width: 4,
            borderRadius: "0px 2px 2px 0px",
            background:
              "linear-gradient(to right, rgb(28, 28, 30), rgb(44, 44, 46))",
          }}
        />
        <div
          className="absolute"
          style={{
            left: -3,
            top: 133.076,
            height: 29.9779,
            width: 4,
            borderRadius: "2px 0px 0px 2px",
            background:
              "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
          }}
        />
        <div
          className="absolute"
          style={{
            left: -3,
            top: 185.212,
            height: 48.6598,
            width: 4,
            borderRadius: "2px 0px 0px 2px",
            background:
              "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
          }}
        />
        <div
          className="absolute"
          style={{
            left: -3,
            top: 246.905,
            height: 48.6598,
            width: 4,
            borderRadius: "2px 0px 0px 2px",
            background:
              "linear-gradient(to left, rgb(28, 28, 30), rgb(44, 44, 46))",
          }}
        />
        <div
          className="relative overflow-hidden"
          style={{
            width: 300,
            height: 650,
            borderRadius: 44,
            clipPath: "inset(0px round 44px)",
            contain: "paint",
            padding: 4,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ borderRadius: 44, backgroundColor: "rgb(58, 58, 60)" }}
          />
          <div
            className="bg-theme-product-editor border-theme-border relative h-full w-full overflow-hidden border mobile-phone-screen"
            style={{
              borderRadius: 40,
              clipPath: "inset(0px round 40px)",
              contain: "paint",
            }}
          >
            <div className="relative h-[48px]">
              <div
                className="absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black"
                style={{ top: 8, width: 96, height: 28 }}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoveWorkForwardCard() {
  const [active, setActive] = useState(false);
  const [loopTick, setLoopTick] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [pressedSkill, setPressedSkill] = useState<string | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearTimers = () => {
    for (const id of timeoutsRef.current) {
      window.clearTimeout(id);
    }
    timeoutsRef.current = [];
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLoopTick((n) => n + 1);
    }, 6400);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    clearTimers();
    if (!active) {
      setExpanded(false);
      setPrompt("");
      setShowSkillSuggestions(false);
      setHoveredSkill(null);
      setPressedSkill(null);

      const t1 = window.setTimeout(() => {
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / 1400);
          const chars = Math.round(progress * MOVE_WORK_PROMPT.length);
          setPrompt(MOVE_WORK_PROMPT.slice(0, chars));
          if (progress >= 1) {
            rafRef.current = null;
            return;
          }
          rafRef.current = window.requestAnimationFrame(step);
        };
        rafRef.current = window.requestAnimationFrame(step);
      }, 900);
      const t2 = window.setTimeout(() => {
        setPrompt("");
      }, 4200);
      timeoutsRef.current.push(t1, t2);
      return clearTimers;
    }

    setExpanded(true);
    setPrompt("");
    setShowSkillSuggestions(false);
    setHoveredSkill(null);
    setPressedSkill(null);

    const startStream = () => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / 1050);
        const chars = 10 + Math.round(progress * (MOVE_WORK_PROMPT.length - 10));
        setPrompt(MOVE_WORK_PROMPT.slice(0, chars));
        if (progress >= 1) {
          rafRef.current = null;
          setPrompt(MOVE_WORK_PROMPT);
          return;
        }
        rafRef.current = window.requestAnimationFrame(step);
      };
      rafRef.current = window.requestAnimationFrame(step);
    };

    timeoutsRef.current.push(
      window.setTimeout(() => setPrompt("/"), 500),
      window.setTimeout(() => setShowSkillSuggestions(true), 620),
      window.setTimeout(() => setPrompt("/s"), 1400),
      window.setTimeout(() => setPrompt("/si"), 1500),
      window.setTimeout(() => setHoveredSkill("simplify"), 1900),
      window.setTimeout(() => {
        setPressedSkill("simplify");
        setPrompt("/simplify ");
        setShowSkillSuggestions(false);
        startStream();
      }, 2200)
    );

    return clearTimers;
  }, [active, loopTick]);

  const query = prompt.startsWith("/") ? prompt.slice(1) : "";
  const filteredSkills = MOVE_WORK_SKILLS.filter((s) => s.startsWith(query));
  const skillsList =
    pressedSkill === null ||
    filteredSkills.includes(pressedSkill as (typeof MOVE_WORK_SKILLS)[number])
      ? filteredSkills
      : [pressedSkill, ...filteredSkills];

  const hasPrompt = prompt.trim().length > 0;

  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Move work forward</h2>
            <div className="text-theme-text-sec text-pretty">
              Kick off new agents and continue prompting existing ones from your
              phone.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1"
            style={
              {
                "--layered-media-bg-light": "#D9D5CF",
                "--layered-media-bg-dark": "#747066",
                height: 378,
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
                className="mobile-move-work-composer-theme mobile-phone-screen relative flex h-full w-full items-center justify-center overflow-hidden rounded-xs px-5 py-8"
                style={
                  {
                    "--mobile-phone-link": "#b97900",
                    backgroundColor: "transparent",
                  } as React.CSSProperties
                }
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(true);
                }}
                onPointerLeave={(e) => {
                  if (
                    e.pointerType === "mouse" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)")
                      .matches
                  ) {
                    setActive(false);
                  }
                }}
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse") setActive((prev) => !prev);
                }}
              >
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
                <div className="relative flex h-full w-full max-w-[360px] items-center">
                  {!expanded ? (
                    <div
                      className="relative z-10 h-11 w-full mobile-interaction-pulse rounded-full cursor-pointer"
                      onClick={() => setActive(true)}
                    >
                      <div
                        className="ios-glass absolute inset-0 rounded-full"
                        style={{
                          background:
                            "var(--mobile-composer-surface-background, color-mix(in srgb, var(--mobile-phone-bg) 92%, rgba(255, 255, 255, 0.88)))",
                          borderRadius: 22,
                          boxShadow: "none",
                          opacity: 1,
                        }}
                      />
                      <div className="relative z-10 flex h-full items-center rounded-full px-2">
                        <button
                          type="button"
                          aria-label="Add context"
                          disabled
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                          style={{ opacity: 1 }}
                        >
                          <PlusIcon />
                        </button>
                        <button
                          type="button"
                          disabled
                          className={`type-product-base relative z-10 flex h-7 min-w-0 flex-1 items-center truncate px-3 text-left text-[13px] leading-none enabled:cursor-pointer ${
                            hasPrompt
                              ? "text-[color:var(--mobile-phone-link)]"
                              : "text-[color:var(--mobile-phone-placeholder)]"
                          }`}
                        >
                          {hasPrompt ? prompt : "Plan, ask, build..."}
                        </button>
                        <button
                          type="button"
                          aria-label={
                            hasPrompt ? "Submit prompt" : "Start voice input"
                          }
                          disabled
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full enabled:cursor-pointer ${
                            hasPrompt
                              ? "bg-[color:var(--mobile-phone-text-primary)] text-[color:var(--mobile-phone-bg)]"
                              : "bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)]"
                          }`}
                          style={{ opacity: 1 }}
                        >
                          {hasPrompt ? (
                            <ArrowUpIcon size={14} />
                          ) : (
                            <MicIcon />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-30">
                      <div className="absolute top-1/2 right-0 left-0 -translate-y-1/2">
                        <div className="relative overflow-hidden rounded-[22px]">
                          <div
                            className="ios-glass absolute inset-0 rounded-[22px]"
                            style={{
                              background:
                                "var(--mobile-composer-surface-background, color-mix(in srgb, var(--mobile-phone-bg) 78%, rgba(255, 255, 255, 0.84)))",
                              borderRadius: 22,
                              boxShadow: "none",
                            }}
                          />
                          <div className="relative z-10 px-2 pt-5 pb-2">
                            <div className="px-1.5">
                              <div className="type-product-base mb-3 flex items-center gap-1.5 text-[12px] leading-none font-medium text-[color:var(--mobile-phone-text-primary)]">
                                <span>acme</span>
                                <span className="text-[color:var(--mobile-phone-muted)]">
                                  main
                                </span>
                                <CaretDownIcon className="text-[color:var(--mobile-phone-muted)]" />
                              </div>
                              <div className="type-product-base mb-4 block max-h-[60px] min-h-[60px] w-full overflow-y-auto bg-transparent text-[13px] leading-[1.28] font-normal whitespace-pre-wrap text-[color:var(--mobile-phone-text-primary)]">
                                {prompt.length === 0 ? (
                                  <span className="text-[color:var(--mobile-phone-placeholder)]">
                                    Plan, ask, build...
                                  </span>
                                ) : prompt.startsWith("/simplify") ? (
                                  <span>
                                    <span className="text-[color:var(--mobile-phone-link)]">
                                      /simplify
                                    </span>
                                    <span>{prompt.slice("/simplify".length)}</span>
                                  </span>
                                ) : (
                                  <span>{prompt}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="relative h-7 min-w-0 flex-1">
                                <div
                                  className="absolute inset-0 flex min-w-0 items-center gap-2 text-[color:var(--mobile-phone-control-text)] transition-opacity duration-150"
                                  style={{
                                    opacity: showSkillSuggestions ? 0 : 1,
                                  }}
                                >
                                  <button
                                    type="button"
                                    aria-label="Add context"
                                    disabled
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)]"
                                  >
                                    <PlusIcon />
                                  </button>
                                  <button
                                    type="button"
                                    disabled
                                    className="type-product-base flex min-w-0 items-center gap-1 text-[12px] leading-none font-medium"
                                  >
                                    <span className="truncate">Grok 4.7</span>
                                    <CaretDownIcon className="opacity-60" />
                                  </button>
                                </div>
                                <div
                                  aria-hidden={!showSkillSuggestions}
                                  className="pointer-events-none absolute -inset-y-3 inset-x-0 flex items-center gap-2 pr-6 transition-opacity duration-150"
                                  style={{
                                    opacity: showSkillSuggestions ? 1 : 0,
                                  }}
                                >
                                  {skillsList.map((skill) => {
                                    const state =
                                      pressedSkill === skill
                                        ? "pressed"
                                        : hoveredSkill === skill
                                          ? "hovered"
                                          : undefined;
                                    return (
                                      <div key={skill} className="shrink-0">
                                        <span
                                          data-state={state}
                                          className="type-product-base block origin-center rounded-full bg-[color-mix(in_srgb,var(--mobile-phone-text-primary)_5%,transparent)] px-3 py-2 text-[13px] leading-none font-normal text-[color:var(--mobile-phone-text-primary)] transition-[transform,background-color] duration-150 ease-out data-[state=hovered]:bg-[color-mix(in_srgb,var(--mobile-phone-text-primary)_12%,transparent)] data-[state=pressed]:scale-[0.92] data-[state=pressed]:bg-[color-mix(in_srgb,var(--mobile-phone-text-primary)_18%,transparent)]"
                                        >
                                          /{skill}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="relative z-20 shrink-0">
                                {hasPrompt ? (
                                  <button
                                    type="button"
                                    aria-label="Submit prompt"
                                    disabled
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-text-primary)] text-[color:var(--mobile-phone-bg)]"
                                  >
                                    <ArrowUpIcon size={14} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    aria-label="Start voice input"
                                    disabled
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)]"
                                  >
                                    <MicIcon />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}

function GetDemosOfWorkCard() {
  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Get demos of work</h2>
            <div className="text-theme-text-sec text-pretty">
              Cloud agents test and verify their work, then return artifacts
              like videos, screenshots, and logs.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1 max-h-mobile"
            style={
              {
                "--layered-media-bg-light": "#E9E8E5",
                "--layered-media-bg-dark": "#2E2D2A",
                height: 378,
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
              <div className="relative h-full w-full overflow-hidden rounded-xs">
                <div
                  className="relative h-full w-full"
                  style={{ fontFamily: "var(--font-system)" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full min-w-[180px] max-w-[min(83.333333%,360px)]">
                      <div className="flex w-full flex-col overflow-visible p-3">
                        <div className="space-y-1.5">
                          <div>
                            <p className="type-product-lg text-theme-text-sec leading-snug">
                              Started screen recording
                            </p>
                          </div>
                          <div>
                            <p className="type-product-lg text-theme-text leading-snug font-medium">
                              Walkthrough
                            </p>
                          </div>
                          <div>
                            <WalkthroughPreview />
                          </div>
                          <div>
                            <div>
                              <div className="type-product-lg text-theme-text leading-snug font-medium">
                                Summary
                              </div>
                              <div className="type-product-lg text-theme-text mt-0.5 leading-snug">
                                Verified the interaction in Chrome and attached
                                a walkthrough so you can review the result
                                without opening the branch.
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
  );
}

function StayInTheLoopCard() {
  const [touchActive, setTouchActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!touchActive) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (
        e.target instanceof Node &&
        !containerRef.current?.contains(e.target)
      ) {
        setTouchActive(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [touchActive]);

  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Stay in the loop</h2>
            <div className="text-theme-text-sec text-pretty">
              Check real-time status with Live Activities and get notified when
              agents finish or need attention.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1"
            style={
              {
                "--layered-media-bg-light": "#D8DEE8",
                "--layered-media-bg-dark": "#20252D",
                height: 378,
              } as React.CSSProperties
            }
          >
            <div
              className="media-light absolute inset-0 z-0"
              style={{ backgroundColor: "rgb(216, 222, 232)" }}
            />
            <div
              className="media-dark absolute inset-0 z-0"
              style={{ backgroundColor: "rgb(32, 37, 45)" }}
            />
            <div className="z-20 col-span-full row-span-full h-full min-h-0">
              <div
                ref={containerRef}
                className="mobile-loop-visual group/mobile-loop relative h-full overflow-hidden"
                data-touch-active={touchActive || undefined}
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse") setTouchActive(true);
                }}
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 scale-[1.14] transform-gpu transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/mobile-loop:scale-100 group-data-[touch-active]/mobile-loop:scale-100"
                  data-mobile-loop-zoom-stage="true"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-[700ms] ease-out group-hover/mobile-loop:opacity-100 group-data-[touch-active]/mobile-loop:opacity-100">
                    <PhoneHardwareFrame containerClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0">
                          <img
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                            src="/sites/cursor/blob/assets/wallpapers/cloud-agents-2.webp"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </div>
                      </div>
                    </PhoneHardwareFrame>
                  </div>
                  <div className="absolute top-1/2 left-1/2 z-10 h-[650px] w-[300px] -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-[4px] overflow-hidden rounded-[40px]">
                      <div
                        className="absolute inset-x-3.5 top-1/2 -translate-y-1/2 space-y-3.5"
                        data-mobile-loop-cards="true"
                      >
                        <div
                          className="ios-glass border-[color:var(--mobile-loop-card-border)] text-[color:var(--mobile-loop-text)] rounded-[22px] px-3.5 py-3 shadow-none transition-colors duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] before:hidden"
                          data-mobile-loop-card="true"
                          style={{ background: "var(--mobile-loop-card-bg)" }}
                        >
                          <div
                            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mobile-loop:opacity-100 group-data-[touch-active]/mobile-loop:opacity-100"
                            aria-hidden="true"
                            style={{
                              boxShadow: "var(--mobile-loop-card-shadow)",
                            }}
                          />
                          <div className="relative z-10">
                            <p className="type-product-base text-[color:var(--mobile-loop-text-muted)] text-[11px] leading-none font-medium">
                              Finished
                            </p>
                            <p className="type-product-base text-[color:var(--mobile-loop-text-strong)] mt-1.5 max-w-[190px] text-[14px] leading-[1.18] font-medium tracking-[-0.02em]">
                              Update quick action pills interaction and styling
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="type-product-base text-[color:var(--mobile-loop-text-muted)] min-w-0 truncate text-[11px] leading-none font-medium">
                                <span className="text-[color:var(--mobile-loop-diff-green)]">
                                  +80
                                </span>{" "}
                                <span className="text-[color:var(--mobile-loop-diff-red)]">
                                  -230
                                </span>{" "}
                                <span>· 3 Files</span>
                              </p>
                              <div className="type-product-base bg-[color:var(--mobile-loop-pill-bg)] text-[color:var(--mobile-loop-pill-text)] shrink-0 rounded-full px-3 py-2.5 text-[11px] leading-none font-medium">
                                Review
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="ios-glass border-[color:var(--mobile-loop-card-border)] text-[color:var(--mobile-loop-text)] rounded-[22px] px-3.5 py-3.5 shadow-none transition-colors duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] before:hidden"
                          data-mobile-loop-card="true"
                          style={{ background: "var(--mobile-loop-card-bg)" }}
                        >
                          <div
                            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mobile-loop:opacity-100 group-data-[touch-active]/mobile-loop:opacity-100"
                            aria-hidden="true"
                            style={{
                              boxShadow: "var(--mobile-loop-card-shadow)",
                            }}
                          />
                          <div className="relative z-10">
                            <div className="mb-3 flex items-baseline gap-1.5">
                              <p className="type-product-base text-[color:var(--mobile-loop-text-strong)] text-[18px] leading-none font-medium tracking-[-0.02em]">
                                5
                              </p>
                              <p className="type-product-base text-[color:var(--mobile-loop-text-muted)] text-[12px] leading-none font-medium">
                                Active
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="type-product-base text-[color:var(--mobile-loop-text)] flex items-center justify-between gap-3 text-[11px] leading-none font-normal">
                                <span className="truncate">
                                  Enable dark mode
                                </span>
                                <span className="text-[color:var(--mobile-loop-text-ter)] shrink-0">
                                  1m
                                </span>
                              </div>
                              <div className="type-product-base text-[color:var(--mobile-loop-text)] flex items-center justify-between gap-3 text-[11px] leading-none font-normal">
                                <span className="truncate">
                                  Address CI failures
                                </span>
                                <span className="text-[color:var(--mobile-loop-text-ter)] shrink-0">
                                  2m
                                </span>
                              </div>
                              <div className="type-product-base text-[color:var(--mobile-loop-text)] flex items-center justify-between gap-3 text-[11px] leading-none font-normal">
                                <span className="truncate">
                                  Scaffold Kotlin translation scheme
                                </span>
                                <span className="text-[color:var(--mobile-loop-text-ter)] shrink-0">
                                  4m
                                </span>
                              </div>
                              <p className="type-product-base text-[color:var(--mobile-loop-text-ter)] text-[11px] leading-none font-medium">
                                2 More
                              </p>
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
  );
}

function TalkToCursorCard() {
  const [mode, setMode] = useState<"recording" | "text" | "closed">("recording");
  const [prompt, setPrompt] = useState(VOICE_TRANSCRIPT);
  const [recordingSeconds, setRecordingSeconds] = useState(6);
  const [promptTextPrimary, setPromptTextPrimary] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (!isHovered) {
      setMode("recording");
      setPrompt(VOICE_TRANSCRIPT);
      setRecordingSeconds(6);
      setPromptTextPrimary(false);
      return;
    }
    const start = performance.now();
    setMode("recording");
    setPrompt("");
    setRecordingSeconds(0);
    setPromptTextPrimary(false);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1900);
      const chars = Math.round(progress * VOICE_TRANSCRIPT.length);
      setPrompt(VOICE_TRANSCRIPT.slice(0, chars));
      setRecordingSeconds(Math.min(6, Math.floor(6 * progress)));
      if (progress >= 1) {
        rafRef.current = null;
        setPrompt(VOICE_TRANSCRIPT);
        setRecordingSeconds(6);
        setPromptTextPrimary(true);
        setMode("text");
        return;
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isHovered]);

  const formattedTime = `${Math.floor(recordingSeconds / 60)}:${String(
    recordingSeconds % 60
  ).padStart(2, "0")}`;

  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Talk to Cursor</h2>
            <div className="text-theme-text-sec text-pretty">
              Use voice input to describe ideas out loud like you would to a
              colleague.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1"
            style={
              {
                "--layered-media-bg-light": "#CFCEBC",
                "--layered-media-bg-dark": "#5C5743",
                height: 378,
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
              <div
                className="mobile-phone-screen flex h-full w-full items-center justify-center overflow-hidden rounded-xs px-6 py-8"
                style={{ backgroundColor: "transparent" }}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
              >
                <div className="w-full max-w-[360px]">
                  {mode !== "closed" ? (
                    <div className="relative w-full overflow-hidden rounded-[22px]">
                      <div
                        className="ios-glass mobile-talk-composer-surface absolute inset-0 rounded-[22px]"
                        style={{ opacity: 1 }}
                      />
                      <div className="relative z-10 px-2 pt-5 pb-2">
                        <div className="px-1.5">
                          <div className="type-product-base mb-3 flex items-center gap-1.5 text-[12px] leading-none font-medium text-[color:var(--mobile-phone-text-primary)]">
                            <span>acme</span>
                            <span className="text-[color:var(--mobile-phone-muted)]">
                              main
                            </span>
                            <CaretDownIcon className="text-[color:var(--mobile-phone-muted)]" />
                          </div>
                          <div className="relative mb-4">
                            <div
                              className="type-product-base pointer-events-none invisible absolute inset-x-0 top-0 text-[13px] leading-[1.28] font-normal break-words whitespace-pre-wrap"
                              aria-hidden="true"
                            >
                              {prompt || " "}
                            </div>
                            <div style={{ height: 50 }}>
                              <textarea
                                rows={1}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                data-primary-text={
                                  promptTextPrimary || undefined
                                }
                                className="type-product-base block h-full w-full resize-none overflow-hidden bg-transparent text-[13px] leading-[1.28] font-normal text-[color:var(--mobile-phone-link)] outline-none data-[primary-text]:text-[color:var(--mobile-phone-text-primary)] placeholder:text-[color:var(--mobile-phone-placeholder)]"
                                placeholder={
                                  mode === "recording"
                                    ? ""
                                    : "Plan, ask, build..."
                                }
                                spellCheck={false}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2 text-[color:var(--mobile-phone-control-text)]">
                            <button
                              type="button"
                              aria-label="Add context"
                              disabled
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)]"
                              style={{ opacity: 1 }}
                            >
                              <PlusIcon />
                            </button>
                            <button
                              type="button"
                              disabled
                              className="type-product-base flex min-w-0 items-center gap-1 text-[12px] leading-none font-medium"
                            >
                              <span className="truncate">Grok 4.7</span>
                              <CaretDownIcon className="opacity-60" />
                            </button>
                          </div>
                          {mode === "recording" ? (
                            <button
                              type="button"
                              aria-label="Stop recording"
                              onClick={() => {
                                setPromptTextPrimary(true);
                                setMode("text");
                              }}
                              className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-[color:var(--mobile-phone-control-bg)] px-2.5 text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-text)] text-[color:var(--mobile-phone-bg)]">
                                <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                              </span>
                              <span className="type-product-base text-[12px] leading-none font-medium tabular-nums">
                                {formattedTime}
                              </span>
                              <span
                                data-animated={isHovered || undefined}
                                className="mobile-recording-waveform flex h-4 items-center gap-0.5 text-[color:var(--mobile-phone-control-text)]"
                              >
                                <span
                                  className="h-2 w-0.5 rounded-full bg-current"
                                  style={
                                    {
                                      "--waveform-min": 0.5,
                                      "--waveform-mid": 1.35,
                                      "--waveform-end": 0.7,
                                      "--waveform-duration": "0.72s",
                                      "--waveform-delay": "0s",
                                    } as React.CSSProperties
                                  }
                                />
                                <span
                                  className="h-3 w-0.5 rounded-full bg-current"
                                  style={
                                    {
                                      "--waveform-min": 0.75,
                                      "--waveform-mid": 1.6,
                                      "--waveform-end": 0.55,
                                      "--waveform-duration": "0.68s",
                                      "--waveform-delay": "0.08s",
                                    } as React.CSSProperties
                                  }
                                />
                                <span
                                  className="h-4 w-0.5 rounded-full bg-current"
                                  style={
                                    {
                                      "--waveform-min": 0.45,
                                      "--waveform-mid": 1.2,
                                      "--waveform-end": 0.9,
                                      "--waveform-duration": "0.78s",
                                      "--waveform-delay": "0.16s",
                                    } as React.CSSProperties
                                  }
                                />
                                <span
                                  className="h-3 w-0.5 rounded-full bg-current"
                                  style={
                                    {
                                      "--waveform-min": 0.7,
                                      "--waveform-mid": 1.5,
                                      "--waveform-end": 0.6,
                                      "--waveform-duration": "0.7s",
                                      "--waveform-delay": "0.24s",
                                    } as React.CSSProperties
                                  }
                                />
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label="Start voice input"
                              onClick={() => {
                                setPromptTextPrimary(false);
                                setMode("recording");
                              }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)] enabled:cursor-pointer"
                            >
                              <MicIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 h-11 w-full rounded-full">
                      <div
                        className="ios-glass absolute inset-0 rounded-full"
                        style={{ borderRadius: 22 }}
                      />
                      <div className="relative z-10 flex h-full items-center rounded-full px-2">
                        <button
                          type="button"
                          onClick={() => setMode("text")}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)]"
                        >
                          <PlusIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode("text")}
                          className="type-product-base relative z-10 flex h-7 min-w-0 flex-1 items-center truncate px-3 text-left text-[13px] leading-none text-[color:var(--mobile-phone-placeholder)]"
                        >
                          Plan, ask, build...
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode("recording")}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-control-text)]"
                        >
                          <MicIcon />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}

function GiveVisualFeedbackCard() {
  const [commentText, setCommentText] = useState("");
  const [itemNumber, setItemNumber] = useState(2);
  const [showMarker1, setShowMarker1] = useState(true);
  const [showMarker2, setShowMarker2] = useState(true);
  const [phase, setPhase] = useState<"idle" | "waiting" | "typing" | "complete">(
    "typing"
  );
  const [typedLen, setTypedLen] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(1);
  const [touchPos, setTouchPos] = useState({ x: 44, y: 121, visible: true });
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (phase === "waiting") {
      const id = window.setTimeout(() => setPhase("typing"), 450);
      return () => window.clearTimeout(id);
    }
    if (phase === "typing") {
      if (typedLen >= VISUAL_FEEDBACK_COMMENT.length) {
        setPhase("complete");
        return;
      }
      const id = window.setTimeout(
        () => setTypedLen((n) => Math.min(n + 1, VISUAL_FEEDBACK_COMMENT.length)),
        16
      );
      return () => window.clearTimeout(id);
    }
    if (phase === "complete") {
      const id = window.setTimeout(() => {
        setItemNumber(2);
        setPhase("waiting");
        setTypedLen(0);
        setCommentText("");
      }, 1400);
      return () => window.clearTimeout(id);
    }
  }, [phase, typedLen]);

  const runDemoAnimation = () => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    setShowMarker1(false);
    setShowMarker2(false);
    setItemNumber(1);
    setPhase("idle");
    setTypedLen(0);
    setCommentText("");
    setStrokeProgress(0);
    setTouchPos({ x: 96, y: 235, visible: true });

    window.setTimeout(() => {
      setShowMarker1(true);
      setPhase("waiting");
    }, 380);

    window.setTimeout(() => {
      setTouchPos({ x: 44, y: 121, visible: true });
      setStrokeProgress(1);
      setShowMarker2(true);
      setItemNumber(2);
    }, 1850);
  };

  const displayedComment =
    phase === "idle"
      ? commentText
      : phase === "waiting"
        ? ""
        : VISUAL_FEEDBACK_COMMENT.slice(0, typedLen);

  const showSend =
    (phase === "complete" && typedLen >= VISUAL_FEEDBACK_COMMENT.length) ||
    (phase === "idle" && commentText.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSend) return;
    setItemNumber((n) => n + 1);
    setCommentText("");
    setPhase("idle");
    setTypedLen(0);
  };

  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Give visual feedback</h2>
            <div className="text-theme-text-sec text-pretty">
              Open the markup tool to annotate images and add comments to a
              pinned location.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1"
            style={
              {
                "--layered-media-bg-light": "#D8DEE8",
                "--layered-media-bg-dark": "#1D2129",
                height: 378,
              } as React.CSSProperties
            }
          >
            <div
              className="media-light absolute inset-0 z-0"
              style={{ backgroundColor: "rgb(216, 222, 232)" }}
            />
            <div
              className="media-dark absolute inset-0 z-0"
              style={{ backgroundColor: "rgb(29, 33, 41)" }}
            />
            <div className="z-20 col-span-full row-span-full h-full min-h-0">
              <div
                className="mobile-phone-screen mobile-visual-feedback relative h-full w-full overflow-hidden rounded-xs bg-[color:var(--visual-feedback-backdrop)] font-[system-ui]"
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") runDemoAnimation();
                }}
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse") runDemoAnimation();
                }}
              >
                <div className="absolute inset-0 bg-[color:var(--visual-feedback-backdrop)] px-8 pt-7 pb-6">
                  <div className="mx-auto flex h-full max-w-[332px] flex-col">
                    <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] bg-[color:var(--visual-feedback-surface)]">
                      <div className="px-3.5 pt-4">
                        <div className="relative mb-[22px] flex h-9 items-center justify-center">
                          <p className="text-center text-[14px] leading-none font-normal tracking-normal text-[color:var(--visual-feedback-title)]">
                            Appearance
                          </p>
                        </div>
                        <p className="mb-2.5 text-[12px] leading-none font-medium text-[color:var(--visual-feedback-label)]">
                          Typography
                        </p>
                        <div className="mb-[22px] grid grid-cols-3 gap-2.5">
                          <div className="relative flex h-[78px] flex-col items-center justify-center rounded-[19px] bg-[color:var(--visual-feedback-selected-bg)] after:pointer-events-none after:absolute after:inset-[-4px] after:rounded-[23px] after:border after:border-[color:var(--visual-feedback-selected-border)] after:content-['']">
                            <p className="text-[21px] leading-none font-semibold text-[color:var(--visual-feedback-selected-text)]">
                              Aa
                            </p>
                            <p className="mt-1.5 text-[12px] text-[color:var(--visual-feedback-selected-label)]">
                              Grotesk
                            </p>
                          </div>
                          <div className="flex h-[78px] flex-col items-center justify-center rounded-[19px] border border-[color:var(--visual-feedback-option-border)] bg-[color:var(--visual-feedback-option-bg)]">
                            <p className="text-[20px] leading-none font-semibold text-[color:var(--visual-feedback-option-text)]">
                              Aa
                            </p>
                            <p className="mt-1.5 text-[12px] text-[color:var(--visual-feedback-option-label)]">
                              Round
                            </p>
                          </div>
                          <div className="flex h-[78px] flex-col items-center justify-center rounded-[19px] border border-[color:var(--visual-feedback-option-border)] bg-[color:var(--visual-feedback-option-bg)]">
                            <p className="text-[20px] leading-none font-semibold text-[color:var(--visual-feedback-option-text)]">
                              Aa
                            </p>
                            <p className="mt-1.5 text-[12px] text-[color:var(--visual-feedback-option-label)]">
                              Serif
                            </p>
                          </div>
                        </div>
                        <p className="mb-2.5 text-[12px] leading-none font-medium text-[color:var(--visual-feedback-label)]">
                          App Icon
                        </p>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="relative h-[82px] rounded-[18px] [background:var(--visual-feedback-app-icon-bg)] after:pointer-events-none after:absolute after:inset-[-4px] after:rounded-[22px] after:border after:border-[color:var(--visual-feedback-selected-border)] after:content-['']">
                            {showMarker1 && (
                              <span
                                data-feedback-marker="1"
                                className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--visual-feedback-number-bg)] text-[13px] leading-none font-semibold text-[color:var(--visual-feedback-number-text)] tabular-nums [box-shadow:var(--visual-feedback-number-shadow)]"
                              >
                                1
                              </span>
                            )}
                          </div>
                          <div className="h-[82px] rounded-[18px] bg-[color:var(--visual-feedback-app-icon-dark-bg)]" />
                          <div className="h-[82px] rounded-[18px] border border-[color:var(--visual-feedback-app-icon-border)] [background:var(--visual-feedback-app-icon-accent-bg)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 z-40" />
                <div className="pointer-events-none absolute top-7 bottom-6 left-1/2 z-20 w-[calc(100%-64px)] max-w-[332px] -translate-x-1/2 overflow-hidden rounded-[28px]">
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 332 325"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 70 L92 92"
                      stroke="#ff1f12"
                      strokeWidth="4.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        opacity: strokeProgress > 0 ? 0.96 : 0,
                        transition: "opacity 280ms ease-out",
                      }}
                    />
                    <path
                      d="M92 69 L12 93"
                      stroke="#ff1f12"
                      strokeWidth="4.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        opacity: strokeProgress > 0 ? 0.96 : 0,
                        transition: "opacity 280ms ease-out 180ms",
                      }}
                    />
                  </svg>
                  {showMarker2 && (
                    <span
                      data-feedback-marker="2"
                      style={{ left: 74, top: 58 }}
                      className="pointer-events-none absolute z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--visual-feedback-number-bg)] text-[13px] leading-none font-semibold text-[color:var(--visual-feedback-number-text)] tabular-nums [box-shadow:var(--visual-feedback-number-shadow)]"
                    >
                      2
                    </span>
                  )}
                </div>
                <div
                  className="pointer-events-none absolute z-50 size-5 origin-center transition-all duration-300 ease-out"
                  aria-hidden="true"
                  style={{
                    left: touchPos.x,
                    top: touchPos.y,
                    opacity: touchPos.visible ? 1 : 0,
                    transform: "translate(-50%, -50%) scale(1)",
                  }}
                >
                  <span className="absolute inset-0 rounded-full bg-[color:var(--visual-feedback-cursor-pulse)] opacity-0" />
                  <span className="absolute inset-0 rounded-full bg-[color:var(--visual-feedback-touch-indicator)]" />
                </div>
                <div className="pointer-events-none absolute right-4 bottom-5 left-4 z-30">
                  <div className="absolute inset-x-[-16px] -top-12 bottom-[-20px] [background:var(--visual-feedback-prompt-scrim)]" />
                  <form
                    onSubmit={handleSubmit}
                    className="pointer-events-auto relative flex h-[48px] items-center gap-1.5 overflow-hidden rounded-full border border-[color:var(--visual-feedback-prompt-border)] [background:var(--visual-feedback-prompt-bg)] px-1.5 text-[color:var(--visual-feedback-prompt-text)] [box-shadow:var(--visual-feedback-prompt-shadow)] backdrop-blur-[14px]"
                  >
                    <div className="pointer-events-none absolute inset-x-[9%] top-0 h-[34%] rounded-full [background:var(--visual-feedback-prompt-highlight)] opacity-60" />
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--visual-feedback-number-bg)] text-[color:var(--visual-feedback-number-text)] [box-shadow:var(--visual-feedback-number-shadow)]">
                      <span className="sr-only">Feedback item {itemNumber}</span>
                      <span
                        aria-hidden="true"
                        className="text-[13px] leading-none font-semibold tabular-nums"
                      >
                        {itemNumber}
                      </span>
                    </span>
                    <input
                      aria-label={`Feedback comment ${itemNumber}`}
                      className="relative min-w-0 flex-1 bg-transparent text-[16px] leading-none font-medium tracking-[-0.015em] outline-none placeholder:text-[color:var(--visual-feedback-number-text)] sm:text-[14px]"
                      placeholder=""
                      autoComplete="off"
                      spellCheck={false}
                      type="text"
                      value={displayedComment}
                      onChange={(e) => {
                        setPhase("idle");
                        setCommentText(e.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      aria-label="Send feedback"
                      data-hidden={!showSend || undefined}
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--visual-feedback-send-bg)] text-[color:var(--visual-feedback-send-text)] shadow-sm transition-opacity duration-150 data-[hidden]:pointer-events-none data-[hidden]:opacity-0"
                      tabIndex={0}
                    >
                      <CheckIcon size={17} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}

function ShipCodeFromYourPhoneCard() {
  const [diffExpanded, setDiffExpanded] = useState(true);
  const [merged, setMerged] = useState(false);
  const diffId = useId();

  return (
    <div className="undefined h-full">
      <div className="card flex h-full grow-1 flex-col">
        <div className="type-base max-w-prose flex grow flex-col">
          <div>
            <h2>Ship code from your phone</h2>
            <div className="text-theme-text-sec text-pretty">
              Review and merge PRs with focused diffs and source control
              management designed for mobile.
            </div>
          </div>
        </div>
        <figure className="pt-g1.75">
          <div
            className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-03-hex"
            style={
              {
                "--layered-media-bg-light": "#E9E8E5",
                "--layered-media-bg-dark": "#26251E",
                height: 378,
              } as React.CSSProperties
            }
          >
            <div className="z-20 col-span-full row-span-full h-full min-h-0">
              <div className="h-full">
                <PhoneHardwareFrame containerClassName="absolute left-1/2 top-6 -translate-x-1/2">
                  <div className="flex h-full flex-col font-[system-ui]">
                    <div
                      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      style={
                        {
                          paddingBottom:
                            "var(--mobile-review-bottom-padding, 24px)",
                          "--mobile-review-bottom-padding": "363px",
                        } as React.CSSProperties
                      }
                    >
                      <div className="space-y-4">
                        <div>
                          <h2 className="mb-2 text-[19px] leading-tight font-medium tracking-[-0.26px] text-[color:var(--mobile-phone-text-primary)]">
                            Fix: Stabilize menu toggle position on landing page
                          </h2>
                          <div className="flex items-center gap-2 text-[12px] text-[color:var(--mobile-phone-muted)]">
                            <span className="bg-theme-product-line-inserted-line-background text-theme-product-ansi-green rounded-full px-2 py-0.5">
                              {merged ? "Merged" : "Open"}
                            </span>
                            <span className="text-theme-product-ansi-green">
                              +2
                            </span>
                            <span className="text-theme-product-ansi-red">
                              −2
                            </span>
                            <span>1 File</span>
                            <span>1 Commit</span>
                          </div>
                        </div>
                        <div className="rounded-[12px] border border-[color:var(--mobile-phone-row-border)] bg-[color:var(--mobile-phone-primary-bg)] p-3">
                          <p className="mb-2 text-[13px] font-medium tracking-[-0.32px] text-[color:var(--mobile-phone-text-primary)]">
                            {merged ? "Merged" : "Ready to Merge"}
                          </p>
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex shrink-0 -space-x-2">
                              <div className="bg-theme-product-ansi-green relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--mobile-phone-primary-bg)] text-white">
                                <CheckIcon size={13} />
                              </div>
                              <img
                                alt="Andrew Milich"
                                className="relative h-6 w-6 rounded-full border-2 border-[color:var(--mobile-phone-primary-bg)] object-cover"
                                draggable={false}
                                src="/sites/cursor/blob/assets/avatars/andrew-milich-avatar.png"
                                style={{ zIndex: 9 }}
                              />
                              <img
                                alt="Jack Pertschuk"
                                className="relative h-6 w-6 rounded-full border-2 border-[color:var(--mobile-phone-primary-bg)] object-cover"
                                draggable={false}
                                src="/sites/cursor/blob/assets/avatars/jack-pertschuk.jpeg"
                                style={{ zIndex: 8 }}
                              />
                            </div>
                            <span className="min-w-0 truncate text-[11px] font-normal text-[color:var(--mobile-phone-text-soft)]">
                              All Required Checks Passed
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMerged((prev) => !prev)}
                            className="h-8 w-full cursor-pointer rounded-[10px] bg-[color:var(--mobile-phone-text-primary)] text-[12px] font-medium text-[color:var(--mobile-phone-bg)] transition-opacity hover:opacity-90"
                          >
                            {merged ? "Merged into main" : "Squash & Merge"}
                          </button>
                        </div>
                        <div>
                          <p className="mb-2 text-[12px] text-[color:var(--mobile-phone-section-label)]">
                            Deployments
                          </p>
                          <div className="overflow-hidden rounded-[12px] border border-[color:var(--mobile-phone-row-border)] bg-[color:var(--mobile-phone-primary-bg)]">
                            <div className="flex items-center gap-2 border-b border-[color:var(--mobile-phone-row-border)] px-2 py-2 last:border-b-0">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-green)]">
                                <CheckIcon size={13} />
                              </div>
                              <div className="min-w-0 flex-1 truncate text-[12px] font-medium text-[color:var(--mobile-phone-text-primary)]">
                                Acme Marketing Preview
                              </div>
                              <div className="text-[11px] text-[color:var(--mobile-phone-muted)]">
                                1m
                              </div>
                              <ArrowUpRightIcon className="shrink-0 text-[color:var(--mobile-phone-muted)]" />
                            </div>
                            <div className="flex items-center gap-2 border-b border-[color:var(--mobile-phone-row-border)] px-2 py-2 last:border-b-0">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--mobile-phone-control-bg)] text-[color:var(--mobile-phone-green)]">
                                <CheckIcon size={13} />
                              </div>
                              <div className="min-w-0 flex-1 truncate text-[12px] font-medium text-[color:var(--mobile-phone-text-primary)]">
                                Acme Dashboard Preview
                              </div>
                              <div className="text-[11px] text-[color:var(--mobile-phone-muted)]">
                                3m
                              </div>
                              <ArrowUpRightIcon className="shrink-0 text-[color:var(--mobile-phone-muted)]" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-[12px] text-[color:var(--mobile-phone-section-label)]">
                            Demos
                          </p>
                          <WalkthroughPreview />
                        </div>
                        <div>
                          <p className="mb-2 text-[12px] text-[color:var(--mobile-phone-section-label)]">
                            1 File
                          </p>
                          <div className="overflow-hidden rounded-[12px] border border-[color:var(--mobile-phone-row-border)] bg-[color:var(--mobile-phone-primary-bg)]">
                            <button
                              type="button"
                              aria-expanded={diffExpanded}
                              aria-controls={diffId}
                              onClick={() => setDiffExpanded((prev) => !prev)}
                              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left"
                            >
                              <CaretDownIcon
                                size={12}
                                className={`shrink-0 text-[color:var(--mobile-phone-muted)] transition-transform duration-200 ${
                                  diffExpanded ? "rotate-180" : ""
                                }`}
                              />
                              <span className="font-berkeley-mono min-w-0 flex-1 truncate text-[11px] font-medium text-[color:var(--mobile-phone-text-primary)]">
                                app/[locale]/home-demos.tsx
                              </span>
                              <span className="text-[11px] text-[color:var(--mobile-phone-green)]">
                                +2
                              </span>
                              <span className="text-[11px] text-[color:var(--mobile-phone-red)]">
                                −2
                              </span>
                            </button>
                            {diffExpanded && (
                              <div
                                id={diffId}
                                className="overflow-hidden border-t border-[color:var(--mobile-phone-row-border)]"
                              >
                                <div className="font-berkeley-mono font-normal [&_*]:font-normal">
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      40
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-soft)]">
                                      {"  "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 38%, #6d28d9 62%)",
                                        }}
                                      >
                                        &lt;button
                                      </span>{" "}
                                      aria-
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        label
                                      </span>
                                      =
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;Toggle navigation menu&quot;
                                      </span>
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      41
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-soft)]">
                                      {"    data-menu-"}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        open
                                      </span>
                                      ={"{"}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 50%, #2563eb 50%)",
                                        }}
                                      >
                                        menuOpen
                                      </span>{" "}
                                      ||{" "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 35%, #0000aa 65%)",
                                        }}
                                      >
                                        undefined
                                      </span>
                                      {"}"}
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight bg-theme-product-removed-line-background">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      42
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-primary)]">
                                      <span className="text-theme-product-ansi-red">
                                        -
                                      </span>
                                      {"     "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        className
                                      </span>
                                      =
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;absolute top-4 left-4 z-20&quot;
                                      </span>
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight bg-theme-product-removed-line-background">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      43
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-primary)]">
                                      <span className="text-theme-product-ansi-red">
                                        -
                                      </span>
                                      {"     "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        style
                                      </span>
                                      ={"{{ "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        transform
                                      </span>
                                      :{" "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 50%, #2563eb 50%)",
                                        }}
                                      >
                                        menuOpen
                                      </span>{" "}
                                      ?{" "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;translateX(4px)&quot;
                                      </span>{" "}
                                      :{" "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;translateX(0)&quot;
                                      </span>
                                      {" }}"}
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight bg-theme-product-line-inserted-line-background">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      42
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-primary)]">
                                      <span className="text-theme-product-ansi-green">
                                        +
                                      </span>
                                      {"     "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        className
                                      </span>
                                      =
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;absolute top-3 left-3 z-20&quot;
                                      </span>
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight bg-theme-product-line-inserted-line-background">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      43
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-primary)]">
                                      <span className="text-theme-product-ansi-green">
                                        +
                                      </span>
                                      {"     "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        style
                                      </span>
                                      ={"{{ "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 42%, #b45309 58%)",
                                        }}
                                      >
                                        transform
                                      </span>
                                      :{" "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 36%, #0f766e 64%)",
                                        }}
                                      >
                                        &quot;translateX(0)&quot;
                                      </span>
                                      {" }}"}
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      44
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-soft)]">
                                      {"  >"}
                                    </span>
                                  </div>
                                  <div className="font-berkeley-mono grid grid-cols-[28px_minmax(0,1fr)] text-[10px] leading-[1.55] tracking-tight">
                                    <span className="px-1 text-right text-[color:var(--mobile-phone-muted)] opacity-70">
                                      45
                                    </span>
                                    <span className="min-w-0 px-1 break-words whitespace-pre-wrap text-[color:var(--mobile-phone-text-soft)]">
                                      {"    "}
                                      <span
                                        style={{
                                          color:
                                            "color-mix(in srgb, var(--mobile-phone-text-primary) 38%, #6d28d9 62%)",
                                        }}
                                      >
                                        &lt;MenuIcon
                                      </span>{" "}
                                      /&gt;
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PhoneHardwareFrame>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}

export function MobileLifecycleAndBottom() {
  return (
    <>
      <section className="section" id="development-lifecycle">
        <div className="container">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">From ideas to production</h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Go end to end on your phone across the development lifecycle.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="container my-v2">
            <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
              <MoveWorkForwardCard />
              <GetDemosOfWorkCard />
              <StayInTheLoopCard />
              <TalkToCursorCard />
              <GiveVisualFeedbackCard />
              <ShipCodeFromYourPhoneCard />
            </div>
          </div>
        </section>
      </section>
      <section className="section bg-theme-bg text-theme-text section--headline">
        <div className="container">
          <div className="text-center mx-auto max-w-prose-medium-wide">
            <h2 className="type-xl sm:type-2xl text-balance mx-auto mb-v1">
              Try Cursor for iOS.
            </h2>
            <div className="flex justify-center gap-x-g1 items-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--leading-icon justify-center gap-2"
                href="https://apps.apple.com/app/cursor-ai/id6740196926"
              >
                <span className="inline-flex items-center justify-center gap-2 leading-none">
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
                  <span className="leading-none">Download now</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
