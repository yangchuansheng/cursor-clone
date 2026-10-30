"use client";

import React, { useEffect, useState } from "react";
import { CLOUD_LOGO_GARDEN_HTML } from "./cloudLogoHtml";

interface AgentRun {
  id: string;
  group: "This Week" | "This Month";
  title: string;
  icon: "dot" | "spinner" | "pr-primary" | "pr-green";
  prompt: string;
  explored: string;
  reply: string;
  worked: string;
  terminalLines: string[];
  gitDiff: { file: string; added: string; removed: string }[];
  files: string[];
}

const AGENT_RUNS: AgentRun[] = [
  {
    id: "persona-onboarding",
    group: "This Week",
    title: "Persona onboarding flow",
    icon: "dot",
    prompt: "let's build an onboarding flow that segments by persona",
    explored: "onboarding routes, analytics, 6 files",
    reply:
      "On it. I'll add a persona picker, branch the setup steps for each path, and build tailored screens for 3 different personas.",
    worked: "Worked for 14m 22s",
    terminalLines: [
      "$ pnpm dev",
      "ready - started on 0.0.0.0:3000",
      "✓ compiled in 1.2s",
      "○ compiling /onboarding...",
      "✓ compiled in 340ms",
    ],
    gitDiff: [
      { file: "src/app/onboarding/page.tsx", added: "+142", removed: "-18" },
      { file: "src/components/PersonaPicker.tsx", added: "+88", removed: "-0" },
      { file: "src/lib/analytics/onboarding.ts", added: "+34", removed: "-6" },
    ],
    files: [
      "src/app/onboarding/page.tsx",
      "src/components/PersonaPicker.tsx",
      "src/lib/analytics/onboarding.ts",
      "e2e/onboarding.spec.ts",
    ],
  },
  {
    id: "checkout-e2e",
    group: "This Week",
    title: "End-to-end test suite for checkout",
    icon: "dot",
    prompt: "add Playwright e2e coverage for multi-currency checkout and Stripe webhooks",
    explored: "checkout routes, stripe handlers, 9 files",
    reply:
      "I'll spin up the local webhook listener, seed test fixtures for USD/EUR/GBP, and verify full checkout completion in headless Chromium.",
    worked: "Worked for 11m 08s",
    terminalLines: [
      "$ pnpm test:e2e checkout.spec.ts",
      "Running 6 tests using 2 workers",
      "✓ [chromium] › checkout USD flow (1.8s)",
      "✓ [chromium] › checkout EUR 3DS flow (2.4s)",
      "6 passed (7.1s)",
    ],
    gitDiff: [
      { file: "e2e/checkout.spec.ts", added: "+196", removed: "-12" },
      { file: "e2e/fixtures/stripe.ts", added: "+64", removed: "-0" },
    ],
    files: ["e2e/checkout.spec.ts", "e2e/fixtures/stripe.ts", "playwright.config.ts"],
  },
  {
    id: "postgres-planetscale",
    group: "This Month",
    title: "Migrate Postgres to PlanetScale",
    icon: "spinner",
    prompt: "migrate our connection pool and drizzle schema to PlanetScale Postgres",
    explored: "db client, migrations, 14 files",
    reply:
      "Updating Drizzle config, switching to serverless driver pooling, and running schema verification against a staging branch.",
    worked: "Worked for 19m 45s",
    terminalLines: [
      "$ pnpm db:migrate",
      "Connecting to aws-us-east-1.pg.psdb.cloud...",
      "✓ Applied 14 migrations in 620ms",
      "✓ Connection pool latency: 1.9ms",
    ],
    gitDiff: [
      { file: "src/db/client.ts", added: "+48", removed: "-39" },
      { file: "drizzle.config.ts", added: "+16", removed: "-11" },
    ],
    files: ["src/db/client.ts", "drizzle.config.ts", "src/db/schema.ts"],
  },
  {
    id: "auth-passkeys",
    group: "This Month",
    title: "Rewrite auth flow to passkeys",
    icon: "pr-primary",
    prompt: "support WebAuthn passkeys as primary sign-in with session fallback",
    explored: "auth middleware, session store, 8 files",
    reply:
      "Implemented WebAuthn registration and assertion ceremonies, updated the login modal, and verified virtual authenticator tests.",
    worked: "Worked for 16m 10s",
    terminalLines: [
      "$ pnpm test src/auth/passkey.test.ts",
      "PASS src/auth/passkey.test.ts",
      "✓ registers credential & verifies attestation (84ms)",
      "✓ signs in with discoverable passkey (41ms)",
    ],
    gitDiff: [
      { file: "src/auth/webauthn.ts", added: "+210", removed: "-0" },
      { file: "src/app/login/page.tsx", added: "+74", removed: "-52" },
    ],
    files: ["src/auth/webauthn.ts", "src/app/login/page.tsx", "src/auth/session.ts"],
  },
  {
    id: "multi-tenant",
    group: "This Month",
    title: "Add multi-tenant data isolation",
    icon: "pr-green",
    prompt: "enforce row-level security policies across all workspace tables",
    explored: "policies, workspace queries, 12 files",
    reply:
      "Added Postgres RLS policies scoped to current_setting('app.org_id') and wrapped request transactions with tenant context.",
    worked: "Worked for 22m 04s",
    terminalLines: [
      "$ pnpm test:rls",
      "✓ tenant A isolated from tenant B queries",
      "✓ cross-org mutation rejected by policy",
      "All 18 isolation checks passed",
    ],
    gitDiff: [
      { file: "migrations/0024_enable_rls.sql", added: "+118", removed: "-0" },
      { file: "src/db/tenantContext.ts", added: "+53", removed: "-8" },
    ],
    files: ["migrations/0024_enable_rls.sql", "src/db/tenantContext.ts"],
  },
  {
    id: "ios-kmp",
    group: "This Month",
    title: "Port iOS app to Kotlin Multiplatform",
    icon: "dot",
    prompt: "extract shared networking and offline sync engine into a KMP module",
    explored: "ios models, sync queue, 17 files",
    reply:
      "Extracted Ktor client and SQLDelight cache into sharedMain and generated XCFramework bindings for the SwiftUI shell.",
    worked: "Worked for 28m 31s",
    terminalLines: [
      "$ ./gradlew :shared:assembleXCFramework",
      "BUILD SUCCESSFUL in 9s",
      "✓ Linked SharedSync.xcframework (arm64, sim)",
    ],
    gitDiff: [
      { file: "shared/src/commonMain/SyncEngine.kt", added: "+245", removed: "-0" },
      { file: "iosApp/iosApp/SyncBridge.swift", added: "+62", removed: "-94" },
    ],
    files: ["shared/src/commonMain/SyncEngine.kt", "iosApp/iosApp/SyncBridge.swift"],
  },
  {
    id: "cicd-monorepo",
    group: "This Month",
    title: "Build CI/CD pipeline for monorepo",
    icon: "pr-primary",
    prompt: "configure Turborepo remote caching and affected-package matrix builds",
    explored: "workflows, turbo.json, 5 files",
    reply:
      "Configured GitHub Actions path filtering, remote cache signatures, and parallel shard runners.",
    worked: "Worked for 9m 50s",
    terminalLines: [
      "$ pnpm turbo run build test --filter=...[HEAD^1]",
      "• Packages in scope: @app/web, @app/api",
      "• Remote caching enabled (FULL TURBO)",
      "Tasks: 8 successful, 8 total (1.4s)",
    ],
    gitDiff: [
      { file: ".github/workflows/ci.yml", added: "+94", removed: "-41" },
      { file: "turbo.json", added: "+28", removed: "-9" },
    ],
    files: [".github/workflows/ci.yml", "turbo.json", "package.json"],
  },
];

const PERSONAS = [
  {
    id: "developer",
    cursorLeft: "47.0276%",
    cursorTop: "48.81%",
    pillWidths: ["18px", "22.6667px", "16px"],
    stepWidths: ["58%", "72%", "44%"],
    cardWidths: ["72%", "52%", "64%"],
    bars: ["62%", "42%"],
  },
  {
    id: "designer",
    cursorLeft: "56.4%",
    cursorTop: "48.81%",
    pillWidths: ["18px", "22.6667px", "16px"],
    stepWidths: ["74%", "50%", "66%"],
    cardWidths: ["56%", "78%", "48%"],
    bars: ["78%", "54%"],
  },
  {
    id: "founder",
    cursorLeft: "65.2%",
    cursorTop: "48.81%",
    pillWidths: ["18px", "22.6667px", "16px"],
    stepWidths: ["46%", "64%", "80%"],
    cardWidths: ["64%", "60%", "74%"],
    bars: ["48%", "76%"],
  },
] as const;

type RightTab = "Git" | "Desktop" | "Terminal" | "Files";

export function CloudHeroAndLogos() {
  const [activeRunId, setActiveRunId] = useState<string>(AGENT_RUNS[0].id);
  const [rightTab, setRightTab] = useState<RightTab>("Desktop");
  const [personaIdx, setPersonaIdx] = useState<number>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPersonaIdx((prev) => (prev + 1) % PERSONAS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  const activeRun = AGENT_RUNS.find((r) => r.id === activeRunId) ?? AGENT_RUNS[0];
  const activePersona = PERSONAS[personaIdx];

  const renderRunIcon = (icon: AgentRun["icon"]) => {
    if (icon === "spinner") {
      return (
        <span
          className="text-theme-text-sec shrink-0"
          style={{
            fontFamily: "CursorIcons16",
            fontSize: "14px",
            lineHeight: 1,
            display: "inline-block",
            width: "14px",
            height: "14px",
            textAlign: "center",
            mask: "conic-gradient(rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.15) 30%, black 100%)",
          }}
        >
          
        </span>
      );
    }
    if (icon === "pr-primary") {
      return (
        <span
          className="text-theme-text-ter group-hover/agent:text-theme-primary shrink-0 opacity-20 transition-all group-hover/agent:opacity-100"
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
          
        </span>
      );
    }
    if (icon === "pr-green") {
      return (
        <span
          className="text-theme-text-ter group-hover/agent:text-theme-product-ansi-green shrink-0 opacity-20 transition-all group-hover/agent:opacity-100"
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
          
        </span>
      );
    }
    return (
      <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <div className="bg-theme-text h-[6px] w-[6px] rounded-full opacity-15 transition-all group-hover/agent:bg-[#3b82f6] group-hover/agent:opacity-100" />
      </div>
    );
  };

  return (
    <>
      <section className="section bg-theme-bg text-theme-text">
        <div className="container">
          <div className="text-left mb-v2.5 max-w-prose-medium-wide">
            <h1 className="type-lg text-balance">The next level of autonomy</h1>
            <div className="flex justify-start mb-v1">
              <div className="type-lg text-theme-text-sec stack text-balance">
                Cloud agents control their own computers to build ambitious software.
              </div>
            </div>
            <div className="flex justify-start gap-x-g1 items-center">
              <a href="https://cursor.com/agents" className="btn">
                Try cloud agents
                <div aria-hidden="true" className="btn-icon">
                  <span aria-hidden="true">→</span>
                </div>
              </a>
            </div>
          </div>

          <div>
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
                <div className="relative w-full overflow-hidden" style={{ height: "680px" }}>
                  <div
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: "990px",
                      maxWidth: "calc(100% - 64px)",
                      height: "calc(100% - 96px)",
                      transform: "translate(calc(-50% + 0px), calc(-50% + 0px))",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 22px 70px 4px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className="bg-theme-product-chrome flex h-full w-full flex-col overflow-hidden rounded-[10px]"
                      style={{
                        boxShadow:
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15), 0 0 0 0.5px var(--color-theme-border-02)",
                      }}
                    >
                      <div
                        className="border-theme-border-02 relative flex h-11 shrink-0 items-center gap-3 border-b px-3 select-none"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          cursor: "grab",
                          touchAction: "none",
                        }}
                      >
                        <div className="media-light bg-theme-card-02-hex absolute inset-0" />
                        <div className="media-dark bg-theme-product-editor absolute inset-0" />
                        <div className="relative flex shrink-0 items-center gap-1.5">
                          <div className="bg-theme-fg-20 h-2.5 w-2.5 rounded-full" />
                          <div className="bg-theme-fg-20 h-2.5 w-2.5 rounded-full" />
                          <div className="bg-theme-fg-20 h-2.5 w-2.5 rounded-full" />
                        </div>
                        <div className="relative flex min-w-0 flex-1 justify-center">
                          <div
                            className="border-theme-border-02 bg-theme-card-02-hex flex max-w-[320px] min-w-0 flex-1 items-center justify-between gap-2.5 rounded-md border px-2.5 py-1"
                            style={{
                              borderColor:
                                "color-mix(in srgb, var(--color-theme-border-02) 60%, transparent)",
                            }}
                          >
                            <span
                              className="text-theme-text-ter shrink-0 opacity-40"
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
                              
                            </span>
                            <span className="text-theme-text-ter min-w-0 flex-1 truncate text-center text-[11px] opacity-60">
                              cursor.com/agents
                            </span>
                            <span
                              className="text-theme-text-ter shrink-0 opacity-40"
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
                              
                            </span>
                          </div>
                        </div>
                        <div className="relative w-12 shrink-0" />
                      </div>

                      <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[10px]">
                        <div className="relative flex h-full overflow-hidden">
                          <div className="hidden shrink-0 overflow-hidden xl:block">
                            <div className="h-full" style={{ width: "204px" }}>
                              <div className="border-theme-border-02 bg-theme-product-chrome flex h-full w-[204px] shrink-0 flex-col border-r">
                                <div className="flex items-center justify-between px-3 py-2.5">
                                  <svg
                                    className="text-theme-text h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 22"
                                    fill="none"
                                  >
                                    <g fill="currentColor">
                                      <path d="M19.162 5.452 10.698.565a.88.88 0 0 0-.879 0L1.356 5.452a.74.74 0 0 0-.37.64v9.853a.74.74 0 0 0 .37.64l8.464 4.887a.879.879 0 0 0 .879 0l8.464-4.886a.74.74 0 0 0 .37-.64V6.091a.74.74 0 0 0-.37-.64Zm-.531 1.035L10.46 20.639c-.055.095-.201.056-.201-.055v-9.266a.52.52 0 0 0-.26-.45L1.975 6.237c-.096-.056-.057-.202.054-.202h16.34c.233 0 .378.252.262.453Z" />
                                    </g>
                                  </svg>
                                </div>
                                <div className="flex-1 overflow-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                  {(["This Week", "This Month"] as const).map((groupName) => (
                                    <React.Fragment key={groupName}>
                                      <div className="type-product-sm text-theme-text-ter px-3 pt-3 pb-1 font-medium opacity-50 first:pt-0">
                                        {groupName}
                                      </div>
                                      {AGENT_RUNS.filter((r) => r.group === groupName).map((run) => {
                                        const isActive = run.id === activeRun.id;
                                        return (
                                          <div
                                            key={run.id}
                                            onClick={() => setActiveRunId(run.id)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setActiveRunId(run.id);
                                              }
                                            }}
                                            className={`group/agent mx-1.5 mb-0.5 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors ${
                                              isActive
                                                ? "bg-theme-card-hover-hex"
                                                : "hover:bg-theme-card-hover-hex/60"
                                            }`}
                                            role="button"
                                            tabIndex={0}
                                          >
                                            {renderRunIcon(run.icon)}
                                            <span
                                              className={`type-product-base min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-colors ${
                                                isActive
                                                  ? "text-theme-text"
                                                  : "text-theme-text-ter group-hover/agent:text-theme-text"
                                              }`}
                                              style={{
                                                maskImage:
                                                  "linear-gradient(to right, black 80%, transparent 100%)",
                                              }}
                                            >
                                              {run.title}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="overflow-hidden"
                            style={{
                              minWidth: "240px",
                              flex: "1 0 0px",
                              opacity: 1,
                            }}
                          >
                            <div className="bg-theme-product-chrome flex h-full flex-col">
                              <div className="flex items-center gap-2 px-4 py-2.5">
                                <span className="type-product-base text-theme-text font-medium">
                                  {activeRun.title}
                                </span>
                              </div>
                              <div className="relative flex min-h-0 flex-1 flex-col">
                                <div className="sticky top-0 z-10 shrink-0 px-4 pt-0">
                                  <div className="bg-theme-product-chrome">
                                    <div className="border-theme-border-02 bg-theme-card-02-hex rounded-[var(--radius-lg)] border px-2 py-2.5">
                                      <div className="type-product-lg text-theme-text text-[13px]">
                                        {activeRun.prompt}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="from-theme-product-chrome pointer-events-none h-2 bg-gradient-to-b to-transparent" />
                                </div>
                                <div className="relative min-h-0 flex-1">
                                  <div className="h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    <div className="px-4 pt-2 pb-3 max-xl:pt-0">
                                      <div className="space-y-1.5 pl-2">
                                        <div className="type-product-base text-theme-text-sec text-[12px] leading-snug">
                                          <span className="flex-shrink-0">Explored</span>{" "}
                                          <span className="opacity-60">{activeRun.explored}</span>
                                        </div>
                                        <div className="type-product-lg text-theme-text pt-0.5 text-[13px] leading-snug">
                                          {activeRun.reply}
                                        </div>
                                        <div className="type-product-base text-theme-text-sec pt-0.5 text-[12px] leading-snug">
                                          {activeRun.worked}
                                        </div>
                                        <div className="type-product-base text-theme-text-sec text-[12px] leading-snug">
                                          <span className="flex-shrink-0">Started</span>{" "}
                                          <span className="opacity-60">screen recording</span>
                                        </div>
                                        <div className="my-3 w-[66%] max-w-[260px] min-w-[180px]">
                                          <div aria-hidden="true" className="w-full aspect-[4/3]" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-theme-product-chrome relative z-40 p-4 pt-0">
                                  <div className="border-theme-border-02 bg-theme-product-editor rounded-[var(--radius-lg)] border">
                                    <div className="text-theme-text-sec type-product-base w-full bg-transparent px-2 pt-2 pb-1.5 text-[13px]">
                                      Add a follow up...
                                    </div>
                                    <div className="px-2 py-2 pt-1">
                                      <div className="flex items-center justify-between">
                                        <div className="relative">
                                          <button
                                            type="button"
                                            className="text-theme-text-sec type-product-sm hover:text-theme-text flex cursor-pointer items-center gap-0.5 rounded-md bg-transparent py-0.75 transition-colors"
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

                          <div className="hidden min-w-0 flex-1 min-[630px]:flex">
                            <div className="border-theme-border-02 bg-theme-product-chrome flex h-full min-w-0 flex-1 flex-col overflow-hidden border-l">
                              <div className="type-product-sm flex shrink-0 items-center gap-1.5 px-4 py-2.5">
                                {(["Git", "Desktop", "Terminal", "Files"] as const).map((tab) => {
                                  const isSelected = rightTab === tab;
                                  return (
                                    <button
                                      key={tab}
                                      type="button"
                                      aria-pressed={isSelected}
                                      onClick={() => setRightTab(tab)}
                                      className={`cursor-pointer rounded-full px-2 py-0.5 transition-colors ${
                                        isSelected
                                          ? "bg-theme-card-03-hex text-theme-text"
                                          : "text-theme-text-ter opacity-40 hover:text-theme-text hover:opacity-100"
                                      }`}
                                    >
                                      {tab}
                                    </button>
                                  );
                                })}
                                <div className="flex-1" />
                                <button
                                  type="button"
                                  onClick={() => setRightTab("Desktop")}
                                  className="text-theme-text-ter hover:bg-theme-card-hover-hex hover:text-theme-text flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors"
                                  aria-label="Expand panel"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                  >
                                    <path d="M220,48V96a12,12,0,0,1-24,0V77l-39.51,39.52a12,12,0,0,1-17-17L179,60H160a12,12,0,0,1,0-24h48A12,12,0,0,1,220,48ZM99.51,139.51,60,179V160a12,12,0,0,0-24,0v48a12,12,0,0,0,12,12H96a12,12,0,0,0,0-24H77l39.52-39.51a12,12,0,0,0-17-17Z" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 pt-0">
                                <div
                                  className="group/desktop relative max-h-full w-full overflow-hidden rounded-md aspect-[4/3]"
                                  style={
                                    {
                                      "--rd-base-width": "360px",
                                      "--rd-base-height": "270px",
                                      "--rd-content-scale": "1.0222222222222221",
                                    } as React.CSSProperties
                                  }
                                >
                                  <img
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    draggable={false}
                                    src="/sites/cursor/blob/assets/wallpapers/cloud-agents-2.webp"
                                  />

                                  {rightTab === "Git" && (
                                    <div className="bg-theme-product-editor/95 border-theme-border-02 absolute inset-3 z-20 flex flex-col rounded-md border p-3 font-mono text-[11px]">
                                      <div className="text-theme-text-sec mb-2 text-[10px] uppercase tracking-wider">
                                        Changes ({activeRun.gitDiff.length} files)
                                      </div>
                                      <div className="space-y-1.5">
                                        {activeRun.gitDiff.map((item) => (
                                          <div
                                            key={item.file}
                                            className="border-theme-border-02 bg-theme-card-02-hex flex items-center justify-between rounded border px-2 py-1.5"
                                          >
                                            <span className="text-theme-text truncate">
                                              {item.file}
                                            </span>
                                            <span className="ml-2 flex shrink-0 gap-1.5">
                                              <span className="text-emerald-500">{item.added}</span>
                                              <span className="text-rose-500">{item.removed}</span>
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {rightTab === "Terminal" && (
                                    <div className="bg-theme-product-editor/95 border-theme-border-02 absolute inset-3 z-20 flex flex-col rounded-md border p-3 font-mono text-[11px]">
                                      <div className="space-y-1">
                                        {activeRun.terminalLines.map((line, i) => (
                                          <div
                                            key={i}
                                            className={
                                              i === 0 ? "text-theme-text" : "text-theme-text-sec"
                                            }
                                          >
                                            {line}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {rightTab === "Files" && (
                                    <div className="bg-theme-product-editor/95 border-theme-border-02 absolute inset-3 z-20 flex flex-col rounded-md border p-3 font-mono text-[11px]">
                                      <div className="text-theme-text-sec mb-2 text-[10px] uppercase tracking-wider">
                                        Workspace Files
                                      </div>
                                      <div className="space-y-1">
                                        {activeRun.files.map((file) => (
                                          <div
                                            key={file}
                                            className="border-theme-border-02 bg-theme-card-02-hex text-theme-text rounded border px-2 py-1"
                                          >
                                            {file}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div
                                    className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px]"
                                    style={{
                                      top: "14%",
                                      left: "6%",
                                      width: "42%",
                                      height: "44%",
                                      zIndex: 2,
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                                    }}
                                  >
                                    <div
                                      className="flex origin-top-left flex-col"
                                      style={{
                                        width: "calc(var(--rd-base-width, 100%) * 0.42)",
                                        height: "calc(var(--rd-base-height, 100%) * 0.44)",
                                        transform: "scale(var(--rd-content-scale, 1))",
                                      }}
                                    >
                                      <div
                                        className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
                                        style={{
                                          borderBottom:
                                            "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                        }}
                                      >
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                      </div>
                                      <div
                                        className="flex-1 px-[4px] pt-[3px] pb-0"
                                        style={{
                                          fontFamily:
                                            "var(--font-berkeley-mono, var(--font-mono, ui-monospace, monospace))",
                                          fontSize: "5px",
                                          lineHeight: 1.35,
                                          letterSpacing: "-0.02em",
                                          color: "var(--color-theme-fg)",
                                        }}
                                      >
                                        <div className="space-y-[1px] whitespace-nowrap">
                                          {activeRun.terminalLines.map((line, idx) => (
                                            <div
                                              key={idx}
                                              style={{ opacity: idx === 0 ? 0.4 : 0.25 }}
                                            >
                                              {line}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px]"
                                    style={{
                                      top: "22%",
                                      left: "38%",
                                      width: "52%",
                                      height: "56%",
                                      zIndex: 4,
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.25) 0px 4px 16px, rgba(0, 0, 0, 0.15) 0px 0px 0px 0.5px",
                                    }}
                                  >
                                    <div
                                      className="flex origin-top-left flex-col"
                                      style={{
                                        width: "calc(var(--rd-base-width, 100%) * 0.52)",
                                        height: "calc(var(--rd-base-height, 100%) * 0.56)",
                                        transform: "scale(var(--rd-content-scale, 1))",
                                      }}
                                    >
                                      <div
                                        className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
                                        style={{
                                          borderBottom:
                                            "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                                        }}
                                      >
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                        <div
                                          className="h-[3px] w-[3px] rounded-full"
                                          style={{
                                            backgroundColor: "var(--color-theme-fg)",
                                            opacity: 0.15,
                                          }}
                                        />
                                      </div>
                                      <div className="bg-theme-card-hex flex flex-1 flex-col overflow-hidden p-[5px]">
                                        <div className="mb-[4px] flex items-center justify-between">
                                          <div className="space-y-[2px]">
                                            <div className="bg-theme-text h-[3px] w-[34px] rounded-full opacity-[0.18]" />
                                            <div className="bg-theme-text h-[2px] w-[24px] rounded-full opacity-10" />
                                          </div>
                                          <div className="flex gap-[1.5px]">
                                            <div className="bg-theme-text h-[3px] w-[9px] rounded-full opacity-[0.24]" />
                                            <div className="bg-theme-text h-[3px] w-[9px] rounded-full opacity-[0.12]" />
                                            <div className="bg-theme-text h-[3px] w-[9px] rounded-full opacity-[0.12]" />
                                          </div>
                                        </div>
                                        <div className="h-full min-h-0">
                                          <div className="flex h-full min-h-0 flex-col gap-[5px]">
                                            <div className="flex items-center justify-between">
                                              <div className="border-theme-border-02 bg-theme-card-02-hex rounded-full border px-[5px] py-[2px]">
                                                <div className="bg-theme-text h-[2px] w-[12px] rounded-full opacity-[0.16]" />
                                              </div>
                                              <div className="flex gap-[2px]">
                                                {activePersona.pillWidths.map((w, pIdx) => (
                                                  <div
                                                    key={PERSONAS[pIdx].id}
                                                    onClick={() => setPersonaIdx(pIdx)}
                                                    className={`border-theme-border-02 cursor-pointer rounded-full border px-[4px] py-[2px] transition-colors ${
                                                      personaIdx === pIdx
                                                        ? "bg-theme-card-03-hex"
                                                        : "bg-theme-card-02-hex"
                                                    }`}
                                                  >
                                                    <div
                                                      className={`bg-theme-text h-[2px] rounded-full ${
                                                        personaIdx === pIdx
                                                          ? "opacity-[0.2]"
                                                          : "opacity-[0.08]"
                                                      }`}
                                                      style={{ width: w }}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                            <div className="grid min-h-0 flex-1 grid-cols-[0.85fr_1.15fr] gap-[5px]">
                                              <div className="border-theme-border-02 bg-theme-card-02-hex rounded-[4px] border p-[5px]">
                                                <div className="mb-[5px] space-y-[2px]">
                                                  <div className="bg-theme-text h-[2.5px] w-[54%] rounded-full opacity-[0.16]" />
                                                  <div className="bg-theme-text h-[2px] w-[38%] rounded-full opacity-[0.08]" />
                                                </div>
                                                <div className="space-y-[4px]">
                                                  {activePersona.stepWidths.map((sw, sIdx) => (
                                                    <div
                                                      key={sIdx}
                                                      className="border-theme-border-02 rounded-[3px] border px-[4px] py-[3px]"
                                                    >
                                                      <div className="flex items-center gap-[3px]">
                                                        <div
                                                          className={`bg-theme-text size-[4px] rounded-full ${
                                                            sIdx === personaIdx
                                                              ? "opacity-[0.22]"
                                                              : "opacity-[0.12]"
                                                          }`}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                          <div
                                                            className="bg-theme-text h-[2px] rounded-full opacity-[0.13] transition-all duration-300"
                                                            style={{ width: sw }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                              <div className="flex min-w-0 flex-col gap-[5px]">
                                                <div className="border-theme-border-02 bg-theme-card-02-hex rounded-[4px] border p-[5px]">
                                                  <div className="mb-[5px] flex items-center justify-between">
                                                    <div className="space-y-[2px]">
                                                      <div className="bg-theme-text h-[2.5px] w-[30px] rounded-full opacity-[0.16]" />
                                                      <div className="bg-theme-text h-[2px] w-[20px] rounded-full opacity-[0.08]" />
                                                    </div>
                                                    <div className="bg-theme-text h-[4px] w-[14px] rounded-full opacity-[0.12]" />
                                                  </div>
                                                  <div className="grid grid-cols-3 gap-[3px]">
                                                    {activePersona.cardWidths.map((cw, cIdx) => (
                                                      <div
                                                        key={cIdx}
                                                        className="bg-theme-card-03-hex rounded-[3px] p-[3px]"
                                                      >
                                                        <div
                                                          className="bg-theme-text mb-[4px] h-[8px] rounded-[2px] opacity-10 transition-all duration-300"
                                                          style={{ width: cw }}
                                                        />
                                                        <div className="bg-theme-text h-[2px] w-[70%] rounded-full opacity-10" />
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                                <div className="grid flex-1 grid-cols-2 gap-[4px]">
                                                  {activePersona.bars.map((bw, bIdx) => (
                                                    <div
                                                      key={bIdx}
                                                      className="border-theme-border-02 rounded-[4px] border p-[4px]"
                                                    >
                                                      <div
                                                        className="bg-theme-text mb-[3px] h-[3px] rounded-full opacity-20"
                                                        style={{ width: bIdx === 0 ? "60%" : "70%" }}
                                                      />
                                                      <div className="bg-theme-card-03-hex h-[9px] rounded-[3px]">
                                                        <div
                                                          className="bg-theme-text h-full rounded-[3px] opacity-10 transition-all duration-300"
                                                          style={{ width: bw }}
                                                        />
                                                      </div>
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

                                  <div
                                    className="pointer-events-none absolute z-20 mt-1.5 transition-all duration-500"
                                    style={{
                                      left: activePersona.cursorLeft,
                                      top: activePersona.cursorTop,
                                    }}
                                  >
                                    <div className="flex items-start gap-0">
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        data-cursor-arrow=""
                                        className="-scale-x-100 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)] shrink-0 transition-opacity duration-200"
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
                                      <span className="mt-2.5 -ml-0.5 whitespace-nowrap rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                                        Agent
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    className="absolute inset-0 z-25 flex cursor-pointer items-center justify-center"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      setPersonaIdx((prev) => (prev + 1) % PERSONAS.length)
                                    }
                                    aria-label="Take control"
                                  >
                                    <div className="rd-interactive pointer-events-none flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-[8px] transition-all group-hover/desktop:scale-105 group-hover/desktop:bg-black/60 scale-95 opacity-0 group-hover/desktop:scale-110 group-hover/desktop:opacity-100">
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="-scale-x-100"
                                      >
                                        <path
                                          d="M7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                                          fill="white"
                                        />
                                      </svg>
                                      Take control
                                    </div>
                                  </div>

                                  <div
                                    className="absolute left-1/2 z-10 bottom-1.5"
                                    style={{
                                      transform:
                                        "translateX(-50%) scale(var(--rd-content-scale, 1))",
                                      transformOrigin: "center bottom",
                                    }}
                                  >
                                    <div className="rd-interactive flex items-center bg-black/15 ring-1 ring-white/10 backdrop-blur-[6px] backdrop-saturate-150 gap-1 rounded-lg px-1.5 py-1">
                                      <div className="flex cursor-pointer items-center justify-center transition-all duration-300 bg-white/20 size-5 rounded-[6px]">
                                        <div className="flex items-center justify-center transition-all duration-300 opacity-40 [&_span]:!h-[11px] [&_span]:!w-[11px] [&_span]:!text-[11px]">
                                          <span
                                            className="text-white"
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "16px",
                                              lineHeight: 1,
                                              display: "inline-block",
                                              width: "16px",
                                              height: "16px",
                                              textAlign: "center",
                                            }}
                                          >
                                            
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex cursor-pointer items-center justify-center transition-all duration-300 bg-white/20 size-5 rounded-[6px]">
                                        <div className="flex items-center justify-center transition-all duration-300 opacity-40 [&_span]:!h-[11px] [&_span]:!w-[11px] [&_span]:!text-[11px]">
                                          <span
                                            className="text-white"
                                            style={{
                                              fontFamily: "CursorIcons16",
                                              fontSize: "16px",
                                              lineHeight: 1,
                                              display: "inline-block",
                                              width: "16px",
                                              height: "16px",
                                              textAlign: "center",
                                            }}
                                          >
                                            
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
      </section>
      <div dangerouslySetInnerHTML={{ __html: CLOUD_LOGO_GARDEN_HTML }} />
    </>
  );
}
