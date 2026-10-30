"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useRef, useState, type SVGProps } from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Code,
  Copy,
  Download,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import {
  FOOTER_COLUMNS,
  INSTALL_AGENT_PROMPT,
  INSTALL_AGENTS,
  NAV_COMPARE_LINKS,
  NAV_PRIMARY_LINKS,
  NAV_TOOLS_LINKS,
} from "./landing-data";

export function ApplePlatformIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      role="img"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function WindowsPlatformIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
    </svg>
  );
}

export function LinuxPlatformIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      role="img"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M17.61.455a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zM12.92.8C8.923.777 5.137 2.941 3.148 6.451a4.5 4.5 0 0 1 .26-.007 4.92 4.92 0 0 1 2.585.737A8.316 8.316 0 0 1 12.688 3.6 4.944 4.944 0 0 1 13.723.834 11.008 11.008 0 0 0 12.92.8zm9.226 4.994a4.915 4.915 0 0 1-1.918 2.246 8.36 8.36 0 0 1-.273 8.303 4.89 4.89 0 0 1 1.632 2.54 11.156 11.156 0 0 0 .559-13.089zM3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.908 4.908 0 0 1-2.915.358 11.1 11.1 0 0 0 7.991 6.698 11.234 11.234 0 0 0 2.422.249 4.879 4.879 0 0 1-.999-2.85 8.484 8.484 0 0 1-.836-.136 8.304 8.304 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41z" />
    </svg>
  );
}

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <div ref={wrapperRef} className="relative inline-flex items-center">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 qIUd4G_link qIUd4G_compareTrigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          data-state={open ? "open" : "closed"}
          data-slot="popover-trigger"
          onClick={() => setOpen((prev) => !prev)}
        >
          {label} <ChevronDown aria-hidden="true" className="size-3" />
        </button>
        {open && (
          <div
            data-side="bottom"
            data-align="start"
            data-state="open"
            role="dialog"
            id={dialogId}
            data-slot="popover-content"
            className="z-50 outline-hidden bg-popover text-popover-foreground w-72 rounded-lg border p-4 shadow-md yB52iW_className qIUd4G_compareMenu absolute left-0 top-full mt-3"
            tabIndex={-1}
          >
            <nav aria-label={label}>
              {links.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
      <div className="qIUd4G_comparisonLinks">
        <span>{label}</span>
        {links.map((item) => (
          <a key={item.href} href={item.href} className="qIUd4G_link">
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}

export function KinoNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!contextMenuPos) return;
    const close = () => setContextMenuPos(null);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [contextMenuPos]);

  const handleCopySvg = async (url: string, label: string) => {
    try {
      const res = await fetch(url);
      const svgText = await res.text();
      await navigator.clipboard.writeText(svgText);
      setCopiedNotice(`Copied ${label} as SVG`);
      window.setTimeout(() => setCopiedNotice(null), 1600);
    } catch {
      setCopiedNotice(`Couldn't copy the ${label}`);
      window.setTimeout(() => setCopiedNotice(null), 1600);
    }
    setContextMenuPos(null);
  };

  return (
    <header
      className="qIUd4G_nav"
      data-open={mobileMenuOpen || undefined}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) {
          setMobileMenuOpen(false);
        }
      }}
    >
      <nav className="qIUd4G_links">
        <a
          href="/kino"
          className="qIUd4G_wordmark"
          data-slot="context-menu-trigger"
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenuPos({ x: e.clientX, y: e.clientY });
          }}
        >
          <span className="sr-only">Kino</span>
          <img
            src="/sites/kino/logo/kino-primary-logo-white-italic.svg"
            width={880}
            height={140}
            alt=""
            draggable={false}
          />
        </a>
        {NAV_PRIMARY_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={"newTab" in link && link.newTab ? "kino-external" : undefined}
            rel={"newTab" in link && link.newTab ? "noopener noreferrer" : undefined}
            className="qIUd4G_link"
          >
            {link.label}
          </a>
        ))}
        <NavDropdown label="Tools" links={NAV_TOOLS_LINKS} />
        <NavDropdown label="Compare" links={NAV_COMPARE_LINKS} />
        <a href="/brand" className="qIUd4G_link qIUd4G_menuOnly">
          Brand
        </a>
      </nav>
      <div className="qIUd4G_actions">
        <a href="/sign-in" className="qIUd4G_signIn">
          <span>Sign in</span>
        </a>
        <a href="/download" className="qIUd4G_download">
          Download Kino
        </a>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 qIUd4G_menuButton [&_svg]:size-5"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>
      </div>
      {contextMenuPos && (
        <div
          role="menu"
          className="dark yB52iW_className fixed z-50 min-w-[200px] rounded-lg border border-neutral-800 bg-neutral-900 p-1 text-xs text-neutral-100 shadow-xl"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-neutral-800"
            onClick={() =>
              handleCopySvg("/sites/kino/logo/kino-primary-logo-white-italic.svg", "logo")
            }
          >
            <Code className="size-3.5" />
            Copy logo as SVG
          </button>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-neutral-800"
            onClick={() =>
              handleCopySvg("/sites/kino/logo/kino-primary-logo-white-italic.svg", "wordmark")
            }
          >
            <Code className="size-3.5" />
            Copy wordmark as SVG
          </button>
          <div className="my-1 h-px bg-neutral-800" />
          <a
            href="/brand"
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-neutral-800"
          >
            <Download className="size-3.5" />
            Visit brand guidelines
          </a>
        </div>
      )}
      {copiedNotice && (
        <div className="fixed top-4 right-4 z-50 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 shadow-lg">
          {copiedNotice}
        </div>
      )}
    </header>
  );
}

const AGENT_FACES = [
  "/sites/kino/landing/agents/muse.png",
  "/sites/kino/landing/agents/grok-bot-icon.png",
  "/sites/kino/landing/agents/claude.svg",
] as const;

export function DownloadCta() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(INSTALL_AGENT_PROMPT).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="VTnEqW_row">
      <a
        href="https://kino.ai/api/desktop-download/mac?source=website"
        className="VTnEqW_download VTnEqW_installer VTnEqW_macOS"
      >
        <ApplePlatformIcon aria-hidden="true" />
        Download for Mac
      </a>
      <a
        href="https://kino.ai/api/desktop-download/windows?source=website"
        className="VTnEqW_download VTnEqW_installer VTnEqW_windows"
      >
        <WindowsPlatformIcon aria-hidden="true" />
        Download for Windows
      </a>
      <a
        href="https://kino.ai/api/desktop-download/linux?source=website"
        className="VTnEqW_download VTnEqW_installer VTnEqW_linux"
      >
        <LinuxPlatformIcon aria-hidden="true" />
        Download for Ubuntu
      </a>
      <div ref={containerRef} className="relative inline-flex">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 VTnEqW_agent"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          data-state={open ? "open" : "closed"}
          data-slot="popover-trigger"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>
            <span className="VTnEqW_faces" aria-hidden="true">
              {AGENT_FACES.map((face) => (
                <span key={face}>
                  <img src={face} alt="" draggable={false} />
                </span>
              ))}
            </span>
            Install with your agent
          </span>
        </button>
        {open && (
          <div
            data-side="bottom"
            data-align="start"
            data-state="open"
            role="dialog"
            id={popoverId}
            data-slot="popover-content"
            className="z-50 outline-hidden workbench-popover VTnEqW_popover absolute left-0 top-full mt-2.5"
            tabIndex={-1}
          >
            <div className="VTnEqW_header">
              <h2>Give your agent Kino</h2>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 VTnEqW_close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" strokeWidth={1.6} />
              </button>
            </div>
            <p className="VTnEqW_prompt">{INSTALL_AGENT_PROMPT}</p>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 VTnEqW_copy"
              onClick={handleCopyPrompt}
            >
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy message"}
            </button>
            <div className="VTnEqW_agents">
              <p>Then send it to your agent</p>
              <ul>
                {INSTALL_AGENTS.map((agent) => (
                  <li key={agent.name}>
                    <a
                      href={agent.href}
                      target="kino-external"
                      rel="noopener noreferrer"
                      title={agent.name}
                    >
                      <span className="sr-only">{agent.name}</span>
                      <img
                        src={agent.src}
                        alt=""
                        width={agent.width}
                        height={agent.height}
                        className={agent.rounded ? "VTnEqW_rounded" : undefined}
                        draggable={false}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function KinoFooter() {
  return (
    <footer className="KwcHGa_footer">
      <div className="KwcHGa_brand">
        <img
          src="/sites/kino/logo/kino-primary-logo-white-italic.svg"
          width={880}
          height={140}
          alt="Kino"
          draggable={false}
        />
        <span>© 2026 Kino AI</span>
      </div>
      <nav className="KwcHGa_columns" aria-label="Footer">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="KwcHGa_column">
            <h2>{col.title}</h2>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "kino-external" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </footer>
  );
}

export function TalkToTeam() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; from: "team" | "user"; text: string }>>([
    {
      id: "welcome",
      from: "team",
      text: "Hey! Ask us anything about Kino, workflows, or setting up your agent.",
    },
  ]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, from: "user", text: trimmed }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `team-${Date.now()}`,
          from: "team",
          text: "Thanks for reaching out — a Kino engineer will follow up shortly.",
        },
      ]);
    }, 900);
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Talk to the Kino team"
          className="fixed right-4 bottom-16 z-50 flex w-[340px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#161616] text-[#ececea] shadow-[0_20px_50px_rgba(0,0,0,0.75)] md:right-6 md:bottom-20"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/sites/kino/logo/kino-app-icon.png"
                alt=""
                width={24}
                height={24}
                className="rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium leading-tight text-white">Kino Team</span>
                <span className="text-[11px] leading-tight text-neutral-400">
                  Usually replies in a few minutes
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className=" inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex max-h-64 min-h-44 flex-col gap-2.5 overflow-y-auto p-4 text-[13px] leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.from === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#0e9fff] px-3 py-2 text-white"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-3 py-2 text-neutral-200"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form
            className="flex items-center gap-2 border-t border-white/10 bg-[#1c1c1c] px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the Kino team…"
              aria-label="Message the Kino team"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0e9fff] text-white disabled:cursor-default disabled:opacity-40"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bJ-igq_pill"
        aria-label="Talk to the Kino team"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MessageCircle className="bJ-igq_icon" strokeWidth={1.75} aria-hidden="true" />
        <span className="bJ-igq_label">Talk to the Kino team</span>
      </button>
    </>
  );
}
