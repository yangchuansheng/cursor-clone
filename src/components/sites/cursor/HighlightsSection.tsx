import React from "react";

const HIGHLIGHTS = [
  {
    date: "Mar 27, 2026",
    datetime: "2026-03-27T12:00:00.000Z",
    category: "Research",
    title: "A technical report on Composer 2",
    href: "/blog/composer-2-technical-report",
    author: "Sasha Rush",
    readTime: "3 min read",
    avatarType: "single" as const,
    avatarSrc: "/sites/cursor/blob/assets/avatars/sasha-rush.jpeg",
  },
  {
    date: "Aug 14, 2026",
    datetime: "2026-08-14T12:00:00.000Z",
    category: "Company",
    title: "Cursor is now a part of SpaceX",
    href: "/blog/joining-spacex",
    author: "Cursor Team",
    readTime: "2 min read",
    avatarType: "themed" as const,
  },
  {
    date: "Sep 21, 2026",
    datetime: "2026-09-21T00:00:00.000Z",
    category: "Research",
    title: "Introducing Grok 4.7",
    href: "https://x.ai/news/grok-4-7",
    author: "Cursor Team",
    readTime: "3 min read",
    avatarType: "themed" as const,
  },
  {
    date: "Aug 18, 2026",
    datetime: "2026-08-18T12:00:00.000Z",
    category: "Research",
    title: "Git at any scale",
    href: "/blog/git-at-any-scale",
    author: "Vicent Martí",
    readTime: "27 min read",
    avatarType: "initials" as const,
    initials: "VM",
    fourthCard: true,
  },
];

export function HighlightsSection() {
  return (
    <section className="section bg-theme-bg text-theme-text">
      <div className="container">
        <h2 className="type-md text-theme-text mb-v1">Recent highlights</h2>
        <div className="-mx-g2 no-scrollbar snap-x snap-mandatory scroll-px-g2 overflow-x-auto lg:mx-0 lg:snap-none lg:scroll-px-0 lg:overflow-visible">
          <div className="flex w-max gap-g1 px-g2 lg:grid lg:w-full lg:grid-cols-3 lg:px-0 xl:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.href}
                className={`w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*18+(17*var(--spacing-g1)))] shrink-0 snap-start sm:w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*16+(15*var(--spacing-g1)))] md:w-[calc((((100vw-(2*var(--spacing-g2)))-(23*var(--spacing-g1)))/24)*14+(13*var(--spacing-g1)))] lg:w-auto lg:shrink${
                  item.fourthCard ? " lg:hidden xl:block" : ""
                }`}
              >
                <article className="flex h-full grow-1 flex-col">
                  <a
                    className="card card--text grow-1 grid-cursor-v1 grid-cols-[1fr_auto] @container"
                    href={item.href}
                  >
                    <div className="flex flex-col @sm:col-start-1 @sm:col-end-2">
                      <div className="type-base text-theme-text-mid flex shrink-0 flex-wrap items-center gap-x-v2/12 gap-y-v1/12">
                        <time dateTime={item.datetime} className="type-base">
                          {item.date}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{item.category}</span>
                      </div>
                      <div className="grow-1">
                        <p className="type-base text-theme-text text-pretty">
                          {item.title}
                        </p>
                      </div>
                      <div className="mt-v8/12 @container flex flex-wrap items-center gap-x-v4/12 gap-y-v3/12">
                        <div className="flex -space-x-v3/12">
                          <div
                            className="first:ml-0 relative rounded-full"
                            style={{ zIndex: 1 }}
                          >
                            <div className="avatar-border-container bg-theme-card-03-hex relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden">
                              {item.avatarType === "single" && (
                                <img
                                  alt=""
                                  aria-hidden="true"
                                  loading="lazy"
                                  width={24}
                                  height={24}
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                  src={item.avatarSrc}
                                />
                              )}
                              {item.avatarType === "themed" && (
                                <>
                                  <img
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    width={24}
                                    height={24}
                                    decoding="async"
                                    className="h-full w-full object-cover media-light"
                                    src="/sites/cursor/blob/assets/avatars/avatar-circle-2d-dark.png"
                                  />
                                  <img
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    width={24}
                                    height={24}
                                    decoding="async"
                                    className="media-dark absolute inset-0 h-full w-full object-cover"
                                    src="/sites/cursor/blob/assets/avatars/avatar-circle-2d-white.png"
                                  />
                                </>
                              )}
                              {item.avatarType === "initials" && (
                                <span
                                  aria-label={item.author}
                                  className="type-sm text-theme-text-mid font-medium"
                                >
                                  {item.initials}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="type-base text-theme-text-mid min-w-0">
                          <span>{item.author}</span>
                          <span className="whitespace-nowrap">
                            <span aria-hidden="true"> · </span>
                            <span>{item.readTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
        <a className="btn-text mt-v9/12 inline-flex" href="/blog">
          View all blog posts →
        </a>
      </div>
    </section>
  );
}
