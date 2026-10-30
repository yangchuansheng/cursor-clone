import React from "react";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import {
  AMPLITUDE_CARD_SVG,
  AUTOMATE_LOGO_GARDEN_HTML,
  RIPPLING_CARD_SVG,
} from "./automate/automateLogoHtml";

const LOGO_GARDEN_INNER_HTML = AUTOMATE_LOGO_GARDEN_HTML.replace(
  /^<section[^>]*>|<\/section>$/g,
  ""
);

interface SelfDrivingCard {
  title: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  bgLight?: string;
  bgDark?: string;
  bgLightRgb?: string;
  bgDarkRgb?: string;
  warmCard?: boolean;
}

const SELF_DRIVING_CARDS: SelfDrivingCard[] = [
  {
    title: "Improve code quality",
    description:
      "Agents autonomously investigate incidents, detect and fix bugs, and generate tests.",
    imgSrc: "/marketing-static/automate/card-code-quality.png",
    imgAlt: "Find vulnerabilities automation configuration",
    bgLight: "#B6B9BE",
    bgDark: "#3C3935",
    bgLightRgb: "rgb(182, 185, 190)",
    bgDarkRgb: "rgb(60, 57, 53)",
  },
  {
    title: "Speed up time to merge",
    description:
      "Agents independently analyze PR risk, triage and fix CVEs, and respond to reviews with fixes.",
    imgSrc: "/marketing-static/automate/card-time-to-merge.png",
    imgAlt: "Assign PR reviewers automation configuration",
    bgLight: "#D9D5CF",
    bgDark: "#4A443B",
    bgLightRgb: "rgb(217, 213, 207)",
    bgDarkRgb: "rgb(74, 68, 59)",
  },
  {
    title: "Improve codebase knowledge",
    description:
      "Agents regularly share data updates, produce codebase digests, and update docs.",
    imgSrc: "/marketing-static/automate/card-codebase-knowledge.png",
    imgAlt: "Summarize changes daily automation configuration",
    warmCard: true,
  },
];

interface TemplateCard {
  title: string;
  description: string;
  href: string;
}

const TEMPLATE_CARDS: TemplateCard[] = [
  {
    title: "Daily digest of repo changes",
    description:
      "Set up an agent that posts a daily digest summarizing notable repository changes and new risks introduced.",
    href: "https://cursor.com/marketplace/automations/daily-digest",
  },
  {
    title: "Automatic test coverage",
    description:
      "Create an automation to review every new commit and add tests for high-risk logic to improve test coverage.",
    href: "https://cursor.com/marketplace/automations/add-test-coverage",
  },
  {
    title: "Bugs in Slack → PRs with fixes",
    description:
      "Set up an agent to monitor Slack for bug reports, conduct investigations, and return PRs for simple fixes.",
    href: "https://cursor.com/marketplace/automations/fix-slack-bugs",
  },
  {
    title: "Assess PR risk → Assign reviewers",
    description:
      "Create an automation to review code changes, determine blast radius for risk rating, assign reviewers, and automatically approve low-risk PRs.",
    href: "https://cursor.com/marketplace/automations/assign-pr-reviewers",
  },
  {
    title: "Investigate production errors",
    description:
      "Set up an agent to investigate production errors from Datadog, identify root causes, and propose fixes in a PR.",
    href: "https://cursor.com/marketplace/automations/investigate-datadog-errors",
  },
  {
    title: "Find critical bugs → Create fixes",
    description:
      "Create an automation that will analyze new commits for high-severity bugs and submit safe fixes.",
    href: "https://cursor.com/marketplace/automations/find-critical-bugs",
  },
];

export function CursorAutomatePage() {
  return (
    <>
      <CursorHeader />
      <div className="section section--breadcrumb">
        <nav className="container">
          <ol className="flex items-center">
            <li>
              <span className="text-theme-text-sec" aria-current="page">
                Cursor Automations
              </span>
            </li>
          </ol>
        </nav>
      </div>
      <main id="main" lang="en-US">
        {/* Section 0: Hero */}
        <section className="section bg-theme-bg text-theme-text">
          <div className="container">
            <div className="text-left  mb-v2.5 max-w-prose-medium-wide">
              <h1 className="type-lg text-balance ">
                Save time by eliminating repetitive tasks.
              </h1>
              <div className="flex justify-start mb-v1">
                <div className="type-lg text-theme-text-sec stack text-balance">
                  Set up agents that run automatically based on schedules or
                  event-based triggers.
                </div>
              </div>
              <div className="flex justify-start gap-x-g1 items-center">
                <a className="btn" href="https://cursor.com/automations">
                  Build your first automation
                  <div aria-hidden="true" className="btn-icon">
                    <span className="" aria-hidden="true">
                      →
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <div className="">
              <div className="media-border-container relative grid grid-cols-1 grid-rows-1 bg-theme-card-03-hex">
                <div className="z-20 col-span-full row-span-full h-full min-h-0">
                  <img
                    alt=""
                    width={2400}
                    height={1260}
                    decoding="async"
                    data-nimg="1"
                    className="h-auto w-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                    src="/sites/cursor/blob/OG Images/opengraph-automations-automate-web-page.png"
                    style={{ color: "transparent" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Logo Garden */}
        <section
          className="section bg-theme-bg text-theme-text pb-v1.5 pt-0"
          id="logo-garden"
          dangerouslySetInnerHTML={{ __html: LOGO_GARDEN_INNER_HTML }}
        />

        {/* Section 2: Create your self-driving codebase */}
        <section className="section" id="self-driving-codebase">
          <div className="container">
            <div className="text-left  mb-v2 max-w-prose">
              <h2 className="type-md-lg text-balance ">
                Create your self-driving codebase
              </h2>
              <div className="flex justify-start">
                <div className="type-md-lg text-theme-text-sec stack text-balance">
                  Agents that autonomously build and maintain software.
                </div>
              </div>
            </div>
          </div>
          <section className="section bg-theme-bg text-theme-text section--flush">
            <div className="container my-v2">
              <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
                {SELF_DRIVING_CARDS.map((card) => (
                  <div key={card.title} className="undefined h-full">
                    <div className="card flex h-full grow-1 flex-col">
                      <div className="type-base max-w-prose flex grow flex-col">
                        <div>
                          <h2>{card.title}</h2>
                          <div className="text-theme-text-sec text-pretty">
                            {card.description}
                          </div>
                        </div>
                      </div>
                      <figure className="pt-g1.75">
                        <div
                          className={`media-border-container relative grid grid-cols-1 grid-rows-1${
                            card.warmCard ? " bg-theme-card-warm-hex" : ""
                          }`}
                          style={
                            card.warmCard
                              ? { height: "380px" }
                              : ({
                                  "--layered-media-bg-light": card.bgLight,
                                  "--layered-media-bg-dark": card.bgDark,
                                  height: "380px",
                                } as React.CSSProperties)
                          }
                        >
                          {!card.warmCard && (
                            <>
                              <div
                                className="media-light absolute inset-0 z-0"
                                style={{ backgroundColor: card.bgLightRgb }}
                              />
                              <div
                                className="media-dark absolute inset-0 z-0"
                                style={{ backgroundColor: card.bgDarkRgb }}
                              />
                            </>
                          )}
                          <div className="z-20 col-span-full row-span-full h-full min-h-0">
                            <div className="flex h-full w-full items-center justify-center px-g1.75 py-g1.75">
                              <div className="relative w-full max-w-[340px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 xl:max-w-[380px]">
                                <img
                                  alt={card.imgAlt}
                                  loading="lazy"
                                  width={954}
                                  height={796}
                                  decoding="async"
                                  data-nimg="1"
                                  className="h-auto w-full"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                                  src={card.imgSrc}
                                  style={{ color: "transparent" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        {/* Section 3: See value immediately / Start building with popular templates */}
        <section className="section" id="top-templates">
          <div className="container">
            <div className="text-left  mb-v2 max-w-prose">
              <h2 className="type-md-lg text-balance ">
                See value immediately
              </h2>
              <div className="flex justify-start">
                <div className="type-md-lg text-theme-text-sec stack text-balance">
                  Start building with popular templates.
                </div>
              </div>
            </div>
          </div>
          <section className="section bg-theme-bg text-theme-text section--flush">
            <div className="container my-v2">
              <div className="grid gap-g1 grid-cols-1 xl:grid-cols-3 items-stretch mb-g1">
                {TEMPLATE_CARDS.map((template) => (
                  <div key={template.title} className="undefined h-full">
                    <div className="card flex h-full grow-1 flex-col">
                      <div className="type-base max-w-prose flex grow flex-col">
                        <div>
                          <h2>{template.title}</h2>
                          <div className="text-theme-text-sec text-pretty">
                            {template.description}
                          </div>
                        </div>
                        <div className="mt-auto pt-v8/12">
                          <a className="btn-tertiary" href={template.href}>
                            Build from template ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        {/* Section 4: Modern engineering teams are automating the SDLC */}
        <section className="section bg-theme-bg text-theme-text">
          <div className="container">
            <div className="text-center mx-auto mb-v2.5 max-w-prose-medium-wide">
              <h2 className="type-lg text-balance mx-auto">
                Modern engineering teams are automating the SDLC.
              </h2>
            </div>
            <div className="gap-g1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 0: Rippling */}
              <div className="card md:aspect-2/1-box lg:aspect-8/5-box">
                <figure className="flex flex-col col-span-full row-span-full">
                  <div className="mb-v1.5 flex h-[40px] items-center">
                    <span
                      className="contents"
                      role="img"
                      aria-label="Rippling"
                      dangerouslySetInnerHTML={{ __html: RIPPLING_CARD_SVG }}
                    />
                  </div>
                  <blockquote className="grow-1">
                    <p className="type-base whitespace-pre-wrap">
                      Automations have made the repetitive aspects of my work
                      easy to offload. By making automations to round up tasks,
                      deal with doc updates, and respond to Slack messages, I
                      can focus on the things that matter. Anything can be an
                      automation!
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
                        src="/sites/cursor/blob/headshots/tim-fall.png"
                      />
                    </div>
                    <figcaption>
                      <div className="type-sm">
                        Tim Fall{" "}
                        <span className="type-sm text-theme-text-sec block">
                          Senior Staff Software Engineer, Rippling
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>

              {/* Card 1: Runlayer */}
              <div className="card md:aspect-2/1-box lg:aspect-8/5-box">
                <figure className="flex flex-col col-span-full row-span-full">
                  <div className="mb-v1.5 flex h-[40px] items-center">
                    <span className="contents" role="img" aria-label="Runlayer">
                      <img
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="media-light h-auto max-h-[40px] w-auto max-w-full shrink-0 object-contain object-left"
                        src="/sites/cursor/blob/assets/logos/Runlayer-dark.png"
                        style={{
                          transform: "scale(0.8)",
                          transformOrigin: "left center",
                        }}
                      />
                      <img
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="media-dark h-auto max-h-[40px] w-auto max-w-full shrink-0 object-contain object-left"
                        src="/sites/cursor/blob/assets/logos/Runlayer-light.png"
                        style={{
                          transform: "scale(0.8)",
                          transformOrigin: "left center",
                        }}
                      />
                    </span>
                  </div>
                  <blockquote className="grow-1">
                    <p className="type-base whitespace-pre-wrap">
                      We built our software factory using Cursor Automations
                      with Runlayer MCP and plugins. We move faster than teams
                      five times our size because our agents have the right
                      tools, the right context, and the right guardrails.
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
                        src="/sites/cursor/blob/headshots/tal-peretz.png"
                      />
                    </div>
                    <figcaption>
                      <div className="type-sm">
                        Tal Peretz{" "}
                        <span className="type-sm text-theme-text-sec block">
                          Co-founder, Runlayer
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>

              {/* Card 2: Amplitude */}
              <div className="card md:aspect-2/1-box lg:aspect-8/5-box">
                <figure className="flex flex-col col-span-full row-span-full">
                  <div className="mb-v1.5 flex h-[40px] items-center">
                    <span
                      className="contents"
                      role="img"
                      aria-label="Amplitude"
                      dangerouslySetInnerHTML={{ __html: AMPLITUDE_CARD_SVG }}
                    />
                  </div>
                  <blockquote className="grow-1">
                    <p className="type-base whitespace-pre-wrap">
                      Cursor Automations are helping us eliminate the gap
                      between the customer and our engineers. We&apos;re
                      addressing customer needs faster and with better
                      solutions.
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
                        src="/sites/cursor/blob/headshots/spencer-pauly.png"
                      />
                    </div>
                    <figcaption>
                      <div className="type-sm">
                        Spencer Pauly{" "}
                        <span className="type-sm text-theme-text-sec block">
                          Head of Engineering, AI Feedback, Amplitude
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Bottom CTA */}
        <section className="section bg-theme-bg text-theme-text section--headline">
          <div className="container">
            <div className="text-center mx-auto max-w-prose-medium-wide">
              <h2 className="type-xl text-balance mx-auto mb-v1">
                Automate repetitive work with Cursor.
              </h2>
              <div className="flex justify-center gap-x-g1 items-center">
                <a className="btn" href="https://cursor.com/automations">
                  Build your first automation
                  <div aria-hidden="true" className="btn-icon">
                    <span className="" aria-hidden="true">
                      →
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CursorFooter />
    </>
  );
}
