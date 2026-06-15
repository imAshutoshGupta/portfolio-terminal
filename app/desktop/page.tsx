"use client";

import "./theme-os.css";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* ============================================================
   ICONS — copied verbatim from the original ICON map, JSX-ified.
   ============================================================ */
const Icon = {
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="9" r="3.4" />
      <path d="M5 20a7 7 0 0114 0" strokeLinecap="round" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 9l3 3-3 3M13 15h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M12 3l2.4 5 5.5.5-4.2 3.7 1.3 5.4L12 15.8 6.9 18.6l1.3-5.4L4 9.5 9.5 9 12 3z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  writing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 19l1-4L16 5l3 3L9 18l-4 1z" strokeLinejoin="round" />
      <path d="M14 7l3 3" strokeLinecap="round" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6h5l1.5 2H20v10H4V6z" strokeLinejoin="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3l2.4 5 5.5.5-4.2 3.7 1.3 5.4L12 15.8 6.9 18.6l1.3-5.4L4 9.5 9.5 9 12 3z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.12 1.43-2.12 2.9V21H9V9z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1.5 1.5M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1.5-1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

const MenubarLogo = (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2L21 7v10l-9 5-9-5V7l9-5z" stroke="url(#mb-g)" strokeWidth="1.6" />
    <path d="M12 2v20M3 7l9 5 9-5" stroke="url(#mb-g)" strokeWidth="1.6" />
    <defs>
      <linearGradient id="mb-g" x1="0" y1="0" x2="24" y2="24">
        <stop stopColor="#9d8bff" />
        <stop offset="1" stopColor="#67b6ff" />
      </linearGradient>
    </defs>
  </svg>
);

const SunIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4.2" />
    <path
      d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 14.5A8 8 0 119.5 4 6.3 6.3 0 0020 14.5z" strokeLinejoin="round" />
  </svg>
);

/* Desktop icon SVGs (these have their own fills/gradients) */
const DesktopProjectsIcon = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      fill="url(#fld)"
    />
    <defs>
      <linearGradient id="fld" x1="3" y1="5" x2="21" y2="20">
        <stop stopColor="#67b6ff" />
        <stop offset="1" stopColor="#9d8bff" />
      </linearGradient>
    </defs>
  </svg>
);

const DesktopResumeIcon = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h8l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
      fill="#fff"
      stroke="#c98bff"
      strokeWidth="1.2"
    />
    <path d="M14 3v4h4" stroke="#c98bff" strokeWidth="1.2" fill="none" />
    <path d="M8 12h8M8 15h8M8 18h5" stroke="#9d8bff" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const DesktopTrashIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#9b97ad" strokeWidth="1.5">
    <path
      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ============================================================
   CONTENT — exact copy/markup from the original CONTENT map.
   ============================================================ */
type AppKey =
  | "about"
  | "projects"
  | "experience"
  | "terminal"
  | "skills"
  | "writing"
  | "mail"
  | "resume";

interface WinSpec {
  title: string;
  icon: ReactNode;
  w: number;
  h: number;
  x: number;
  y: number;
  bodyClass?: string;
  body: ReactNode;
}

const ascii =
  "     ___       \n" +
  "   /     \\     \n" +
  "  | () () |    \n" +
  "   \\  ^  /     \n" +
  "    |||||      \n" +
  "    |||||      \n" +
  "  ashOS 6.0   ";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[2px] text-[var(--v1)] mb-[14px] block">
      {children}
    </span>
  );
}

function ProjCard({
  name,
  desc,
  tags,
  stars,
}: {
  name: string;
  desc: string;
  tags: string[];
  stars: string;
}) {
  return (
    <div className="group/proj flex flex-col gap-[9px] border border-[var(--line2)] rounded-[12px] p-[16px] cursor-default bg-[var(--line)] transition-[transform,border-color,box-shadow] duration-[180ms] hover:-translate-y-[3px] hover:border-[var(--v1)] hover:shadow-[0_14px_30px_-14px_rgba(157,139,255,.5)]">
      <div className="flex items-center justify-between">
        <div className="font-disp font-semibold text-[17px] flex items-center gap-[8px]">
          <span className="w-[18px] h-[18px] text-[var(--v2)] [&>svg]:w-full [&>svg]:h-full">
            {Icon.projects}
          </span>
          {name}
        </div>
        <div className="font-mono text-[12px] text-[var(--muted)] flex items-center gap-[4px]">
          <span className="w-[13px] h-[13px] text-[var(--traffic-yellow)] [&>svg]:w-full [&>svg]:h-full">
            {Icon.star}
          </span>
          {stars}
        </div>
      </div>
      <div className="text-[13px] text-[var(--muted)] leading-[1.5]">{desc}</div>
      <div className="flex flex-wrap gap-[6px] mt-auto">
        {tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[10.5px] px-[8px] py-[3px] rounded-[6px] border border-[var(--line2)] text-[var(--fg)] opacity-[.85]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function RoleRow({
  time,
  title,
  co,
  loc,
}: {
  time: string;
  title: string;
  co: string;
  loc: string;
}) {
  return (
    <div className="flex gap-[16px] py-[16px] border-b border-[var(--line)] relative last:border-b-0">
      <div className="font-mono text-[11px] text-[var(--v1)] flex-[0_0_84px] pt-[2px]">{time}</div>
      <div>
        <div className="font-disp font-semibold text-[16px]">{title}</div>
        <div className="text-[var(--v2)] text-[13.5px] font-medium">{co}</div>
        <div className="text-[var(--muted)] text-[12.5px] mt-[3px]">{loc}</div>
      </div>
    </div>
  );
}

function SkillGroup({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mb-[18px]">
      <h4 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--faint)] mb-[9px]">
        {heading}
      </h4>
      <div className="flex flex-wrap gap-[7px]">
        {items.map((c) => (
          <span
            key={c}
            className="text-[13px] font-medium px-[12px] py-[5px] rounded-[8px] border border-[var(--line2)] bg-[var(--line)] transition-[transform,background] duration-[150ms] hover:-translate-y-[2px] hover:bg-[linear-gradient(120deg,rgba(157,139,255,.2),rgba(103,182,255,.2))]"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function TermLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="text-[var(--fg)]">
      <span className="text-[var(--v2)] font-bold">{k}</span>: {v}
    </div>
  );
}

function ArticleRow({ n, t, d, r }: { n: string; t: string; d: string; r: string }) {
  return (
    <div className="group/art flex items-start gap-[14px] py-[14px] border-b border-[var(--line)] cursor-default last:border-b-0">
      <div className="font-mono text-[var(--faint)] text-[13px] pt-[2px]">{n}</div>
      <div>
        <div className="font-disp font-medium text-[16px] transition-colors duration-[150ms] group-hover/art:text-[var(--v1)]">
          {t}
        </div>
        <div className="font-mono text-[11px] text-[var(--muted)] mt-[4px] flex gap-[12px]">
          <span>{d}</span>
          <span>{r} read</span>
        </div>
      </div>
    </div>
  );
}

function MailRow({
  ic,
  t,
  s,
  href,
}: {
  ic: ReactNode;
  t: string;
  s: string;
  href: string;
}) {
  return (
    <a
      className="group/mail flex items-center gap-[14px] px-[12px] py-[14px] rounded-[10px] no-underline text-[var(--fg)] transition-[background] duration-[150ms] border border-transparent hover:bg-[var(--line)] hover:border-[var(--line2)]"
      href={href}
      target="_blank"
      rel="noopener"
    >
      <div className="w-[38px] h-[38px] flex-[0_0_38px] rounded-[10px] grid place-items-center bg-[linear-gradient(135deg,var(--v1),var(--v2))] text-white [&>svg]:w-[19px] [&>svg]:h-[19px]">
        {ic}
      </div>
      <div>
        <div className="font-semibold text-[14px]">{t}</div>
        <div className="text-[var(--muted)] text-[12.5px] font-mono">{s}</div>
      </div>
      <span className="ml-auto text-[var(--faint)] [&>svg]:w-[24px] [&>svg]:h-[24px]">
        {Icon.arrow}
      </span>
    </a>
  );
}

const AboutBody = (
  <>
    <Eyebrow>whoami</Eyebrow>
    <div className="flex items-center gap-[16px] mb-[18px]">
      <div className="w-[64px] h-[64px] flex-[0_0_64px] rounded-[18px] grid place-items-center bg-[linear-gradient(135deg,var(--v1),var(--v3))] text-white font-disp font-semibold text-[26px] shadow-[0_8px_24px_-6px_rgba(157,139,255,.5)]">
        AR
      </div>
      <div>
        <div className="font-disp font-semibold text-[22px] leading-[1.1]">Ashutosh Gupta</div>
        <div className="text-[var(--muted)] text-[13.5px] mt-[3px]">
          Full-stack engineer · San Francisco
        </div>
      </div>
    </div>
    <div className="inline-flex items-center gap-[8px] text-[12.5px] font-semibold px-[12px] py-[5px] rounded-[99px] border border-[var(--line2)] bg-[linear-gradient(120deg,rgba(157,139,255,.16),rgba(103,182,255,.16))] mb-[18px]">
      <span className="w-[8px] h-[8px] rounded-full bg-[var(--traffic-green)] shadow-[0_0_0_0_rgba(40,200,64,.6)] animate-pulse-dot motion-reduce:animate-none" />
      Available for staff-level roles
    </div>
    <p className="text-[var(--muted)] text-[15px] leading-[1.55] max-w-[42ch]">
      &quot;I build reliable systems end-to-end — from Postgres schema to the last pixel.&quot;
    </p>
    <div className="grid grid-cols-2 gap-[10px] mt-[20px] max-[760px]:grid-cols-1">
      {(
        [
          ["6+", "years experience"],
          ["40M", "requests / day"],
          ["12", "products shipped"],
          ["4.2k", "OSS stars"],
        ] as const
      ).map(([b, label]) => (
        <div
          key={label}
          className="border border-[var(--line)] rounded-[11px] px-[15px] py-[13px] bg-[var(--line)]"
        >
          <b className="font-disp font-semibold text-[24px] block tracking-[-.5px] bg-[linear-gradient(120deg,var(--v1),var(--v2))] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            {b}
          </b>
          <span className="text-[11.5px] text-[var(--muted)]">{label}</span>
        </div>
      ))}
    </div>
  </>
);

const ProjectsBody = (
  <>
    <Eyebrow>~/projects · 4 items</Eyebrow>
    <div className="grid grid-cols-2 gap-[14px] max-[760px]:grid-cols-1">
      <ProjCard
        name="Ledger"
        desc="Open-source double-entry accounting engine, used by 30+ teams."
        tags={["TypeScript", "Postgres", "tRPC"]}
        stars="4.2k"
      />
      <ProjCard
        name="Atlas"
        desc="Realtime analytics dashboard, 40M events/day on serverless edge."
        tags={["Next.js", "Edge", "ClickHouse"]}
        stars="1.8k"
      />
      <ProjCard
        name="Pulse"
        desc="Self-hosted uptime + tracing monitor with a React control plane."
        tags={["NestJS", "React", "Redis"]}
        stars="920"
      />
      <ProjCard
        name="Drift"
        desc="CLI compiling Figma tokens into typed Tailwind themes."
        tags={["Node", "Rust"]}
        stars="640"
      />
    </div>
  </>
);

const ExperienceBody = (
  <>
    <Eyebrow>career.log</Eyebrow>
    <RoleRow
      time="2023–Now"
      title="Senior Software Engineer"
      co="Vercel · Platform team"
      loc="San Francisco"
    />
    <RoleRow
      time="2021–2023"
      title="Full-Stack Engineer"
      co="Stripe · Payments infra"
      loc="Remote"
    />
    <RoleRow
      time="2019–2021"
      title="Software Engineer"
      co="Startup (acquired)"
      loc="New York"
    />
    <RoleRow
      time="2015–2019"
      title="B.S. Computer Science"
      co="UC Berkeley"
      loc="Berkeley, CA"
    />
  </>
);

const SkillsBody = (
  <>
    <Eyebrow>stack</Eyebrow>
    <SkillGroup heading="Languages" items={["TypeScript", "Python", "Go"]} />
    <SkillGroup heading="Frontend" items={["Next.js", "React", "Tailwind"]} />
    <SkillGroup heading="Backend" items={["Node.js", "NestJS", "GraphQL", "tRPC"]} />
    <SkillGroup heading="Data" items={["PostgreSQL", "Redis", "ClickHouse"]} />
    <SkillGroup heading="Infra" items={["AWS", "Docker", "Terraform"]} />
  </>
);

const TerminalBody = (
  <>
    <div className="flex gap-[26px] font-mono text-[12.5px] leading-[1.55] max-[760px]:flex-col max-[760px]:gap-[14px]">
      <pre className="text-[var(--v1)] whitespace-pre text-[11px] leading-[1.15] [text-shadow:0_0_14px_rgba(157,139,255,.4)] max-[760px]:text-[9px]">
        {ascii}
      </pre>
      <div>
        <div className="text-[var(--fg)]">
          <span className="text-[var(--v2)] font-bold">ashutosh</span>@
          <span className="text-[var(--v2)] font-bold">gupta</span>
        </div>
        <div className="text-[var(--faint)] my-[7px]">-----------------</div>
        <TermLine k="role" v="Full-stack engineer" />
        <TermLine k="uptime" v="6 years" />
        <TermLine k="stack" v="Next.js · NestJS · React · Node · Python · AWS" />
        <TermLine k="throughput" v="40M req/day" />
        <TermLine k="shipped" v="12 products" />
        <TermLine k="shell" v="zsh" />
        <TermLine k="status" v="available" />
      </div>
    </div>
    <div className="mt-[14px] font-mono text-[12.5px] text-[var(--muted)]">
      <span className="text-[var(--v3)] font-bold">ashutosh@gupta</span>:
      <span style={{ color: "var(--v2)" }}>~</span>$ ./hire-me
      <span className="inline-block w-[8px] h-[15px] bg-[var(--v1)] align-[-2px] animate-blink-step ml-[2px] motion-reduce:animate-none" />
    </div>
  </>
);

const MailBody = (
  <>
    <Eyebrow>get in touch</Eyebrow>
    <MailRow ic={Icon.mail} t="Email" s="hello@ashutoshgupta.dev" href="mailto:hello@ashutoshgupta.dev" />
    <MailRow
      ic={Icon.github}
      t="GitHub"
      s="github.com/imAshutoshGupta"
      href="https://github.com/imAshutoshGupta"
    />
    <MailRow
      ic={Icon.linkedin}
      t="LinkedIn"
      s="in/imAshutoshGupta"
      href="https://linkedin.com/in/imAshutoshGupta"
    />
    <MailRow ic={Icon.link} t="Résumé" s="resume.pdf" href="#" />
  </>
);

const CONTENT: Record<AppKey, WinSpec> = {
  about: { title: "About Ashutosh", icon: Icon.about, w: 520, h: 560, x: 80, y: 60, body: AboutBody },
  projects: {
    title: "Projects",
    icon: Icon.folder,
    w: 620,
    h: 560,
    x: 430,
    y: 120,
    body: ProjectsBody,
  },
  experience: {
    title: "Experience",
    icon: Icon.experience,
    w: 520,
    h: 500,
    x: 160,
    y: 160,
    body: ExperienceBody,
  },
  skills: { title: "Skills", icon: Icon.skills, w: 480, h: 520, x: 520, y: 80, body: SkillsBody },
  terminal: {
    title: "Terminal — zsh",
    icon: Icon.terminal,
    w: 560,
    h: 340,
    x: 300,
    y: 380,
    bodyClass: "term-body",
    body: TerminalBody,
  },
  writing: {
    title: "Writing",
    icon: Icon.writing,
    w: 500,
    h: 380,
    x: 240,
    y: 240,
    body: (
      <>
        <Eyebrow>posts</Eyebrow>
        <ArticleRow
          n="01"
          t="Scaling WebSockets to a million connections"
          d="Apr 2026"
          r="12 min"
        />
        <ArticleRow n="02" t="Why we moved off the ORM" d="Jan 2026" r="8 min" />
        <ArticleRow n="03" t="A tiny Rust core for a TypeScript CLI" d="Nov 2025" r="10 min" />
      </>
    ),
  },
  mail: { title: "Mail", icon: Icon.mail, w: 480, h: 400, x: 380, y: 200, body: MailBody },
  // resume opens a mail-style contact window (résumé listed), reusing the Mail body.
  resume: {
    title: "Résumé.pdf",
    icon: Icon.writing,
    w: 480,
    h: 400,
    x: 400,
    y: 140,
    body: MailBody,
  },
};

const DOCK: Array<[Exclude<AppKey, "resume">, string]> = [
  ["about", "About"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["terminal", "Terminal"],
  ["skills", "Skills"],
  ["writing", "Writing"],
  ["mail", "Mail"],
];

/* ============================================================
   WINDOW MANAGER state
   ============================================================ */
interface OpenWin {
  key: AppKey;
  x: number;
  y: number;
  z: number;
  closing: boolean;
}

function isMobile() {
  return typeof window !== "undefined" && window.matchMedia("(max-width:760px)").matches;
}

function Window({
  win,
  spec,
  onClose,
  onFocus,
  onDrag,
}: {
  win: OpenWin;
  spec: WinSpec;
  onClose: () => void;
  onFocus: () => void;
  onDrag: (clientX: number, clientY: number, offX: number, offY: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ ox: number; oy: number; active: boolean }>({
    ox: 0,
    oy: 0,
    active: false,
  });

  const onHeaderPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest(".light")) return;
      if (isMobile()) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      drag.current = { ox: e.clientX - r.left, oy: e.clientY - r.top, active: true };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onFocus();
    },
    [onFocus]
  );

  const onHeaderPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current.active) return;
      onDrag(e.clientX, e.clientY, drag.current.ox, drag.current.oy);
    },
    [onDrag]
  );

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const desktopStyle: CSSProperties = {
    left: win.x,
    top: win.y,
    width: spec.w,
    height: spec.h,
    zIndex: win.z,
  };

  return (
    <div
      ref={ref}
      style={desktopStyle}
      onPointerDown={onFocus}
      className={
        "absolute pointer-events-auto bg-[var(--glass)] [backdrop-filter:blur(34px)_saturate(1.5)] [-webkit-backdrop-filter:blur(34px)_saturate(1.5)] border border-[var(--line2)] rounded-[14px] shadow-[var(--win-shadow)] flex flex-col overflow-hidden min-w-[280px] " +
        (win.closing
          ? "animate-win-out motion-reduce:animate-none "
          : "animate-win-in motion-reduce:animate-none ") +
        "max-[760px]:!static max-[760px]:!w-full max-[760px]:!h-auto max-[760px]:!max-h-none max-[760px]:!transform-none max-[760px]:!animate-none max-[760px]:min-w-0"
      }
    >
      <div
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="h-[38px] flex-[0_0_38px] flex items-center px-[12px] border-b border-[var(--line)] cursor-grab active:cursor-grabbing relative bg-[linear-gradient(180deg,var(--line),transparent)] max-[760px]:cursor-default"
      >
        <div className="flex gap-[8px]">
          <button
            type="button"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="light light-red w-[12px] h-[12px] rounded-full border-none cursor-pointer relative bg-[var(--traffic-red)]"
          />
          <span className="light w-[12px] h-[12px] rounded-full border-none cursor-default relative bg-[var(--traffic-yellow)]" />
          <span className="light w-[12px] h-[12px] rounded-full border-none cursor-default relative bg-[var(--traffic-green)]" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-[var(--muted)] tracking-[.2px] flex items-center gap-[7px] pointer-events-none [&>svg]:w-[14px] [&>svg]:h-[14px]">
          <span className="w-[14px] h-[14px] inline-flex [&>svg]:w-full [&>svg]:h-full">
            {spec.icon}
          </span>
          {spec.title}
        </div>
      </div>
      <div
        className={
          "win-body overflow-y-auto flex-1 " +
          (spec.bodyClass === "term-body"
            ? "bg-transparent px-[24px] py-[20px]"
            : "px-[26px] py-[24px]")
        }
      >
        {spec.body}
      </div>
    </div>
  );
}

export default function DesktopPage() {
  const [wins, setWins] = useState<OpenWin[]>([]);
  const [clock, setClock] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const zTop = useRef(20);

  // boot: open about + terminal, and sync theme state from the DOM.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);

    setWins([
      { key: "about", x: CONTENT.about.x, y: CONTENT.about.y, z: 21, closing: false },
      { key: "terminal", x: CONTENT.terminal.x, y: CONTENT.terminal.y, z: 22, closing: false },
    ]);
    zTop.current = 22;
  }, []);

  // live clock — Day H:MM AM/PM, updating every second.
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const h = d.getHours();
      const m = d.getMinutes();
      const ap = h >= 12 ? "PM" : "AM";
      let hh = h % 12;
      if (hh === 0) hh = 12;
      setClock(`${days[d.getDay()]} ${hh}:${m < 10 ? "0" : ""}${m} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const openWindow = useCallback((key: AppKey | "trash") => {
    if (key === "trash") return; // trash is empty / no-op
    setWins((prev) => {
      const existing = prev.find((w) => w.key === key && !w.closing);
      const nextZ = zTop.current + 1;
      zTop.current = nextZ;
      if (existing) {
        return prev.map((w) => (w === existing ? { ...w, z: nextZ } : w));
      }
      const spec = CONTENT[key];
      return [...prev, { key, x: spec.x, y: spec.y, z: nextZ, closing: false }];
    });
  }, []);

  const focusWindow = useCallback((key: AppKey) => {
    setWins((prev) => {
      const w = prev.find((x) => x.key === key && !x.closing);
      if (!w || w.z === zTop.current) return prev;
      const nextZ = zTop.current + 1;
      zTop.current = nextZ;
      return prev.map((x) => (x === w ? { ...x, z: nextZ } : x));
    });
  }, []);

  const closeWindow = useCallback((key: AppKey) => {
    setWins((prev) => prev.map((w) => (w.key === key ? { ...w, closing: true } : w)));
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    window.setTimeout(
      () => {
        setWins((prev) => prev.filter((w) => w.key !== key));
      },
      reduced ? 0 : 200
    );
  }, []);

  const dragWindow = useCallback(
    (key: AppKey, clientX: number, clientY: number, offX: number, offY: number) => {
      let nx = clientX - offX;
      let ny = clientY - offY - 30; // offset for menubar (layer top)
      nx = Math.max(0, Math.min(nx, window.innerWidth - 80));
      ny = Math.max(0, Math.min(ny, window.innerHeight - 100));
      setWins((prev) => prev.map((w) => (w.key === key ? { ...w, x: nx, y: ny } : w)));
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const openKeys = new Set(wins.filter((w) => !w.closing).map((w) => w.key));

  return (
    <div className="os-selection">
      {/* WALLPAPER */}
      <div
        id="wallpaper"
        className="os-wallpaper fixed inset-0 z-0 overflow-hidden bg-[var(--bg)]"
      >
        <div className="mesh absolute rounded-full blur-[80px] opacity-[.55] will-change-transform w-[60vw] h-[60vw] left-[-10vw] top-[-15vw] bg-[radial-gradient(circle,var(--v1),transparent_65%)] animate-drift1 motion-reduce:animate-none" />
        <div className="mesh absolute rounded-full blur-[80px] opacity-[.55] will-change-transform w-[55vw] h-[55vw] right-[-12vw] top-[5vh] bg-[radial-gradient(circle,var(--v2),transparent_65%)] animate-drift2 motion-reduce:animate-none" />
        <div className="mesh absolute rounded-full blur-[80px] opacity-[.55] will-change-transform w-[50vw] h-[50vw] left-[20vw] bottom-[-20vw] bg-[radial-gradient(circle,var(--v3),transparent_65%)] animate-drift3 motion-reduce:animate-none" />
      </div>
      <div className="grain-os" />

      {/* MENU BAR */}
      <div
        id="menubar"
        className="fixed top-0 left-0 right-0 h-[30px] z-[1000] flex items-center gap-0 px-[12px] bg-[var(--glass-bar)] [backdrop-filter:blur(24px)_saturate(1.4)] [-webkit-backdrop-filter:blur(24px)_saturate(1.4)] border-b border-[var(--line)] text-[13px] select-none"
      >
        <div className="flex items-center gap-[2px]">
          <span className="w-[15px] h-[15px] mr-[7px] [&>svg]:w-full [&>svg]:h-full [&>svg]:block">
            {MenubarLogo}
          </span>
          <span className="font-disp font-semibold mr-[14px] tracking-[.2px]">ashOS</span>
          <span className="px-[9px] py-[3px] rounded-[6px] cursor-default text-[var(--fg)] font-medium hover:bg-[var(--line2)]">
            File
          </span>
          <span className="px-[9px] py-[3px] rounded-[6px] cursor-default text-[var(--fg)] font-medium hover:bg-[var(--line2)] max-[760px]:hidden">
            View
          </span>
          <span className="px-[9px] py-[3px] rounded-[6px] cursor-default text-[var(--fg)] font-medium hover:bg-[var(--line2)] max-[760px]:hidden">
            Go
          </span>
          <span className="px-[9px] py-[3px] rounded-[6px] cursor-default text-[var(--fg)] font-medium hover:bg-[var(--line2)] max-[760px]:hidden">
            Help
          </span>
        </div>
        <div className="ml-auto flex items-center gap-[14px]">
          <span
            className="flex items-center text-[var(--fg)] opacity-[.85] [&>svg]:w-[17px] [&>svg]:h-[17px]"
            title="Wi-Fi"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 8.5a16 16 0 0120 0M5 12a11 11 0 0114 0M8 15.5a6 6 0 018 0" />
              <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span
            className="flex items-center text-[var(--fg)] opacity-[.85] [&>svg]:w-[17px] [&>svg]:h-[17px]"
            title="Battery"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="8" width="17" height="9" rx="2.5" />
              <rect x="4" y="10" width="11" height="5" rx="1" fill="currentColor" stroke="none" />
              <path d="M21 11v3" strokeLinecap="round" />
            </svg>
          </span>
          <span
            id="clock"
            className="[font-variant-numeric:tabular-nums] font-medium tracking-[.3px]"
          >
            {clock}
          </span>
          <span
            onClick={toggleTheme}
            title="Toggle theme"
            className="flex items-center gap-[5px] cursor-pointer px-[9px] py-[2px] rounded-[7px] border border-[var(--line2)] bg-[var(--line)] text-[11px] font-semibold transition-[background] duration-[200ms] hover:bg-[var(--line2)]"
          >
            <span className="flex items-center [&>svg]:w-[13px] [&>svg]:h-[13px]">
              {theme === "dark" ? MoonIcon : SunIcon}
            </span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </span>
        </div>
      </div>

      {/* DESKTOP */}
      <div id="desktop" className="fixed inset-[30px_0_0_0] z-[5] max-[760px]:static">
        <div className="absolute top-[18px] right-[18px] flex flex-col gap-[6px] max-[760px]:hidden">
          <DesktopIcon
            label="Projects"
            svg={DesktopProjectsIcon}
            onOpen={() => openWindow("projects")}
          />
          <DesktopIcon
            label="Résumé.pdf"
            svg={DesktopResumeIcon}
            onOpen={() => openWindow("resume")}
          />
          <DesktopIcon label="Trash" svg={DesktopTrashIcon} onOpen={() => openWindow("trash")} />
        </div>
      </div>

      {/* WINDOW LAYER */}
      <div
        id="window-layer"
        className="fixed inset-[30px_0_0_0] z-[10] pointer-events-none max-[760px]:static max-[760px]:flex max-[760px]:flex-col max-[760px]:gap-[16px] max-[760px]:px-[12px] max-[760px]:pt-[42px] max-[760px]:pb-[110px]"
      >
        {wins.map((w) => (
          <Window
            key={w.key}
            win={w}
            spec={CONTENT[w.key]}
            onClose={() => closeWindow(w.key)}
            onFocus={() => focusWindow(w.key)}
            onDrag={(cx, cy, ox, oy) => dragWindow(w.key, cx, cy, ox, oy)}
          />
        ))}
      </div>

      {/* DOCK */}
      <div
        id="dock"
        className="fixed bottom-[14px] left-1/2 -translate-x-1/2 z-[1100] flex items-end gap-[8px] px-[12px] py-[8px] bg-[var(--dock)] [backdrop-filter:blur(28px)_saturate(1.6)] [-webkit-backdrop-filter:blur(28px)_saturate(1.6)] border border-[var(--line2)] rounded-[20px] shadow-[0_18px_50px_-16px_rgba(0,0,0,.6)] max-[760px]:left-0 max-[760px]:right-0 max-[760px]:!transform-none max-[760px]:bottom-0 max-[760px]:rounded-none max-[760px]:justify-start max-[760px]:overflow-x-auto max-[760px]:gap-[14px] max-[760px]:px-[14px] max-[760px]:py-[10px]"
      >
        {DOCK.map(([key, label]) => (
          <div
            key={key}
            onClick={() => openWindow(key)}
            className="dock-app group/dock relative cursor-pointer transition-transform duration-[180ms] [transition-timing-function:cubic-bezier(.2,.9,.3,1)] origin-bottom hover:scale-[1.32] hover:-translate-y-[8px] max-[760px]:hover:transform-none"
          >
            <span className="dock-label absolute bottom-[64px] left-1/2 -translate-x-1/2 translate-y-[6px] opacity-0 bg-[var(--glass-bar)] border border-[var(--line2)] px-[10px] py-[3px] rounded-[8px] text-[11.5px] font-semibold whitespace-nowrap pointer-events-none transition-[opacity,transform] duration-[150ms] group-hover/dock:opacity-100 group-hover/dock:translate-y-0 max-[760px]:hidden">
              {label}
            </span>
            <span className="dock-ic w-[46px] h-[46px] rounded-[13px] grid place-items-center shadow-[0_6px_16px_-6px_rgba(0,0,0,.5)] text-white [&>svg]:w-[24px] [&>svg]:h-[24px] max-[760px]:w-[42px] max-[760px]:h-[42px]">
              {Icon[key]}
            </span>
            <span
              className={
                "dock-dot absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[var(--fg)] " +
                (openKeys.has(key) ? "opacity-[.7]" : "opacity-0")
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopIcon({
  label,
  svg,
  onOpen,
}: {
  label: string;
  svg: ReactNode;
  onOpen: () => void;
}) {
  return (
    <div
      onDoubleClick={onOpen}
      onClick={() => {
        if (isMobile()) onOpen();
      }}
      className="dicon w-[80px] flex flex-col items-center gap-[5px] px-[4px] py-[8px] rounded-[10px] cursor-pointer text-center transition-[background] duration-[150ms] border border-transparent hover:bg-[var(--line)] hover:border-[var(--line2)]"
    >
      <div className="w-[42px] h-[42px] [filter:drop-shadow(0_4px_8px_rgba(0,0,0,.3))] [&>svg]:w-full [&>svg]:h-full">
        {svg}
      </div>
      <span className="dicon-label text-[11.5px] font-medium leading-[1.2] bg-[rgba(0,0,0,.25)] px-[6px] py-[1px] rounded-[5px]">
        {label}
      </span>
    </div>
  );
}
