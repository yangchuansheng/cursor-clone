import React from "react";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  hideOnMobile?: boolean;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "“It was night and day from one batch to another, adoption went from single digits to over 80%. It just spread like wildfire, all the best builders were using Cursor.”",
    name: "Diana Hu",
    role: "General Partner, Y Combinator",
    avatar: "/sites/cursor/blob/assets/avatars/diana-hu-avatar.png",
  },
  {
    quote:
      "“My favorite enterprise AI service is Cursor. Every one of our engineers, some 40,000, are now assisted by AI and our productivity has gone up incredibly.”",
    name: "Jensen Huang",
    role: "President & CEO, NVIDIA",
    avatar: "/sites/cursor/blob/assets/misc/asset-b7d40eac35d910f3448b.png",
  },
  {
    quote:
      "“The best LLM applications have an autonomy slider: you control how much independence to give the AI. In Cursor, you can do Cmd+K for targeted edits, or let it rip with the full autonomy agentic version.”",
    name: "Andrej Karpathy",
    role: "CEO, Eureka Labs",
    avatar: "/sites/cursor/blob/assets/avatars/andrej-karpathy-avatar.png",
  },
  {
    quote:
      "“Cursor quickly grew from hundreds to thousands of extremely enthusiastic Stripe employees. We spend more on R&D and software creation than any other undertaking, and there's significant economic outcomes when making that process more efficient.”",
    name: "Patrick Collison",
    role: "Co‑Founder & CEO, Stripe",
    avatar: "/sites/cursor/blob/assets/avatars/patrick-collison-avatar.png",
    hideOnMobile: true,
  },
  {
    quote:
      "“The most useful AI tool that I currently pay for, hands down, is Cursor. It's fast, autocompletes when and where you need it to, handles brackets properly, sensible keyboard shortcuts, bring-your-own-model... everything is well put together.”",
    name: "shadcn",
    role: "Creator of shadcn/ui",
    avatar: "/sites/cursor/blob/assets/avatars/shadcn-avatar.png",
    hideOnMobile: true,
  },
  {
    quote:
      "“It's definitely becoming more fun to be a programmer. We are at the 1% of what's possible, and it's in interactive experiences like Cursor where models like GPT-5 shine brightest.”",
    name: "Greg Brockman",
    role: "President, OpenAI",
    avatar: "/sites/cursor/blob/assets/avatars/greg-brockman-avatar.jpg",
    hideOnMobile: true,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section bg-theme-bg text-theme-text overflow-hidden">
      <div className="container">
        <div className="text-center mx-auto mb-v2.5 max-w-prose-medium-wide">
          <h2 className="type-lg text-balance mx-auto">
            The new way to build software.
          </h2>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 gap-g1 items-stretch md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className={item.hideOnMobile ? "hidden md:block" : ""}
            >
              <div className="card relative flex w-full shrink-0 flex-col h-full min-h-[180px]">
                <figure className="flex h-full flex-col">
                  <blockquote className="grow overflow-hidden">
                    <p className="whitespace-pre-wrap text-pretty type-base line-clamp-4 md:line-clamp-5">
                      {item.quote}
                    </p>
                  </blockquote>
                  <div className="flex items-center mt-v2 space-x-(--grid-gap)">
                    <div className="avatar-border-container shrink-0 h-[2.5rem] w-[2.5rem]">
                      <img
                        alt=""
                        loading="lazy"
                        width={42}
                        height={42}
                        decoding="async"
                        className="h-full w-full object-cover"
                        src={item.avatar}
                      />
                    </div>
                    <figcaption>
                      <div className="type-sm">
                        {item.name}{" "}
                        <span className="type-sm text-theme-text-sec block">
                          {item.role}
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
