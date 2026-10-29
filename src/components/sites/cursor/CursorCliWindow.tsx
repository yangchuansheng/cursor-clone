"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface CliStep {
  id: string;
  role: "thinking" | "read" | "search" | "assistant" | "code";
  text: string;
  codeFile?: string;
  codeAdded?: string;
  codeRemoved?: string;
  durationMs: number;
}

const BIOTECH_STEPS: CliStep[] = [
  {
    id: "b2",
    role: "thinking",
    text: "Thought 5s",
    durationMs: 750,
  },
  {
    id: "b3",
    role: "read",
    text: "Read bio/sequence_alignment.py, bio/fasta.py, bio/translate.py",
    durationMs: 650,
  },
  {
    id: "b4",
    role: "search",
    text: "Searched for 'gotoh algorithm implementation python'",
    durationMs: 650,
  },
  {
    id: "b5",
    role: "assistant",
    text: "I'll add Gotoh's affine gap algorithm to your alignment module and fix the FASTA parser. Let me start with the alignment code:",
    durationMs: 450,
  },
  {
    id: "b6",
    role: "code",
    text: "bio/sequence_alignment.py\n\n+GAP_OPEN",
    codeRemoved: "-10",
    durationMs: 450,
  },
  {
    id: "b7",
    role: "assistant",
    text: "Good, I've added the complete Gotoh implementation with proper traceback. Now let me fix the FASTA parser:",
    durationMs: 450,
  },
  {
    id: "b8",
    role: "code",
    text: "bio/fasta.py\n\n-def",
    durationMs: 450,
  },
  {
    id: "b9",
    role: "assistant",
    text: "Perfect! Now let me also add ORF finding capability to the translate module since that's often needed:",
    durationMs: 450,
  },
  {
    id: "b10",
    role: "code",
    text: "bio/translate.py\n\n+def",
    codeAdded: "+3",
    codeRemoved: "-1",
    durationMs: 450,
  },
  {
    id: "b11",
    role: "assistant",
    text: `Great! I've added:

1. **Gotoh's algorithm** with proper affine gap penalties (gap open: -10, extend: -1)
2. **Fixed FASTA parser** that handles multi-line sequences and cleans up whitespace/numbers
3. **ORF finder** that searches all three frames for start/stop codons
4. **Reverse complement** function for searching both strands

The Gotoh implementation uses three matrices (M, X, Y) to track match/mismatch and gap states separately, which gives much better alignments for sequences with indels. Your existing \`nw_align\` function is unchanged.

Want me to create a quick test to verify everything works?`,
    durationMs: 300,
  },
];

const CLI_COMMANDS = [
  { name: "model", description: "switch models" },
  { name: "reset", description: "replay demo" },
];

const CLI_MODELS = [
  { key: "auto", label: "Auto" },
  { key: "grok-4-7", label: "Grok 4.7" },
  { key: "opus-5-5", label: "Opus 5.5" },
  { key: "gpt-5.6-sol-high-fast", label: "GPT-5.6 Sol High Fast" },
  { key: "fable-5-1-max", label: "Fable 5.1 Max" },
  { key: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
  { key: "composer-2.5", label: "Composer 2.5" },
];

export function CursorCliWindow() {
  const [visibleSteps, setVisibleSteps] = useState<CliStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [tokenCount, setTokenCount] = useState(12);
  const [isStreaming, setIsStreaming] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [selectedCommandIdx, setSelectedCommandIdx] = useState(0);
  const [selectedModelIdx, setSelectedModelIdx] = useState(1);
  const [currentModel, setCurrentModel] = useState("Grok 4.7");
  const [replayCount, setReplayCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeStepId) return;
    const interval = window.setInterval(() => {
      setTick((t) => t + 1);
      setTokenCount((c) => Math.min(240, c + 7));
    }, 80);
    return () => window.clearInterval(interval);
  }, [activeStepId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setVisibleSteps([]);
      setIsStreaming(true);
      setTokenCount(12);
      for (const step of BIOTECH_STEPS) {
        if (cancelled) return;
        setVisibleSteps((prev) => [...prev, step]);
        const isToolStep =
          step.role === "thinking" || step.role === "read" || step.role === "search";
        if (isToolStep) {
          setActiveStepId(step.id);
          setTick(0);
        }
        await new Promise((resolve) => window.setTimeout(resolve, step.durationMs));
        if (cancelled) return;
        if (isToolStep) {
          setActiveStepId(null);
        }
      }
      if (!cancelled) {
        setIsStreaming(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [replayCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visibleSteps.length, inputValue, showModelMenu]);

  const hexGlyph = useMemo(() => {
    if (!activeStepId) return "⬢";
    return Math.floor(tick / 3) % 2 === 0 ? "⬢" : "⬡";
  }, [activeStepId, tick]);

  const filteredCommands = useMemo(() => {
    if (!inputValue.startsWith("/")) return CLI_COMMANDS;
    const q = inputValue.slice(1).trim().toLowerCase();
    const matches = CLI_COMMANDS.filter((c) => c.name.startsWith(q));
    return matches.length > 0 ? matches : CLI_COMMANDS;
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isSlash = inputValue.startsWith("/");
    if (showModelMenu) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedModelIdx(
          (prev) =>
            (prev + (e.key === "ArrowDown" ? 1 : -1) + CLI_MODELS.length) %
            CLI_MODELS.length
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const chosen = CLI_MODELS[selectedModelIdx];
        if (chosen) {
          setCurrentModel(chosen.label);
          setInputValue("");
          setShowModelMenu(false);
          setSelectedCommandIdx(0);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowModelMenu(false);
        return;
      }
    }

    if (isSlash) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const len = filteredCommands.length;
        setSelectedCommandIdx(
          (prev) => (prev + (e.key === "ArrowDown" ? 1 : -1) + len) % len
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedCommandIdx] ?? filteredCommands[0];
        if (!cmd) return;
        if (cmd.name === "model") {
          setShowModelMenu(true);
          setSelectedModelIdx(0);
          setInputValue("/model ");
        } else if (cmd.name === "reset") {
          setInputValue("");
          setShowModelMenu(false);
          setSelectedCommandIdx(0);
          setReplayCount((c) => c + 1);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setInputValue("");
        setShowModelMenu(false);
        setSelectedCommandIdx(0);
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        setInputValue("");
      }
    }
  };

  const renderFormattedAssistant = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="text-theme-text">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <div
        className="bg-theme-product-editor text-theme-text flex h-full min-h-0 w-full flex-col"
        style={{ fontSize: "13px" }}
      >
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 px-4 pt-0 pb-2 thin-scrollbar overflow-y-auto overscroll-auto"
          style={{
            scrollbarGutter: "stable",
            paddingTop: "1em",
            pointerEvents: "auto",
          }}
        >
          <div className="type-product-base-mono flex min-h-full flex-col justify-end">
            <div />
            <div className="text-theme-text">Cursor Agent</div>
            <div className="text-theme-text-sec mb-2">~/cursor/cursor-web</div>
            <div className="text-theme-text mb-2">Bioinformatics Tools</div>
            <div className="border-theme-border-02 bg-theme-bg-muted text-theme-text mb-4 border px-3 py-2">
              Add affine gap alignment. We only have basic NW alignment but I need
              Gotoh&apos;s algorithm for better handling of indels. Also fix the FASTA
              parser.
            </div>
            <div className="space-y-2">
              {visibleSteps.map((step) => {
                if (
                  step.role === "thinking" ||
                  step.role === "read" ||
                  step.role === "search"
                ) {
                  const isActive = activeStepId === step.id;
                  const words = step.text.split(" ");
                  let firstWord = words[0] ?? "";
                  let rest = words.slice(1).join(" ");
                  if (isActive) {
                    if (step.role === "read") firstWord = "Reading";
                    else if (step.role === "search") firstWord = "Searching";
                    else {
                      firstWord = "Thinking";
                      rest = `${tokenCount} tokens`;
                    }
                  }
                  const fullText = rest ? `${firstWord} ${rest}` : firstWord;
                  const firstLen = firstWord.length || 1;
                  const highlightIdx1 = isActive ? tick % firstLen : -1;
                  const highlightIdx2 = isActive ? (highlightIdx1 + 1) % firstLen : -1;

                  return (
                    <div key={step.id} className="leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span
                          className={isActive ? "text-green-500" : "text-theme-text"}
                        >
                          {isActive ? hexGlyph : "⬢"}
                        </span>
                        <div className="text-theme-text min-w-0 flex-1">
                          <div className="truncate whitespace-nowrap">
                            {Array.from(fullText).map((ch, idx) => {
                              const inFirstWord = idx < firstLen;
                              const baseOpacity = isActive
                                ? inFirstWord
                                  ? "opacity-80"
                                  : "opacity-50"
                                : inFirstWord
                                ? "opacity-90"
                                : "opacity-60";
                              const shimmerClass =
                                isActive &&
                                (idx === highlightIdx1 || idx === highlightIdx2)
                                  ? " opacity-100 text-theme-text"
                                  : "";
                              return (
                                <span key={idx} className={baseOpacity + shimmerClass}>
                                  {ch}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (step.role === "code") {
                  return (
                    <div key={step.id} className="leading-relaxed">
                      <div className="border-theme-border-02 bg-theme-bg-muted border px-3 py-2">
                        <div className="flex items-center">
                          <span className="type-product-base-mono">
                            <span className="font-medium whitespace-pre-wrap">
                              {step.text}
                            </span>
                            {step.codeAdded && (
                              <span className="ml-2 text-green-600">
                                {step.codeAdded}
                              </span>
                            )}
                            {step.codeRemoved && (
                              <span className="ml-1 text-red-600">
                                {step.codeRemoved}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={step.id} className="leading-relaxed">
                    <div className="text-theme-text whitespace-pre-wrap">
                      {renderFormattedAssistant(step.text)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3">
              <div className="border-theme-text flex items-center gap-2 border px-3 py-2">
                <span className="text-theme-text">→</span>
                <input
                  placeholder="Add a follow-up"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="flex-1 bg-transparent outline-none text-theme-text placeholder:text-theme-text-sec"
                  type="text"
                  value={inputValue}
                  name="follow-up"
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputValue(val);
                    if (!val.startsWith("/")) {
                      setShowModelMenu(false);
                      setSelectedCommandIdx(0);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
                {isStreaming && (
                  <span className="text-theme-text-sec">ctrl+c to stop</span>
                )}
              </div>
            </div>

            {inputValue.startsWith("/") || showModelMenu ? (
              <div className="w-full">
                <div className="bg-theme-bg-muted text-theme-text min-h-[36px] px-1 pt-3">
                  {showModelMenu ? (
                    <div>
                      {CLI_MODELS.map((m, idx) => (
                        <div
                          key={m.key}
                          onClick={() => {
                            setCurrentModel(m.label);
                            setInputValue("");
                            setShowModelMenu(false);
                            setSelectedCommandIdx(0);
                          }}
                          className={
                            idx === selectedModelIdx
                              ? "text-theme-text flex min-w-0 cursor-pointer items-center gap-1 px-2"
                              : "text-theme-text-ter flex min-w-0 cursor-pointer items-center gap-1 px-2 opacity-40"
                          }
                        >
                          <span className="w-4 flex-shrink-0 text-theme-text">
                            {idx === selectedModelIdx ? "→" : ""}
                          </span>
                          <span
                            className={
                              idx === selectedModelIdx
                                ? "text-theme-text min-w-0 truncate font-bold"
                                : "min-w-0 truncate"
                            }
                          >
                            /model {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {filteredCommands.map((cmd, idx) => (
                        <div
                          key={cmd.name}
                          onClick={() => {
                            if (cmd.name === "model") {
                              setShowModelMenu(true);
                              setSelectedModelIdx(0);
                              setInputValue("/model ");
                            } else if (cmd.name === "reset") {
                              setInputValue("");
                              setShowModelMenu(false);
                              setSelectedCommandIdx(0);
                              setReplayCount((c) => c + 1);
                            }
                          }}
                          className={
                            idx === selectedCommandIdx
                              ? "bg-theme-card-hover-hex/20 text-theme-text flex cursor-pointer items-center gap-0 px-2"
                              : "text-theme-text-sec flex cursor-pointer items-center gap-0 px-2"
                          }
                        >
                          <span className="text-theme-text w-4">
                            {idx === selectedCommandIdx ? "→" : ""}
                          </span>
                          <span className="text-theme-text mr-3">/{cmd.name}</span>
                          <span className="opacity-60">{`  ${cmd.description}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-theme-text-sec mt-3 min-h-[36px]">
                {currentModel}
                <br />/ for commands · @ for files
              </div>
            )}
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
