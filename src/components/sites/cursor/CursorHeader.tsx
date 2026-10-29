"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SubNavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  columns?: 1 | 2;
  children?: SubNavLink[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Models",
    href: "/grok",
    columns: 1,
    children: [
      { label: "Grok", href: "/grok" },
      { label: "Evals", href: "/evals" },
    ],
  },
  {
    label: "Product",
    href: "/product",
    columns: 1,
    children: [
      { label: "Agents", href: "/product" },
      { label: "Cloud", href: "/cloud" },
      { label: "Grok Bot", href: "https://x.ai/bot", external: true },
      { label: "Mobile", href: "/mobile" },
      { label: "Automations", href: "/automate" },
      { label: "CLI", href: "/cli" },
      { label: "Marketplace", href: "https://cursor.com/marketplace", external: true },
      { label: "Review", href: "/bugbot" },
    ],
  },
  {
    label: "Enterprise",
    href: "/enterprise",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Resources",
    href: "/changelog",
    columns: 2,
    children: [
      { label: "Changelog", href: "/changelog" },
      { label: "Blog", href: "/blog" },
      { label: "Docs", href: "/docs", external: true },
      { label: "Community", href: "/community" },
      { label: "Help", href: "https://cursor.com/help", external: true },
      { label: "Workshops", href: "/workshops" },
      { label: "Forum", href: "https://forum.cursor.com/", external: true },
      { label: "Careers", href: "/careers" },
    ],
  },
];

const CURSOR_LOGO_SVG_STRING = `<svg fill="none" viewBox="0 0 2193 545" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="m466.383 137.073-206.469-119.2034c-6.63-3.8287-14.811-3.8287-21.441 0l-206.4586 119.2034c-5.5734 3.218-9.0144 9.169-9.0144 15.615v240.375c0 6.436 3.441 12.397 9.0144 15.615l206.4686 119.203c6.63 3.829 14.811 3.829 21.441 0l206.468-119.203c5.574-3.218 9.015-9.17 9.015-15.615v-240.375c0-6.436-3.441-12.397-9.015-15.615zm-12.969 25.25-199.316 345.223c-1.347 2.326-4.904 1.376-4.904-1.319v-226.048c0-4.517-2.414-8.695-6.33-10.963l-195.7577-113.019c-2.3263-1.347-1.3764-4.905 1.3182-4.905h398.6305c5.661 0 9.199 6.136 6.368 11.041h-.009z"/><path d="m723.253 148.84h87.856v48.397h-84.881c-45.789 0-81.527 26.432-81.527 82.273s35.738 82.273 81.527 82.273h84.881v48.397h-91.578c-76.691 0-131.039-45.043-131.039-130.66 0-85.618 58.07-130.661 134.761-130.661z"/><path d="m855.781 148.84h54.348v159.7c0 39.828 18.242 58.448 61.056 58.448 42.815 0 61.055-18.61 61.055-58.448v-159.7h54.35v170.866c0 58.071-36.85 94.933-115.405 94.933-78.551 0-115.404-37.231-115.404-95.301z"/><path d="m1370.62 222.913c0 29.04-16.75 51.372-39.09 61.056v.746c23.45 3.354 35.37 20.103 35.73 42.814l1.12 82.641h-54.35l-1.11-73.705c-.37-16.381-10.06-26.432-29.41-26.432h-90.47v100.137h-54.34v-261.33h150.02c49.15 0 81.9 24.94 81.9 74.083zm-54.73 7.454c0-22.333-11.91-34.623-34.24-34.623h-88.61v69.236h89.34c20.47 0 33.51-12.281 33.51-34.623z"/><path d="m1576.09 333.85c0-18.61-11.91-26.432-29.77-27.915l-60.31-5.583c-52.12-4.837-79.3-25.318-79.3-74.83 0-49.511 33.51-76.69 81.53-76.69h133.27v46.904h-129.55c-18.61 0-30.52 9.683-30.52 28.294 0 18.61 12.28 27.547 30.9 29.04l61.42 5.214c46.54 4.091 77.06 25.318 77.06 75.198s-32.38 76.69-78.17 76.69h-139.23v-46.904h134.01c17.5 0 28.66-11.912 28.66-29.408z"/><path d="m1789.79 144.373c81.89 0 133.65 52.487 133.65 134.761 0 82.273-53.98 135.506-135.88 135.506s-133.65-53.233-133.65-135.506c0-82.274 53.98-134.761 135.88-134.761zm77.43 135.129c0-55.095-32.02-87.479-78.56-87.479-46.53 0-78.55 32.384-78.55 87.479 0 55.094 32.02 87.478 78.55 87.478 46.54 0 78.56-32.384 78.56-87.478z"/><path d="m2192.95 222.913c0 29.04-16.75 51.372-39.1 61.056v.746c23.46 3.354 35.37 20.103 35.74 42.814l1.12 82.641h-54.35l-1.12-73.705c-.36-16.381-10.05-26.432-29.4-26.432h-90.47v100.137h-54.35v-261.33h150.03c49.14 0 81.9 24.94 81.9 74.083zm-54.73 7.454c0-22.333-11.91-34.623-34.25-34.623h-88.6v69.236h89.34c20.47 0 33.51-12.281 33.51-34.623z"/></g></svg>`;

export function CursorHeader() {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubNavItem, setMobileSubNavItem] = useState<NavItem | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const hasPlayedScrollRef = useRef(false);

  useEffect(() => {
    const updateTheme = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setThemeMode(attr === "light" ? "light" : "dark");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const playLogoVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    try {
      setVideoOpacity(1);
      video.playbackRate = 1;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setVideoOpacity(0);
        });
      }
    } catch {
      setVideoOpacity(0);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10 && !hasPlayedScrollRef.current) {
        hasPlayedScrollRef.current = true;
        playLogoVideo();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [playLogoVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      if (isHovered) {
        window.setTimeout(() => {
          if (videoRef.current && isHovered) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
        }, 750);
      } else {
        video.pause();
        setVideoOpacity(0);
      }
    };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [isHovered]);

  const handleLogoMouseEnter = useCallback(() => {
    setIsHovered(true);
    playLogoVideo();
  }, [playLogoVideo]);

  const handleLogoMouseLeave = useCallback(() => {
    setIsHovered(false);
    setVideoOpacity(0);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenuOpen(false);
    window.setTimeout(() => {
      setContextMenuPos(null);
      setCopiedFeedback(null);
    }, 110);
  }, []);

  const handleLogoContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  }, []);

  useEffect(() => {
    if (!contextMenuPos) return;
    const onMouseDown = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeContextMenu();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [contextMenuPos, closeContextMenu]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdownIndex(null);
        if (mobileMenuOpen) {
          if (mobileSubNavItem) {
            setMobileSubNavItem(null);
          } else {
            setMobileMenuOpen(false);
          }
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, mobileSubNavItem]);

  const handleCopySvg = useCallback(() => {
    navigator.clipboard?.writeText(CURSOR_LOGO_SVG_STRING).catch(() => {});
    setCopiedFeedback("svg");
    window.setTimeout(closeContextMenu, 350);
  }, [closeContextMenu]);

  const handleCopyPng = useCallback(() => {
    navigator.clipboard?.writeText(CURSOR_LOGO_SVG_STRING).catch(() => {});
    setCopiedFeedback("png");
    window.setTimeout(closeContextMenu, 350);
  }, [closeContextMenu]);

  const videoBase =
    themeMode === "light"
      ? "/marketing-static/logo/logo-light-theme"
      : "/marketing-static/logo/logo-dark-theme";

  return (
    <>
      <header
        id="site-header"
        className="bg-theme-bg px-g2 fixed top-0 left-0 z-50 w-full"
      >
        <div className="relative z-2 container grid h-[var(--site-header-height)] grid-cols-[1fr_auto_auto] items-center lg:grid-cols-[auto_1fr_auto]">
          <a href="#main" className="skipnav btn btn--sm">
            Skip to content
          </a>
          <div className="col-start-1 col-end-2 row-start-1 row-end-2">
            <a
              className="focus-visible:focus-visible relative top-[0.2rem] left-[-2px] inline-flex"
              aria-label="Homepage"
              href="/home"
              onContextMenu={handleLogoContextMenu}
            >
              <div
                onMouseEnter={handleLogoMouseEnter}
                onMouseLeave={handleLogoMouseLeave}
              >
                <div className="pointer-events-none absolute top-0 left-0 h-full">
                  <video
                    ref={videoRef}
                    className="video-smooth h-full w-auto transition-opacity duration-500"
                    playsInline
                    muted
                    preload="auto"
                    aria-label="Cursor logo animation"
                    src={`${videoBase}.mp4`}
                    style={{ opacity: videoOpacity }}
                  >
                    <source type="video/mov" src={`${videoBase}.mov`} />
                    <source type="video/webm" src={`${videoBase}.webm`} />
                    <source type="video/mp4" src={`${videoBase}.mp4`} />
                  </video>
                </div>
                <svg
                  fill="none"
                  className="w-[95.37px] lg:w-[95.75px]"
                  viewBox="0 0 2193 545"
                  xmlns="http://www.w3.org/2000/svg"
                  overflow="visible"
                >
                  <g fill="currentColor">
                    <path d="m466.383 137.073-206.469-119.2034c-6.63-3.8287-14.811-3.8287-21.441 0l-206.4586 119.2034c-5.5734 3.218-9.0144 9.169-9.0144 15.615v240.375c0 6.436 3.441 12.397 9.0144 15.615l206.4686 119.203c6.63 3.829 14.811 3.829 21.441 0l206.468-119.203c5.574-3.218 9.015-9.17 9.015-15.615v-240.375c0-6.436-3.441-12.397-9.015-15.615zm-12.969 25.25-199.316 345.223c-1.347 2.326-4.904 1.376-4.904-1.319v-226.048c0-4.517-2.414-8.695-6.33-10.963l-195.7577-113.019c-2.3263-1.347-1.3764-4.905 1.3182-4.905h398.6305c5.661 0 9.199 6.136 6.368 11.041h-.009z" />
                    <path d="m723.253 148.84h87.856v48.397h-84.881c-45.789 0-81.527 26.432-81.527 82.273s35.738 82.273 81.527 82.273h84.881v48.397h-91.578c-76.691 0-131.039-45.043-131.039-130.66 0-85.618 58.07-130.661 134.761-130.661z" />
                    <path d="m855.781 148.84h54.348v159.7c0 39.828 18.242 58.448 61.056 58.448 42.815 0 61.055-18.61 61.055-58.448v-159.7h54.35v170.866c0 58.071-36.85 94.933-115.405 94.933-78.551 0-115.404-37.231-115.404-95.301z" />
                    <path d="m1370.62 222.913c0 29.04-16.75 51.372-39.09 61.056v.746c23.45 3.354 35.37 20.103 35.73 42.814l1.12 82.641h-54.35l-1.11-73.705c-.37-16.381-10.06-26.432-29.41-26.432h-90.47v100.137h-54.34v-261.33h150.02c49.15 0 81.9 24.94 81.9 74.083zm-54.73 7.454c0-22.333-11.91-34.623-34.24-34.623h-88.61v69.236h89.34c20.47 0 33.51-12.281 33.51-34.623z" />
                    <path d="m1576.09 333.85c0-18.61-11.91-26.432-29.77-27.915l-60.31-5.583c-52.12-4.837-79.3-25.318-79.3-74.83 0-49.511 33.51-76.69 81.53-76.69h133.27v46.904h-129.55c-18.61 0-30.52 9.683-30.52 28.294 0 18.61 12.28 27.547 30.9 29.04l61.42 5.214c46.54 4.091 77.06 25.318 77.06 75.198s-32.38 76.69-78.17 76.69h-139.23v-46.904h134.01c17.5 0 28.66-11.912 28.66-29.408z" />
                    <path d="m1789.79 144.373c81.89 0 133.65 52.487 133.65 134.761 0 82.273-53.98 135.506-135.88 135.506s-133.65-53.233-133.65-135.506c0-82.274 53.98-134.761 135.88-134.761zm77.43 135.129c0-55.095-32.02-87.479-78.56-87.479-46.53 0-78.55 32.384-78.55 87.479 0 55.094 32.02 87.478 78.55 87.478 46.54 0 78.56-32.384 78.56-87.478z" />
                    <path d="m2192.95 222.913c0 29.04-16.75 51.372-39.1 61.056v.746c23.46 3.354 35.37 20.103 35.74 42.814l1.12 82.641h-54.35l-1.12-73.705c-.36-16.381-10.05-26.432-29.4-26.432h-90.47v100.137h-54.35v-261.33h150.03c49.14 0 81.9 24.94 81.9 74.083zm-54.73 7.454c0-22.333-11.91-34.623-34.25-34.623h-88.6v69.236h89.34c20.47 0 33.51-12.281 33.51-34.623z" />
                  </g>
                </svg>
              </div>
              <span className="sr-only">Cursor</span>
            </a>
          </div>

          <div className="hidden lg:block">
            <nav
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              role="navigation"
            >
              <ul className="flex items-center justify-center">
                {NAV_ITEMS.map((item, idx) => {
                  const isOpen = openDropdownIndex === idx;
                  if (!item.children) {
                    return (
                      <li key={item.label}>
                        <a className="nav__link" href={item.href}>
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdownIndex(idx)}
                      onMouseLeave={() =>
                        setOpenDropdownIndex((prev) => (prev === idx ? null : prev))
                      }
                    >
                      <a
                        className={`nav__btn${isOpen ? " is-active" : ""}`}
                        href={item.href}
                      >
                        {item.label}
                      </a>
                      <button
                        className={`nav__btn-caret nav__btn-caret--sm icon-glyph-09${
                          isOpen ? " is-active" : ""
                        }`}
                        type="button"
                        aria-label={isOpen ? "Collapse Menu" : "Expand Menu"}
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenDropdownIndex((prev) => (prev === idx ? null : idx))
                        }
                      >
                        <span className="nav__btn-caret__icon" aria-hidden="true">
                          ↓
                        </span>
                      </button>
                      <div
                        className="nav__sub-nav pt-v3/12 absolute top-full left-0"
                        style={
                          isOpen
                            ? {
                                opacity: 1,
                                visibility: "visible",
                                transform: "translateY(0)",
                              }
                            : {
                                opacity: 0,
                                visibility: "hidden",
                                transform: "translateY(-0.4rem)",
                                pointerEvents: "none",
                              }
                        }
                      >
                        <div className="card card--sub-nav card--flyout type-sm shadow-[var(--shadow-flyout)]">
                          <ul
                            className={
                              item.columns === 2
                                ? "gap-x-g1 grid grid-cols-[repeat(2,auto)]"
                                : "flex flex-col"
                            }
                          >
                            {item.children.map((sub) => (
                              <li key={sub.label} className="min-w-[8rem]">
                                <a
                                  className="nav__sub-nav__link py-v2.5/12"
                                  href={sub.href}
                                  target={sub.external ? "_blank" : undefined}
                                  rel={sub.external ? "noopener noreferrer" : undefined}
                                >
                                  {sub.label}
                                  {sub.external && (
                                    <span className="nav__sub-nav__link__icon">
                                      &nbsp;↗
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="block lg:hidden">
            <div className="col-start-4 col-end-[-1] row-start-1 row-end-2 flex items-center justify-center">
              <button
                type="button"
                className="focus-visible:focus-visible w-v1.5 h-v1.5 relative inline-flex cursor-pointer items-center justify-center after:absolute after:inset-[-0.5rem] after:content-[''] ml-g1 -mr-[0.3rem]"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
                onClick={() => {
                  setMobileMenuOpen((prev) => !prev);
                  setMobileSubNavItem(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.125"
                  stroke="currentColor"
                  width="100%"
                  height="100%"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <nav
                className={`bg-theme-bg px-g2 fixed inset-0 z-50 flex flex-col overscroll-contain transition-opacity ${
                  mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                role="navigation"
                style={{
                  transition: "opacity var(--duration) var(--ease-out-spring)",
                }}
              >
                <header
                  className={`type-lg mb-v3 flex h-[var(--site-header-height)] shrink-0 items-center ${
                    mobileSubNavItem ? "justify-between" : "justify-end"
                  }`}
                >
                  {mobileSubNavItem && (
                    <button
                      type="button"
                      className="focus-visible:focus-visible w-v1.5 h-v1.5 relative inline-flex cursor-pointer items-center justify-center after:absolute after:inset-[-0.5rem] after:content-[''] -ml-[0.625rem]"
                      aria-label="Back to main navigation"
                      onClick={() => setMobileSubNavItem(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.25"
                        stroke="currentColor"
                        width="100%"
                        height="100%"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    className="focus-visible:focus-visible w-v1.5 h-v1.5 relative inline-flex cursor-pointer items-center justify-center after:absolute after:inset-[-0.5rem] after:content-[''] z-51 -mr-[0.3rem]"
                    aria-label="Close navigation"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSubNavItem(null);
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-full w-full"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {mobileSubNavItem ? (
                    <>
                      <div className="relative">
                        <div className="type-sm ml-v1/12 -top-v1 text-theme-text-sec absolute left-0 z-10 text-left">
                          {mobileSubNavItem.label}
                        </div>
                      </div>
                      <ul className="flex flex-col">
                        {mobileSubNavItem.children?.map((sub) => (
                          <li key={sub.label}>
                            <div>
                              <a
                                className="type-lg focus-visible:focus-visible py-v3/12 block"
                                href={sub.href}
                                target={sub.external ? "_blank" : undefined}
                                rel={sub.external ? "noopener noreferrer" : undefined}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub.label}
                                {sub.external && (
                                  <span className="nav__sub-nav__link__icon">
                                    &nbsp;↗
                                  </span>
                                )}
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <ul className="flex flex-col">
                      {NAV_ITEMS.map((item) =>
                        item.children ? (
                          <li key={item.label} className="relative">
                            <button
                              className="nav-sm-item type-lg focus-visible:focus-visible py-v3/12 flex w-full cursor-pointer items-center"
                              type="button"
                              aria-expanded={false}
                              onClick={() => setMobileSubNavItem(item)}
                            >
                              {item.label}
                              <span className="nav-sm-caret" aria-hidden="true">
                                &nbsp;→
                              </span>
                            </button>
                          </li>
                        ) : (
                          <li key={item.label}>
                            <div>
                              <a
                                className="type-lg focus-visible:focus-visible py-v3/12 block"
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.label}
                              </a>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </nav>
            </div>
          </div>

          <div className="gap-g0.75 col-start-2 col-end-3 row-start-1 row-end-2 flex items-center justify-self-end lg:col-start-3 lg:col-end-[-1]">
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="btn--quinary"
            >
              Sign in
            </a>
            <a
              className="btn btn--ghost btn--sm hidden lg:inline-flex"
              href="/contact-sales?source=navbar"
            >
              <span className="xl:hidden">Contact</span>
              <span className="hidden xl:inline">Contact sales</span>
            </a>
            <a className="btn btn--primary btn--sm max-sm:hidden" href="/download">
              Download
            </a>
          </div>
        </div>
      </header>

      {contextMenuPos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`privacy-dropdown fixed z-[9999]${
              contextMenuOpen ? " is-open" : ""
            }`}
            style={{
              top: contextMenuPos.y,
              left: contextMenuPos.x,
              transform: contextMenuOpen ? "translateY(0)" : "translateY(-0.25rem)",
            }}
          >
            <div
              ref={contextMenuRef}
              className="card card--flyout py-g0.5 type-sm bg-theme-card-01-hex min-w-[13rem] px-0 shadow-[var(--shadow-flyout)]"
            >
              <ul>
                <li>
                  <button
                    type="button"
                    className="nav__sub-nav__link py-v2.5/12 px-g1.5 w-full cursor-pointer text-left"
                    onClick={handleCopySvg}
                  >
                    {copiedFeedback === "svg" ? "Copied SVG ✓" : "Copy logo as SVG"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="nav__sub-nav__link py-v2.5/12 px-g1.5 w-full cursor-pointer text-left"
                    onClick={handleCopyPng}
                  >
                    {copiedFeedback === "png" ? "Copied PNG ✓" : "Copy logo as PNG"}
                  </button>
                </li>
                <li>
                  <a
                    href="/brand"
                    className="nav__sub-nav__link py-v2.5/12 px-g1.5"
                    onClick={closeContextMenu}
                  >
                    Download Brand Assets
                  </a>
                </li>
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
