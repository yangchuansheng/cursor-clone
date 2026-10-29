import React from "react";

export function ResearchTeamSection() {
  return (
    <section className="section bg-theme-bg text-theme-text">
      <div className="container">
        <div className="grid grid-rows-[auto_1fr]">
          <div className="card card--large grid-cursor col-span-full row-span-full gap-y-0 max-lg:grid-rows-subgrid">
            <div className="col-span-full row-start-1 row-end-2 grid lg:row-start-1 lg:row-end-3 lg:items-center lg:col-start-1 lg:col-end-9 lg:pl-g0.25 lg:pr-g3">
              <div className="w-full max-w-prose lg:justify-self-start">
                <div className="type-base">
                  <h3 className="type-base md:type-md text-pretty">
                    Cursor is an applied research team focused on building the
                    future of software development.
                  </h3>
                </div>
                <div className="mt-v8/12">
                  <div className="flex justify-start gap-x-g1 items-center">
                    <a className="btn-tertiary" href="/careers">
                      Join us
                      <div aria-hidden="true" className="btn-icon">
                        <span aria-hidden="true">→</span>
                      </div>
                    </a>
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
                <div className="z-20 col-span-full row-span-full grid">
                  <img
                    alt=""
                    loading="lazy"
                    width={800}
                    height={450}
                    decoding="async"
                    className="h-auto w-full aspect-[16/9] object-cover md:aspect-[8/5]"
                    src="/sites/cursor/blob/assets/homepage/homepage-team-photo.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
