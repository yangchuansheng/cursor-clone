"use client";

import React, { useEffect, useRef, useState } from "react";
import { CursorHeader } from "./CursorHeader";
import { CursorFooter } from "./CursorFooter";

const INSTALL_COMMAND = "curl https://cursor.com/install -fsS | bash";

const CLI_MODELS = [
  "/model Auto",
  "/model Grok 4.7",
  "/model Opus 5.5",
  "/model GPT-5.6 Sol High Fast",
  "/model Fable 5.1 Max",
  "/model Gemini 3.1 Pro",
  "/model Composer 2.5",
] as const;

const AGENT_MODES = [
  "Plan (shift+tab to cycle)",
  "Agent (shift+tab to cycle)",
  "Ask (shift+tab to cycle)",
] as const;

const ASCII_RAMP = ".:+=CURSOR#$&";

function CopyInstallCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(INSTALL_COMMAND);
    }
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div
      className="inline-grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center rounded-sm transition-all duration-200 bg-theme-card-02-hex hover:bg-theme-card-03-hex "
      tabIndex={0}
      role="button"
      aria-label="Copy command"
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
      style={{
        width: "fit-content",
        maxWidth: "100%",
        gap: "12px",
        paddingInline: "16px",
        paddingBlock: "12px",
      }}
    >
      <code
        className="text-theme-text type-product-base-mono min-w-0 overflow-x-auto text-sm whitespace-nowrap"
        style={{
          fontSize: "13px",
          scrollbarWidth: "none",
          maskImage: "linear-gradient(to right, black 0%, black 86%, transparent 100%)",
        }}
      >
        <span className="text-theme-product-syntax-function">curl</span>
        <span> </span>
        <span className="text-theme-product-syntax-string">https://cursor.com/install</span>
        <span>
          {" "}
          <span className="text-theme-product-syntax-keyword">-fsS</span>
        </span>
        <span className="text-theme-text-ter"> | </span>
        <span className="text-theme-product-syntax-function">bash</span>
      </code>
      <div className="btn btn--sm pointer-events-none transition-all duration-150 opacity-100">
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-copy"
            aria-hidden="true"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </div>
    </div>
  );
}

function AsciiCubeCanvas() {
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const video = videoRef.current;
    if (!gridCanvas || !hiddenCanvas) return;

    const cols = Math.max(20, Math.min(100, Math.floor(216 / 7)));
    const rows = Math.max(15, Math.min(80, Math.floor(216 / 8.0829)));
    hiddenCanvas.width = cols;
    hiddenCanvas.height = rows;

    const ctx = gridCanvas.getContext("2d");
    const hiddenCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !hiddenCtx) return;

    if (video) {
      video.muted = true;
      void video.play().catch(() => {
        // Fallback animation renders when autoplay or source is unavailable.
      });
    }

    let rafId = 0;
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const dpr = 2;
      const width = 216 * dpr;
      const height = 216 * dpr;
      if (gridCanvas.width !== width || gridCanvas.height !== height) {
        gridCanvas.width = width;
        gridCanvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.classList.contains("light");
      ctx.fillStyle = isLight ? "#282720" : "#e5e5e5";
      ctx.font = `600 ${11 * dpr}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "top";

      const cellW = width / cols;
      const cellH = height / rows;

      const hasVideoFrame =
        video !== null &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0;

      if (hasVideoFrame && video) {
        hiddenCtx.clearRect(0, 0, cols, rows);
        hiddenCtx.drawImage(video, 0, 0, cols, rows);
        const imgData = hiddenCtx.getImageData(0, 0, cols, rows).data;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const alpha = imgData[idx + 3] / 255;
            const lum =
              ((0.299 * imgData[idx] +
                0.587 * imgData[idx + 1] +
                0.114 * imgData[idx + 2]) /
                255) *
              alpha;
            if (lum > 0.08) {
              const charIdx = Math.min(
                ASCII_RAMP.length - 1,
                Math.floor(lum * ASCII_RAMP.length)
              );
              ctx.fillText(ASCII_RAMP[charIdx], c * cellW, r * cellH);
            }
          }
        }
      } else {
        // Procedural isometric rotating cube + wave fallback so canvas is never blank.
        const t = (now - startTime) * 0.0018;
        const cosA = Math.cos(t);
        const sinA = Math.sin(t);
        const cosB = Math.cos(t * 0.7);
        const sinB = Math.sin(t * 0.7);

        for (let r = 0; r < rows; r++) {
          const ny = (r / (rows - 1)) * 2 - 1;
          for (let c = 0; c < cols; c++) {
            const nx = (c / (cols - 1)) * 2 - 1;
            const dist = Math.hypot(nx, ny);
            if (dist > 0.88) continue;

            const z = Math.sqrt(Math.max(0, 0.78 - nx * nx - ny * ny));
            const rx = nx * cosA + z * sinA;
            const rz = -nx * sinA + z * cosA;
            const ry = ny * cosB - rz * sinB;
            const rzz = ny * sinB + rz * cosB;

            const maxAxis = Math.max(Math.abs(rx), Math.abs(ry), Math.abs(rzz));
            if (maxAxis < 0.68) {
              const edgeFactor =
                Math.abs(Math.abs(rx) - Math.abs(ry)) < 0.12 ||
                Math.abs(Math.abs(ry) - Math.abs(rzz)) < 0.12
                  ? 0.92
                  : 0.45 + 0.45 * (0.5 + 0.5 * Math.sin(rx * 4 + ry * 3 + t * 2));
              const charIdx = Math.min(
                ASCII_RAMP.length - 1,
                Math.max(0, Math.floor(edgeFactor * ASCII_RAMP.length))
              );
              ctx.fillText(ASCII_RAMP[charIdx], c * cellW, r * cellH);
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      aria-label="ASCII animation"
      className="page_gridBox__1Nzpe "
      style={{ width: "216px", height: "216px" }}
    >
      <canvas
        ref={gridCanvasRef}
        aria-label="ASCII animation"
        className="page_gridCanvas__GK3dR"
        width={432}
        height={432}
        style={{ width: "216px", height: "216px" }}
      />
      <canvas
        ref={hiddenCanvasRef}
        aria-hidden="true"
        className="page_hiddenCanvas__5Mo4j"
        width={30}
        height={26}
      />
      <div aria-hidden="true" className="page_hiddenCanvas__5Mo4j">
        <video
          ref={videoRef}
          preload="metadata"
          playsInline
          loop
          muted
          crossOrigin="anonymous"
          disableRemotePlayback
          src="/marketing-static/loaders/cursor-loading-physical-padded.webm"
        />
      </div>
    </div>
  );
}

export function CursorCliPage() {
  // Section 1: Hero Agent CLI state machine + draggable window
  const [cliStep, setCliStep] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCliStep((prev) => (prev + 1) % 4);
    }, 3400);
    return () => window.clearInterval(interval);
  }, []);

  // Section 2 Card 0: /model selector auto-cycling
  const [selectedModelIdx, setSelectedModelIdx] = useState(3);
  const [modelHovered, setModelHovered] = useState(false);

  useEffect(() => {
    if (modelHovered) return;
    const interval = window.setInterval(() => {
      setSelectedModelIdx((prev) => (prev + 1) % CLI_MODELS.length);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [modelHovered]);

  // Section 2 Card 2: GitHub Actions workflow state machine
  // Starts at phase 1 so initial state matches cli-sec2.html (step 0 done, step 1 spinning, step 2 pending)
  const [workflowPhase, setWorkflowPhase] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWorkflowPhase((prev) => (prev + 1) % 5);
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  const step0Status = (
    workflowPhase === 0 ? "active" : "done"
  ) as "pending" | "active" | "done";
  const step1Status: "done" | "active" | "pending" =
    workflowPhase === 0 ? "pending" : workflowPhase <= 2 ? "active" : "done";
  const step2Status: "done" | "active" | "pending" =
    workflowPhase <= 2 ? "pending" : workflowPhase === 3 ? "active" : "done";

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragOffset.x,
      origY: dragOffset.y,
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = Math.max(-120, Math.min(120, dragStartRef.current.origX + (e.clientX - dragStartRef.current.startX)));
    const dy = Math.max(-80, Math.min(80, dragStartRef.current.origY + (e.clientY - dragStartRef.current.startY)));
    setDragOffset({ x: dx, y: dy });
  };

  const handleHeaderPointerUp = () => {
    dragStartRef.current = null;
  };

  return (
    <>
      <CursorHeader />
      <main id="main" lang="en-US">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Cursor CLI"}',
          }}
        />

        {/* Section 0: Hero Heading */}
        <section className="section bg-theme-bg text-theme-text section--flush-bottom">
          <div className="container">
            <div className="text-left  max-w-prose-medium-wide">
              <small className="type-base text-theme-text-sec mb-v2/12 block">CLI</small>
              <h1 className="type-lg text-balance ">Ship code with agents</h1>
              <div className="flex justify-start">
                <div className="type-lg text-theme-text-sec stack text-balance">
                  Right from your terminal.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Same commands, any environment + Interactive Agent CLI Demo */}
        <section className="section bg-theme-bg text-theme-text">
          <div className="container mb-g1">
            <div className="grid grid-rows-[auto_1fr]">
              <div className="card card--large grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
                <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-10 lg:pl-g0.25 lg:pr-g2">
                  <div className="w-full max-w-prose lg:justify-self-start">
                    <div className="type-base">
                      <h3 className="type-base md:type-md text-pretty">
                        Same commands, any environment.
                      </h3>
                      <div className="type-base md:type-md text-theme-text-sec text-pretty">
                        Plug into your setup anywhere.
                      </div>
                    </div>
                    <div className="mt-v1">
                      <div className="flex justify-start gap-x-g1 items-center">
                        <CopyInstallCommand />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="max-lg:mt-g1.75 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-10 lg:col-end-25" />
              </div>

              <div className="grid-cursor p-g1.75 col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
                <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-2 lg:items-center lg:col-start-1 lg:col-end-10 lg:pl-g0.25 lg:pr-g2" />
                <div className="max-lg:pt-v1 col-span-full row-start-2 row-end-3 grid cursor-default items-end lg:row-start-2 lg:row-end-3 lg:items-center lg:col-start-10 lg:col-end-25">
                  <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-[image:var(--color-theme-card-03)]">
                    <div className="relative z-1 col-span-full row-span-full overflow-hidden">
                      <img
                        alt=""
                        loading="lazy"
                        decoding="async"
                        data-nimg="fill"
                        className="absolute inset-0 object-cover scale-[1.1] transform wallpaper-brightness-dark"
                        sizes="100vw"
                        src="/sites/cursor/blob/assets/misc/asset-0ec1f3ba625f482c9dc3.jpg"
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
                      <div
                        className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                        data-demo-pad-scope="_r_0_"
                        style={
                          {
                            height: "min(780px, 70vh)",
                            minHeight: "650px",
                            "--demo-pad": "32px",
                          } as React.CSSProperties
                        }
                      >
                        <div className="absolute inset-0 z-0 overflow-hidden">
                          <img
                            alt="Sunlit woodland background"
                            loading="lazy"
                            decoding="async"
                            data-nimg="fill"
                            className="absolute inset-0 object-cover"
                            sizes="100vw"
                            src="/sites/cursor/blob/assets/misc/asset-85923e7fafe00c9c0d1f.jpg"
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
                            Interactive demo showing agent. The interface is displayed over a scenic painted landscape wallpaper, giving the demo an artistic backdrop.
                          </div>
                          <div
                            aria-hidden="true"
                            id="demo-window-cursor-agent-cli"
                            className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
                            style={{
                              left: "clamp(calc(var(--demo-pad) + 290px), 50%, calc(100% - var(--demo-pad) - 290px))",
                              top: "clamp(calc(var(--demo-pad) + 210px), 50%, calc(100% - var(--demo-pad) - 210px))",
                              width: "580px",
                              minWidth: "420px",
                              height: "420px",
                              maxHeight: "calc(100% - 2 * var(--demo-pad))",
                              minHeight: "260px",
                              transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))`,
                              transformOrigin: "center center",
                              zIndex: 20,
                              boxShadow:
                                "0 28px 70px rgba(0, 0, 0, 0.14), 0 14px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--color-theme-border-02)",
                              opacity: 1,
                            }}
                          >
                            <div
                              className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-grab active:cursor-grabbing"
                              onPointerDown={handleHeaderPointerDown}
                              onPointerMove={handleHeaderPointerMove}
                              onPointerUp={handleHeaderPointerUp}
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="inline-block h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: "var(--color-theme-fg-20)" }}
                                />
                                <span
                                  className="inline-block h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: "var(--color-theme-fg-20)" }}
                                />
                                <span
                                  className="inline-block h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: "var(--color-theme-fg-20)" }}
                                />
                              </div>
                              <div className="type-product-base pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 truncate text-center opacity-70">
                                agent
                              </div>
                              <div className="-mr-1 flex items-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                                      void navigator.clipboard.writeText(INSTALL_COMMAND);
                                    }
                                  }}
                                  className="transition-opacity duration-200 type-product-base rounded px-2 py-1 text-theme-text-sec hover:bg-theme-bg-hover cursor-pointer opacity-0 group-hover:opacity-100"
                                >
                                  Get CLI
                                </button>
                              </div>
                            </div>
                            <div
                              className="min-h-0 w-full flex-1 overflow-hidden"
                              data-demo-desktop-content="true"
                              onClick={() => setCliStep((prev) => (prev + 1) % 4)}
                            >
                              <div className="h-full min-h-0 w-full">
                                <div className="bg-theme-product-chrome text-theme-text h-full min-h-0 w-full overflow-hidden relative">
                                  <div className="flex w-full h-full">
                                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                      <div className="flex h-full min-h-0 flex-1 flex-col">
                                        <div className="flex min-h-0 min-w-0" style={{ height: "100%" }}>
                                          <div
                                            className="flex min-h-0 min-w-0 flex-col"
                                            style={{ width: "100%" }}
                                          >
                                            <div className="min-h-0 flex-1 bg-theme-product-editor ">
                                              <div className="h-full w-full">
                                                <div className="font-berkeley-mono flex h-full w-full flex-col overflow-hidden bg-theme-bg-muted text-[12px] text-theme-text-sec">
                                                  <div className="flex-1 flex flex-col px-4 pt-4 pb-2 overflow-hidden justify-end">
                                                    <div className="space-y-2.5">
                                                      <div className="space-y-0.5 pb-1">
                                                        <div>
                                                          <span className="text-theme-text-ter">&gt; </span>
                                                          <span className="text-theme-text-sec">agent</span>
                                                        </div>
                                                        <div className="text-theme-text-ter">
                                                          Cursor Agent
                                                        </div>
                                                        <div className="text-theme-text-ter opacity-60">
                                                          ~/anysphere/research · main
                                                        </div>
                                                      </div>
                                                      <div className="border border-theme-border-02 px-3 py-2 text-theme-text">
                                                        plan mission control interface
                                                      </div>
                                                      <div className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                          <span className="text-theme-text">⬢</span>
                                                          <span className="text-theme-text-sec">Thought</span>
                                                          <span className="text-theme-text-ter opacity-60">
                                                            3s
                                                          </span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                          <span className="text-theme-text">⬢</span>
                                                          <span className="text-theme-text-sec">
                                                            Read{" "}
                                                            <span className="text-theme-text-ter">
                                                              3 files, 1 search
                                                            </span>
                                                          </span>
                                                          <span className="text-theme-text-ter opacity-60">
                                                            1s
                                                          </span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                          <span className="text-theme-text">⬢</span>
                                                          <span className="text-theme-text-sec">Planned</span>
                                                          <span className="text-theme-text-ter opacity-60">
                                                            2s
                                                          </span>
                                                        </div>
                                                        {cliStep === 0 && (
                                                          <div className="flex items-start gap-2">
                                                            <span className="text-green-500">⬢</span>
                                                            <span className="text-theme-text">
                                                              Reading{" "}
                                                              <span className="text-theme-text-ter">
                                                                2 files, 1 directory
                                                              </span>
                                                            </span>
                                                          </div>
                                                        )}
                                                        {cliStep >= 1 && (
                                                          <div className="flex items-start gap-2">
                                                            <span className="text-theme-text">⬢</span>
                                                            <span className="text-theme-text-sec">
                                                              Read{" "}
                                                              <span className="text-theme-text-ter">
                                                                2 files, 1 directory
                                                              </span>
                                                            </span>
                                                            <span className="text-theme-text-ter opacity-60">
                                                              1s
                                                            </span>
                                                          </div>
                                                        )}
                                                        {cliStep === 1 && (
                                                          <div className="border-l border-theme-border-02 pl-3 space-y-1 text-theme-text">
                                                            <div className="text-theme-text-sec">
                                                              Clarifying questions:
                                                            </div>
                                                            <div className="text-theme-text-ter">
                                                              1. Telemetry transport?{" "}
                                                              <span className="text-theme-text">
                                                                WebSocket stream
                                                              </span>
                                                            </div>
                                                          </div>
                                                        )}
                                                        {cliStep >= 2 && (
                                                          <div className="flex items-start gap-2">
                                                            <span
                                                              className={
                                                                cliStep === 2
                                                                  ? "text-green-500"
                                                                  : "text-theme-text"
                                                              }
                                                            >
                                                              ⬢
                                                            </span>
                                                            <span className="text-theme-text">
                                                              Started{" "}
                                                              <span className="text-theme-text-ter">
                                                                3 agents
                                                              </span>
                                                            </span>
                                                            {cliStep >= 3 && (
                                                              <span className="text-theme-text-ter opacity-60">
                                                                4s
                                                              </span>
                                                            )}
                                                          </div>
                                                        )}
                                                        {cliStep === 3 && (
                                                          <div className="border border-theme-border-02 px-3 py-1.5 text-theme-text">
                                                            &amp; let&apos;s continue in the cloud
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex-shrink-0 bg-theme-bg-muted px-4 pb-4 pt-2 space-y-2">
                                                    <div
                                                      className="border px-3 py-2 transition-colors duration-200"
                                                      style={{
                                                        borderColor: "var(--color-theme-border-02)",
                                                      }}
                                                    >
                                                      <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                          <span
                                                            style={{
                                                              color: "var(--color-theme-text-ter)",
                                                            }}
                                                          >
                                                            →
                                                          </span>
                                                          <span className="text-theme-text-ter">
                                                            Add a follow-up
                                                          </span>
                                                        </div>
                                                        <span className="text-theme-text-ter">
                                                          esc to stop
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="flex items-center gap-1.5 cursor-pointer"
                                                      style={{ color: "rgb(74, 222, 128)" }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModeIndex(
                                                          (prev) => (prev + 1) % AGENT_MODES.length
                                                        );
                                                      }}
                                                    >
                                                      <span>◉</span>
                                                      <span>{AGENT_MODES[modeIndex]}</span>
                                                    </div>
                                                    <div className="text-theme-text-ter flex items-center gap-1">
                                                      <span className="text-theme-text-sec">
                                                        GPT-5.6 Sol Extra High Fast
                                                      </span>
                                                      <span className="opacity-50">·</span>
                                                      <span>5%</span>
                                                    </div>
                                                    <div className="text-theme-text-ter">
                                                      <span className="text-theme-text-sec">/</span>{" "}
                                                      commands <span className="opacity-50">·</span>{" "}
                                                      <span className="text-theme-text-sec">@</span>{" "}
                                                      files <span className="opacity-50">·</span>{" "}
                                                      <span className="text-theme-text-sec">!</span>{" "}
                                                      shell
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
            </div>
          </div>
        </section>

        {/* Section 2: 3-column Features Grid (#cli-features) */}
        <section className="section section--flush-y" id="cli-features">
          <section className="section bg-theme-bg text-theme-text section--flush">
            <div className="container my-v2">
              <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
                {/* Card 0: Always access the latest models */}
                <div className="undefined h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>Always access the latest models</h2>
                        <div className="text-theme-text-sec text-pretty">
                          Frontier models from Anthropic, OpenAI, Gemini, Cursor, and more, at your fingertips.
                        </div>
                      </div>
                    </div>
                    <figure className="pt-g1.75">
                      <div
                        className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-02-hex"
                        style={{ height: "378px" }}
                        onMouseEnter={() => setModelHovered(true)}
                        onMouseLeave={() => setModelHovered(false)}
                      >
                        <div className="z-20 col-span-full row-span-full h-full min-h-0">
                          <div className="flex h-full w-full items-end justify-center">
                            <div className="w-full max-w-sm">
                              <div className="flex aspect-square w-full items-center justify-center p-5">
                                <div
                                  className="text-theme-text flex w-full flex-col"
                                  style={{ fontSize: "13px" }}
                                >
                                  <div
                                    className=" overflow-y-hidden"
                                    style={{
                                      scrollbarGutter: "auto",
                                      paddingTop: "0px",
                                    }}
                                  >
                                    <div className="type-product-base-mono flex min-h-full flex-col justify-end">
                                      <div />
                                      <div className="text-theme-text">Cursor Agent</div>
                                      <div className="text-theme-text-sec mb-2">
                                        ~/cursor/cursor-web
                                      </div>
                                      <div className="text-theme-text mb-2" />
                                      <div className="space-y-2" />
                                      <div className="mt-3">
                                        <div className="border-theme-text flex items-center gap-2 border px-3 py-2">
                                          <span className="text-theme-text">→</span>
                                          <input
                                            placeholder="Add a follow-up"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                            disabled
                                            className="flex-1 bg-transparent outline-none text-theme-text placeholder:text-theme-text cursor-not-allowed"
                                            type="text"
                                            value="/model"
                                            name="follow-up"
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                      <div className="w-full">
                                        <div className="bg-theme-bg-muted text-theme-text min-h-[36px] px-1 pt-3">
                                          <div>
                                            {CLI_MODELS.map((model, idx) => {
                                              const isSelected = idx === selectedModelIdx;
                                              return isSelected ? (
                                                <div
                                                  key={model}
                                                  onClick={() => setSelectedModelIdx(idx)}
                                                  onMouseEnter={() => setSelectedModelIdx(idx)}
                                                  className="text-theme-text flex min-w-0 items-center gap-1 px-2 cursor-pointer"
                                                >
                                                  <span className="text-theme-text w-4 flex-shrink-0">
                                                    →
                                                  </span>
                                                  <span className="text-theme-text min-w-0 truncate font-bold">
                                                    {model}
                                                  </span>
                                                </div>
                                              ) : (
                                                <div
                                                  key={model}
                                                  onClick={() => setSelectedModelIdx(idx)}
                                                  onMouseEnter={() => setSelectedModelIdx(idx)}
                                                  className="text-theme-text-ter flex min-w-0 items-center gap-1 px-2 opacity-40 cursor-pointer"
                                                >
                                                  <span className="w-4 flex-shrink-0" />
                                                  <span className="min-w-0 truncate">{model}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div />
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

                {/* Card 1: Use in your preferred IDE */}
                <div className="undefined h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>Use in your preferred IDE</h2>
                        <div className="text-theme-text-sec text-pretty">
                          Wherever you code, Cursor CLI integrates with your existing workflow.
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
                            data-nimg="fill"
                            className="media-light absolute inset-0 object-cover scale-[1.1] transform wallpaper-brightness-dark"
                            sizes="100vw"
                            src="/sites/cursor/blob/assets/misc/asset-a5f3db0e256ba20f050d.png"
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
                            data-nimg="fill"
                            className="media-dark absolute inset-0 object-cover scale-[1.1] transform wallpaper-brightness-dark"
                            sizes="100vw"
                            src="/sites/cursor/blob/assets/misc/asset-1abb527f9369ad3e86bb.png"
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
                          <div className="flex h-full w-full items-center justify-center p-4 xl:p-0">
                            <img
                              alt="Cursor CLI in multiple IDEs"
                              loading="lazy"
                              width={420}
                              height={378}
                              decoding="async"
                              data-nimg="1"
                              className="h-full w-full max-w-sm object-contain xl:max-w-none"
                              sizes="(min-width: 1280px) 33vw, 92vw"
                              src="/sites/cursor/blob/assets/misc/asset-be5ac0d820a2c5746a52.png"
                              style={{ color: "transparent" }}
                            />
                          </div>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>

                {/* Card 2: Write powerful scripts and automations */}
                <div className="undefined h-full">
                  <div className="card flex h-full grow-1 flex-col">
                    <div className="type-base max-w-prose flex grow flex-col">
                      <div>
                        <h2>Write powerful scripts and automations</h2>
                        <div className="text-theme-text-sec text-pretty">
                          Automatically update docs, trigger security reviews, or build custom coding agents.
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
                            data-nimg="fill"
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
                            data-nimg="fill"
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
                          <div className="block sm:hidden h-full w-full">
                            <div style={{ height: "378px", width: "100%" }} />
                          </div>
                          <div className="hidden sm:block xl:hidden h-full w-full">
                            <div style={{ height: "378px", width: "100%" }} />
                          </div>
                          <div className="hidden xl:block h-full w-full">
                            <div style={{ height: "378px", width: "100%" }}>
                              <div
                                className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs"
                                data-demo-pad-scope="_r_1_"
                                style={
                                  {
                                    height: "378px",
                                    "--demo-pad": "0px",
                                  } as React.CSSProperties
                                }
                              >
                                <div
                                  className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full max-[767px]:pointer-events-none max-[767px]:opacity-0"
                                  style={{ opacity: 1 }}
                                >
                                  <div className="sr-only" aria-live="polite">
                                    Interactive demo with multiple windows showing Cursor&apos;s AI-powered features. The interface is displayed over a subtle, solid brand background.
                                  </div>
                                  <div
                                    aria-hidden="true"
                                    id="demo-window-fcd-top-left-391.6640625-378"
                                    className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-editor"
                                    style={{
                                      left: "60.7664%",
                                      top: "57.4074%",
                                      width: "420px",
                                      height: "378px",
                                      maxHeight: "calc(100% - 2 * var(--demo-pad))",
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
                                        <div
                                          className="bg-theme-card-hex text-theme-text flex h-full w-full flex-col overflow-hidden rounded-[10px] "
                                          style={{
                                            boxShadow:
                                              "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 12px 24px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px var(--color-theme-border-02)",
                                          }}
                                        >
                                          <div className="flex h-7 shrink-0 items-center justify-between border-b border-theme-border-02 px-2.5">
                                            <div className="flex items-center gap-1.5">
                                              <div
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{
                                                  backgroundColor: "var(--color-theme-fg-20)",
                                                }}
                                              />
                                              <div
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{
                                                  backgroundColor: "var(--color-theme-fg-20)",
                                                }}
                                              />
                                              <div
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{
                                                  backgroundColor: "var(--color-theme-fg-20)",
                                                }}
                                              />
                                            </div>
                                            <div className="w-10" />
                                          </div>
                                          <div className="min-h-0 flex-1 overflow-hidden">
                                            <div
                                              className="w-full h-full overflow-hidden"
                                              style={{ height: "100%" }}
                                            >
                                              <div
                                                className="type-product-base text-theme-text h-full overflow-hidden"
                                                style={{ fontSize: "13px" }}
                                              >
                                                <div className="bg-theme-card-02-hex/50 border-b border-theme-border-02">
                                                  <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                                                    <svg
                                                      className="h-6 w-6 text-theme-text flex-shrink-0"
                                                      viewBox="0 0 16 16"
                                                      fill="currentColor"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                                                      />
                                                    </svg>
                                                    <span className="text-theme-text">
                                                      acme-labs
                                                    </span>
                                                    <span className="text-theme-text-quat">/</span>
                                                    <span className="text-theme-text font-semibold">
                                                      research
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-6 px-4">
                                                    <span
                                                      className="py-2 text-theme-text"
                                                      style={{
                                                        borderBottom: "2px solid transparent",
                                                      }}
                                                    >
                                                      Code
                                                    </span>
                                                    <span
                                                      className="py-2 text-theme-text"
                                                      style={{
                                                        borderBottom: "2px solid transparent",
                                                      }}
                                                    >
                                                      Pull requests
                                                    </span>
                                                    <span
                                                      className="py-2 px-3 text-theme-text font-medium"
                                                      style={{
                                                        borderBottom:
                                                          "2px solid rgb(249, 130, 108)",
                                                        marginLeft: "-12px",
                                                        marginRight: "-12px",
                                                      }}
                                                    >
                                                      Actions
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="bg-theme-card-hex px-4 py-4">
                                                  {/* Workflow Step 0 */}
                                                  <div className="relative flex gap-3">
                                                    <div className="flex flex-col items-center w-4 flex-shrink-0">
                                                      <div className="flex-shrink-0 relative w-4 h-4 bg-theme-card-hex z-10 mt-0.5">
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step0Status === "done"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="currentColor"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" />
                                                          </svg>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step0Status === "active"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <div
                                                            className="flex items-center justify-center flex-shrink-0 animate-spin"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <svg
                                                              className="w-full h-full"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                className="text-[#d4a72c]/30 dark:text-[#d29922]/30"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="2.5"
                                                                fill="currentColor"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeDasharray="14 38"
                                                                strokeLinecap="round"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                                transform="rotate(-45 8 8)"
                                                              />
                                                            </svg>
                                                          </div>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step0Status === "pending"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-theme-border-02 flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <circle cx="8" cy="8" r="6.5" />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                      <div className="w-px flex-1 bg-theme-border-02/50 -mb-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pb-3">
                                                      <div className="mb-2">
                                                        <span className="text-theme-text font-medium">
                                                          Update documentation nightly
                                                        </span>
                                                      </div>
                                                      <div className="rounded border overflow-hidden font-berkeley-mono text-[11px] leading-relaxed transition-all duration-300 bg-theme-card-02-hex/10 border-theme-border-02/30 opacity-75">
                                                        <div className="px-3 transition-all duration-300 py-1.5">
                                                          <div className="transition-opacity duration-300 opacity-100 whitespace-nowrap">
                                                            <span className="text-theme-text-ter">
                                                              ${" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              agent
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              -p
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              --model
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-[#946b2d] dark:text-[#e9b872]">
                                                              &quot;GPT-5.6 Sol Extra High&quot;
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-[#946b2d] dark:text-[#e9b872]">
                                                              &quot;Update docs based on recent codebase changes&quot;
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Workflow Step 1 */}
                                                  <div className="relative flex gap-3">
                                                    <div className="flex flex-col items-center w-4 flex-shrink-0">
                                                      <div className="flex-shrink-0 relative w-4 h-4 bg-theme-card-hex z-10 mt-0.5">
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step1Status === "done"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="currentColor"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" />
                                                          </svg>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step1Status === "active"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <div
                                                            className="flex items-center justify-center flex-shrink-0 animate-spin"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <svg
                                                              className="w-full h-full"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                className="text-[#d4a72c]/30 dark:text-[#d29922]/30"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="2.5"
                                                                fill="currentColor"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeDasharray="14 38"
                                                                strokeLinecap="round"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                                transform="rotate(-45 8 8)"
                                                              />
                                                            </svg>
                                                          </div>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step1Status === "pending"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-theme-border-02 flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <circle cx="8" cy="8" r="6.5" />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                      <div className="w-px flex-1 bg-theme-border-02/50 -mb-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pb-3">
                                                      <div className="mb-2">
                                                        <span className="font-medium transition-colors duration-300 text-theme-text">
                                                          Send update to Slack
                                                        </span>
                                                      </div>
                                                      <div className="rounded border overflow-hidden font-berkeley-mono text-[11px] leading-relaxed transition-all duration-300 bg-theme-card-02-hex/20 border-theme-border-02/40 min-h-[4.5rem]">
                                                        <div className="px-3 transition-all duration-300 py-2">
                                                          <div className="transition-opacity duration-300 opacity-100 ">
                                                            <span className="text-theme-text-ter">
                                                              ${" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              agent
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              -p
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              --model
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-[#946b2d] dark:text-[#e9b872]">
                                                              &quot;composer-1&quot;
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-[#946b2d] dark:text-[#e9b872]">
                                                              &quot;Use Slack MCP to post update to #product-updates&quot;
                                                            </span>
                                                          </div>
                                                          <div
                                                            className={`text-theme-text-sec mt-1 transition-opacity duration-200 whitespace-nowrap ${
                                                              workflowPhase >= 1
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            }`}
                                                          >
                                                            <span className="text-theme-text-ter">
                                                              →
                                                            </span>{" "}
                                                            Posted overview with docs links to #product-updates
                                                          </div>
                                                          <div
                                                            className={`text-theme-text-sec mt-1 transition-opacity duration-200 whitespace-nowrap ${
                                                              workflowPhase >= 2
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            }`}
                                                          >
                                                            <span className="text-theme-text-ter">
                                                              →
                                                            </span>{" "}
                                                            Included 3 doc links and summary
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Workflow Step 2 */}
                                                  <div className="relative flex gap-3">
                                                    <div className="flex flex-col items-center w-4 flex-shrink-0">
                                                      <div className="flex-shrink-0 relative w-4 h-4 bg-theme-card-hex z-10 mt-0.5">
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step2Status === "done"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-[#1a7f37] dark:text-[#238636] flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="currentColor"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" />
                                                          </svg>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step2Status === "active"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <div
                                                            className="flex items-center justify-center flex-shrink-0 animate-spin"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <svg
                                                              className="w-full h-full"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                className="text-[#d4a72c]/30 dark:text-[#d29922]/30"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="2.5"
                                                                fill="currentColor"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                              />
                                                              <circle
                                                                cx="8"
                                                                cy="8"
                                                                r="6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeDasharray="14 38"
                                                                strokeLinecap="round"
                                                                className="text-[#bf8700] dark:text-[#d29922]"
                                                                transform="rotate(-45 8 8)"
                                                              />
                                                            </svg>
                                                          </div>
                                                        </div>
                                                        <div
                                                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                                                            step2Status === "pending"
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                          }`}
                                                        >
                                                          <svg
                                                            className="text-theme-border-02 flex-shrink-0"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            style={{ width: "16px", height: "16px" }}
                                                          >
                                                            <circle cx="8" cy="8" r="6.5" />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0 pb-3">
                                                      <div className="mb-2">
                                                        <span
                                                          className={`font-medium transition-colors duration-300 ${
                                                            step2Status === "pending"
                                                              ? "text-theme-text-ter"
                                                              : "text-theme-text"
                                                          }`}
                                                        >
                                                          Update Linear board
                                                        </span>
                                                      </div>
                                                      <div className="rounded border overflow-hidden font-berkeley-mono text-[11px] leading-relaxed transition-all duration-300 bg-theme-card-02-hex/20 border-theme-border-02/40">
                                                        <div className="px-3 transition-all duration-300 py-1.5">
                                                          <div
                                                            className={`transition-opacity duration-300 whitespace-nowrap ${
                                                              step2Status === "pending"
                                                                ? "opacity-50"
                                                                : "opacity-100"
                                                            }`}
                                                          >
                                                            <span className="text-theme-text-ter">
                                                              ${" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              linear issue update
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-[#946b2d] dark:text-[#e9b872]">
                                                              ENG-*
                                                            </span>
                                                            <span className="text-theme-text-sec">
                                                              {" "}
                                                            </span>
                                                            <span className="text-theme-text">
                                                              --from-commits
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
                                <div className="pointer-events-none absolute inset-0 z-20" />
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

        {/* Section 3: Learn more (2x2 Grid) */}
        <section className="section bg-theme-bg text-theme-text">
          <div className="container my-v2">
            <div className="text-left  mb-v1 max-w-prose-narrow">
              <h2 className="type-md-lg text-balance ">Learn more</h2>
            </div>
            <div className="grid gap-g1 grid-cols-1 md:grid-cols-2 items-stretch">
              <div className="card card--text flex h-full flex-col">
                <div className="grow-1">
                  <h3 className="type-base">Get started with Cursor CLI</h3>
                  <div className="text-theme-text-sec text-balance">
                    Installation guides, agents, and MCP integration.
                  </div>
                </div>
                <div className="mt-v8/12">
                  <a href="/docs/cli/overview" className="btn-tertiary">
                    Read documentation →
                  </a>
                </div>
              </div>
              <div className="card card--text flex h-full flex-col">
                <div className="grow-1">
                  <h3 className="type-base">Using Headless CLI</h3>
                  <div className="text-theme-text-sec text-balance">
                    Use Cursor CLI in scripts and automation workflows.
                  </div>
                </div>
                <div className="mt-v8/12">
                  <a href="/docs/cli/headless" className="btn-tertiary">
                    Read documentation →
                  </a>
                </div>
              </div>
              <div className="card card--text flex h-full flex-col">
                <div className="grow-1">
                  <h3 className="type-base">Shell Mode</h3>
                  <div className="text-theme-text-sec text-balance">
                    Run shell commands directly from agents with safety checks and output display.
                  </div>
                </div>
                <div className="mt-v8/12">
                  <a href="/docs/cli/shell-mode" className="btn-tertiary">
                    Read documentation →
                  </a>
                </div>
              </div>
              <div className="card card--text flex h-full flex-col">
                <div className="grow-1">
                  <h3 className="type-base">GitHub Actions</h3>
                  <div className="text-theme-text-sec text-balance">
                    Integrate Cursor CLI with GitHub Actions for automated CI/CD workflows.
                  </div>
                </div>
                <div className="mt-v8/12">
                  <a href="/docs/cli/github-actions" className="btn-tertiary">
                    Read documentation →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Animated ASCII 3D Cube */}
        <section className="section section--flush-y">
          <div className="container">
            <div className="py-v1 flex justify-center">
              <AsciiCubeCanvas />
            </div>
          </div>
        </section>

        {/* Section 5: Try Cursor CLI CTA */}
        <section className="section bg-theme-bg text-theme-text section--flush-y">
          <div className="container">
            <div className="text-center mx-auto max-w-prose-medium-wide">
              <h2 className="type-xl sm:type-2xl text-balance mx-auto mb-v1">Try Cursor CLI.</h2>
              <div className="flex justify-center gap-x-g1 items-center">
                <CopyInstallCommand />
              </div>
            </div>
          </div>
        </section>
      </main>
      <CursorFooter />
    </>
  );
}
