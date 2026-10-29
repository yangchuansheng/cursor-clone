"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AvatarShape = "blob" | "wedge" | "gem";

interface RoutineItem {
  id: string;
  name: string;
  triggerDescription: string;
}

interface TranscriptEntry {
  id: string;
  kind: "system" | "user" | "agent" | "computer-use";
  timestampLabel?: string;
  content?: string;
  authorName?: string;
  reactions?: string[];
  systemLead?: string;
  systemTarget?: string;
  systemIcon?: "clock";
  systemSources?: Array<{ name: string; id: string }>;
  computerInstruction?: string;
  computerStatus?: "done" | "working" | "action-needed";
}

interface GrokAgent {
  id: string;
  name: string;
  title?: string;
  description: string;
  shape: AvatarShape;
  coatHex: string;
  accentLight: string;
  accentDark: string;
  pillBgDark: string;
  pillFgDark: string;
  timeLabel: string;
  lastPreview: string;
  unreadCount?: number;
  isGroup?: boolean;
  routines: RoutineItem[];
  transcript: TranscriptEntry[];
}

const GROK_AGENTS: GrokAgent[] = [
  {
    id: "chief-of-staff",
    name: "Chief",
    title: "Right hand",
    description:
      "Runs your day: triages asks, preps decisions, and keeps the rest of the team pointed at what matters.",
    shape: "blob",
    coatHex: "#54B9A6",
    accentLight: "#00707c",
    accentDark: "#01b6c3",
    pillBgDark: "color-mix(in srgb, #54B9A6 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #54B9A6 82%, #ffffff)",
    timeLabel: "1:10",
    lastPreview: "booked the venue and sent the confirmation around.",
    routines: [
      {
        id: "chief-auto-1",
        name: "Morning briefing",
        triggerDescription: "Weekdays at 8:00 AM",
      },
      {
        id: "chief-auto-2",
        name: "End-of-week recap",
        triggerDescription: "Fridays at 5:00 PM",
      },
    ],
    transcript: [
      {
        id: "chief-1",
        kind: "system",
        timestampLabel: "Oct 20, 9:10 AM",
        systemLead: "Created routine",
        systemTarget: "Morning briefing",
        systemIcon: "clock",
      },
      {
        id: "chief-2",
        kind: "agent",
        timestampLabel: "Yesterday 9:10 AM",
        content:
          "morning briefing:\n✓ **Calendar** → 2pm double-booking resolved · board review kept\n✓ **Deck** → numbers checked against finance's sheet · 2 stale slides flagged\n✓ **Offsite** → 3 venues shortlisted · dates held on each\n\ntwo things need you today: the deck review at 2pm, and a yes/no on the venue. everything else is handled.",
      },
      {
        id: "chief-3",
        kind: "user",
        timestampLabel: "Yesterday 12:10 PM",
        content: "take the venue, i'll do the deck",
      },
      {
        id: "chief-4",
        kind: "agent",
        content:
          "the marina house is the pick: seats all 40, the mid-week rate came in 15% under budget, and they'll hold the date until tomorrow.",
      },
      {
        id: "chief-5",
        kind: "user",
        content: "book it",
        reactions: ["👍"],
      },
      {
        id: "chief-6",
        kind: "agent",
        content:
          "✓ **Venue** → marina house booked · deposit paid\n✓ **Calendar** → invites updated for all 40\n✓ **Holds** → other two released with a thank-you",
      },
      {
        id: "chief-7",
        kind: "agent",
        content:
          "booked the venue and sent the confirmation around. you're clear until the 2pm deck review.",
      },
    ],
  },
  {
    id: "sales-outbound",
    name: "Sales Outbound",
    title: "Sales",
    description:
      "Works the pipeline overnight: researches the prospects worth a look, pulls their context together, and leaves sequences drafted for the morning.",
    shape: "blob",
    coatHex: "#F19D38",
    accentLight: "#885a07",
    accentDark: "#db941e",
    pillBgDark: "color-mix(in srgb, #F19D38 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #F19D38 82%, #ffffff)",
    timeLabel: "9:09 AM",
    lastPreview: "Done.",
    routines: [
      {
        id: "outbound-auto-1",
        name: "Overnight outbound",
        triggerDescription: "Sundays at 11:00 PM",
      },
    ],
    transcript: [
      {
        id: "so-1",
        kind: "agent",
        timestampLabel: "9:02 AM",
        content:
          "Hey Armand, good to meet you. What do you want me around for? Anything concrete, or more of a general sidekick?",
      },
      {
        id: "so-3",
        kind: "user",
        content:
          "Overnight pipeline generation and outbound.\n\nPick eligible prospects from this Google Sheet, research them on the web, grab context on contacts and accounts from Hex, Sumble, and Salesforce. Draft email and LinkedIn sequences in my voice.",
      },
      {
        id: "so-rename",
        kind: "system",
        systemLead: "Renamed to",
        systemTarget: "Sales Outbound",
      },
      {
        id: "so-4",
        kind: "agent",
        content:
          "Checking what's connected. Hex, Gmail, and LinkedIn are already signed in. Salesforce isn't.",
      },
      {
        id: "so-5",
        kind: "computer-use",
        computerInstruction:
          "Sign in to Salesforce so I can see the accounts you own.",
        computerStatus: "done",
      },
      {
        id: "so-6",
        kind: "agent",
        content:
          "✓ **Salesforce** → list pulled · 52 accounts\n✓ **Hex** → 3 lookalike segments pulled\n✓ **LinkedIn** → 4 profiles skipped · recently contacted\n✓ **Sequencer** → 36 drafts queued · 0 sent",
      },
      {
        id: "so-7",
        kind: "system",
        systemLead: "Messages from",
        systemSources: [
          { name: "Account Manager", id: "account-manager" },
          { name: "Chief", id: "chief-of-staff" },
        ],
      },
      {
        id: "so-8",
        kind: "agent",
        content:
          "@[Account Manager] sent over the Acme + Globex threads and @[Chief] flagged the priority accounts. Both are folded into tonight's list.",
      },
      {
        id: "so-9",
        kind: "agent",
        content:
          "The 36 drafts are sitting in the LinkedIn queue on my screen: recipient, opener, and a Draft badge on each. Nothing goes out until you've had a look.",
      },
      {
        id: "so-10",
        kind: "user",
        content: "The top 10 look good. Send it. Run this every week.",
        reactions: ["👍"],
      },
      {
        id: "so-11",
        kind: "system",
        systemLead: "Created routine",
        systemTarget: "Overnight outbound",
        systemIcon: "clock",
      },
      {
        id: "so-12",
        kind: "agent",
        content: "Done.",
      },
    ],
  },
  {
    id: "inbox-manager",
    name: "Inbox Manager",
    title: "Email triage",
    description:
      "Keeps the inbox at zero: archives noise, drafts replies, and flags real fires.",
    shape: "wedge",
    coatHex: "#EA4045",
    accentLight: "#aa122e",
    accentDark: "#fd5c6a",
    pillBgDark: "color-mix(in srgb, #EA4045 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #EA4045 82%, #ffffff)",
    timeLabel: "6:10 AM",
    lastPreview: "sent. inbox at zero, 5 drafts parked for tomorrow.",
    unreadCount: 1,
    routines: [],
    transcript: [
      {
        id: "inbox-1",
        kind: "user",
        timestampLabel: "5:10 AM",
        content: "inbox got away from me over the weekend, sweep it?",
      },
      {
        id: "inbox-2",
        kind: "agent",
        content:
          "on it. **41 unread** since friday. archiving the noise, drafting the rest.",
      },
      {
        id: "inbox-3",
        kind: "agent",
        timestampLabel: "6:10 AM",
        content:
          "✓ **Archived** → 26 newsletters + receipts\n✓ **Replied** → 9 routine threads · scheduling and intros\n✓ **Drafted** → 6 that sound like you · held for your read\n✓ **Flagged** → 1 from dana · contract question",
      },
      {
        id: "inbox-4",
        kind: "agent",
        content:
          "dana's asking whether the renewal covers the new seats. her draft answers yes and quotes the contract line. it's at the top of the held pile.",
      },
      {
        id: "inbox-5",
        kind: "user",
        content: "send dana's, i'll take the rest tomorrow",
        reactions: ["👍"],
      },
      {
        id: "inbox-6",
        kind: "agent",
        content: "sent. inbox is at **zero**, with 5 drafts parked for tomorrow.",
      },
    ],
  },
  {
    id: "account-manager",
    name: "Account Manager",
    title: "Named accounts",
    description:
      "Owns the named accounts: keeps the threads warm and knows what each one is waiting on.",
    shape: "gem",
    coatHex: "#3C82F6",
    accentLight: "#056098",
    accentDark: "#2da0f5",
    pillBgDark: "color-mix(in srgb, #3C82F6 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #3C82F6 82%, #ffffff)",
    timeLabel: "4:10 AM",
    lastPreview: "invite's out to vicky. globex note held in drafts.",
    routines: [],
    transcript: [
      {
        id: "account-1",
        kind: "user",
        timestampLabel: "3:10 AM",
        content: "where are we with acme? renewal can't sneak up on us",
      },
      {
        id: "account-2",
        kind: "agent",
        content: "pulling usage, open threads, and the exec notes together now.",
      },
      {
        id: "account-3",
        kind: "agent",
        timestampLabel: "4:10 AM",
        content:
          "**acme** renews in 60 days:\n✓ **Usage** → 214 seats active · up 18% this quarter\n✓ **Threads** → 2 open · security review + a pricing question\n✓ **Next step** → renewal call with vicky drafted · week of the 18th",
      },
      {
        id: "account-4",
        kind: "agent",
        content:
          "globex is the quiet one: nothing since the pilot wrapped. i wrote a re-engagement note that leads with their own pilot numbers. it's in drafts, not sent.",
      },
      {
        id: "account-5",
        kind: "user",
        content: "send the acme invite. hold globex until i've read the note",
        reactions: ["👍"],
      },
      {
        id: "account-6",
        kind: "system",
        systemLead: "Memory updated",
      },
      {
        id: "account-7",
        kind: "agent",
        content:
          "invite's out to vicky. the globex note is holding in drafts, and quiet-account sends wait for your read from now on.",
      },
    ],
  },
  {
    id: "talent-scout",
    name: "Talent Scout",
    title: "Sourcing",
    description:
      "Keeps the candidate pipeline moving: sources profiles, drafts intros, and shortlists who's worth a call.",
    shape: "blob",
    coatHex: "#5BC67A",
    accentLight: "#00712e",
    accentDark: "#2cb663",
    pillBgDark: "color-mix(in srgb, #5BC67A 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #5BC67A 82%, #ffffff)",
    timeLabel: "1:10 AM",
    lastPreview: "3 intros drafted in your voice, held for your ok.",
    routines: [],
    transcript: [
      {
        id: "talent-1",
        kind: "user",
        timestampLabel: "Yesterday 9:10 AM",
        content:
          "take the platform engineer req: senior, infra-heavy, remote ok. source quietly.",
      },
      {
        id: "talent-2",
        kind: "agent",
        content:
          "on it. i'll screen overnight against the req and skip anyone already in the ats.",
      },
      {
        id: "talent-3",
        kind: "agent",
        timestampLabel: "12:10 AM",
        content:
          "overnight run:\n✓ **Sourced** → 64 profiles matched the req\n✓ **Skipped** → 11 already in the ats\n✓ **Shortlist** → 12 screened · notes on each",
      },
      {
        id: "talent-4",
        kind: "agent",
        content:
          "three worth your time first:\n**Mara Iyer** → scaled ingest 40× at a data startup · writes like an owner\n**Tomás Rivera** → runs a 6-person infra team · wants to build again\n**Grace Osei** → your exact stack end to end · shipped the migration you keep citing",
      },
      {
        id: "talent-5",
        kind: "user",
        timestampLabel: "1:10 AM",
        content: "strong list, mara especially. draft the intros",
        reactions: ["👍"],
      },
      {
        id: "talent-6",
        kind: "agent",
        content:
          "3 intros drafted in your voice and held for your ok. nothing sends until you've read them.",
      },
    ],
  },
  {
    id: "expense-manager",
    name: "Expense Manager",
    title: "Receipts & reports",
    description:
      "Files receipts as they land, matches them to trips, and flags anything that doesn't add up.",
    shape: "blob",
    coatHex: "#885CF5",
    accentLight: "#524e9c",
    accentDark: "#8f8deb",
    pillBgDark: "color-mix(in srgb, #885CF5 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #885CF5 82%, #ffffff)",
    timeLabel: "5:10 AM",
    lastPreview: "report filed. 9 receipts, nothing outstanding.",
    routines: [
      {
        id: "expense-auto-1",
        name: "Month-end close",
        triggerDescription: "Last Friday of the month",
      },
    ],
    transcript: [
      {
        id: "expense-1",
        kind: "user",
        timestampLabel: "Yesterday 9:10 AM",
        content: "month-end is friday, close out the card for me?",
      },
      {
        id: "expense-2",
        kind: "agent",
        content:
          "i'll match every charge to a receipt and file the report. anything that doesn't line up, i ask instead of guessing.",
      },
      {
        id: "expense-3",
        kind: "system",
        systemLead: "Created routine",
        systemTarget: "Month-end close",
        systemIcon: "clock",
      },
      {
        id: "expense-4",
        kind: "agent",
        timestampLabel: "4:10 AM",
        content:
          "✓ **Receipts** → 9 matched to card charges\n✓ **Report** → drafted · $2,340 across 3 trips\n✓ **Flagged** → 1 charge · harbor hotel, $412 twice",
      },
      {
        id: "expense-5",
        kind: "agent",
        content:
          "the harbor hotel charged $412 on the 12th and again on the 14th. double-billed, or two separate nights?",
      },
      {
        id: "expense-6",
        kind: "user",
        timestampLabel: "5:10 AM",
        content: "two nights, mia stayed the second one",
      },
      {
        id: "expense-7",
        kind: "agent",
        content:
          "that clears it. report filed: **9 receipts** matched, $2,340 across 3 trips, nothing outstanding.",
      },
    ],
  },
  {
    id: "offsite-crew",
    name: "Offsite crew",
    description:
      "Shared room for wrapping up the offsite: recap, follow-ups, and thanks.",
    shape: "blob",
    coatHex: "#EB4699",
    accentLight: "#942f6e",
    accentDark: "#e76cb8",
    pillBgDark: "color-mix(in srgb, #EB4699 22%, #16161a)",
    pillFgDark: "color-mix(in srgb, #EB4699 82%, #ffffff)",
    timeLabel: "3:10 AM",
    lastPreview: "that leaves the pipeline. i'd spin up a dedicated agent.",
    isGroup: true,
    routines: [],
    transcript: [
      {
        id: "crew-1",
        kind: "user",
        timestampLabel: "2:10 AM",
        content: "let's close out the offsite. what's left?",
      },
      {
        id: "crew-2",
        kind: "agent",
        authorName: "Account Manager",
        content:
          "recap doc is done and owners are tagged. **3 follow-ups** land this week.",
      },
      {
        id: "crew-3",
        kind: "agent",
        authorName: "Inbox Manager",
        content:
          "thank-you notes went out to the venue and the speakers this morning.",
      },
      {
        id: "crew-4",
        kind: "agent",
        authorName: "Chief",
        reactions: ["👍"],
        content:
          "recap's shared. follow-ups, assigned:\n✓ **Acme pricing follow-up** → @[Account Manager] · numbers by thursday\n✓ **Speaker + venue thank-yous** → @[Inbox Manager] · done this morning\n✓ **Final invoice** → me · reconciling against the expense report",
      },
      {
        id: "crew-5",
        kind: "user",
        content: "great close-out. anything we missed?",
      },
      {
        id: "crew-6",
        kind: "agent",
        authorName: "Chief",
        content:
          "that leaves the pipeline: nobody's touched the quiet accounts. i'd spin up a dedicated agent for outbound.",
      },
    ],
  },
];

function GrokCharacterMark({ shape }: { shape: AvatarShape }) {
  if (shape === "wedge") {
    return (
      <svg
        aria-hidden="true"
        className="grok-bot-mark"
        viewBox="-15 -15 259 259"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(114.2705 114.2705) scale(1.0631441048034935) translate(-114.2705 -114.2705)">
          <path
            className="grok-bot-mark__head"
            d="M77.26 42.06Q114.27 -22.05 151.28 42.06L216.15 154.43Q253.17 218.53 179.14 218.53L49.4 218.53Q-24.62 218.53 12.39 154.43Z"
          />
          <path
            className="grok-bot-mark__eye"
            d="M111.05 101.72L113.26 102.06L115.33 102.79L117.23 103.89L118.81 105.40L120.00 107.23L120.90 109.26L121.63 111.35L122.34 113.46L123.03 115.57L123.72 117.69L124.40 119.81L125.05 121.93L125.68 124.07L126.28 126.22L126.85 128.38L127.38 130.55L127.68 132.78L127.49 135.05L126.76 137.25L125.49 139.22L123.80 140.84L121.79 142.01L119.59 142.69L117.33 142.86L115.14 142.51L113.10 141.69L111.30 140.44L109.83 138.82L108.75 136.91L107.98 134.83L107.38 132.69L106.80 130.52L106.19 128.38L105.57 126.24L104.93 124.10L104.27 121.99L103.59 119.86L102.89 117.75L102.11 115.68L101.37 113.58L100.85 111.41L100.85 109.15L101.50 106.92L102.77 104.96L104.50 103.38L106.57 102.33L108.79 101.79Z"
          />
          <path
            className="grok-bot-mark__eye"
            d="M158.35 94.49L160.57 94.77L162.59 95.46L164.37 96.46L165.96 97.69L167.33 99.12L168.46 100.75L169.40 102.50L170.22 104.33L170.97 106.21L171.70 108.09L172.40 109.99L173.06 111.91L173.67 113.85L174.25 115.81L174.78 117.79L175.27 119.79L175.70 121.81L176.09 123.86L176.24 125.98L176.01 128.20L175.36 130.45L174.08 132.62L172.03 134.24L169.63 134.86L167.38 134.67L165.42 133.90L163.76 132.75L162.40 131.31L161.35 129.63L160.58 127.76L160.02 125.81L159.55 123.80L159.09 121.78L158.59 119.78L158.06 117.80L157.49 115.84L156.87 113.90L156.23 111.97L155.53 110.07L154.80 108.19L154.03 106.34L153.22 104.50L152.49 102.62L152.13 100.57L152.42 98.34L153.73 96.22L155.95 94.86Z"
          />
        </g>
      </svg>
    );
  }

  if (shape === "gem") {
    return (
      <svg
        aria-hidden="true"
        className="grok-bot-mark"
        viewBox="-15 -15 259 259"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(114.2705 114.2705) scale(1.1310043668122272) translate(-114.2705 -114.2705)">
          <path
            className="grok-bot-mark__head"
            d="M227.48 114.27C227.48 114.96 227.42 115.46 227.3 116.32C227.18 117.18 226.99 118.3 226.75 119.44C226.51 120.57 226.21 121.82 225.85 123.11C225.49 124.41 225.06 125.78 224.59 127.2C224.11 128.6 223.57 130.08 222.98 131.59C222.39 133.09 221.74 134.65 221.03 136.22C220.32 137.8 219.56 139.42 218.75 141.05C217.93 142.67 217.06 144.33 216.14 146.01C215.22 147.68 214.25 149.37 213.23 151.06C212.21 152.75 211.14 154.47 210.01 156.18C208.9 157.89 207.74 159.6 206.54 161.31C205.32 163.02 204.07 164.74 202.79 166.44C201.49 168.14 200.16 169.83 198.79 171.52C197.43 173.2 196.02 174.88 194.59 176.54C193.15 178.18 191.68 179.83 190.17 181.44C188.68 183.06 187.14 184.65 185.59 186.23C184.04 187.8 182.45 189.34 180.85 190.85C179.24 192.36 177.62 193.85 175.98 195.31C174.34 196.75 172.68 198.18 171.02 199.55C169.35 200.93 167.66 202.27 165.97 203.57C164.28 204.88 162.59 206.14 160.9 207.35C159.2 208.57 157.5 209.75 155.8 210.87C154.11 211.99 152.42 213.08 150.74 214.11C149.05 215.14 147.37 216.12 145.73 217.05C144.07 217.98 142.42 218.86 140.8 219.68C139.2 220.5 137.59 221.27 136.03 221.98C134.47 222.69 132.93 223.36 131.43 223.95C129.95 224.55 128.48 225.09 127.08 225.57C125.68 226.05 124.32 226.48 123.03 226.84C121.75 227.21 120.51 227.51 119.39 227.76C118.26 228.01 117.16 228.19 116.3 228.31C115.45 228.43 114.95 228.49 114.27 228.49C113.59 228.49 113.09 228.43 112.24 228.31C111.38 228.19 110.28 228.01 109.16 227.76C108.03 227.51 106.79 227.21 105.51 226.84C104.22 226.48 102.86 226.05 101.46 225.57C100.06 225.09 98.59 224.55 97.11 223.95C95.61 223.36 94.07 222.69 92.51 221.98C90.95 221.27 89.34 220.5 87.74 219.68C86.12 218.86 84.47 217.98 82.81 217.05C81.17 12.42 149.05 13.4 150.74 14.43C152.42 15.47 154.11 16.55 155.8 17.67C157.5 18.79 159.2 19.97 160.9 21.19C162.59 22.4 164.28 23.66 165.97 24.97C167.66 26.27 169.35 27.61 171.02 28.99C172.68 30.37 174.34 31.79 175.98 33.23C177.62 34.69 179.24 36.18 180.85 37.69C182.45 39.2 184.04 40.75 185.59 42.31C187.14 43.89 188.68 45.49 190.17 47.1C191.68 48.71 193.15 50.36 194.59 52.01C196.02 53.66 197.43 55.34 198.79 57.02C200.16 58.71 201.49 60.41 202.79 62.1C204.07 63.8 205.32 65.52 206.54 67.23C207.74 68.94 208.9 70.65 210.01 72.36C211.14 74.07 212.21 75.79 213.23 77.48C214.25 79.18 215.22 80.86 216.14 82.54C217.06 84.21 217.93 85.87 218.75 87.49C219.56 89.12 220.32 90.74 221.03 92.32C221.74 93.89 222.39 95.45 222.98 96.96C223.57 98.46 224.11 99.94 224.59 101.34C225.06 102.76 225.49 104.14 225.85 105.44C226.21 106.73 226.51 107.97 226.75 109.11C226.99 110.24 227.18 111.36 227.3 112.22C227.42 113.08 227.48 113.58 227.48 114.27Z"
          />
          <path
            className="grok-bot-mark__eye"
            d="M117.64 74.90L119.73 75.19L121.71 75.85L123.51 76.86L125.01 78.26L126.15 79.96L127.00 81.86L127.69 83.81L128.37 85.79L129.03 87.77L129.69 89.74L130.33 91.72L130.95 93.72L131.55 95.72L132.12 97.73L132.66 99.75L133.17 101.78L133.45 103.87L133.27 106.01L132.58 108.09L131.38 109.95L129.77 111.49L127.86 112.62L125.77 113.28L123.62 113.46L121.54 113.17L119.60 112.42L117.89 111.27L116.49 109.76L115.47 107.98L114.73 106.03L114.16 104.03L113.61 102.00L113.03 99.99L112.44 97.99L111.83 95.99L111.20 94.01L110.55 92.03L109.89 90.05L109.14 88.11L108.44 86.15L107.95 84.12L107.95 81.99L108.57 79.90L109.77 78.04L111.42 76.54L113.38 75.52L115.49 74.99Z"
          />
          <path
            className="grok-bot-mark__eye"
            d="M172.37 65.15L174.47 65.42L176.36 66.06L178.03 67.00L179.53 68.16L180.82 69.51L181.88 71.03L182.77 72.68L183.53 74.40L184.24 76.17L184.92 77.94L185.58 79.72L186.20 81.53L186.77 83.35L187.32 85.19L187.82 87.05L188.28 88.93L188.69 90.83L189.05 92.76L189.20 94.75L188.98 96.84L188.37 98.96L187.17 100.99L185.24 102.52L182.98 103.10L180.87 102.92L179.02 102.20L177.46 101.12L176.18 99.77L175.20 98.18L174.47 96.43L173.94 94.59L173.50 92.70L173.08 90.80L172.60 88.93L172.11 87.06L171.57 85.22L170.99 83.40L170.38 81.59L169.73 79.80L169.04 78.03L168.31 76.29L167.55 74.56L166.87 72.79L166.53 70.86L166.80 68.78L168.04 66.78L170.12 65.50Z"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="grok-bot-mark"
      viewBox="-15 -15 259 259"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(114.2705 114.2705) scale(1.040524017467249) translate(-114.2705 -114.2705)">
        <path
          className="grok-bot-mark__head"
          d="M228.541 114.228C228.541 130.133 225.184 145.994 218.738 160.534C212.674 174.217 203.904 186.669 193.065 196.988C155.933 232.34 99.497 238.596 55.5255 212.24C45.097 205.99 35.6851 198.072 27.7451 188.866C19.1926 178.953 12.3686 167.569 7.65781 155.351C2.60712 142.264 0 128.257 0 114.228C0 98.3219 3.35751 82.4611 9.80315 67.9215C15.8672 54.2382 24.6377 41.7862 35.4767 31.4668C72.6081 -3.88483 129.044 -10.1413 173.016 16.2153C183.444 22.4653 192.856 30.3829 200.796 39.5896C209.349 49.5018 216.173 60.8859 220.883 73.1037C225.934 86.1906 228.541 100.198 228.541 114.228Z"
        />
        <path
          className="grok-bot-mark__eye"
          d="M118.17 70.73L120.45 71.04L122.59 71.76L124.55 72.87L126.18 74.38L127.42 76.24L128.34 78.29L129.10 80.42L129.83 82.57L130.55 84.72L131.27 86.86L131.97 89.02L132.64 91.19L133.29 93.36L133.91 95.55L134.50 97.74L135.05 99.95L135.36 102.23L135.16 104.55L134.41 106.80L133.11 108.84L131.36 110.51L129.28 111.73L127.01 112.45L124.68 112.65L122.41 112.33L120.31 111.51L118.45 110.26L116.93 108.62L115.81 106.69L115.01 104.57L114.39 102.39L113.80 100.19L113.17 98.01L112.52 95.84L111.85 93.66L111.17 91.51L110.47 89.35L109.75 87.20L108.94 85.09L108.17 82.96L107.64 80.75L107.63 78.44L108.31 76.16L109.61 74.14L111.41 72.51L113.54 71.41L115.84 70.83Z"
        />
        <path
          className="grok-bot-mark__eye"
          d="M179.77 59.76L182.04 60.05L184.10 60.75L185.92 61.77L187.55 63.03L188.95 64.50L190.10 66.16L191.07 67.95L191.90 69.82L192.67 71.74L193.41 73.66L194.13 75.60L194.80 77.56L195.42 79.55L196.02 81.54L196.56 83.57L197.06 85.61L197.50 87.67L197.90 89.77L198.06 91.94L197.82 94.21L197.15 96.51L195.85 98.72L193.75 100.38L191.30 101.01L189.00 100.81L186.99 100.03L185.30 98.85L183.91 97.38L182.84 95.66L182.05 93.76L181.48 91.76L181.00 89.71L180.53 87.64L180.02 85.60L179.48 83.58L178.89 81.58L178.26 79.60L177.60 77.62L176.90 75.68L176.15 73.76L175.36 71.86L174.53 69.98L173.78 68.06L173.41 65.97L173.71 63.70L175.05 61.53L177.32 60.14Z"
        />
      </g>
    </svg>
  );
}

function GrokAvatar({
  agent,
  size = 32,
}: {
  agent: GrokAgent;
  size?: number;
}) {
  if (agent.isGroup) {
    const members = [
      { coat: "#54B9A6", shape: "blob" as AvatarShape, x: 7, y: 0 },
      { coat: "#EA4045", shape: "wedge" as AvatarShape, x: 0, y: 14 },
      { coat: "#3C82F6", shape: "gem" as AvatarShape, x: 14, y: 14 },
    ];
    const scale = size / 32;
    return (
      <div
        className="relative shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {members.map((m, idx) => (
          <span
            key={idx}
            className="absolute overflow-hidden rounded-full"
            style={{
              width: `${Math.round(18 * scale)}px`,
              height: `${Math.round(18 * scale)}px`,
              left: `${Math.round(m.x * scale)}px`,
              top: `${Math.round(m.y * scale)}px`,
              zIndex: idx + 1,
              boxShadow: "0 0 0 2px var(--cursor-bg-elevated, #fff)",
            }}
          >
            <span
              className="flex h-full w-full items-center justify-center"
              style={
                {
                  "--fg": m.coat,
                  "--bg": "var(--grok-bot-bg-editor, #FFFFFF)",
                } as React.CSSProperties
              }
            >
              <span className="grok-bot-lazy grok-bot-mark--fill">
                <GrokCharacterMark shape={m.shape} />
              </span>
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className="flex h-full w-full items-center justify-center overflow-visible"
        style={
          {
            "--fg": agent.coatHex,
            "--bg": "var(--grok-bot-bg-editor, #FFFFFF)",
          } as React.CSSProperties
        }
      >
        <span
          className={`grok-bot-lazy${
            agent.shape === "blob" ? " grok-bot-mark--fill" : ""
          }`}
        >
          <GrokCharacterMark shape={agent.shape} />
        </span>
      </div>
    </div>
  );
}

function CursorGlyph({
  codepoint,
  size = 14,
}: {
  codepoint: string;
  size?: number;
}) {
  const char = String.fromCodePoint(parseInt(codepoint, 16));
  return (
    <span
      className="shrink-0"
      style={{
        fontFamily: "CursorIcons16",
        fontSize: `${size}px`,
        lineHeight: 1,
        display: "inline-flex",
        width: `${size}px`,
        height: `${size}px`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {char}
    </span>
  );
}

function RemoteDesktopMiniPreview({
  onExpand,
}: {
  onExpand?: () => void;
}) {
  const rows = [
    [86, 70],
    [68, 90],
    [80, 58],
    [58, 82],
    [88, 66],
    [66, 88],
  ];
  const outreachDrafts = [
    { name: "Priya Natarajan", opener: "82%" },
    { name: "Marcus Webb", opener: "64%" },
    { name: "Elena Sørensen", opener: "74%" },
    { name: "Daniel Alvarez", opener: "58%" },
  ];

  return (
    <div
      onClick={onExpand}
      className="group/desktop relative max-h-full w-full cursor-pointer overflow-hidden rounded-md aspect-[16/10] !rounded-none"
      style={
        {
          "--rd-base-width": "360px",
          "--rd-base-height": "225px",
          "--rd-content-scale": 1.1,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center remote-desktop-wallpaper remote-desktop-wallpaper--light"
        style={{
          backgroundImage:
            'url("/marketing-static/grok-bot/wallpapers/cloud-agents-2-a4798c0f.webp")',
        }}
      />
      <div
        aria-hidden="true"
        className="remote-desktop-wallpaper remote-desktop-wallpaper--dark absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("/marketing-static/grok-bot/wallpapers/cloud-agents-3-5a23ca2f.webp")',
        }}
      />

      {/* Window 1: CRM Portal */}
      <div
        className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px]"
        style={{
          top: "11%",
          left: "12%",
          width: "50%",
          height: "72%",
          zIndex: 2,
          boxShadow:
            "rgba(0, 0, 0, 0.14) 0px 3px 12px, rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px",
        }}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
            style={{
              borderBottom:
                "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
            }}
          >
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
          </div>
          <div className="relative flex min-h-0 flex-1 px-[8px] py-[6px] flex-col">
            <div
              aria-hidden="true"
              className="baby-grok-bot-portal-agent-cursor pointer-events-none absolute z-10 origin-top-left scale-[0.6]"
            >
              <svg
                className="-scale-x-100 drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.4775 2.375C15.1508 2.37522 15.5719 3.10428 15.2353 3.6875L8.63861 15.1143C8.19099 15.8892 7.00618 15.5716 7.00579 14.6768V7.56348L0.845638 4.00781C0.0708241 3.56015 0.388339 2.37535 1.28314 2.375H14.4775ZM7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                  fill="white"
                />
                <path
                  d="M7.69329 6.51758C8.04109 6.7186 8.25579 7.09044 8.25579 7.49219V13.2764L13.8271 3.625H2.68353L7.69329 6.51758Z"
                  fill="#1a1a1a"
                />
              </svg>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              {rows.map(([w1, w2], idx) => (
                <div
                  key={idx}
                  className="flex flex-1 items-center gap-[5px]"
                  style={{
                    borderBottom:
                      "0.5px solid color-mix(in srgb, var(--color-theme-fg) 5%, transparent)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="text-theme-product-ansi-green baby-grok-bot-receipt-check shrink-0"
                    style={{ animationDelay: `${200 + idx * 180}ms` }}
                  >
                    <svg viewBox="0 0 12 12" width="6" height="6" fill="none">
                      <circle
                        cx="6"
                        cy="6"
                        r="5.25"
                        stroke="currentColor"
                        strokeWidth="0.75"
                        opacity="0.4"
                      />
                      <path
                        d="M3.75 6.25l1.6 1.6 2.9-3.4"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div
                    className="h-[3px] rounded-full"
                    style={{
                      width: `${w1 * 0.45}%`,
                      backgroundColor: "var(--color-theme-fg)",
                      opacity: 0.12,
                    }}
                  />
                  <div
                    className="h-[3px] rounded-full ml-auto"
                    style={{
                      width: `${w2 * 0.25}%`,
                      backgroundColor: "var(--color-theme-fg)",
                      opacity: 0.08,
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              className="flex items-center justify-between pt-[4px] text-[6px] leading-none"
              style={{ color: "var(--color-theme-fg)" }}
            >
              <span style={{ opacity: 0.4 }}>52 accounts</span>
              <span style={{ opacity: 0.55 }}>36 contacts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Window 2: Outreach Queue */}
      <div
        className="rd-interactive bg-theme-bg absolute touch-none overflow-hidden rounded-[5px]"
        style={{
          top: "24%",
          left: "44%",
          width: "44%",
          height: "62%",
          zIndex: 6,
          boxShadow:
            "rgba(0, 0, 0, 0.18) 0px 4px 14px, rgba(0, 0, 0, 0.12) 0px 0px 0px 0.5px",
        }}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className="flex h-[11px] shrink-0 items-center gap-[2px] px-[4px]"
            style={{
              borderBottom:
                "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
            }}
          >
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
            <div
              className="h-[3px] w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-theme-fg)", opacity: 0.15 }}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-[8px] py-[6px]">
            <div
              className="flex items-center justify-between pb-[4px] text-[6px] leading-none"
              style={{
                borderBottom:
                  "0.5px solid color-mix(in srgb, var(--color-theme-fg) 8%, transparent)",
                color: "var(--color-theme-fg)",
              }}
            >
              <span style={{ opacity: 0.75 }}>Outreach queue</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              {outreachDrafts.map((d) => (
                <div
                  key={d.name}
                  className="flex flex-1 items-center gap-[5px]"
                  style={{
                    borderBottom:
                      "0.5px solid color-mix(in srgb, var(--color-theme-fg) 5%, transparent)",
                  }}
                >
                  <span
                    className="shrink-0 rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: "var(--color-theme-fg)",
                      opacity: 0.1,
                    }}
                  />
                  <span
                    className="truncate text-[6px] leading-none flex-1"
                    style={{ color: "var(--color-theme-fg)", opacity: 0.75 }}
                  >
                    {d.name}
                  </span>
                  <span
                    className="shrink-0 rounded-full px-[4px] py-[1px] text-[5px] leading-none"
                    style={{
                      border:
                        "0.5px solid color-mix(in srgb, var(--color-theme-fg) 22%, transparent)",
                      color: "var(--color-theme-fg)",
                      opacity: 0.6,
                    }}
                  >
                    Draft
                  </span>
                </div>
              ))}
            </div>
            <div
              className="flex items-center justify-between pt-[4px] text-[5.5px] leading-none"
              style={{ color: "var(--color-theme-fg)" }}
            >
              <span style={{ opacity: 0.55 }}>36 drafts queued</span>
              <span style={{ opacity: 0.4 }}>0 sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrokBotWindow() {
  const [agents, setAgents] = useState<GrokAgent[]>(GROK_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>("sales-outbound");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComputerOpen, setIsComputerOpen] = useState(false);
  const [sidePaneView, setSidePaneView] = useState<"desktop" | "settings">("desktop");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [isScreenLightboxOpen, setIsScreenLightboxOpen] = useState(false);
  const [isComposingNew, setIsComposingNew] = useState(false);
  const [composeToQuery, setComposeToQuery] = useState("");
  const [composerText, setComposerText] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [salesStepCount, setSalesStepCount] = useState<number>(
    GROK_AGENTS[1]?.transcript.length ?? 11
  );
  const [switchCount, setSwitchCount] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const hasUserSelectedRef = useRef(false);
  const hasAutoPlayedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearAutoPlayTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [salesStepCount, pendingStatus, scrollToBottom]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const fullLen = GROK_AGENTS[1]?.transcript.length ?? 11;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          !hasAutoPlayedRef.current &&
          !hasUserSelectedRef.current
        ) {
          hasAutoPlayedRef.current = true;
          clearAutoPlayTimers();
          setSalesStepCount(3);
          setPendingStatus("Checking connections");

          const schedule = (ms: number, fn: () => void) => {
            const tid = window.setTimeout(() => {
              if (!hasUserSelectedRef.current) fn();
            }, ms);
            timersRef.current.push(tid);
          };

          schedule(320, () => {
            setSalesStepCount(5);
            setPendingStatus("Wrapping the run");
          });
          schedule(680, () => {
            setSalesStepCount(7);
            setPendingStatus("Receiving context");
          });
          schedule(1040, () => {
            setSalesStepCount(8);
            setPendingStatus("Drafting");
          });
          schedule(1400, () => {
            setSalesStepCount(9);
            setPendingStatus(null);
          });
          schedule(1750, () => {
            setSalesStepCount(10);
          });
          schedule(2100, () => {
            setSalesStepCount(fullLen);
            setPendingStatus(null);
          });
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearAutoPlayTimers();
    };
  }, [clearAutoPlayTimers]);

  const activeAgent = useMemo(
    () => agents.find((a) => a.id === activeAgentId) ?? agents[0],
    [agents, activeAgentId]
  );

  const visibleTranscript = useMemo(() => {
    if (activeAgent.id === "sales-outbound") {
      return activeAgent.transcript.slice(0, salesStepCount);
    }
    return activeAgent.transcript;
  }, [activeAgent, salesStepCount]);

  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.lastPreview.toLowerCase().includes(q)
    );
  }, [agents, searchQuery]);

  const handleSelectAgent = (id: string) => {
    hasUserSelectedRef.current = true;
    clearAutoPlayTimers();
    setPendingStatus(null);
    setSalesStepCount(GROK_AGENTS[1]?.transcript.length ?? 11);
    setActiveAgentId(id);
    setSwitchCount((c) => c + 1);
    setIsComposingNew(false);
    setSidePaneView("desktop");
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unreadCount: 0 } : a))
    );
    window.setTimeout(() => {
      const el = transcriptRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 30);
  };

  const handleSelectAgentByName = (name: string) => {
    const found = agents.find(
      (a) => a.name.toLowerCase() === name.toLowerCase()
    );
    if (found) {
      handleSelectAgent(found.id);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = composerText.trim();
    if (!trimmed) return;
    setComposerText("");
    const userEntry: TranscriptEntry = {
      id: `u-${Date.now()}`,
      kind: "user",
      content: trimmed,
    };
    const replyEntry: TranscriptEntry = {
      id: `a-${Date.now() + 1}`,
      kind: "agent",
      content:
        "On it. I'll take this from here and come back when there's something for you to look at.",
    };
    setAgents((prev) =>
      prev.map((a) =>
        a.id === activeAgent.id
          ? {
              ...a,
              lastPreview: replyEntry.content ?? a.lastPreview,
              timeLabel: "now",
              transcript: [...a.transcript, userEntry, replyEntry],
            }
          : a
      )
    );
    window.setTimeout(() => {
      if (transcriptRef.current) {
        transcriptRef.current.scrollTo({
          top: transcriptRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const renderAgentMarkdown = (content: string) => {
    const tokens = content.split(/(\*\*[^*]+\*\*|`[^`]+`|@\[[^\]]+\])/g);
    return tokens.map((tok, idx) => {
      if (tok.startsWith("**") && tok.endsWith("**")) {
        return <strong key={idx}>{tok.slice(2, -2)}</strong>;
      }
      if (tok.startsWith("`") && tok.endsWith("`")) {
        return <code key={idx}>{tok.slice(1, -1)}</code>;
      }
      if (tok.startsWith("@[") && tok.endsWith("]")) {
        const mentionName = tok.slice(2, -1);
        const targetAgent =
          agents.find((a) => a.name === mentionName) ?? GROK_AGENTS[0];
        return (
          <span
            key={idx}
            onClick={() => handleSelectAgentByName(mentionName)}
            className="baby-grok-bot-message-mention cursor-pointer"
            style={{ color: targetAgent. pillFgDark }}
          >
            <span className="baby-grok-bot-message-mention__face">
              <GrokAvatar agent={targetAgent} size={14} />
            </span>
            {mentionName}
          </span>
        );
      }
      return <span key={idx}>{tok}</span>;
    });
  };

  return (
    <div ref={rootRef} className="h-full min-h-0">
      <div className="relative h-full w-full">
        <div
          className="baby-grok-bot-mount-fade relative w-full overflow-hidden"
          style={{ height: "100%" }}
        >
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div
              className="baby-grok-bot baby-grok-bot--embedded h-full w-full overflow-hidden"
              data-theme="cursor-dark"
              style={
                {
                  "--grok-bot-current-agent-tint": `light-dark(${activeAgent.accentDark}, ${activeAgent.accentLight})`,
                  "--grok-bot-current-agent-bubble": `light-dark(${activeAgent.accentLight}, ${activeAgent.accentDark})`,
                  "--grok-bot-current-agent-bubble-ink": "#FFFFFF",
                  "--grok-bot-current-agent-accent": `light-dark(${activeAgent.accentLight}, ${activeAgent.accentDark})`,
                  "--grok-bot-current-agent-coat": activeAgent.coatHex,
                } as React.CSSProperties
              }
            >
              <div className="baby-grok-bot-shell">
                {/* Left Sidebar */}
                <div
                  className="baby-grok-bot-sidebar-slot"
                  style={{
                    width: isSidebarCollapsed || isComputerOpen ? "84px" : "280px",
                    transition: "width 0.24s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <aside
                    className="baby-grok-bot-sidebar"
                    data-collapsed={
                      isSidebarCollapsed || isComputerOpen ? "" : undefined
                    }
                  >
                    <div className="baby-grok-bot-sidebar-header">
                      <div className="baby-grok-bot-sidebar-header__lead">
                        <div
                          className="baby-grok-bot-traffic-lights-spacer"
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className="baby-grok-bot-sidebar-header__actions"
                        style={{ color: "var(--grok-bot-sidebar-text-secondary)" }}
                      >
                        <button
                          type="button"
                          aria-label="New agent"
                          onClick={() => {
                            setIsComposingNew((prev) => !prev);
                            setIsComputerOpen(false);
                          }}
                          className="baby-grok-bot-sidebar-header__action cursor-pointer"
                        >
                          <CursorGlyph codepoint="EA60" size={14} />
                        </button>
                      </div>
                    </div>

                    {!(isSidebarCollapsed || isComputerOpen) && (
                      <label className="baby-grok-bot-chat-search">
                        <CursorGlyph codepoint="EA6D" size={14} />
                        <input
                          aria-label="Search chats"
                          className="baby-grok-bot-chat-search__input"
                          placeholder="Search"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </label>
                    )}

                    <div
                      className="baby-grok-bot-sidebar-list flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-2"
                      data-fade-bottom=""
                    >
                      <div className="flex flex-col gap-0.5">
                        {filteredAgents.map((agent) => {
                          const isRowActive =
                            !isComposingNew && agent.id === activeAgent.id;
                          return (
                            <button
                              key={agent.id}
                              type="button"
                              onClick={() => handleSelectAgent(agent.id)}
                              className={`baby-grok-bot-agent-row cursor-pointer ${
                                isRowActive
                                  ? ""
                                  : "hover:bg-[var(--grok-bot-sidebar-hover)]"
                              }`}
                              title={agent.name}
                              data-active={isRowActive ? "" : undefined}
                            >
                              <span className="baby-grok-bot-agent-row__avatar">
                                <GrokAvatar agent={agent} size={32} />
                              </span>
                              <div className="baby-grok-bot-agent-row__body min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="relative min-w-0 flex-1">
                                    <span
                                      className="block truncate text-[14px] leading-5 tracking-[-0.15px]"
                                      style={{
                                        color:
                                          "var(--grok-bot-sidebar-text-primary)",
                                      }}
                                    >
                                      {agent.name}
                                    </span>
                                  </span>
                                  <span
                                    className="baby-grok-bot-agent-row__time shrink-0 text-[12px] leading-4"
                                    style={{
                                      color:
                                        "var(--grok-bot-sidebar-text-tertiary)",
                                    }}
                                  >
                                    {agent.timeLabel}
                                  </span>
                                </div>
                                <div className="mt-px flex h-4 items-center gap-1.5">
                                  <span
                                    className="min-w-0 flex-1 truncate text-[12px] leading-4"
                                    style={{
                                      color:
                                        "var(--grok-bot-sidebar-text-secondary)",
                                    }}
                                  >
                                    {agent.lastPreview}
                                  </span>
                                  {agent.unreadCount && agent.unreadCount > 0 ? (
                                    <span
                                      aria-label={`${agent.unreadCount} unread`}
                                      className="baby-grok-bot-agent-row__unread flex h-[16px] min-w-[16px] shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none text-white"
                                      style={{
                                        background:
                                          "var(--grok-bot-text-accent)",
                                      }}
                                    >
                                      {agent.unreadCount}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <footer className="baby-grok-bot-sidebar-footer">
                      <span
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tracking-tight select-none"
                        style={{
                          background: "var(--grok-bot-bg-tertiary)",
                          color: "var(--grok-bot-sidebar-text-secondary)",
                        }}
                      >
                        AS
                      </span>
                      <span
                        className="baby-grok-bot-sidebar-footer__name min-w-0 flex-1 truncate text-[13px] font-medium"
                        style={{
                          color: "var(--grok-bot-sidebar-text-primary)",
                        }}
                      >
                        Armand Segall
                      </span>
                      <button
                        type="button"
                        aria-label={
                          isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                        className="baby-grok-bot-sidebar-footer__action cursor-pointer"
                        style={{
                          color: "var(--grok-bot-sidebar-text-secondary)",
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect
                            x="1.75"
                            y="2.75"
                            width="12.5"
                            height="10.5"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <line
                            x1="6"
                            y1="3.25"
                            x2="6"
                            y2="12.75"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </button>
                    </footer>
                  </aside>
                </div>

                {/* Center Chat Pane */}
                <div className="baby-grok-bot-chat">
                  <div
                    className="relative shrink-0"
                    style={{ height: "var(--grok-bot-toolbar-height)" }}
                  >
                    {isComposingNew ? (
                      <header className="baby-grok-bot-compose-header">
                        <label className="baby-grok-bot-compose-field">
                          <span
                            className="shrink-0 text-[14px] leading-5"
                            style={{ color: "var(--cursor-text-tertiary)" }}
                          >
                            To:
                          </span>
                          <input
                            autoFocus
                            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 tracking-[-0.15px] outline-none placeholder:text-[var(--cursor-text-tertiary)]"
                            placeholder="Search or create agents"
                            value={composeToQuery}
                            onChange={(e) => setComposeToQuery(e.target.value)}
                            style={{ color: "var(--cursor-text-primary)" }}
                          />
                        </label>
                        <div className="baby-grok-bot-compose-popover">
                          <div className="baby-grok-bot-compose-results">
                            {agents
                              .filter((a) =>
                                a.name
                                  .toLowerCase()
                                  .includes(composeToQuery.trim().toLowerCase())
                              )
                              .map((a) => (
                                <button
                                  key={a.id}
                                  type="button"
                                  onClick={() => handleSelectAgent(a.id)}
                                  className="baby-grok-bot-compose-result cursor-pointer hover:bg-[var(--grok-bot-bg-active)]"
                                >
                                  <GrokAvatar agent={a} size={24} />
                                  <span
                                    className="min-w-0 flex-1 truncate text-[13px] leading-4"
                                    style={{ color: "var(--cursor-text-primary)" }}
                                  >
                                    {a.name}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </header>
                    ) : (
                      <header
                        className="relative z-[3] flex shrink-0 items-center justify-between gap-2 px-2"
                        style={{
                          height: "var(--grok-bot-toolbar-height)",
                          color: "var(--cursor-text-primary)",
                          borderBottom:
                            "0.5px solid var(--grok-bot-border-default)",
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`Open ${activeAgent.name}'s computer`}
                            onClick={() => {
                              if (!activeAgent.isGroup) {
                                setIsComputerOpen((prev) => !prev);
                              }
                            }}
                            className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--cursor-text-primary)_4%,transparent)]"
                          >
                            <GrokAvatar agent={activeAgent} size={18} />
                            <span className="relative min-w-0">
                              <span
                                className="block truncate text-[13px] leading-[18px] tracking-[-0.08px]"
                                style={{ color: "var(--cursor-text-primary)" }}
                              >
                                {activeAgent.name}
                              </span>
                            </span>
                          </button>
                        </div>
                        {!activeAgent.isGroup && (
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              aria-label={
                                isComputerOpen ? "Hide computer" : "Open computer"
                              }
                              aria-pressed={isComputerOpen}
                              onClick={() => setIsComputerOpen((prev) => !prev)}
                              className={`flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[var(--cursor-bg-hover)] ${
                                isComputerOpen
                                  ? "bg-[var(--cursor-bg-active)] text-[var(--cursor-text-primary)]"
                                  : "text-[var(--cursor-text-secondary)] hover:text-[var(--cursor-text-primary)]"
                              }`}
                            >
                              <CursorGlyph codepoint="EA7A" size={14} />
                            </button>
                          </div>
                        )}
                      </header>
                    )}
                  </div>

                  {/* Transcript */}
                  <div
                    ref={transcriptRef}
                    className="baby-grok-bot-transcript flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-2 pb-12"
                  >
                    <div
                      key={`${activeAgent.id}-${switchCount}`}
                      data-fresh=""
                      className="flex flex-col gap-1"
                    >
                      {visibleTranscript.map((entry, idx) => {
                        const prev =
                          idx > 0 ? visibleTranscript[idx - 1] : null;
                        const roleChanged = prev && prev.kind !== entry.kind;
                        const hasReactions =
                          entry.reactions && entry.reactions.length > 0;

                        return (
                          <div
                            key={entry.id}
                            className={`baby-grok-bot-entry-enter${
                              hasReactions ? " mb-[14px]" : ""
                            }${
                              roleChanged
                                ? " mt-3 first:mt-0"
                                : entry.timestampLabel
                                ? " mt-2 first:mt-0"
                                : ""
                            }`}
                          >
                            {entry.timestampLabel && (
                              <div className="mb-2">
                                <div
                                  className="flex items-center justify-center py-1 text-[12px] leading-4"
                                  style={{
                                    color: "var(--cursor-text-secondary)",
                                  }}
                                >
                                  {entry.timestampLabel}
                                </div>
                              </div>
                            )}

                            {entry.kind === "system" && (
                              <div
                                className="flex min-w-0 items-center justify-center gap-1.5 overflow-hidden py-1 text-[13px] leading-4"
                                style={{
                                  color: "var(--cursor-text-secondary)",
                                }}
                              >
                                {entry.systemSources ? (
                                  <>
                                    <span className="shrink-0">
                                      {entry.systemLead}
                                    </span>
                                    {entry.systemSources.map((src, sIdx) => {
                                      const srcAgent =
                                        agents.find((a) => a.id === src.id) ??
                                        GROK_AGENTS[0];
                                      return (
                                        <React.Fragment key={src.id}>
                                          {sIdx > 0 && (
                                            <span className="shrink-0">and</span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleSelectAgent(src.id)
                                            }
                                            className="baby-grok-bot-system-agent"
                                            style={
                                              {
                                                "--grok-bot-system-agent-pill":
                                                  srcAgent.pillBgDark,
                                                "--grok-bot-system-agent-ink":
                                                  srcAgent.pillFgDark,
                                              } as React.CSSProperties
                                            }
                                          >
                                            <GrokAvatar
                                              agent={srcAgent}
                                              size={12}
                                            />
                                            <span className="truncate">
                                              {src.name}
                                            </span>
                                          </button>
                                        </React.Fragment>
                                      );
                                    })}
                                  </>
                                ) : entry.systemIcon === "clock" ? (
                                  <>
                                    <span className="shrink-0">
                                      {entry.systemLead}
                                    </span>
                                    <span className="flex shrink-0 items-center">
                                      <CursorGlyph codepoint="EDC0" size={15} />
                                    </span>
                                    <span
                                      className="truncate"
                                      style={{
                                        color: "var(--cursor-text-primary)",
                                      }}
                                    >
                                      {entry.systemTarget}
                                    </span>
                                  </>
                                ) : (
                                  <span className="truncate">
                                    {entry.systemTarget
                                      ? `${entry.systemLead} ${entry.systemTarget}`
                                      : entry.systemLead}
                                  </span>
                                )}
                              </div>
                            )}

                            {entry.kind === "user" && (
                              <div className="flex justify-end">
                                <div className="relative max-w-[min(420px,85%)]">
                                  <div
                                    className="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap"
                                    style={{
                                      background: "var(--grok-bot-bubble-user)",
                                      color: "var(--grok-bot-bubble-user-ink)",
                                      borderRadius: "16px",
                                      ...(hasReactions
                                        ? {
                                            maskImage:
                                              "radial-gradient(circle at calc(100% - 20px) calc(100% + 4px), transparent 11.5px, rgb(0, 0, 0) 12px)",
                                            WebkitMaskImage:
                                              "radial-gradient(circle at calc(100% - 20px) calc(100% + 4px), transparent 11.5px, rgb(0, 0, 0) 12px)",
                                          }
                                        : {}),
                                    }}
                                  >
                                    {entry.content}
                                  </div>
                                  {hasReactions && (
                                    <span className="baby-grok-bot-reactions baby-grok-bot-reactions--user">
                                      {entry.reactions?.map((r) => (
                                        <span
                                          key={r}
                                          className="baby-grok-bot-reaction"
                                        >
                                          {r}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {entry.kind === "agent" && (
                              <div className="flex max-w-[min(560px,92%)] flex-col items-start">
                                {entry.authorName && (
                                  <div
                                    className="mb-1 px-1 text-[12px] font-medium"
                                    style={{
                                      color: "var(--cursor-text-tertiary)",
                                    }}
                                  >
                                    {entry.authorName}
                                  </div>
                                )}
                                <div className="relative">
                                  <div
                                    className="baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap"
                                    style={{
                                      background:
                                        "var(--grok-bot-bubble-agent)",
                                      color: "var(--cursor-text-primary)",
                                      borderRadius: "16px",
                                      ...(hasReactions
                                        ? {
                                            maskImage:
                                              "radial-gradient(circle at 20px calc(100% + 4px), transparent 11.5px, rgb(0, 0, 0) 12px)",
                                            WebkitMaskImage:
                                              "radial-gradient(circle at 20px calc(100% + 4px), transparent 11.5px, rgb(0, 0, 0) 12px)",
                                          }
                                        : {}),
                                    }}
                                  >
                                    {renderAgentMarkdown(entry.content ?? "")}
                                  </div>
                                  {hasReactions && (
                                    <span className="baby-grok-bot-reactions baby-grok-bot-reactions--agent">
                                      {entry.reactions?.map((r) => (
                                        <span
                                          key={r}
                                          className="baby-grok-bot-reaction"
                                        >
                                          {r}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {entry.kind === "computer-use" && (
                              <div className="max-w-[min(420px,92%)]">
                                <div className="baby-grok-bot-card">
                                  <div className="flex items-start gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setIsComputerOpen((v) => !v)
                                      }
                                      className="baby-grok-bot-card-title cursor-pointer"
                                    >
                                      Computer
                                    </button>
                                    <span className="flex-1" />
                                    <span
                                      className="baby-grok-bot-card-badge"
                                      data-tone="success"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="baby-grok-bot-card-badge__dot"
                                      />
                                      Done
                                    </span>
                                  </div>
                                  <p className="mt-0.5">
                                    {entry.computerInstruction}
                                  </p>
                                  <div className="mt-2.5">
                                    <div
                                      className="overflow-hidden"
                                      style={{ borderRadius: "10px" }}
                                    >
                                      <RemoteDesktopMiniPreview
                                        onExpand={() =>
                                          setIsComputerOpen((v) => !v)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {pendingStatus && activeAgent.id === "sales-outbound" && (
                        <div className="baby-grok-bot-pending mt-2">
                          <span className="baby-grok-bot-pending__avatar">
                            <GrokAvatar agent={activeAgent} size={28} />
                          </span>
                          <span
                            key={pendingStatus}
                            className="baby-grok-bot-pending__label"
                          >
                            <span>{pendingStatus}</span>
                            <span className="ml-1 inline-flex items-center gap-1">
                              <span className="baby-grok-bot-typing-dot" />
                              <span
                                className="baby-grok-bot-typing-dot"
                                style={{ animationDelay: "0.18s" }}
                              />
                              <span
                                className="baby-grok-bot-typing-dot"
                                style={{ animationDelay: "0.36s" }}
                              />
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Composer */}
                  <div className="shrink-0">
                    <div className="relative px-4 pt-1 pb-3">
                      <div
                        aria-hidden="true"
                        className="baby-grok-bot-composer-fade pointer-events-none absolute inset-x-0 -top-6 bottom-0"
                      />
                      <form
                        onSubmit={handleSendMessage}
                        className="baby-grok-bot-composer relative flex items-center gap-1.5 rounded-[20px] py-1.5 pr-1.5 pl-2"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-6 shrink-0 items-center justify-center rounded-full"
                          style={{ color: "var(--cursor-text-secondary)" }}
                        >
                          <CursorGlyph codepoint="EA60" size={16} />
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <input
                            type="text"
                            value={composerText}
                            onChange={(e) => setComposerText(e.target.value)}
                            placeholder={
                              isComposingNew
                                ? "Message"
                                : `Message ${activeAgent.name}`
                            }
                            aria-label={
                              isComposingNew
                                ? "Message"
                                : `Message ${activeAgent.name}`
                            }
                            className="w-full bg-transparent text-[14px] leading-5 tracking-[-0.15px] outline-none placeholder:text-[var(--cursor-text-tertiary)]"
                            style={{ color: "var(--cursor-text-primary)" }}
                          />
                        </div>
                        <button
                          type="submit"
                          aria-label={
                            composerText.trim() ? "Send message" : "Voice input"
                          }
                          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
                          style={
                            composerText.trim()
                              ? {
                                  background:
                                    "var(--grok-bot-current-agent-accent)",
                                  color: "#fff",
                                }
                              : { color: "var(--cursor-text-secondary)" }
                          }
                        >
                          <CursorGlyph
                            codepoint={composerText.trim() ? "EAA1" : "EC12"}
                            size={composerText.trim() ? 14 : 16}
                          />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Right-side Virtual Computer / Routines / Settings Drawer */}
                {isComputerOpen && !activeAgent.isGroup && (
                  <aside
                    className="baby-grok-bot-side-pane"
                    style={{ width: "264px", opacity: 1 }}
                  >
                    <div
                      className="baby-grok-bot-side-pane__inner"
                      style={{ width: "264px" }}
                    >
                      <header className="flex h-[var(--grok-bot-toolbar-height)] shrink-0 items-center gap-1 px-3">
                        {sidePaneView === "settings" && (
                          <button
                            type="button"
                            aria-label="Back to computer"
                            onClick={() => setSidePaneView("desktop")}
                            className="baby-grok-bot-window-action -ml-1 cursor-pointer"
                          >
                            <CursorGlyph codepoint="EAB5" size={15} />
                          </button>
                        )}
                        <span className="min-w-0 flex-1 truncate text-center text-[13px] font-semibold">
                          {sidePaneView === "settings" ? "Settings" : ""}
                        </span>
                        {sidePaneView === "desktop" && (
                          <button
                            type="button"
                            aria-label="Agent settings"
                            onClick={() => setSidePaneView("settings")}
                            className="baby-grok-bot-window-action cursor-pointer"
                          >
                            <CursorGlyph codepoint="EAF8" size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Close computer"
                          onClick={() => setIsComputerOpen(false)}
                          className="baby-grok-bot-window-action cursor-pointer"
                        >
                          <CursorGlyph codepoint="ED82" size={14} />
                        </button>
                      </header>

                      <div className="relative min-h-0 flex-1">
                        <div className="absolute inset-0 flex flex-col gap-2.5 overflow-y-auto px-4 pt-1 pb-4 [&>*]:shrink-0">
                          {sidePaneView === "desktop" ? (
                            <>
                              <div
                                className="overflow-hidden"
                                style={{ borderRadius: "12px" }}
                              >
                                <RemoteDesktopMiniPreview
                                  onExpand={() =>
                                    setIsScreenLightboxOpen(true)
                                  }
                                />
                              </div>
                              <p
                                className="text-center text-[12px]"
                                style={{
                                  color: "var(--cursor-text-secondary)",
                                }}
                              >
                                {activeAgent.name}&rsquo;s screen
                              </p>
                              <div className="mt-5">
                                <span
                                  className="text-[12px]"
                                  style={{
                                    color: "var(--cursor-text-secondary)",
                                  }}
                                >
                                  Routines
                                </span>
                                {activeAgent.routines.length === 0 ? (
                                  <p
                                    className="mt-2 rounded-[10px] border border-dashed px-3 py-6 text-center text-[12px] leading-[1.5]"
                                    style={{
                                      borderColor:
                                        "var(--grok-bot-border-default)",
                                      color: "var(--cursor-text-tertiary)",
                                    }}
                                  >
                                    Nothing scheduled yet. Ask{" "}
                                    {activeAgent.name} to do something every
                                    morning and it shows up here.
                                  </p>
                                ) : (
                                  <ul className="mt-1.5 flex list-none flex-col p-0">
                                    {activeAgent.routines.map((rt) => (
                                      <li
                                        key={rt.id}
                                        className="flex items-center gap-2.5 py-1.5"
                                      >
                                        <span
                                          className="flex shrink-0 items-center"
                                          style={{
                                            color:
                                              "var(--grok-bot-current-agent-accent)",
                                          }}
                                        >
                                          <CursorGlyph
                                            codepoint="EDC0"
                                            size={15}
                                          />
                                        </span>
                                        <span className="shrink-0 text-[13px] font-medium whitespace-nowrap">
                                          {rt.name}
                                        </span>
                                        <span
                                          className="min-w-0 flex-1 truncate text-[13px]"
                                          style={{
                                            color:
                                              "var(--cursor-text-tertiary)",
                                          }}
                                        >
                                          {rt.triggerDescription}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-center pt-1 pb-4">
                                <GrokAvatar agent={activeAgent} size={64} />
                              </div>
                              <div>
                                <span
                                  className="block text-[12px]"
                                  style={{
                                    color: "var(--cursor-text-secondary)",
                                  }}
                                >
                                  Name
                                </span>
                                <div
                                  className="mt-1.5 rounded-[10px] px-3 py-2 text-[13px] leading-[1.45]"
                                  style={{
                                    background: "var(--cursor-bg-elevated)",
                                    border:
                                      "0.5px solid var(--grok-bot-border-default)",
                                  }}
                                >
                                  {activeAgent.name}
                                </div>
                              </div>
                              <div>
                                <span
                                  className="block text-[12px]"
                                  style={{
                                    color: "var(--cursor-text-secondary)",
                                  }}
                                >
                                  Title (optional)
                                </span>
                                <div
                                  className="mt-1.5 rounded-[10px] px-3 py-2 text-[13px] leading-[1.45]"
                                  style={{
                                    background: "var(--cursor-bg-elevated)",
                                    border:
                                      "0.5px solid var(--grok-bot-border-default)",
                                  }}
                                >
                                  {activeAgent.title ?? "Add a title"}
                                </div>
                              </div>
                              <div>
                                <span
                                  className="block text-[12px]"
                                  style={{
                                    color: "var(--cursor-text-secondary)",
                                  }}
                                >
                                  Description
                                </span>
                                <div
                                  className="mt-1.5 rounded-[10px] px-3 py-2 text-[13px] leading-[1.45]"
                                  style={{
                                    background: "var(--cursor-bg-elevated)",
                                    border:
                                      "0.5px solid var(--grok-bot-border-default)",
                                  }}
                                >
                                  {activeAgent.description}
                                </div>
                              </div>
                              <div
                                className="isolate mt-1.5 overflow-hidden rounded-[10px]"
                                style={{ background: "var(--cursor-bg-card)" }}
                              >
                                <div className="flex items-start gap-2.5 px-3 py-2.5">
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[13px]">
                                      Notifications
                                    </div>
                                    <p
                                      className="mt-0.5 text-[11.5px] leading-[1.45]"
                                      style={{
                                        color: "var(--cursor-text-tertiary)",
                                      }}
                                    >
                                      Get notified when this agent finishes or
                                      needs input
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={notificationsOn}
                                    aria-label="Notifications"
                                    onClick={() =>
                                      setNotificationsOn((prev) => !prev)
                                    }
                                    className="relative h-[18px] w-[30px] shrink-0 cursor-pointer rounded-full transition-colors"
                                    style={{
                                      background: notificationsOn
                                        ? "var(--grok-bot-current-agent-accent)"
                                        : "var(--cursor-bg-active)",
                                    }}
                                  >
                                    <span
                                      className="absolute top-[2px] left-0 size-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.28)] transition-transform"
                                      style={{
                                        transform: notificationsOn
                                          ? "translateX(14px)"
                                          : "translateX(2px)",
                                      }}
                                    />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </aside>
                )}

                {/* Full-Screen Virtual Computer Lightbox */}
                {isScreenLightboxOpen && (
                  <div className="baby-grok-bot-screen-layer">
                    <button
                      type="button"
                      aria-label="Close screen"
                      onClick={() => setIsScreenLightboxOpen(false)}
                      className="baby-grok-bot-screen-scrim"
                    />
                    <div
                      aria-label={`${activeAgent.name}'s screen`}
                      aria-modal="true"
                      role="dialog"
                      className="baby-grok-bot-screen-frame"
                      style={{
                        borderRadius: "14px",
                        boxShadow: "0 18px 44px -14px rgba(0, 0, 0, 0.32)",
                      }}
                    >
                      <RemoteDesktopMiniPreview />
                      <button
                        type="button"
                        aria-label="Close screen"
                        onClick={() => setIsScreenLightboxOpen(false)}
                        className="baby-grok-bot-screen-close cursor-pointer"
                      >
                        <CursorGlyph codepoint="ED82" size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
