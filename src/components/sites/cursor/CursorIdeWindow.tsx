"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

export type ScenarioKey =
  | "websiteBuilder"
  | "productPlanning"
  | "mlPython"
  | "cursorRules"
  | "biotech";

interface ScenarioFile {
  id: string;
  tabLabel: string;
  fullPath: string;
  kind: "browser" | "plan" | "code";
  lines?: Array<{
    diff?: "add" | "remove";
    tokens: Array<{ text: string; color?: string; bold?: boolean; italic?: boolean }>;
  }>;
}

interface ScenarioQuestion {
  id: string;
  prompt: string;
  options: Array<{ id: string; label: string }>;
}

interface ChatStep {
  id: string;
  kind: "thought" | "read" | "search" | "file" | "assistant";
  label?: string;
  detail?: string;
  fileId?: string;
  fileName?: string;
  added?: string;
  removed?: string;
  text?: string;
  bullets?: Array<{ title?: string; text: string; code?: string }>;
}

interface ScenarioConfig {
  key: ScenarioKey;
  title: string;
  timeAgo: string;
  sidebarSubtitle: string;
  sidebarDiff?: { added: string; removed: string };
  defaultMode: "agent" | "plan";
  userPrompt: string;
  steps: ChatStep[];
  questions?: ScenarioQuestion[];
  files: ScenarioFile[];
  initialOpenFileIds: string[];
  initialActiveFileId: string;
}

const SCENARIOS: Record<ScenarioKey, ScenarioConfig> = {
  websiteBuilder: {
    key: "websiteBuilder",
    title: "Build Landing Page",
    timeAgo: "now",
    sidebarSubtitle:
      "Done. Fonts preload in the head, critical CSS is inlined, and I added a color-scheme meta tag so dark mode renders insta",
    defaultMode: "agent",
    userPrompt: "make a landing page based on attached docs explaining what we do",
    steps: [
      { id: "w1", kind: "read", label: "Read", detail: "about-acme.md" },
      { id: "w2", kind: "read", label: "Read", detail: "brand-guidelines.pdf" },
      { id: "w3", kind: "thought", label: "Thought", detail: "6s" },
      {
        id: "w4",
        kind: "assistant",
        text: "I'll create a minimal, serif-based landing page that matches your brand voice.",
      },
      {
        id: "w5",
        kind: "file",
        fileId: "app/page.tsx",
        fileName: "app/page.tsx",
        added: "+52",
        removed: "-0",
      },
      {
        id: "w6",
        kind: "file",
        fileId: "app/globals.css",
        fileName: "app/globals.css",
        added: "+18",
        removed: "-0",
      },
      {
        id: "w7",
        kind: "assistant",
        text: "Done. Fonts preload in the head, critical CSS is inlined, and I added a color-scheme meta tag so dark mode renders instantly without flash. 280ms first paint.",
      },
    ],
    files: [
      {
        id: "browser-preview",
        tabLabel: "localhost:3000",
        fullPath: "localhost:3000",
        kind: "browser",
      },
      {
        id: "app/page.tsx",
        tabLabel: "page.tsx",
        fullPath: "app/page.tsx",
        kind: "code",
        lines: [
          {
            diff: "add",
            tokens: [
              { text: "import", color: "#83D6C5" },
              { text: " { CursorLogoSvg } ", color: "#E4E4E4EB" },
              { text: "from", color: "#83D6C5" },
              { text: ' "@/components/CursorLogoSvg"', color: "#E394DC" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          { tokens: [] },
          {
            diff: "add",
            tokens: [
              { text: "export default function", color: "#83D6C5" },
              { text: " Home", color: "#EFB080" },
              { text: "() {", color: "#D6D6DD" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "  return (", color: "#83D6C5" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "    <main ", color: "#82D2CE" },
              { text: "className", color: "#AAA0FA", italic: true },
              {
                text: '="font-serif min-h-screen flex flex-col px-6 py-8"',
                color: "#E394DC",
              },
              { text: ">", color: "#82D2CE" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: '      <header className="mb-8 flex items-center">', color: "#82D2CE" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: '        <span className="italic font-medium">Acme Labs</span>', color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "      </header>", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [
              {
                text: '      <div className="flex-1 max-w-[48ch] text-lg leading-relaxed">',
                color: "#82D2CE",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "        <p>Software creation is changing. We are a group of researchers,</p>",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "        <p>engineers, and technologists inventing at the edge.</p>",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: '        <p className="mt-4">We have much to learn, try, and build.</p>',
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: '        <a href="/careers" className="mt-4 inline-block underline">',
                color: "#82D2CE",
              },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "          Join our team →", color: "#E4E4E4EB" }],
          },
          {
            diff: "add",
            tokens: [{ text: "        </a>", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [{ text: "      </div>", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [{ text: "    </main>", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [{ text: "  );", color: "#D6D6DD" }],
          },
          {
            diff: "add",
            tokens: [{ text: "}", color: "#D6D6DD" }],
          },
        ],
      },
      {
        id: "app/globals.css",
        tabLabel: "globals.css",
        fullPath: "app/globals.css",
        kind: "code",
        lines: [
          {
            diff: "add",
            tokens: [{ text: ":root {", color: "#EFB080" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "  --font-serif", color: "#82D2CE" },
              { text: ': "EB Garamond", "Iowan Old Style", Georgia, serif;', color: "#E394DC" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  --color-bg", color: "#82D2CE" },
              { text: ": #f7f7f4;", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  --color-text", color: "#82D2CE" },
              { text: ": #26251e;", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "}", color: "#D6D6DD" }],
          },
          { tokens: [] },
          {
            diff: "add",
            tokens: [{ text: "@media (prefers-color-scheme: dark) {", color: "#83D6C5" }],
          },
          {
            diff: "add",
            tokens: [{ text: "  :root {", color: "#EFB080" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "    --color-bg", color: "#82D2CE" },
              { text: ": #14120b;", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "    --color-text", color: "#82D2CE" },
              { text: ": #edecec;", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "  }", color: "#D6D6DD" }],
          },
          {
            diff: "add",
            tokens: [{ text: "}", color: "#D6D6DD" }],
          },
        ],
      },
    ],
    initialOpenFileIds: ["browser-preview", "app/page.tsx"],
    initialActiveFileId: "browser-preview",
  },

  productPlanning: {
    key: "productPlanning",
    title: "Plan Mission Control",
    timeAgo: "now",
    sidebarSubtitle:
      "Drafted implementation steps in `feature-prd.md`. A few quick questions before I start building:",
    sidebarDiff: { added: "+20", removed: "-3" },
    defaultMode: "plan",
    userPrompt:
      "let's build a mission control interface, similar to the expose-style window manager on macOS",
    steps: [
      { id: "p1", kind: "thought", label: "Thought", detail: "4s" },
      { id: "p2", kind: "read", label: "Read", detail: "AppManager.tsx" },
      { id: "p3", kind: "search", label: "Searched", detail: "expose patterns" },
      {
        id: "p4",
        kind: "file",
        fileId: "feature-prd",
        fileName: "feature-prd.md",
        added: "+68",
      },
      {
        id: "p5",
        kind: "assistant",
        text: "Drafted implementation steps in `feature-prd.md`. A few quick questions before I start building:",
      },
    ],
    questions: [
      {
        id: "trigger",
        prompt: "How should Mission Control be triggered?",
        options: [
          { id: "gesture", label: "Gesture (swipe up with 3 fingers)" },
          { id: "keyboard", label: "Keyboard shortcut (e.g., F3 or Cmd+F3)" },
          { id: "both", label: "Both keyboard and button" },
        ],
      },
      {
        id: "layout",
        prompt: "How should windows be arranged?",
        options: [
          { id: "grid", label: "Even grid layout" },
          { id: "cascade", label: "Cascading tiles" },
          { id: "smart", label: "Smart layout based on window size" },
        ],
      },
      {
        id: "animation",
        prompt: "Animation style preference?",
        options: [
          { id: "smooth", label: "Smooth spring animations" },
          { id: "snappy", label: "Snappy, instant transitions" },
          { id: "reduced", label: "Respect reduced motion settings" },
        ],
      },
    ],
    files: [
      {
        id: "feature-prd",
        tabLabel: "feature-prd.md",
        fullPath: "feature-prd.md",
        kind: "plan",
      },
      {
        id: "src/lib/collaboration/presence.ts",
        tabLabel: "presence.ts",
        fullPath: "src/lib/collaboration/presence.ts",
        kind: "code",
        lines: [
          {
            tokens: [
              { text: "import", color: "#83D6C5" },
              { text: " { WebSocketClient } ", color: "#E4E4E4EB" },
              { text: "from", color: "#83D6C5" },
              { text: " '../websocket'", color: "#E394DC" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "export interface", color: "#83D6C5" },
              { text: " UserPresence ", color: "#EFB080" },
              { text: "{", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              { text: "  userId: ", color: "#E4E4E4EB" },
              { text: "string", color: "#82D2CE" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              { text: "  userName: ", color: "#E4E4E4EB" },
              { text: "string", color: "#82D2CE" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              { text: "  status: ", color: "#E4E4E4EB" },
              { text: "'online' | 'away' | 'busy'", color: "#E394DC" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              { text: "  cursorPosition?: { line: ", color: "#E4E4E4EB" },
              { text: "number", color: "#82D2CE" },
              { text: "; column: ", color: "#E4E4E4EB" },
              { text: "number", color: "#82D2CE" },
              { text: " };", color: "#D6D6DD" },
            ],
          },
          { tokens: [{ text: "}", color: "#D6D6DD" }] },
          { tokens: [] },
          {
            tokens: [
              { text: "export class", color: "#83D6C5" },
              { text: " PresenceManager ", color: "#EFB080" },
              { text: "{", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              { text: "  private ws: ", color: "#E4E4E4EB" },
              { text: "WebSocketClient", color: "#82D2CE" },
              { text: ";", color: "#D6D6DD" },
            ],
          },
          {
            tokens: [
              {
                text: "  private presence: Map<string, UserPresence> = new Map();",
                color: "#E4E4E4EB",
              },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "  constructor(ws: ", color: "#E4E4E4EB" },
              { text: "WebSocketClient", color: "#82D2CE" },
              { text: ") {", color: "#D6D6DD" },
            ],
          },
          { tokens: [{ text: "    this.ws = ws;", color: "#E4E4E4EB" }] },
          {
            diff: "add",
            tokens: [{ text: "    this.setupListeners();", color: "#E4E4E4EB" }],
          },
          { tokens: [{ text: "  }", color: "#D6D6DD" }] },
          { tokens: [] },
          {
            diff: "add",
            tokens: [
              { text: "  private ", color: "#83D6C5" },
              { text: "setupListeners", color: "#EFB080" },
              { text: "() {", color: "#D6D6DD" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "    this.ws.on(", color: "#E4E4E4EB" },
              { text: "'presence:join'", color: "#E394DC" },
              { text: ", (data) => {", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "      this.presence.set(data.userId, data);", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "      this.notifyListeners();", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "    });", color: "#D6D6DD" }],
          },
          {
            diff: "add",
            tokens: [{ text: "  }", color: "#D6D6DD" }],
          },
          { tokens: [{ text: "}", color: "#D6D6DD" }] },
        ],
      },
    ],
    initialOpenFileIds: ["feature-prd", "src/lib/collaboration/presence.ts"],
    initialActiveFileId: "feature-prd",
  },

  mlPython: {
    key: "mlPython",
    title: "PyTorch MNIST Experiments",
    timeAgo: "10m",
    sidebarSubtitle: "PyTorch MNIST Experiments",
    defaultMode: "agent",
    userPrompt:
      "Add mixed precision training (AMP), validation split, and configurable hyperparameters to my MNIST trainer.",
    steps: [
      { id: "m1", kind: "thought", label: "Thought", detail: "7s" },
      {
        id: "m2",
        kind: "read",
        label: "Read",
        detail: "notebooks/train_model.py, experiments/config.yaml",
      },
      {
        id: "m3",
        kind: "assistant",
        text: "I'll update your MNIST training script to support YAML configuration, validation splitting, and PyTorch AMP.",
      },
      {
        id: "m4",
        kind: "file",
        fileId: "notebooks/train_model.py",
        fileName: "notebooks/train_model.py",
        added: "+64",
        removed: "-18",
      },
      {
        id: "m5",
        kind: "file",
        fileId: "experiments/config.yaml",
        fileName: "experiments/config.yaml",
        added: "+22",
        removed: "-0",
      },
      {
        id: "m6",
        kind: "assistant",
        text: "Updated `train_model.py` with `torch.cuda.amp.autocast`, `GradScaler`, and cosine annealing learning rate schedule.",
      },
    ],
    files: [
      {
        id: "notebooks/train_model.py",
        tabLabel: "train_model.py",
        fullPath: "notebooks/train_model.py",
        kind: "code",
        lines: [
          {
            tokens: [
              { text: "import", color: "#83D6C5" },
              { text: " torch", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "import", color: "#83D6C5" },
              { text: " torch.nn ", color: "#E4E4E4EB" },
              { text: "as", color: "#83D6C5" },
              { text: " nn", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "remove",
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " torch.utils.data ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " DataLoader", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " torch.utils.data ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " DataLoader, random_split", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " torchvision ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " datasets, transforms", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "import", color: "#83D6C5" },
              { text: " yaml", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            diff: "add",
            tokens: [
              { text: "def", color: "#82D2CE" },
              { text: " load_config", color: "#EFB080" },
              { text: '(config_path="experiments/config.yaml"):', color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  with", color: "#83D6C5" },
              { text: " open(config_path) ", color: "#E4E4E4EB" },
              { text: "as", color: "#83D6C5" },
              { text: " f:", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "    return", color: "#83D6C5" },
              { text: " yaml.safe_load(f)", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "class", color: "#82D2CE" },
              { text: " MLP", color: "#EFB080" },
              { text: "(nn.Module):", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "remove",
            tokens: [
              { text: "  def __init__(self, hidden=128):", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  def", color: "#82D2CE" },
              { text: " __init__", color: "#EFB080" },
              { text: "(self, config):", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [{ text: "    super().__init__()", color: "#E4E4E4EB" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "    hidden = config['model']['hidden_size']", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "    dropout = config['model']['dropout']", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "    self.net = nn.Sequential(", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "      nn.Flatten(), nn.Linear(28*28, hidden), nn.ReLU(),", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "      nn.Dropout(dropout), nn.Linear(hidden, 10)", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [{ text: "    )", color: "#E4E4E4EB" }] },
        ],
      },
      {
        id: "experiments/run_experiment.py",
        tabLabel: "run_experiment.py",
        fullPath: "experiments/run_experiment.py",
        kind: "code",
        lines: [
          {
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " notebooks.train_model ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " train_model", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            diff: "add",
            tokens: [
              { text: "if", color: "#83D6C5" },
              { text: ' __name__ == "__main__":', color: "#E394DC" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: '  metrics = train_model("experiments/config.yaml")', color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: '  print(f"Final val accuracy: {metrics[\'val_acc\'][-1]:.4f}")', color: "#E4E4E4EB" },
            ],
          },
        ],
      },
      {
        id: "experiments/config.yaml",
        tabLabel: "config.yaml",
        fullPath: "experiments/config.yaml",
        kind: "code",
        lines: [
          {
            diff: "add",
            tokens: [{ text: "model:", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "  hidden_size: ", color: "#E4E4E4EB" },
              { text: "256", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  dropout: ", color: "#E4E4E4EB" },
              { text: "0.2", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "training:", color: "#82D2CE" }],
          },
          {
            diff: "add",
            tokens: [
              { text: "  batch_size: ", color: "#E4E4E4EB" },
              { text: "128", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  learning_rate: ", color: "#E4E4E4EB" },
              { text: "0.001", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  epochs: ", color: "#E4E4E4EB" },
              { text: "10", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "  use_amp: ", color: "#E4E4E4EB" },
              { text: "true", color: "#83D6C5" },
            ],
          },
        ],
      },
    ],
    initialOpenFileIds: [
      "notebooks/train_model.py",
      "experiments/run_experiment.py",
      "experiments/config.yaml",
    ],
    initialActiveFileId: "notebooks/train_model.py",
  },

  cursorRules: {
    key: "cursorRules",
    title: "Set up Cursor Rules for Dashboard",
    timeAgo: "30m",
    sidebarSubtitle: "Set up Cursor Rules for Dashboard",
    defaultMode: "agent",
    userPrompt:
      "Set up Cursor Rules for our Next.js dashboard app to enforce consistent patterns across the team",
    steps: [
      { id: "c1", kind: "thought", label: "Thought", detail: "5s" },
      {
        id: "c2",
        kind: "search",
        label: "Searched",
        detail: "Cursor Rules documentation and .mdc file format",
      },
      { id: "c3", kind: "read", label: "Read", detail: ".cursor/rules/*.mdc files" },
      {
        id: "c4",
        kind: "assistant",
        text: "I'll set up Cursor Rules for your dashboard to enforce consistent patterns. Let me create a rules file with all the necessary guidelines:",
      },
      {
        id: "c5",
        kind: "file",
        fileId: ".cursor/rules/next.mdc",
        fileName: ".cursor/rules/next.mdc",
      },
      {
        id: "c6",
        kind: "assistant",
        text: "Perfect! I've created a comprehensive Cursor Rules file for your dashboard:\n\n• Applies to all dashboard files via glob pattern\n• Enforces Next.js App Router best practices\n• Defines component structure and naming conventions\n• Includes instructions for UI components, state management, and performance",
      },
    ],
    files: [
      {
        id: ".cursor/rules/next.mdc",
        tabLabel: "next.mdc",
        fullPath: ".cursor/rules/next.mdc",
        kind: "code",
        lines: [
          {
            diff: "remove",
            tokens: [{ text: "--", color: "#E4E4E4EB" }],
          },
          {
            tokens: [
              { text: "Description: Rules for the dashboard application", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [{ text: "Globs: apps/dashboard/**", color: "#E4E4E4EB" }],
          },
          {
            diff: "remove",
            tokens: [{ text: "--", color: "#D6D6DD", bold: true }],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "# Dashboard Application Rules", color: "#D6D6DD", bold: true },
            ],
          },
          { tokens: [] },
          {
            tokens: [{ text: "## Instructions", color: "#D6D6DD", bold: true }],
          },
          {
            tokens: [
              { text: "Follow Next.js App Router best practices", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "Use React Server Components by default", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "Implement type-safe server actions", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              {
                text: "Follow mobile-first responsive design with Tailwind CSS",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            tokens: [
              {
                text: "Use shadcn/ui components with Radix UI primitives",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            tokens: [
              {
                text: "Implement proper error boundaries and loading states",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            tokens: [{ text: "Optimize for Core Web Vitals", color: "#E4E4E4EB" }],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "## Component Structure:", color: "#D6D6DD", bold: true },
            ],
          },
          {
            tokens: [
              { text: "1.", color: "#E4E4E4AD" },
              { text: " Exports", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "2.", color: "#E4E4E4AD" },
              { text: " Types/Interfaces", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "3.", color: "#E4E4E4AD" },
              { text: " Server actions (if any)", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              { text: "4.", color: "#E4E4E4AD" },
              { text: " Component logic", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            tokens: [{ text: "@file apps/dashboard/tsconfig.json", color: "#E4E4E4EB" }],
          },
          {
            tokens: [{ text: "@file apps/dashboard/.env", color: "#E4E4E4EB" }],
          },
        ],
      },
    ],
    initialOpenFileIds: [".cursor/rules/next.mdc"],
    initialActiveFileId: ".cursor/rules/next.mdc",
  },

  biotech: {
    key: "biotech",
    title: "Bioinformatics Tools",
    timeAgo: "45m",
    sidebarSubtitle: "Bioinformatics Tools",
    sidebarDiff: { added: "+135", removed: "-21" },
    defaultMode: "agent",
    userPrompt:
      "Add affine gap alignment. We only have basic NW alignment but I need Gotoh's algorithm for better handling of indels. Also fix the FASTA parser.",
    steps: [
      { id: "bt1", kind: "thought", label: "Thought", detail: "5s" },
      {
        id: "bt2",
        kind: "read",
        label: "Read",
        detail: "bio/sequence_alignment.py, bio/fasta.py, bio/translate.py",
      },
      {
        id: "bt3",
        kind: "search",
        label: "Searched",
        detail: "for 'gotoh algorithm implementation python'",
      },
      {
        id: "bt4",
        kind: "assistant",
        text: "I'll add Gotoh's affine gap algorithm to your alignment module and fix the FASTA parser. Let me start with the alignment code:",
      },
      {
        id: "bt5",
        kind: "file",
        fileId: "bio/sequence_alignment.py",
        fileName: "bio/sequence_alignment.py",
        added: "+78",
        removed: "-10",
      },
      {
        id: "bt6",
        kind: "file",
        fileId: "test_alignment.py",
        fileName: "test_alignment.py",
        added: "+24",
        removed: "-2",
      },
      {
        id: "bt7",
        kind: "assistant",
        text: "Added Gotoh's algorithm with three matrices (M, X, Y) for affine gap penalties, cleaned up multi-line FASTA parsing, and added ORF discovery.",
      },
    ],
    files: [
      {
        id: "bio/sequence_alignment.py",
        tabLabel: "sequence_alignment.py",
        fullPath: "bio/sequence_alignment.py",
        kind: "code",
        lines: [
          {
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " typing ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " Tuple", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "MATCH_SCORE = ", color: "#E4E4E4EB" },
              { text: "2", color: "#EBC88D" },
            ],
          },
          {
            tokens: [
              { text: "MISMATCH_SCORE = -", color: "#E4E4E4EB" },
              { text: "1", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "GAP_OPEN = -", color: "#E4E4E4EB" },
              { text: "10", color: "#EBC88D" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "GAP_EXTEND = -", color: "#E4E4E4EB" },
              { text: "1", color: "#EBC88D" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: "def", color: "#82D2CE" },
              { text: " gotoh_align", color: "#EFB080" },
              { text: "(s: ", color: "#E4E4E4EB" },
              { text: "str", color: "#82D2CE" },
              { text: ", t: ", color: "#E4E4E4EB" },
              { text: "str", color: "#82D2CE" },
              { text: ") -> Tuple[", color: "#E4E4E4EB" },
              { text: "int", color: "#82D2CE" },
              { text: ", ", color: "#E4E4E4EB" },
              { text: "str", color: "#82D2CE" },
              { text: ", ", color: "#E4E4E4EB" },
              { text: "str", color: "#82D2CE" },
              { text: "]:", color: "#E4E4E4EB" },
            ],
          },
          {
            tokens: [
              {
                text: '    """Gotoh algorithm with affine gap penalties."""',
                color: "#E394DC",
              },
            ],
          },
          {
            tokens: [{ text: "    n, m = len(s), len(t)", color: "#E4E4E4EB" }],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "    M = [[float('-inf')] * (m + 1) for _ in range(n + 1)]",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "    X = [[float('-inf')] * (m + 1) for _ in range(n + 1)]",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "    Y = [[float('-inf')] * (m + 1) for _ in range(n + 1)]",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [{ text: "    M[0][0] = 0", color: "#E4E4E4EB" }],
          },
          {
            diff: "remove",
            tokens: [
              {
                text: "    match = dp[i-1][j-1] + (MATCH_SCORE if s[i-1] == t[j-1] else MISMATCH_SCORE)",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "    for i in range(1, n + 1):",
                color: "#83D6C5",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "        for j in range(1, m + 1):",
                color: "#83D6C5",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "            score = MATCH_SCORE if s[i-1] == t[j-1] else MISMATCH_SCORE",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            diff: "add",
            tokens: [
              {
                text: "            M[i][j] = score + max(M[i-1][j-1], X[i-1][j-1], Y[i-1][j-1])",
                color: "#E4E4E4EB",
              },
            ],
          },
          {
            tokens: [{ text: "    return M[n][m], s, t", color: "#83D6C5" }],
          },
        ],
      },
      {
        id: "test_alignment.py",
        tabLabel: "test_alignment.py",
        fullPath: "test_alignment.py",
        kind: "code",
        lines: [
          {
            tokens: [
              { text: "from", color: "#83D6C5" },
              { text: " bio.sequence_alignment ", color: "#E4E4E4EB" },
              { text: "import", color: "#83D6C5" },
              { text: " nw_align, gotoh_align", color: "#E4E4E4EB" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { text: 'seq1 = "AGTACGCA"', color: "#E394DC" },
            ],
          },
          {
            tokens: [
              { text: 'seq2 = "TATGC"', color: "#E394DC" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: "score, a1, a2 = gotoh_align(seq1, seq2)", color: "#E4E4E4EB" },
            ],
          },
          {
            diff: "add",
            tokens: [
              { text: 'print(f"Gotoh Affine Score: {score}")', color: "#E4E4E4EB" },
            ],
          },
        ],
      },
    ],
    initialOpenFileIds: ["bio/sequence_alignment.py", "test_alignment.py"],
    initialActiveFileId: "bio/sequence_alignment.py",
  },
};

const SCENARIO_ORDER: ScenarioKey[] = [
  "websiteBuilder",
  "productPlanning",
  "mlPython",
  "cursorRules",
  "biotech",
];

const AUTO_CYCLE_KEYS: ScenarioKey[] = ["websiteBuilder", "productPlanning"];

const IN_PROGRESS_SUBTITLES: Record<ScenarioKey, string> = {
  websiteBuilder: "Reading docs",
  productPlanning: "Generating plan",
  mlPython: "Overviewing scope",
  cursorRules: "Updating rules",
  biotech: "Running tests",
};

interface CursorIdeWindowProps {
  initialScenario?: ScenarioKey;
  showAgentsSidebar?: boolean;
  autoCycle?: boolean;
  onUserInteract?: () => void;
}

export function CursorIdeWindow({
  initialScenario = "websiteBuilder",
  showAgentsSidebar = true,
  autoCycle = false,
  onUserInteract,
}: CursorIdeWindowProps) {
  const [activeScenarioKey, setActiveScenarioKey] =
    useState<ScenarioKey>(initialScenario);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(autoCycle);
  const [visibleStepCount, setVisibleStepCount] = useState<number>(
    autoCycle ? 1 : SCENARIOS[initialScenario].steps.length
  );
  const [openFileIds, setOpenFileIds] = useState<string[]>(
    SCENARIOS[initialScenario].initialOpenFileIds
  );
  const [activeFileId, setActiveFileId] = useState<string>(
    SCENARIOS[initialScenario].initialActiveFileId
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    trigger: "keyboard",
  });
  const [questionsDismissed, setQuestionsDismissed] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [planBuilt, setPlanBuilt] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [customMessages, setCustomMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; text: string }>
  >([]);
  const [composerMode, setComposerMode] = useState<"agent" | "plan">(
    SCENARIOS[initialScenario].defaultMode
  );
  const [composerModel, setComposerModel] = useState("Grok 4.7");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const switchScenario = useCallback((key: ScenarioKey, fromUser = false) => {
    const cfg = SCENARIOS[key];
    setActiveScenarioKey(key);
    setOpenFileIds(cfg.initialOpenFileIds);
    setActiveFileId(cfg.initialActiveFileId);
    setComposerMode(cfg.defaultMode);
    setQuestionIndex(0);
    setQuestionsDismissed(false);
    setPlanBuilt(false);
    setCustomMessages([]);
    if (fromUser) {
      setHasInteracted(true);
      setIsStreaming(false);
      setVisibleStepCount(cfg.steps.length);
      onUserInteract?.();
    } else {
      setIsStreaming(true);
      setVisibleStepCount(1);
    }
  }, [onUserInteract]);

  useEffect(() => {
    if (!isStreaming) return;
    const totalSteps = SCENARIOS[activeScenarioKey].steps.length;
    if (visibleStepCount < totalSteps) {
      const stepTimer = window.setTimeout(() => {
        setVisibleStepCount((c) => Math.min(totalSteps, c + 1));
      }, 380);
      return () => window.clearTimeout(stepTimer);
    }
    const doneTimer = window.setTimeout(() => {
      setIsStreaming(false);
    }, 380);
    return () => window.clearTimeout(doneTimer);
  }, [isStreaming, visibleStepCount, activeScenarioKey]);

  useEffect(() => {
    if (!autoCycle || hasInteracted) return;
    const timer = window.setInterval(() => {
      setActiveScenarioKey((prev) => {
        const idx = AUTO_CYCLE_KEYS.indexOf(prev);
        const nextKey = AUTO_CYCLE_KEYS[(idx + 1) % AUTO_CYCLE_KEYS.length] ?? "websiteBuilder";
        const cfg = SCENARIOS[nextKey];
        setOpenFileIds(cfg.initialOpenFileIds);
        setActiveFileId(cfg.initialActiveFileId);
        setComposerMode(cfg.defaultMode);
        setQuestionIndex(0);
        setQuestionsDismissed(false);
        setIsStreaming(true);
        setVisibleStepCount(1);
        return nextKey;
      });
    }, 5200);
    return () => window.clearInterval(timer);
  }, [autoCycle, hasInteracted]);

  const scenario = SCENARIOS[activeScenarioKey];
  const visibleSteps = isStreaming
    ? scenario.steps.slice(0, visibleStepCount)
    : scenario.steps;
  const inProgressKeys = isStreaming ? [activeScenarioKey] : [];
  const readyKeys = isStreaming
    ? SCENARIO_ORDER.filter((k) => k !== activeScenarioKey)
    : SCENARIO_ORDER;
  const activeFile = useMemo(
    () =>
      scenario.files.find((f) => f.id === activeFileId) ?? scenario.files[0],
    [scenario, activeFileId]
  );

  const openFileTab = (fileId: string) => {
    setHasInteracted(true);
    onUserInteract?.();
    setOpenFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
    setActiveFileId(fileId);
  };

  const closeFileTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setHasInteracted(true);
    onUserInteract?.();
    if (openFileIds.length <= 1) return;
    const next = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(next);
    if (activeFileId === fileId && next[0]) {
      setActiveFileId(next[0]);
    }
  };

  const showTabsBar = !(
    activeScenarioKey === "websiteBuilder" && activeFile?.kind === "browser"
  );

  const currentQuestion = scenario.questions?.[questionIndex];

  const handleBuildClick = () => {
    setHasInteracted(true);
    onUserInteract?.();
    setPlanBuilt(true);
    setCheckedTasks({ 0: true, 1: true, 2: true });
    openFileTab("src/lib/collaboration/presence.ts");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setHasInteracted(true);
    onUserInteract?.();
    setChatInput("");
    setCustomMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
      {
        id: `a-${Date.now() + 1}`,
        role: "assistant",
        text: "On it — updating the implementation and running verification checks.",
      },
    ]);
  };

  return (
    <div
      className="h-full min-h-0 w-full overflow-hidden relative"
    >
      <div className="flex h-full w-full">
        {showAgentsSidebar && (
          <div
            className="border-theme-border-02 h-full max-w-[320px] min-w-[220px] border-r"
            style={{ flexGrow: 2, flexBasis: 0 }}
          >
            <aside className="bg-theme-card text-theme-text h-full w-full">
              <div className="pl-0">
                {inProgressKeys.length > 0 && (
                  <div className="py-1.25">
                    <div className="type-product-sm-medium text-theme-text-sec px-3 py-1 uppercase">
                      In Progress{" "}
                      <span className="text-theme-text/50">
                        {inProgressKeys.length}
                      </span>
                    </div>
                    <div>
                      {inProgressKeys.map((key) => {
                        const item = SCENARIOS[key];
                        const isSelected = key === activeScenarioKey;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => switchScenario(key, true)}
                            className="agent-sidebar__row type-product-base flex w-full items-start gap-2 border-0 px-3 py-2.5 text-left transition-colors cursor-pointer"
                            style={{
                              backgroundColor: isSelected
                                ? "var(--color-theme-card-hover-hex)"
                                : undefined,
                              paddingLeft: "calc(2px + 0.75rem)",
                              outline: "none",
                            }}
                          >
                            <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 256 256"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`animate-spin ${
                                  isSelected ? "" : "text-theme-text-sec"
                                }`}
                              >
                                <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" />
                              </svg>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-px">
                              <div className="flex items-start justify-between gap-2">
                                <div
                                  className={`truncate ${
                                    isSelected ? "" : "text-theme-text-sec"
                                  }`}
                                >
                                  {item.title}
                                </div>
                              </div>
                              <div
                                className={`type-product-sm flex items-center ${
                                  isSelected ? "text-theme-text-sec" : ""
                                }`}
                                style={
                                  isSelected
                                    ? undefined
                                    : {
                                        color:
                                          "var(--color-theme-product-text-tertiary)",
                                      }
                                }
                              >
                                <span className="min-w-0 flex-1 truncate">
                                  {IN_PROGRESS_SUBTITLES[key]}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="py-1.25">
                  <div className="type-product-sm-medium text-theme-text-sec px-3 py-1 uppercase">
                    Ready for Review{" "}
                    <span className="text-theme-text/50">
                      {readyKeys.length}
                    </span>
                  </div>
                  <div>
                    {readyKeys.map((key) => {
                      const item = SCENARIOS[key];
                      const isSelected = key === activeScenarioKey;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => switchScenario(key, true)}
                          className="agent-sidebar__row type-product-base flex w-full items-start gap-2 border-0 px-3 py-2.5 text-left transition-colors cursor-pointer"
                          style={{
                            backgroundColor: isSelected
                              ? "var(--color-theme-card-hover-hex)"
                              : undefined,
                            paddingLeft: "calc(2px + 0.75rem)",
                            outline: "none",
                          }}
                        >
                          <div className="flex h-4 w-4 items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              className={isSelected ? "" : "text-theme-text-sec"}
                            >
                              <path d="M8 13.9766C4.70117 13.9766 2.02344 11.2988 2.02344 8C2.02344 4.70117 4.70117 2.02344 8 2.02344C11.2988 2.02344 13.9766 4.70117 13.9766 8C13.9766 11.2988 11.2988 13.9766 8 13.9766ZM8 12.9805C10.7539 12.9805 12.9805 10.7539 12.9805 8C12.9805 5.24609 10.7539 3.01953 8 3.01953C5.24609 3.01953 3.01953 5.24609 3.01953 8C3.01953 10.7539 5.24609 12.9805 8 12.9805ZM7.35547 10.7832C7.16211 10.7832 7.00391 10.7012 6.85742 10.5078L5.42773 8.75C5.3457 8.63867 5.29297 8.51562 5.29297 8.38672C5.29297 8.12891 5.49219 7.92383 5.74414 7.92383C5.9082 7.92383 6.03711 7.9707 6.17773 8.1582L7.33203 9.65234L9.76367 5.75C9.875 5.58008 10.0215 5.48633 10.168 5.48633C10.4141 5.48633 10.6484 5.65625 10.6484 5.91992C10.6484 6.04883 10.5723 6.17773 10.5078 6.29492L7.83008 10.5078C7.71289 10.6895 7.54883 10.7832 7.35547 10.7832Z" />
                            </svg>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-px">
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={`truncate ${
                                  isSelected ? "" : "text-theme-text-sec"
                                }`}
                              >
                                {item.title}
                              </div>
                              <div
                                className="type-product-sm shrink-0"
                                style={{
                                  color: "var(--color-theme-product-text-tertiary)",
                                }}
                              >
                                {item.timeAgo}
                              </div>
                            </div>
                            <div
                              className={`type-product-sm flex items-center ${
                                isSelected ? "text-theme-text-sec" : ""
                              }`}
                              style={
                                isSelected
                                  ? undefined
                                  : {
                                      color:
                                        "var(--color-theme-product-text-tertiary)",
                                    }
                              }
                            >
                              <span className="flex min-w-0 items-center gap-1">
                                {item.sidebarDiff && (
                                  <>
                                    <span className="flex items-center gap-0.5 tabular-nums">
                                      <span className="text-theme-product-ansi-green">
                                        {item.sidebarDiff.added}
                                      </span>
                                      <span className="text-theme-product-ansi-red">
                                        {item.sidebarDiff.removed}
                                      </span>
                                    </span>
                                    <span>·</span>
                                  </>
                                )}
                                <span className="min-w-0 flex-1 truncate">
                                  {item.sidebarSubtitle}
                                </span>
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        <div
          className="flex h-full min-w-0 flex-1 flex-row-reverse"
          style={{ flexGrow: 10.5, flexBasis: 0 }}
        >
          {/* Right Editor / Preview Pane */}
          <div
            className="border-theme-border-02 min-w-[220px] overflow-hidden"
            style={{ flexGrow: 8, flexBasis: 0 }}
          >
            <div className="flex h-full w-full flex-col">
              {showTabsBar && (
                <div
                  className="text-theme-text/90 bg-theme-card no-scrollbar flex h-8 items-center gap-0 overflow-x-auto overflow-y-hidden text-sm"
                  role="tablist"
                >
                  {openFileIds.map((fid) => {
                    const f = scenario.files.find((file) => file.id === fid);
                    if (!f) return null;
                    const isTabActive = f.id === activeFile?.id;
                    return (
                      <div
                        key={f.id}
                        role="tab"
                        aria-selected={isTabActive}
                        onClick={() => openFileTab(f.id)}
                        className={
                          isTabActive
                            ? "group/tab border-theme-border-02 flex h-full cursor-pointer items-center gap-2 border-r bg-theme-product-editor text-theme-text after:bg-theme-product-editor relative pb-px after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px pr-2 pl-3"
                            : "group/tab border-theme-border-02 flex h-full cursor-pointer items-center gap-2 border-r bg-theme-product-chrome hover:bg-theme-card-hover-hex/40 border-b pr-2 pl-3"
                        }
                      >
                        <button
                          type="button"
                          className={`type-product-base flex h-full cursor-pointer items-center gap-1.5 truncate ${
                            isTabActive ? "" : "text-theme-product-text-sec"
                          }`}
                          title={f.fullPath}
                        >
                          {f.tabLabel}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => closeFileTab(e, f.id)}
                          className={`text-theme-text-sec hover:text-theme-text ml-1 flex h-full cursor-pointer items-center ${
                            isTabActive
                              ? "opacity-100"
                              : "opacity-0 group-hover/tab:opacity-100"
                          }`}
                          aria-label={`Close ${f.tabLabel}`}
                          title="Close tab"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-theme-text-sec hover:text-theme-text"
                          >
                            <path d="M2.8802 11.1191C2.69221 10.9365 2.69758 10.6249 2.8802 10.4423L6.3177 6.99946L2.8802 3.56196C2.69758 3.37934 2.69758 3.07319 2.8802 2.8852C3.06281 2.69184 3.37971 2.69721 3.56232 2.8852L6.99982 6.3227L10.4373 2.8852C10.6199 2.69721 10.9315 2.69721 11.1195 2.8852C11.3074 3.06782 11.3021 3.37934 11.1195 3.56196L7.68195 6.99946L11.1195 10.4423C11.3021 10.6249 11.3021 10.9311 11.1195 11.1191C10.9368 11.3071 10.6199 11.3017 10.4373 11.1191L6.99982 7.68159L3.56232 11.1191C3.37971 11.3017 3.06818 11.3017 2.8802 11.1191Z" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  <div className="border-theme-border-02 h-full flex-1 border-b" />
                </div>
              )}

              <div
                key={`${activeScenarioKey}-${activeFile?.id ?? "editor"}`}
                className="bg-theme-product-editor relative h-full w-full animate-[fadeSlideUp_200ms_ease-out_both]"
                role="tabpanel"
              >
                {activeFile?.kind === "browser" && (
                  <div className="bg-theme-product-editor absolute inset-0 flex flex-col">
                    <div className="bg-theme-card border-theme-border-02 flex h-8 items-center gap-1.5 border-b pr-3 pl-2">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          className="text-theme-text-sec hover:bg-theme-bg-hover flex h-7 w-7 items-center justify-center rounded"
                          disabled
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="text-theme-text-sec hover:bg-theme-bg-hover flex h-7 w-7 items-center justify-center rounded"
                          disabled
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="text-theme-text-sec hover:bg-theme-bg-hover flex h-7 w-7 items-center justify-center rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex h-7 flex-1 items-center gap-2 border-0 bg-transparent px-2">
                        <span className="text-theme-text type-product-base truncate">
                          http://localhost:3000
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openFileTab("app/page.tsx")}
                        title="View source code"
                        className="text-theme-text-sec hover:bg-theme-bg-hover flex h-7 w-7 items-center justify-center rounded cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="-scale-x-100"
                        >
                          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z" />
                        </svg>
                      </button>
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                      <div className="bg-theme-bg absolute inset-0 overflow-auto">
                        <div
                          className="cursor-preview relative flex h-full flex-col overflow-hidden px-6 py-8"
                          style={{
                            fontFamily:
                              "var(--font-serif), Iowan Old Style, Palatino Linotype, URW Palladio L, P052, ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
                          }}
                        >
                          <header className="pointer-events-auto mb-8 flex items-center">
                            <span
                              className="cursor-preview-brand"
                              style={{
                                fontWeight: 500,
                                fontStyle: "italic",
                                fontFeatureSettings: '"cswh"',
                                fontSize: "1.2rem",
                              }}
                            >
                              Acme Labs
                            </span>
                          </header>
                          <div className="max-w-[48ch] flex-1 text-[1.08rem] leading-[1.35]">
                            <p style={{ textIndent: "-0.1rem" }}>
                              Software creation is changing. We are a group of
                              researchers, engineers, and technologists inventing
                              at the edge of what&apos;s useful and possible.
                            </p>
                            <p className="mt-4">
                              <span>We have much to learn, try, and build.</span>
                            </p>
                            <div className="mt-5 flex items-center gap-4">
                              <button
                                type="button"
                                className="cursor-preview-cta pointer-events-auto px-3 py-1.5 transition-opacity hover:opacity-90"
                              >
                                See projects
                              </button>
                              <a
                                href="/careers"
                                className="cursor-preview-link pointer-events-auto inline-block underline"
                                style={{ textUnderlineOffset: "0.125em" }}
                              >
                                Join our team →
                              </a>
                            </div>
                            <table
                              className="pointer-events-auto mt-8 w-full"
                              style={{ borderCollapse: "collapse" }}
                            >
                              <tbody>
                                {[
                                  ["2026", "Secure codebase indexing", "Published"],
                                  ["2026", "Semantic search", "Published"],
                                  ["2025", "Reinforcement learning", "Published"],
                                  ["2024", "Shadow workspaces", "Published"],
                                  ["2024", "Multi-agent collaboration", "Published"],
                                  ["2023", "Context-aware completions", "Published"],
                                  ["2023", "Intelligent code navigation", "Published"],
                                  ["2022", "Fast inference optimization", "Published"],
                                  ["2022", "Language model fine-tuning", "Published"],
                                ].map(([yr, proj, st]) => (
                                  <tr
                                    key={proj}
                                    className="cursor-preview-table-row pointer-events-auto"
                                  >
                                    <td className="py-2 pr-4 opacity-70">{yr}</td>
                                    <td className="py-2 pr-4">{proj}</td>
                                    <td className="py-2 opacity-70">{st}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="selection-overlay absolute inset-0">
                              <div
                                className="selection-box absolute"
                                style={{
                                  top: "88.8047px",
                                  left: "20px",
                                  width: "406.125px",
                                  height: "77.9844px",
                                  transition: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                                  border: "2px solid rgba(139, 196, 248, 0.2)",
                                  backgroundColor: "rgba(139, 196, 248, 0.08)",
                                }}
                              />
                              <div
                                className="selection-tooltip absolute px-1.5 py-0.5 text-[11px] whitespace-nowrap"
                                style={{
                                  top: "68.8047px",
                                  left: "20px",
                                  backgroundColor: "#253545",
                                  color: "#8BC4F8",
                                  fontFamily:
                                    "var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                                }}
                              >
                                <span className="font-medium">IntroParagraph</span>
                                <span className="font-normal"> · p</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFile?.kind === "plan" && (
                  <div className="bg-theme-product-editor absolute inset-0 flex flex-col">
                    <div className="bg-theme-product-editor relative z-10 flex-shrink-0 transition-[border-color] duration-150 border-b border-transparent">
                      <div className="type-product-base flex h-8 items-center justify-between pr-2 pl-3">
                        <div className="text-theme-text-sec flex items-center gap-0.5 text-xs">
                          <span className="text-theme-text-sec">Plans</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                            className="text-theme-text-sec"
                          >
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                          </svg>
                          <span className="text-theme-text">feature-prd.md</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="text-theme-text-sec hover:bg-theme-bg-hover flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs"
                          >
                            <span>{composerModel}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                            >
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={handleBuildClick}
                            className="cursor-pointer rounded px-2 py-0.5 text-xs font-medium text-white hover:brightness-110"
                            style={{ backgroundColor: "rgb(192, 133, 50)" }}
                          >
                            {planBuilt ? "Built ✓" : "Build"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div
                        className="type-product-base mx-auto max-w-2xl px-4 lg:px-16 pt-5 pb-6"
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.55,
                        }}
                      >
                        <h2 className="text-theme-text mt-0 mb-1 text-[20px] font-bold">
                          Mission Control Interface
                        </h2>
                        <div className="h-1" />
                        <p className="text-theme-text my-0.5">
                          A grid view of all open windows as scaled previews,
                          allowing quick selection to bring any window to front.
                        </p>
                        <div className="h-1" />
                        <h2 className="text-theme-text mt-2 mb-0.5 text-[14px] font-semibold">
                          Trigger
                        </h2>
                        <p className="text-theme-text my-0.5">
                          Menu item in MenuBar.tsx (View &gt; Mission Control),
                          hotkey F3, or double-tap desktop.
                        </p>
                        <div className="h-1" />
                        <h2 className="text-theme-text mt-2 mb-0.5 text-[14px] font-semibold">
                          View Behavior
                        </h2>
                        <p className="text-theme-text my-0.5">
                          Overlay existing windows into a grid of live previews
                          with spring-based layout animations and shared element
                          transitions.
                        </p>
                        <div className="h-1" />
                        <div className="mt-4">
                          <div className="text-theme-text-sec mb-2 text-[13px]">
                            <span>3 Tasks</span>
                          </div>
                          <div className="border-theme-border-02 mb-3 h-0.5 w-full overflow-hidden rounded-full border-b" />
                          <div className="space-y-2">
                            {[
                              "Add multiplayer mode to useAppStore.ts",
                              "Create a new MissionControlView.tsx component",
                              "Update AppManager.tsx to apply expose modes.",
                            ].map((taskText, idx) => {
                              const checked = !!checkedTasks[idx];
                              return (
                                <div
                                  key={taskText}
                                  onClick={() =>
                                    setCheckedTasks((prev) => ({
                                      ...prev,
                                      [idx]: !prev[idx],
                                    }))
                                  }
                                  className="flex cursor-pointer items-center gap-2"
                                >
                                  <div
                                    className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border ${
                                      checked
                                        ? "border-theme-product-ansi-green bg-theme-product-ansi-green text-white"
                                        : "border-theme-text/20"
                                    }`}
                                  >
                                    {checked && (
                                      <span className="text-[9px] leading-none">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={`text-theme-text ${
                                      checked ? "line-through opacity-60" : ""
                                    }`}
                                  >
                                    {taskText}
                                  </span>
                                </div>
                              );
                            })}
                            <div className="flex items-center gap-2 opacity-40">
                              <div className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border-theme-text/20 border" />
                              <span className="text-theme-text-ter">
                                Add a task, ⌘K to generate...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFile?.kind === "code" && (
                  <div className="type-product-base-mono absolute inset-0 box-border min-h-full overflow-auto pt-2 pl-2 ring-0 outline-none">
                    <pre
                      className="shiki cursor-dark has-diff"
                      style={{
                        backgroundColor: "transparent",
                        color: "#E4E4E4EB",
                      }}
                    >
                      <code>
                        {activeFile.lines?.map((line, lIdx) => (
                          <React.Fragment key={lIdx}>
                            <span
                              className={`line${
                                line.diff === "add"
                                  ? " diff-add"
                                  : line.diff === "remove"
                                  ? " diff-remove"
                                  : ""
                              }`}
                            >
                              {line.tokens.map((tok, tIdx) => (
                                <span
                                  key={tIdx}
                                  style={{
                                    color: tok.color ?? "#E4E4E4EB",
                                    fontWeight: tok.bold ? "bold" : undefined,
                                    fontStyle: tok.italic ? "italic" : undefined,
                                  }}
                                >
                                  {tok.text}
                                </span>
                              ))}
                            </span>
                            {"\n"}
                          </React.Fragment>
                        ))}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Chat Pane */}
          <div
            className="border-theme-border-02 min-w-[320px] max-w-[380px] border-r"
            style={{ flexGrow: 2.5, flexBasis: 0 }}
          >
            <div className="bg-theme-product-chrome flex h-full w-full flex-col">
              <div className="text-theme-text type-product-base-medium flex h-8 items-center px-3 pt-2">
                <div className="mx-auto w-full max-w-[580px] truncate">
                  {scenario.title}
                </div>
              </div>
              <div
                key={activeScenarioKey}
                className="thin-scrollbar flex-1 overflow-auto overscroll-y-auto px-3 pt-0 animate-[fadeSlideUp_200ms_ease-out_both]"
              >
                <div className="mx-auto w-full max-w-[580px]">
                  <div className="sticky top-0 z-10">
                    <div className="bg-theme-product-chrome">
                      <div
                        className="bg-theme-product-editor border-theme-border-02 text-theme-text type-product-base ml-auto w-full rounded-lg border px-2 py-1.5 break-words whitespace-pre-wrap"
                        style={{ fontSize: "13px" }}
                      >
                        {scenario.userPrompt}
                      </div>
                    </div>
                    <div className="from-theme-product-chrome pointer-events-none h-2 bg-gradient-to-b to-transparent" />
                  </div>

                  {visibleSteps.map((step) => {
                    if (
                      step.kind === "thought" ||
                      step.kind === "read" ||
                      step.kind === "search"
                    ) {
                      return (
                        <div
                          key={step.id}
                          className="w-full animate-[fadeSlideUp_180ms_ease-out_both]"
                        >
                          <div className="rounded-lg w-full px-1 py-1">
                            <div
                              className="type-product-base text-theme-text-sec flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              <div className="flex items-baseline gap-1 overflow-hidden">
                                <span className="text-theme-text-sec flex-shrink-0">
                                  {step.label}
                                </span>
                                <span className="text-theme-text-sec min-w-0 truncate opacity-60">
                                  {step.detail}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (step.kind === "file") {
                      return (
                        <div
                          key={step.id}
                          className="w-full animate-[fadeSlideUp_180ms_ease-out_both]"
                        >
                          <div
                            onClick={() =>
                              step.fileId && openFileTab(step.fileId)
                            }
                            className="rounded-lg bg-theme-product-editor border-theme-border-02 mt-1 mb-1 cursor-pointer rounded border p-2 hover:border-theme-border-03 transition-colors"
                          >
                            <div
                              className="flex items-center gap-1.5"
                              title={`Open ${step.fileName}`}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-theme-text-sec"
                              >
                                <path d="M4.14746 12.7578C3.03564 12.7578 2.48242 12.1992 2.48242 11.0767V2.92871C2.48242 1.81152 3.04102 1.24219 4.14746 1.24219H6.69873C7.30029 1.24219 7.63867 1.3335 8.04688 1.75244L11.0063 4.76562C11.436 5.20605 11.5166 5.50684 11.5166 6.19971V11.0767C11.5166 12.1938 10.9634 12.7578 9.85156 12.7578H4.14746ZM4.18506 11.8931H9.80859C10.3672 11.8931 10.6519 11.5977 10.6519 11.0605V6.2373H7.59033C6.91895 6.2373 6.58057 5.9043 6.58057 5.22754V2.10693H4.19043C3.63184 2.10693 3.34717 2.41309 3.34717 2.94482V11.0605C3.34717 11.5977 3.63184 11.8931 4.18506 11.8931ZM7.68701 5.42627H10.4854L7.3916 2.27344V5.12549C7.3916 5.34033 7.47217 5.42627 7.68701 5.42627Z" />
                              </svg>
                              <span className="text-theme-text type-product-base">
                                <span className="font-medium">
                                  {step.fileName}
                                </span>
                                {step.added && (
                                  <span className="text-theme-product-ansi-green ml-1.5">
                                    {step.added}
                                  </span>
                                )}
                                {step.removed && (
                                  <span className="text-theme-product-ansi-red ml-0.5">
                                    {step.removed}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={step.id}
                        className="w-full animate-[fadeSlideUp_180ms_ease-out_both]"
                      >
                        <div className="rounded-lg w-full px-1 py-2">
                          <div
                            className="type-product-base text-theme-text whitespace-pre-wrap"
                            style={{ fontSize: "13px" }}
                          >
                            <div className="min-h-[1.5em]">
                              {step.text?.split(/(`[^`]+`)/g).map((part, idx) =>
                                part.startsWith("`") && part.endsWith("`") ? (
                                  <code
                                    key={idx}
                                    className="bg-theme-card-04-hex type-product-base-mono text-theme-text rounded-2xs px-0.5"
                                  >
                                    {part.slice(1, -1)}
                                  </code>
                                ) : (
                                  <React.Fragment key={idx}>{part}</React.Fragment>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {customMessages.map((msg) => (
                    <div key={msg.id} className="w-full mt-1.5">
                      {msg.role === "user" ? (
                        <div
                          className="bg-theme-product-editor border-theme-border-02 text-theme-text type-product-base ml-auto w-full rounded-lg border px-2 py-1.5"
                          style={{ fontSize: "13px" }}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className="type-product-base text-theme-text px-1 py-1.5"
                          style={{ fontSize: "13px" }}
                        >
                          {msg.text}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="from-theme-product-chrome pointer-events-none sticky bottom-0 z-20 h-2 bg-gradient-to-t to-transparent" />
                </div>
              </div>

              {/* Interactive Questions Card for Plan Mission Control */}
              {currentQuestion && !questionsDismissed && (
                <div className="relative z-10 mt-2 mb-2 px-3">
                  <div className="mx-auto w-full max-w-[580px]">
                    <div className="grid w-full">
                      <div className="bg-theme-product-editor border-theme-border-02 rounded-lg border">
                        <div className="flex items-center justify-between pt-1.5 pr-1.5 pb-0 pl-1">
                          <div className="text-theme-text-sec type-product-sm flex items-center px-1">
                            <span>
                              Questions ({questionIndex + 1}/
                              {scenario.questions?.length ?? 1})
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={questionIndex === 0}
                              onClick={() =>
                                setQuestionIndex((q) => Math.max(0, q - 1))
                              }
                              className="text-theme-text-sec hover:text-theme-text cursor-pointer p-0.5 disabled:cursor-default disabled:opacity-30"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                              >
                                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              disabled={
                                questionIndex >=
                                (scenario.questions?.length ?? 1) - 1
                              }
                              onClick={() =>
                                setQuestionIndex((q) =>
                                  Math.min(
                                    (scenario.questions?.length ?? 1) - 1,
                                    q + 1
                                  )
                                )
                              }
                              className="text-theme-text-sec hover:text-theme-text cursor-pointer p-0.5 disabled:cursor-default disabled:opacity-30"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                              >
                                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="pt-1 pr-2 pb-2 pl-2">
                          <div className="text-theme-text type-product-base mb-2 font-medium">
                            {currentQuestion.prompt}
                          </div>
                          <div className="space-y-0.5">
                            {currentQuestion.options.map((opt, oIdx) => {
                              const isOptSelected =
                                selectedAnswers[currentQuestion.id] === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedAnswers((prev) => ({
                                      ...prev,
                                      [currentQuestion.id]: opt.id,
                                    }))
                                  }
                                  className={`flex w-full cursor-pointer items-center gap-2 rounded py-1 pr-1.5 pl-0 text-left transition-colors ${
                                    isOptSelected
                                      ? "bg-theme-card-hover-hex text-theme-text"
                                      : "text-theme-text-sec hover:bg-theme-bg-hover hover:text-theme-text"
                                  }`}
                                >
                                  <span
                                    className={`type-product-sm flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded border text-[11px] ${
                                      isOptSelected
                                        ? "border-[#C08532] text-[#C08532]"
                                        : "border-theme-border-02"
                                    }`}
                                  >
                                    {oIdx + 1}
                                  </span>
                                  <span className="type-product-base">
                                    {opt.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-1.5 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  questionIndex <
                                  (scenario.questions?.length ?? 1) - 1
                                ) {
                                  setQuestionIndex((q) => q + 1);
                                } else {
                                  setQuestionsDismissed(true);
                                }
                              }}
                              className="text-theme-text-sec hover:text-theme-text type-product-base flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs"
                            >
                              Skip
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  questionIndex <
                                  (scenario.questions?.length ?? 1) - 1
                                ) {
                                  setQuestionIndex((q) => q + 1);
                                } else {
                                  setQuestionsDismissed(true);
                                }
                              }}
                              className="type-product-base-medium flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs text-white hover:brightness-110"
                              style={{ backgroundColor: "rgb(192, 133, 50)" }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Composer */}
              <div className="bg-theme-product-chrome relative z-20 p-3 pt-0">
                <div className="mx-auto w-full max-w-[580px]">
                  <div className="overflow-hidden rounded-lg border border-theme-border-02 bg-theme-product-editor focus-within:border-theme-primary">
                    <form className="flex flex-col" onSubmit={handleChatSubmit}>
                      <input
                        type="text"
                        name="message"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={
                          composerMode === "plan"
                            ? "Add follow-up..."
                            : "Plan, search, build anything..."
                        }
                        className="text-theme-text type-product-base w-full bg-transparent px-2 pt-2 pb-1.5 outline-none"
                        style={{ fontSize: "13px" }}
                      />
                      <div className="px-2 py-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setComposerMode((m) =>
                                  m === "plan" ? "agent" : "plan"
                                )
                              }
                              className={`type-product-sm flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.75 ${
                                composerMode === "plan"
                                  ? ""
                                  : "bg-theme-card-03-hex text-theme-text-sec hover:text-theme-text"
                              }`}
                              style={
                                composerMode === "plan"
                                  ? {
                                      backgroundColor: "rgba(192, 133, 50, 0.15)",
                                      color: "rgb(192, 133, 50)",
                                    }
                                  : undefined
                              }
                            >
                              {composerMode === "plan" ? (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 21.1172 18.6211"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M10.875 15.4453L19.9102 15.4453C20.3789 15.4453 20.7656 15.0703 20.7656 14.6016C20.7656 14.1328 20.3789 13.7578 19.9102 13.7578L10.875 13.7578C10.4062 13.7578 10.0312 14.1328 10.0312 14.6016C10.0312 15.0703 10.4062 15.4453 10.875 15.4453Z" />
                                  <path d="M4.01953 18.6211C6.19922 18.6211 8.01562 16.7812 8.01562 14.6016C8.01562 12.4102 6.19922 10.582 4.01953 10.582C1.81641 10.582 0 12.4102 0 14.6016C0 16.7812 1.82812 18.6211 4.01953 18.6211ZM4.01953 17.0977C2.66016 17.0977 1.52344 15.9492 1.52344 14.6016C1.52344 13.2539 2.67188 12.1055 4.01953 12.1055C5.35547 12.1055 6.49219 13.2539 6.49219 14.6016C6.49219 15.9492 5.35547 17.0977 4.01953 17.0977Z" />
                                  <path d="M10.875 4.89844L19.9102 4.89844C20.3789 4.89844 20.7656 4.52344 20.7656 4.05469C20.7656 3.58594 20.3789 3.21094 19.9102 3.21094L10.875 3.21094C10.4062 3.21094 10.0312 3.58594 10.0312 4.05469C10.0312 4.52344 10.4062 4.89844 10.875 4.89844Z" />
                                  <path d="M4.01953 8.0625C6.19922 8.0625 8.01562 6.22266 8.01562 4.04297C8.01562 1.85156 6.19922 0.0351562 4.01953 0.0351562C1.81641 0.0351562 0 1.85156 0 4.04297C0 6.22266 1.82812 8.0625 4.01953 8.0625ZM4.01953 6.53906C2.66016 6.53906 1.52344 5.39062 1.52344 4.04297C1.52344 2.69531 2.67188 1.54688 4.01953 1.54688C5.35547 1.54688 6.49219 2.69531 6.49219 4.04297C6.49219 5.39062 5.35547 6.53906 4.01953 6.53906Z" />
                                </svg>
                              ) : (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24.7969 11.3555"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="opacity-60"
                                >
                                  <path d="M0 5.67188C0 9.11719 2.13281 11.3438 5.30859 11.3438C6.98438 11.3438 8.41406 10.6406 9.9375 9.17578L12.2227 6.96094L14.5078 9.17578C16.0312 10.6406 17.4609 11.3438 19.1367 11.3438C22.3125 11.3438 24.4453 9.11719 24.4453 5.67188C24.4453 2.22656 22.3125 0 19.1367 0C17.4609 0 16.0312 0.703125 14.5078 2.16797L12.2227 4.38281L9.9375 2.16797C8.41406 0.703125 6.98438 0 5.30859 0C2.13281 0 0 2.22656 0 5.67188ZM1.91016 5.67188C1.91016 3.36328 3.28125 1.91016 5.30859 1.91016C6.44531 1.91016 7.45312 2.44922 8.60156 3.52734L10.8867 5.67188L8.60156 7.81641C7.45312 8.89453 6.44531 9.43359 5.30859 9.43359C3.28125 9.43359 1.91016 7.98047 1.91016 5.67188ZM13.5586 5.67188L15.8438 3.52734C16.9922 2.44922 18 1.91016 19.1367 1.91016C21.1641 1.91016 22.5352 3.36328 22.5352 5.67188C22.5352 7.98047 21.1641 9.43359 19.1367 9.43359C18 9.43359 16.9922 8.89453 15.8438 7.81641Z" />
                                </svg>
                              )}
                              <span>
                                {composerMode === "plan" ? "Plan" : "Agent"}
                              </span>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 opacity-60"
                              >
                                <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                              </svg>
                            </button>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowModelDropdown((prev) => !prev)
                                }
                                className="text-theme-text-sec hover:text-theme-text type-product-sm flex cursor-pointer items-center gap-0.5 rounded-md bg-transparent py-0.75"
                              >
                                <span>{composerModel}</span>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 opacity-60"
                                >
                                  <path d="M7.00342 9.62646C6.86377 9.62646 6.74023 9.57275 6.63818 9.4707L2.48096 5.2168C2.38965 5.12012 2.33594 5.00195 2.33594 4.86768C2.33594 4.58838 2.54541 4.37354 2.82471 4.37354C2.96436 4.37354 3.08789 4.42725 3.17383 4.51318L7.00342 8.42334L10.8276 4.51318C10.9189 4.42725 11.0425 4.37354 11.1768 4.37354C11.4561 4.37354 11.6655 4.58838 11.6655 4.86768C11.6655 5.00195 11.6118 5.12012 11.5205 5.21143L7.36328 9.4707C7.27197 9.57275 7.1377 9.62646 7.00342 9.62646Z" />
                                </svg>
                              </button>
                              {showModelDropdown && (
                                <div
                                  className="bg-theme-card-hex absolute bottom-full left-0 z-50 mb-1 min-w-[160px] rounded-md p-1"
                                  style={{
                                    boxShadow:
                                      "var(--shadow-outline-theme), 0 18px 36px -18px rgba(0,0,0,0.28)",
                                  }}
                                >
                                  {[
                                    "Grok 4.7",
                                    "Opus 5.5",
                                    "GPT-5.6 Sol",
                                    "Fable 5.1",
                                    "Gemini 3.1 Pro",
                                    "Composer 2.5",
                                  ].map((m) => (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => {
                                        setComposerModel(m);
                                        setShowModelDropdown(false);
                                      }}
                                      className="type-product-base hover:bg-theme-card-hover-hex flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-theme-text"
                                    >
                                      <span>{m}</span>
                                      {composerModel === m && <span>✓</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            aria-label="Send message"
                            type="submit"
                            disabled={!chatInput.trim()}
                            className="flex h-5 w-5 items-center justify-center rounded-full transition-all duration-150 bg-theme-card-04-hex text-theme-text-sec enabled:bg-theme-button-bg enabled:text-theme-button-text enabled:cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                            >
                              <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
