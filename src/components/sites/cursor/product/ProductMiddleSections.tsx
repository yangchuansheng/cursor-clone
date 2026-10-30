"use client";

import React, { useEffect, useRef, useState } from "react";

interface PlanQuestion {
  question: string;
  options: [string, string, string];
  defaultSelected: number;
}

const PLAN_QUESTIONS: PlanQuestion[] = [
  {
    question: "How should Mission Control be opened?",
    options: [
      "Gesture (swipe up with 3 fingers)",
      "Keyboard shortcut (e.g. CMD+F3)",
      "Both keyboard and button",
    ],
    defaultSelected: 1,
  },
  {
    question: "How should windows be arranged?",
    options: [
      "Even grid layout",
      "Group by app proximity",
      "User-defined zones",
    ],
    defaultSelected: 0,
  },
  {
    question: "Animation style preference?",
    options: [
      "Smooth & elegant (300ms)",
      "Snappy & instant (150ms)",
      "No animation",
    ],
    defaultSelected: 0,
  },
];

const FOLLOW_UP_TEXT = "match the system theme";

function PlanModeDemoFramed() {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<[number, number, number]>([
    1, 0, 0,
  ]);
  const [typedFollowUp, setTypedFollowUp] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runCycle = () => {
      setQuestionIndex(0);
      setTypedFollowUp("");

      schedule(() => {
        setQuestionIndex(1);
      }, 2400);

      schedule(() => {
        setQuestionIndex(2);
      }, 4800);

      const startType = 6200;
      for (let i = 1; i <= FOLLOW_UP_TEXT.length; i++) {
        schedule(() => {
          setTypedFollowUp(FOLLOW_UP_TEXT.slice(0, i));
        }, startType + i * 55);
      }

      schedule(runCycle, startType + FOLLOW_UP_TEXT.length * 55 + 2200);
    };

    const initialTimer = setTimeout(runCycle, 100);
    timers.push(initialTimer);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const current = PLAN_QUESTIONS[questionIndex] ?? PLAN_QUESTIONS[0];
  const activeOption = selectedOptions[questionIndex] ?? current.defaultSelected;

  const handleSelectOption = (idx: number) => {
    setSelectedOptions((prev) => {
      const next: [number, number, number] = [...prev];
      next[questionIndex] = idx;
      return next;
    });
  };

  const handleAdvance = () => {
    setQuestionIndex((prev) => (prev + 1) % PLAN_QUESTIONS.length);
  };

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-xs"
      style={{ height: "378px" }}
    >
      <div className="w-full max-w-[320px] px-4">
        <div className="relative z-10">
          <div className="grid w-full">
            <div className="bg-theme-product-editor border-theme-border-02 rounded-lg border">
              <div className="px-2.5 pt-2.5 pb-2">
                <div className="text-theme-text type-product-base mb-2 font-medium">
                  {current.question}
                </div>
                <div className="space-y-0.5">
                  {current.options.map((optionText, idx) => {
                    const isSelected = activeOption === idx;
                    return (
                      <div
                        key={optionText}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectOption(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectOption(idx);
                          }
                        }}
                        className={`flex w-full cursor-pointer items-center gap-2 rounded py-1 text-left transition-colors ${
                          isSelected ? "text-theme-text" : "text-theme-text-sec"
                        }`}
                        style={
                          isSelected
                            ? { backgroundColor: "var(--color-theme-bg-hover)" }
                            : undefined
                        }
                      >
                        <span
                          className={`type-product-sm flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded border text-[11px] ${
                            isSelected
                              ? "border-transparent text-white"
                              : "border-theme-border-02"
                          }`}
                          style={
                            isSelected
                              ? { backgroundColor: "rgb(192, 133, 50)" }
                              : undefined
                          }
                        >
                          {idx + 1}
                        </span>
                        <span className="type-product-base">{optionText}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleAdvance}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAdvance();
                      }
                    }}
                    className="border-theme-border-02 bg-theme-bg text-theme-text-sec type-product-base-medium cursor-pointer rounded border px-2 py-0.5 text-xs"
                  >
                    Skip
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleAdvance}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAdvance();
                      }
                    }}
                    className="type-product-base-medium cursor-pointer rounded px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: "rgb(192, 133, 50)" }}
                  >
                    {questionIndex === 2 ? "Build" : "Continue"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-20 mt-1">
          <div className="bg-theme-product-editor border-theme-border-02 overflow-hidden rounded-lg border">
            <div
              className="text-theme-text type-product-lg min-h-[36px] w-full bg-transparent px-3 pt-2.5 pb-2"
              style={{ lineHeight: 1.6 }}
            >
              {typedFollowUp ? (
                <span>{typedFollowUp}</span>
              ) : (
                <span className="text-theme-text-sec opacity-50">
                  Add follow-up...
                </span>
              )}
            </div>
            <div className="px-2 py-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="type-product-sm text-theme-text-sec flex items-center gap-1 rounded-full px-2 py-0.75"
                    style={{ backgroundColor: "rgba(192, 133, 50, 0.15)" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 21.1172 18.6211"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "rgb(192, 133, 50)" }}
                    >
                      <path d="M10.875 15.4453L19.9102 15.4453C20.3789 15.4453 20.7656 15.0703 20.7656 14.6016C20.7656 14.1328 20.3789 13.7578 19.9102 13.7578L10.875 13.7578C10.4062 13.7578 10.0312 14.1328 10.0312 14.6016C10.0312 15.0703 10.4062 15.4453 10.875 15.4453Z" />
                      <path d="M4.01953 18.6211C6.19922 18.6211 8.01562 16.7812 8.01562 14.6016C8.01562 12.4102 6.19922 10.582 4.01953 10.582C1.81641 10.582 0 12.4102 0 14.6016C0 16.7812 1.82812 18.6211 4.01953 18.6211ZM4.01953 17.0977C2.66016 17.0977 1.52344 15.9492 1.52344 14.6016C1.52344 13.2539 2.67188 12.1055 4.01953 12.1055C5.35547 12.1055 6.49219 13.2539 6.49219 14.6016C6.49219 15.9492 5.35547 17.0977 4.01953 17.0977Z" />
                      <path d="M10.875 4.89844L19.9102 4.89844C20.3789 4.89844 20.7656 4.52344 20.7656 4.05469C20.7656 3.58594 20.3789 3.21094 19.9102 3.21094L10.875 3.21094C10.4062 3.21094 10.0312 3.58594 10.0312 4.05469C10.0312 4.52344 10.4062 4.89844 10.875 4.89844Z" />
                      <path d="M4.01953 8.0625C6.19922 8.0625 8.01562 6.22266 8.01562 4.04297C8.01562 1.85156 6.19922 0.0351562 4.01953 0.0351562C1.81641 0.0351562 0 1.85156 0 4.04297C0 6.22266 1.82812 8.0625 4.01953 8.0625ZM4.01953 6.53906C2.66016 6.53906 1.52344 5.39062 1.52344 4.04297C1.52344 2.69531 2.67188 1.54688 4.01953 1.54688C5.35547 1.54688 6.49219 2.69531 6.49219 4.04297C6.49219 5.39062 5.35547 6.53906 4.01953 6.53906Z" />
                    </svg>
                    <span style={{ color: "rgb(192, 133, 50)" }}>Plan</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      style={{ color: "rgb(192, 133, 50)" }}
                    >
                      <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--color-theme-card-04-hex)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="text-theme-text-sec"
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
  );
}

interface VisualTargetMeta {
  name: string;
  tag: string;
  prefix: string;
  suffix: string;
}

const VISUAL_TARGETS: VisualTargetMeta[] = [
  {
    name: "Logo",
    tag: "<span>",
    prefix: "Make ",
    suffix: " bigger",
  },
  {
    name: "IntroParagraph",
    tag: "<p>",
    prefix: "Add more detail to ",
    suffix: "",
  },
  {
    name: "Tagline",
    tag: "<span>",
    prefix: "Shorten ",
    suffix: "",
  },
  {
    name: "JoinTeamLink",
    tag: "<a>",
    prefix: "Make ",
    suffix: " a button",
  },
];

interface BoxRect {
  top: number;
  left: number;
  width: number;
  height: number;
  composerTop: number;
  composerWidth: number;
}

const DEFAULT_TAGLINE_RECT: BoxRect = {
  top: 166.789,
  left: 20,
  width: 256.867,
  height: 30.5,
  composerTop: 205.289,
  composerWidth: 345.664,
};

function VisualEditingDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([null, null, null, null]);
  const [targetIndex, setTargetIndex] = useState<number>(2);
  const [rect, setRect] = useState<BoxRect>(DEFAULT_TAGLINE_RECT);

  const measureTarget = (index: number) => {
    const container = containerRef.current;
    const el = itemRefs.current[index];
    if (!container || !el) return;

    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    if (cRect.width === 0 || eRect.width === 0) return;

    const padX = 4;
    const padY = 4;
    const top = eRect.top - cRect.top - padY;
    const left = eRect.left - cRect.left - padX;
    const width = eRect.width + padX * 2;
    const height = eRect.height + padY * 2;

    const composerHeight = 84;
    const gap = 8;
    const rawBelow = top + height + gap;
    const composerTop =
      rawBelow + composerHeight > cRect.height - 8
        ? Math.max(8, top - composerHeight - gap)
        : rawBelow;
    const composerWidth = Math.min(345.664, Math.max(240, cRect.width - left - 16));

    setRect({
      top,
      left,
      width,
      height,
      composerTop,
      composerWidth,
    });
  };

  useEffect(() => {
    measureTarget(targetIndex);
    const handleResize = () => measureTarget(targetIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const mouseY = e.clientY;

    let bestIndex = targetIndex;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const centerY = r.top + r.height / 2;
      const dist = Math.abs(mouseY - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }

    if (bestIndex !== targetIndex) {
      setTargetIndex(bestIndex);
    }
  };

  const activeMeta = VISUAL_TARGETS[targetIndex] ?? VISUAL_TARGETS[2];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{ height: "378px" }}
    >
      <div className="text-theme-text-sec absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="flex h-full w-full flex-col p-6 pt-10"
          style={{
            maxWidth: "460px",
            fontFamily:
              'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif',
          }}
        >
          <header className="mb-4 flex items-center">
            <span
              ref={(node) => {
                itemRefs.current[0] = node;
              }}
              className="text-theme-text"
              style={{
                fontWeight: 500,
                fontStyle: "italic",
                fontFeatureSettings: '"cswh"',
                fontSize: "1.2rem",
              }}
            >
              Acme Labs
            </span>
          </header>
          <div className="max-w-[48ch] text-[1.08rem] leading-[1.35]">
            <p
              ref={(node) => {
                itemRefs.current[1] = node;
              }}
              style={{ textIndent: "-0.1rem" }}
            >
              Software creation is changing. We are a group of researchers,
              engineers, and technologists inventing at the edge of what&apos;s
              useful and possible.
            </p>
            <p className="mt-4">
              <span
                ref={(node) => {
                  itemRefs.current[2] = node;
                }}
              >
                We have much to learn, try, and build.
              </span>
            </p>
            <p className="mt-5">
              <a
                ref={(node) => {
                  itemRefs.current[3] = node;
                }}
                href="#workflows"
                onClick={(e) => e.preventDefault()}
                className="underline"
                style={{ textUnderlineOffset: "0.125em" }}
              >
                Join our team →
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
        <style>{`
        .dom-selection-overlay {
          --selection-color: #3A6A9F;
        }
        [data-theme="dark"] .dom-selection-overlay {
          --selection-color: #8BC4F8;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .dom-selection-overlay {
            --selection-color: #8BC4F8;
          }
        }
        .dom-selection-box {
          border: 2px solid rgba(58, 106, 159, 0.15);
          background-color: rgba(58, 106, 159, 0.08);
        }
        [data-theme="dark"] .dom-selection-box {
          border: 2px solid rgba(139, 196, 248, 0.2);
          background-color: rgba(139, 196, 248, 0.08);
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .dom-selection-box {
            border: 2px solid rgba(139, 196, 248, 0.2);
            background-color: rgba(139, 196, 248, 0.08);
          }
        }
        .dom-selection-tooltip {
          background-color: #E3EBF3;
          color: #3A6A9F;
        }
        [data-theme="dark"] .dom-selection-tooltip {
          background-color: #253545;
          color: #8BC4F8;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .dom-selection-tooltip {
            background-color: #253545;
            color: #8BC4F8;
          }
        }
      `}</style>
        <div className="dom-selection-overlay absolute inset-0">
          <div
            className="dom-selection-box absolute"
            style={{
              top: `${rect.top}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              transition: "0.08s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <div
            className="dom-selection-tooltip absolute whitespace-nowrap px-1.5 py-0.5 text-[11px]"
            style={{
              top: `${Math.max(4, rect.top - 20)}px`,
              left: `${rect.left}px`,
              transition: "0.08s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily:
                "var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            <span style={{ fontWeight: 500 }}>{activeMeta.name}</span>
            <span className="ml-1.5 opacity-60" style={{ fontWeight: 400 }}>
              {activeMeta.tag}
            </span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-25"
        style={{
          opacity: 1,
          transition: "0.08s cubic-bezier(0.4, 0, 0.2, 1)",
          left: `${rect.left}px`,
          top: `${rect.composerTop}px`,
          width: `${rect.composerWidth}px`,
        }}
      >
        <style>{`
        .floating-composer-shadow {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05);
        }
        [data-theme="dark"] .floating-composer-shadow {
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2);
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .floating-composer-shadow {
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
        <div className="floating-composer-shadow bg-theme-product-editor border-theme-border-02 overflow-hidden rounded-lg border">
          <div
            className="text-theme-text type-product-base w-full bg-transparent px-2.5 pt-2.5 pb-2"
            style={{ fontSize: "13px", lineHeight: 1.7 }}
          >
            {activeMeta.prefix}
            <style>{`
        .element-tag {
          background-color: rgba(58, 106, 159, 0.15);
          color: #3A6A9F;
        }
        [data-theme="dark"] .element-tag {
          background-color: rgba(139, 196, 248, 0.2);
          color: #8BC4F8;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .element-tag {
            background-color: rgba(139, 196, 248, 0.2);
            color: #8BC4F8;
          }
        }
      `}</style>
            <span
              className="element-tag inline-flex items-center rounded whitespace-nowrap"
              style={{
                fontSize: "inherit",
                lineHeight: 1.4,
                padding: "1px 6px",
                verticalAlign: "baseline",
              }}
            >
              <span>{activeMeta.name}</span>
            </span>
            {activeMeta.suffix}
          </div>
          <div className="px-2.5 py-2.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="type-product-sm bg-theme-card-03-hex text-theme-text-sec flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75"
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
                className="bg-theme-button-bg text-theme-button-text flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
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
  );
}

const DEBUG_TOOLCALLS: Array<{ verb: string; target: string }> = [
  { verb: "Checked", target: "server output" },
  { verb: "Added", target: "console logs" },
  { verb: "Took", target: "screenshot" },
  { verb: "Read", target: "ChartRenderer.tsx" },
];

function DebugDemo() {
  const [step, setStep] = useState<number>(7);

  useEffect(() => {
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runCycle = () => {
      setStep(0);
      schedule(() => setStep(1), 600);
      schedule(() => setStep(2), 1300);
      schedule(() => setStep(3), 2000);
      schedule(() => setStep(4), 2700);
      schedule(() => setStep(5), 3500);
      schedule(() => setStep(6), 4300);
      schedule(() => setStep(7), 5000);
      schedule(runCycle, 8500);
    };

    const initId = setTimeout(runCycle, 3200);
    timers.push(initId);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: "378px" }}>
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
              <div className="max-w-[calc(100%-12px)] space-y-2">
                <div
                  className="bg-theme-card-04-hex border-theme-border-02 text-theme-text type-product-lg rounded-md border px-3 py-2 transition-all duration-300"
                  style={{
                    opacity: step >= 0 ? 1 : 0,
                    transform: step >= 0 ? "none" : "translateY(4px)",
                  }}
                >
                  Chart tooltips freeze when hovering over data points.
                </div>
                <div className="space-y-2 pl-2">
                  {DEBUG_TOOLCALLS.map((call, idx) => {
                    const visible = step >= idx + 1;
                    const isActive = step === idx + 1;
                    return (
                      <div
                        key={call.target}
                        className="type-product-lg text-theme-text-sec leading-snug transition-all duration-300"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? "none" : "translateY(4px)",
                        }}
                      >
                        <div className="flex items-baseline gap-1 overflow-hidden">
                          <span
                            className={`flex-shrink-0 ${
                              isActive ? "shimmer" : ""
                            }`}
                          >
                            {call.verb}
                          </span>
                          <span className="min-w-0 truncate opacity-60">
                            {call.target}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="type-product-lg text-theme-text leading-snug transition-all duration-300"
                    style={{
                      opacity: step >= 5 ? 1 : 0,
                      transform: step >= 5 ? "none" : "translateY(4px)",
                    }}
                  >
                    Found it: stale closure in the hover handler.
                  </div>
                  <div
                    className="transition-all duration-300"
                    style={{
                      opacity: step >= 6 ? 1 : 0,
                      transform: step >= 6 ? "none" : "translateY(4px)",
                    }}
                  >
                    <div className="bg-theme-product-editor border-theme-border-02 overflow-hidden rounded border">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-theme-text-sec h-3 w-3 flex-shrink-0"
                        >
                          <path d="M4.14746 12.7578C3.03564 12.7578 2.48242 12.1992 2.48242 11.0767V2.92871C2.48242 1.81152 3.04102 1.24219 4.14746 1.24219H6.69873C7.30029 1.24219 7.63867 1.3335 8.04688 1.75244L11.0063 4.76562C11.436 5.20605 11.5166 5.50684 11.5166 6.19971V11.0767C11.5166 12.1938 10.9634 12.7578 9.85156 12.7578H4.14746ZM4.18506 11.8931H9.80859C10.3672 11.8931 10.6519 11.5977 10.6519 11.0605V6.2373H7.59033C6.91895 6.2373 6.58057 5.9043 6.58057 5.22754V2.10693H4.19043C3.63184 2.10693 3.34717 2.41309 3.34717 2.94482V11.0605C3.34717 11.5977 3.63184 11.8931 4.18506 11.8931ZM7.68701 5.42627H10.4854L7.3916 2.27344V5.12549C7.3916 5.34033 7.47217 5.42627 7.68701 5.42627Z" />
                        </svg>
                        <span className="type-product-lg text-theme-text">
                          <span>Tooltip.tsx</span>
                          <span className="text-theme-product-ansi-green ml-1.5">
                            +3
                          </span>
                          <span className="text-theme-product-ansi-red ml-0.5">
                            -1
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="type-product-lg text-theme-text leading-snug transition-all duration-300"
                    style={{
                      opacity: step >= 7 ? 1 : 0,
                      transform: step >= 7 ? "none" : "translateY(4px)",
                    }}
                  >
                    Fixed. Tooltips should update smoothly now.
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

const BUILD_LINES: Array<{ text: string; isSuccess?: boolean }> = [
  { text: "> acme-app@2.1.0 build /Users/dev/acme-app" },
  { text: "▲ Next.js 15.1.0 (Turbopack)" },
  { text: "Creating an optimized production build..." },
  { text: "Compiling (1847 modules)" },
  { text: "Collecting page data..." },
  { text: "Generating static pages (48/48)" },
  { text: "Finalizing page optimization..." },
  { text: "✓ Compiled successfully in 3.8s", isSuccess: true },
];

function TerminalDemo() {
  const [step, setStep] = useState<number>(4);
  const [visibleLines, setVisibleLines] = useState<number>(8);
  const [scrollY, setScrollY] = useState<number>(-64);

  useEffect(() => {
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runCycle = () => {
      setStep(0);
      setVisibleLines(0);
      setScrollY(0);

      schedule(() => setStep(1), 500);
      schedule(() => setStep(2), 1100);
      schedule(() => setStep(3), 1700);

      for (let i = 1; i <= BUILD_LINES.length; i++) {
        schedule(() => {
          setVisibleLines(i);
          const extra = Math.max(0, i - 4);
          setScrollY(-extra * 16);
        }, 1800 + i * 260);
      }

      schedule(() => {
        setStep(4);
      }, 1800 + BUILD_LINES.length * 260 + 400);

      schedule(runCycle, 1800 + BUILD_LINES.length * 260 + 3600);
    };

    const initId = setTimeout(runCycle, 3500);
    timers.push(initId);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: "378px" }}>
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
              <div className="max-w-[calc(100%-12px)] space-y-2">
                <div
                  className="bg-theme-card-04-hex border-theme-border-02 text-theme-text type-product-lg rounded-md border px-3 py-2 transition-all duration-300"
                  style={{
                    opacity: step >= 0 ? 1 : 0,
                    transform: step >= 0 ? "none" : "translateY(4px)",
                  }}
                >
                  build this project
                </div>
                <div className="space-y-2 pl-2">
                  <div
                    className="type-product-lg text-theme-text-sec leading-snug transition-all duration-300"
                    style={{
                      opacity: step >= 1 ? 1 : 0,
                      transform: step >= 1 ? "none" : "translateY(4px)",
                    }}
                  >
                    <div className="flex items-baseline gap-1 overflow-hidden">
                      <span className="flex-shrink-0">Read</span>
                      <span className="min-w-0 truncate opacity-60">
                        package.json
                      </span>
                    </div>
                  </div>
                  <div
                    className="type-product-lg text-theme-text-sec leading-snug transition-all duration-300"
                    style={{
                      opacity: step >= 2 ? 1 : 0,
                      transform: step >= 2 ? "none" : "translateY(4px)",
                    }}
                  >
                    <div className="flex items-baseline gap-1 overflow-hidden">
                      <span className="flex-shrink-0">Ran</span>
                      <span className="min-w-0 truncate opacity-60">
                        terminal command
                      </span>
                    </div>
                  </div>
                  <div
                    className="transition-all duration-300"
                    style={{
                      opacity: step >= 3 ? 1 : 0,
                      transform: step >= 3 ? "none" : "translateY(4px)",
                    }}
                  >
                    <div
                      className="border-theme-border-02 relative overflow-hidden rounded-lg border"
                      style={{ width: "100%", height: "116px" }}
                    >
                      <div
                        className="media-light absolute inset-0 rounded-lg"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 rounded-lg"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.024)" }}
                      />
                      <div className="font-berkeley-mono border-theme-border-01 border-b px-2.5 pt-2 pb-1 text-xs leading-snug tracking-tight whitespace-nowrap">
                        <div className="text-theme-text">
                          <span className="text-theme-text-ter">$</span>{" "}
                          <span className="text-theme-text">npm run build</span>
                        </div>
                      </div>
                      <div
                        className="absolute right-0 bottom-0 left-0 overflow-hidden"
                        style={{
                          top: "28px",
                          maskImage:
                            "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 15%, rgba(0, 0, 0, 0.7) 30%, black 45%)",
                        }}
                      >
                        <div
                          className="font-berkeley-mono px-2.5 pt-2 pb-0 text-xs leading-snug tracking-tight whitespace-nowrap transition-transform duration-300"
                          style={{ transform: `translateY(${scrollY}px)` }}
                        >
                          <div className="space-y-0.5">
                            {BUILD_LINES.map((line, idx) => (
                              <div
                                key={line.text}
                                style={{
                                  opacity: idx < visibleLines ? 1 : 0,
                                }}
                              >
                                <div
                                  className={
                                    line.isSuccess
                                      ? "text-theme-product-ansi-green"
                                      : "text-theme-text-ter"
                                  }
                                >
                                  {line.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="type-product-lg text-theme-text leading-snug transition-all duration-300"
                    style={{
                      opacity: step >= 4 ? 1 : 0,
                      transform: step >= 4 ? "none" : "translateY(4px)",
                    }}
                  >
                    Build complete. Ready to deploy?
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

type TagsStage =
  | "complete"
  | "typing_first"
  | "popup_first"
  | "typing_mid"
  | "typing_second"
  | "popup_second";

const DRAWER_POPUP_ITEMS = ["drawer.tsx", "drawerContent.tsx", "drawer.test.ts"];
const BRAND_POPUP_ITEMS = ["brand", "brand-assets", "branding.md"];

function TagsDemo() {
  const [stage, setStage] = useState<TagsStage>("complete");
  const [typedText, setTypedText] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runCycle = () => {
      const firstSeq = "Make @dra";
      setStage("typing_first");
      setTypedText("");

      for (let i = 1; i <= firstSeq.length; i++) {
        schedule(() => {
          setTypedText(firstSeq.slice(0, i));
        }, i * 65);
      }

      const afterFirstType = firstSeq.length * 65 + 150;
      schedule(() => {
        setStage("popup_first");
      }, afterFirstType);

      const afterFirstPopup = afterFirstType + 900;
      const midSeq = " use ";
      schedule(() => {
        setStage("typing_mid");
        setTypedText("");
      }, afterFirstPopup);

      for (let i = 1; i <= midSeq.length; i++) {
        schedule(() => {
          setTypedText(midSeq.slice(0, i));
        }, afterFirstPopup + i * 65);
      }

      const afterMid = afterFirstPopup + midSeq.length * 65 + 250;
      const secondSeq = " and match our @bra";
      schedule(() => {
        setStage("typing_second");
        setTypedText("");
      }, afterMid);

      for (let i = 1; i <= secondSeq.length; i++) {
        schedule(() => {
          setTypedText(secondSeq.slice(0, i));
        }, afterMid + i * 60);
      }

      const afterSecondType = afterMid + secondSeq.length * 60 + 150;
      schedule(() => {
        setStage("popup_second");
      }, afterSecondType);

      const afterSecondPopup = afterSecondType + 900;
      schedule(() => {
        setStage("complete");
      }, afterSecondPopup);

      schedule(runCycle, afterSecondPopup + 3400);
    };

    const initId = setTimeout(runCycle, 3400);
    timers.push(initId);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const popupItems =
    stage === "popup_first"
      ? DRAWER_POPUP_ITEMS
      : stage === "popup_second"
        ? BRAND_POPUP_ITEMS
        : null;

  return (
    <div className="relative w-full" style={{ height: "378px" }}>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div style={{ width: "100%", maxWidth: "340px" }}>
          <div className="border-theme-border-02 bg-theme-product-editor relative rounded-lg border shadow-lg">
            {popupItems && (
              <div className="bg-theme-product-editor border-theme-border-02 absolute bottom-full left-3 z-30 mb-1.5 w-48 overflow-hidden rounded-md border p-1 shadow-md">
                {popupItems.map((item, idx) => (
                  <div
                    key={item}
                    className={`type-product-sm flex items-center gap-1.5 rounded px-2 py-1 ${
                      idx === 0
                        ? "bg-theme-bg-hover text-theme-text"
                        : "text-theme-text-sec"
                    }`}
                  >
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div
              className="text-theme-text type-product-lg min-h-[52px] w-full bg-transparent px-3 pt-2.5 pb-2"
              style={{ lineHeight: 1.8 }}
            >
              <style>{`
        .inline-tag-file {
          background-color: rgba(58, 106, 159, 0.15);
          color: #3A6A9F;
        }
        [data-theme="dark"] .inline-tag-file {
          background-color: rgba(139, 196, 248, 0.2);
          color: #8BC4F8;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .inline-tag-file {
            background-color: rgba(139, 196, 248, 0.2);
            color: #8BC4F8;
          }
        }
        .inline-tag-web {
          background-color: rgba(107, 114, 128, 0.12);
          color: #6B7280;
        }
        [data-theme="dark"] .inline-tag-web {
          background-color: rgba(156, 163, 175, 0.15);
          color: #9CA3AF;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .inline-tag-web {
            background-color: rgba(156, 163, 175, 0.15);
            color: #9CA3AF;
          }
        }
        .inline-tag-folder {
          background-color: rgba(58, 106, 159, 0.15);
          color: #3A6A9F;
        }
        [data-theme="dark"] .inline-tag-folder {
          background-color: rgba(139, 196, 248, 0.2);
          color: #8BC4F8;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .inline-tag-folder {
            background-color: rgba(139, 196, 248, 0.2);
            color: #8BC4F8;
          }
        }
      `}</style>

              {(stage === "typing_first" || stage === "popup_first") && (
                <span>{typedText}</span>
              )}

              {stage === "typing_mid" && (
                <>
                  <span>Make </span>
                  <span
                    className="inline-tag-file inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>drawer.tsx</span>
                  </span>
                  <span>{typedText}</span>
                </>
              )}

              {(stage === "typing_second" || stage === "popup_second") && (
                <>
                  <span>Make </span>
                  <span
                    className="inline-tag-file inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>drawer.tsx</span>
                  </span>
                  <span> use </span>
                  <span
                    className="inline-tag-web inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>vaul.emilkowal.ski</span>
                  </span>
                  <span>{typedText}</span>
                </>
              )}

              {stage === "complete" && (
                <>
                  <span>Make </span>
                  <span
                    className="inline-tag-file inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>drawer.tsx</span>
                  </span>
                  <span> use </span>
                  <span
                    className="inline-tag-web inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>vaul.emilkowal.ski</span>
                  </span>
                  <span> and match our </span>
                  <span
                    className="inline-tag-folder inline-flex items-center gap-0.5 rounded whitespace-nowrap"
                    style={{
                      fontSize: "inherit",
                      lineHeight: 1.4,
                      padding: "1px 6px",
                      verticalAlign: "baseline",
                    }}
                  >
                    <span>brand</span>
                  </span>
                </>
              )}
            </div>
            <div className="px-2 py-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="type-product-sm bg-theme-card-03-hex text-theme-text-sec flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75"
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
  );
}

interface CheckpointItem {
  label: string;
  time: string;
  offsetY: number;
  baseZIndex: number;
}

const CHECKPOINTS: CheckpointItem[] = [
  { label: "Set up Next.js project", time: "Jan 8", offsetY: -96, baseZIndex: 4 },
  { label: "Add Google OAuth", time: "Jan 12", offsetY: -64, baseZIndex: 5 },
  { label: "Build canvas editor", time: "Jan 18", offsetY: -32, baseZIndex: 6 },
  { label: "Add multiplayer", time: "Yesterday", offsetY: 0, baseZIndex: 7 },
  { label: "Improve performance", time: "3h ago", offsetY: 32, baseZIndex: 6 },
  { label: "Add keyboard shortcuts", time: "1h ago", offsetY: 64, baseZIndex: 5 },
  { label: "Ship to production", time: "Now", offsetY: 96, baseZIndex: 4 },
];

function CheckpointsDemo() {
  const [activeIndex, setActiveIndex] = useState<number>(3);

  return (
    <div className="relative flex h-[378px] w-full items-center justify-center overflow-hidden">
      <div
        className="aspect-1/1-box"
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full"
            style={{
              height: "40px",
              maxWidth: "350px",
              marginLeft: "16px",
              marginRight: "24px",
            }}
          >
            {CHECKPOINTS.map((item, idx) => {
              const isActive = idx === activeIndex;
              const zIndex = 7 - Math.abs(idx - activeIndex);
              const offsetSign = item.offsetY >= 0 ? "+" : "-";
              const absOffset = Math.abs(item.offsetY);

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute right-0 left-0 flex items-center"
                  style={{
                    top: "50%",
                    transform: `translateY(calc(-50% ${offsetSign} ${absOffset}px))`,
                    minHeight: "40px",
                    cursor: "pointer",
                    zIndex,
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <div style={{ width: "min(300px, 65%)", flexShrink: 0 }}>
                    <div
                      className="type-product-lg relative overflow-hidden rounded-md px-3 py-2"
                      style={{
                        border: isActive
                          ? "1px solid var(--color-theme-border-01)"
                          : "1px solid transparent",
                        transition: "0.2s ease-out",
                      }}
                    >
                      <div
                        className="media-light absolute inset-0 rounded-md"
                        style={{
                          backgroundColor: isActive
                            ? "var(--color-theme-product-editor)"
                            : "var(--color-theme-card-02-hex)",
                          zIndex: 0,
                        }}
                      />
                      <div
                        className="media-dark absolute inset-0 rounded-md"
                        style={{
                          backgroundColor: isActive
                            ? "var(--color-theme-product-editor)"
                            : "var(--color-theme-card-02-hex)",
                          zIndex: 0,
                        }}
                      />
                      <div className="relative z-10 flex items-center">
                        <span
                          className={`truncate ${
                            isActive ? "text-theme-text" : "text-theme-text-sec"
                          }`}
                          style={{
                            transition: "color 0.2s ease-out",
                            paddingRight: isActive ? "26px" : "0px",
                          }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <div
                            className="absolute top-1/2 flex-shrink-0 -translate-y-1/2"
                            style={{ right: "-6px" }}
                          >
                            <div className="bg-theme-bg-hover text-theme-text-sec flex items-center rounded p-1">
                              <svg
                                viewBox="0 0 44.6484 43.7578"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2.5 w-2.5"
                              >
                                <path d="M0 15.7734C0 16.3359 0.234375 16.875 0.703125 17.3203L14.4844 30.8438C14.8828 31.2656 15.4922 31.5 15.9844 31.5C17.25 31.5 18.0703 30.6562 18.0703 29.4375C18.0703 28.8281 17.8594 28.3828 17.5078 28.0078L10.7344 21.4219L4.125 15.7734L10.7344 10.1016L17.5078 3.51562C17.8594 3.14062 18.0703 2.69531 18.0703 2.08594C18.0703 0.867188 17.25 0.0234375 15.9844 0.0234375C15.4922 0.0234375 14.8828 0.257812 14.4844 0.679688L0.703125 14.2031C0.234375 14.6484 0 15.1875 0 15.7734ZM20.3672 41.6719C20.3672 42.8203 21.2109 43.7578 22.5 43.7578L27.9141 43.7578C38.3906 43.7578 44.2969 37.7812 44.2969 28.8047C44.2969 19.8516 38.2266 13.6641 27.5391 13.6641L11.7891 13.6641L4.03125 14.0156C3.07031 14.0625 2.29688 14.7891 2.29688 15.7734C2.29688 16.7344 3.07031 17.4609 4.03125 17.5078L11.7891 17.8594L27.8906 17.8594C35.8828 17.8594 40.1016 22.2656 40.1016 28.5703C40.1016 34.8984 35.8828 39.5859 27.8906 39.5859L22.5 39.5859C21.2109 39.5859 20.3672 40.5234 20.3672 41.6719Z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "16px", flexShrink: 0 }} />
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <span
                      className={`type-product-sm whitespace-nowrap ${
                        isActive
                          ? "text-theme-text font-medium"
                          : "text-theme-text-sec"
                      }`}
                      style={{ transition: "color 0.2s ease-out" }}
                    >
                      {item.time}
                    </span>
                    <div
                      style={{
                        width: isActive ? "20px" : "14px",
                        height: isActive ? "2px" : "1px",
                        backgroundColor: "var(--color-theme-text)",
                        opacity: isActive ? 1 : 0.3,
                        transition: "0.2s ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductMiddleSections() {
  return (
    <>
      <section className="section" id="workflows">
        <div className="container">
          <div className="mb-v2 max-w-prose text-left">
            <h2 className="type-md-lg text-balance">
              Spans the full development lifecycle
            </h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Cursor supports every phase from planning to writing to
                reviewing code.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="my-v2 container">
            <div className="gap-g1 mb-g1 grid grid-cols-1 items-stretch xl:grid-cols-3">
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Plan</h2>
                      <div className="text-theme-text-sec text-pretty">
                        For complex tasks, Cursor asks clarifying questions,
                        builds a plan, then executes in the background.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a href="/docs/agent/modes#plan" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
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
                        <PlanModeDemoFramed />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Design</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Visually edit any page by selecting an element to
                        instantly rewrite, resize, or move it.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a href="/docs/agent/browser" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container bg-theme-card-02-hex relative grid grid-cols-1 grid-rows-1">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <VisualEditingDemo />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Debug</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Cursor instruments your code and uses real execution
                        data to pinpoint the fix.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a href="/docs/agent/modes#debug" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container bg-theme-card-02-hex relative grid grid-cols-1 grid-rows-1">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <DebugDemo />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="section" id="capabilities">
        <div className="container">
          <div className="mb-v2 max-w-prose text-left">
            <h2 className="type-md-lg text-balance">
              Equipped to do real engineering
            </h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Cursor edits files, runs terminal commands, searches the web,
                and more.
              </div>
            </div>
          </div>
        </div>
        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="my-v2 container">
            <div className="gap-g1 mb-g1 grid grid-cols-1 items-stretch xl:grid-cols-3">
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Terminal</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Run shell commands directly from Cursor, from builds to
                        tests to installs. Sandboxed by default.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a href="/docs/agent/terminal" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container bg-theme-card-02-hex relative grid grid-cols-1 grid-rows-1">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <TerminalDemo />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Add context</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Point Cursor at exactly what matters with @-mentions and
                        image uploads for reference.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a href="/docs/context/mentions" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
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
                        <TagsDemo />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base flex max-w-prose grow flex-col">
                    <div>
                      <h2>Git &amp; checkpoints</h2>
                      <div className="text-theme-text-sec text-pretty">
                        See how your code has evolved, and roll back to a
                        previous snapshot anytime.
                      </div>
                    </div>
                    <div className="pt-v8/12 mt-auto">
                      <a
                        href="/docs/agent/overview#checkpoints"
                        className="btn-tertiary"
                      >
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container bg-theme-card-02-hex relative grid grid-cols-1 grid-rows-1">
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <CheckpointsDemo />
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
