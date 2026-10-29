"use client";

import React, { useEffect, useRef, useState } from "react";

type ThemeSelection = "system" | "light" | "dark";

const LANGUAGES = [
  { id: "en-US", title: "English" },
  { id: "zh-CN", title: "简体中文" },
  { id: "ja", title: "日本語" },
  { id: "zh-TW", title: "繁體中文" },
  { id: "es", title: "Español" },
  { id: "fr", title: "Français" },
  { id: "pt", title: "Português" },
  { id: "ko", title: "한국어" },
  { id: "de", title: "Deutsch" },
  { id: "hi", title: "हिन्दी" },
];

export function CursorFooter() {
  const [themeSelection, setThemeSelection] = useState<ThemeSelection>("system");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  const langContainerRef = useRef<HTMLDivElement | null>(null);
  const sysBtnRef = useRef<HTMLButtonElement | null>(null);
  const lightBtnRef = useRef<HTMLButtonElement | null>(null);
  const darkBtnRef = useRef<HTMLButtonElement | null>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 2,
    width: 36,
  });

  const applyTheme = (mode: ThemeSelection) => {
    setThemeSelection(mode);
    const resolved =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : mode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  };

  useEffect(() => {
    const activeBtn =
      themeSelection === "system"
        ? sysBtnRef.current
        : themeSelection === "light"
        ? lightBtnRef.current
        : darkBtnRef.current;
    if (activeBtn) {
      setPillStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [themeSelection]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        langContainerRef.current &&
        !langContainerRef.current.contains(e.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <footer
      id="site-footer"
      className="pt-v3 pb-v3 md:pb-g3 px-g2 bg-theme-card-hex relative"
    >
      <div className="mb-v4.5 container">
        <nav>
          <div className="gap-x-g1 gap-y-v2 grid grid-cols-2 md:grid-cols-5">
            {/* Column 1: Product */}
            <div>
              <h3 className="type-base md:type-sm text-theme-text-sec pb-v2.5/12">
                Product
              </h3>
              <ul className="space-y-0">
                {[
                  { label: "Agents", href: "/en-US/product" },
                  { label: "Teams", href: "/en-US/business/teams" },
                  { label: "Enterprise", href: "/en-US/enterprise" },
                  { label: "Pricing", href: "/en-US/pricing" },
                  { label: "Code Review", href: "/en-US/bugbot" },
                  { label: "CLI", href: "/en-US/cli" },
                  { label: "Cloud Agents", href: "/agents" },
                  { label: "Composer", href: "/en-US/composer" },
                  {
                    label: "Marketplace",
                    href: "https://cursor.com/marketplace",
                    external: true,
                  },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          &nbsp;↗
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h3 className="type-base md:type-sm text-theme-text-sec pb-v2.5/12">
                Resources
              </h3>
              <ul className="space-y-0">
                {[
                  { label: "Download", href: "/en-US/download" },
                  { label: "Changelog", href: "/en-US/changelog" },
                  { label: "Docs", href: "/docs" },
                  {
                    label: "Learn",
                    href: "https://cursor.com/learn",
                    external: true,
                  },
                  {
                    label: "Forum",
                    href: "https://forum.cursor.com/",
                    external: true,
                  },
                  {
                    label: "Help",
                    href: "https://cursor.com/help",
                    external: true,
                  },
                  { label: "Workshops", href: "/en-US/workshops" },
                  {
                    label: "Status",
                    href: "https://status.cursor.com/",
                    external: true,
                  },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          &nbsp;↗
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="type-base md:type-sm text-theme-text-sec pb-v2.5/12">
                Company
              </h3>
              <ul className="space-y-0">
                {[
                  { label: "Careers", href: "/en-US/careers" },
                  { label: "Blog", href: "/en-US/blog" },
                  { label: "Community", href: "/en-US/community" },
                  { label: "Students", href: "/en-US/students" },
                  { label: "Brand", href: "/en-US/brand" },
                  { label: "Future", href: "/en-US/future" },
                  {
                    label: "Anysphere",
                    href: "https://anysphere.inc/",
                    external: true,
                  },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          &nbsp;↗
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h3 className="type-base md:type-sm text-theme-text-sec pb-v2.5/12">
                Legal
              </h3>
              <ul className="space-y-0">
                {[
                  { label: "Terms of Service", href: "/en-US/terms-of-service" },
                  {
                    label: "Acceptable Use Policy",
                    href: "/en-US/acceptable-use-policy",
                  },
                  { label: "Grok Bot Terms", href: "/en-US/terms/grok-bot" },
                  {
                    label: "SpaceXSI Subscription Terms",
                    href: "https://x.ai/legal",
                    external: true,
                  },
                  { label: "Privacy Policy", href: "/en-US/privacy" },
                  { label: "Cookie Policy", href: "/en-US/cookie-policy" },
                  { label: "Data Use", href: "/en-US/data-use" },
                  { label: "Security", href: "/en-US/security" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          &nbsp;↗
                        </span>
                      )}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                  >
                    Privacy choices
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Connect */}
            <div>
              <h3 className="type-base md:type-sm text-theme-text-sec pb-v2.5/12">
                Connect
              </h3>
              <ul className="space-y-0">
                {[
                  { label: "X", href: "https://x.com/cursor_ai" },
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/company/cursorai",
                  },
                  {
                    label: "YouTube",
                    href: "https://www.youtube.com/@cursor_ai",
                  },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-base md:type-sm py-v2.5/12 footer-link inline-block cursor-pointer hover:text-theme-text group"
                    >
                      {link.label}
                      <span className="inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        &nbsp;↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="gap-v2 container flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="text-theme-text-sec gap-g1.5 flex items-center">
          <small className="type-base md:type-sm">
            © 2026{" "}
            <a
              href="https://anysphere.inc"
              className="hover:text-theme-text active:text-theme-text"
            >
              Anysphere, Inc.
            </a>
          </small>
          <small className="type-base md:type-sm">
            🛡{" "}
            <a
              className="hover:text-theme-text active:text-theme-text inline"
              href="/en-US/security"
            >
              SOC 2 | ISO27001 | ISO42001 | AIUC-1 Certified
            </a>
          </small>
        </div>

        <div className="gap-g1.5 flex items-center">
          {/* Theme Switcher Pill */}
          <div className="md:type-sm rounded-full bg-theme-card-03-hex relative flex text-center p-0.5">
            <div
              className="absolute rounded-full transition-all bg-theme-fg-10"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                top: "2px",
                bottom: "2px",
                transitionDuration: "var(--duration)",
                transitionTimingFunction: "var(--ease-out-spring)",
              }}
            />
            <button
              ref={sysBtnRef}
              type="button"
              onClick={() => applyTheme("system")}
              aria-label="System theme"
              className={`font-size-inherit relative inline-flex cursor-pointer items-center justify-center rounded-full leading-none outline-none focus:outline-none focus-visible:outline-none pill-padding-sm ${
                themeSelection === "system"
                  ? "text-theme-text"
                  : "text-theme-text-sec hover:text-theme-text"
              }`}
            >
              <span aria-hidden="true">🖥</span>
            </button>
            <button
              ref={lightBtnRef}
              type="button"
              onClick={() => applyTheme("light")}
              aria-label="Light theme"
              className={`font-size-inherit relative inline-flex cursor-pointer items-center justify-center rounded-full leading-none outline-none focus:outline-none focus-visible:outline-none pill-padding-sm ${
                themeSelection === "light"
                  ? "text-theme-text"
                  : "text-theme-text-sec hover:text-theme-text"
              }`}
            >
              <span aria-hidden="true">☉</span>
            </button>
            <button
              ref={darkBtnRef}
              type="button"
              onClick={() => applyTheme("dark")}
              aria-label="Dark theme"
              className={`font-size-inherit relative inline-flex cursor-pointer items-center justify-center rounded-full leading-none outline-none focus:outline-none focus-visible:outline-none pill-padding-sm ${
                themeSelection === "dark"
                  ? "text-theme-text"
                  : "text-theme-text-sec hover:text-theme-text"
              }`}
            >
              <span aria-hidden="true">☾</span>
            </button>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <div ref={langContainerRef} className="relative">
              <button
                className="btn btn--secondary btn--sm gap-g0.5 cursor-pointer type-base md:type-sm !leading-none"
                aria-expanded={langDropdownOpen}
                aria-controls="language-dropdown"
                aria-haspopup="listbox"
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
              >
                <span className="icon-glyph-08">🌐</span>
                {selectedLang?.title ?? "English"}
                <span className="icon-glyph-09 cursor-pointer">
                  {langDropdownOpen ? "↑" : "↓"}
                </span>
              </button>
              <div
                id="language-dropdown"
                role="listbox"
                className={`nav__sub-nav pt-v3/12 absolute bottom-full left-0 md:left-auto md:right-0 z-50 mb-v6/12 privacy-dropdown-upward${
                  langDropdownOpen ? " is-open" : ""
                }`}
                style={
                  langDropdownOpen
                    ? {
                        opacity: 1,
                        visibility: "visible",
                        transform: "translateY(0)",
                      }
                    : {
                        opacity: 0,
                        visibility: "hidden",
                        transform: "translateY(0.25rem)",
                        pointerEvents: "none",
                      }
                }
              >
                <div className="card card--flyout px-0 py-g0.75 type-base md:type-sm bg-theme-card-02-hex min-w-[10rem] shadow-[var(--shadow-flyout)]">
                  <ul>
                    {LANGUAGES.map((lang) => {
                      const isSelected = lang.id === selectedLang?.id;
                      return (
                        <li key={lang.id}>
                          <button
                            role="option"
                            aria-selected={isSelected}
                            type="button"
                            onClick={() => {
                              setSelectedLang(lang);
                              setLangDropdownOpen(false);
                            }}
                            className="nav__sub-nav__link--responsive py-v2.5/12 px-g1.5 relative flex w-full cursor-pointer items-center justify-between"
                          >
                            {lang.title}
                            {isSelected && (
                              <span className="font-feature-case">✓</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
