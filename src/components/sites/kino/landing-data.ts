import type { ComponentType, SVGProps } from "react";
import rawLandingProps from "../../../../docs/research/kino/landing-props.json";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export interface KinoSpriteSheet {
  width: number;
  height: number;
  columns: number;
  framesPerSheet: number;
  frames: number[];
  sheets: string[];
}

export interface KinoCoverCrop {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface KinoTemplateRecording {
  poster: string;
  video: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  audible: boolean;
  scrub: KinoSpriteSheet;
  overview?: KinoSpriteSheet;
  coverCrop?: KinoCoverCrop;
  coverScrub?: KinoSpriteSheet;
  coverOverview?: KinoSpriteSheet;
  ambient?: string;
}

export interface KinoTemplateVariantOption {
  value: string;
  label: string;
  keywords: string[];
}

export interface KinoTemplate {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  group: string | null;
  keywords: string[];
  use: string;
  variants: {
    prop: string;
    options: KinoTemplateVariantOption[];
  } | null;
  defaultVariant: string | null;
  formats: string[] | null;
  format: string;
  credit: string | null;
  aspect: number;
  cover: {
    aspect?: number;
    frame?: KinoCoverCrop;
  } | null;
  backdrop: string;
  cards: Record<string, KinoTemplateRecording>;
}

export interface KinoWallItem {
  name: string;
  aspect: string;
}

export interface KinoLandingProps {
  wall: KinoWallItem[];
  templates: {
    tall: KinoTemplate;
    picked: KinoTemplate[];
    more: number;
  };
}

export const LANDING_PROPS: KinoLandingProps = rawLandingProps as unknown as KinoLandingProps;

export const KINO_POSTERS = {
  c5r: {
    src: "/sites/kino/baby-kino/c5r-poster-1400.webp",
    srcSet:
      "/sites/kino/baby-kino/c5r-poster-800.webp 800w, /sites/kino/baby-kino/c5r-poster-1400.webp 1400w, /sites/kino/baby-kino/c5r-poster.webp 2684w",
    alt: "The Kino editor tracking the people, equipment and inventory behind Justin in the C5R launch film",
  },
  c5rBench: {
    src: "/sites/kino/landing/c5r/bench-poster.webp",
    srcSet: "/sites/kino/landing/c5r/bench-poster.webp 1920w",
    alt: "Justin beside the C5R lab bench",
  },
  donald: {
    src: "/sites/kino/baby-kino/poster.webp",
    srcSet:
      "/sites/kino/baby-kino/poster-800.webp 800w, /sites/kino/baby-kino/poster-1400.webp 1400w, /sites/kino/baby-kino/poster.webp 2684w",
    alt: "The Kino editor with the agent panel open",
  },
  splash: {
    src: "/sites/kino/baby-kino/splash-poster.webp",
    srcSet:
      "/sites/kino/baby-kino/splash-poster-800.webp 800w, /sites/kino/baby-kino/splash-poster-1400.webp 1400w, /sites/kino/baby-kino/splash-poster.webp 2620w",
    alt: "The Kino editor playing the “Edit This Video” welcome title",
  },
} as const;

export const NAV_PRIMARY_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs", newTab: true },
  { label: "Changelog", href: "/changelog", newTab: true },
] as const;

export const NAV_COMPARE_LINKS = [
  { label: "Kino vs. Claude Code", href: "/comparison/claude-code" },
  { label: "Kino vs. Descript", href: "/comparison/descript" },
  { label: "Kino vs. DaVinci Resolve", href: "/comparison/davinci-resolve" },
  { label: "Kino vs. Dropbox", href: "/comparison/dropbox" },
] as const;

export const NAV_TOOLS_LINKS = [
  { label: "Filmstrip", href: "/tools/filmstrip" },
  { label: "Transcode", href: "/tools/transcode" },
] as const;

export const FOOTER_COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Download", href: "/download" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog", external: true },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Getting started", href: "/docs", external: true },
      { label: "Agents and MCP", href: "/docs/working-with-agents", external: true },
      { label: "Templates", href: "/templates" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@kino.ai" },
      { label: "Brand", href: "/brand" },
      { label: "Terms and privacy", href: "/privacy" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Filmstrip", href: "/tools/filmstrip" },
      { label: "Transcode", href: "/tools/transcode" },
    ],
  },
  {
    title: "Follow",
    links: [
      {
        label: "Slack community",
        href: "https://join.slack.com/t/kinocommunity/shared_invite/zt-4e2wlusrq-jpCg79yqJONfQ40W9IjfUA",
        external: true,
      },
      { label: "X", href: "https://x.com/trykino", external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/kino-ai", external: true },
      { label: "Instagram", href: "https://www.instagram.com/try.kino/", external: true },
    ],
  },
] as const;

export const HERO_SLIDES = [
  {
    label: "In Kino",
    alt: KINO_POSTERS.c5r.alt,
  },
  {
    label: "Claude Code",
    still: "claude",
    alt: "Claude Code runs in a terminal in front of the Kino desktop app, tracking the people, benches and shelves behind Justin and tagging each as he says the word.",
  },
  {
    label: "ChatGPT",
    still: "chatgpt",
    alt: "The ChatGPT desktop app in front of the Kino desktop app. Codex tracks the people, benches and shelves behind Justin in C5R and reports that each tag lands on its word.",
  },
] as const;

export const INSTALL_AGENTS = [
  {
    name: "Muse",
    href: "/docs/muse",
    src: "/sites/kino/landing/agents/muse.png",
    width: 34,
    height: 23,
    rounded: false,
  },
  {
    name: "Grok Bot",
    href: "/docs/grok-bot",
    src: "/sites/kino/landing/agents/grok-bot-icon.png",
    width: 26,
    height: 26,
    rounded: false,
  },
  {
    name: "Dot",
    href: "/docs/dot",
    src: "/sites/kino/landing/agents/dot.svg",
    width: 24,
    height: 24,
    rounded: false,
  },
  {
    name: "Devin",
    href: "/docs/devin",
    src: "/sites/kino/landing/agents/devin.png",
    width: 26,
    height: 26,
    rounded: true,
  },
] as const;

export const INSTALL_AGENT_PROMPT = `If you're a cloud agent with your own computer, download the Kino desktop app for Linux from https://kino.ai/api/desktop-download/linux?source=agent and install it. Open it and sign in to my Kino account. Ask me how I sign in (Google, or email with a one-time code) and for anything you need along the way.

If you're an agent on my computer, install the app for this machine instead: https://kino.ai/api/desktop-download/mac?source=agent on a Mac, https://kino.ai/api/desktop-download/windows?source=agent on Windows.`;

export const FINDER_ICONS = {
  back: "/sites/kino/_next/static/immutable/media/back.4398j5xfqtqdw.png",
  forward: "/sites/kino/_next/static/immutable/media/forward.36ex2tusbdonp.png",
  search: "/sites/kino/_next/static/immutable/media/search.1_itgzp-1squa.png",
  sortAscending: "/sites/kino/_next/static/immutable/media/sort-ascending.3wmw93q2amg3n.png",
  viewIcons: "/sites/kino/_next/static/immutable/media/view-icons.08j34llwrdp9f.png",
  viewList: "/sites/kino/_next/static/immutable/media/view-list.0vge009ayjfxi.png",
  viewColumns: "/sites/kino/_next/static/immutable/media/view-columns.1j9ap-odnz5x7.png",
  viewGallery: "/sites/kino/_next/static/immutable/media/view-gallery.3zlk0as60sasc.png",
  fileR3d: "/sites/kino/_next/static/immutable/media/file-r3d.2e5n4bcaxhwmn.png",
  fileBraw: "/sites/kino/_next/static/immutable/media/file-braw.1krt_h3zd4frx.png",
  fileMxf: "/sites/kino/_next/static/immutable/media/file-mxf.29s6qyzzm3slg.png",
  fileMovie: "/sites/kino/_next/static/immutable/media/file-movie.2ko_-g7cdyigs.png",
  libraryDesktop: {
    src: "/sites/kino/_next/static/immutable/media/library.0jrjkiiuvf17p.webp",
    width: 2106,
    height: 909,
  },
  libraryPhone: {
    src: "/sites/kino/_next/static/immutable/media/library-phone.2aof0tkqdzwwz.webp",
    width: 1020,
    height: 849,
  },
  searchDesktop: {
    src: "/sites/kino/_next/static/immutable/media/search.34yz-pyyvd01_.webp",
    width: 2106,
    height: 496,
  },
  searchPhone: {
    src: "/sites/kino/_next/static/immutable/media/search-phone.0so-qczwmgl8_.webp",
    width: 1020,
    height: 482,
  },
} as const;

export const FINDER_ROWS = [
  { name: "A001_C003_0411K2_001.R3D", size: "41.2 GB", kind: "RED Video Clip", icon: FINDER_ICONS.fileR3d },
  { name: "A004C012_240311_R1QF.braw", size: "18.6 GB", kind: "Blackmagic RAW Movie", icon: FINDER_ICONS.fileBraw },
  { name: "A004C012.V1.6F2A1.mxf", size: "6.8 GB", kind: "MXF Media File", icon: FINDER_ICONS.fileMxf },
  { name: "A012C007_INTERVIEW.mov", size: "9.4 GB", kind: "QuickTime movie", icon: FINDER_ICONS.fileMovie },
  { name: "ARCHIVE_1998.avi", size: "640 MB", kind: "AVI movie", icon: FINDER_ICONS.fileMovie },
  { name: "C0161.MXF", size: "3.7 GB", kind: "MXF Media File", icon: FINDER_ICONS.fileMxf },
  { name: "LOWER_THIRD_ALPHA.mov", size: "2.1 GB", kind: "QuickTime movie", icon: FINDER_ICONS.fileMovie },
  { name: "TAPE_0042.avi", size: "1.3 GB", kind: "AVI movie", icon: FINDER_ICONS.fileMovie },
] as const;

export const OFFLINE_LANGUAGES = [
  "Media offline",
  "メディアオフライン",
  "Média hors ligne",
  "Offline-Medien",
  "脱机媒体文件",
  "Medios sin conexión",
  "Oggetto multimediale non in linea",
  "미디어 오프라인",
  "Медиаданные в автономном режиме",
  "Mídia offline",
] as const;

export interface TestimonialQuote {
  name: string;
  role: string;
  avatar: string;
  text: string;
}

export const FEATURED_TESTIMONIAL: TestimonialQuote = {
  name: "Cole Dumanski",
  role: "LanceDB",
  avatar: "cole",
  text: "It’s phenomenal, man. This is the most fun I’ve had at video editing. The MCP just feels so natural.",
};

export const WIDE_TESTIMONIALS: readonly TestimonialQuote[] = [
  {
    name: "Khoi Le",
    role: "Founder, Kerry",
    avatar: "khoi",
    text: "Kino is the infrastructure. I put all of my content in and it gets me more B-roll. Opus one-shots stuff, I tweak it in the editor, and I send the share link to my co-founder. He comments “mouth is off” and Kino auto-applies the comments. We’re pumping out short-form ads that are having real ROI for our business.",
  },
  {
    name: "Donald Jewkes",
    role: "Technologist and filmmaker",
    avatar: "donald",
    text: "There were six agent chats going, and the two of us were working on different parts of the timeline. I was like, okay, this is the thing. It all happens underneath you, and you’re the creative director working with swarms of agents.",
  },
];

export const FIRST_QUOTE_TESTIMONIAL: TestimonialQuote = {
  name: "Jayden Clark",
  role: "Host of MOTS, saxophonist",
  avatar: "jayden",
  text: "I’m on an absolute roll with content at the moment. I put out three times more videos now that I’ve switched from Final Cut to Kino.",
};

export const REMAINING_QUOTE_TESTIMONIALS: readonly TestimonialQuote[] = [
  {
    name: "Wilson Spearman",
    role: "Founder, CreativeMode",
    avatar: "wilson",
    text: "Kino is one-shotting demo videos with motion graphics for me. It feels like I have a full team working on every video. Plus I can see everything my company makes and leave notes on it.",
  },
  {
    name: "Shiva",
    role: "Actor, director, creator of KRAZAM",
    avatar: "shiva",
    text: "We just had the most productive editing session we’ve ever had, in large part thanks to Kino. Turned around this insane edit in 24 hours.",
  },
  {
    name: "Michał Szklarski",
    role: "ReadyM",
    avatar: "michal",
    text: "It’s a breakthrough, especially combined with the newest Opus. You can prompt a lot, but you as the editor are always in control and can edit every second, like in Premiere.",
  },
  {
    name: "Tanishq",
    role: "Founder, Cashew Labs",
    avatar: "tanishq",
    text: "I give the agent ambitious things and Kino just knows what to do. It searches YouTube, cuts all the silence, it all just works. I love it.",
  },
  {
    name: "Jakob Leveille",
    role: "Voltra",
    avatar: "jakob",
    text: "I dumped in an 18 minute clip I’d spent an hour cutting, said “cut this,” and it did a first pass in a minute. It made a rough cut that would have taken me 3 hours. I don’t shut up about Kino.",
  },
];
