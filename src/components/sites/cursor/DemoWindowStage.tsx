"use client";

import React, { useCallback, useRef, useState } from "react";

export interface DemoWindowSpec {
  id: string;
  title: string;
  xPercent: number;
  yPercent: number;
  widthPx: number;
  heightPx: number;
  minWidthPx?: number;
  zIndex: number;
  ctaHref?: string;
  ctaLabel?: string;
  showSettingsButton?: boolean;
  onSettingsClick?: () => void;
  content: React.ReactNode;
}

interface RuntimeWindowState extends DemoWindowSpec {
  originalXPercent: number;
  originalYPercent: number;
  originalWidthPx: number;
  originalHeightPx: number;
  originalZIndex: number;
}

interface DemoWindowStageProps {
  windows: DemoWindowSpec[];
  height?: string | number;
  minHeight?: string | number;
  innerPaddingPx?: number;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  srDescription: string;
  disableResizing?: boolean;
  allowMobileInteractions?: boolean;
  externalLayoutAdjusted?: boolean;
  onInteract?: () => void;
  onReset?: () => void;
  scopeId?: string;
}

export function DemoWindowStage({
  windows,
  height = "min(780px, 70vh)",
  minHeight = 720,
  innerPaddingPx = 32,
  backgroundImageSrc,
  backgroundImageAlt = "",
  srDescription,
  disableResizing = false,
  allowMobileInteractions = false,
  externalLayoutAdjusted = false,
  onInteract,
  onReset,
  scopeId = "_r_0_",
}: DemoWindowStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topZRef = useRef(100);

  const [winStates, setWinStates] = useState<RuntimeWindowState[]>(() =>
    windows.map((w) => ({
      ...w,
      originalXPercent: w.xPercent,
      originalYPercent: w.yPercent,
      originalWidthPx: w.widthPx,
      originalHeightPx: w.heightPx,
      originalZIndex: w.zIndex,
    }))
  );

  const [layoutAdjusted, setLayoutAdjusted] = useState(false);

  const activeWindowId = winStates.reduce(
    (best, cur) => (cur.zIndex > best.zIndex ? cur : best),
    winStates[0]
  )?.id;

  const bringToFront = useCallback(
    (id: string) => {
      topZRef.current += 1;
      const nextZ = topZRef.current;
      setWinStates((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
      );
      onInteract?.();
    },
    [onInteract]
  );

  const dragStateRef = useRef<{
    id: string;
    pointerId: number;
    dxCenter: number;
    dyCenter: number;
  } | null>(null);

  const resizeStateRef = useRef<{
    id: string;
    pointerId: number;
    edge: string;
    startWidth: number;
    startHeight: number;
    startClientX: number;
    startClientY: number;
    startXPercent: number;
    startYPercent: number;
  } | null>(null);

  const handleReset = useCallback(() => {
    setWinStates((prev) =>
      prev.map((w) => ({
        ...w,
        xPercent: w.originalXPercent,
        yPercent: w.originalYPercent,
        widthPx: w.originalWidthPx,
        heightPx: w.originalHeightPx,
        zIndex: w.originalZIndex,
      }))
    );
    setLayoutAdjusted(false);
    onReset?.();
  }, [onReset]);

  const startDrag = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string
  ) => {
    const el = document.getElementById(`demo-window-${id}`);
    if (!el) return;
    bringToFront(id);
    setLayoutAdjusted(true);
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    dragStateRef.current = {
      id,
      pointerId: e.pointerId,
      dxCenter: e.clientX - cx,
      dyCenter: e.clientY - cy,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const startResize = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    edge: string
  ) => {
    e.stopPropagation();
    const win = winStates.find((w) => w.id === id);
    if (!win) return;
    bringToFront(id);
    setLayoutAdjusted(true);
    resizeStateRef.current = {
      id,
      pointerId: e.pointerId,
      edge,
      startWidth: win.widthPx,
      startHeight: win.heightPx,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPercent: win.xPercent,
      startYPercent: win.yPercent,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const stage = containerRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width <= 0 || stageRect.height <= 0) return;

    if (dragStateRef.current && dragStateRef.current.pointerId === e.pointerId) {
      const { id, dxCenter, dyCenter } = dragStateRef.current;
      const newCenterX = e.clientX - dxCenter - stageRect.left;
      const newCenterY = e.clientY - dyCenter - stageRect.top;
      const xPercent = Math.max(5, Math.min(95, (newCenterX / stageRect.width) * 100));
      const yPercent = Math.max(5, Math.min(95, (newCenterY / stageRect.height) * 100));
      setWinStates((prev) =>
        prev.map((w) => (w.id === id ? { ...w, xPercent, yPercent } : w))
      );
      return;
    }

    if (
      resizeStateRef.current &&
      resizeStateRef.current.pointerId === e.pointerId &&
      !disableResizing
    ) {
      const {
        id,
        edge,
        startWidth,
        startHeight,
        startClientX,
        startClientY,
        startXPercent,
        startYPercent,
      } = resizeStateRef.current;
      const dx = e.clientX - startClientX;
      const dy = e.clientY - startClientY;
      setWinStates((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          const minW = w.minWidthPx ?? 420;
          const minH = 260;
          let nextW = startWidth;
          let nextH = startHeight;
          let nextX = startXPercent;
          let nextY = startYPercent;

          if (edge.includes("e")) {
            nextW = Math.max(minW, Math.min(stageRect.width - 2 * innerPaddingPx, startWidth + dx));
            nextX = startXPercent + ((nextW - startWidth) / 2 / stageRect.width) * 100;
          }
          if (edge.includes("w")) {
            nextW = Math.max(minW, Math.min(stageRect.width - 2 * innerPaddingPx, startWidth - dx));
            nextX = startXPercent - ((nextW - startWidth) / 2 / stageRect.width) * 100;
          }
          if (edge.includes("s")) {
            nextH = Math.max(minH, Math.min(stageRect.height - 2 * innerPaddingPx, startHeight + dy));
            nextY = startYPercent + ((nextH - startHeight) / 2 / stageRect.height) * 100;
          }
          if (edge.includes("n")) {
            nextH = Math.max(minH, Math.min(stageRect.height - 2 * innerPaddingPx, startHeight - dy));
            nextY = startYPercent - ((nextH - startHeight) / 2 / stageRect.height) * 100;
          }

          return {
            ...w,
            widthPx: nextW,
            heightPx: nextH,
            xPercent: nextX,
            yPercent: nextY,
          };
        })
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current && dragStateRef.current.pointerId === e.pointerId) {
      dragStateRef.current = null;
    }
    if (resizeStateRef.current && resizeStateRef.current.pointerId === e.pointerId) {
      resizeStateRef.current = null;
    }
  };

  const showReset = layoutAdjusted || externalLayoutAdjusted;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="no-drag-img relative w-full overflow-hidden select-none border-theme-border-02 rounded-xs bg-transparent"
      data-demo-pad-scope={scopeId}
      style={
        {
          height: typeof height === "number" ? `${height}px` : height,
          minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
          "--demo-pad": `${innerPaddingPx}px`,
        } as React.CSSProperties
      }
    >
      <style>{`@media (max-width: 767px) { [data-demo-pad-scope="${scopeId}"] { --demo-pad: ${Math.min(16, innerPaddingPx)}px !important; } }`}</style>
      {backgroundImageSrc && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            alt={backgroundImageAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundImageSrc}
          />
        </div>
      )}
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full${
          !allowMobileInteractions
            ? " max-[767px]:pointer-events-none max-[767px]:opacity-0"
            : ""
        }`}
      >
        <div className="sr-only" aria-live="polite">
          {srDescription}
        </div>
        {winStates.map((w) => {
          const currentSpec = windows.find((item) => item.id === w.id) ?? w;
          const isFocused = w.id === activeWindowId;
          const halfW = w.widthPx / 2;
          const halfH = w.heightPx / 2;
          const minW = w.minWidthPx ?? 420;
          return (
            <div
              key={w.id}
              aria-hidden="true"
              id={`demo-window-${w.id}`}
              onPointerDown={() => bringToFront(w.id)}
              className="group absolute rounded-[10px] overflow-hidden flex flex-col bg-theme-product-chrome select-none"
              style={{
                left: `clamp(calc(var(--demo-pad) + ${halfW}px), ${w.xPercent}%, calc(100% - var(--demo-pad) - ${halfW}px))`,
                top: `clamp(calc(var(--demo-pad) + ${halfH}px), ${w.yPercent}%, calc(100% - var(--demo-pad) - ${halfH}px))`,
                width: `${w.widthPx}px`,
                minWidth: `${minW}px`,
                height: `${w.heightPx}px`,
                maxHeight: "calc(100% - 2 * var(--demo-pad))",
                minHeight: "260px",
                transform: "translate(-50%, -50%) scale(1)",
                transformOrigin: "center center",
                zIndex: w.zIndex,
                boxShadow:
                  "0 28px 70px rgba(0, 0, 0, 0.14), 0 14px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--color-theme-border-02)",
              }}
            >
              <div
                className="border-theme-border-02 relative flex h-7 items-center justify-between border-b px-2 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => startDrag(e, w.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full${
                      isFocused ? "" : " bg-theme-border-02"
                    }`}
                    style={
                      isFocused
                        ? { backgroundColor: "var(--color-theme-fg-20)" }
                        : undefined
                    }
                  />
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full${
                      isFocused ? "" : " bg-theme-border-02"
                    }`}
                    style={
                      isFocused
                        ? { backgroundColor: "var(--color-theme-fg-20)" }
                        : undefined
                    }
                  />
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full${
                      isFocused ? "" : " bg-theme-border-02"
                    }`}
                    style={
                      isFocused
                        ? { backgroundColor: "var(--color-theme-fg-20)" }
                        : undefined
                    }
                  />
                </div>
                <div className="type-product-base pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 truncate text-center opacity-70">
                  {currentSpec.title}
                </div>
                <div className="-mr-1 flex items-center">
                  {w.ctaHref && w.ctaLabel && (
                    <button
                      type="button"
                      className="transition-opacity duration-200 type-product-base rounded px-2 py-1 text-theme-text-sec hover:bg-theme-bg-hover cursor-pointer opacity-0 group-hover:opacity-100"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (w.ctaHref) {
                          window.location.href = w.ctaHref;
                        }
                      }}
                    >
                      {w.ctaLabel}
                    </button>
                  )}
                  {w.showSettingsButton && (
                    <button
                      type="button"
                      aria-label="Open settings"
                      className="text-theme-text-sec hover:bg-theme-bg-hover inline-flex h-7 w-7 items-center justify-center rounded transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        w.onSettingsClick?.();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div
                className="min-h-0 w-full flex-1 overflow-hidden"
                data-demo-desktop-content="true"
              >
                <div className="h-full min-h-0 w-full">{currentSpec.content}</div>
              </div>
              {!disableResizing && (
                <>
                  <div
                    className="absolute inset-x-2 top-0 h-2 cursor-ns-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "n")}
                  />
                  <div
                    className="absolute inset-x-2 bottom-0 h-2 cursor-ns-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "s")}
                  />
                  <div
                    className="absolute inset-y-2 right-0 w-1 cursor-ew-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "e")}
                  />
                  <div
                    className="absolute inset-y-2 left-0 w-1 cursor-ew-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "w")}
                  />
                  <div
                    className="absolute top-0 left-0 h-2.5 w-2.5 cursor-nwse-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "nw")}
                  />
                  <div
                    className="absolute top-0 right-0 h-2.5 w-2.5 cursor-nesw-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "ne")}
                  />
                  <div
                    className="absolute bottom-0 left-0 h-2.5 w-2.5 cursor-nesw-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "sw")}
                  />
                  <div
                    className="absolute right-0 bottom-0 h-2.5 w-2.5 cursor-nwse-resize"
                    data-resize-handle="true"
                    onPointerDown={(e) => startResize(e, w.id, "se")}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20">
        {showReset && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm border-theme-border-01 bg-theme-card-hex text-theme-text-sec hover:bg-theme-bg-hover transition-all duration-150"
            aria-label="Reset layout"
            title="Reset"
            style={{
              position: "absolute",
              right: "var(--demo-pad)",
              bottom: "var(--demo-pad)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-theme-text-sec"
            >
              <path d="M2.76758 8.14258C2.76758 5.24805 5.10547 2.91016 8 2.91016C8.29883 2.91016 8.58594 2.94531 8.84375 2.99219L7.42578 1.5918C7.32617 1.48633 7.26758 1.35156 7.26758 1.19922C7.26758 0.882812 7.51367 0.625 7.82422 0.625C7.98828 0.625 8.12891 0.683594 8.22852 0.794922L10.6309 3.23828C10.748 3.35547 10.8125 3.50781 10.8125 3.66016C10.8125 3.81836 10.7539 3.95898 10.6309 4.08203L8.22852 6.50781C8.12305 6.60742 7.99414 6.66602 7.82422 6.66602C7.51367 6.66602 7.26758 6.41992 7.26758 6.09766C7.26758 5.94531 7.32031 5.81641 7.43164 5.71094L9.01367 4.14062C8.7207 4.07617 8.375 4.05273 8 4.05273C5.74414 4.05273 3.91602 5.88086 3.91602 8.13672C3.91602 10.3926 5.74414 12.2207 8 12.2207C10.2559 12.2207 12.084 10.3926 12.084 8.13672C12.084 7.79102 12.3066 7.54492 12.6406 7.54492C12.9863 7.54492 13.2324 7.79102 13.2324 8.14258C13.2324 11.0312 10.8887 13.375 8 13.375C5.10547 13.375 2.76758 11.0312 2.76758 8.14258Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
