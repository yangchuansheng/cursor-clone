"use client";
/* eslint-disable @next/next/no-img-element */

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  AudioLines,
  Cloud,
  FileText,
  Globe,
  ListStart,
  MessageSquareText,
  Search,
  Smartphone,
  SquarePlay,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FINDER_ICONS,
  FINDER_ROWS,
  OFFLINE_LANGUAGES,
  type IconComponent,
  type KinoCoverCrop,
  type KinoSpriteSheet,
  type KinoTemplate,
  type KinoTemplateRecording,
} from "./landing-data";
import {
  canAutoplayVideo,
  CarouselPaddles,
  KinoScrollArea,
  LazyVideo,
  MiddleTruncate,
  useCarousel,
  useInView,
  useScrollRoot,
} from "./scroll-area";

const PLAYHEAD_HEAD_PATH =
  "M5.4 1.4a0.7 0.7 0 0 1 0.7-0.7h3.8a0.7 0.7 0 0 1 0.7 0.7v1.7L8 5.3 5.4 3.1V1.4Z";
const PLAYHEAD_FULL_PATH = `${PLAYHEAD_HEAD_PATH}M7.3 4.3a0.7 0.7 0 0 1 1.4 0V14.6a0.7 0.7 0 0 1-1.4 0Z`;
const BAR_BASE_X = [3, 1, 4.5] as const;
const SEQUENCE_CYCLE_MS = 1200;

function computeSequenceStep(elapsedMs: number): {
  barX: [number, number, number];
  playheadDx: number;
} {
  const barX = BAR_BASE_X.map((_, idx) => {
    const phase = (((elapsedMs - 100 * idx) / SEQUENCE_CYCLE_MS) % 1 + 1) % 1;
    const seg = Math.floor(3 * phase);
    const local = (3 * phase) % 1;
    const eased = local < 0.5 ? 4 * local * local * local : 1 - Math.pow(-2 * local + 2, 3) / 2;
    const from = BAR_BASE_X[(idx + seg) % 3];
    const to = BAR_BASE_X[(idx + seg + 1) % 3];
    return from + (to - from) * eased;
  }) as [number, number, number];
  const playheadDx = 3 * Math.sin((elapsedMs / SEQUENCE_CYCLE_MS) * Math.PI * 2);
  return { barX, playheadDx };
}

export function SequencesIcon({
  playheadColor = "currentColor",
  playheadFadeMs = 0,
  working = false,
  ...rest
}: SVGProps<SVGSVGElement> & {
  playheadColor?: string;
  playheadFadeMs?: number;
  working?: boolean;
}) {
  const barsRef = useRef<Array<SVGRectElement | null>>([]);
  const playheadRef = useRef<SVGGElement | null>(null);
  const maskGroupRef = useRef<SVGGElement | null>(null);
  const maskId = useId();

  useEffect(() => {
    const reset = () => {
      barsRef.current.forEach((bar) => bar?.removeAttribute("transform"));
      playheadRef.current?.removeAttribute("transform");
      maskGroupRef.current?.removeAttribute("transform");
    };
    if (!working || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reset();
      return;
    }
    const start = performance.now();
    let rafId = 0;
    const tick = () => {
      const step = computeSequenceStep((performance.now() - start) % SEQUENCE_CYCLE_MS);
      barsRef.current.forEach((bar, i) => {
        bar?.setAttribute("transform", `translate(${step.barX[i] - BAR_BASE_X[i]} 0)`);
      });
      playheadRef.current?.setAttribute("transform", `translate(${step.playheadDx} 0)`);
      maskGroupRef.current?.setAttribute("transform", `translate(${step.playheadDx} 0)`);
      rafId = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(rafId);
      reset();
    };
  }, [working]);

  return (
    <svg {...rest} viewBox="-1 -1 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-1" y="-1" width="18" height="18">
        <rect x="-1" y="-1" width="18" height="18" fill="white" />
        <g
          ref={maskGroupRef}
          fill="black"
          stroke="black"
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <path d={PLAYHEAD_HEAD_PATH} />
          <rect x="7.3" y="3.6" width="1.4" height="11.7" rx="0.7" />
        </g>
      </mask>
      <g mask={`url(#${maskId})`}>
        <g opacity="0.7">
          <rect
            ref={(el) => {
              barsRef.current[0] = el;
            }}
            x="3"
            y="5.9"
            width="10.5"
            height="2.8"
            rx="0.9"
          />
          <rect
            ref={(el) => {
              barsRef.current[1] = el;
            }}
            x="1"
            y="9.2"
            width="10.5"
            height="2.8"
            rx="0.9"
          />
          <rect
            ref={(el) => {
              barsRef.current[2] = el;
            }}
            x="4.5"
            y="12.5"
            width="10.5"
            height="2.8"
            rx="0.9"
          />
        </g>
      </g>
      <g
        ref={playheadRef}
        style={{ fill: playheadColor, transition: `fill ${playheadFadeMs}ms` }}
      >
        <path d={PLAYHEAD_FULL_PATH} />
      </g>
    </svg>
  );
}

function SpriteHoverScrubber({
  sprite,
}: {
  sprite: { cols: number; rows: number; src: string };
}) {
  const scrollRoot = useScrollRoot();
  const { ref: inViewRef, inView } = useInView({
    root: scrollRoot,
    rootMargin: "200px",
    triggerOnce: true,
  });
  const [loaded, setLoaded] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  if (inView && !loaded) {
    setLoaded(true);
  }

  const totalFrames = sprite.cols * sprite.rows;
  const frameIndex =
    hoverProgress !== null
      ? Math.min(totalFrames - 1, Math.floor((hoverProgress / 100) * totalFrames))
      : 0;
  const colRatio = (frameIndex % sprite.cols) / Math.max(1, sprite.cols - 1);
  const rowRatio = Math.floor(frameIndex / sprite.cols) / Math.max(1, sprite.rows - 1);

  return (
    <span
      ref={inViewRef}
      role="img"
      aria-label="A frame of footage; hover to scrub"
      data-hover-scrubber="true"
      className="ygcemG_thumb"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width <= 0) return;
        const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setHoverProgress(pct);
      }}
      onPointerLeave={() => setHoverProgress(null)}
      style={{
        backgroundImage: loaded ? `url(${sprite.src})` : undefined,
        backgroundSize: `${sprite.cols * 100}% ${sprite.rows * 100}%`,
        backgroundPosition: `${colRatio * 100}% ${rowRatio * 100}%`,
      }}
    />
  );
}

function SummaryEditSequence() {
  const [working, setWorking] = useState(false);
  return (
    <SequencesIcon
      className="ygcemG_sequence"
      role="img"
      aria-label="Kino timeline"
      working={working}
      onPointerEnter={() => setWorking(true)}
      onPointerLeave={() => setWorking(false)}
    />
  );
}

function ClaudeSparkStrip() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<Animation | null>(null);

  useEffect(() => {
    return () => {
      animRef.current?.cancel();
    };
  }, []);

  const handlePointerEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !imgRef.current) {
      return;
    }
    animRef.current?.cancel();
    animRef.current = imgRef.current.animate(
      Array.from({ length: 7 }, (_, i) => ({
        transform: `translateY(${(-100 * i) / 7}%)`,
      })),
      {
        duration: 280,
        easing: "steps(7, jump-none)",
        direction: "alternate",
        iterations: 2,
      }
    );
  };

  return (
    <span
      className="ygcemG_shape aspect-square ygcemG_strip"
      role="img"
      aria-label="Claude Code"
      onPointerEnter={handlePointerEnter}
    >
      <img
        ref={imgRef}
        src="/sites/kino/landing/summary/claude-spark-strip.svg"
        alt=""
        draggable={false}
      />
    </span>
  );
}

function DropboxGlyph(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" />
    </svg>
  );
}

function replaceAppImg(src: string) {
  return (
    <img
      draggable={false}
      src={src}
      alt=""
      width={18}
      height={18}
      loading="lazy"
      className="size-full rounded-[4px] object-cover"
    />
  );
}

const REPLACES_ICONS: Record<string, { label: string; icon: ReactNode }> = {
  premiere: {
    label: "Adobe Premiere Pro",
    icon: replaceAppImg("/sites/kino/landing/summary/premiere.webp"),
  },
  finalCut: {
    label: "Final Cut Pro",
    icon: replaceAppImg("/sites/kino/landing/summary/final-cut.webp"),
  },
  resolve: {
    label: "DaVinci Resolve + MCP",
    icon: replaceAppImg("/sites/kino/landing/summary/resolve.webp"),
  },
  descript: {
    label: "Descript",
    icon: replaceAppImg("/sites/kino/landing/summary/descript.webp"),
  },
  hyperframes: {
    label: "HyperFrames",
    icon: replaceAppImg("/sites/kino/landing/summary/hyperframes.webp"),
  },
  dropbox: {
    label: "Dropbox",
    icon: (
      <span className="flex size-full items-center justify-center rounded-[4px] bg-[#0061FF] text-white">
        <DropboxGlyph className="size-3" />
      </span>
    ),
  },
  lucidlink: {
    label: "LucidLink",
    icon: replaceAppImg("/sites/kino/landing/summary/lucidlink.webp"),
  },
  shade: {
    label: "Shade",
    icon: replaceAppImg("/sites/kino/landing/summary/shade.webp"),
  },
  frameio: {
    label: "Frame.io",
    icon: replaceAppImg("/sites/kino/landing/summary/frame-io.webp"),
  },
};

const SUMMARY_COLUMNS: ReadonlyArray<{
  id: string;
  title: string;
  icon: IconComponent;
  body: string;
  replaces: ReadonlyArray<readonly [string, string]>;
}> = [
  {
    id: "edit",
    title: "Edit",
    icon: ListStart,
    body: "Ask for the cut. The agent reads your footage, makes the edit, and leaves every clip on the timeline for you to move.",
    replaces: [
      ["premiere", "Premiere"],
      ["resolve", "DaVinci Resolve"],
      ["finalCut", "Final Cut"],
      ["descript", "Descript"],
      ["hyperframes", "HyperFrames"],
    ],
  },
  {
    id: "storage",
    title: "Store",
    icon: Search,
    body: "Your footage lives in Kino. Terabytes scrub locally, and every clip is transcribed, described, and searchable.",
    replaces: [
      ["dropbox", "Dropbox"],
      ["shade", "Shade"],
      ["lucidlink", "LucidLink"],
    ],
  },
  {
    id: "review",
    title: "Review",
    icon: MessageSquareText,
    body: "Send a link. Comments land on your timeline, and the agent can answer them.",
    replaces: [
      ["frameio", "Frame.io"],
      ["shade", "Shade"],
    ],
  },
];

function ReplaceAppBadge({ name, children }: { name: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  return (
    <span
      className="qIUd4G_logo relative"
      tabIndex={0}
      data-state={open ? "delayed-open" : "closed"}
      data-slot="tooltip-trigger"
      onPointerDown={(e) => setIsTouch(e.pointerType !== "mouse")}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        if (isTouch) {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      }}
    >
      {children}
      <span className="sr-only">{name}</span>
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-100 shadow-md ring-1 ring-white/10"
        >
          {name}
        </span>
      )}
    </span>
  );
}

const SUMMARY_SPRITE = {
  cols: 6,
  rows: 6,
  src: "/sites/kino/landing/summary/c5r-film-sprite.webp",
};

export function SummarySection() {
  const { viewportRef, atStart, atEnd, step } = useCarousel();

  return (
    <section aria-labelledby="landing-summary" className="qIUd4G_summary">
      <h2 id="landing-summary" className="qIUd4G_sentence">
        <span className="qIUd4G_lit">Store</span> your{" "}
        <span className="qIUd4G_pair">
          footage <SpriteHoverScrubber sprite={SUMMARY_SPRITE} />
        </span>
        ,{" "}
        <span className="qIUd4G_pair">
          <SummaryEditSequence />
          <span className="qIUd4G_lit">edit</span>
        </span>{" "}
        it, and <span className="qIUd4G_lit">review</span> it,
        <br className="qIUd4G_break" /> in one place, with your team and your{" "}
        <span className="qIUd4G_pair">
          <ClaudeSparkStrip />
          <span className="qIUd4G_lit">agents.</span>
        </span>
      </h2>
      <div ref={viewportRef} className="qIUd4G_panel budsZG_panel">
        {SUMMARY_COLUMNS.map((col) => {
          const Icon = col.icon;
          return (
            <article
              key={col.id}
              aria-labelledby={`landing-${col.id}`}
              className="qIUd4G_column budsZG_panel"
              data-carousel-item="true"
            >
              <div className="qIUd4G_columnBody">
                <Icon className="qIUd4G_columnIcon" strokeWidth={1.5} aria-hidden="true" />
                <h3 id={`landing-${col.id}`}>{col.title}</h3>
                <p>{col.body}</p>
              </div>
              <div className="qIUd4G_replaces">
                <span>Replaces</span>
                <ul>
                  {col.replaces.map(([key, label]) => (
                    <li key={key}>
                      <ReplaceAppBadge name={label}>{REPLACES_ICONS[key]?.icon}</ReplaceAppBadge>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
      <CarouselPaddles
        atStart={atStart}
        atEnd={atEnd}
        step={step}
        className="qIUd4G_featurePaddles"
      />
    </section>
  );
}

const STAGE_STEPS = [
  { id: "edit", label: "Edit" },
  { id: "storage", label: "Store" },
  { id: "review", label: "Review" },
] as const;

export function StickyStages({ children }: { children: ReactNode }) {
  const abortCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      abortCleanupRef.current?.();
    };
  }, []);

  const childArray = Children.toArray(children);

  return (
    <div className="NNJRJa_stages">
      <div className="NNJRJa_rail">
        <nav className="NNJRJa_pill" aria-label="Edit, store, review">
          <div className="NNJRJa_pillInner">
            {STAGE_STEPS.map(({ id, label }) => (
              <a
                key={id}
                href={`#landing-step-${id}`}
                className="NNJRJa_word"
                style={{ ["--timeline" as string]: `--landing-step-${id}` }}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(`landing-step-${id}`);
                  if (!target) return;
                  abortCleanupRef.current?.();
                  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  if (!reduced) {
                    const scroller =
                      target.closest("[data-radix-scroll-area-viewport]") ?? document;
                    const controller = new AbortController();
                    const timer = window.setTimeout(() => controller.abort(), 4000);
                    abortCleanupRef.current = () => {
                      controller.abort();
                      clearTimeout(timer);
                    };
                    scroller.addEventListener(
                      "scrollend",
                      () => {
                        abortCleanupRef.current?.();
                        target.scrollIntoView({ behavior: "instant", block: "start" });
                      },
                      { once: true, signal: controller.signal }
                    );
                  }
                  target.scrollIntoView({
                    behavior: reduced ? "instant" : "smooth",
                    block: "start",
                  });
                }}
              >
                {label}
                <span className="NNJRJa_track" aria-hidden="true">
                  <span />
                </span>
              </a>
            ))}
          </div>
        </nav>
      </div>
      <div className="NNJRJa_steps">
        {childArray.map((child, idx) => {
          const id = STAGE_STEPS[idx]?.id ?? String(idx);
          return (
            <div
              key={id}
              id={`landing-step-${id}`}
              className="NNJRJa_step"
              style={{ ["--timeline" as string]: `--landing-step-${id}` }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function selectTemplateRecording(
  template: KinoTemplate,
  variant?: string
): KinoTemplateRecording {
  const key = variant ?? template.defaultVariant ?? "";
  return (
    template.cards[key] ??
    template.cards[template.defaultVariant ?? ""] ??
    Object.values(template.cards)[0]
  );
}

function resolveActiveScrubSheet(
  recording: KinoTemplateRecording,
  coverCrop?: KinoCoverCrop
): KinoSpriteSheet {
  const rc = recording.coverCrop;
  if (
    coverCrop &&
    rc &&
    recording.coverScrub &&
    coverCrop.left === rc.left &&
    coverCrop.top === rc.top &&
    coverCrop.width === rc.width &&
    coverCrop.height === rc.height
  ) {
    return recording.coverScrub;
  }
  return recording.scrub;
}

function TemplateScrubCanvas({
  recording,
  coverCrop,
  initialPreviewValue = 0,
  onPainted,
  fit = "contain",
}: {
  recording: KinoTemplateRecording;
  coverCrop?: KinoCoverCrop;
  initialPreviewValue?: number;
  onPainted: () => void;
  fit?: "contain" | "cover";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrub = resolveActiveScrubSheet(recording, coverCrop);
  const overview = scrub === recording.coverScrub ? recording.coverOverview : recording.overview;
  const [previewPct, setPreviewPct] = useState(initialPreviewValue);
  const sheetImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [, setVersion] = useState(0);

  const targetFrame = Math.round((previewPct / 100) * (recording.durationInFrames - 1));

  let nearestIdx = 0;
  for (let i = 1; i < scrub.frames.length; i += 1) {
    if (Math.abs(scrub.frames[i] - targetFrame) < Math.abs(scrub.frames[nearestIdx] - targetFrame)) {
      nearestIdx = i;
    }
  }
  const sheetIndex = Math.floor(nearestIdx / scrub.framesPerSheet);
  const sheetUrl = scrub.sheets[sheetIndex];
  const overviewUrl = overview?.sheets[0];

  useEffect(() => {
    const urls = [overviewUrl, sheetUrl].filter((u): u is string => Boolean(u));
    let cancelled = false;
    for (const url of urls) {
      if (sheetImagesRef.current.has(url)) continue;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        sheetImagesRef.current.set(url, img);
        setVersion((v) => v + 1);
      };
      img.src = url;
    }
    return () => {
      cancelled = true;
    };
  }, [overviewUrl, sheetUrl]);

  const drawFrame = useCallback(
    (frameNum: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let idx = 0;
      for (let i = 1; i < scrub.frames.length; i += 1) {
        if (Math.abs(scrub.frames[i] - frameNum) < Math.abs(scrub.frames[idx] - frameNum)) {
          idx = i;
        }
      }
      const sUrl = scrub.sheets[Math.floor(idx / scrub.framesPerSheet)];
      const highResImg = sUrl ? sheetImagesRef.current.get(sUrl) : undefined;
      const lowResImg = overviewUrl ? sheetImagesRef.current.get(overviewUrl) : undefined;
      const activeImg = highResImg ?? lowResImg;
      const activeConfig = highResImg ? scrub : overview;
      if (!activeImg || !activeConfig) return;

      let localIdx = idx;
      if (!highResImg) {
        localIdx = 0;
        for (let i = 1; i < activeConfig.frames.length; i += 1) {
          if (
            Math.abs(activeConfig.frames[i] - frameNum) <
            Math.abs(activeConfig.frames[localIdx] - frameNum)
          ) {
            localIdx = i;
          }
        }
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cell = localIdx % activeConfig.framesPerSheet;
      const sx = (cell % activeConfig.columns) * activeConfig.width;
      const sy = Math.floor(cell / activeConfig.columns) * activeConfig.height;
      ctx.clearRect(0, 0, scrub.width, scrub.height);
      ctx.drawImage(
        activeImg,
        sx,
        sy,
        activeConfig.width,
        activeConfig.height,
        0,
        0,
        scrub.width,
        scrub.height
      );
      onPainted();
    },
    [onPainted, overview, overviewUrl, scrub]
  );

  useEffect(() => {
    drawFrame(targetFrame);
  }, [drawFrame, targetFrame]);

  const isCoverScrub = scrub === recording.coverScrub;
  const canvasEl = (
    <canvas
      ref={canvasRef}
      width={scrub.width}
      height={scrub.height}
      className="pointer-events-none h-full w-full"
      style={{ objectFit: fit }}
    />
  );

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width <= 0) return;
        const raw = (e.clientX - rect.left) / rect.width;
        const norm = Math.max(
          0,
          Math.min(1, coverCrop ? raw * coverCrop.width + coverCrop.left : raw)
        );
        setPreviewPct(norm * 100);
      }}
    >
      {isCoverScrub ? null : canvasEl}
      <div
        className={coverCrop ? "absolute" : "absolute inset-0"}
        style={
          coverCrop
            ? {
                left: `${(-coverCrop.left / coverCrop.width) * 100}%`,
                top: `${(-coverCrop.top / coverCrop.height) * 100}%`,
                width: `${100 / coverCrop.width}%`,
                height: `${100 / coverCrop.height}%`,
              }
            : undefined
        }
      >
        {isCoverScrub ? canvasEl : null}
      </div>
    </div>
  );
}

export function TemplateThumb({
  template,
  variant,
  eager = false,
}: {
  template: KinoTemplate;
  variant?: string;
  eager?: boolean;
}) {
  const recording = selectTemplateRecording(template, variant);
  const coverFrame = template.cover?.frame;
  const [hovering, setHovering] = useState(false);
  const [canvasPainted, setCanvasPainted] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [initialPct, setInitialPct] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollRoot = useScrollRoot();
  const { ref: inViewRef, inView } = useInView({
    root: scrollRoot,
    rootMargin: "200px 0px",
  });

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setCanPlay(canAutoplayVideo());
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const hasCoverScrub = Boolean(recording.coverScrub);
  const ambientSrc =
    recording.ambient &&
    (!hasCoverScrub || resolveActiveScrubSheet(recording, coverFrame) === recording.coverScrub)
      ? recording.ambient
      : null;

  const shouldMountVideo = Boolean(ambientSrc && inView && canPlay && posterLoaded);

  useEffect(() => {
    const video = videoRef.current;
    if (!shouldMountVideo || !video) return;
    if (hovering) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [shouldMountVideo, hovering]);

  const videoNode =
    shouldMountVideo && ambientSrc ? (
      <video
        ref={videoRef}
        src={ambientSrc}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className={cn(
          "absolute inset-0 h-full w-full",
          hasCoverScrub || !coverFrame ? "object-cover" : "object-contain",
          (!videoPlaying || hovering) && "invisible"
        )}
        onPlaying={() => setVideoPlaying(true)}
      />
    ) : null;

  const aspectRatio = template.cover?.aspect ?? template.aspect;

  return (
    <div
      ref={inViewRef}
      className="tpl-thumb"
      style={{ aspectRatio }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        const frameEl = e.currentTarget.querySelector(".tpl-frame");
        if (frameEl) {
          const rect = frameEl.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / Math.max(1, rect.width);
          setInitialPct(
            Math.max(
              0,
              Math.min(100, (coverFrame ? ratio * coverFrame.width + coverFrame.left : ratio) * 100)
            )
          );
        }
        setCanvasPainted(false);
        setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
    >
      <div className={cn("tpl-frame", template.backdrop)}>
        {hasCoverScrub ? videoNode : null}
        <div
          className="absolute"
          style={
            coverFrame
              ? {
                  left: `${coverFrame.left * 100}%`,
                  top: `${coverFrame.top * 100}%`,
                  width: `${coverFrame.width * 100}%`,
                  height: `${coverFrame.height * 100}%`,
                }
              : { inset: 0 }
          }
        >
          {hasCoverScrub ? null : videoNode}
          {hovering ? (
            <TemplateScrubCanvas
              recording={recording}
              coverCrop={coverFrame}
              initialPreviewValue={initialPct}
              onPainted={() => setCanvasPainted(true)}
              fit={coverFrame ? "contain" : "cover"}
            />
          ) : null}
          <img
            ref={(el) => {
              if (el?.complete && el.naturalWidth) setPosterLoaded(true);
            }}
            src={eager || inView || posterLoaded ? recording.poster : undefined}
            crossOrigin="anonymous"
            alt=""
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            draggable={false}
            onLoad={() => setPosterLoaded(true)}
            className={cn(
              "absolute inset-0 h-full w-full",
              coverFrame ? "object-contain" : "object-cover",
              (hovering ? canvasPainted : videoPlaying) && "invisible"
            )}
          />
        </div>
      </div>
    </div>
  );
}

const REFRAME_FPS = 24000 / 1001;
const REFRAME_CAPTIONS = [
  { from: 0, to: 30, text: "We’ve reverse-engineered" },
  { from: 30, to: 67, text: "the firmware of each instrument" },
  { from: 67, to: 110, text: "So the model can talk through it" },
  { from: 110, to: 134, text: "over software." },
] as const;

function AgentReframeTile() {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2 });
  const sourceVideoRef = useRef<HTMLVideoElement | null>(null);
  const cropVideoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(1.6);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const crop = cropVideoRef.current;
    const source = sourceVideoRef.current;
    if (!crop || !source || !inView || !playing) return;
    let rafId = 0;
    const sync = () => {
      if (Math.abs(source.currentTime - crop.currentTime) > 0.08) {
        source.currentTime = crop.currentTime;
      }
      setCurrentTime(crop.currentTime);
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [inView, playing]);

  const frame = currentTime * REFRAME_FPS;
  const activeCue =
    REFRAME_CAPTIONS.find((cue) => frame >= cue.from && frame < cue.to) ??
    REFRAME_CAPTIONS[REFRAME_CAPTIONS.length - 1];
  const words = activeCue.text.split(" ");
  const spokenCount = Math.min(
    words.length,
    Math.floor(((frame - activeCue.from) / (activeCue.to - activeCue.from)) * words.length) + 1
  );
  const splitIdx = Math.ceil(words.length / 2);

  const renderWords = (start: number, end: number) =>
    words.slice(start, end).map((word, idx) => (
      <span key={start + idx} data-spoken={start + idx < spokenCount || undefined}>
        {word}{" "}
      </span>
    ));

  return (
    <div ref={inViewRef} className="_0cqJHG_inner _0cqJHG_reframe">
      <div className="_0cqJHG_source">
        <LazyVideo
          eagerPoster
          ref={sourceVideoRef}
          className="_0cqJHG_landscape"
          src="/sites/kino/landing/agent/vertical-source.mp4"
          poster="/sites/kino/landing/agent/vertical-source-poster.webp"
          aria-label="Justin talks to camera in the C5R lab while a 9:16 frame follows him as the camera moves."
        />
        <p>Make this vertical, follow speaker, use roto and branding.</p>
      </div>
      <svg
        className="_0cqJHG_arrow"
        width="24"
        height="12"
        viewBox="0 0 24 12"
        aria-hidden="true"
      >
        <path
          d="M1 6h21M17 1l5 5-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="_0cqJHG_vertical">
        <LazyVideo
          eagerPoster
          ref={cropVideoRef}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEmptied={() => setPlaying(false)}
          src="/sites/kino/landing/agent/vertical-crop.mp4"
          poster="/sites/kino/landing/agent/vertical-crop-poster.webp"
          aria-label="The vertical cut: Justin cut out over a blurred lab, with the C5R logo behind his head and captions."
        />
        <div className="_0cqJHG_shade" aria-hidden="true" />
        <p className="_0cqJHG_words" aria-hidden="true">
          <span>{renderWords(0, splitIdx)}</span>
          <span>{renderWords(splitIdx, words.length)}</span>
        </p>
      </div>
    </div>
  );
}

const AGENT_REQUEST_ROWS: ReadonlyArray<{
  text: string;
  icon: IconComponent;
  kind: string;
  lit?: boolean;
}> = [
  {
    text: "Turn this blog post into an explainer video",
    icon: FileText,
    kind: "Write",
  },
  {
    text: "Use the brand clone skill on fieldnotes.fm",
    icon: Globe,
    kind: "Brand",
  },
  {
    text: "Make it 9:16 and fix whatever breaks",
    icon: Smartphone,
    kind: "Deliver",
    lit: true,
  },
  {
    text: "Line up all 5 WAVs with the camera audio",
    icon: AudioLines,
    kind: "Sound",
  },
  {
    text: "Find and insert YouTube b-roll of Yosemite",
    icon: SquarePlay,
    kind: "Find",
  },
];

export function AgentSection({
  templates,
}: {
  templates: {
    tall: KinoTemplate;
    picked: KinoTemplate[];
    more: number;
  };
}) {
  const { viewportRef, atStart, atEnd, step } = useCarousel();

  return (
    <section aria-labelledby="landing-agent" className="_0cqJHG_agent">
      <h2 id="landing-agent" className="_0cqJHG_headline">
        Kino’s agent is powerful.
      </h2>
      <KinoScrollArea
        orientation="horizontal"
        type="hover"
        viewportRef={viewportRef}
        viewportClassName="_0cqJHG_viewport"
        role="region"
        aria-label="What the agent can do"
      >
        <div className="_0cqJHG_row">
          <div className="_0cqJHG_tile" data-carousel-item="true">
            <div className="_0cqJHG_panel budsZG_panel">
              <div className="_0cqJHG_inner _0cqJHG_motion">
                <LazyVideo
                  eagerPoster
                  src="/sites/kino/landing/agent/motion-hey-astra.mp4"
                  poster="/sites/kino/landing/agent/motion-hey-astra-poster.webp"
                  aria-label="A hand raises a small TING speaker in the C5R lab and “hey, astra” lands over the shot in tall condensed type, then the film cuts fast through station numbers, camera feeds and white models of the lab."
                />
              </div>
            </div>
            <p className="_0cqJHG_caption">
              Your agent is great at motion graphics and animation in Kino. Built upon Remotion and
              optimized for fast playback, you can also tweak any detail within Kino’s “what you see
              is what you get” editor.
            </p>
          </div>

          <div className="_0cqJHG_tile" data-carousel-item="true">
            <div className="_0cqJHG_panel budsZG_panel">
              <AgentReframeTile />
            </div>
            <p className="_0cqJHG_caption">
              Manage many variants of your video and ask the agent to one-shot each.
            </p>
          </div>

          <div className="_0cqJHG_tile" data-carousel-item="true">
            <div className="_0cqJHG_panel budsZG_panel">
              <div className="_0cqJHG_inner">
                <div className="_0cqJHG_templates">
                  <a
                    href={`/templates/${templates.tall.slug}`}
                    className="_0cqJHG_template _0cqJHG_tall"
                    aria-label={templates.tall.title}
                  >
                    <TemplateThumb template={templates.tall} eager />
                  </a>
                  {templates.picked.map((tpl) => (
                    <a
                      key={tpl.slug}
                      href={`/templates/${tpl.slug}`}
                      className="_0cqJHG_template"
                      aria-label={tpl.title}
                    >
                      <TemplateThumb template={tpl} eager />
                    </a>
                  ))}
                  <a href="/templates" className="_0cqJHG_template _0cqJHG_more">
                    <span>{templates.more} more</span>
                    <span>Browse templates →</span>
                  </a>
                </div>
              </div>
            </div>
            <p className="_0cqJHG_caption">
              Start with craft. 100+ templates: titles, maps, captions and transitions. Bring them
              in or ask your agent to take inspiration from them.
            </p>
          </div>

          <div className="_0cqJHG_tile" data-carousel-item="true">
            <div className="_0cqJHG_panel budsZG_panel">
              <div className="_0cqJHG_inner _0cqJHG_requests">
                <ul>
                  {AGENT_REQUEST_ROWS.map((row) => {
                    const Icon = row.icon;
                    return (
                      <li key={row.text} data-lit={row.lit || undefined}>
                        <Icon className="_0cqJHG_rowIcon" strokeWidth={1.65} aria-hidden="true" />
                        <span>{row.text}</span>
                        <span className="_0cqJHG_kind">{row.kind}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <p className="_0cqJHG_caption">
              Every creative decision is exposed to you and your agent.
            </p>
          </div>
        </div>
      </KinoScrollArea>
      <CarouselPaddles
        atStart={atStart}
        atEnd={atEnd}
        step={step}
        className="_0cqJHG_paddles"
      />
    </section>
  );
}

function LegacyEditorMarks() {
  return (
    <span className="p84c8a_marks" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 0h16c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4zm0 .8c-1.8 0-3.2 1.4-3.2 3.2v16c0 1.8 1.4 3.2 3.2 3.2h16c1.8 0 3.2-1.4 3.2-3.2V4c0-1.8-1.4-3.2-3.2-3.2H4zM6.297 5.778c0-.066.017-.116.1-.116.643-.033 1.583-.05 2.573-.05 2.772 0 3.977 1.519 3.977 3.466 0 2.54-1.839 3.63-4.099 3.63-.38 0-.512-.017-.776-.017v3.843c0 .083-.033.116-.115.116H6.413c-.083 0-.116-.033-.116-.116zm1.775 5.313c.231.016.413.016.809.016 1.171 0 2.267-.412 2.267-1.996 0-1.27-.782-1.914-2.119-1.914-.396 0-.775.016-.957.033zm6.4-.908c0-.115 0-.412-.049-.973 0-.083.011-.1.077-.132a10.42 10.42 0 0 1 3.657-.693c.082 0 .115.016.115.099v1.452c0 .082-.026.099-.109.099a5.725 5.725 0 0 0-1.89.198v6.301c0 .083-.034.116-.116.116h-1.57c-.082 0-.115-.033-.115-.116z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0zm0 .93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97zm-5.66 3.423c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864zm4.172 7.922a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001zm-8.432.038a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
        <path d="M5.35 0H18.65C21.6 0 24 2.4 24 5.35V18.65C24 21.6 21.6 24 18.65 24H5.35C2.4 24 0 21.6 0 18.65V5.35C0 2.4 2.4 0 5.35 0zM22.53 3.46L22.3 3.04L22.02 2.65L21.7 2.3L21.35 1.98L21.29 1.94L22.72 3.91L22.71 3.9zM5.31 1.05L4.87 1.07L6.97 4L4.19 7.86L8.16 7.86L10.94 4L8.82 1.05zM12.75 1.05L14.87 4L12.09 7.86L16.06 7.86L18.84 4L16.72 1.05zM1.7 3.04L1.47 3.46L1.29 3.9L1.16 4.35L1.08 4.82L1.05 5.31L1.05 6.75L3.03 4L2.03 2.6L1.98 2.65zM22.92 4.82L22.84 4.35L22.75 4.03L19.99 7.86L22.95 7.86L22.95 5.31zM1.84 9.57C1.64 9.57 1.49 9.72 1.49 9.92V18.21C1.49 20.59 3.41 22.51 5.79 22.51H18.21C20.59 22.51 22.51 20.59 22.51 18.21V9.92C22.51 9.72 22.36 9.57 22.16 9.57z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
        <path d="M4 0h16c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4zm0 .8c-1.8 0-3.2 1.4-3.2 3.2v16c0 1.8 1.4 3.2 3.2 3.2h16c1.8 0 3.2-1.4 3.2-3.2V4c0-1.8-1.4-3.2-3.2-3.2H4zM6.54 6.93C6.04 7.02 5.72 7.29 5.56 7.73L5.5 7.9L5.5 9.07L5.5 10.24L6.04 10.52C6.34 10.68 6.82 10.92 7.11 11.08C7.4 11.23 7.82 11.44 8.04 11.56C8.26 11.67 8.54 11.82 8.66 11.88C8.78 11.94 8.88 11.99 8.88 12C8.88 12.01 7.38 12.8 6.26 13.37C6.08 13.47 5.83 13.6 5.71 13.66L5.5 13.78L5.5 14.93C5.5 16.06 5.5 16.09 5.55 16.25C5.68 16.65 5.96 16.91 6.42 17.05C6.62 17.11 14.7 17.13 15 17.07C15.62 16.94 16.05 16.47 16.05 15.9C16.05 15.83 16.06 15.76 16.06 15.76C16.08 15.74 16.29 15.85 17.63 16.56C18.09 16.8 18.47 17 18.48 16.99C18.49 16.99 18.5 16.53 18.5 15.97L18.5 14.95L18.06 14.72C17.81 14.6 17.48 14.42 17.31 14.33C17.14 14.25 16.82 14.08 16.6 13.97C16.38 13.85 16.12 13.71 16.02 13.66C15.82 13.55 15.63 13.46 14.66 12.95C14.35 12.79 13.98 12.6 13.85 12.53C13.72 12.46 13.45 12.32 13.25 12.21C13.04 12.11 12.87 12.01 12.87 12C12.87 11.99 13 11.91 13.15 11.83C13.71 11.54 13.89 11.44 15.79 10.44C16.86 9.88 17.89 9.34 18.09 9.24C18.28 9.13 18.45 9.04 18.47 9.03C18.5 9.01 18.51 6.99 18.49 6.99C18.48 6.99 18.28 7.09 18.04 7.22C17.6 7.45 17.48 7.51 16.62 7.96C16.34 8.11 16.09 8.24 16.08 8.24C16.06 8.24 16.05 8.18 16.05 8.11C16.05 7.54 15.62 7.05 15.01 6.93C14.77 6.88 6.78 6.88 6.54 6.93zM14.97 8.81C14.97 8.82 14.8 8.91 14.6 9.01C14.39 9.12 14.13 9.26 14.02 9.32C13.9 9.38 13.24 9.73 12.56 10.08C11.87 10.44 11.21 10.79 11.09 10.85L10.86 10.97L10.35 10.71C10.06 10.56 9.71 10.38 9.57 10.31C9.1 10.06 8.69 9.85 8.01 9.49C6.88 8.91 6.75 8.84 6.73 8.82C6.71 8.81 8.42 8.8 10.84 8.8C13.11 8.8 14.97 8.81 14.97 8.81zM11.98 13.6C12.22 13.72 12.56 13.91 12.75 14C12.93 14.09 13.26 14.27 13.49 14.39C13.71 14.51 14.05 14.68 14.23 14.78C14.41 14.87 14.66 15 14.78 15.07L15 15.19L12.93 15.19C11.79 15.2 9.92 15.2 8.77 15.19L6.69 15.19L7.93 14.54C8.61 14.19 9.31 13.82 9.47 13.73C9.64 13.65 9.96 13.48 10.17 13.37C10.38 13.26 10.63 13.13 10.71 13.09L10.86 13.01L11.2 13.19C11.39 13.29 11.74 13.47 11.98 13.6z" />
      </svg>
    </span>
  );
}

function clampSplit(val: number): number {
  return Math.min(98, Math.max(2, val));
}

const SplitWipeViewer = forwardRef<
  HTMLDivElement,
  {
    under: ReactNode;
    over: ReactNode;
    className?: string;
    label: string;
  }
>(function SplitWipeViewer({ under, over, className, label }, forwardedRef) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement, []);
  const [manualSplit, setManualSplit] = useState<number | null>(null);

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && rect.width !== 0) {
      setManualSplit(clampSplit(((clientX - rect.left) / rect.width) * 100));
    }
  };

  const isManual = manualSplit !== null;
  const currentVal = Math.round(manualSplit ?? 40);

  return (
    <div
      ref={containerRef}
      className={`x949Qa_viewer  ${isManual ? "x949Qa_manual" : ""} ${className ?? ""}`}
      style={isManual ? { ["--split" as string]: `${manualSplit}%` } : undefined}
      onPointerDown={(e) => {
        if (e.button === 0 || e.pointerType !== "mouse") {
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          updateFromClientX(e.clientX);
        }
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
      onPointerCancel={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
    >
      <div className="x949Qa_under">{under}</div>
      <div className="x949Qa_over">{over}</div>
      <div
        className="x949Qa_playhead"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={2}
        aria-valuemax={98}
        aria-valuenow={currentVal}
        onKeyDown={(e) => {
          const delta = e.shiftKey ? 10 : 2;
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            setManualSplit(
              clampSplit((manualSplit ?? 40) + (e.key === "ArrowLeft" ? -delta : delta))
            );
          }
        }}
      >
        <span className="x949Qa_cap" />
      </div>
    </div>
  );
});

export function OfflineFigure({
  src = "/sites/kino/landing/c5r-plate-loading.mp4",
  name = "VID_20260920_172713_010.insv",
}: {
  src?: string;
  name?: string;
}) {
  const scrollRoot = useScrollRoot();
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    const video = videoRef.current;
    if (!viewer || !video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { root: scrollRoot, rootMargin: "120px 0px" }
    );
    io.observe(viewer);
    return () => io.disconnect();
  }, [scrollRoot]);

  return (
    <figure className="docs-figure">
      <div className="docs-panel docs-panel-lg">
        <SplitWipeViewer
          ref={viewerRef}
          className="p84c8a_viewer"
          label="Wipe between the Media offline slate and the clip streaming in Kino"
          under={
            <>
              <div
                className="p84c8a_slate"
                role="img"
                aria-label="The Media offline slate, in ten languages"
              >
                <div className="p84c8a_slateText">
                  {OFFLINE_LANGUAGES.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
              <span className="x949Qa_chip x949Qa_chipLeft">
                <LegacyEditorMarks />
                Every legacy editor
              </span>
            </>
          }
          over={
            <>
              <video
                ref={videoRef}
                className="p84c8a_clip"
                src={src}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The same clip, streaming in Kino"
              />
              <span className="x949Qa_chip x949Qa_chipRight">
                <img
                  src="/sites/kino/logo/kino-primary-logo-white-italic.svg"
                  width={880}
                  height={140}
                  alt="Kino"
                  className="p84c8a_wordmark"
                  draggable={false}
                />
              </span>
              <span className="p84c8a_fileChip">
                <span className="workbench-control-surface p84c8a_cloud" aria-hidden="true">
                  <Cloud strokeWidth={2} />
                </span>
                {name}
              </span>
            </>
          }
        />
      </div>
    </figure>
  );
}

function FinderCameraCard() {
  return (
    <figure
      className="docs-finder"
      role="img"
      aria-label="A camera card in Finder: R3D, BRAW, ProRes, DNxHR and MXF files"
    >
      <div className="docs-finder-window">
        <div className="docs-finder-toolbar">
          <div className="docs-finder-lights">
            <span />
            <span />
            <span />
          </div>
          <div className="docs-finder-glass docs-finder-history">
            <span>
              <img src={FINDER_ICONS.back} width={12} height={16} alt="" />
            </span>
            <span className="docs-finder-divider" />
            <span>
              <img src={FINDER_ICONS.forward} width={12} height={16} alt="" />
            </span>
          </div>
          <p className="docs-finder-title">A001</p>
          <div className="docs-finder-glass docs-finder-views">
            <span>
              <img src={FINDER_ICONS.viewIcons} width={18} height={16} alt="" />
            </span>
            <span data-selected="true">
              <img src={FINDER_ICONS.viewList} width={19} height={13} alt="" />
            </span>
            <span>
              <img src={FINDER_ICONS.viewColumns} width={22} height={16} alt="" />
            </span>
            <span>
              <img src={FINDER_ICONS.viewGallery} width={22} height={16} alt="" />
            </span>
          </div>
          <div className="docs-finder-glass docs-finder-search">
            <img src={FINDER_ICONS.search} width={18} height={18} alt="" />
          </div>
        </div>
        <div className="docs-finder-header">
          <div className="docs-finder-name">
            <span>Name</span>
            <img src={FINDER_ICONS.sortAscending} width={10} height={7} alt="" />
          </div>
          <div className="docs-finder-size">Size</div>
          <div className="docs-finder-kind">Kind</div>
        </div>
        <div className="docs-finder-rows">
          {FINDER_ROWS.map((row, idx) => (
            <div
              key={row.name}
              className="docs-finder-row"
              data-selected={idx === 0 || undefined}
            >
              <div className="docs-finder-name">
                <img src={row.icon} width={16} height={16} alt="" />
                <MiddleTruncate text={row.name} />
              </div>
              <div className="docs-finder-size">{row.size}</div>
              <div className="docs-finder-kind">{row.kind}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

const STORE_SOURCES = ["mac", "ext", "sd", "dropbox", "gdrive", "shade"] as const;

export function StoreSection() {
  return (
    <section aria-labelledby="landing-store" className="TvBR7W_store">
      <h2 id="landing-store" className="TvBR7W_headline">
        <span className="TvBR7W_lit">One library for every clip.</span> Bring footage from anywhere,
        and Kino knows what’s in all of it.
      </h2>
      <div className="TvBR7W_bento">
        <div className="TvBR7W_panel budsZG_panel">
          <div className="TvBR7W_inner">
            <div
              className="TvBR7W_strip"
              role="img"
              aria-label="The Kino drive on a burst of blue light, beside the places footage comes from: a Mac Studio, an external drive, an SD card, Dropbox, Google Drive and Shade."
            >
              <img
                width={1024}
                height={576}
                src="/sites/kino/landing/store/rays.webp"
                alt=""
                className="TvBR7W_rays"
                loading="lazy"
                draggable={false}
              />
              <img
                width={480}
                height={582}
                sizes="(min-width: 768px) 100px, 52px"
                srcSet="/sites/kino/landing/store/drive-small.webp 200w, /sites/kino/landing/store/drive.webp 480w"
                src="/sites/kino/landing/store/drive-small.webp"
                alt=""
                className="TvBR7W_drive"
                loading="lazy"
                draggable={false}
              />
              <div className="TvBR7W_sources">
                {STORE_SOURCES.map((source) => (
                  <img
                    key={source}
                    src={`/sites/kino/landing/store/${source}.webp`}
                    alt=""
                    data-source={source}
                    loading="lazy"
                    draggable={false}
                  />
                ))}
              </div>
            </div>
            <div className="TvBR7W_cells">
              <div className="TvBR7W_cell">
                <div className="TvBR7W_well">
                  <picture>
                    <source
                      media="(width < 768px)"
                      srcSet={FINDER_ICONS.searchPhone.src}
                      width={FINDER_ICONS.searchPhone.width}
                      height={FINDER_ICONS.searchPhone.height}
                    />
                    <img
                      src={FINDER_ICONS.searchDesktop.src}
                      width={FINDER_ICONS.searchDesktop.width}
                      height={FINDER_ICONS.searchDesktop.height}
                      alt="The Kino media panel searching for “singing the national anthem”. Each matching clip has a blue mark on its strip where the singing happens."
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </picture>
                </div>
                <div className="TvBR7W_caption">
                  <h3>Search what’s said and what’s on screen.</h3>
                  <p>Every clip is transcribed, described shot by shot, and knows who’s in it.</p>
                </div>
              </div>
              <div className="TvBR7W_cell">
                <div className="TvBR7W_well">
                  <picture>
                    <source
                      media="(width < 768px)"
                      srcSet={FINDER_ICONS.libraryPhone.src}
                      width={FINDER_ICONS.libraryPhone.width}
                      height={FINDER_ICONS.libraryPhone.height}
                    />
                    <img
                      src={FINDER_ICONS.libraryDesktop.src}
                      width={FINDER_ICONS.libraryDesktop.width}
                      height={FINDER_ICONS.libraryDesktop.height}
                      alt="The Filter menu in the Kino media panel, open on Codec, with how many clips use each: 82 H.264, 22 HEVC, 46 ProRes and 64 Blackmagic RAW."
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </picture>
                </div>
                <div className="TvBR7W_caption">
                  <h3>Filter by codec, camera, lens and shoot day.</h3>
                  <p>Save a filter and it becomes a smart bin that fills as footage arrives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="TvBR7W_pair">
          <div className="TvBR7W_panel budsZG_panel">
            <div className="TvBR7W_inner">
              <div className="TvBR7W_cell">
                <div className="TvBR7W_figure">
                  <FinderCameraCard />
                </div>
                <div className="TvBR7W_caption">
                  <h3>Cut camera originals. No transcode.</h3>
                  <p>
                    RED, Blackmagic RAW, ProRes, DNxHR and MXF play as the camera or Avid wrote
                    them.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="TvBR7W_panel budsZG_panel">
            <div className="TvBR7W_inner">
              <div className="TvBR7W_cell">
                <div className="TvBR7W_figure">
                  <OfflineFigure
                    src="/sites/kino/landing/c5r-plate-loading.mp4"
                    name="VID_20260920_172713_010.insv"
                  />
                </div>
                <div className="TvBR7W_caption">
                  <h3>“Media offline” is dead.</h3>
                  <p>Every clip streams from Kino, so a project opens the same on any machine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
