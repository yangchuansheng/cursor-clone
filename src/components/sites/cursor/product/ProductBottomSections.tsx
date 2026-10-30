"use client";

import React, { useEffect, useState } from "react";
import { ChangelogSection } from "../ChangelogSection";

interface SkillOption {
  command: string;
  description: string;
}

const SKILL_OPTIONS: SkillOption[] = [
  {
    command: "/fix-merge-conflicts",
    description: "Resolve git conflicts automatically",
  },
  {
    command: "/code-review",
    description: "Analyze code for issues and improvements",
  },
  {
    command: "/apply-notion-styleguide",
    description: "Format code to match team standards",
  },
  {
    command: "/pr",
    description: "Create a pull request with summary",
  },
  {
    command: "/test",
    description: "Generate unit tests for selected code",
  },
];

interface QuoteItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const SOCIAL_PROOF_QUOTES: QuoteItem[] = [
  {
    quote:
      "Watching a dozen agent branches merge every day has become normal, and that freed-up velocity shows up everywhere from release cadence to bug-backlog burn-down. Cursor isn't a convenience add-on; it's a scale-multiplier for the whole org.",
    author: "Cody De Arkland",
    role: "Senior Director, Sentry",
    avatar: "/sites/cursor/blob/assets/avatars/cody-de-arkland-avatar.jpeg",
  },
  {
    quote:
      "I will never not be amazed to be merging PRs while riding Peloton. I'm never touching a laptop again.",
    author: "Nick Dobos",
    role: "Prompt Engineer, The Browser Company",
    avatar: "/sites/cursor/blob/assets/avatars/nick-dobos-avatar.jpeg",
  },
  {
    quote:
      "Leave it to the folks at Cursor to bring out the absolute most from the models. GPT-5.2 is an incredibly hard-working model, but to get it to work for a whole week is crazy. Building a whole browser is even crazier!",
    author: "Sherwin Wu",
    role: "Head of Engineering, OpenAI",
    avatar: "/sites/cursor/blob/assets/avatars/sherwin-wu-avatar.jpg",
  },
  {
    quote:
      "Coding agents like Cursor have become the killer app for AI. Not only do coding agents increase the speed at which code is created, they also improve code quality.",
    author: "Alexis\u00A0Lê-Quôc",
    role: "CTO\u00A0& Co-Founder, Datadog",
    avatar: "/sites/cursor/blob/assets/avatars/alexis-le-quoc-avatar.webp",
  },
  {
    quote:
      "Cursor has helped me not only be more productive but also more curious and confident to explore new problem spaces. It's genuinely become an indispensable tool in my daily workflow.",
    author: "Lathesh\u00A0Karkera",
    role: "Software Engineer, eBay",
    avatar: "/sites/cursor/blob/assets/avatars/lathesh-karkera-avatar.jpeg",
  },
  {
    quote:
      "More than 70% of our engineers now use Cursor, and we've seen meaningful gains in day-to-day development, faster execution on large-scale migrations, increased rate of debugging, and even faster onboarding.",
    author: "James\u00A0Reggio",
    role: "CTO, Brex",
    avatar: "/sites/cursor/blob/assets/avatars/james-reggio-avatar.jpeg",
  },
];

type SkillsStage =
  | {
      kind: "final_dropdown";
      highlightedSkillIndex: number;
    }
  | {
      kind: "typing_initial";
      text: string;
      showSlash: boolean;
      showDropdown: boolean;
      highlightedSkillIndex: number;
    }
  | {
      kind: "typing_followup";
      suffix: string;
      showSlash: boolean;
    };

const SKILLS_SEQUENCE: Array<{ stage: SkillsStage; durationMs: number }> = [
  {
    stage: { kind: "final_dropdown", highlightedSkillIndex: 0 },
    durationMs: 3200,
  },
  {
    stage: {
      kind: "typing_initial",
      text: "let's ",
      showSlash: false,
      showDropdown: false,
      highlightedSkillIndex: 0,
    },
    durationMs: 550,
  },
  {
    stage: {
      kind: "typing_initial",
      text: "let's ",
      showSlash: true,
      showDropdown: true,
      highlightedSkillIndex: 0,
    },
    durationMs: 700,
  },
  {
    stage: {
      kind: "typing_initial",
      text: "let's ",
      showSlash: true,
      showDropdown: true,
      highlightedSkillIndex: 2,
    },
    durationMs: 850,
  },
  {
    stage: {
      kind: "typing_followup",
      suffix: " and ",
      showSlash: false,
    },
    durationMs: 550,
  },
  {
    stage: {
      kind: "typing_followup",
      suffix: " and ",
      showSlash: true,
    },
    durationMs: 350,
  },
];

function AgentComposerFooter() {
  return (
    <div className="px-2 py-2 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-theme-card-03-hex type-product-sm text-theme-text-sec flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24.7969 11.3555"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-60"
            >
              <path d="M0 5.67188C0 9.11719 2.13281 11.3438 5.30859 11.3438C6.98438 11.3438 8.41406 10.6406 9.9375 9.17578L12.2227 6.96094L14.5078 9.17578C16.0312 10.6406 17.4609 11.3438 19.1367 11.3438C22.3125 11.3438 24.4453 9.11719 24.4453 5.67188C24.4453 2.22656 22.3125 0 19.1367 0C17.4609 0 16.0312 0.703125 14.5078 2.16797L12.2227 4.38281L9.9375 2.16797C8.41406 0.703125 6.98438 0 5.30859 0C2.13281 0 0 2.22656 0 5.67188ZM1.91016 5.67188C1.91016 3.36328 3.28125 1.91016 5.30859 1.91016C6.44531 1.91016 7.45312 2.44922 8.60156 3.52734L10.8867 5.67188L8.60156 7.81641C7.45312 8.89453 6.44531 9.43359 5.30859 9.43359C3.28125 9.43359 1.91016 7.98047 1.91016 5.67188ZM13.5586 5.67188L15.8438 3.52734C16.9922 2.44922 18 1.91016 19.1367 1.91016C21.1641 1.91016 22.5352 3.36328 22.5352 5.67188C22.5352 7.98047 21.1641 9.43359 19.1367 9.43359C18 9.43359 16.9922 8.89453 15.8438 7.81641Z"></path>
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
              <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z"></path>
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
              <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z"></path>
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
            <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ProductBottomSections() {
  const [hoveredPluginIdx, setHoveredPluginIdx] = useState<number>(0);
  const [skillsStepIdx, setSkillsStepIdx] = useState<number>(0);
  const [hoveredSkillIdx, setHoveredSkillIdx] = useState<number | null>(null);

  useEffect(() => {
    const current = SKILLS_SEQUENCE[skillsStepIdx];
    const timer = window.setTimeout(() => {
      setSkillsStepIdx((prev) => (prev + 1) % SKILLS_SEQUENCE.length);
    }, current.durationMs);
    return () => window.clearTimeout(timer);
  }, [skillsStepIdx]);

  const currentSkillsStage = SKILLS_SEQUENCE[skillsStepIdx].stage;
  const showSkillsDropdown =
    currentSkillsStage.kind === "final_dropdown" ||
    (currentSkillsStage.kind === "typing_initial" &&
      currentSkillsStage.showDropdown);
  const activeSkillIndex =
    hoveredSkillIdx ??
    (currentSkillsStage.kind === "final_dropdown"
      ? currentSkillsStage.highlightedSkillIndex
      : currentSkillsStage.kind === "typing_initial"
        ? currentSkillsStage.highlightedSkillIndex
        : 0);

  return (
    <>
      {/* Section 5 — #extensibility */}
      <section className="section" id="extensibility">
        <div className="container">
          <div className="text-left mb-v2 max-w-prose">
            <h2 className="type-md-lg text-balance">
              Extend with tools and knowledge
            </h2>
            <div className="flex justify-start">
              <div className="type-md-lg text-theme-text-sec stack text-balance">
                Give Cursor your existing context, and add custom capabilities.
              </div>
            </div>
          </div>
        </div>

        <section className="section bg-theme-bg text-theme-text section--flush">
          <div className="container my-v2">
            <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
              {/* Card 0: Plugins */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Plugins</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Browse and install community-built plugins to extend
                        Cursor with new capabilities.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/context/skills" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#D9D5CF",
                          "--layered-media-bg-dark": "#747066",
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
                          className="relative flex w-full items-center justify-center overflow-hidden bg-theme-card-02-hex"
                          style={{ height: "378px" }}
                        >
                          <div
                            className="w-full max-w-[340px] px-4"
                            style={{ marginTop: "-160px" }}
                          >
                            <div className="relative w-full">
                              <div className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg">
                                <div
                                  className="text-theme-text type-product-lg w-full min-h-[52px] bg-transparent px-3 pt-2.5 pb-2"
                                  style={{ lineHeight: 1.8 }}
                                >
                                  <span style={{ color: "rgb(201, 162, 39)" }}>
                                    /add-plugin
                                  </span>
                                  <span
                                    className="inline-block h-[1em] w-[1.5px] bg-theme-text align-middle animate-pulse"
                                    style={{ marginLeft: "1px" }}
                                  />
                                </div>
                                <AgentComposerFooter />
                              </div>

                              <div
                                className="absolute left-3 z-10"
                                style={{ top: "2.25rem" }}
                              >
                                <div
                                  className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg overflow-hidden"
                                  style={{ width: "280px" }}
                                >
                                  <div className="px-2.5 pt-2 pb-1">
                                    <div className="type-product-sm text-theme-text-sec">
                                      Add plugin
                                    </div>
                                  </div>
                                  <div className="px-1 pb-1">
                                    {/* Row 0: Slack Messaging Kit */}
                                    <div
                                      onMouseEnter={() => setHoveredPluginIdx(0)}
                                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors"
                                      style={
                                        hoveredPluginIdx === 0
                                          ? {
                                              backgroundColor:
                                                "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-theme-card-02-hex">
                                        <svg
                                          viewBox="-2.45 0 2452.5 2452.5"
                                          className="h-4 w-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                          >
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
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="type-product-lg leading-snug text-theme-text truncate">
                                          Slack Messaging Kit
                                        </div>
                                      </div>
                                    </div>

                                    {/* Row 1: Figma Visual Editor */}
                                    <div
                                      onMouseEnter={() => setHoveredPluginIdx(1)}
                                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors"
                                      style={
                                        hoveredPluginIdx === 1
                                          ? {
                                              backgroundColor:
                                                "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-theme-card-02-hex">
                                        <svg
                                          viewBox="0 0 200 300"
                                          className="h-3.5 w-3.5"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fill="#0acf83"
                                            d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"
                                          />
                                          <path
                                            fill="#a259ff"
                                            d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"
                                          />
                                          <path
                                            fill="#f24e1e"
                                            d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"
                                          />
                                          <path
                                            fill="#ff7262"
                                            d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"
                                          />
                                          <path
                                            fill="#1abcfe"
                                            d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"
                                          />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="type-product-lg leading-snug text-theme-text truncate">
                                          Figma Visual Editor
                                        </div>
                                      </div>
                                    </div>

                                    {/* Row 2: Notion Workspace Integration */}
                                    <div
                                      onMouseEnter={() => setHoveredPluginIdx(2)}
                                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors"
                                      style={
                                        hoveredPluginIdx === 2
                                          ? {
                                              backgroundColor:
                                                "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-theme-card-02-hex">
                                        <svg
                                          viewBox="0 0 100 100"
                                          fill="none"
                                          className="h-4 w-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
                                            fill="#fff"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
                                            fill="#000"
                                          />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="type-product-lg leading-snug text-theme-text truncate">
                                          Notion Workspace Integration
                                        </div>
                                      </div>
                                    </div>

                                    {/* Row 3: Linear Agent Excellence */}
                                    <div
                                      onMouseEnter={() => setHoveredPluginIdx(3)}
                                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors"
                                      style={
                                        hoveredPluginIdx === 3
                                          ? {
                                              backgroundColor:
                                                "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-theme-card-02-hex">
                                        <svg
                                          viewBox="0 0 100 100"
                                          fill="none"
                                          className="h-3.5 w-3.5 text-theme-text"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                                          />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="type-product-lg leading-snug text-theme-text truncate">
                                          Linear Agent Excellence
                                        </div>
                                      </div>
                                    </div>

                                    {/* Row 4: GitHub Actions Suite */}
                                    <div
                                      onMouseEnter={() => setHoveredPluginIdx(4)}
                                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors"
                                      style={
                                        hoveredPluginIdx === 4
                                          ? {
                                              backgroundColor:
                                                "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                            }
                                          : undefined
                                      }
                                    >
                                      <div className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-theme-card-02-hex">
                                        <svg
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          className="h-4 w-4 text-theme-text"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="type-product-lg leading-snug text-theme-text truncate">
                                          GitHub Actions Suite
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

              {/* Card 1: Skills */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Skills</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Add domain knowledge to let Cursor discover and run
                        specialized prompts and code.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/context/skills" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#CFCEBC",
                          "--layered-media-bg-dark": "#5C5743",
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
                          className="relative flex w-full items-center justify-center overflow-hidden"
                          style={{ height: "378px" }}
                        >
                          <div
                            className="w-full max-w-[340px] px-4"
                            style={{ marginTop: "-160px" }}
                          >
                            <div className="relative w-full">
                              <div className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg">
                                <div
                                  className="text-theme-text type-product-lg w-full min-h-[52px] bg-transparent px-3 pt-2.5 pb-2"
                                  style={{ lineHeight: 1.8 }}
                                >
                                  {currentSkillsStage.kind ===
                                  "typing_initial" ? (
                                    <>
                                      <span>{currentSkillsStage.text}</span>
                                      {currentSkillsStage.showSlash && (
                                        <span
                                          style={{ color: "rgb(201, 162, 39)" }}
                                        >
                                          /
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <span>let&apos;s </span>
                                      <span
                                        className="rounded whitespace-nowrap"
                                        style={{
                                          fontSize: "inherit",
                                          lineHeight: "inherit",
                                          padding: "2px 5px",
                                          backgroundColor:
                                            "rgba(201, 162, 39, 0.15)",
                                          color: "#C9A227",
                                        }}
                                      >
                                        <span>/apply-notion-styleguide</span>
                                      </span>
                                      <span>
                                        {currentSkillsStage.kind ===
                                        "typing_followup"
                                          ? currentSkillsStage.suffix
                                          : " and "}
                                      </span>
                                      {(currentSkillsStage.kind ===
                                        "final_dropdown" ||
                                        currentSkillsStage.showSlash) && (
                                        <span
                                          style={{ color: "rgb(201, 162, 39)" }}
                                        >
                                          /
                                        </span>
                                      )}
                                    </>
                                  )}
                                  <span
                                    className="inline-block h-[1em] w-[1.5px] bg-theme-text align-middle"
                                    style={{ marginLeft: "1px" }}
                                  />
                                </div>
                                <AgentComposerFooter />
                              </div>

                              {showSkillsDropdown && (
                                <div
                                  className="absolute left-3 z-10"
                                  style={{ top: "2.25rem" }}
                                >
                                  <div
                                    className="border-theme-border-02 bg-theme-product-editor rounded-lg border shadow-lg overflow-hidden"
                                    style={{
                                      width: "280px",
                                      opacity: 1,
                                      transform: "none",
                                    }}
                                  >
                                    <div className="px-2.5 pt-2 pb-1">
                                      <div className="type-product-sm text-theme-text-sec">
                                        Skills
                                      </div>
                                    </div>
                                    <div
                                      className="px-1 overflow-hidden"
                                      style={{ maxHeight: "200px" }}
                                      onMouseLeave={() =>
                                        setHoveredSkillIdx(null)
                                      }
                                    >
                                      {SKILL_OPTIONS.map((skill, idx) => (
                                        <div
                                          key={skill.command}
                                          onMouseEnter={() =>
                                            setHoveredSkillIdx(idx)
                                          }
                                          className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors"
                                          style={
                                            activeSkillIndex === idx
                                              ? {
                                                  backgroundColor:
                                                    "color-mix(in srgb, var(--color-theme-card-hover-hex) 50%, transparent)",
                                                }
                                              : undefined
                                          }
                                        >
                                          <div className="flex-1 min-w-0">
                                            <div className="type-product-lg leading-snug text-theme-text truncate">
                                              {skill.command}
                                            </div>
                                            <div className="type-product-sm leading-snug text-theme-text-ter opacity-60 truncate">
                                              {skill.description}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 2: MCP */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>MCP</h2>
                      <div className="text-theme-text-sec text-pretty">
                        Connect external tools and data sources like GitHub and
                        Figma directly to Cursor.
                      </div>
                    </div>
                    <div className="mt-auto pt-v8/12">
                      <a href="/docs/context/mcp" className="btn-tertiary">
                        Learn more →
                      </a>
                    </div>
                  </div>
                  <figure className="pt-g1.75">
                    <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-03-hex">
                      <div className="relative z-1 col-span-full row-span-full overflow-hidden">
                        <img
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="media-light absolute inset-0 h-full w-full object-cover"
                          src="/sites/cursor/blob/assets/misc/asset-50ffc1473a64f3b6ee74.png"
                        />
                        <img
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="media-dark absolute inset-0 h-full w-full object-cover"
                          src="/sites/cursor/blob/assets/misc/asset-3ac50061b7174e3b941e.png"
                        />
                      </div>
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="relative h-[378px] w-full">
                          <img
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-contain"
                            src="/sites/cursor/blob/assets/misc/asset-a8b297cd3acacb16cb9e.png"
                          />
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

      {/* Section 6 — #social-proof */}
      <section className="section bg-theme-bg text-theme-text" id="social-proof">
        <div className="container">
          <div className="text-center mx-auto mb-v2.5 max-w-prose-medium-wide">
            <h2 className="type-lg text-balance mx-auto">
              Trusted by the world&apos;s best developers
            </h2>
          </div>
          <div className="gap-g1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_PROOF_QUOTES.map((item) => (
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
                        src={item.avatar}
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

      {/* Section 7 — Recent highlights */}
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
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.ai/news/grok-4-7"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        Introducing Grok 4.7
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        Our most capable model for long-running coding and
                        knowledge work.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="btn-tertiary">Read on x.ai ↗</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="flex grow-1 flex-col mb-g1">
                <a
                  className="card card--text grow-1 card--bg-02 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                  href="/blog/ios-mobile-app"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        Build from anywhere with Cursor for iOS
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        Cursor is available as a native iOS app on your phone,
                        now in public beta.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="capitalize">Product&nbsp;·&nbsp;</span>
                      <time
                        dateTime="2026-06-29T12:00:00.000Z"
                        className="type-base"
                      >
                        Jun 29, 2026
                      </time>
                    </div>
                  </div>
                </a>
              </article>

              <article className="flex grow-1 flex-col">
                <a
                  className="card card--text grow-1 card--bg-02 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                  href="/blog/design-mode"
                >
                  <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                    <div className="grow-1">
                      <p className="type-base text-theme-text text-pretty">
                        Direct agents with visual prompts in Design Mode
                      </p>
                      <p className="type-base text-theme-text-sec text-pretty">
                        Point, draw, or narrate UI changes in the browser while
                        agents edit the code underneath.
                      </p>
                    </div>
                    <div className="mt-v1 text-theme-text-sec flex shrink-0 items-center">
                      <span className="capitalize">Product&nbsp;·&nbsp;</span>
                      <time
                        dateTime="2026-06-05T00:00:00.000Z"
                        className="type-base"
                      >
                        Jun 5, 2026
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

      {/* Section 8 — Changelog */}
      <ChangelogSection />

      {/* Section 9 — Try Cursor now. */}
      <section className="section bg-theme-bg text-theme-text section--headline">
        <div className="container">
          <div className="text-center mx-auto max-w-prose-medium-wide">
            <h2 className="type-xl sm:type-2xl text-balance mx-auto mb-v1">
              Try Cursor now.
            </h2>
            <div className="flex justify-center gap-x-g1 items-center">
              <div>
                <div className="hidden items-center md:flex">
                  <a
                    className="btn"
                    href="https://api2.cursor.sh/updates/download/golden/darwin-arm64/cursor/3.27"
                  >
                    Download for macOS
                    <div aria-hidden="true" className="btn-icon">
                      <span className="icon-glyph-08" aria-hidden="true">
                        ⤓
                      </span>
                    </div>
                  </a>
                </div>
                <div className="flex items-center md:hidden">
                  <a href="/agents" className="btn">
                    Try mobile agent
                    <div aria-hidden="true" className="btn-icon">
                      <span aria-hidden="true">→</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
