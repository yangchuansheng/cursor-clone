"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { AgentSection, StickyStages, StoreSection, SummarySection } from "./agent-and-store";
import { HeroShaderCanvas, shouldUseReducedShader } from "./hero-shader";
import {
  FEATURED_TESTIMONIAL,
  FIRST_QUOTE_TESTIMONIAL,
  HERO_SLIDES,
  KINO_POSTERS,
  LANDING_PROPS,
  REMAINING_QUOTE_TESTIMONIALS,
  WIDE_TESTIMONIALS,
  type KinoWallItem,
  type TestimonialQuote,
} from "./landing-data";
import { DownloadCta, KinoFooter, KinoNav, TalkToTeam } from "./nav-and-cta";
import { ReviewSection, UrlSection } from "./review-and-url";
import { KinoScrollArea, LazyVideo, ScrollRootContext, useInView, useScrollRoot } from "./scroll-area";

function HeroEditorPicture({
  sizes = "(min-width: 1440px) 1240px, 89vw",
}: {
  sizes?: string;
}) {
  return (
    <picture>
      <source
        media="(width < 768px)"
        srcSet={KINO_POSTERS.c5r.srcSet}
        sizes="calc(100vw - 40px)"
        width={2684}
        height={1700}
      />
      <img
        src="/sites/kino/baby-kino/c5r-hero-1400.webp"
        srcSet="/sites/kino/baby-kino/c5r-hero-800.webp 800w, /sites/kino/baby-kino/c5r-hero-1400.webp 1400w, /sites/kino/baby-kino/c5r-hero.webp 2760w"
        sizes={sizes}
        width={1380}
        height={948}
        alt={KINO_POSTERS.c5r.alt}
        className="qIUd4G_window"
        fetchPriority="high"
        draggable={false}
      />
    </picture>
  );
}

function TestimonialByline({
  quote,
  featured = false,
}: {
  quote: TestimonialQuote;
  featured?: boolean;
}) {
  return (
    <figcaption className="GlSt-G_byline" data-featured={featured || undefined}>
      <img
        src={`/sites/kino/landing/testimonials/${quote.avatar}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="GlSt-G_avatar"
      />
      <span>
        <span className="GlSt-G_name">{quote.name}</span>
        <span className="GlSt-G_role">{quote.role}</span>
      </span>
    </figcaption>
  );
}

function TestimonialCard({ quote }: { quote: TestimonialQuote }) {
  return (
    <figure className="GlSt-G_quote">
      <blockquote>{quote.text}</blockquote>
      <TestimonialByline quote={quote} />
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <section aria-labelledby="landing-testimonials" className="GlSt-G_testimonials qIUd4G_summary">
      <h2 id="landing-testimonials" className="GlSt-G_sentence qIUd4G_sentence">
        <span className="GlSt-G_lit qIUd4G_lit">From people</span> who make videos with Kino.
      </h2>
      <div className="GlSt-G_panel budsZG_panel">
        <figure className="GlSt-G_featured">
          <blockquote>“{FEATURED_TESTIMONIAL.text}”</blockquote>
          <TestimonialByline quote={FEATURED_TESTIMONIAL} featured />
        </figure>
        <TestimonialCard quote={FIRST_QUOTE_TESTIMONIAL} />
        {WIDE_TESTIMONIALS.map((quote) => (
          <figure key={quote.name} className="GlSt-G_featured GlSt-G_wide">
            <blockquote>“{quote.text}”</blockquote>
            <TestimonialByline quote={quote} featured />
          </figure>
        ))}
        {REMAINING_QUOTE_TESTIMONIALS.map((quote) => (
          <TestimonialCard key={quote.name} quote={quote} />
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection({ row }: { row: KinoWallItem[] }) {
  const scrollRoot = useScrollRoot();
  const { ref: inViewRef, inView } = useInView({
    root: scrollRoot,
    rootMargin: "2200px 0px",
  });

  return (
    <section aria-labelledby="landing-final" className="mtbnVW_finalCta">
      <div className="mtbnVW_copy">
        <h2 id="landing-final">Make your next video in Kino.</h2>
        <p>Your footage, your edit and your review notes in one place.</p>
        <DownloadCta />
      </div>
      <div
        ref={inViewRef}
        className="mtbnVW_wall"
        style={{
          ["--desktop-tile" as string]: "300px",
          ["--desktop-gap" as string]: "12px",
          ["--slide" as string]: "11%",
        }}
        aria-hidden="true"
      >
        <div className="mtbnVW_row">
          {row.map((item) => (
            <LazyVideo
              key={item.name}
              src={`/sites/kino/landing/wall/${item.name}.mp4`}
              inView={inView}
              poster={`/sites/kino/landing/wall/${item.name}.webp`}
              preload={inView ? "auto" : "none"}
              className="mtbnVW_tile"
            />
          ))}
        </div>
        <div className="mtbnVW_reflection">
          <div className="mtbnVW_row">
            {row.map((item) => (
              <img
                key={item.name}
                src={`/sites/kino/landing/wall/${item.name}.webp`}
                alt=""
                loading="lazy"
                className="mtbnVW_tile"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingContent() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [targetSlide, setTargetSlide] = useState(0);
  const [mountedSlides, setMountedSlides] = useState<number[]>([0]);
  const [playing, setPlaying] = useState(false);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const { ref: stageRef, inView: stageInView } = useInView({ threshold: 0.1 });

  const requestSlide = useCallback((idx: number) => {
    setTargetSlide(idx);
    setMountedSlides((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  }, []);

  useEffect(() => {
    if (targetSlide === activeSlide) return;
    const plate = plateRef.current;
    if (!plate) {
      const id = window.requestAnimationFrame(() => setActiveSlide(targetSlide));
      return () => window.cancelAnimationFrame(id);
    }
    let cancelled = false;
    const imgs = Array.from(
      plate.querySelectorAll<HTMLImageElement>(`[data-slide="${targetSlide}"] img`)
    );
    Promise.all(imgs.map((img) => img.decode())).then(
      () => {
        if (!cancelled) setActiveSlide(targetSlide);
      },
      () => {
        if (!cancelled) setActiveSlide(targetSlide);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [targetSlide, activeSlide, mountedSlides]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setPlaying(!shouldUseReducedShader());
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="qIUd4G_page">
      <section className="qIUd4G_copy">
        <div className="qIUd4G_headline">
          <h1>Where your team and agents make great videos</h1>
          <p className="qIUd4G_subtitle">
            Your footage, your edit and your review notes live in one place.
          </p>
        </div>
        <DownloadCta />
      </section>

      <section
        ref={stageRef}
        className="qIUd4G_stage"
        data-in-view={stageInView || undefined}
      >
        <div ref={plateRef} className="qIUd4G_plate">
          <HeroShaderCanvas className="qIUd4G_light" />
          <div
            className="qIUd4G_slide"
            data-slide={0}
            data-active={activeSlide === 0 || undefined}
            inert={activeSlide !== 0}
          >
            <HeroEditorPicture />
          </div>
          {HERO_SLIDES.map(
            (slide, idx) =>
              "still" in slide &&
              slide.still &&
              mountedSlides.includes(idx) && (
                <div
                  key={slide.label}
                  className="qIUd4G_slide"
                  data-slide={idx}
                  data-active={activeSlide === idx || undefined}
                  inert={activeSlide !== idx}
                >
                  <div
                    className="qIUd4G_still"
                    data-still={slide.still}
                    role="img"
                    aria-label={slide.alt}
                  >
                    <img
                      src={`/sites/kino/landing/${slide.still}-kino.webp`}
                      alt=""
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                    <img
                      src={`/sites/kino/landing/${slide.still}-agent.webp`}
                      alt=""
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
              )
          )}
        </div>
        <div className="qIUd4G_tabs">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.label}
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              aria-current={idx === activeSlide || undefined}
              data-playing={playing || undefined}
              onClick={() => {
                requestSlide(idx);
                setPlaying(false);
              }}
              onAnimationEnd={() => {
                requestSlide((idx + 1) % HERO_SLIDES.length);
              }}
            >
              {slide.label}
            </button>
          ))}
        </div>
      </section>

      <SummarySection />

      <StickyStages>
        <AgentSection templates={LANDING_PROPS.templates} />
        <StoreSection />
        <>
          <ReviewSection />
          <UrlSection />
        </>
      </StickyStages>

      <TestimonialsSection />
      <FinalCtaSection row={LANDING_PROPS.wall} />
      <TalkToTeam />
    </div>
  );
}

export function KinoLanding() {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobile =
      /iPhone|iPad|Android/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua));
    const platform =
      mobile || /CrOS/.test(ua)
        ? "none"
        : /Win/.test(ua)
          ? "windows"
          : /Mac/.test(ua)
            ? "macOS"
            : /X11|Linux/.test(ua)
              ? "linux"
              : "none";
    document.documentElement.dataset.kinoDownloadPlatform = platform;
    return () => {
      delete document.documentElement.dataset.kinoDownloadPlatform;
    };
  }, []);

  return (
    <div className="kino-root dark TO5pWa_variable O5X7nG_variable Lw7I_q_variable antialiased">
      <KinoScrollArea
        className="dark h-screen w-screen overflow-x-hidden bg-landing-bg"
        type="scroll"
        viewportRef={setScrollRoot}
      >
        <ScrollRootContext.Provider value={scrollRoot}>
          <div className="yB52iW_variable qIUd4G_page relative flex min-h-screen flex-col bg-landing-bg">
            <div className="relative mx-auto flex w-full max-w-[1438px] grow flex-col">
              <KinoNav />
              <div className="grow">
                <LandingContent />
              </div>
              <KinoFooter />
            </div>
          </div>
        </ScrollRootContext.Provider>
      </KinoScrollArea>
    </div>
  );
}
