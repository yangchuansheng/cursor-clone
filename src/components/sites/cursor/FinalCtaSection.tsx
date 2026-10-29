import React from "react";

export function FinalCtaSection() {
  return (
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
                <a className="btn" href="/login">
                  Get started
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
  );
}
