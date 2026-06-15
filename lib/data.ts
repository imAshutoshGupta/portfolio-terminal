// Single source of truth for content that's reused across the marketing pages,
// the case-study routes, and the API fallbacks. The page markup itself keeps
// its exact original copy for pixel parity; this is the canonical data layer.

export type Project = {
  slug: string;
  no: string;
  name: string;
  blurb: string; // exact card copy from the home page
  tags: string[];
  stars: string;
  starsCount: number;
  // case-study detail
  href: string;
  problem: string;
  approach: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  snippet?: { lang: string; code: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "ledger",
    no: "drwx 001",
    name: "Ledger",
    blurb: "Open-source double-entry accounting engine. Used in production by 30+ teams.",
    tags: ["TypeScript", "Postgres", "tRPC"],
    stars: "★ 4.2k",
    starsCount: 4200,
    href: "https://github.com/imAshutoshGupta/ledger",
    problem:
      "Teams kept reinventing fragile money math on top of generic ORMs — floating-point rounding bugs, no audit trail, and balances that drifted under concurrency.",
    approach: [
      "Modeled every movement as an immutable double-entry transaction; balances are derived, never stored mutably.",
      "Integer minor-units throughout — no floats touch a monetary value.",
      "Postgres serializable transactions for the hot path, with an append-only journal for a complete audit trail.",
      "End-to-end type safety from the SQL schema to the tRPC client.",
    ],
    stack: ["TypeScript", "PostgreSQL", "tRPC", "Drizzle", "Vitest"],
    metrics: [
      { label: "Production teams", value: "30+" },
      { label: "GitHub stars", value: "4.2k" },
      { label: "Float bugs shipped", value: "0" },
    ],
    snippet: {
      lang: "ts",
      code: `// every entry must net to zero — enforced at the type level\nexport function post(tx: Entry[]): Posting {\n  const sum = tx.reduce((n, e) => n + e.minor, 0n);\n  if (sum !== 0n) throw new UnbalancedError(sum);\n  return journal.append(tx);\n}`,
    },
  },
  {
    slug: "atlas",
    no: "drwx 002",
    name: "Atlas",
    blurb: "Realtime analytics dashboard handling 40M events/day on serverless edge.",
    tags: ["Next.js", "Edge", "ClickHouse"],
    stars: "★ 1.8k",
    starsCount: 1800,
    href: "https://github.com/imAshutoshGupta/atlas",
    problem:
      "Product analytics that were either real-time-but-expensive or cheap-but-hours-stale. We wanted sub-second dashboards at 40M events/day without a six-figure bill.",
    approach: [
      "Ingest at the edge — events land on the nearest region and stream to ClickHouse in micro-batches.",
      "Pre-aggregated materialized views keep p95 query latency under 200ms.",
      "Incremental streaming on the Next.js App Router so the dashboard paints instantly and fills in live.",
    ],
    stack: ["Next.js", "Edge Runtime", "ClickHouse", "Kafka", "React"],
    metrics: [
      { label: "Events / day", value: "40M" },
      { label: "Query p95", value: "<200ms" },
      { label: "Cost vs. prior", value: "-71%" },
    ],
  },
  {
    slug: "pulse",
    no: "drwx 003",
    name: "Pulse",
    blurb: "Self-hosted uptime + tracing monitor with a clean React control plane.",
    tags: ["NestJS", "React", "Redis"],
    stars: "★ 920",
    starsCount: 920,
    href: "https://github.com/imAshutoshGupta/pulse",
    problem:
      "Hosted monitoring gets expensive fast and ships your traces to someone else's cloud. Teams wanted a self-hosted option that didn't feel like a downgrade.",
    approach: [
      "NestJS scheduler fans out checks from multiple regions and rolls results into Redis time-series.",
      "OpenTelemetry-native trace ingestion with tail-based sampling.",
      "A React control plane that stays legible at 500+ monitored endpoints.",
    ],
    stack: ["NestJS", "React", "Redis", "OpenTelemetry", "Postgres"],
    metrics: [
      { label: "Endpoints / instance", value: "500+" },
      { label: "Check regions", value: "6" },
      { label: "Self-hosted", value: "100%" },
    ],
  },
  {
    slug: "drift",
    no: "drwx 004",
    name: "Drift",
    blurb: "CLI that compiles Figma design tokens into typed Tailwind themes.",
    tags: ["Node", "Rust"],
    stars: "★ 640",
    starsCount: 640,
    href: "https://github.com/imAshutoshGupta/drift",
    problem:
      "Design tokens lived in Figma and Tailwind config drifted from them constantly. Designers shipped a new scale; engineers found out in review.",
    approach: [
      "A Rust core diffs the Figma token tree and emits a typed Tailwind theme.",
      "Thin Node CLI wraps it for a one-command `drift pull`.",
      "Generates `.d.ts` so every token is autocompleted and type-checked in code.",
    ],
    stack: ["Rust", "Node.js", "Tailwind", "Figma API"],
    metrics: [
      { label: "Pull time", value: "<400ms" },
      { label: "Token drift", value: "eliminated" },
      { label: "Typed tokens", value: "100%" },
    ],
  },
];

export const STATS = [
  { value: "6+", label: "Years shipping" },
  { value: "40M", label: "Req / day" },
  { value: "12", label: "Products launched" },
  { value: "4.2k", label: "OSS stars" },
];

// Fallback "Now Playing" rotation — matches the simulated list in the preview,
// so the widget is identical until real Spotify creds are configured.
export const FALLBACK_TRACKS = [
  { title: "Midnight City", artist: "M83", durationSec: 241 },
  { title: "Strobe", artist: "deadmau5", durationSec: 323 },
  { title: "Nightcall", artist: "Kavinsky", durationSec: 258 },
  { title: "Resonance", artist: "HOME", durationSec: 213 },
  { title: "Redshift", artist: "Tycho", durationSec: 276 },
];

export const WRITING = [
  { date: "Apr 2026", title: "Scaling WebSockets to a million connections", read: "12 min" },
  { date: "Jan 2026", title: "Why we finally moved off the ORM", read: "8 min" },
  { date: "Nov 2025", title: "A tiny Rust core for a TypeScript CLI", read: "10 min" },
];
