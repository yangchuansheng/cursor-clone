"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type VideoHTMLAttributes,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollRootContext = createContext<HTMLElement | null>(null);

export function useScrollRoot(): HTMLElement | null {
  return useContext(ScrollRootContext);
}

export interface UseInViewOptions {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  skip?: boolean;
  initialInView?: boolean;
}

export function useInView(options: UseInViewOptions = {}): {
  ref: (node: HTMLElement | null) => void;
  inView: boolean;
} {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    triggerOnce = false,
    skip = false,
    initialInView = false,
  } = options;
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState<boolean>(initialInView);

  useEffect(() => {
    if (skip || !element || typeof IntersectionObserver === "undefined") {
      return;
    }
    const thresholds = Array.isArray(threshold) ? threshold : [threshold];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const visible =
            entry.isIntersecting && thresholds.some((t) => entry.intersectionRatio >= t);
          setInView(visible);
          if (visible && triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, root, rootMargin, skip, threshold, triggerOnce]);

  return { ref: setElement, inView };
}

export interface KinoScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both";
  type?: "always" | "scroll" | "hover" | "auto";
  viewportRef?: Ref<HTMLDivElement>;
  viewportClassName?: string;
  viewportProps?: HTMLAttributes<HTMLDivElement>;
  litScrollbars?: boolean;
  children: ReactNode;
}

export const KinoScrollArea = forwardRef<HTMLDivElement, KinoScrollAreaProps>(
  function KinoScrollArea(
    {
      className,
      children,
      orientation = "vertical",
      type = "always",
      viewportRef,
      viewportClassName,
      viewportProps,
      litScrollbars = false,
      ...rest
    },
    ref
  ) {
    const internalViewportRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [thumbY, setThumbY] = useState({ size: 0, offset: 0, visible: false });
    const [thumbX, setThumbX] = useState({ size: 0, offset: 0, visible: false });
    const [interacting, setInteracting] = useState(false);
    const hideTimeoutRef = useRef<number>(0);

    const setCombinedViewportRef = useCallback(
      (node: HTMLDivElement | null) => {
        internalViewportRef.current = node;
        if (typeof viewportRef === "function") {
          viewportRef(node);
        } else if (viewportRef && "current" in viewportRef) {
          Object.assign(viewportRef, { current: node });
        }
      },
      [viewportRef]
    );

    const updateMetrics = useCallback(() => {
      const vp = internalViewportRef.current;
      if (!vp) return;
      if (orientation !== "horizontal") {
        const ratioY = vp.clientHeight / Math.max(vp.scrollHeight, 1);
        const hasY = ratioY > 0 && ratioY < 0.999;
        const trackHeight = Math.max(0, vp.clientHeight - 2);
        const size = hasY ? Math.max(trackHeight * ratioY, 18) : 0;
        const maxScroll = Math.max(1, vp.scrollHeight - vp.clientHeight);
        const offset = hasY ? (vp.scrollTop / maxScroll) * Math.max(0, trackHeight - size) : 0;
        setThumbY({ size, offset, visible: hasY });
      }
      if (orientation !== "vertical") {
        const ratioX = vp.clientWidth / Math.max(vp.scrollWidth, 1);
        const hasX = ratioX > 0 && ratioX < 0.999;
        const trackWidth = Math.max(0, vp.clientWidth - 2);
        const size = hasX ? Math.max(trackWidth * ratioX, 18) : 0;
        const maxScroll = Math.max(1, vp.scrollWidth - vp.clientWidth);
        const offset = hasX ? (vp.scrollLeft / maxScroll) * Math.max(0, trackWidth - size) : 0;
        setThumbX({ size, offset, visible: hasX });
      }
    }, [orientation]);

    useEffect(() => {
      const vp = internalViewportRef.current;
      const content = contentRef.current;
      if (!vp) return;
      const handleScroll = () => {
        updateMetrics();
        if (type === "scroll") {
          setInteracting(true);
          window.clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = window.setTimeout(() => setInteracting(false), 600);
        }
      };
      const ro = new ResizeObserver(() => updateMetrics());
      ro.observe(vp);
      if (content) ro.observe(content);
      vp.addEventListener("scroll", handleScroll, { passive: true });
      const rafId = window.requestAnimationFrame(() => updateMetrics());
      return () => {
        window.cancelAnimationFrame(rafId);
        ro.disconnect();
        vp.removeEventListener("scroll", handleScroll);
        window.clearTimeout(hideTimeoutRef.current);
      };
    }, [type, updateMetrics]);

    const showBar =
      type === "always" || type === "auto" || (type === "scroll" && interacting) || type === "hover";

    return (
      <div
        ref={ref}
        dir="ltr"
        className={cn("relative h-full overflow-hidden", className)}
        onPointerEnter={() => {
          if (type === "hover") setInteracting(true);
        }}
        onPointerLeave={() => {
          if (type === "hover") setInteracting(false);
        }}
        style={{
          position: "relative",
          ["--radix-scroll-area-corner-width" as string]: "0px",
          ["--radix-scroll-area-corner-height" as string]: "0px",
          ...rest.style,
        }}
        {...rest}
      >
        <style
          dangerouslySetInnerHTML={{
            __html:
              "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}",
          }}
        />
        <div
          data-radix-scroll-area-viewport=""
          {...viewportProps}
          ref={setCombinedViewportRef}
          className={cn(
            "h-full w-full rounded-[inherit] [&>div]:!block",
            viewportClassName,
            viewportProps?.className
          )}
          style={{
            overflowX: orientation !== "vertical" ? "scroll" : "hidden",
            overflowY: orientation !== "horizontal" ? "scroll" : "hidden",
            ...viewportProps?.style,
          }}
        >
          <div ref={contentRef} style={{ minWidth: "100%", display: "table" }}>
            {children}
          </div>
        </div>
        {orientation !== "horizontal" && thumbY.visible && showBar && (
          <div
            data-orientation="vertical"
            data-state={
              type === "hover" && !interacting ? "hidden" : thumbY.visible ? "visible" : "hidden"
            }
            className={cn(
              "flex touch-none select-none transition-colors h-full w-2 border-l border-l-transparent p-[1px]",
              litScrollbars && "group/scroll"
            )}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: "var(--radix-scroll-area-corner-height)",
              ["--radix-scroll-area-thumb-height" as string]: `${thumbY.size}px`,
            }}
          >
            <div
              data-state="visible"
              className={cn(
                "relative rounded-sm bg-neutral-800 flex-1",
                litScrollbars && "group-hover/scroll:bg-white group-active/scroll:bg-white"
              )}
              style={{
                width: "var(--radix-scroll-area-thumb-width)",
                height: "var(--radix-scroll-area-thumb-height)",
                transform: `translate3d(0, ${thumbY.offset}px, 0)`,
              }}
            />
          </div>
        )}
        {orientation !== "vertical" && thumbX.visible && showBar && (
          <div
            data-orientation="horizontal"
            data-state={
              type === "hover" && !interacting ? "hidden" : thumbX.visible ? "visible" : "hidden"
            }
            className={cn(
              "flex touch-none select-none transition-colors h-2 w-full border-t border-t-transparent p-[1px]",
              litScrollbars && "group/scroll"
            )}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: "var(--radix-scroll-area-corner-width)",
              ["--radix-scroll-area-thumb-width" as string]: `${thumbX.size}px`,
            }}
          >
            <div
              data-state="visible"
              className={cn(
                "relative rounded-sm bg-neutral-800",
                litScrollbars && "group-hover/scroll:bg-white group-active/scroll:bg-white"
              )}
              style={{
                width: "var(--radix-scroll-area-thumb-width)",
                height: "var(--radix-scroll-area-thumb-height)",
                transform: `translate3d(${thumbX.offset}px, 0, 0)`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

export interface CarouselController {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  atStart: boolean;
  atEnd: boolean;
  step: (direction: 1 | -1) => void;
}

export function useCarousel(): CarouselController {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const animRef = useRef<{ frame: number; to: number } | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      if (animRef.current) {
        cancelAnimationFrame(animRef.current.frame);
        animRef.current = null;
      }
      el.style.scrollSnapType = "";
    };
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const scrollPaddingLeft = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const baseLeft = el.getBoundingClientRect().left - el.scrollLeft + scrollPaddingLeft;
    const positions = Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-item]"), (item) =>
      Math.round(item.getBoundingClientRect().left - baseLeft)
    );
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (animRef.current) {
      cancelAnimationFrame(animRef.current.frame);
    }
    const currentTarget = animRef.current?.to ?? el.scrollLeft;
    const fromScroll = el.scrollLeft;
    const nextTarget =
      direction > 0
        ? (positions.find((pos) => pos > currentTarget + 2) ?? maxScroll)
        : ([...positions].reverse().find((pos) => pos < currentTarget - 2) ?? 0);
    const target = Math.max(0, Math.min(nextTarget, maxScroll));

    const finish = () => {
      animRef.current = null;
      el.style.scrollSnapType = "";
    };

    el.style.scrollSnapType = "none";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = target;
      finish();
      return;
    }

    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / 200);
      el.scrollLeft = fromScroll + (target - fromScroll) * (1 - Math.pow(1 - progress, 3));
      if (progress < 1) {
        animRef.current = { frame: requestAnimationFrame(tick), to: target };
      } else {
        finish();
      }
    };
    animRef.current = { frame: requestAnimationFrame(tick), to: target };
  }, []);

  return { viewportRef, atStart, atEnd, step };
}

export function CarouselPaddles({
  atStart,
  atEnd,
  step,
  className,
}: {
  atStart: boolean;
  atEnd: boolean;
  step: (direction: 1 | -1) => void;
  className?: string;
}) {
  return (
    <div className={cn("pZUk4a_paddles", className)}>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 pZUk4a_paddle"
        onClick={() => step(-1)}
        disabled={atStart}
        aria-label="Previous"
      >
        <ChevronLeft strokeWidth={2.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 pZUk4a_paddle"
        onClick={() => step(1)}
        disabled={atEnd}
        aria-label="Next"
      >
        <ChevronRight strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}

export function canAutoplayVideo(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !nav.connection?.saveData &&
    !["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "")
  );
}

export interface LazyVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  rootMargin?: string;
  inView?: boolean;
  eagerPoster?: boolean;
}

export const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>(function LazyVideo(
  { src, rootMargin = "200px 0px", inView: controlledInView, eagerPoster = false, poster, ...rest },
  forwardedRef
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement, []);

  const scrollRoot = useScrollRoot();
  const { ref: inViewRef, inView: observedInView } = useInView({
    root: scrollRoot,
    rootMargin,
    skip: controlledInView !== undefined,
  });
  const isVisible = controlledInView ?? observedInView;
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setAllowed(canAutoplayVideo());
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  if (isVisible && !hasBeenVisible) {
    setHasBeenVisible(true);
  }

  const shouldLoad = isVisible && allowed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    video.play().catch(() => {});
  }, [shouldLoad, src]);

  const setRefs = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  return (
    <video
      ref={setRefs}
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      poster={eagerPoster || hasBeenVisible ? poster : undefined}
      {...rest}
    />
  );
});

const EXT_RE = /^[A-Za-z0-9]{1,5}$/;

function getFilenameTail(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex > 0 ? name.slice(dotIndex + 1) : "";
  if (!EXT_RE.test(ext)) return "";
  const stemTail = Array.from(name.slice(0, dotIndex))
    .slice(-4)
    .join("");
  return `${stemTail}.${ext}`;
}

export function MiddleTruncate({
  text,
  filename = true,
  className,
  title,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  text: string;
  filename?: boolean;
  title?: string;
}) {
  const tail = filename ? getFilenameTail(text) : "";
  const resolvedTitle = title ?? text;
  if (tail.length === 0 || tail.length >= text.length) {
    return (
      <span {...rest} className={cn("min-w-0 truncate", className)} title={resolvedTitle}>
        {text}
      </span>
    );
  }
  const head = text.slice(0, -tail.length);
  return (
    <span
      {...rest}
      className={cn("flex min-w-0 max-w-full items-baseline", className)}
      title={resolvedTitle}
    >
      <span className="min-w-0 truncate">{head}</span>
      <span className="shrink-0 whitespace-nowrap">{tail}</span>
    </span>
  );
}
