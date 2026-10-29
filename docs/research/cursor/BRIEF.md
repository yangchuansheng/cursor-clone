# Cursor.com (`https://cursor.com/home`) — Complete Reverse-Engineering & Motion Brief

## 1. Source-to-Local Route Map & Ownership
- Source URL: `https://cursor.com/` (serves marketing homepage at `https://cursor.com/home` when authenticated)
- Local Routes:
  - `src/app/page.tsx` (`/`) — Full Cursor homepage clone
  - `src/app/home/page.tsx` (`/home`) — Renders the same homepage clone so both `/` and `/home` match 1:1
  - `src/app/layout.tsx` — Root HTML (`lang="en-US" data-os="mac" data-device="default" data-theme="dark" class="Sj65MG_variable aDRXRq_variable -Zg_XW_variable _8qwdia_variable" style="color-scheme: dark;"`) and Body (`class="bg-theme-bg text-theme-text min-h-screen pt-[var(--site-header-height)]"`)
  - `src/app/globals.css` — Imports the exact extracted Cursor CSS (`docs/research/cursor/cursor-exact.css`) with all original `@font-face` rules (`CursorGothic`, `berkeleyMono`, `cursorMono`, `cursorDisplay`, `CursorIcons16`, `EB Garamond`, `Lato`, `KaTeX_*`), CSS variables (`--color-theme-*`, `--spacing-v*`, `--spacing-g*`), and `@keyframes`.
  - `src/components/sites/cursor/` — Modular React components for Header, Hero (with interactive Desktop IDE + CLI windows), Logo Garden, Feature Sections 1–4, Testimonials, Frontier Section, Changelog, Applied Research Team, Recent Highlights, Final CTA, and Footer.

## 2. Typography & Design Tokens
- Primary Sans (`--font-sans`): `CursorGothic` (`400`, `400 italic`, `700`, `700 italic`)
- Monospace (`--font-berkeley-mono`, `--font-cursor-mono`): `berkeleyMono` (`400`, `400 italic`) & `cursorMono` (`400`, `500`, `700`)
- Display (`--font-cursor-display`): `cursorDisplay` (`400`)
- Serif (`--font-serif`): `EB Garamond`
- Icon font: `CursorIcons16` (`/marketing-static/fonts/cursor-icons-16.woff2`)
- Dark Theme Palette (`[data-theme="dark"]`):
  - `--color-theme-bg`: `#14120b` (`rgb(20, 18, 11)`)
  - `--color-theme-text`: `#edecec` (`rgb(237, 236, 236)`)
  - `--color-theme-text-sec`: `rgba(237, 236, 236, 0.65)`
  - `--color-theme-card-hex`: `#1b1913`
  - `--color-theme-accent`: `#f54e00`
- Light Theme Palette (`[data-theme="light"]`):
  - `--color-theme-bg`: `#f7f7f4`
  - `--color-theme-text`: `#26251e`

## 3. Section-by-Section Structure & Deep Motion / Interactive Specifications

### Header (`#site-header`)
- Fixed top bar (`height: var(--site-header-height)` = `52px`, `bg-theme-bg px-g2 fixed top-0 left-0 z-50 w-full`).
- **Logo Hover & Context Menu**:
  - Static SVG 3D cube + `CURSOR` wordmark.
  - On `mouseEnter`, fades in (`opacity: 1`) and plays `<video>` (`/marketing-static/logo/logo-dark-theme.mp4` in dark mode, `/marketing-static/logo/logo-light-theme.mp4` in light mode); on `mouseLeave`, fades back to `0`.
  - On right-click (`onContextMenu`), opens a floating portal menu (`Copy logo as SVG`, `Copy logo as PNG`, `Download Brand Assets`).
- **Desktop Navigation**:
  - `Models` (`/models`), `Product` (hover dropdown with `Agents`, `Code Review`, `CLI`, `Cloud Agents`, `Composer`, `Marketplace`, `Teams`), `Enterprise` (`/enterprise`), `Pricing` (`/pricing`), `Resources` (hover dropdown with `Changelog`, `Docs`, `Learn`, `Forum`, `Help`, `Workshops`, `Blog`, `Community`, `Status`).
- **Right CTAs**: `Sign in` (`/login`), `Contact sales` (`/contact-sales`), `Download` (`/download`).
- **Mobile Menu**: Hamburger toggle button (`lg:hidden`) that opens the full-screen mobile navigation drawer with expandable sub-menus.

### Section 0 — Hero (`HomeHeroSection`)
- Headline (`h1.type-lg`): `Cursor is your coding agent for building ambitious software.`
- CTAs:
  - Desktop: `Download for macOS ⤓` (`btn btn--primary`) + `Request a demo →` (`btn btn--secondary`)
  - Mobile (`max-md`): `Get started →`
- **Hero Interactive Window Stage** (`minHeight: 720px`, background wallpaper `/sites/cursor/blob/assets/misc/asset-cc24ca462279ca23250c.jpg`):
  - **Draggable / Focusable Window Manager**:
    - Two overlapping windows: `Cursor Desktop` (`width: 1080px, height: 620px, zIndex: 10`) and `Cursor CLI` (`width: 480px, height: 360px, zIndex: 15`, bottom-right).
    - Clicking any window brings it to the front (`zIndex`). Dragging a window's title bar moves it within the stage and reveals a `Reset` button; clicking `Reset` restores original coordinates and resumes auto-cycling.
    - Hovering a window title bar reveals its action pill (`Get Cursor` / `Get CLI`).
  - **`Cursor Desktop` Auto-Cycling & Interactive Scenarios**:
    - Automatically cycles every `4500ms` between `Plan Mission Control` (`productPlanning`) and `Build Landing Page` (`websiteBuilder`) until the user clicks inside.
    - Clicking any of the 5 sidebar items switches the active scenario immediately:
      1. `Plan Mission Control` (in progress / ready, shows `feature-prd.md` + `presence.ts` tabs, interactive multiple-choice question card `How should Mission Control be triggered?` with options 1/2/3, `Skip`/`Continue`, and `Build` button)
      2. `Build Landing Page` (shows live `localhost:3000` Acme Labs browser preview + `app/page.tsx` + `app/globals.css` tabs)
      3. `PyTorch MNIST Experiments` (shows Python ML training code & metrics)
      4. `Set up Cursor Rules for Dashboard` (shows `.cursor/rules/` markdown files)
      5. `Bioinformatics Tools` (shows `bio/sequence_alignment.py` + `bio/fasta.py` + `bio/translate.py` diffs)
    - Inside each scenario, clicking file tabs switches the active editor/preview pane!
  - **`Cursor CLI` Streaming Animation & Slash Commands**:
    - Streams the `biotech` steps (`Read bio/sequence_alignment.py...`, `Searched for 'gotoh algorithm...'`, assistant message, `bio/sequence_alignment.py +GAP_OPEN -10`, `bio/fasta.py -def`, etc.) with pulsing green `⬢`/`⬡` hexagon indicator (240ms) and 80ms character shimmer sweep!
    - Interactive bottom input (`→ Add a follow-up`): typing `/` opens `/model` (model switcher) and `/reset` (replays streaming animation).

### Section 1 — Logo Garden (`#logo-garden`)
- Heading (`h2.type-sm`): `Trusted every day by teams that build world-class software`
- 8 SVG brand cards in an 8-column desktop / 2x4 mobile grid (`stripe`, `DATADOG`, `Linear`, `NVIDIA`, `Figma`, `ramp`, `DECAGON`, `Adobe`).

### Section 2 — 4 Feature Showcase Cards (`HomeFeaturesSection`)
1. **Block 2A — "Agents turn ideas into code"**:
   - Left copy + `Learn about agentic development →`
   - Right stage (`mediaBgHexDark: #4A443B`): `Cursor` window (`productPlanning` scenario) with interactive question selector (`1 Gesture`, `2 Keyboard shortcut`, `3 Both keyboard and button`), `Skip`/`Continue`, file tabs (`feature-prd.md`, `presence.ts`), and `Build` button.
2. **Block 2B — "Works autonomously, runs in parallel"**:
   - Right copy + `Learn about cloud agents →`
   - Left stage (`mediaBgHexDark: #3C3935`): `cursor.com/agent` browser window:
     - Left sidebar with 6 clickable agent runs (`This Week`: `Acme Research Dashboard`, `Live Telemetry Pipeline` with conic-gradient spinner, `Zero-Downtime Deploys`; `This Month`: `Binary Protocol Parser`, `Edge Cache Invalidation`, `Auth Token Rotation`).
     - Interactive Walkthrough Player (`aspect-[16/9]` over `/marketing-static/demos/cursor-wallpaper.png`):
       - Auto-plays on scroll into view and toggles Play/Pause on click!
       - Animates an agent cursor through the 45-step sequence: moves to window right edge, drags to resize narrow (responsive mobile collapse), scrolls down & up, drags back wide, clicks sidebar item 4 to trigger `expose-grid` (2x2 `tilePopIn` animation of `acme`, `chart`, `secure-index`, `self-driving`), clicks tile 1 to open the chart/scatter article view, scrolls, returns to expose grid, and selects tile 0 (`acme`)!
     - Bottom composer with interactive `Agent` mode dropdown (`Agent`, `Grind`, `Plan`, `Debug`, `Ask`) and `Opus 5.5` model dropdown.
3. **Block 2C — "In every tool, at every step"**:
   - Left copy + interactive copyable command box `curl https://cursor.com/install -fsS | bash` (with animated copy-to-clipboard checkmark state).
   - Right stage (wallpaper `/sites/cursor/blob/assets/misc/asset-85923e7fafe00c9c0d1f.jpg`):
     - `Slack` window (`#feature-realtime-sync`, 8 members, `swhitmore`, `eric`, `Cursor APP` with `View PR` / `Open in Cursor` buttons).
     - Overlapping `cursor-agent` terminal window running the 17-phase looping state machine (`idle` -> `typing` `"plan mission control interface"` -> `thinking` -> `toolCall1` -> `planning` -> `toolCall2` -> `questions` navigation & `[x] Real-time metrics` selection -> `analyzing` -> `initializing` `Started 3 agents` -> `subagents` `Health`, `Deployments`, `Incidents` -> `cloudTyping` `"& let's continue in the cloud"` -> `cloudSaving` -> `cloudMigrating` `"Moving to cloud"` -> loop).
4. **Block 2D — "Hand work to AI teammates"**:
   - Right copy + `Download Grok Bot →`
   - Left stage (wallpaper `/sites/cursor/blob/assets/internal-brand/internal-brand-023-3291bb4c.jpg`):
     - `Grok Bot` window (`.baby-grok-bot`):
       - Left sidebar with search input, `+` button, and 6 switchable AI teammates (`Chief`, `Sales Outbound`, `Inbox Manager`, `Account Manager`, `Talent Scout`, `Expense Manager`), each with its custom animated geometric character avatar (`blob`, `wedge`, `gem`) and eye-blink/look animation!
       - Switching any of the 6 bots updates the conversation transcript, mentions (`@Account Manager`, `@Chief`, etc.), routines (`Created routine Overnight outbound`), reactions (`👍`), and composer placeholder (`Message Sales Outbound`, etc.)!
       - Clicking the computer icon in the top-right toggles the agent's virtual computer/routines/settings drawer!

### Section 3 — Testimonials ("The new way to build software.")
- 6 testimonial cards in a 3x2 desktop grid:
  1. Diana Hu (`General Partner, Y Combinator`)
  2. Jensen Huang (`President & CEO, NVIDIA`)
  3. Andrej Karpathy (`CEO, Eureka Labs`)
  4. Patrick Collison (`Co-Founder & CEO, Stripe`)
  5. shadcn (`Creator of shadcn/ui`)
  6. Greg Brockman (`President, OpenAI`)

### Section 4 — "Stay on the frontier"
- 3 frontier cards in a 3-column grid:
  1. **Use the best model for every task** (`Explore models ↗`):
     - Interactive composer with open model dropdown that auto-cycles every `2000ms` through `Auto Suggested`, `Grok 4.7`, `GPT-5.6 Sol`, `Fable 5.1 Max`, `Opus 5.5`, `Gemini 3.1 Pro`, `Composer 2.5` (and allows clicking/hovering any model).
  2. **Build with autonomous agents** (`Learn about cloud agents ↗`):
     - iOS phone frame (`All Repos` / `Recents`) with 6 items (`Fix sign-in redirect on iOS`, `Add rate limits to public routes`, `Cache repository search results`, `Investigate flaky CI shard`, `Retry failed billing webhooks`, `Polish usage chart loading state`), each with the animated 5-dot `.mobile-working-icon` spinner and synced `.shimmer.shimmer-synced` `"Working"` text!
  3. **Develop enduring software** (`Explore enterprise →`):
     - Enterprise photo (`/sites/cursor/blob/assets/homepage/homepage-team-photo-1.jpg`).

### Section 5 — Changelog
- 4 cards (`Oct 20, 2026 / Agent SDK`, `Oct 16, 2026 / Cloud Agent Canvases and Environment Improvements`, `Oct 13, 2026 / Origin App Marketplace`, `Oct 6, 2026 / Remote control for local agents`) + `See what's new in Cursor →`.

### Section 6 — Applied Research Team
- Split card with `Cursor is an applied research team focused on building the future of software development.` + `Join us →` and team photo (`/sites/cursor/blob/assets/homepage/homepage-team-photo.jpg`).

### Section 7 — Recent Highlights
- 4 blog highlight cards (`Mar 27, 2026 · Research / A technical report on Composer 2`, `Aug 14, 2026 · Company / Cursor is now a part of SpaceX`, `Sep 21, 2026 · Research / Introducing Grok 4.7`, `Aug 18, 2026 · Research / Git at any scale`) + `View all blog posts →`.

### Section 8 — Final CTA
- Large `Try Cursor now.` (`h2.type-xl sm:type-2xl`) + `Download for macOS ⤓` button.

### Footer (`#site-footer`)
- 5 navigation columns (`Product`, `Resources`, `Company`, `Legal`, `Connect`).
- Bottom bar:
  - Left: `© 2026 Anysphere, Inc.` + `🛡 SOC 2 | ISO27001 | ISO42001 | AIUC-1 Certified`
  - Right:
    - Interactive Theme Switcher (`System` `🖥`, `Light` `☀`, `Dark` `🌙`) that toggles `document.documentElement.dataset.theme` (`dark` / `light`) and `color-scheme`!
    - Interactive Language Switcher (`🌐 English ⌄`) with dropdown menu (`English`, `简体中文`, `日本語`, `繁體中文`, `한국어`, `Español`, `Français`, `Deutsch`, `Português`, `Русский`, `Türkçe`, `Italiano`).
