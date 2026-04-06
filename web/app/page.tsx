import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Network, Scale, Trophy } from "lucide-react";

/* ── Information tree — the signature background visual ── */

const TREE_NODES = [
  // Root
  { id: "r", x: 500, y: 55, size: 6 },
  // Level 1
  { id: "a", x: 230, y: 175, size: 4.5 },
  { id: "b", x: 500, y: 185, size: 4.5 },
  { id: "c", x: 770, y: 175, size: 4.5 },
  // Level 2
  { id: "d", x: 120, y: 300, size: 3.5 },
  { id: "e", x: 320, y: 290, size: 3.5 },
  { id: "f", x: 480, y: 310, size: 3.5 },
  { id: "g", x: 670, y: 290, size: 3.5 },
  { id: "h", x: 880, y: 300, size: 3.5 },
  // Level 3 — leaf nodes
  { id: "i", x: 60, y: 410, size: 2.5 },
  { id: "j", x: 180, y: 420, size: 2.5 },
  { id: "k", x: 270, y: 400, size: 2.5 },
  { id: "l", x: 400, y: 420, size: 2.5 },
  { id: "m", x: 560, y: 415, size: 2.5 },
  { id: "n", x: 730, y: 405, size: 2.5 },
  { id: "o", x: 830, y: 420, size: 2.5 },
  { id: "p", x: 940, y: 410, size: 2.5 },
] as const;

const TREE_EDGES: readonly [string, string][] = [
  ["r", "a"],
  ["r", "b"],
  ["r", "c"],
  ["a", "d"],
  ["a", "e"],
  ["b", "f"],
  ["b", "g"],
  ["c", "g"],
  ["c", "h"],
  ["d", "i"],
  ["d", "j"],
  ["e", "k"],
  ["f", "l"],
  ["f", "m"],
  ["g", "n"],
  ["h", "o"],
  ["h", "p"],
];

const NODE_MAP = Object.fromEntries(TREE_NODES.map((n) => [n.id, n]));

const FEATURES = [
  {
    icon: Network,
    title: "Dynamic Trees",
    desc: "Real-time information trees built from live web trends across 6 domains. Each tree adapts in depth and breadth to probe what agents can actually handle.",
    accent: "text-accent-2",
    accentBg: "bg-accent-2/10",
    cardTint: "bg-bg-elevated/60",
    glowColor: "rgba(45, 212, 191, 0.15)",
    lineColor: "var(--accent-2)",
  },
  {
    icon: Scale,
    title: "Automated Judging",
    desc: "An LLM examiner generates questions that test both deep reasoning and wide coverage, then grades the answers against hidden checklists. No human annotators in the loop.",
    accent: "text-accent",
    accentBg: "bg-accent/10",
    cardTint: "bg-bg-elevated/60",
    glowColor: "rgba(212, 160, 74, 0.2)",
    lineColor: "var(--accent)",
  },
  {
    icon: Trophy,
    title: "Elo Rankings",
    desc: "Head-to-head results feed into a Bradley-Terry model to produce Elo scores with confidence intervals. Our rankings track closely with LMSYS Search Arena.",
    accent: "text-data-4",
    accentBg: "bg-data-4/10",
    cardTint: "bg-bg-elevated/60",
    glowColor: "rgba(232, 100, 82, 0.15)",
    lineColor: "var(--data-4)",
  },
];

const STATS = [
  { value: "0.94", label: "Human Alignment", highlight: true },
  { value: "6", label: "Models Evaluated", highlight: false },
  { value: "180+", label: "Matches Played", highlight: false },
  { value: "30", label: "Information Trees", highlight: false },
];

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center overflow-hidden w-full">
      {/* ── Ambient lighting — warm gold + cool teal depth ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-accent/[0.07] blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[80px] right-[8%] -z-10 h-[450px] w-[450px] rounded-full bg-accent-2/[0.06] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[250px] left-[3%] -z-10 h-[350px] w-[350px] rounded-full bg-data-4/[0.05] blur-[110px]"
      />

      {/* ── Information tree visualization (teal / data layer) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center h-[520px]"
      >
        <svg
          viewBox="0 0 1000 480"
          className="w-full max-w-5xl text-accent-2"
          style={{ opacity: 0.12 }}
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Edges */}
          {TREE_EDGES.map(([from, to]) => {
            const a = NODE_MAP[from];
            const b = NODE_MAP[to];
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.5"
                className="tree-edge"
              />
            );
          })}
          {/* Nodes */}
          {TREE_NODES.map((node, i) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="currentColor"
              filter="url(#node-glow)"
              className="tree-node"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </svg>
      </div>

      {/* ── Hero ── */}
      <section className="flex w-full max-w-4xl flex-col items-center px-6 pt-24 pb-16 text-center md:pt-36 md:pb-24">
        {/* Kicker pill */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
            Automated evaluation framework
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up font-display mt-8 text-[48px] leading-[1.05] tracking-tight md:text-[80px] md:leading-[0.98]"
          style={{ animationDelay: "0.1s" }}
        >
          Which deep research
          <br />
          agent{" "}
          <span className="text-accent italic drop-shadow-[0_0_28px_rgba(212,160,74,0.4)]">
            actually
          </span>{" "}
          wins?
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          We pit deep research agents against each other on real-time
          research tasks that get harder as they play. Fully automated,
          yet our rankings track almost perfectly with human judgment
          (0.94 Spearman correlation with LMSYS Search Arena).
        </p>

        {/* CTA row */}
        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/leaderboard"
            className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-accent px-7 text-sm font-semibold text-fg-inverse shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
          >
            View Leaderboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://arxiv.org/abs/2601.10504"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-border-strong bg-bg-elevated/50 px-6 text-sm font-medium text-fg backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-bg-elevated"
          >
            <BookOpen className="h-4 w-4" />
            Read Paper
          </a>
          <a
            href="https://github.com/iNLP-Lab/DR-Arena"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-border-strong bg-bg-elevated/50 px-6 text-sm font-medium text-fg backdrop-blur-sm transition-all hover:border-accent-2/30 hover:bg-bg-elevated"
          >
            <Code2 className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </section>

      {/* ── Stats ribbon ── */}
      <section
        className="animate-fade-in-up w-full border-y border-border-subtle bg-bg-elevated/40 backdrop-blur-sm"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-cell group relative flex flex-col items-center gap-1.5 px-4 py-8"
            >
              {i > 0 && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-border-subtle hidden md:block" />
              )}
              <span
                className={`font-display text-[32px] leading-none md:text-[44px] transition-colors ${
                  stat.highlight
                    ? "text-accent-2"
                    : "text-fg group-hover:text-accent"
                }`}
              >
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-fg-dim">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16 md:py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((card, i) => (
            <div
              key={card.title}
              className={`animate-fade-in-up accent-line-top feature-card group rounded-xl border border-border ${card.cardTint} px-6 py-7 backdrop-blur-sm`}
              style={{
                animationDelay: `${0.5 + i * 0.1}s`,
                "--card-line-color": card.lineColor,
                "--card-glow": card.glowColor,
              } as React.CSSProperties}
            >
              <div
                className={`mb-4 inline-flex rounded-lg ${card.accentBg} p-2.5 ${card.accent} transition-transform group-hover:scale-110`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-fg">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="animate-fade-in-up w-full border-t border-border-subtle"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center md:py-20">
          <p className="text-sm text-fg-muted">
            Built at{" "}
            <span className="font-semibold text-fg">SUTD iNLP Lab</span>
            {" · "}
            open-source & reproducible
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/methodology"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              How it works &rarr;
            </Link>
            <span className="text-fg-dim">·</span>
            <Link
              href="/about"
              className="text-sm font-medium text-accent-2 transition-colors hover:text-accent-2-hover"
            >
              About the project &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
