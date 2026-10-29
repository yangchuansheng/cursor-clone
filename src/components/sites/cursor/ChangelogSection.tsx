import React from "react";

const CHANGELOG_ENTRIES = [
  {
    date: "Oct 20, 2026",
    datetime: "2026-10-20T00:00:00.000Z",
    title: "Agent SDK",
    href: "/changelog/agent-sdk",
  },
  {
    date: "Oct 16, 2026",
    datetime: "2026-10-16T00:00:00.000Z",
    title: "Cloud Agent Canvases and Environment Improvements",
    href: "/changelog/cloud-agent-canvases-and-environments",
  },
  {
    date: "Oct 13, 2026",
    datetime: "2026-10-13T00:00:00.000Z",
    title: "Origin App Marketplace",
    href: "/changelog/origin-app-marketplace",
  },
  {
    date: "Oct 6, 2026",
    datetime: "2026-10-06T00:00:00.000Z",
    title: "Remote control for local agents",
    href: "/changelog/remote-control-local-agents",
    fourthCard: true,
  },
];

export function ChangelogSection() {
  return (
    <section className="bg-theme-bg text-theme-text section">
      <div className="container">
        <h2 className="text-theme-text mb-v1 type-md">Changelog</h2>
        <div className="-mx-g2 no-scrollbar snap-x snap-mandatory scroll-px-g2 overflow-x-auto lg:mx-0 lg:snap-none lg:scroll-px-0 lg:overflow-visible">
          <div className="flex w-max gap-g1 px-g2 lg:grid lg:w-full lg:grid-cols-3 lg:px-0 xl:grid-cols-4">
            {CHANGELOG_ENTRIES.map((entry) => (
              <div
                key={entry.href}
                className={`w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*18+(17*var(--spacing-g1)))] shrink-0 snap-start sm:w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*16+(15*var(--spacing-g1)))] md:w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*14+(13*var(--spacing-g1)))] lg:w-auto lg:shrink${
                  entry.fourthCard ? " lg:hidden xl:block" : ""
                }`}
              >
                <article className="flex h-full flex-col">
                  <a
                    className="card flex h-full grow-1 flex-col pb-g2"
                    href={entry.href}
                  >
                    <div className="text-theme-text-mid relative left-[-1px] flex items-center gap-x-(--grid-gap)">
                      <time dateTime={entry.datetime} className="type-base">
                        {entry.date}
                      </time>
                    </div>
                    <p className="type-base text-theme-text">{entry.title}</p>
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
        <a className="btn-text mt-v9/12 inline-flex" href="/changelog">
          See what&apos;s new in Cursor →
        </a>
      </div>
    </section>
  );
}
