"use client";
/* eslint-disable @next/next/no-img-element */

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowUp,
  Bookmark,
  Check,
  ChevronDown,
  EllipsisVertical,
  Forward,
  Maximize,
  MessageSquareText,
  Minimize,
  Pause,
  Play,
  SmilePlus,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAutoplayVideo, useInView, useScrollRoot } from "./scroll-area";

const REVIEW_FPS = 24000 / 1001;
const DEFAULT_DURATION_SECONDS = 106.25615;

interface ReviewComment {
  id: string;
  author: string;
  avatar?: string;
  seconds: number;
  text: string;
  age?: string;
  parentId?: string;
  resolved?: boolean;
}

const INITIAL_REVIEW_COMMENTS: ReviewComment[] = [
  {
    id: "title",
    author: "Chris",
    avatar: "/sites/kino/landing/reviews/slack/chris.webp",
    seconds: 2,
    text: "Hold “Is run by AI” a beat longer before the cut.",
    age: "3 hours ago",
  },
  {
    id: "title-reply",
    author: "Luke",
    avatar: "/sites/kino/landing/reviews/slack/luke.webp",
    seconds: 2,
    text: "Added 12 frames. It’s in v4.",
    parentId: "title",
    age: "1 hour ago",
  },
  {
    id: "render",
    author: "Chris",
    avatar: "/sites/kino/landing/reviews/slack/chris.webp",
    seconds: 40,
    text: "Slow the push-in on the facility render. It jumps after the microliter shot.",
    age: "3 hours ago",
  },
  {
    id: "tray",
    author: "Chris",
    avatar: "/sites/kino/landing/reviews/slack/chris.webp",
    seconds: 65,
    text: "The lab calls this the sample tray, not the sample vial. Can we fix the tag?",
    age: "2 hours ago",
  },
  {
    id: "music",
    author: "Chris",
    avatar: "/sites/kino/landing/reviews/slack/chris.webp",
    seconds: 81,
    text: "Bring the music up on “Today, we’re releasing SciUniverse.”",
    age: "2 hours ago",
  },
];

function formatTimecode(seconds: number, mode: "timecode" | "time" | "frames" = "timecode"): string {
  const safe = Math.max(0, seconds);
  const totalFrames = Math.round(safe * REVIEW_FPS);
  if (mode === "frames") {
    return `${totalFrames}`;
  }
  const nominalFps = 24;
  const frames = totalFrames % nominalFps;
  const totalWholeSeconds = Math.floor(totalFrames / nominalFps);
  const s = totalWholeSeconds % 60;
  const m = Math.floor(totalWholeSeconds / 60) % 60;
  const h = Math.floor(totalWholeSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (mode === "time") {
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

function ReviewBrowserPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rulerWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRoot = useScrollRoot();

  const [comments, setComments] = useState<ReviewComment[]>(INITIAL_REVIEW_COMMENTS);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(3.5035);
  const [duration, setDuration] = useState(DEFAULT_DURATION_SECONDS);
  const [skimmerTime, setSkimmerTime] = useState<number | null>(null);
  const [rulerWidth, setRulerWidth] = useState(419);
  const [readoutMode, setReadoutMode] = useState<"timecode" | "time" | "frames">("timecode");
  const [readoutMenuOpen, setReadoutMenuOpen] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(() => new Set());
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    let inView = false;
    const syncPlay = () => {
      if (!inView || document.hidden) {
        video.pause();
      } else if (canAutoplayVideo()) {
        video.play().catch(() => {});
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inView = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.1);
        syncPlay();
      },
      { root: scrollRoot, threshold: [0, 0.1] }
    );
    io.observe(container);
    document.addEventListener("visibilitychange", syncPlay);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", syncPlay);
      video.pause();
    };
  }, [scrollRoot]);

  useEffect(() => {
    const el = rulerWrapRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) setRulerWidth(rect.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || rulerWidth <= 0 || duration <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const height = 22;
    const wPx = Math.round(rulerWidth * dpr);
    const hPx = Math.round(height * dpr);
    if (canvas.width !== wPx) canvas.width = wPx;
    if (canvas.height !== hPx) canvas.height = hPx;
    ctx.resetTransform();
    ctx.clearRect(0, 0, wPx, hPx);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const trackY = Math.round(height / 2) - 2;
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(0, trackY, rulerWidth, 3);

    const playedWidth = Math.max(0, Math.min(rulerWidth, (currentTime / duration) * rulerWidth));
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(0, trackY, playedWidth, 3);

    const lineBottom = height - 2;
    if (skimmerTime !== null) {
      const skimX = Math.max(0, Math.min(rulerWidth, (skimmerTime / duration) * rulerWidth));
      ctx.strokeStyle = "rgba(255, 201, 107, 1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(skimX, 0);
      ctx.lineTo(skimX, lineBottom);
      ctx.stroke();
    }

    const playheadX = Math.max(0, Math.min(rulerWidth, (currentTime / duration) * rulerWidth));
    ctx.strokeStyle = "rgba(220, 38, 38, 1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, lineBottom);
    ctx.stroke();
  }, [currentTime, duration, rulerWidth, skimmerTime]);

  const seekToSeconds = useCallback(
    (targetSec: number) => {
      const clamped = Math.max(0, Math.min(duration, targetSec));
      setCurrentTime(clamped);
      if (videoRef.current) {
        videoRef.current.currentTime = clamped;
      }
    },
    [duration]
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (video) {
      video.muted = next;
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  const commentClusters = useMemo(() => {
    const activeComments = comments
      .filter((c) => !c.resolved || c.id === focusedCommentId)
      .sort((a, b) => a.seconds - b.seconds);
    const groups: ReviewComment[][] = [];
    let lastX = -Infinity;
    for (const c of activeComments) {
      const x = (c.seconds / Math.max(1, duration)) * rulerWidth;
      if (x - lastX < 12 && groups.length > 0) {
        groups[groups.length - 1].push(c);
      } else {
        groups.push([c]);
      }
      lastX = x;
    }
    return groups;
  }, [comments, duration, focusedCommentId, rulerWidth]);

  const rootComments = useMemo(() => comments.filter((c) => !c.parentId), [comments]);
  const replyingTarget = useMemo(
    () => comments.find((c) => c.id === replyingToId) ?? null,
    [comments, replyingToId]
  );

  const toggleReplyExpand = (commentId: string, expand: boolean) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (expand) next.add(commentId);
      else next.delete(commentId);
      return next;
    });
  };

  const toggleResolve = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    const newComment: ReviewComment = {
      id: `comment-${Date.now()}`,
      author: "You",
      text,
      seconds: replyingTarget?.seconds ?? currentTime,
      parentId: replyingToId ?? undefined,
      age: "just now",
    };
    setComments((prev) => [...prev, newComment]);
    if (replyingToId) {
      toggleReplyExpand(replyingToId, true);
    }
    setDraft("");
    setReplyingToId(null);
  };

  const renderCommentItem = (comment: ReviewComment) => {
    const rootId = comment.parentId ?? comment.id;
    const replies = comment.parentId ? [] : comments.filter((c) => c.parentId === comment.id);
    const isExpanded = expandedReplies.has(comment.id);
    const isReplyingHere = replyingToId === rootId;

    return (
      <div
        key={comment.id}
        data-demo-comment={comment.id}
        className={cn(
          "group relative flex w-full flex-col gap-2 px-3 py-2 text-xs hover:bg-neutral-800/60",
          comment.parentId && "pl-9",
          isReplyingHere &&
            "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-kino-500",
          isReplyingHere && !comment.parentId && "bg-kino-500/8 hover:bg-kino-500/12"
        )}
      >
        <div className="flex items-center gap-1">
          <div className="flex min-w-0 items-center gap-1 overflow-hidden">
            <div className="flex min-w-0 items-center gap-1 select-none">
              <span className="relative flex shrink-0 overflow-hidden h-4 w-4 rounded-full bg-neutral-700 text-[9px] font-medium text-white items-center justify-center">
                {comment.avatar ? (
                  <img className="h-full w-full object-cover" src={comment.avatar} alt="" />
                ) : (
                  comment.author[0]
                )}
              </span>
              <div className="truncate text-xs" title={comment.author}>
                {comment.author}
              </div>
            </div>
            {!comment.parentId && (
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                aria-label={`Seek comment at ${comment.seconds} seconds`}
                onClick={() => seekToSeconds(comment.seconds)}
              >
                <span className="rounded p-0.5 px-2 text-xs tabular-nums select-none bg-neutral-400/10 text-neutral-400">
                  {formatTimecode(comment.seconds, readoutMode)}
                </span>
              </button>
            )}
            <div className="flex min-w-0 items-center gap-1 whitespace-nowrap">
              <span className="shrink-0 select-none whitespace-nowrap text-neutral-500">•</span>
              <div className="min-w-0 truncate whitespace-nowrap text-neutral-500">
                {comment.age ?? "just now"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-neutral-400 text-xs leading-5 whitespace-pre-wrap break-words">
            {comment.text}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 select-none items-center gap-2">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-workbench-text-muted transition-none duration-0 hover:bg-workbench-bg-hover hover:text-workbench-text focus-visible:ring-0 h-6 gap-1.5 rounded px-2 text-xs [&_svg]:size-3"
                onClick={() => {
                  setReplyingToId(rootId);
                  toggleReplyExpand(rootId, true);
                  textareaRef.current?.focus();
                }}
              >
                Reply
              </button>
              {replies.length > 0 && (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-workbench-text-muted transition-none duration-0 hover:bg-workbench-bg-hover hover:text-workbench-text focus-visible:ring-0 h-6 gap-1.5 rounded px-2 text-xs [&_svg]:size-3"
                  onClick={() => toggleReplyExpand(comment.id, !isExpanded)}
                >
                  {isExpanded ? "Hide" : "View"} {replies.length}{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </button>
              )}
            </div>
            {!comment.parentId && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  className={cn(
                    "inline-flex cursor-pointer items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 transition-none duration-0 focus-visible:ring-0 h-6 w-6 min-w-6 shrink-0 rounded text-xs [&_svg]:size-3",
                    comment.resolved
                      ? "bg-kino-500/20 text-kino-300"
                      : "bg-transparent text-workbench-text-muted hover:bg-workbench-bg-hover hover:text-workbench-text"
                  )}
                  title={comment.resolved ? "Mark incomplete" : "Mark complete"}
                  aria-label={comment.resolved ? "Mark incomplete" : "Mark complete"}
                  aria-pressed={Boolean(comment.resolved)}
                  onClick={() => toggleResolve(comment.id)}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const totalFrames = Math.round(duration * REVIEW_FPS);
  const currentFrame = Math.round(currentTime * REVIEW_FPS);

  return (
    <div
      className="q-ka2q_browser"
      role="group"
      aria-label="A Kino review link, with notes beside the player"
    >
      <div className="q-ka2q_page">
        <div className="q-ka2q_player">
          <div
            ref={containerRef}
            className="dark @container relative flex h-full w-full flex-col bg-black"
          >
            <div className="relative flex h-full w-full flex-col">
              <div
                className="relative flex min-h-0 flex-1 select-none items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  data-kino-native-video="true"
                  aria-label="Version 3"
                  poster="/sites/kino/landing/review/c5r-v28-poster.webp"
                  className="h-full w-full object-contain"
                  preload="metadata"
                  playsInline
                  muted={muted}
                  src="/sites/kino/landing/review/c5r-v28.mp4"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => {
                    if (
                      Number.isFinite(e.currentTarget.duration) &&
                      e.currentTarget.duration > 0
                    ) {
                      setDuration(e.currentTarget.duration);
                    }
                  }}
                />
              </div>
              <div className="w-full shrink-0 relative">
                <div
                  className="grid items-center border-t w-full grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto] gap-x-2.5 bg-neutral-900 px-2.5 py-1"
                  data-player-bar="desktop"
                  data-visible="true"
                  aria-hidden="false"
                >
                  <div className="contents">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-white/90 transition-none duration-0 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-6 w-6 min-w-6 shrink-0 rounded text-xs [&_svg]:size-3 relative col-start-1 row-start-1"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? (
                        <Pause className="size-3.5 fill-current" aria-hidden="true" />
                      ) : (
                        <Play className="size-3.5 fill-current" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-white/90 transition-none duration-0 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-6 w-6 min-w-6 shrink-0 rounded text-xs [&_svg]:size-3 col-start-5 row-start-1"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted ? (
                        <VolumeX className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Volume2 className="size-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <div className="col-start-2 row-start-1 flex items-center relative">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(formatTimecode(currentTime, readoutMode))
                          .catch(() => {});
                      }}
                      className="inline-flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-white/90 transition-none duration-0 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-6 shrink-0 gap-1 rounded px-1.5 text-xs font-normal tabular-nums [&_svg]:size-3"
                      aria-label="Copy current time"
                      title="Copy current time"
                    >
                      <span className="inline-grid text-right tabular-nums">
                        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
                          {formatTimecode(duration, readoutMode)}
                        </span>
                        <span className="col-start-1 row-start-1">
                          {formatTimecode(currentTime, readoutMode)}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadoutMenuOpen((prev) => !prev)}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-white/90 transition-none duration-0 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-6 w-6 min-w-6 shrink-0 rounded text-xs [&_svg]:size-3"
                      aria-label={`Time shown as ${readoutMode}`}
                      aria-haspopup="menu"
                      aria-expanded={readoutMenuOpen}
                    >
                      <ChevronDown aria-hidden="true" />
                    </button>
                    {readoutMenuOpen && (
                      <div
                        role="menu"
                        className="absolute bottom-full left-0 z-50 mb-1.5 min-w-40 rounded-md border border-neutral-800 bg-neutral-900 p-1 text-xs text-neutral-200 shadow-lg"
                      >
                        {(
                          [
                            ["timecode", "Timecode"],
                            ["time", "Minutes and seconds"],
                            ["frames", "Frames"],
                          ] as const
                        ).map(([val, label]) => (
                          <button
                            key={val}
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left hover:bg-neutral-800"
                            onClick={() => {
                              setReadoutMode(val);
                              setReadoutMenuOpen(false);
                            }}
                          >
                            <span>{label}</span>
                            {readoutMode === val && <Check className="size-3" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-start-3 row-start-1 min-w-0 py-3">
                    <div ref={rulerWrapRef} className="relative h-5">
                      <div className="relative pointer-events-none">
                        <div
                          className="pointer-events-none relative w-full"
                          style={{ height: 22 }}
                        >
                          <canvas
                            ref={canvasRef}
                            aria-hidden="true"
                            className="absolute inset-x-0 top-0 w-full"
                            style={{ height: 22 }}
                          />
                        </div>
                      </div>
                      <div
                        className="group/slider group absolute inset-0 touch-none"
                        role="slider"
                        tabIndex={0}
                        aria-label="Seek"
                        aria-valuemin={0}
                        aria-valuemax={totalFrames}
                        aria-valuenow={currentFrame}
                        onPointerDown={(e) => {
                          if ((e.target as HTMLElement).closest("[data-ruler-interactive]")) {
                            return;
                          }
                          e.currentTarget.setPointerCapture(e.pointerId);
                          const rect = e.currentTarget.getBoundingClientRect();
                          if (rect.width > 0) {
                            seekToSeconds(((e.clientX - rect.left) / rect.width) * duration);
                          }
                        }}
                        onPointerMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          if (rect.width <= 0) return;
                          const ratio = Math.max(
                            0,
                            Math.min(1, (e.clientX - rect.left) / rect.width)
                          );
                          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                            seekToSeconds(ratio * duration);
                          } else {
                            setSkimmerTime(ratio * duration);
                          }
                        }}
                        onPointerLeave={() => setSkimmerTime(null)}
                        onPointerUp={(e) => {
                          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                            e.currentTarget.releasePointerCapture(e.pointerId);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                            e.preventDefault();
                            const stepSec = (e.shiftKey ? 10 : 1) / REVIEW_FPS;
                            seekToSeconds(
                              currentTime + (e.key === "ArrowLeft" ? -stepSec : stepSec)
                            );
                          }
                        }}
                      >
                        <div className="pointer-events-none absolute inset-x-0 -top-[7px] h-4">
                          <div className="pointer-events-none absolute inset-0 z-10">
                            {commentClusters.map((cluster) => {
                              const first = cluster[0];
                              const count = cluster.length;
                              const leftPx =
                                (first.seconds / Math.max(1, duration)) * rulerWidth - 4;
                              return (
                                <button
                                  key={first.id}
                                  type="button"
                                  data-ruler-interactive=""
                                  aria-label={
                                    count === 1
                                      ? `Comment from ${first.author}`
                                      : `${count} comments`
                                  }
                                  className="inline-flex text-sm focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-auto w-auto rounded-none border-0 bg-transparent p-0 shadow-none transition-none duration-0 hover:bg-transparent focus-visible:ring-0 pointer-events-auto absolute top-1/2 -translate-y-1/2 cursor-pointer items-start justify-start gap-0"
                                  style={{ left: `${leftPx}px`, width: "9px" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFocusedCommentId(first.id);
                                    seekToSeconds(first.seconds);
                                    if (count > 1) {
                                      toggleReplyExpand(first.id, true);
                                    }
                                    document
                                      .querySelector(`[data-demo-comment="${first.id}"]`)
                                      ?.scrollIntoView({ block: "nearest" });
                                  }}
                                >
                                  <span className="relative z-10 block">
                                    <svg
                                      width="9"
                                      height="11"
                                      viewBox="0 0 9 11"
                                      className="block shrink-0"
                                      aria-hidden="true"
                                      style={{ width: 9, height: 11, overflow: "visible" }}
                                    >
                                      <path
                                        d="M0 2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5L4.5 11 0 7z"
                                        fill="#4AB7FF"
                                      />
                                      <text
                                        x="4.5"
                                        y="4.9"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize="6.5"
                                        fontWeight="700"
                                        fill="#04233A"
                                      >
                                        {count === 1 ? first.author[0]?.toUpperCase() : count}
                                      </text>
                                    </svg>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex h-2 items-center" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(formatTimecode(duration, readoutMode))
                        .catch(() => {});
                    }}
                    className="inline-flex cursor-pointer items-center focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-0 bg-transparent text-workbench-text-muted transition-none duration-0 hover:bg-transparent hover:text-workbench-text focus-visible:ring-0 h-auto min-w-0 justify-start gap-1.5 rounded-sm p-0 text-left text-xs col-start-4 row-start-1 tabular-nums"
                    aria-label="Copy duration"
                    title="Copy duration"
                  >
                    {formatTimecode(duration, readoutMode)}
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-transparent text-white/90 transition-none duration-0 hover:bg-white/10 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-6 w-6 min-w-6 shrink-0 rounded text-xs [&_svg]:size-3 col-start-6 row-start-1"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Maximize className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="q-ka2q_rail">
          <div className="flex h-full min-h-0 w-full flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              {rootComments.map((comment) => (
                <Fragment key={comment.id}>
                  {renderCommentItem(comment)}
                  {expandedReplies.has(comment.id) &&
                    comments
                      .filter((c) => c.parentId === comment.id)
                      .map((reply) => renderCommentItem(reply))}
                </Fragment>
              ))}
            </div>
            <div className="flex shrink-0 flex-col gap-1.5 bg-neutral-900 px-1.5 py-1">
              {replyingTarget && (
                <div className="flex items-center justify-between text-xs text-inspector-text-muted px-1">
                  <span>Replying to {replyingTarget.author}</span>
                  <button
                    type="button"
                    aria-label="Cancel reply"
                    onClick={() => setReplyingToId(null)}
                    className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              <div className="workbench-control-surface flex flex-col gap-1 px-2 py-1.5">
                <textarea
                  ref={textareaRef}
                  className="flex w-full text-xs focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-0 resize-none rounded-none border-0 bg-transparent p-0 text-workbench-text shadow-none placeholder:text-workbench-text-faint focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={2}
                  aria-label={replyingTarget ? "Write a reply" : "Write a comment"}
                  placeholder={replyingTarget ? "Write a reply…" : "Leave a comment…"}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && draft.trim()) {
                      e.preventDefault();
                      submitComment();
                    }
                  }}
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded p-0.5 px-2 text-xs tabular-nums select-none bg-neutral-400/10 text-neutral-400">
                    {formatTimecode(replyingTarget?.seconds ?? currentTime, readoutMode)}
                  </span>
                  <button
                    type="button"
                    disabled={!draft.trim()}
                    aria-label={replyingTarget ? "Post reply" : "Post comment"}
                    onClick={submitComment}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-0 bg-workbench-bg text-workbench-text shadow-workbench-control transition-none duration-0 hover:bg-workbench-bg-hover focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-workbench-ring h-7 w-7 min-w-7 shrink-0 rounded-full [&_svg]:size-3.5"
                  >
                    <ArrowUp aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewSection() {
  return (
    <section aria-labelledby="landing-request" className="q-ka2q_section">
      <h2 id="landing-request" className="q-ka2q_headline">
        <span className="q-ka2q_lit">Send a link.</span> Notes come back to your timeline.
      </h2>
      <div className="q-ka2q_panel budsZG_panel">
        <div className="q-ka2q_inner">
          <div className="q-ka2q_half">
            <div className="q-ka2q_copy">
              <h3>They watch in a browser.</h3>
              <p>No account needed.</p>
            </div>
            <div className="q-ka2q_stage">
              <div>
                <ReviewBrowserPlayer />
              </div>
            </div>
          </div>
          <div className="q-ka2q_half">
            <div className="q-ka2q_copy">
              <h3>You see it on the timeline.</h3>
              <p>You or your agent fix it.</p>
            </div>
            <div className="q-ka2q_stage">
              <img
                src="/sites/kino/landing/request/timeline-note.webp"
                width={1400}
                height={700}
                alt="The Kino timeline with a reviewer’s note open at 0:16: “Can we punch in on the laptop? Prompt is hard to read on a phone.”, with Reply and Send to agent."
                className="q-ka2q_still"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TailSpike({ color, side = "left" }: { color: string; side?: "left" | "right" }) {
  return (
    <svg className="NGNPCa_tailSpike" data-side={side} viewBox="0 0 12 20" aria-hidden="true">
      <path d="M12 0v13c0 4.5-3.6 7-12 7 4.2-1 6-3.2 6-7V0z" fill={color} />
    </svg>
  );
}

function imessageIcon(name: string, width: number, height: number) {
  return (
    <img
      src={`/sites/kino/landing/reviews/imessage/${name}.webp`}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      draggable={false}
    />
  );
}

function IMessagePanel({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ root: useScrollRoot() });
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [replyState, setReplyState] = useState<"idle" | "typing" | "replied">("idle");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (!active || !inView || document.visibilityState !== "visible") {
        video.pause();
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [active, inView]);

  if (replyState === "idle" && inputValue.length > 0) {
    setReplyState("typing");
  }

  useEffect(() => {
    if (replyState !== "typing") return;
    const timer = window.setTimeout(() => setReplyState("replied"), 1800);
    return () => window.clearTimeout(timer);
  }, [replyState]);

  const setRefs = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  };

  return (
    <div
      className="NGNPCa_card"
      role="group"
      aria-label="An iMessage thread where the Kino review link unfurls into a video preview"
    >
      <div aria-hidden="true" className="NGNPCa_ghost">
        sending to the client now
      </div>
      <div className="NGNPCa_header">
        <div className="NGNPCa_frost" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="NGNPCa_round">{imessageIcon("compose", 17, 17)}</span>
        <span className="NGNPCa_round">{imessageIcon("facetime", 19, 13)}</span>
        <div className="NGNPCa_contact">
          <span className="NGNPCa_contactAvatar">AR</span>
          <span className="NGNPCa_contactName">
            Anna
            {imessageIcon("chevron", 7, 10)}
          </span>
        </div>
      </div>
      <div className="NGNPCa_thread">
        <span className="NGNPCa_stamp">Today 2:31 PM</span>
        <div className="NGNPCa_bubble NGNPCa_theirs">just watched v2, the opener is great</div>
        <div className="NGNPCa_bubble NGNPCa_theirs NGNPCa_tail">
          any notes on the pool scene?
          <TailSpike color="#3a3a3c" />
        </div>
        <div className="NGNPCa_bubble NGNPCa_mine">
          Two. Supers land earlier, and the music sits under the VO now
        </div>
        <div className="NGNPCa_bubble NGNPCa_mine">New cut, arms open at :23</div>
        <div className="NGNPCa_preview NGNPCa_tail" data-playing={playing || undefined}>
          <div className="NGNPCa_previewMedia">
            <video
              ref={setRefs}
              src="/sites/kino/landing/reviews/waves-piclock.mp4"
              poster="/sites/kino/landing/reviews/waves-frame-sm.webp"
              preload="none"
              playsInline
              className="NGNPCa_previewStill"
              onPlay={(e) => {
                if (active && inView && document.visibilityState === "visible") {
                  setPlaying(true);
                  setEnded(false);
                } else {
                  e.currentTarget.pause();
                }
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => {
                setPlaying(false);
                setEnded(true);
              }}
              onEmptied={() => setPlaying(false)}
            />
            {ended && (
              <img
                src="/sites/kino/landing/reviews/waves-frame-sm.webp"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="NGNPCa_previewStill"
              />
            )}
            <div aria-hidden="true" className="NGNPCa_previewScrim" />
            <img
              src="/sites/kino/logo/kino-primary-logo-white-italic.svg"
              alt=""
              width={42}
              height={7}
              className="NGNPCa_previewWordmark"
            />
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 NGNPCa_play"
              data-playing={playing || undefined}
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play Waves_VF_A"}
            >
              {playing ? imessageIcon("pause", 16, 22) : imessageIcon("play", 20, 22)}
            </button>
            <div className="NGNPCa_previewTitle">
              <span className="NGNPCa_previewName">Waves_VF_A</span>
              <span className="NGNPCa_previewSub">Watch the latest delivery · v3</span>
            </div>
          </div>
          <div className="NGNPCa_previewFooter">
            <div className="NGNPCa_previewFooterText">
              <span className="NGNPCa_previewFooterName">Waves_VF_A</span>
              <span className="NGNPCa_previewFooterHost">kino.ai</span>
            </div>
            <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true">
              <path
                d="M1.5 1l5 5-5 5"
                fill="none"
                stroke="#8e8e93"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <TailSpike color="#3c3c41" side="right" />
        </div>
        <span className="NGNPCa_delivered">Delivered</span>
        {replyState === "typing" && (
          <div
            className="NGNPCa_bubble NGNPCa_theirs NGNPCa_tail NGNPCa_typing NGNPCa_incoming"
            role="img"
            aria-label="Anna is typing"
          >
            <span />
            <span />
            <span />
            <TailSpike color="#3a3a3c" />
          </div>
        )}
        {replyState === "replied" && (
          <div
            className="NGNPCa_bubble NGNPCa_theirs NGNPCa_tail NGNPCa_incoming"
            role="status"
          >
            Why are you typing something?
            <TailSpike color="#3a3a3c" />
          </div>
        )}
      </div>
      <div className="NGNPCa_composer">
        <span className="NGNPCa_round">{imessageIcon("plus", 14, 13)}</span>
        <label className="NGNPCa_field">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="iMessage"
            aria-label="iMessage"
            autoComplete="off"
            className="flex w-full text-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-0 bg-transparent px-0 py-0.5 text-workbench-text shadow-none placeholder:text-workbench-text-faint focus-visible:ring-0 NGNPCa_input h-auto rounded-none transition-none"
          />
          {imessageIcon("audio", 14, 14)}
        </label>
        <span className="NGNPCa_round">{imessageIcon("emoji", 18, 18)}</span>
      </div>
    </div>
  );
}

const SLACK_FORMAT_PATHS: ReadonlyArray<string | null> = [
  "M4 2.75A.75.75 0 0 1 4.75 2h6.343a3.91 3.91 0 0 1 3.88 3.449A2 2 0 0 1 15 5.84l.001.067a3.9 3.9 0 0 1-1.551 3.118A4.627 4.627 0 0 1 11.875 18H4.75a.75.75 0 0 1-.75-.75V9.5a.8.8 0 0 1 .032-.218A.8.8 0 0 1 4 9.065zm2.5 5.565h3.593a2.157 2.157 0 1 0 0-4.315H6.5zm4.25 1.935H6.5v5.5h4.25a2.75 2.75 0 1 0 0-5.5",
  "M7 2.75A.75.75 0 0 1 7.75 2h7.5a.75.75 0 0 1 0 1.5H12.3l-2.6 13h2.55a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5H7.7l2.6-13H7.75A.75.75 0 0 1 7 2.75",
  "M17.25 17.12a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5zM14.5 1.63a.75.75 0 0 1 .75.75v8a5.25 5.25 0 1 1-10.5 0v-8a.75.75 0 0 1 1.5 0v8a3.75 3.75 0 0 0 7.5 0v-8a.75.75 0 0 1 .75-.75",
  "M11.721 3.84c-.91-.334-2.028-.36-3.035-.114-1.51.407-2.379 1.861-2.164 3.15C6.718 8.051 7.939 9.5 11.5 9.5l.027.001h5.723a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5h3.66c-.76-.649-1.216-1.468-1.368-2.377-.347-2.084 1.033-4.253 3.265-4.848l.007-.002.007-.002c1.252-.307 2.68-.292 3.915.16 1.252.457 2.337 1.381 2.738 2.874a.75.75 0 0 1-1.448.39c-.25-.925-.91-1.528-1.805-1.856m2.968 9.114a.75.75 0 1 0-1.378.59c.273.64.186 1.205-.13 1.674-.333.492-.958.925-1.82 1.137-.989.243-1.991.165-3.029-.124-.93-.26-1.613-.935-1.858-1.845a.75.75 0 0 0-1.448.39c.388 1.441 1.483 2.503 2.903 2.9 1.213.338 2.486.456 3.79.135 1.14-.28 2.12-.889 2.704-1.753.6-.888.743-1.992.266-3.104",
  null,
  "M12.306 3.756a2.75 2.75 0 0 1 3.889 0l.05.05a2.75 2.75 0 0 1 0 3.889l-3.18 3.18a2.75 2.75 0 0 1-3.98-.095l-.03-.034a.75.75 0 0 0-1.11 1.009l.03.034a4.25 4.25 0 0 0 6.15.146l3.18-3.18a4.25 4.25 0 0 0 0-6.01l-.05-.05a4.25 4.25 0 0 0-6.01 0L9.47 4.47a.75.75 0 1 0 1.06 1.06zm-4.611 12.49a2.75 2.75 0 0 1-3.89 0l-.05-.051a2.75 2.75 0 0 1 0-3.89l3.18-3.179a2.75 2.75 0 0 1 3.98.095l.03.034a.75.75 0 1 0 1.11-1.01l-.03-.033a4.25 4.25 0 0 0-6.15-.146l-3.18 3.18a4.25 4.25 0 0 0 0 6.01l.05.05a4.25 4.25 0 0 0 6.01 0l1.775-1.775a.75.75 0 0 0-1.06-1.06z",
  "M3.792 2.094A.5.5 0 0 1 4 2.5V6h1a.5.5 0 1 1 0 1H2a.5.5 0 1 1 0-1h1V3.194l-.842.28a.5.5 0 0 1-.316-.948l1.5-.5a.5.5 0 0 1 .45.068M7.75 3.5a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5zM7 10.75a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75m0 6.5a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75m-4.293-3.36a1 1 0 0 1 .793-.39c.49 0 .75.38.75.75 0 .064-.033.194-.173.409a5 5 0 0 1-.594.711c-.256.267-.552.548-.87.848l-.088.084a42 42 0 0 0-.879.845A.5.5 0 0 0 2 18h3a.5.5 0 0 0 0-1H3.242l.058-.055c.316-.298.629-.595.904-.882a6 6 0 0 0 .711-.859c.18-.277.335-.604.335-.954 0-.787-.582-1.75-1.75-1.75a2 2 0 0 0-1.81 1.147.5.5 0 1 0 .905.427 1 1 0 0 1 .112-.184",
  "M4 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10A.75.75 0 0 1 7 3m.75 6.25a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5zm0 7a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5zM3 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  null,
  "M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0zM6.75 3a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM6 10.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75m.75 5.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5z",
  "M12.058 3.212c.396.12.62.54.5.936L8.87 16.29a.75.75 0 1 1-1.435-.436l3.686-12.143a.75.75 0 0 1 .936-.5M5.472 6.24a.75.75 0 0 1 .005 1.06l-2.67 2.693 2.67 2.691a.75.75 0 1 1-1.065 1.057l-3.194-3.22a.75.75 0 0 1 0-1.056l3.194-3.22a.75.75 0 0 1 1.06-.005m9.044 1.06a.75.75 0 1 1 1.065-1.056l3.194 3.221a.75.75 0 0 1 0 1.057l-3.194 3.219a.75.75 0 0 1-1.065-1.057l2.67-2.69z",
  "M9.212 2.737a.75.75 0 1 0-1.424-.474l-2.5 7.5a.75.75 0 0 0 1.424.474zm6.038.265a.75.75 0 0 0 0 1.5h2a.25.25 0 0 1 .25.25v11.5a.25.25 0 0 1-.25.25h-13a.25.25 0 0 1-.25-.25v-3.5a.75.75 0 0 0-1.5 0v3.5c0 .966.784 1.75 1.75 1.75h13a1.75 1.75 0 0 0 1.75-1.75v-11.5a1.75 1.75 0 0 0-1.75-1.75zm-3.69.5a.75.75 0 1 0-1.12.996l1.556 1.754-1.556 1.75a.75.75 0 1 0 1.12.997l2-2.249a.75.75 0 0 0 0-.996zM3.999 9.061a.75.75 0 0 1-1.058-.062l-2-2.249a.75.75 0 0 1 0-.996l2-2.252a.75.75 0 1 1 1.12.996L2.504 6.252l1.557 1.75a.75.75 0 0 1-.062 1.059",
];

function slackSvg(d: string, size = 18) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
      <path fillRule="evenodd" d={d} fill="currentColor" />
    </svg>
  );
}

function SlackHoverActions() {
  return (
    <div className="j_DS3W_actions" aria-hidden="true">
      {["❤️", "👍", "🙏"].map((emoji) => (
        <span key={emoji} className="j_DS3W_actionButton j_DS3W_actionEmoji">
          {emoji}
        </span>
      ))}
      {[SmilePlus, MessageSquareText, Forward, Bookmark, EllipsisVertical].map((Icon, idx) => (
        <span key={idx} className="j_DS3W_actionButton">
          <Icon size={18} strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

function SlackMessage({
  who,
  name,
  time,
  children,
}: {
  who: "chris" | "luke";
  name: string;
  time: string;
  children: React.ReactNode;
}) {
  const external = who === "chris";
  return (
    <div className="j_DS3W_message">
      <SlackHoverActions />
      <span className="j_DS3W_avatarWrap">
        <img
          src={`/sites/kino/landing/reviews/slack/${who}.webp`}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          className="j_DS3W_avatar"
        />
        {external && (
          <span className="j_DS3W_status" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path
                d="M3 5l3.6 14h2.9L12 9.6 14.5 19h2.9L21 5h-2.8l-2.4 10.2L13.3 5h-2.6L8.2 15.2 5.8 5z"
                fill="#fff"
              />
            </svg>
          </span>
        )}
      </span>
      <div className="j_DS3W_content">
        <div className="j_DS3W_meta">
          <span className="j_DS3W_name">{name}</span>
          <span className="j_DS3W_time">{time}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function SlackLinkChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="j_DS3W_link">
      <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
        <path
          fillRule="evenodd"
          fill="#1D9BD1"
          d="M12.306 3.756a2.75 2.75 0 0 1 3.889 0l.05.05a2.75 2.75 0 0 1 0 3.889l-3.18 3.18a2.75 2.75 0 0 1-3.98-.095l-.03-.034a.75.75 0 0 0-1.11 1.009l.03.034a4.25 4.25 0 0 0 6.15.146l3.18-3.18a4.25 4.25 0 0 0 0-6.01l-.05-.05a4.25 4.25 0 0 0-6.01 0L9.47 4.47a.75.75 0 1 0 1.06 1.06zm-4.611 12.49a2.75 2.75 0 0 1-3.89 0l-.05-.051a2.75 2.75 0 0 1 0-3.89l3.18-3.179a2.75 2.75 0 0 1 3.98.095l.03.034a.75.75 0 1 0 1.11-1.01l-.03-.033a4.25 4.25 0 0 0-6.15-.146l-3.18 3.18a4.25 4.25 0 0 0 0 6.01l.05.05a4.25 4.25 0 0 0 6.01 0l1.775-1.775a.75.75 0 0 0-1.06-1.06z"
        />
      </svg>
      {children}
    </span>
  );
}

function SlackPanel() {
  return (
    <div
      className="j_DS3W_shell"
      role="img"
      aria-label="A Slack channel where a Kino delivery link unfurls into a package card"
    >
      <div className="EMHaVG_variable j_DS3W_card">
        <div className="j_DS3W_header">
          <span className="j_DS3W_iconButton">
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path
                fillRule="evenodd"
                fill="#D1D2D3"
                d="M9.044 4.29c-.393.923-.676 2.105-.812 3.065a.75.75 0 0 1-.825.64l-.25-.027c-1.066-.12-2.106-.236-2.942-.202-.45.018-.773.079-.98.167-.188.08-.216.15-.227.187-.013.042-.027.148.112.37.143.229.4.497.77.788.734.579 1.755 1.128 2.66 1.54a.75.75 0 0 1 .35 1.036c-.466.87-1.022 2.125-1.32 3.239-.15.56-.223 1.04-.208 1.396.015.372.113.454.124.461l.003.001a.2.2 0 0 0 .042.006.9.9 0 0 0 .297-.06c.297-.1.678-.319 1.116-.64.87-.635 1.8-1.55 2.493-2.275a.75.75 0 0 1 1.085 0c.692.724 1.626 1.639 2.5 2.275.44.32.822.539 1.12.64a.9.9 0 0 0 .3.06q.038-.003.044-.006h.002c.011-.009.109-.09.123-.46.013-.357-.06-.836-.212-1.397-.303-1.114-.864-2.368-1.33-3.24a.75.75 0 0 1 .35-1.037c.903-.41 1.92-.96 2.652-1.54.369-.292.625-.56.768-.787.139-.223.124-.329.112-.37-.012-.038-.039-.107-.226-.186-.206-.088-.527-.149-.976-.167-.835-.034-1.874.082-2.941.201l-.246.027a.75.75 0 0 1-.825-.64c-.136-.96-.42-2.142-.813-3.064-.198-.464-.405-.82-.605-1.048-.204-.232-.319-.243-.34-.243s-.135.01-.34.243c-.2.228-.407.584-.605 1.048m-.522-2.036c.343-.39.833-.754 1.467-.754s1.125.363 1.467.754c.348.396.63.914.858 1.449.359.84.627 1.83.798 2.723.913-.1 1.884-.192 2.708-.158.521.021 1.052.094 1.503.285.47.2.902.556 1.076 1.14.177.597-.004 1.153-.279 1.592-.271.434-.676.826-1.108 1.168-.662.524-1.482 1.003-2.256 1.392.41.85.836 1.884 1.1 2.856.17.625.286 1.271.264 1.846-.021.56-.182 1.218-.749 1.623-.555.398-1.205.316-1.7.148-.51-.173-1.034-.493-1.523-.849-.754-.55-1.523-1.261-2.158-1.896-.634.634-1.4 1.346-2.15 1.895-.487.356-1.01.677-1.518.85-.495.168-1.144.25-1.699-.148-.565-.405-.727-1.062-.75-1.62-.024-.574.09-1.22.257-1.846.261-.972.684-2.007 1.093-2.858-.775-.389-1.597-.867-2.262-1.39-.433-.342-.84-.734-1.111-1.168-.276-.44-.457-.997-.28-1.595.174-.585.608-.941 1.079-1.141.45-.191.983-.264 1.505-.285.826-.033 1.799.059 2.713.159.17-.893.439-1.882.797-2.723.228-.535.51-1.053.858-1.449"
              />
            </svg>
          </span>
          <span className="j_DS3W_channel">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path
                fillRule="evenodd"
                fill="#D1D2D3"
                d="M9.984 3.176a1 1 0 0 0-1.968-.352L7.448 6H4a1 1 0 0 0 0 2h3.091l-.803 4.5H3a1 1 0 1 0 0 2h2.93l-.414 2.324a1 1 0 0 0 1.968.352l.478-2.676h2.719l-.415 2.324a1 1 0 1 0 1.968.352l.478-2.676H16a1 1 0 1 0 0-2h-2.93l.803-4.5H17a1 1 0 1 0 0-2h-2.77l.504-2.824a1 1 0 1 0-1.968-.352L12.198 6H9.48zm1.054 9.324L11.84 8H9.123l-.804 4.5z"
              />
            </svg>
            post-prod
          </span>
          <div className="j_DS3W_tools">
            <span className="j_DS3W_members">
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#B9BABD"
                  d="M7 6.673c0-1.041.352-1.824.874-2.345C8.398 3.805 9.139 3.5 10 3.5c.86 0 1.602.305 2.126.828.522.521.874 1.304.874 2.345a3.9 3.9 0 0 1-1.05 2.646c-.629.678-1.38 1.014-1.95 1.014S8.679 9.997 8.05 9.32A3.9 3.9 0 0 1 7 6.673M10 2c-1.222 0-2.356.438-3.186 1.267C5.98 4.1 5.5 5.277 5.5 6.673a5.4 5.4 0 0 0 1.951 4.14 10 10 0 0 0-1.873.658c-1.464.693-2.811 1.828-3.448 3.557-.3.811-.067 1.59.423 2.132.475.526 1.193.84 1.947.84h11c.754 0 1.472-.314 1.947-.84.49-.542.722-1.32.424-2.132-.638-1.729-1.985-2.864-3.45-3.557a10 10 0 0 0-1.872-.657q.265-.221.5-.475A5.4 5.4 0 0 0 14.5 6.673c0-1.396-.481-2.574-1.314-3.406C12.356 2.438 11.223 2 10 2M3.537 15.547c.463-1.256 1.459-2.14 2.683-2.72C7.449 12.246 8.853 12 10 12s2.552.246 3.78.827c1.224.58 2.22 1.464 2.683 2.72.083.225.034.427-.129.607a1.14 1.14 0 0 1-.834.346h-11c-.35 0-.657-.15-.834-.346-.163-.18-.212-.382-.129-.607"
                />
              </svg>
              3
            </span>
            <span className="j_DS3W_huddle">
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#B9BABD"
                  d="M5.094 4.571C3.785 5.825 3 7.444 3 8.966v1.371A3.45 3.45 0 0 1 5.25 9.5h.5c1.064 0 1.75.957 1.75 1.904v5.192c0 .947-.686 1.904-1.75 1.904h-.5c-2.168 0-3.75-1.99-3.75-4.211v-.578q0-.105.005-.211H1.5V8.966c0-2.02 1.024-4.01 2.556-5.478C5.595 2.014 7.711 1 10 1s4.405 1.014 5.944 2.488C17.476 4.956 18.5 6.945 18.5 8.966V13.5h-.005q.005.105.005.211v.578c0 2.221-1.582 4.211-3.75 4.211h-.5c-1.064 0-1.75-.957-1.75-1.904v-5.192c0-.947.686-1.904 1.75-1.904h.5c.864 0 1.635.316 2.25.837V8.966c0-1.522-.785-3.141-2.094-4.395C13.602 3.322 11.844 2.5 10 2.5s-3.602.822-4.906 2.071m9.016 6.508a.5.5 0 0 0-.11.325v5.192c0 .145.05.257.11.325.057.066.109.079.14.079h.5c1.146 0 2.25-1.11 2.25-2.711v-.578C17 12.11 15.896 11 14.75 11h-.5c-.031 0-.083.013-.14.08M3 13.711C3 12.11 4.105 11 5.25 11h.5c.031 0 .083.013.14.08.06.067.11.18.11.324v5.192a.5.5 0 0 1-.11.325c-.057.066-.109.079-.14.079h-.5C4.105 17 3 15.89 3 14.289z"
                />
              </svg>
              <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#D1D2D3"
                  d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                />
              </svg>
            </span>
            <span className="j_DS3W_iconButton">
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                <path
                  fill="#B9BABD"
                  d="M10 1.5c.688 0 1.31.246 1.766.762.332.374.54.85.65 1.384 1.21.368 2.105 1.136 2.687 2.356.604 1.266.855 2.988.89 5.182l1.87 1.878.012.011.01.013c.636.7.807 1.59.374 2.342-.407.704-1.224 1.072-2.105 1.072H12.77c-.128.39-.335.775-.637 1.105-.493.537-1.208.895-2.12.895-.917 0-1.638-.356-2.136-.893A3 3 0 0 1 7.23 16.5H3.843c-.88 0-1.698-.368-2.104-1.072-.433-.752-.264-1.643.372-2.342l.012-.013.013-.013 1.87-1.876c.035-2.194.288-3.916.891-5.182.582-1.22 1.476-1.988 2.685-2.356.111-.534.32-1.01.651-1.384C8.69 1.746 9.311 1.5 10 1.5M10 3c-.311 0-.505.1-.644.256-.156.177-.308.504-.36 1.062l-.05.558-.549.11c-1.024.204-1.691.71-2.145 1.661-.485 1.017-.736 2.567-.752 4.858l-.002.307-.217.217-2.068 2.075c-.147.164-.195.295-.208.377a.3.3 0 0 0 .034.198c.069.12.304.32.804.321h4.665l.069.672c.034.327.17.668.4.916.215.231.537.412 1.037.412.486 0 .801-.178 1.013-.41.227-.247.362-.588.396-.916l.069-.674h4.662c.5 0 .736-.202.805-.321a.3.3 0 0 0 .034-.199c-.013-.082-.063-.215-.214-.381l-2.06-2.07-.217-.217-.002-.307c-.015-2.29-.266-3.841-.751-4.858-.455-.951-1.123-1.457-2.147-1.662l-.549-.109-.05-.558c-.051-.558-.203-.885-.36-1.062C10.505 3.099 10.311 3 10 3"
                />
                <path
                  d="M16.165 4.203a8.03 8.03 0 0 1 1.754 4.094m-15.838 0a8.03 8.03 0 0 1 1.754-4.094"
                  fill="none"
                  stroke="#B9BABD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="j_DS3W_iconButton">
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#B9BABD"
                  d="M9 3a6 6 0 1 0 0 12A6 6 0 0 0 9 3M1.5 9a7.5 7.5 0 1 1 13.307 4.746l3.473 3.474a.75.75 0 1 1-1.06 1.06l-3.473-3.473A7.5 7.5 0 0 1 1.5 9"
                />
              </svg>
            </span>
            <span className="j_DS3W_iconButton">
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#B9BABD"
                  d="M10 5.5A1.75 1.75 0 1 1 10 2a1.75 1.75 0 0 1 0 3.5m0 6.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m-1.75 4.5a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="j_DS3W_body">
          <SlackMessage who="chris" name="Chris" time="Yesterday at 6:02 PM">
            <div>Sending the pool scene notes over tonight, client wants the supers to land earlier</div>
          </SlackMessage>
          <div className="j_DS3W_day">
            <span className="j_DS3W_dayPill">
              Today
              <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  fill="#D1D2D3"
                  d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
                />
              </svg>
            </span>
          </div>
          <SlackMessage who="luke" name="Luke" time="11:27 AM">
            <div className="j_DS3W_text">
              Here’s the final launch video + all assets used{" "}
              <SlackLinkChip>kino.ai/d/…</SlackLinkChip>
            </div>
            <div className="j_DS3W_unfurl">
              <div className="j_DS3W_unfurlText">
                <div className="j_DS3W_unfurlTitle">Waves Picture Lock</div>
                <div>Delivery package · final render + 14 assets · 4.2 GB</div>
                <div className="j_DS3W_unfurlSource">
                  <img
                    src="/sites/kino/logo/kino-app-icon.png"
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                  />
                  Kino
                </div>
              </div>
              <img
                src="/sites/kino/landing/reviews/waves-frame-sm.webp"
                alt=""
                width={104}
                height={104}
                loading="lazy"
                className="j_DS3W_unfurlImage"
              />
            </div>
          </SlackMessage>
          <SlackMessage who="chris" name="Chris" time="11:29 AM">
            <div>Nice checking it out</div>
          </SlackMessage>
          <div className="j_DS3W_unread">New</div>
          <SlackMessage who="luke" name="Luke" time="11:31 AM">
            <div className="j_DS3W_text">
              Actually can you hop into the <SlackLinkChip>kino.ai/p/waves-vf</SlackLinkChip>
            </div>
          </SlackMessage>
          <div className="j_DS3W_message j_DS3W_continuation">
            <SlackHoverActions />
            <span className="j_DS3W_gutterTime">11:31</span>
            <div className="j_DS3W_content">and update the opening with the most recent brand</div>
          </div>
        </div>
        <div className="j_DS3W_composer">
          <div className="j_DS3W_composerFormatting">
            {SLACK_FORMAT_PATHS.map((path, idx) =>
              path ? (
                <span key={idx} className="j_DS3W_composerButton">
                  {slackSvg(path)}
                </span>
              ) : (
                <span key={idx} className="j_DS3W_composerDivider" aria-hidden="true" />
              )
            )}
          </div>
          <div className="j_DS3W_composerInput">Jot something down</div>
          <div className="j_DS3W_composerTools">
            <span className="j_DS3W_composerButton j_DS3W_composerPlus">
              {slackSvg(
                "M10.75 3.25a.75.75 0 0 0-1.5 0v6H3.251L3.25 10v-.75a.75.75 0 0 0 0 1.5V10v.75h6v6a.75.75 0 0 0 1.5 0v-6h6a.75.75 0 0 0 0-1.5h-6z"
              )}
            </span>
            <span className="j_DS3W_composerButton j_DS3W_composerAa">
              {slackSvg(
                "M6.941 3.952c-.459-1.378-2.414-1.363-2.853.022l-4.053 12.8a.75.75 0 0 0 1.43.452l1.101-3.476h6.06l1.163 3.487a.75.75 0 1 0 1.423-.474zm1.185 8.298L5.518 4.427 3.041 12.25zm6.198-5.537a4.74 4.74 0 0 1 3.037-.081A3.74 3.74 0 0 1 20 10.208V17a.75.75 0 0 1-1.5 0v-.745a8 8 0 0 1-2.847 1.355 3 3 0 0 1-3.15-1.143C10.848 14.192 12.473 11 15.287 11H18.5v-.792c0-.984-.641-1.853-1.581-2.143a3.24 3.24 0 0 0-2.077.056l-.242.089a2.22 2.22 0 0 0-1.34 1.382l-.048.145a.75.75 0 0 1-1.423-.474l.048-.145a3.72 3.72 0 0 1 2.244-2.315zM18.5 12.5h-3.213c-1.587 0-2.504 1.801-1.57 3.085.357.491.98.717 1.572.57a6.5 6.5 0 0 0 2.47-1.223l.741-.593z"
              )}
            </span>
            <span className="j_DS3W_composerButton">
              {slackSvg(
                "M2.5 10a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18M7.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M14 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-6.385 3.766a.75.75 0 1 0-1.425.468C6.796 14.08 8.428 15 10.027 15s3.23-.92 3.838-2.766a.75.75 0 1 0-1.425-.468c-.38 1.155-1.38 1.734-2.413 1.734s-2.032-.58-2.412-1.734"
              )}
            </span>
            <span className="j_DS3W_composerButton">
              {slackSvg(
                "M2.5 10a7.5 7.5 0 1 1 15 0v.645c0 1.024-.83 1.855-1.855 1.855a1.145 1.145 0 0 1-1.145-1.145V6.75a.75.75 0 0 0-1.494-.098 4.5 4.5 0 1 0 .465 6.212A2.64 2.64 0 0 0 15.646 14 3.355 3.355 0 0 0 19 10.645V10a9 9 0 1 0-3.815 7.357.75.75 0 1 0-.865-1.225A7.5 7.5 0 0 1 2.5 10m7.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
              )}
            </span>
            <span className="j_DS3W_composerDivider" aria-hidden="true" />
            <span className="j_DS3W_composerButton">
              {slackSvg(
                "M3.75 4.5a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-2.59a.75.75 0 0 1 1.124-.65l3.376 1.943V6.547l-3.376 1.944A.75.75 0 0 1 13 7.84V5.25a.75.75 0 0 0-.75-.75zm-2.25.75A2.25 2.25 0 0 1 3.75 3h8.5a2.25 2.25 0 0 1 2.25 2.25v1.294l2.626-1.512A1.25 1.25 0 0 1 19 6.115v7.77a1.25 1.25 0 0 1-1.874 1.083L14.5 13.456v1.294A2.25 2.25 0 0 1 12.25 17h-8.5a2.25 2.25 0 0 1-2.25-2.25z"
              )}
            </span>
            <span className="j_DS3W_composerButton">
              {slackSvg(
                "M10 2a3.5 3.5 0 0 0-3.5 3.5v3a3.5 3.5 0 1 0 7 0v-3A3.5 3.5 0 0 0 10 2M8 5.5a2 2 0 1 1 4 0v3a2 2 0 1 1-4 0zM5 8.25a.75.75 0 0 0-1.5 0v.25a6.5 6.5 0 0 0 5.75 6.457V16.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.543A6.5 6.5 0 0 0 16.5 8.5v-.25a.75.75 0 0 0-1.5 0v.25a5 5 0 0 1-10 0z"
              )}
            </span>
            <span className="j_DS3W_composerDivider" aria-hidden="true" />
            <span className="j_DS3W_composerButton">
              {slackSvg(
                "M4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3m-3 1.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zm11.64 1.391a.75.75 0 0 0-1.28-.782l-5.5 9a.75.75 0 0 0 1.28.782z"
              )}
            </span>
            <span className="j_DS3W_composerSend">
              <span className="j_DS3W_composerButton">
                {slackSvg(
                  "M1.5 2.106c0-.462.498-.754.901-.528l15.7 7.714a.73.73 0 0 1 .006 1.307L2.501 18.46l-.07.017a.754.754 0 0 1-.931-.733v-4.572c0-1.22.971-2.246 2.213-2.268l6.547-.17c.27-.01.75-.243.75-.797 0-.553-.5-.795-.75-.795l-6.547-.171C2.47 8.95 1.5 7.924 1.5 6.704z",
                  16
                )}
              </span>
              <span className="j_DS3W_composerSendDivider" aria-hidden="true" />
              <span className="j_DS3W_composerButton">
                {slackSvg(
                  "M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06",
                  16
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const CLAUDE_MASCOT_PATH = (() => {
  const rect = (x: number, y: number, w: number) => `M${x} ${y}h${w}v8.5h${-w}Z`;
  const rows = [".######.", ".######.", "########", ".######.", "..#..#.."];
  return [
    ...rows.flatMap((row, rIdx) =>
      [...row].flatMap((ch, cIdx) => (ch === "#" ? [rect(7.8 * cIdx, 8.5 * rIdx, 7.8)] : []))
    ),
    ...[2, 6].map((cIdx) => rect(7.8 * cIdx, 8.5, 3.9)),
  ].join("");
})();

interface TerminalStep {
  kind: "tool" | "reply";
  name?: string;
  label?: string;
  runMs?: number;
  text?: string;
}

const TERMINAL_SCRIPT: {
  startSubmitted: boolean;
  prompt: string;
  steps: TerminalStep[];
  doneVerb: string;
  doneSeconds: number;
} = {
  startSubmitted: true,
  prompt:
    "look at kino.ai/p/phase2-readout#BloodPanel-4 and polish it. make it a reveal: each blood result from the trial lands after the one before",
  steps: [
    {
      kind: "tool",
      name: "Kino · readNode(BloodPanel-4)",
      label: "boards/Readout.tsx:58 · 5 markers in one table, all on frame 0",
      runMs: 1400,
    },
    {
      kind: "tool",
      name: "Kino · projectScreenshot(1:12)",
      label: "LDL, CRP, HbA1c, ALT, hemoglobin appear at once, no hierarchy",
      runMs: 2000,
    },
    {
      kind: "tool",
      name: "Edit(boards/Readout.tsx)",
      label: "one row per marker, 10f apart, value counts up from baseline, delta turns green on land",
      runMs: 1600,
    },
    {
      kind: "tool",
      name: "Kino · projectScreenshot(1:12 → 1:14)",
      label: "LDL lands first, hemoglobin last, 2s total",
      runMs: 2000,
    },
    {
      kind: "reply",
      text: "Polished. The five results land one after another, LDL first, with the deltas turning green as each one settles.",
    },
  ],
  doneVerb: "Polished",
  doneSeconds: 47,
};

const TERMINAL_TIMING = {
  msPerChar: 38,
  afterSubmitMs: 700,
  toolRunMs: 900,
  betweenRowsMs: 350,
  replyMs: 500,
  holdMs: 7000,
  restartMs: 600,
};

function computeStepWindows() {
  let cursor = 0;
  return TERMINAL_SCRIPT.steps.map((step) => {
    const start = cursor;
    cursor += step.kind === "tool" ? (step.runMs ?? TERMINAL_TIMING.toolRunMs) : TERMINAL_TIMING.replyMs;
    const end = cursor;
    cursor += TERMINAL_TIMING.betweenRowsMs;
    return { start, end };
  });
}

const STEP_WINDOWS = computeStepWindows();
const DONE_AT_MS = (STEP_WINDOWS.at(-1)?.end ?? 0) + TERMINAL_TIMING.betweenRowsMs;
const TOTAL_CYCLE_MS = DONE_AT_MS + TERMINAL_TIMING.holdMs + TERMINAL_TIMING.restartMs;
export const AGENT_TAB_MS = TOTAL_CYCLE_MS - TERMINAL_TIMING.restartMs;

const SPINNER_FRAMES = ["·", "✢", "✳", "✶", "✻", "*", "*", "✻", "✶", "✳", "✢", "·"];

function evaluateTerminalState(elapsedMs: number) {
  const t = ((elapsedMs % TOTAL_CYCLE_MS) + TOTAL_CYCLE_MS) % TOTAL_CYCLE_MS;
  const rows: Array<
    | { kind: "event"; id: string; name: string; label: string; status: "running" | "success" }
    | { kind: "reply"; text: string }
    | { kind: "done"; label: string }
  > = [];

  TERMINAL_SCRIPT.steps.forEach((step, idx) => {
    const { start, end } = STEP_WINDOWS[idx];
    if (t < start) return;
    if (step.kind === "reply") {
      if (t >= end && step.text) {
        rows.push({ kind: "reply", text: step.text });
      }
      return;
    }
    rows.push({
      kind: "event",
      id: `${idx}`,
      name: step.name ?? "",
      label: step.label ?? "",
      status: t >= end ? "success" : "running",
    });
  });

  if (t >= DONE_AT_MS) {
    rows.push({
      kind: "done",
      label: `${TERMINAL_SCRIPT.doneVerb} in ${TERMINAL_SCRIPT.doneSeconds}s`,
    });
  }

  return {
    typedPrompt: TERMINAL_SCRIPT.prompt,
    submitted: true,
    rows,
    isProcessing: t < DONE_AT_MS,
  };
}

function ShimmerWorkingMessage({ elapsedMs, message }: { elapsedMs: number; message: string }) {
  const spinner = SPINNER_FRAMES[Math.floor(elapsedMs / 120) % SPINNER_FRAMES.length];
  const span = message.length + 20;
  const pos = message.length + 10 - (Math.floor(elapsedMs / 200) % span);
  const chars = Array.from(message);
  const left = pos - 1;
  const right = pos + 1;
  let before = message;
  let shim = "";
  let after = "";
  if (left < chars.length && right >= 0) {
    const r = Math.max(0, left);
    before = "";
    chars.forEach((ch, idx) => {
      if (idx + 1 <= r) before += ch;
      else if (idx > right) after += ch;
      else shim += ch;
    });
  }

  return (
    <div
      className="mt-[17px] flex h-[17px] w-full flex-nowrap overflow-hidden"
      style={{ color: "#d28564" }}
    >
      <span aria-hidden="true" className="block w-[2ch] shrink-0">
        {spinner}
      </span>
      <span className="min-w-0 whitespace-pre">
        {before ? <span>{before}</span> : null}
        <span style={{ color: "#e8a888" }}>{shim}</span>
        {after ? <span>{after}</span> : null}
      </span>
    </div>
  );
}

function ClaudeCodeTerminal({ paused }: { paused: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    root: useScrollRoot(),
    rootMargin: "120px 0px",
    threshold: 0.1,
  });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    if (!inView || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let rafId = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += now - last;
      last = now;
      if (acc >= 40) {
        const step = 40 * Math.floor(acc / 40);
        acc -= step;
        setElapsedMs((prev) => prev + step);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, paused]);

  const turn = evaluateTerminalState(elapsedMs);
  const rowKey = turn.rows
    .map((r) => (r.kind === "event" ? `event:${r.id}:${r.status}` : r.kind))
    .join(",");

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const inner = innerRef.current;
    const bottom = bottomRef.current;
    if (!vp || !inner || !bottom) return;
    const update = () => {
      const contentHeight = bottom.offsetTop + bottom.offsetHeight;
      const next = Math.min(0, vp.clientHeight - contentHeight);
      setScrollOffset((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(vp);
    ro.observe(inner);
    ro.observe(bottom);
    return () => ro.disconnect();
  }, [rowKey, turn.isProcessing]);

  const titleSpinner = turn.isProcessing
    ? SPINNER_FRAMES[Math.floor(elapsedMs / 120) % SPINNER_FRAMES.length]
    : "✳";

  return (
    <div ref={setRefs} className="FEqDsa_terminal">
      <div
        className="z6YnSW_variable flex select-none flex-col overflow-hidden rounded-[12px] text-[13px] leading-[17px] text-white shadow-[inset_0_1px_0_#54565d,0_8px_24px_rgba(0,0,0,0.5),0_20px_56px_rgba(0,0,0,0.42)] h-full"
        style={{
          fontFamily: "var(--font-ghostty), 'JetBrains Mono', Menlo, monospace",
          background: "#282c34",
        }}
      >
        <div
          className="flex h-8 shrink-0 items-center gap-4 pl-[10px] pr-3 font-sans text-[13px] font-semibold leading-none"
          style={{
            color: "#a5a8b0",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", system-ui, sans-serif',
          }}
        >
          <div className="flex items-center gap-[11px]" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M0.5 2.5C0.5 1.948 0.948 1.5 1.5 1.5H5L6.3 2.9H12.5C13.052 2.9 13.5 3.348 13.5 3.9V10.5C13.5 11.052 13.052 11.5 12.5 11.5H1.5C0.948 11.5 0.5 11.052 0.5 10.5V2.5Z"
                fill="#6aaeff"
              />
              <path
                d="M0.5 4.5H13.5V10.5C13.5 11.052 13.052 11.5 12.5 11.5H1.5C0.948 11.5 0.5 11.052 0.5 10.5V4.5Z"
                fill="#8cc3ff"
              />
            </svg>
            <span className="shrink-0">{titleSpinner}</span>
            <span className="truncate">Polish the blood panel reveal</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 px-[2px] pt-[2px] flex flex-col overflow-hidden">
          <div ref={viewportRef} className="relative min-h-0 flex-1 overflow-hidden">
            <div
              ref={innerRef}
              className="flex min-h-full flex-col"
              style={{ transform: `translateY(${scrollOffset}px)` }}
            >
              <div className="shrink-0 pt-[17px]">
                <div className="flex items-start gap-[2ch] pl-[1ch]">
                  <svg
                    viewBox="0 0 62.4 42.5"
                    className="shrink-0"
                    style={{ color: "#d28564", width: 62.4, height: 42.5 }}
                    fill="currentColor"
                    fillRule="evenodd"
                    aria-hidden="true"
                  >
                    <path d={CLAUDE_MASCOT_PATH} />
                  </svg>
                  <div className="min-w-0">
                    <div className="min-w-0 whitespace-nowrap font-bold text-white">
                      Claude Code{" "}
                      <span className="font-normal" style={{ color: "#999999" }}>
                        v2.1.302
                      </span>
                    </div>
                    <div className="min-w-0 truncate" style={{ color: "#999999" }}>
                      Opus 5.5 with medium effort · Claude Max
                    </div>
                    <div className="min-w-0 truncate" style={{ color: "#999999" }}>
                      ~/phase2-readout
                    </div>
                  </div>
                </div>
                <div className="mt-[17px] flex" style={{ color: "#999999" }}>
                  <span
                    className="w-[2ch] shrink-0 border-l-2 border-[#505050]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 truncate">
                    Using Opus 5.5 (from .claude/settings.json) · /model
                  </span>
                </div>
              </div>

              <div
                className="mt-[17px] flex whitespace-pre-wrap text-white"
                style={{ background: "#363941" }}
              >
                <span className="w-[2ch] shrink-0 text-[#505050]">❯</span>
                <span className="min-w-0 break-words">{turn.typedPrompt}</span>
              </div>

              {turn.rows.map((row) => {
                if (row.kind === "event") {
                  const isRunning = row.status === "running";
                  return (
                    <div key={`event:${row.id}`} className="mt-[17px]">
                      <div className="flex items-start">
                        <span
                          aria-hidden="true"
                          className="w-[2ch] shrink-0"
                          style={{ color: isRunning ? "#999999" : "#ffffff" }}
                        >
                          ●
                        </span>
                        <span
                          className="min-w-0 flex-1 break-words text-white"
                          style={{ wordBreak: "break-word" }}
                        >
                          {row.name}
                          {isRunning ? "…" : ""}
                        </span>
                      </div>
                      {!isRunning && (
                        <div className="flex pl-[2ch]" style={{ color: "#999999" }}>
                          <span className="w-[3ch] shrink-0" aria-hidden="true">
                            ⎿
                          </span>
                          <span className="min-w-0 whitespace-pre-wrap break-words">
                            {row.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                if (row.kind === "reply") {
                  return (
                    <div key="reply" className="mt-[17px] flex items-start text-white">
                      <span aria-hidden="true" className="w-[2ch] shrink-0">
                        ●
                      </span>
                      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
                        {row.text}
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    key="done"
                    className="mt-[17px] flex w-full"
                    style={{ color: "#999999" }}
                  >
                    <span aria-hidden="true" className="w-[2ch] shrink-0">
                      ✻
                    </span>
                    <span>{row.label}</span>
                  </div>
                );
              })}

              <div className="flex-1" />
              {turn.isProcessing && (
                <ShimmerWorkingMessage elapsedMs={elapsedMs} message="Polishing…" />
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="flex max-h-[50%] shrink-0 flex-col overflow-hidden">
            <div
              className="mt-[17px] min-h-0 shrink overflow-hidden border-t"
              style={{ borderColor: "#888888" }}
            >
              <div className="mt-[17px] flex min-h-[17px] items-start whitespace-pre-wrap text-white">
                <span className="w-[2ch] shrink-0" style={{ color: "#999999" }}>
                  ❯
                </span>
                <span className="min-w-0 break-words">
                  <span
                    aria-hidden="true"
                    className="inline-block h-[15px] w-[7.8px] translate-y-[2px] bg-white motion-safe:animate-[ghostty-blink_1.1s_steps(1)_infinite]"
                    style={{ opacity: 1 }}
                  />
                </span>
              </div>
            </div>
            <div className="mt-[17px] mb-[17px] flex shrink-0 pl-[2ch]">
              <div className="min-w-0 truncate">
                <span style={{ color: "#f17582" }}>⏵⏵ bypass permissions on</span>
                <span style={{ color: "#999999" }}> (shift+tab to cycle)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const URL_TABS = [
  { id: "imessage", label: "iMessage", ms: 9000 },
  { id: "slack", label: "Slack", ms: 9000 },
  { id: "agent", label: "Agent", ms: AGENT_TAB_MS },
] as const;

export function UrlCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [animated, setAnimated] = useState(false);
  const baseId = useId();

  const switchTo = useCallback((index: number, isAuto: boolean) => {
    setAnimated(isAuto);
    setActiveIndex(index);
    setCycleKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        switchTo((activeIndex + 1) % URL_TABS.length, true);
      } else {
        setCycleKey((k) => k + 1);
      }
    }, URL_TABS[activeIndex].ms);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, cycleKey, switchTo]);

  return (
    <div
      className="hnWpcq_carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div role="tablist" aria-label="Where the link lands" className="hnWpcq_tabs">
        {URL_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={idx === activeIndex}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={idx === activeIndex ? 0 : -1}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hnWpcq_tab"
            onClick={() => {
              if (idx !== activeIndex) switchTo(idx, false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next =
                (idx + (e.key === "ArrowRight" ? 1 : -1) + URL_TABS.length) % URL_TABS.length;
              switchTo(next, false);
              document.getElementById(`${baseId}-tab-${URL_TABS[next].id}`)?.focus();
            }}
          >
            <span className="hnWpcq_track" aria-hidden="true">
              <span
                key={`${cycleKey}-${idx === activeIndex}`}
                className="hnWpcq_fill"
                style={{
                  animationDuration: `${tab.ms}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="hnWpcq_stage" data-animated={animated || undefined}>
        {URL_TABS.map((tab, idx) => {
          const isActive = idx === activeIndex;
          const state = isActive
            ? "active"
            : idx === (activeIndex + URL_TABS.length - 1) % URL_TABS.length
              ? "before"
              : "after";
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${baseId}-panel-${tab.id}`}
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              aria-hidden={!isActive}
              inert={!isActive}
              data-state={state}
              className="hnWpcq_panel"
            >
              {tab.id === "imessage" ? (
                <IMessagePanel active={isActive} />
              ) : tab.id === "slack" ? (
                <SlackPanel />
              ) : (
                <ClaudeCodeTerminal paused={!isActive} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UrlSection() {
  return (
    <section aria-labelledby="landing-url">
      <div className="qIUd4G_url">
        <div className="qIUd4G_urlCopy">
          <h2 id="landing-url" className="qIUd4G_urlTitle">
            Everything is a URL.
          </h2>
          <p className="qIUd4G_urlBody">
            Paste a render for review, share every asset as one package, or hand a node to your
            agent.
          </p>
        </div>
        <div>
          <UrlCarousel />
        </div>
      </div>
    </section>
  );
}
