"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CursorIdeWindow } from "./CursorIdeWindow";
import { DemoWindowStage } from "./DemoWindowStage";
import { GrokBotWindow } from "./GrokBotWindow";

/* ========================================================================== */
/* Block 2B: 45-Step Choreographed Walkthrough Player & Cloud Agent Browser   */
/* ========================================================================== */

type WalkthroughStep =
  | { type: "move"; x: number; y: number }
  | { type: "wait"; ms: number }
  | { type: "action"; action: string }
  | { type: "drag"; toX: number; toY: number; ms: number };

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  { type: "move", x: 70, y: 50 },
  { type: "wait", ms: 800 },
  { type: "move", x: 92, y: 50 },
  { type: "wait", ms: 200 },
  { type: "action", action: "resize-start" },
  { type: "drag", toX: 35, toY: 50, ms: 600 },
  { type: "action", action: "resize-end" },
  { type: "wait", ms: 400 },
  { type: "action", action: "scroll-down" },
  { type: "wait", ms: 1200 },
  { type: "action", action: "scroll-reset" },
  { type: "wait", ms: 800 },
  { type: "action", action: "resize-start" },
  { type: "drag", toX: 92, toY: 50, ms: 600 },
  { type: "action", action: "resize-end" },
  { type: "wait", ms: 600 },
  { type: "move", x: 13, y: 80 },
  { type: "action", action: "hover-sidebar-4" },
  { type: "wait", ms: 300 },
  { type: "action", action: "click-expose" },
  { type: "wait", ms: 600 },
  { type: "move", x: 50, y: 40 },
  { type: "action", action: "hover-clear" },
  { type: "wait", ms: 800 },
  { type: "move", x: 65, y: 35 },
  { type: "action", action: "hover-tile-1" },
  { type: "wait", ms: 300 },
  { type: "action", action: "click-tile-1" },
  { type: "wait", ms: 600 },
  { type: "move", x: 50, y: 50 },
  { type: "wait", ms: 400 },
  { type: "action", action: "scroll-down-far" },
  { type: "wait", ms: 1200 },
  { type: "move", x: 13, y: 80 },
  { type: "action", action: "hover-sidebar-4" },
  { type: "wait", ms: 300 },
  { type: "action", action: "click-expose" },
  { type: "wait", ms: 600 },
  { type: "move", x: 35, y: 35 },
  { type: "action", action: "hover-tile-0" },
  { type: "wait", ms: 300 },
  { type: "action", action: "click-tile-0" },
  { type: "wait", ms: 600 },
  { type: "move", x: 50, y: 40 },
  { type: "action", action: "hover-clear" },
  { type: "wait", ms: 800 },
];

const FG_VAR = "var(--color-theme-fg)";
const BORDER_SUBTLE =
  "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)";

function MiniLineChart({ viewBox = "0 0 240 126", aspect }: { viewBox?: string; aspect?: string }) {
  return (
    <div
      className="w-full overflow-hidden rounded-[2px]"
      style={{
        aspectRatio: aspect,
        border:
          "0.5px solid color-mix(in srgb, var(--color-theme-fg) 6%, transparent)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="none"
      >
        {[20, 40, 60, 80, 100].map((y) => (
          <line
            key={`y-${y}`}
            x1="0"
            y1={y}
            x2="240"
            y2={y}
            stroke={FG_VAR}
            strokeWidth="0.3"
            opacity="0.04"
          />
        ))}
        {[40, 80, 120, 160, 200].map((x) => (
          <line
            key={`x-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="126"
            stroke={FG_VAR}
            strokeWidth="0.3"
            opacity="0.03"
          />
        ))}
        <path
          d="M0 95 C12 90 24 72 40 68 S60 80 80 65 S100 42 120 48 S140 60 160 38 S180 20 200 28 S220 18 240 12"
          fill="none"
          stroke={FG_VAR}
          strokeWidth="0.6"
          opacity="0.18"
        />
        <path
          d="M0 95 C12 90 24 72 40 68 S60 80 80 65 S100 42 120 48 S140 60 160 38 S180 20 200 28 S220 18 240 12 L240 126 L0 126 Z"
          fill={FG_VAR}
          opacity="0.025"
        />
        <path
          d="M0 105 C20 100 50 88 80 82 S120 70 150 58 S190 42 220 35 L240 30"
          fill="none"
          stroke={FG_VAR}
          strokeWidth="0.5"
          opacity="0.12"
        />
        <path
          d="M0 110 C30 108 60 98 90 95 S130 88 160 78 S200 65 230 58 L240 55"
          fill="none"
          stroke={FG_VAR}
          strokeWidth="0.4"
          opacity="0.08"
        />
        {[
          [40, 68],
          [80, 65],
          [120, 48],
          [160, 38],
          [200, 28],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="1.5"
            fill={FG_VAR}
            opacity="0.2"
          />
        ))}
      </svg>
    </div>
  );
}

function WalkthroughPlayer() {
  const [playState, setPlayState] = useState<"idle" | "playing">("idle");
  const [exposed, setExposed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [contentView, setContentView] = useState(0);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(
    null
  );
  const [cursorPos, setCursorPos] = useState({ x: 70, y: 50 });
  const [cursorDuration, setCursorDuration] = useState(0.6);
  const [hoveredSidebarItem, setHoveredSidebarItem] = useState(-1);
  const [hoveredTile, setHoveredTile] = useState(-1);
  const [windowRightPercent, setWindowRightPercent] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [showInitialFlash, setShowInitialFlash] = useState(false);

  const isResizingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const rippleIdRef = useRef(0);
  const cursorPosRef = useRef({ x: 70, y: 50 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const resetVisualState = useCallback(() => {
    setExposed(false);
    setActiveTab(0);
    setContentView(0);
    setRipple(null);
    setHoveredSidebarItem(-1);
    setHoveredTile(-1);
    setWindowRightPercent(0);
    setScrollY(0);
    isResizingRef.current = false;
  }, []);

  const runAction = useCallback((action: string) => {
    const cur = cursorPosRef.current;
    if (action === "resize-start") {
      isResizingRef.current = true;
      return;
    }
    if (action === "resize-end") {
      isResizingRef.current = false;
      return;
    }
    if (action === "scroll-down") {
      setScrollY(105);
      return;
    }
    if (action === "scroll-down-far") {
      setScrollY(145);
      return;
    }
    if (action === "scroll-reset") {
      setScrollY(0);
      return;
    }
    if (action.startsWith("hover-")) {
      const target = action.slice(6);
      if (target === "clear") {
        setHoveredSidebarItem(-1);
        setHoveredTile(-1);
      } else if (target.startsWith("sidebar-")) {
        setHoveredSidebarItem(parseInt(target.slice(8), 10));
      } else if (target.startsWith("tile-")) {
        setHoveredTile(parseInt(target.slice(5), 10));
      }
      return;
    }
    if (action.startsWith("click-")) {
      rippleIdRef.current += 1;
      setRipple({ x: cur.x, y: cur.y, id: rippleIdRef.current });
      setHoveredSidebarItem(-1);
      setHoveredTile(-1);
      const target = action.slice(6);
      if (target === "expose") {
        setExposed(true);
        setActiveTab(4);
        setScrollY(0);
      } else if (target.startsWith("tile-")) {
        const tileIdx = parseInt(target.slice(5), 10);
        setExposed(false);
        setScrollY(0);
        if (tileIdx === 0) {
          setActiveTab(0);
          setContentView(0);
        } else {
          setActiveTab(tileIdx);
          setContentView(1);
        }
      }
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    setPlayState("playing");
    resetVisualState();

    let stepIdx = 0;
    const first = WALKTHROUGH_STEPS[0];
    if (first && first.type === "move") {
      setCursorPos({ x: first.x, y: first.y });
      cursorPosRef.current = { x: first.x, y: first.y };
      setCursorDuration(0);
    }
    stepIdx = 1;

    const advance = () => {
      if (stepIdx >= WALKTHROUGH_STEPS.length) {
        setPlayState("idle");
        resetVisualState();
        return;
      }
      const step = WALKTHROUGH_STEPS[stepIdx];
      stepIdx += 1;
      if (!step) return;

      if (step.type === "wait") {
        timerRef.current = window.setTimeout(advance, step.ms);
      } else if (step.type === "action") {
        runAction(step.action);
        advance();
      } else if (step.type === "move") {
        const dx = step.x - cursorPosRef.current.x;
        const dy = step.y - cursorPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dur = dist < 1 ? 0 : Math.min(0.9, Math.max(0.35, dist / 100));
        setCursorDuration(dur);
        setCursorPos({ x: step.x, y: step.y });
        cursorPosRef.current = { x: step.x, y: step.y };
        timerRef.current = window.setTimeout(advance, dur * 750);
      } else if (step.type === "drag") {
        const sx = cursorPosRef.current.x;
        const sy = cursorPosRef.current.y;
        const ex = step.toX;
        const ey = step.toY;
        const ms = step.ms;
        const startTs = performance.now();
        setCursorDuration(0);

        const animateDrag = (now: number) => {
          const p = Math.min(1, (now - startTs) / ms);
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const cx = sx + (ex - sx) * ease;
          const cy = sy + (ey - sy) * ease;
          setCursorPos({ x: cx, y: cy });
          cursorPosRef.current = { x: cx, y: cy };
          if (isResizingRef.current) {
            setWindowRightPercent(Math.max(0, 92 - cx));
          }
          if (p < 1) {
            rafRef.current = window.requestAnimationFrame(animateDrag);
          } else {
            rafRef.current = null;
            advance();
          }
        };
        rafRef.current = window.requestAnimationFrame(animateDrag);
      }
    };

    timerRef.current = window.setTimeout(advance, 0);
  }, [resetVisualState, runAction]);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    setPlayState("idle");
    resetVisualState();
  }, [resetVisualState]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAutoPlayedRef.current) {
          hasAutoPlayedRef.current = true;
          setShowInitialFlash(true);
          startPlayback();
          window.setTimeout(() => setShowInitialFlash(false), 1000);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startPlayback]);

  const isMobileWidth = windowRightPercent > 35;
  const activeSidebarIdx = exposed ? 4 : activeTab;

  return (
    <div
      ref={rootRef}
      onClick={() => (playState === "idle" ? startPlayback() : stopPlayback())}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (playState === "idle") startPlayback();
          else stopPlayback();
        }
      }}
      className="group/rec relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-transparent transition-all duration-200 hover:border-theme-border-02"
    >
      <div className="absolute inset-0 bg-theme-card-02-hex opacity-50 transition-opacity duration-200 group-hover/rec:opacity-100" />
      <div className="relative flex aspect-[16/9]">
        <div className="absolute inset-0 overflow-hidden rounded-[3px]">
          <img
            src="/marketing-static/demos/cursor-wallpaper.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/[0.08]" />
          <div
            className="absolute overflow-hidden bg-theme-product-chrome"
            style={{
              top: "8%",
              left: "8%",
              right: `${8 + windowRightPercent}%`,
              bottom: "10%",
              borderRadius: "3px",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15)",
            }}
          >
            {/* Mini Window Top Bar */}
            <div
              className="flex h-[10px] items-center gap-[2px] px-[4px]"
              style={{ borderBottom: BORDER_SUBTLE }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[3.5px] w-[3.5px] rounded-full"
                  style={{ backgroundColor: FG_VAR, opacity: 0.15 }}
                />
              ))}
            </div>

            <div className="flex h-[calc(100%-10px)]">
              {/* Mini Sidebar */}
              {!isMobileWidth && (
                <div
                  className="flex w-[24%] shrink-0 flex-col p-[4px] pt-[5px]"
                  style={{ borderRight: BORDER_SUBTLE }}
                >
                  <div className="flex flex-col gap-[3px]">
                    {[0, 1, 2, 3].map((idx) => {
                      const isAct = idx === activeSidebarIdx;
                      const isHov = idx === hoveredSidebarItem && !isAct;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-[3px] rounded-[2px] px-[2px] py-[2.5px] transition-all duration-150"
                          style={{
                            backgroundColor: isAct
                              ? `color-mix(in srgb, ${FG_VAR} 8%, transparent)`
                              : isHov
                              ? `color-mix(in srgb, ${FG_VAR} 5%, transparent)`
                              : "transparent",
                          }}
                        >
                          <div
                            className="h-[5px] w-[5px] shrink-0 rounded-[1.5px] transition-all duration-150"
                            style={{
                              backgroundColor: FG_VAR,
                              opacity: isAct ? 0.35 : isHov ? 0.2 : 0.14,
                            }}
                          />
                          <div
                            className="h-[2px] w-[65%] rounded-sm transition-all duration-150"
                            style={{
                              backgroundColor: FG_VAR,
                              opacity: isAct ? 0.25 : isHov ? 0.16 : 0.1,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex-1" />
                  <div
                    className="flex items-center gap-[3px] rounded-[2px] px-[2px] py-[2.5px] transition-all duration-150"
                    style={{
                      backgroundColor:
                        activeSidebarIdx === 4
                          ? `color-mix(in srgb, ${FG_VAR} 8%, transparent)`
                          : hoveredSidebarItem === 4
                          ? `color-mix(in srgb, ${FG_VAR} 5%, transparent)`
                          : "transparent",
                    }}
                  >
                    <div
                      className="h-[5px] w-[5px] shrink-0 rounded-[1.5px]"
                      style={{
                        backgroundColor: FG_VAR,
                        opacity:
                          activeSidebarIdx === 4
                            ? 0.35
                            : hoveredSidebarItem === 4
                            ? 0.2
                            : 0.14,
                      }}
                    />
                    <div
                      className="h-[2px] w-[65%] rounded-sm"
                      style={{
                        backgroundColor: FG_VAR,
                        opacity:
                          activeSidebarIdx === 4
                            ? 0.25
                            : hoveredSidebarItem === 4
                            ? 0.16
                            : 0.1,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Mini Window Content */}
              <div className="relative min-w-0 flex-1 bg-theme-bg">
                {exposed ? (
                  <div className="h-full bg-theme-card-02-hex p-[5px]">
                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-[4px]">
                      {/* Tile 0: acme */}
                      <div
                        className="animate-[tilePopIn_200ms_ease-out_both] overflow-hidden rounded-[3px] transition-all duration-150"
                        style={{
                          border:
                            hoveredTile === 0
                              ? `0.5px solid color-mix(in srgb, ${FG_VAR} 12%, transparent)`
                              : `0.5px solid color-mix(in srgb, ${FG_VAR} 5%, transparent)`,
                          animationDelay: "0ms",
                          transform:
                            hoveredTile === 0 ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <div className="flex h-full flex-col bg-theme-bg p-[5px]">
                          <div className="mb-[4px] flex items-center gap-[2px]">
                            <div
                              className="rounded-full px-[3px] py-[1.5px]"
                              style={{ backgroundColor: FG_VAR, opacity: 0.12 }}
                            />
                            <div
                              className="rounded-full px-[3px] py-[1.5px]"
                              style={{ backgroundColor: FG_VAR, opacity: 0.05 }}
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            {[55, 40, 50, 44, 52, 46, 48, 42].map((w, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-[2px]"
                                style={{
                                  borderBottom: `0.5px solid color-mix(in srgb, ${FG_VAR} 5%, transparent)`,
                                }}
                              >
                                <div
                                  className="h-[1.5px] rounded-sm"
                                  style={{
                                    width: `${w}%`,
                                    backgroundColor: FG_VAR,
                                    opacity: 0.12,
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Tile 1: chart */}
                      <div
                        className="animate-[tilePopIn_200ms_ease-out_both] overflow-hidden rounded-[3px] transition-all duration-150"
                        style={{
                          border:
                            hoveredTile === 1
                              ? `0.5px solid color-mix(in srgb, ${FG_VAR} 12%, transparent)`
                              : `0.5px solid color-mix(in srgb, ${FG_VAR} 5%, transparent)`,
                          animationDelay: "40ms",
                          transform:
                            hoveredTile === 1 ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <div className="flex h-full items-center justify-center bg-theme-bg p-[5px]">
                          <MiniLineChart viewBox="0 0 240 126" />
                        </div>
                      </div>
                      {/* Tile 2: secure-index */}
                      <div
                        className="animate-[tilePopIn_200ms_ease-out_both] overflow-hidden rounded-[3px] transition-all duration-150"
                        style={{
                          border: `0.5px solid color-mix(in srgb, ${FG_VAR} 5%, transparent)`,
                          animationDelay: "80ms",
                        }}
                      >
                        <div className="flex h-full items-center justify-center bg-theme-bg p-[5px]">
                          <img
                            src="/marketing-static/demos/blog-secure-index.svg"
                            alt=""
                            className="logo-dark-invert h-full w-full object-contain opacity-[0.45]"
                            draggable={false}
                          />
                        </div>
                      </div>
                      {/* Tile 3: self-driving */}
                      <div
                        className="animate-[tilePopIn_200ms_ease-out_both] overflow-hidden rounded-[3px] transition-all duration-150"
                        style={{
                          border: `0.5px solid color-mix(in srgb, ${FG_VAR} 5%, transparent)`,
                          animationDelay: "120ms",
                        }}
                      >
                        <div className="flex h-full items-center justify-center bg-theme-bg p-[5px]">
                          <img
                            src="/marketing-static/demos/blog-self-driving.svg"
                            alt=""
                            className="logo-dark-invert h-full w-full object-contain opacity-[0.45]"
                            draggable={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : contentView === 0 ? (
                  /* Acme view */
                  <div
                    className="h-full overflow-hidden"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${FG_VAR} 3%, transparent)`,
                    }}
                  >
                    <div
                      className="bg-theme-bg px-[7px] pt-[6px] pb-0"
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        transform: `translateY(-${scrollY}px)`,
                        transition:
                          scrollY > 0
                            ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                            : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <div className="mb-[5px] flex flex-col gap-[2.5px]">
                        <div
                          className="h-[2.5px] w-[96%] rounded-sm"
                          style={{ backgroundColor: FG_VAR, opacity: 0.1 }}
                        />
                        <div
                          className="h-[2.5px] w-[80%] rounded-sm"
                          style={{ backgroundColor: FG_VAR, opacity: 0.1 }}
                        />
                      </div>
                      <div className="mb-[6px] flex items-center gap-[3px]">
                        <div
                          className="rounded-full px-[5px] py-[2px]"
                          style={{ backgroundColor: FG_VAR, opacity: 0.1 }}
                        >
                          <div
                            className="h-[2px] w-[8px] rounded-sm"
                            style={{ backgroundColor: FG_VAR, opacity: 0.12 }}
                          />
                        </div>
                        {!isMobileWidth &&
                          [12, 16, 10].map((w, idx) => (
                            <div
                              key={idx}
                              className="rounded-full px-[5px] py-[2px]"
                              style={{ backgroundColor: FG_VAR, opacity: 0.04 }}
                            >
                              <div
                                className="h-[2px] rounded-sm"
                                style={{
                                  width: `${w}px`,
                                  backgroundColor: FG_VAR,
                                  opacity: 0.08,
                                }}
                              />
                            </div>
                          ))}
                      </div>
                      <div
                        className="mb-[4px] h-[0.5px]"
                        style={{ backgroundColor: FG_VAR, opacity: 0.06 }}
                      />
                      <div className="flex flex-col gap-[3.5px]">
                        {[
                          50, 38, 46, 42, 54, 48, 44, 52, 40, 50, 36, 48, 42,
                          56, 44,
                        ].map((w, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-[3px] pb-[3px]"
                            style={{
                              borderBottom: `0.5px solid color-mix(in srgb, ${FG_VAR} 6%, transparent)`,
                            }}
                          >
                            <div
                              className="h-[2.5px] w-[10px] shrink-0 rounded-sm"
                              style={{ backgroundColor: FG_VAR, opacity: 0.08 }}
                            />
                            <div
                              className="h-[2.5px] rounded-sm"
                              style={{
                                width: `${w}%`,
                                backgroundColor: FG_VAR,
                                opacity: 0.1,
                              }}
                            />
                            <div className="flex-1" />
                            <div
                              className="h-[2.5px] w-[14px] shrink-0 rounded-sm"
                              style={{ backgroundColor: FG_VAR, opacity: 0.06 }}
                            />
                          </div>
                        ))}
                      </div>
                      <div
                        className="-mx-[7px] mt-[8px] px-[7px] py-[5px]"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${FG_VAR} 3%, transparent)`,
                        }}
                      >
                        <div className="mb-[4px] text-[6px] font-medium italic leading-none text-theme-text opacity-40">
                          Acme Labs
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Chart / Scatter Article view */
                  <div
                    className="h-full overflow-hidden animate-[fadeIn_150ms_ease-out_both]"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${FG_VAR} 3%, transparent)`,
                    }}
                  >
                    <div
                      className="bg-theme-bg px-[6px] pt-[7px] pb-0"
                      style={{
                        transform: `translateY(-${scrollY}px)`,
                        transition:
                          scrollY > 0
                            ? "transform 1s cubic-bezier(0.4, 0, 0.2, 1)"
                            : "none",
                      }}
                    >
                      <div
                        className="mb-[3px] h-[4.5px] w-[50%] rounded-sm"
                        style={{ backgroundColor: FG_VAR, opacity: 0.14 }}
                      />
                      <div
                        className="mb-[6px] h-[3.5px] w-[70%] rounded-sm"
                        style={{ backgroundColor: FG_VAR, opacity: 0.08 }}
                      />
                      <MiniLineChart viewBox="0 0 240 126" aspect="2400/1260" />
                      <div className="mt-[5px] grid grid-cols-2 gap-[3px]">
                        {["72%", "60%", "68%", "55%"].map((w, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-[3px] rounded-[2px] p-[3px]"
                            style={{
                              border: `0.5px solid color-mix(in srgb, ${FG_VAR} 8%, transparent)`,
                            }}
                          >
                            <div
                              className="shrink-0 rounded-full"
                              style={{
                                width: 6,
                                height: 6,
                                backgroundColor: FG_VAR,
                                opacity: 0.1,
                              }}
                            />
                            <div className="flex-1 pt-[0.5px]">
                              <div
                                className="mb-[2px] h-[2.5px] rounded-sm"
                                style={{
                                  width: w,
                                  backgroundColor: FG_VAR,
                                  opacity: 0.12,
                                }}
                              />
                              <div
                                className="h-[2px] w-[90%] rounded-sm"
                                style={{
                                  backgroundColor: FG_VAR,
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
                          height: 45,
                          border: `0.5px solid color-mix(in srgb, ${FG_VAR} 8%, transparent)`,
                        }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 200 55"
                          preserveAspectRatio="none"
                        >
                          {[12, 24, 36, 48].map((y) => (
                            <line
                              key={y}
                              x1="0"
                              y1={y}
                              x2="200"
                              y2={y}
                              stroke={FG_VAR}
                              strokeWidth="0.2"
                              opacity="0.06"
                            />
                          ))}
                          {[
                            [15, 38],
                            [25, 32],
                            [35, 28],
                            [42, 35],
                            [55, 22],
                            [65, 18],
                            [72, 25],
                            [88, 30],
                            [95, 15],
                            [108, 20],
                            [115, 12],
                            [125, 24],
                            [138, 10],
                            [148, 16],
                            [155, 8],
                            [165, 14],
                            [175, 18],
                            [188, 6],
                          ].map(([cx, cy], idx) => (
                            <circle
                              key={idx}
                              cx={cx}
                              cy={cy}
                              r={1.2 + (idx % 3) * 0.4}
                              fill="none"
                              stroke={FG_VAR}
                              strokeWidth="0.5"
                              opacity="0.22"
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Click Ripple */}
        {ripple && (
          <div
            key={ripple.id}
            className="pointer-events-none absolute z-20 rounded-full border border-theme-text-ter animate-ping"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: 14,
              height: 14,
              marginLeft: -7,
              marginTop: -7,
            }}
          />
        )}

        {/* Agent Cursor */}
        {playState === "playing" && (
          <div
            className="pointer-events-none absolute z-20 mt-1.5"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              transition:
                cursorDuration > 0
                  ? `left ${cursorDuration}s cubic-bezier(0.4,0,0.1,1), top ${cursorDuration}s cubic-bezier(0.4,0,0.1,1)`
                  : "none",
            }}
          >
            <svg
              className="-scale-x-100 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]"
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
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
        )}

        {/* Play / Pause Button Overlay */}
        {(playState === "idle" || showInitialFlash) && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 transition-all duration-150 group-hover/rec:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="text-white -ml-px"
              >
                <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
              </svg>
            </div>
          </div>
        )}
        {playState === "playing" && isMouseOver && !showInitialFlash && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="text-white"
              >
                <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CloudRunItem {
  id: string;
  group: "This Week" | "This Month";
  title: string;
  indicator: "attention" | "running" | "merged" | "open";
  prompt: string;
  exploredDetail: string;
  assistantPlan: string;
  workedDuration: string;
  secondStepLabel: string;
  secondStepDetail: string;
  doneText: string;
  summary: string;
}

const CLOUD_RUNS: CloudRunItem[] = [
  {
    id: "1",
    group: "This Week",
    title: "Acme Research Dashboard",
    indicator: "attention",
    prompt:
      "let's build a dashboard to make our research findings interactive",
    exploredDetail: "12 files, 4 searches",
    assistantPlan:
      "On it. I'll build the dashboard using your theme config, wire up the research data, and add interactive charts with public access controls.",
    workedDuration: "Worked for 14m 22s",
    secondStepLabel: "Processed",
    secondStepDetail: "screen recording",
    doneText: "Done! Here's a walkthrough of the dashboard.",
    summary:
      "Built the interactive dashboard with realtime charts, data from Snowflake, and shadcn components. Deployed to staging via Vercel.",
  },
  {
    id: "2",
    group: "This Week",
    title: "Live Telemetry Pipeline",
    indicator: "running",
    prompt:
      "stream edge telemetry events into ClickHouse with sub-second aggregation",
    exploredDetail: "9 files, 3 searches",
    assistantPlan:
      "I'll wire up the Kafka consumer batching pipeline, create the ClickHouse materialized views, and verify sub-second rollup latency.",
    workedDuration: "Worked for 11m 08s",
    secondStepLabel: "Verified",
    secondStepDetail: "ingest benchmark & walkthrough",
    doneText: "Done! Here's a walkthrough of the live telemetry pipeline.",
    summary:
      "Configured Kafka consumer batching, ClickHouse materialized views, and backpressure alerts across 12 regions.",
  },
  {
    id: "4",
    group: "This Week",
    title: "Zero-Downtime Deploys",
    indicator: "merged",
    prompt: "add graceful connection draining during rolling worker deploys",
    exploredDetail: "7 files, 2 searches",
    assistantPlan:
      "I'll add SIGTERM healthcheck draining to the worker supervisor, hold in-flight requests until completion, and run the load suite.",
    workedDuration: "Worked for 8m 45s",
    secondStepLabel: "Processed",
    secondStepDetail: "rollout verification clip",
    doneText: "Done! Zero dropped requests during rolling restarts.",
    summary:
      "Implemented SIGTERM healthcheck draining and verified zero dropped requests under load test.",
  },
  {
    id: "5",
    group: "This Month",
    title: "Binary Protocol Parser",
    indicator: "open",
    prompt: "optimize frame decoding for our custom wire protocol",
    exploredDetail: "6 files, 3 searches",
    assistantPlan:
      "I'll replace intermediate buffer copies with zero-copy subarray views and benchmark the frame decoder against the fixture corpus.",
    workedDuration: "Worked for 19m 14s",
    secondStepLabel: "Benchmarked",
    secondStepDetail: "3.4x throughput gain",
    doneText: "Done! Frame decoding throughput increased by 3.4x.",
    summary:
      "Replaced buffer copies with zero-copy slices, improving throughput by 3.4x on benchmark suite.",
  },
  {
    id: "6",
    group: "This Month",
    title: "Edge Cache Invalidation",
    indicator: "attention",
    prompt: "propagate tag-based cache purges globally within 150ms",
    exploredDetail: "10 files, 5 searches",
    assistantPlan:
      "I'll set up regional pub/sub fanout for surrogate-key purges and add stale-while-revalidate background rehydration.",
    workedDuration: "Worked for 12m 39s",
    secondStepLabel: "Processed",
    secondStepDetail: "propagation trace",
    doneText: "Done! Global purge p99 measured at 118ms across all POPs.",
    summary:
      "Wired invalidation fanout over pub/sub with stale-while-revalidate fallback.",
  },
  {
    id: "7",
    group: "This Month",
    title: "Auth Token Rotation",
    indicator: "merged",
    prompt: "automate dual-key JWT signing key rotation every 24h",
    exploredDetail: "8 files, 2 searches",
    assistantPlan:
      "I'll implement dual-kid JWKS publishing, schedule the 24h KMS key rotation worker, and add zero-downtime token verification tests.",
    workedDuration: "Worked for 9m 51s",
    secondStepLabel: "Verified",
    secondStepDetail: "JWKS rotation suite",
    doneText: "Done! Dual-key rotation is live with full audit logging.",
    summary:
      "Added overlapping JWKS keysets and automated KMS rotation job with full audit logs.",
  },
];

function CloudAgentIndicator({
  indicator,
}: {
  indicator: CloudRunItem["indicator"];
}) {
  if (indicator === "running") {
    return (
      <span
        className="shrink-0 text-theme-text-sec"
        style={{
          fontFamily: "CursorIcons16",
          fontSize: "14px",
          lineHeight: 1,
          display: "inline-block",
          width: "14px",
          height: "14px",
          textAlign: "center",
          mask: "conic-gradient(from 0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 30%, black 100%)",
          WebkitMask:
            "conic-gradient(from 0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 30%, black 100%)",
        }}
      >
        {String.fromCodePoint(0xedca)}
      </span>
    );
  }
  if (indicator === "merged") {
    return (
      <span
        className="shrink-0 text-theme-text-ter opacity-20 transition-all group-hover/agent:text-theme-primary group-hover/agent:opacity-100"
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
        {String.fromCodePoint(0xeafe)}
      </span>
    );
  }
  if (indicator === "open") {
    return (
      <span
        className="shrink-0 text-theme-text-ter opacity-20 transition-all group-hover/agent:text-theme-product-ansi-green group-hover/agent:opacity-100"
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
        {String.fromCodePoint(0xea64)}
      </span>
    );
  }
  return (
    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      <div className="h-[6px] w-[6px] rounded-full bg-theme-text opacity-15 transition-all group-hover/agent:bg-[#3b82f6] group-hover/agent:opacity-100" />
    </div>
  );
}

function CloudAgentBrowserShowcase() {
  const [activeRunId, setActiveRunId] = useState("1");
  const [selectedMode, setSelectedMode] = useState("Agent");
  const [selectedModel, setSelectedModel] = useState("Opus 5.5");
  const [openPopover, setOpenPopover] = useState<"mode" | "model" | null>(null);

  const activeRun =
    CLOUD_RUNS.find((r) => r.id === activeRunId) ?? CLOUD_RUNS[0];

  return (
    <div
      className="relative w-full overflow-hidden p-4 md:p-12"
      style={{ height: "680px" }}
    >
      <div
        className="h-full mx-auto"
        style={{
          width: "100%",
          maxWidth: "740px",
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 22px 70px 4px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
          borderRadius: "10px",
        }}
      >
        <div
          className="flex h-full w-full flex-col overflow-hidden rounded-[10px] bg-theme-product-chrome"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15), 0 0 0 0.5px var(--color-theme-border-02)",
          }}
        >
          {/* Browser URL Bar */}
          <div
            className="relative flex shrink-0 items-center gap-3 border-b border-theme-border-02 px-3"
            style={{
              height: "44px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            <div className="media-light absolute inset-0 bg-theme-card-02-hex" />
            <div className="media-dark absolute inset-0 bg-theme-product-editor" />
            <div className="relative flex shrink-0 items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-theme-fg-20)" }}
              />
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-theme-fg-20)" }}
              />
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-theme-fg-20)" }}
              />
            </div>
            <div className="relative flex min-w-0 flex-1 justify-center">
              <div
                className="flex min-w-0 items-center justify-between rounded-md border border-theme-border-02 bg-theme-card-02-hex max-w-[320px] flex-1 gap-2.5 px-2.5 py-1"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-theme-border-02) 60%, transparent)",
                }}
              >
                <span
                  className="shrink-0 text-theme-text-ter opacity-40"
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
                  {String.fromCodePoint(0xea75)}
                </span>
                <span className="min-w-0 flex-1 truncate text-center text-[11px] text-theme-text-ter opacity-60">
                  cursor.com/agent
                </span>
                <span
                  className="shrink-0 text-theme-text-ter opacity-40"
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
                  {String.fromCodePoint(0xeb37)}
                </span>
              </div>
            </div>
            <div className="relative w-12 shrink-0" />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="flex h-full overflow-hidden">
              {/* Left Sidebar of Runs */}
              <div className="flex h-full w-[160px] md:w-[204px] shrink-0 flex-col border-r border-theme-border-02 bg-theme-product-chrome">
                <div className="flex items-center justify-between px-3 py-2.5">
                  <svg
                    className="h-5 w-5 text-theme-text"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21.406 6.086l-8.5-4.908a1.813 1.813 0 0 0-1.812 0l-8.5 4.908A1.81 1.81 0 0 0 1.688 7.65v8.7c0 .646.344 1.243.906 1.564l8.5 4.908a1.813 1.813 0 0 0 1.812 0l8.5-4.908a1.81 1.81 0 0 0 .906-1.564v-8.7c0-.646-.344-1.243-.906-1.564zm-1.06 1.818L12.15 21.84c-.11.19-.4.11-.4-.11v-9.3c0-.37-.2-.71-.52-.9L3.17 6.88c-.19-.11-.11-.4.11-.4h16.41c.46 0 .75.5.52.91z" />
                  </svg>
                </div>
                <div className="flex-1 overflow-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {(["This Week", "This Month"] as const).map((groupLabel) => (
                    <React.Fragment key={groupLabel}>
                      <div
                        className={`type-product-sm px-3 pb-1 ${
                          groupLabel === "This Month" ? "pt-3" : ""
                        } font-medium text-theme-text-ter opacity-50`}
                      >
                        {groupLabel}
                      </div>
                      {CLOUD_RUNS.filter((r) => r.group === groupLabel).map(
                        (run) => {
                          const isAct = run.id === activeRun.id;
                          return (
                            <div
                              key={run.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => setActiveRunId(run.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setActiveRunId(run.id);
                                }
                              }}
                              className={`group/agent mx-1.5 mb-0.5 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors ${
                                isAct
                                  ? "bg-theme-card-hover-hex"
                                  : "hover:bg-theme-card-hover-hex/60"
                              }`}
                            >
                              <CloudAgentIndicator indicator={run.indicator} />
                              <span
                                className={`type-product-base min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-colors ${
                                  isAct
                                    ? "text-theme-text"
                                    : "text-theme-text-ter group-hover/agent:text-theme-text"
                                }`}
                                style={{
                                  maskImage:
                                    "linear-gradient(to right, black 80%, transparent 100%)",
                                  WebkitMaskImage:
                                    "linear-gradient(to right, black 80%, transparent 100%)",
                                }}
                              >
                                {run.title}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Main Agent Run View */}
              <div className="min-w-0 flex-1">
                <div className="flex h-full flex-col bg-theme-product-chrome">
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <span className="type-product-base font-medium text-theme-text">
                      {activeRun.title}
                    </span>
                  </div>
                  <div className="relative min-h-0 flex-1">
                    <div
                      key={activeRun.id}
                      className="h-full overflow-hidden animate-[fadeSlideUp_200ms_ease-out_both]"
                    >
                      <div className="sticky top-0 z-10 px-4 pt-0">
                        <div className="bg-theme-product-chrome">
                          <div className="rounded-[var(--radius-lg)] border border-theme-border-02 bg-theme-card-02-hex px-2 py-2.5">
                            <div className="type-product-lg text-theme-text text-[13px]">
                              {activeRun.prompt}
                            </div>
                          </div>
                        </div>
                        <div className="from-theme-product-chrome pointer-events-none h-2 bg-gradient-to-b to-transparent" />
                      </div>
                      <div className="px-4 pt-2 pb-3">
                        <div className="space-y-1.5 pl-2">
                          <div className="type-product-base text-theme-text-sec leading-snug text-[12px]">
                            <span className="flex-shrink-0">Explored</span>{" "}
                            <span className="opacity-60">
                              {activeRun.exploredDetail}
                            </span>
                          </div>
                          <div className="type-product-lg pt-0.5 leading-snug text-theme-text text-[13px]">
                            {activeRun.assistantPlan}
                          </div>
                          <div className="type-product-base pt-0.5 text-theme-text-sec leading-snug text-[12px]">
                            {activeRun.workedDuration}
                          </div>
                          <div className="type-product-base text-theme-text-sec leading-snug text-[12px]">
                            <span className="flex-shrink-0">
                              {activeRun.secondStepLabel}
                            </span>{" "}
                            <span className="opacity-60">
                              {activeRun.secondStepDetail}
                            </span>
                          </div>
                          <div className="type-product-lg pt-0.5 leading-snug text-theme-text text-[13px]">
                            {activeRun.doneText}
                          </div>
                        </div>
                        <div
                          className="mt-3 mb-3 pl-2"
                          style={{ width: "min(78%, 260px)", maxWidth: "none" }}
                        >
                          <WalkthroughPlayer />
                        </div>
                        <div className="type-product-lg mb-1.5 pl-2 font-medium text-theme-text text-[13px]">
                          Summary
                        </div>
                        <div className="type-product-lg pl-2 leading-snug text-theme-text text-[13px]">
                          {activeRun.summary}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Composer with Interactive Mode & Model Popovers */}
                  <div className="bg-theme-product-chrome relative z-[80] p-4 pt-0">
                    <div className="border-theme-border-02 bg-theme-product-editor rounded-[var(--radius-lg)] border">
                      <div className="text-theme-text-sec type-product-base w-full bg-transparent px-2 pt-2 pb-1.5 text-[13px]">
                        Add a follow up...
                      </div>
                      <div className="px-2 py-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenPopover((p) =>
                                    p === "mode" ? null : "mode"
                                  )
                                }
                                className="type-product-sm flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75 transition-colors bg-theme-card-03-hex text-theme-text-sec hover:text-theme-text"
                              >
                                <span className="opacity-60">
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24.7969 11.3555"
                                    fill="currentColor"
                                  >
                                    <path d="M0 5.67188C0 9.11719 2.13281 11.3438 5.30859 11.3438C6.98438 11.3438 8.41406 10.6406 9.9375 9.17578L12.2227 6.96094L14.5078 9.17578C16.0312 10.6406 17.4609 11.3438 19.1367 11.3438C22.3125 11.3438 24.4453 9.11719 24.4453 5.67188C24.4453 2.22656 22.3125 0 19.1367 0C17.4609 0 16.0312 0.703125 14.5078 2.16797L12.2227 4.38281L9.9375 2.16797C8.41406 0.703125 6.98438 0 5.30859 0C2.13281 0 0 2.22656 0 5.67188ZM1.91016 5.67188C1.91016 3.36328 3.28125 1.91016 5.30859 1.91016C6.44531 1.91016 7.45312 2.44922 8.60156 3.52734L10.8867 5.67188L8.60156 7.81641C7.45312 8.89453 6.44531 9.43359 5.30859 9.43359C3.28125 9.43359 1.91016 7.98047 1.91016 5.67188ZM13.5586 5.67188L15.8438 3.52734C16.9922 2.44922 18 1.91016 19.1367 1.91016C21.1641 1.91016 22.5352 3.36328 22.5352 5.67188C22.5352 7.98047 21.1641 9.43359 19.1367 9.43359C18 9.43359 16.9922 8.89453 15.8438 7.81641Z" />
                                  </svg>
                                </span>
                                <span>{selectedMode}</span>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="currentColor"
                                  className="h-3 w-3 opacity-60"
                                >
                                  <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                </svg>
                              </button>
                              {openPopover === "mode" && (
                                <div
                                  className="bg-theme-card-hex absolute bottom-full left-0 z-50 mb-2 min-w-[160px] overflow-hidden rounded-lg p-1"
                                  style={{
                                    boxShadow:
                                      "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                  }}
                                >
                                  {["Agent", "Grind", "Plan", "Debug", "Ask"].map(
                                    (m) => (
                                      <button
                                        key={m}
                                        type="button"
                                        onClick={() => {
                                          setSelectedMode(m);
                                          setOpenPopover(null);
                                        }}
                                        className="type-product-base flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-theme-card-hover-hex text-theme-text"
                                      >
                                        <span>{m}</span>
                                        {selectedMode === m && <span>✓</span>}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenPopover((p) =>
                                    p === "model" ? null : "model"
                                  )
                                }
                                className="text-theme-text-sec type-product-sm flex cursor-pointer items-center gap-0.5 rounded-md bg-transparent py-0.75 transition-colors hover:text-theme-text"
                              >
                                <span>{selectedModel}</span>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="currentColor"
                                  className="h-3 w-3 opacity-60"
                                >
                                  <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                </svg>
                              </button>
                              {openPopover === "model" && (
                                <div
                                  className="bg-theme-card-hex absolute bottom-full left-0 z-50 mb-2 min-w-[190px] overflow-hidden rounded-lg p-1"
                                  style={{
                                    boxShadow:
                                      "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                  }}
                                >
                                  {[
                                    { label: "Grok 4.7", tag: "High" },
                                    { label: "Opus 5.5", tag: "1M High" },
                                    { label: "Fable 5.1", tag: "Max" },
                                    { label: "Sonnet 5.5", tag: "1M High" },
                                    { label: "GPT-5.6 Sol", tag: "High Fast" },
                                    { label: "Gemini 3.1 Pro" },
                                    { label: "Composer 2.5" },
                                  ].map((m) => (
                                    <button
                                      key={m.label}
                                      type="button"
                                      onClick={() => {
                                        setSelectedModel(m.label);
                                        setOpenPopover(null);
                                      }}
                                      className="type-product-base flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-theme-card-hover-hex"
                                    >
                                      <span className="flex items-baseline gap-1.5">
                                        <span className="text-theme-text">
                                          {m.label}
                                        </span>
                                        {m.tag && (
                                          <span className="type-product-sm text-theme-text-ter opacity-50">
                                            {m.tag}
                                          </span>
                                        )}
                                      </span>
                                      {selectedModel === m.label && (
                                        <span className="text-theme-text">✓</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label="Send message"
                            className="bg-theme-card-04-hex text-theme-text-sec flex h-5 w-5 items-center justify-center rounded-full"
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
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Block 2C: Slack Window + 17-Phase Looping CLI State Machine                */
/* ========================================================================== */

const CLI_PHASES = [
  "idle",
  "typing",
  "thinking",
  "toolCall1",
  "planning",
  "toolCall2",
  "questions",
  "questionsNav1",
  "questionsNav2",
  "selection",
  "analyzing",
  "initializing",
  "subagents",
  "cloudTyping",
  "cloudSaving",
  "cloudMigrating",
  "pause",
] as const;

type CliPhase = (typeof CLI_PHASES)[number];

const CLI_PHASE_DURATIONS: Record<CliPhase, number> = {
  idle: 600,
  typing: 1000,
  thinking: 700,
  toolCall1: 1000,
  planning: 700,
  toolCall2: 1000,
  questions: 700,
  questionsNav1: 500,
  questionsNav2: 500,
  selection: 600,
  analyzing: 700,
  initializing: 800,
  subagents: 2500,
  cloudTyping: 1200,
  cloudSaving: 1200,
  cloudMigrating: 1500,
  pause: 1800,
};

const CLI_SUBAGENTS = [
  {
    name: "subagent-1",
    title: "Health",
    model: "Opus-5.5",
    task: "Building health metrics panel",
  },
  {
    name: "subagent-2",
    title: "Deployments",
    model: "GPT-5.6 Sol",
    task: "Creating deployment tracker",
  },
  {
    name: "subagent-3",
    title: "Incidents",
    model: "Composer-1",
    task: "Building incident feed",
  },
];

const CLI_PROMPT = "plan mission control interface";
const CLI_CLOUD_PROMPT = "let's continue in the cloud";
const CLI_QUESTIONS = ["Real-time metrics", "System status"];

function HexPulse({
  done = false,
  syncTick,
  color = "green",
}: {
  done?: boolean;
  syncTick: number;
  color?: "green" | "purple";
}) {
  const glyph = done || Math.floor(syncTick / 3) % 2 === 0 ? "⬢" : "⬡";
  const colorClass = done
    ? "text-theme-text"
    : color === "purple"
    ? "text-purple-400"
    : "text-green-500";
  return <span className={colorClass}>{glyph}</span>;
}

function LoopingCliAgentWindow() {
  const [phase, setPhase] = useState<CliPhase>("idle");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [typedCloud, setTypedCloud] = useState("");
  const [tick, setTick] = useState(0);
  const [visibleSubagents, setVisibleSubagents] = useState(0);
  const [subagentStarted, setSubagentStarted] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  const phaseIdx = CLI_PHASES.indexOf(phase);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((t) => (t + 1) % 6);
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const dur = CLI_PHASE_DURATIONS[phase];
    const timer = window.setTimeout(() => {
      const nextIdx = phaseIdx + 1;
      if (nextIdx < CLI_PHASES.length) {
        const nextPhase = CLI_PHASES[nextIdx];
        if (nextPhase) {
          if (nextPhase === "typing") setTypedPrompt("");
          if (nextPhase === "cloudTyping") setTypedCloud("");
          if (nextPhase === "subagents") {
            setVisibleSubagents(0);
            setSubagentStarted([0, 0, 0]);
          }
          setPhase(nextPhase);
        }
      } else {
        setTypedPrompt("");
        setTypedCloud("");
        setVisibleSubagents(0);
        setSubagentStarted([0, 0, 0]);
        setPhase("idle");
      }
    }, dur);
    return () => window.clearTimeout(timer);
  }, [phase, phaseIdx]);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const interval = window.setInterval(() => {
      if (i < CLI_PROMPT.length) {
        i += 1;
        setTypedPrompt(CLI_PROMPT.slice(0, i));
      } else {
        window.clearInterval(interval);
      }
    }, CLI_PHASE_DURATIONS.typing / CLI_PROMPT.length);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "cloudTyping") return;
    let i = 0;
    const interval = window.setInterval(() => {
      if (i < CLI_CLOUD_PROMPT.length) {
        i += 1;
        setTypedCloud(CLI_CLOUD_PROMPT.slice(0, i));
      } else {
        window.clearInterval(interval);
      }
    }, CLI_PHASE_DURATIONS.cloudTyping / CLI_CLOUD_PROMPT.length);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "subagents") return;
    let i = 0;
    const interval = window.setInterval(() => {
      if (i < CLI_SUBAGENTS.length) {
        i += 1;
        setVisibleSubagents(i);
      } else {
        window.clearInterval(interval);
      }
    }, 200);
    const timeouts = CLI_SUBAGENTS.map((_, idx) =>
      window.setTimeout(() => {
        setSubagentStarted((prev) => {
          const next: [number, number, number] = [...prev];
          next[idx] = 1;
          return next;
        });
      }, 200 * (idx + 1) + 600)
    );
    return () => {
      window.clearInterval(interval);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [phase]);

  const metrics = {
    idle: { context: 0, files: 0 },
    typing: { context: 1, files: 0 },
    thinking: { context: 2, files: 0 },
    toolCall1: { context: 3, files: 0 },
    planning: { context: 4, files: 0 },
    toolCall2: { context: 5, files: 0 },
    questions: { context: 5, files: 0 },
    questionsNav1: { context: 5, files: 0 },
    questionsNav2: { context: 5, files: 0 },
    selection: { context: 6, files: 0 },
    analyzing: { context: 7, files: 0 },
    initializing: { context: 8, files: 0 },
    subagents: { context: 8, files: 2 },
    cloudTyping: { context: 8, files: 4 },
    cloudSaving: { context: 8, files: 5 },
    cloudMigrating: { context: 8, files: 5 },
    pause: { context: 8, files: 5 },
  }[phase];

  const isIdle = phase === "idle";
  const isTyping = phase === "typing";
  const isThinking = phase === "thinking";
  const isTool1 = phase === "toolCall1";
  const isPlanning = phase === "planning";
  const isTool2 = phase === "toolCall2";
  const isQuestions = phase === "questions";
  const isQNav1 = phase === "questionsNav1";
  const isQNav2 = phase === "questionsNav2";
  const isSelection = phase === "selection";
  const isAnalyzing = phase === "analyzing";
  const isInitializing = phase === "initializing";
  const isSubagents = phase === "subagents";
  const isCloudTyping = phase === "cloudTyping";
  const isCloudSaving = phase === "cloudSaving";
  const isCloudMigrating = phase === "cloudMigrating";
  const isPause = phase === "pause";

  const isCloudPhase =
    isCloudTyping || isCloudSaving || isCloudMigrating || isPause;
  const pastTyping = phaseIdx > CLI_PHASES.indexOf("typing");
  const pastThinking = phaseIdx > CLI_PHASES.indexOf("thinking");
  const pastTool1 = phaseIdx > CLI_PHASES.indexOf("toolCall1");
  const pastPlanning = phaseIdx > CLI_PHASES.indexOf("planning");
  const pastTool2 = phaseIdx > CLI_PHASES.indexOf("toolCall2");
  const pastQuestions = phaseIdx > CLI_PHASES.indexOf("questions");
  const pastSelection = phaseIdx > CLI_PHASES.indexOf("selection");
  const pastAnalyzing = phaseIdx > CLI_PHASES.indexOf("analyzing");
  const pastInitializing = phaseIdx > CLI_PHASES.indexOf("initializing");
  const pastCloudTyping = phaseIdx > CLI_PHASES.indexOf("cloudTyping");

  const inQuestionNav = isQuestions || isQNav1 || isQNav2;
  const activeQuestionCursor = isQuestions ? 0 : isQNav1 ? 1 : 0;

  const composerDisplay = isIdle
    ? { prefix: "→", text: "Plan, search, build anything", dim: true }
    : isTyping
    ? { prefix: null, text: typedPrompt, dim: false }
    : isCloudTyping
    ? { prefix: "&", text: typedCloud, dim: false }
    : pastCloudTyping
    ? { prefix: "→", text: "Ask, plan, build anything", dim: true }
    : {
        prefix: "→",
        text: "Add a follow-up",
        dim: true,
        right: "esc to stop",
      };

  return (
    <div className="font-berkeley-mono flex h-full w-full flex-col overflow-hidden bg-theme-bg-muted text-[12px] text-theme-text-sec">
      <div className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-hidden justify-end">
        <div className="space-y-2.5">
          <div className="space-y-0.5 pb-1">
            <div>
              <span className="text-theme-text-ter">&gt; </span>
              <span className="text-theme-text-sec">agent</span>
            </div>
            <div className="text-theme-text-ter">Cursor Agent</div>
            <div className="text-theme-text-ter opacity-60">
              ~/anysphere/research · main
            </div>
          </div>
          {pastTyping && (
            <div className="border border-theme-border-02 px-3 py-2 text-theme-text">
              {CLI_PROMPT}
            </div>
          )}
          <div className="space-y-2">
            {(isThinking || pastThinking) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isThinking} syncTick={tick} />
                <span
                  className={
                    isThinking ? "text-theme-text" : "text-theme-text-sec"
                  }
                >
                  {isThinking ? "Thinking" : "Thought"}
                </span>
                {!isThinking && (
                  <span className="text-theme-text-ter opacity-60">3s</span>
                )}
              </div>
            )}
            {(isTool1 || pastTool1) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isTool1} syncTick={tick} />
                <span
                  className={isTool1 ? "text-theme-text" : "text-theme-text-sec"}
                >
                  {isTool1 ? "Reading" : "Read"}{" "}
                  <span className="text-theme-text-ter">
                    3 files, 1 search
                  </span>
                </span>
                {!isTool1 && (
                  <span className="text-theme-text-ter opacity-60">1s</span>
                )}
              </div>
            )}
            {(isPlanning || pastPlanning) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isPlanning} syncTick={tick} />
                <span
                  className={
                    isPlanning ? "text-theme-text" : "text-theme-text-sec"
                  }
                >
                  {isPlanning ? "Planning" : "Planned"}
                </span>
                {!isPlanning && (
                  <span className="text-theme-text-ter opacity-60">2s</span>
                )}
              </div>
            )}
            {(isTool2 || pastTool2) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isTool2} syncTick={tick} />
                <span
                  className={isTool2 ? "text-theme-text" : "text-theme-text-sec"}
                >
                  {isTool2 ? "Reading" : "Read"}{" "}
                  <span className="text-theme-text-ter">
                    2 files, 1 directory
                  </span>
                </span>
                {!isTool2 && (
                  <span className="text-theme-text-ter opacity-60">1s</span>
                )}
              </div>
            )}
            {(inQuestionNav || pastQuestions) && (
              <div className="border border-theme-border-02 p-2.5 space-y-1.5">
                <div className="text-theme-text-sec">Question</div>
                <div className="text-theme-text">
                  What data should the mission control display?
                </div>
                <div className="space-y-0.5">
                  {CLI_QUESTIONS.map((qLabel, idx) => {
                    const isChecked = (isSelection || pastSelection) && idx === 0;
                    const isCursor = inQuestionNav && activeQuestionCursor === idx;
                    return (
                      <div
                        key={qLabel}
                        className="flex items-center transition-colors duration-150"
                        style={{
                          color:
                            isCursor || isChecked
                              ? "var(--color-theme-text)"
                              : "var(--color-theme-text-ter)",
                        }}
                      >
                        <span className="w-4 text-theme-text">
                          {isCursor ? ">" : ""}
                        </span>
                        <span>
                          {isChecked ? "[x]" : "[ ]"} {qLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(isAnalyzing || pastAnalyzing) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isAnalyzing} syncTick={tick} />
                <span
                  className={
                    isAnalyzing ? "text-theme-text" : "text-theme-text-sec"
                  }
                >
                  {isAnalyzing ? "Analyzing" : "Analyzed"} scope
                </span>
                {!isAnalyzing && (
                  <span className="text-theme-text-ter opacity-60">2s</span>
                )}
              </div>
            )}
            {(isInitializing || pastInitializing) && (
              <div className="flex items-start gap-2">
                <HexPulse done={!isInitializing} syncTick={tick} />
                <span
                  className={
                    isInitializing ? "text-theme-text" : "text-theme-text-sec"
                  }
                >
                  {isInitializing ? "Spawning" : "Started"} 3 agents
                </span>
              </div>
            )}
            {pastInitializing && (
              <div className="space-y-2 pl-4">
                {CLI_SUBAGENTS.map((sub, idx) => {
                  if (isSubagents && idx >= visibleSubagents) return null;
                  const statusLabel =
                    isCloudMigrating || isPause
                      ? "Moving to cloud"
                      : isCloudSaving
                      ? "Saving state"
                      : isSubagents && subagentStarted[idx] === 0
                      ? "Planning"
                      : sub.task;
                  return (
                    <div key={sub.name} className="flex items-start gap-2">
                      <HexPulse
                        syncTick={tick}
                        color={
                          isCloudSaving || isCloudMigrating || isPause
                            ? "purple"
                            : "green"
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-theme-text">{sub.title}</span>
                        <span className="text-theme-text-sec">
                          {" · "}
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-theme-bg-muted px-4 pb-4 pt-2 space-y-2">
        <div
          className="border px-3 py-2 transition-colors duration-200"
          style={{
            borderColor: isCloudTyping
              ? "#a78bfa"
              : isTyping
              ? "#4ade80"
              : "var(--color-theme-border-02)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {composerDisplay.prefix && (
                <span
                  style={{
                    color: isCloudPhase
                      ? "#a78bfa"
                      : "var(--color-theme-text-ter)",
                  }}
                >
                  {composerDisplay.prefix}
                </span>
              )}
              <span
                className={
                  composerDisplay.dim
                    ? "text-theme-text-ter"
                    : "text-theme-text"
                }
              >
                {composerDisplay.text}
              </span>
              {(isTyping || isCloudTyping) && (
                <span className="w-[2px] h-[13px] bg-theme-text animate-pulse" />
              )}
            </div>
            {"right" in composerDisplay && composerDisplay.right && (
              <span className="text-theme-text-ter">
                {composerDisplay.right}
              </span>
            )}
          </div>
        </div>
        {!isIdle && (
          <div
            className="flex items-center gap-1.5"
            style={{ color: isCloudPhase ? "#a78bfa" : "#4ade80" }}
          >
            <span>◉</span>
            <span>
              {isCloudPhase
                ? "Move to cloud agent"
                : "Plan (shift+tab to cycle)"}
            </span>
          </div>
        )}
        <div className="text-theme-text-ter flex items-center gap-1">
          <span className="text-theme-text-sec">
            GPT-5.6 Sol Extra High Fast
          </span>
          {!isIdle && (
            <>
              <span className="opacity-50">·</span>
              <span>{metrics.context}%</span>
              {metrics.files > 0 && (
                <>
                  <span className="opacity-50">·</span>
                  <span>
                    {metrics.files}{" "}
                    {metrics.files === 1 ? "file" : "files"} edited
                  </span>
                </>
              )}
            </>
          )}
        </div>
        <div className="text-theme-text-ter">
          <span className="text-theme-text-sec">/</span> commands{" "}
          <span className="opacity-50">·</span>{" "}
          <span className="text-theme-text-sec">@</span> files{" "}
          <span className="opacity-50">·</span>{" "}
          <span className="text-theme-text-sec">!</span> shell
        </div>
      </div>
    </div>
  );
}

function SlackWindowContent() {
  return (
    <div
      className="slack-ui-demo flex flex-col overflow-hidden bg-theme-card-hex rounded-xl bw4eJa_className h-full"
      style={
        {
          height: "100%",
          "--color-theme-accent": "#34785c",
          "--color-slack-link": "#2d629e",
          fontFamily: "'Lato', 'Lato Fallback', sans-serif",
        } as React.CSSProperties
      }
    >
      <div className="border-theme-border-02 bg-theme-card-hex type-slack-base flex items-center justify-between border-b px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 rounded transition-colors hover:bg-theme-bg-hover px-0 py-1"
            aria-label="Channel info for feature-realtime-sync"
          >
            <div className="min-w-0 flex-1 gap-1 text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-theme-text-pri type-slack-lg-semibold truncate">
                  #feature-realtime-sync
                </h2>
              </div>
              <div className="text-theme-text-sec type-slack-sm flex items-center gap-2">
                <span className="flex-shrink-0">8 members</span>
              </div>
            </div>
          </button>
        </div>
        <div className="flex items-center">
          <div className="border-theme-border-02 type-product-base flex items-center rounded-md border px-1 py-1 -gap-0.5">
            {[
              "/marketing-static/users/swhitmore.png",
              "/marketing-static/users/eric.jpeg",
              "/marketing-static/users/rikki.jpg",
              "/marketing-static/users/ryo.png",
            ].map((src, i) => (
              <img
                key={src}
                alt={`member-${i + 1}`}
                loading="lazy"
                width={24}
                height={24}
                className="border-theme-card-hex -ml-2 rounded-full border object-cover first:ml-0 h-6 w-6"
                src={src}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-theme-card-hex flex flex-col justify-center overflow-hidden">
        <div className="pb-2">
          {/* Message 1: swhitmore */}
          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-4 pt-2 pb-1">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 w-8 mt-1">
                <img
                  alt="swhitmore avatar"
                  loading="lazy"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded object-cover"
                  src="/marketing-static/users/swhitmore.png"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-theme-text type-slack-base flex items-center gap-1.5">
                  <span className="text-theme-text type-slack-base-semibold">
                    swhitmore
                  </span>
                  <span className="text-theme-text-tertiary type-slack-sm">
                    5m
                  </span>
                </div>
                <div
                  className="type-slack-base text-theme-text"
                  style={{ fontSize: "14px" }}
                >
                  i wanna be able to go to cursor.com/changelog#1.0 to see 1.0
                  changelog
                </div>
              </div>
            </div>
          </div>

          {/* Message 2: eric */}
          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-4 pt-2 pb-1">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 w-8 mt-1">
                <img
                  alt="eric avatar"
                  loading="lazy"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded object-cover"
                  src="/marketing-static/users/eric.jpeg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-theme-text type-slack-base flex items-center gap-1.5">
                  <span className="text-theme-text type-slack-base-semibold">
                    eric
                  </span>
                  <span className="text-theme-text-tertiary type-slack-sm">
                    4m
                  </span>
                </div>
                <div
                  className="type-slack-base text-theme-text"
                  style={{ fontSize: "14px" }}
                >
                  checks out
                </div>
              </div>
            </div>
          </div>

          {/* Message 3: eric follow-up */}
          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-4 pt-0.5 pb-1">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 w-8 mt-0" />
              <div className="min-w-0 flex-1">
                <div
                  className="type-slack-base text-theme-text"
                  style={{ fontSize: "14px" }}
                >
                  <span className="font-semibold">@cursor</span> can you take a
                  stab?
                </div>
              </div>
            </div>
          </div>

          {/* Message 4: Cursor APP */}
          <div className="group type-slack-base hover:bg-theme-bg-hover relative transition-colors px-4 pt-2 pb-1">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 w-8 mt-1">
                <img
                  alt="Cursor avatar"
                  loading="lazy"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded object-cover"
                  src="/marketing-static/icon-192x192.png"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-theme-text type-slack-base flex items-center gap-1.5">
                  <span className="text-theme-text type-slack-base-semibold">
                    Cursor
                  </span>
                  <span
                    className="text-theme-text-sec bg-theme-border-02 rounded-sm px-1 py-0.5 font-semibold leading-tight"
                    style={{ fontSize: "10px" }}
                  >
                    APP
                  </span>
                  <span className="text-theme-text-tertiary type-slack-sm">
                    2m
                  </span>
                </div>
                <div>
                  <div
                    className="type-slack-base text-theme-text"
                    style={{ fontSize: "14px" }}
                  >
                    I added direct linking for changelog entries and updated the
                    Node.js version constraints across the project for better
                    maintainability.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="type-slack-sm-semibold rounded px-2.5 py-1.5 transition-colors border bg-theme-accent border-theme-accent text-white">
                      View PR
                    </span>
                    <span className="type-slack-sm-semibold rounded px-2.5 py-1.5 transition-colors border bg-theme-bg-01 border-theme-border-02 text-theme-text-pri">
                      Open in Cursor
                    </span>
                    <span className="type-slack-sm-semibold rounded px-2.5 py-1.5 transition-colors border bg-theme-bg-01 border-theme-border-02 text-theme-text-pri">
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
  );
}

/* ========================================================================== */
/* Main FeaturesSection Component                                             */
/* ========================================================================== */

export function FeaturesSection() {
  const [copiedCommand, setCopiedCommand] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard
      ?.writeText("curl https://cursor.com/install -fsS | bash")
      .catch(() => {});
    setCopiedCommand(true);
    window.setTimeout(() => setCopiedCommand(false), 1800);
  };

  const block1Windows = useMemo(
    () => [
      {
        id: "agent-react-hooks",
        title: "Cursor",
        xPercent: 59.42,
        yPercent: 50,
        widthPx: 920,
        heightPx: 600,
        zIndex: 10,
        ctaHref: "/download",
        ctaLabel: "Get Cursor",
        content: (
          <CursorIdeWindow
            initialScenario="productPlanning"
            showAgentsSidebar={false}
          />
        ),
      },
    ],
    []
  );

  const block3Windows = useMemo(
    () => [
      {
        id: "slack",
        title: "Slack",
        xPercent: 42,
        yPercent: 30,
        widthPx: 540,
        heightPx: 340,
        zIndex: 10,
        ctaHref: "/docs/integrations/slack",
        ctaLabel: "Get Cursor for Slack",
        content: <SlackWindowContent />,
      },
      {
        id: "cursor-agent-cli-step",
        title: "cursor-agent",
        xPercent: 60,
        yPercent: 66,
        widthPx: 580,
        heightPx: 420,
        zIndex: 15,
        ctaHref: "/download",
        ctaLabel: "Get CLI",
        content: <LoopingCliAgentWindow />,
      },
    ],
    []
  );

  const block4Windows = useMemo(
    () => [
      {
        id: "grok-bot",
        title: "Grok Bot",
        xPercent: 50.96,
        yPercent: 50,
        widthPx: 780,
        heightPx: 500,
        zIndex: 10,
        ctaHref: "/download/bot?download=1",
        ctaLabel: "Download",
        content: <GrokBotWindow />,
      },
    ],
    []
  );

  return (
    <section className="section section--flush-x">
      {/* Block 1: Agents turn ideas into code */}
      <section className="section bg-theme-bg text-theme-text section--flush-y">
        <div className="container mb-v4">
          <div className="grid grid-rows-[auto_1fr]">
            <a
              className="card card--large card--feature grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid"
              href="/product"
            >
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-9 lg:pl-g0.25 lg:pr-g3">
                <div className="w-full max-w-prose lg:justify-self-start">
                  <div className="type-base">
                    <h3 className="type-base md:type-md text-pretty">
                      Agents turn ideas into code
                    </h3>
                    <div className="type-base md:type-md text-theme-text-sec text-pretty">
                      Accelerate development by handing off tasks to Cursor,
                      while you focus on making decisions.
                    </div>
                  </div>
                  <div className="mt-v8/12">
                    <span className="btn-tertiary">
                      Learn about agentic development →
                    </span>
                  </div>
                </div>
              </div>
              <div className="max-lg:mt-g1.75 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-9 lg:col-end-25" />
            </a>
            <div className="grid-cursor p-g1.75 col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-2 lg:items-center lg:col-start-1 lg:col-end-9 lg:pl-g0.25 lg:pr-g3" />
              <div className="max-lg:pt-v1 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-2 lg:row-end-3 lg:items-center lg:col-start-9 lg:col-end-25">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1"
                  style={
                    {
                      "--layered-media-bg-light": "#D9D5CF",
                      "--layered-media-bg-dark": "#4A443B",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="media-light absolute inset-0 z-0"
                    style={{ backgroundColor: "rgb(217, 213, 207)" }}
                  />
                  <div
                    className="media-dark absolute inset-0 z-0"
                    style={{ backgroundColor: "rgb(74, 68, 59)" }}
                  />
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <DemoWindowStage
                      windows={block1Windows}
                      height={680}
                      minHeight={680}
                      innerPaddingPx={32}
                      scopeId="_r_1_"
                      srDescription="This element contains an interactive demo for sighted users. It's a demonstration of Cursor's IDE showing AI-powered coding assistance features."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Works autonomously, runs in parallel */}
      <section className="section bg-theme-bg text-theme-text section--flush-y">
        <div className="container mb-v4">
          <div className="grid grid-rows-[auto_1fr]">
            <div className="card card--large grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-17 lg:col-end-25 lg:pr-g0.25 lg:pl-g3">
                <div className="w-full max-w-prose lg:justify-self-end">
                  <div className="type-base">
                    <h3 className="type-base md:type-md text-pretty">
                      Works autonomously, runs in parallel
                    </h3>
                    <div className="type-base md:type-md text-theme-text-sec text-pretty">
                      Agents use their own computers to build, test, and demo
                      features end to end for you to review.
                    </div>
                  </div>
                  <div className="mt-v1">
                    <div className="flex justify-start gap-x-g1 items-center">
                      <a href="/docs/cloud-agent" className="btn-tertiary">
                        Learn about cloud agents →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-lg:mt-g1.75 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-17" />
            </div>
            <div className="grid-cursor p-g1.75 col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-2 lg:items-center lg:col-start-17 lg:col-end-25 lg:pr-g0.25 lg:pl-g3" />
              <div className="max-lg:pt-v1 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-2 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-17">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1"
                  style={
                    {
                      "--layered-media-bg-light": "#B6B9BE",
                      "--layered-media-bg-dark": "#3C3935",
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
                    <CloudAgentBrowserShowcase />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 3: In every tool, at every step */}
      <section className="section bg-theme-bg text-theme-text section--flush-y">
        <div className="container mb-v4">
          <div className="grid grid-rows-[auto_1fr]">
            <div className="card card--large grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-9 lg:pl-g0.25 lg:pr-g3">
                <div className="w-full max-w-prose lg:justify-self-start">
                  <div className="type-base">
                    <h3 className="type-base md:type-md text-pretty">
                      In every tool, at every step
                    </h3>
                    <div className="type-base md:type-md text-theme-text-sec text-pretty">
                      Cursor runs in your terminal, collaborates in Slack, and
                      reviews PRs in GitHub.
                    </div>
                  </div>
                  <div className="mt-v1">
                    <div className="flex justify-start gap-x-g1 items-center">
                      <div
                        className="inline-grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center rounded-sm transition-all duration-200 bg-theme-card-02-hex hover:bg-theme-card-03-hex"
                        tabIndex={0}
                        role="button"
                        aria-label="Copy command"
                        onClick={handleCopyCommand}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCopyCommand();
                          }
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          gap: "6px",
                          paddingInline: "10px",
                          paddingBlock: "9px",
                        }}
                      >
                        <code
                          className="text-theme-text type-product-base-mono min-w-0 overflow-x-auto text-sm whitespace-nowrap"
                          style={{
                            fontSize: "13px",
                            scrollbarWidth: "none",
                            maskImage:
                              "linear-gradient(to right, black 0%, black 86%, transparent 100%)",
                          }}
                        >
                          <span className="text-theme-product-syntax-function">
                            curl
                          </span>
                          <span> </span>
                          <span className="text-theme-product-syntax-string">
                            https://cursor.com/install
                          </span>
                          <span>
                            {" "}
                            <span className="text-theme-product-syntax-keyword">
                              -fsS
                            </span>
                          </span>
                          <span className="text-theme-text-ter"> | </span>
                          <span className="text-theme-product-syntax-function">
                            bash
                          </span>
                        </code>
                        <div className="btn btn--sm pointer-events-none transition-all duration-150 opacity-100">
                          {copiedCommand ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-copy"
                              aria-hidden="true"
                            >
                              <rect
                                width="14"
                                height="14"
                                x="8"
                                y="8"
                                rx="2"
                                ry="2"
                              />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-lg:mt-g1.75 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-9 lg:col-end-25" />
            </div>
            <div className="grid-cursor p-g1.75 col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-2 lg:items-center lg:col-start-1 lg:col-end-9 lg:pl-g0.25 lg:pr-g3" />
              <div className="max-lg:pt-v1 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-2 lg:row-end-3 lg:items-center lg:col-start-9 lg:col-end-25">
                <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
                  <div className="relative z-1 col-span-full row-span-full overflow-hidden">
                    <img
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover scale-[1.1] transform wallpaper-brightness-dark"
                      sizes="100vw"
                      src="/sites/cursor/blob/assets/misc/asset-85923e7fafe00c9c0d1f.jpg"
                    />
                  </div>
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <DemoWindowStage
                      windows={block3Windows}
                      height="min(780px, 70vh)"
                      minHeight={650}
                      innerPaddingPx={32}
                      disableResizing
                      backgroundImageSrc="/sites/cursor/blob/assets/misc/asset-85923e7fafe00c9c0d1f.jpg"
                      scopeId="_r_6_"
                      srDescription="This element contains an interactive demo for sighted users showing multiple Cursor interfaces: the CLI with command-line assistance, Slack integration for team communication."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Hand work to AI teammates */}
      <section className="section bg-theme-bg text-theme-text section--flush-y">
        <div className="container">
          <div className="grid grid-rows-[auto_1fr]">
            <div className="card card--large grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-17 lg:col-end-25 lg:pr-g0.25 lg:pl-g3">
                <div className="w-full max-w-prose lg:justify-self-end">
                  <div className="type-base">
                    <h3 className="type-base md:type-md text-pretty">
                      Hand work to AI teammates
                    </h3>
                    <div className="type-base md:type-md text-theme-text-sec text-pretty">
                      Bots can sign in to your tools, use them just like you do,
                      and come back with finished work.
                    </div>
                  </div>
                  <div className="mt-v1">
                    <div className="flex justify-start gap-x-g1 items-center">
                      <a
                        className="btn-tertiary"
                        href="/download/bot?download=1"
                      >
                        Download Grok Bot →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-lg:mt-g1.75 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-17" />
            </div>
            <div className="grid-cursor p-g1.75 col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
              <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-2 lg:items-center lg:col-start-17 lg:col-end-25 lg:pr-g0.25 lg:pl-g3" />
              <div className="max-lg:pt-v1 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-2 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-17">
                <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
                  <div className="relative z-1 col-span-full row-span-full overflow-hidden">
                    <img
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover scale-[1.1] transform wallpaper-brightness-dark"
                      sizes="100vw"
                      src="/sites/cursor/blob/assets/internal-brand/internal-brand-023-3291bb4c.jpg"
                    />
                  </div>
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <DemoWindowStage
                      windows={block4Windows}
                      height={650}
                      minHeight={650}
                      innerPaddingPx={32}
                      disableResizing
                      allowMobileInteractions
                      backgroundImageSrc="/sites/cursor/blob/assets/internal-brand/internal-brand-023-3291bb4c.jpg"
                      backgroundImageAlt="Abstract waves background"
                      scopeId="_r_f_"
                      srDescription="Interactive demo showing Grok Bot. The interface is displayed over a scenic painted landscape wallpaper, giving the demo an artistic backdrop."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
