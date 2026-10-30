# Kino.ai Landing Page Clone Brief (`/kino`)

## Source & Destination
- **Source URL:** `https://kino.ai/`
- **Local Route:** `/kino` (`src/app/kino/page.tsx`)
- **Component Directory:** `src/components/sites/kino/`
- **Static Assets:** `public/sites/kino/` (all 229 assets downloaded from `kino.ai` and `files.kino.ai`)
- **Exact Stylesheet:** `docs/research/kino/kino-exact.css` (extracted from the 6 production CSS chunks of `kino.ai`, with font/media paths rewritten to `/sites/kino/...` and root variables scoped via `html:has(.kino-root), .kino-root`)
- **Extracted Server Props:** `docs/research/kino/landing-props.json` (`wall` and `templates` catalog data with localized asset URLs)

## Architecture & Scoping
- Wrap the `/kino` page in `.kino-root` (`<div className="kino-root TO5pWa_variable O5X7nG_variable Lw7I_q_variable antialiased">`) so `html:has(.kino-root)` activates Kino's exact `:root` / `body` styles without affecting `/` or other Cursor routes.
- Use the custom `ScrollArea` viewport (`h-screen w-screen overflow-x-hidden bg-landing-bg`) with a `ScrollRootContext` providing the scroll viewport `HTMLElement` to IntersectionObservers, matching `371_yr1bms2p2.js`.
- Set `document.documentElement.dataset.kinoDownloadPlatform` (`macOS`, `windows`, `linux`, or `none`) on mount.

## Sections & Animations Checklist
1. **Header (`Nav`)**:
   - Kino wordmark (`/sites/kino/logo/kino-primary-logo-white-italic.svg`), `Pricing`, `Docs`, `Changelog`, `Tools` popover (`Filmstrip`, `Transcode`), `Compare` popover (`Kino vs. Claude Code`, `Kino vs. Descript`, `Kino vs. DaVinci Resolve`, `Kino vs. Dropbox`), `Sign in`, `Download Kino`, and mobile menu toggle (`data-open`).
2. **Hero Copy & Download CTA (`DownloadCta`)**:
   - Platform download button (`Download for Mac` / `Windows` / `Ubuntu`) + `Install with your agent` button with overlapping agent icons (`muse.png`, `grok-bot-icon.png`, `claude.svg`) and interactive `Give your agent Kino` popover (`Copy message` button + `Muse`, `Grok Bot`, `Dot`, `Devin` links).
3. **Hero Stage (`qIUd4G_stage`)**:
   - WebGL2 3-pass shader canvas (`qIUd4G_light`, `bright-core` preset from `4145-a33hc35y.js`: Source rotation/overscan pass -> 113-tap anisotropic Zoom Blur pass with negative side-lobe weights -> Post LUT ramp + 30Hz film grain pass, with video/poster fallback).
   - 3-tab auto-advancing switcher (`In Kino` 18s, `Claude Code` 8s, `ChatGPT` 8s; pauses on hover/focus/out-of-view; decodes target slide images before switching).
4. **Summary (`#landing-summary`)**:
   - Inline interactive tokens:
     - `footage` 6x6 sprite hover scrubber (`/sites/kino/landing/summary/c5r-film-sprite.webp`).
     - `edit` animated `SequencesIcon` (3 timeline bars + oscillating playhead on hover, `1200ms` cycle).
     - `agents.` 7-frame `claude-spark-strip.svg` step animation on hover (`280ms`, `steps(7, jump-none)`, `alternate`, `2` iterations).
   - 3 feature columns (`Edit`, `Store`, `Review`) with `Replaces` app icons and hover/tap tooltips, plus mobile carousel paddles.
5. **Sticky Stage Rail (`NNJRJa_stages`)**:
   - Sticky pill (`Edit`, `Store`, `Review`) with CSS `view-timeline` progress bars (`--landing-step-edit`, `--landing-step-storage`, `--landing-step-review`) and JS fallback for smooth scroll navigation.
6. **Agent Carousel (`#landing-agent` / `_0cqJHG_agent`)**:
   - Horizontal carousel with `Previous`/`Next` paddles (`200ms` cubic ease-out):
     - Tile 1 (`motion`): `motion-hey-astra.mp4`.
     - Tile 2 (`vertical`): Synchronized dual videos (`vertical-source.mp4` + `vertical-crop.mp4`) with frame-accurate karaoke captions (`_0cqJHG_words`, `data-spoken`).
     - Tile 3 (`templates`): 8 interactive template cards (`iMessage Thread`, `Hyper Glitch`, `New York`, `Slack Channel`, `Kino Light`, `Map Flyover`, `YouTube Subscribe Nudge`, `Light Spot`) with ambient video playback and mouse hover sprite scrubbing + `79 more / Browse templates →`.
     - Tile 4 (`requests`): 5 agent command rows with icons and category labels.
7. **Store Bento (`#landing-store` / `TvBR7W_store`)**:
   - Light rays + Kino drive + 6 source icons (`mac`, `ext`, `sd`, `dropbox`, `gdrive`, `shade`).
   - Search & Filter cells with responsive `<picture>` elements.
   - macOS Finder window (`docs-finder`) with 8 camera files and middle-ellipsis filename truncation.
   - `OfflineFigure` interactive wipe comparison (`x949Qa_viewer` / `p84c8a_viewer`): 10-language red `Media offline` slate vs streaming `c5r-plate-loading.mp4` with `12s` keyframe drift animation and pointer-capture / keyboard manual scrubbing.
8. **Review Section (`#landing-request` / `q-ka2q_section`)**:
   - Left half: Interactive Browser Review Player (`q-ka2q_browser`) with `c5r-v28.mp4`, Play/Pause, timecode readout, ruler tick canvas, 4 clickable comment pins on the timeline, seek slider, Mute/Unmute, Fullscreen, and interactive comment rail (seek on timestamp click, expand/collapse Luke's reply, mark complete, add new comment).
   - Right half: `timeline-note.webp`.
9. **Everything is a URL (`#landing-url` / `UrlCarousel`)**:
   - 3 auto-advancing tabs (`iMessage` 9s, `Slack` 9s, `Agent` ~22.4s; pauses on hover/focus) with blurred side panels on desktop (`>= 900px`):
     - `iMessage`: Playable `waves-piclock.mp4` unfurl + typing in input triggers `"Anna is typing"` bubble and 1.8s later `"Why are you typing something?"` reply.
     - `Slack`: `#post-prod` channel with hover reactions bar, `Waves Picture Lock` unfurl, `New` divider, and composer.
     - `Agent`: Animated Ghostty `ClaudeCodeTerminal` (`Polish the blood panel reveal`) typing/running 4 tool steps, shimmering orange `Polishing…` spinner, and final reply.
10. **Testimonials (`#landing-testimonials` / `GlSt-G_testimonials`)**:
    - 9 real creator testimonials in a 6-column bento grid.
11. **Final CTA & Video Wall (`#landing-final` / `mtbnVW_finalCta`)**:
    - Headline + `DownloadCta` + 6-tile sliding video wall (`60s ease-in-out infinite alternate`) with blurred inverted reflection row below.
12. **Talk to the Kino team (`bJ-igq_pill`) & Footer (`KwcHGa_footer`)**:
    - Fixed bottom-right button with interactive chat popover/modal + 5-column footer.
