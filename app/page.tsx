"use client";

import "./theme-luxe.css";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroTerminal, { type TerminalAction } from "@/components/HeroTerminal";
import CommandPalette from "@/components/CommandPalette";
import NowPlaying from "@/components/NowPlaying";
import { PROJECTS } from "@/lib/data";

const MARQUEE_WORDS = ["TypeScript", "Next.js", "NestJS", "React", "Node", "AWS", "Postgres"];

function MarqueeSpan() {
  return (
    <span className="font-disp font-semibold text-[clamp(24px,3.4vw,40px)] uppercase mx-4 text-[var(--muted)] tracking-normal">
      {MARQUEE_WORDS.map((w) => (
        <span key={w}>
          {w}
          {/* the original's `.marquee span` rule margins EVERY span (incl. the
              separator) by 0 16px — replicate the 16px each side here */}
          <span className="mx-4 text-[var(--gold)] [-webkit-text-stroke:0]"> / </span>
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [osOpen, setOsOpen] = useState(false);
  const [osTheme, setOsTheme] = useState<"dark" | "light">("dark");
  const exitRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = useCallback((value?: "dark" | "light") => {
    const h = document.documentElement;
    const next = value ?? (h.getAttribute("data-theme") === "dark" ? "light" : "dark");
    h.setAttribute("data-theme", next);
  }, []);

  const openOS = useCallback(() => {
    const th = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setOsTheme(th);
    setOsOpen(true);
  }, []);
  const closeOS = useCallback(() => setOsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = osOpen ? "hidden" : "";
    if (osOpen) exitRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [osOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOS();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOS]);

  // parallax · 3D tilt · kinetic headline · scroll reveal — ported from the original
  useEffect(() => {
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const players = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const grid = document.getElementById("pGrid");
    const glow = document.getElementById("pGlow");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        players.forEach((el) => {
          const s = parseFloat(el.dataset.parallax || "0");
          el.style.transform = `translateY(${y * s * -1}px)`;
        });
        if (grid) grid.style.transform = `translateY(${y * 0.18}px)`;
        if (glow) glow.style.transform = `translateX(-50%) translateY(${y * 0.3}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const cleanups: (() => void)[] = [];
    function bindTilt(el: HTMLElement, max: number) {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `rotateY(${(px - 0.5) * max}deg) rotateX(${(0.5 - py) * max}deg)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      };
      const leave = () => {
        el.style.transform = "rotateY(0) rotateX(0)";
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    }
    if (fine) {
      const tilt = document.getElementById("tilt");
      if (tilt) bindTilt(tilt, 9);
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((c) => bindTilt(c, 7));
    }

    let kinMove: ((e: MouseEvent) => void) | null = null;
    const kin = document.getElementById("kin");
    if (fine && kin && !reduce) {
      const lns = Array.from(kin.querySelectorAll<HTMLElement>(".ln"));
      kinMove = (e: MouseEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        lns.forEach((l) => {
          const d = parseFloat(l.dataset.depth || "0");
          l.style.transform = `translate(${cx * 36 * d}px,${cy * 18 * d}px)`;
        });
      };
      window.addEventListener("mousemove", kinMove);
    }

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((fn) => fn());
      if (kinMove) window.removeEventListener("mousemove", kinMove);
      io.disconnect();
    };
  }, []);

  const onTerminalAction = (a: TerminalAction) => {
    if (a.type === "openOS") openOS();
    else if (a.type === "theme") toggleTheme(a.value);
  };

  return (
    <>
      {/* layered background */}
      <div className="bg-layer">
        <div className="bg-grid" id="pGrid" />
        <div className="bg-glow" id="pGlow" />
        <div className="bg-vignette" />
      </div>
      <div className="grain-luxe" />

      {/* nav */}
      <nav className="fixed top-4 left-0 right-0 z-[60]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between pt-[10px] pr-[12px] pb-[10px] pl-[20px] border border-[var(--glass-brd)] rounded-[14px] bg-[var(--glass)] [backdrop-filter:blur(18px)_saturate(160%)] [-webkit-backdrop-filter:blur(18px)_saturate(160%)] shadow-[0_8px_30px_rgba(0,0,0,.25)]">
          <span className="font-mono font-bold text-[14px] flex items-center gap-2">
            ashutosh<span className="text-[var(--gold)]">@</span>gupta
            <span className="text-[var(--gold)]">:~$</span>
          </span>
          <div className="flex gap-1 items-center">
            {[
              { href: "#projects", label: "./work" },
              { href: "#exp", label: "./experience" },
              { href: "#skills", label: "./skills" },
              { href: "#nowplaying", label: "./now-playing" },
              { href: "#contact", label: "./contact" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link font-mono text-[12px] tracking-[0.02em] text-[var(--muted)] no-underline px-3 py-2 rounded-[9px] transition-all duration-200 max-[760px]:hidden"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={openOS}
              title="Launch the ashOS desktop"
              aria-label="Launch the ashOS desktop"
              className="os-launch-btn font-mono text-[12px] text-[var(--gold)] px-[13px] py-2 rounded-[9px] cursor-pointer inline-flex items-center gap-[7px] transition-all duration-200 whitespace-nowrap hover:-translate-y-px"
            >
              ▦ ashOS
            </button>
            <button
              onClick={() => toggleTheme()}
              aria-label="Toggle theme"
              className="w-[34px] h-[34px] rounded-[9px] border border-[var(--line2)] bg-transparent text-[var(--fg)] cursor-pointer text-[13px] transition-all duration-300 hover:border-[var(--gold)] hover:rotate-[20deg]"
            >
              ◐
            </button>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="pt-[140px] pb-[60px] relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div
            className="flex justify-between items-center border-b border-[var(--line)] pb-4 mb-[34px] flex-wrap gap-[10px]"
            data-parallax="0.12"
          >
            <span className="font-mono text-[12px] tracking-[0.04em] text-[var(--muted)]">
              <span className="text-[var(--gold)]">~/</span>portfolio — full-stack engineer
            </span>
            <span className="flex items-center gap-[9px] font-mono text-[12px] text-[var(--muted)]">
              <span className="avail-dot w-[7px] h-[7px] rounded-full bg-[var(--green)] animate-pl" />{" "}
              available for select roles
            </span>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-[50px] items-center max-[900px]:grid-cols-1 max-[900px]:gap-9">
            <div data-parallax="0.05">
              <h1
                id="kin"
                className="font-disp font-semibold text-[clamp(52px,10vw,132px)] leading-[0.82] tracking-[-0.04em] my-[6px] uppercase"
              >
                <span className="ln block will-change-transform" data-depth="0.45">
                  ASHUTOSH
                </span>
                <span
                  className="ln block will-change-transform [-webkit-text-stroke:1.4px_var(--fg)] text-transparent"
                  data-depth="0.85"
                >
                  GUPTA
                  <span className="text-[var(--gold)] font-medium [-webkit-text-stroke:0]">*</span>
                </span>
              </h1>
              <div className="font-disp font-semibold text-[clamp(20px,2.7vw,34px)] uppercase tracking-[-0.01em] mt-6 mb-2 bg-[linear-gradient(110deg,var(--gold),var(--gold2))] bg-clip-text text-transparent [-webkit-background-clip:text] inline-block">
                Full-Stack Engineer
              </div>
              <div className="font-mono text-[14px] text-[var(--muted)] tracking-[0.02em] mb-[14px]">
                › Next.js · NestJS · React · Node · AWS
              </div>
              <p className="max-w-[440px] text-[18px] text-[var(--muted)]">
                I design and engineer products end-to-end — from Postgres schema to the last pixel.
                Six years shipping software at scale.
              </p>
              <div className="flex gap-3 mt-8 flex-wrap">
                <a
                  href="#projects"
                  className="font-mono text-[13px] no-underline px-[22px] py-[13px] rounded-[11px] transition-all duration-[220ms] inline-flex items-center gap-2 cursor-pointer text-[var(--bg)] bg-[linear-gradient(120deg,var(--gold2),var(--gold))] font-medium shadow-[0_8px_26px_color-mix(in_srgb,var(--gold)_35%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_color-mix(in_srgb,var(--gold)_50%,transparent)]"
                >
                  view work →
                </a>
                <button
                  onClick={openOS}
                  className="font-mono text-[13px] px-[22px] py-[13px] rounded-[11px] transition-all duration-[220ms] inline-flex items-center gap-2 bg-transparent border border-[var(--line2)] cursor-pointer text-[var(--fg)] hover:border-[var(--gold)] hover:-translate-y-0.5"
                >
                  ▦ launch ashOS →
                </button>
                <a
                  href="/resume.pdf"
                  className="font-mono text-[13px] no-underline px-[22px] py-[13px] rounded-[11px] transition-all duration-[220ms] inline-flex items-center gap-2 bg-transparent border border-[var(--line2)] cursor-pointer text-[var(--fg)] hover:border-[var(--gold)] hover:-translate-y-0.5"
                >
                  resume.pdf ↓
                </a>
              </div>
            </div>

            <div className="[perspective:1400px]" data-parallax="0.16">
              <HeroTerminal onAction={onTerminalAction} />
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[14px] overflow-hidden mt-14 max-[760px]:grid-cols-2">
            <div className="stat-cell bg-[var(--bg2)] p-[22px] transition-[background] duration-300">
              <div className="font-disp font-medium text-[34px] tracking-[-0.02em]">
                <span className="text-[var(--gold)]">6</span>+
              </div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] mt-1">
                Years shipping
              </div>
            </div>
            <div className="stat-cell bg-[var(--bg2)] p-[22px] transition-[background] duration-300">
              <div className="font-disp font-medium text-[34px] tracking-[-0.02em]">
                40<span className="text-[var(--gold)]">M</span>
              </div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] mt-1">
                Req / day
              </div>
            </div>
            <div className="stat-cell bg-[var(--bg2)] p-[22px] transition-[background] duration-300">
              <div className="font-disp font-medium text-[34px] tracking-[-0.02em]">12</div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] mt-1">
                Products launched
              </div>
            </div>
            <div className="stat-cell bg-[var(--bg2)] p-[22px] transition-[background] duration-300">
              <div className="font-disp font-medium text-[34px] tracking-[-0.02em]">
                4.2<span className="text-[var(--gold)]">k</span>
              </div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] mt-1">
                OSS stars
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* marquee */}
      <div className="overflow-hidden border-t border-b border-[var(--line)] py-[18px] my-[70px] whitespace-nowrap marquee-mask">
        <div className="mq-track inline-block animate-scroll">
          <MarqueeSpan />
          <MarqueeSpan />
        </div>
      </div>

      {/* projects */}
      <section id="projects" className="py-20 relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div className="reveal flex items-end justify-between gap-5 mb-12 flex-wrap">
            <div>
              <div className="font-mono text-[13px] text-[var(--muted)] mb-[14px]">
                <span className="text-[var(--gold)]">~/</span>work{" "}
                <span className="text-[var(--faint)]">— ls -la --sort=stars</span>
              </div>
              <h2 className="font-disp font-medium text-[clamp(34px,5vw,60px)] tracking-[-0.03em] leading-[0.95]">
                Selected Work
              </h2>
            </div>
            <div className="font-mono text-[12px] text-[var(--faint)] text-right max-w-[280px]">
              // products built, scaled &amp; shipped to real users
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[18px] [perspective:1600px] max-[760px]:grid-cols-1">
            {PROJECTS.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                data-tilt
                className="proj-card group reveal block no-underline border border-[var(--glass-brd)] rounded-[18px] bg-[var(--glass)] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] p-7 [transform-style:preserve-3d] [transition:transform_.18s_ease-out,border-color_.3s] will-change-transform relative overflow-hidden hover:border-[var(--line2)]"
              >
                <div className="[transform:translateZ(34px)]">
                  <div className="flex justify-between items-start mb-[18px]">
                    <span className="font-mono text-[12px] text-[var(--faint)]">{p.no}</span>
                    <span className="font-mono text-[12px] text-[var(--gold)]">{p.stars}</span>
                  </div>
                  <h3 className="font-disp font-medium text-[30px] tracking-[-0.02em] mb-2.5 text-[var(--fg)]">
                    {p.name}
                  </h3>
                  <p className="text-[var(--muted)] text-[14.5px] mb-[18px] max-w-[90%]">{p.blurb}</p>
                  <div className="flex gap-[7px] flex-wrap">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] text-[var(--muted)] border border-[var(--line2)] rounded-[7px] px-[9px] py-[3px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="absolute right-6 bottom-6 font-mono text-[18px] text-[var(--gold)] opacity-0 -translate-x-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* experience */}
      <section id="exp" className="py-20 relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div className="reveal flex items-end justify-between gap-5 mb-12 flex-wrap">
            <div>
              <div className="font-mono text-[13px] text-[var(--muted)] mb-[14px]">
                <span className="text-[var(--gold)]">~/</span>experience{" "}
                <span className="text-[var(--faint)]">— git log --oneline</span>
              </div>
              <h2 className="font-disp font-medium text-[clamp(34px,5vw,60px)] tracking-[-0.03em] leading-[0.95]">
                Experience
              </h2>
            </div>
            <div className="font-mono text-[12px] text-[var(--faint)] text-right max-w-[280px]">
              // senior IC across fintech &amp; dev-tooling teams
            </div>
          </div>

          <div className="reveal border border-[var(--glass-brd)] rounded-[18px] bg-[var(--glass)] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] overflow-hidden">
            {[
              { node: "●", yr: "2023 — now", role: "Senior Software Engineer", co: "@ Vercel · Platform team", loc: "San Francisco" },
              { node: "○", yr: "2021 — 2023", role: "Full-Stack Engineer", co: "@ Stripe · Payments infrastructure", loc: "Remote" },
              { node: "○", yr: "2019 — 2021", role: "Software Engineer", co: "@ Startup (acquired)", loc: "New York" },
              { node: "○", yr: "2015 — 2019", role: "B.S. Computer Science", co: "@ UC Berkeley", loc: "Berkeley" },
            ].map((r, i) => (
              <div
                key={i}
                className="xp-row grid grid-cols-[26px_130px_1fr_auto] gap-[18px] px-[26px] py-[22px] border-b border-[var(--line)] items-center transition-all duration-[250ms] last:border-b-0 max-[760px]:grid-cols-[20px_1fr] max-[760px]:gap-[10px]"
              >
                <span className="font-mono text-[var(--gold)] text-[13px]">{r.node}</span>
                <span className="font-mono text-[12px] text-[var(--faint)] max-[760px]:hidden">{r.yr}</span>
                <div>
                  <div className="font-disp font-medium text-[19px] tracking-[-0.01em]">{r.role}</div>
                  <div className="font-mono text-[13px] text-[var(--gold-dim)] mt-[3px]">{r.co}</div>
                </div>
                <span className="font-mono text-[12px] text-[var(--faint)] max-[760px]:hidden">{r.loc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section id="skills" className="py-20 relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div className="reveal flex items-end justify-between gap-5 mb-12 flex-wrap">
            <div>
              <div className="font-mono text-[13px] text-[var(--muted)] mb-[14px]">
                <span className="text-[var(--gold)]">~/</span>skills{" "}
                <span className="text-[var(--faint)]">— cat toolkit.json</span>
              </div>
              <h2 className="font-disp font-medium text-[clamp(34px,5vw,60px)] tracking-[-0.03em] leading-[0.95]">
                Toolkit
              </h2>
            </div>
            <div className="font-mono text-[12px] text-[var(--faint)] text-right max-w-[280px]">
              // depth across the whole stack
            </div>
          </div>

          <div className="reveal grid grid-cols-4 gap-[30px] max-[760px]:grid-cols-2 max-[760px]:gap-6">
            {[
              { gh: "// languages", lines: ["TypeScript", "Python", "Go"] },
              { gh: "// frontend", lines: ["Next.js", "React", "Tailwind"] },
              { gh: "// backend", lines: ["Node.js", "NestJS", "GraphQL · tRPC"] },
              { gh: "// infra & data", lines: ["AWS · Docker", "Terraform", "Postgres · Redis"] },
            ].map((g, i) => (
              <div key={i}>
                <div className="font-mono text-[12px] text-[var(--gold)] border-b border-[var(--line)] pb-[9px] mb-[14px]">
                  {g.gh}
                </div>
                <div className="font-disp font-normal text-[19px] leading-[1.95]">
                  {g.lines.map((l, j) => (
                    <span key={j}>
                      {l}
                      {j < g.lines.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* writing */}
      <section id="writing" className="py-20 relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div className="reveal flex items-end justify-between gap-5 mb-12 flex-wrap">
            <div>
              <div className="font-mono text-[13px] text-[var(--muted)] mb-[14px]">
                <span className="text-[var(--gold)]">~/</span>writing{" "}
                <span className="text-[var(--faint)]">— tail -n 3 posts/</span>
              </div>
              <h2 className="font-disp font-medium text-[clamp(34px,5vw,60px)] tracking-[-0.03em] leading-[0.95]">
                Writing
              </h2>
            </div>
            <div className="font-mono text-[12px] text-[var(--faint)] text-right max-w-[280px]">
              // notes on systems, performance &amp; craft
            </div>
          </div>

          <div className="reveal">
            {[
              { dt: "Apr 2026", ttl: "Scaling WebSockets to a million connections", tag: "12 min ↗" },
              { dt: "Jan 2026", ttl: "Why we finally moved off the ORM", tag: "8 min ↗" },
              { dt: "Nov 2025", ttl: "A tiny Rust core for a TypeScript CLI", tag: "10 min ↗" },
            ].map((w, i) => (
              <div
                key={i}
                className="grid grid-cols-[120px_1fr_auto] gap-5 py-[22px] border-t border-[var(--line)] items-baseline transition-all duration-[250ms] hover:pl-[14px] last:border-b last:border-[var(--line)] max-[640px]:grid-cols-1 max-[640px]:gap-[5px]"
              >
                <span className="font-mono text-[12px] text-[var(--faint)]">{w.dt}</span>
                <div className="font-disp font-medium text-[22px] tracking-[-0.01em]">{w.ttl}</div>
                <span className="font-mono text-[12px] text-[var(--gold-dim)]">{w.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* now playing */}
      <section id="nowplaying" className="py-20 relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2]">
          <div className="reveal flex items-end justify-between gap-5 mb-12 flex-wrap">
            <div>
              <div className="font-mono text-[13px] text-[var(--muted)] mb-[14px]">
                <span className="text-[var(--gold)]">~/</span>now-playing{" "}
                <span className="text-[var(--faint)]">— spotify --current</span>
              </div>
              <h2 className="font-disp font-medium text-[clamp(34px,5vw,60px)] tracking-[-0.03em] leading-[0.95]">
                Now Playing
              </h2>
            </div>
            <div className="font-mono text-[12px] text-[var(--faint)] text-right max-w-[280px]">
              // live from my Spotify · wired to the API in prod
            </div>
          </div>
          <div className="reveal">
            <NowPlaying />
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="text-center pt-[120px] pb-[90px] relative">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2] reveal">
          <div className="font-mono text-[13px] text-[var(--muted)] mb-[26px]">
            <span className="text-[var(--green)]">➜</span> ./say-hello.sh
          </div>
          <a
            href="mailto:hello@ashutoshgupta.dev"
            className="font-disp font-medium text-[clamp(34px,7vw,92px)] tracking-[-0.03em] text-[var(--fg)] no-underline leading-[1.02] inline-block transition-all duration-300 hover:text-[var(--gold)]"
          >
            hello@ashutoshgupta.dev
          </a>
          <div className="flex gap-[14px] justify-center mt-[46px] flex-wrap">
            {[
              { label: "GitHub ↗", href: "https://github.com/imAshutoshGupta" },
              { label: "LinkedIn ↗", href: "https://linkedin.com/in/imAshutoshGupta" },
              { label: "Twitter / X ↗", href: "https://x.com/imAshutoshGupta" },
              { label: "Résumé ↓", href: "/resume.pdf" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-mono text-[12px] text-[var(--muted)] no-underline border border-[var(--line2)] px-[18px] py-2.5 rounded-[10px] transition-all duration-[250ms] hover:text-[var(--bg)] hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:-translate-y-0.5"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--line)] py-7">
        <div className="max-w-[1200px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2] flex justify-between flex-wrap gap-2 font-mono text-[12px] tracking-[0.04em] text-[var(--muted)]">
          <span>© 2026 Ashutosh Gupta</span>
          <span>Luxe Terminal · designed &amp; built end-to-end</span>
          <span>exit 0</span>
        </div>
      </footer>

      {/* ashOS desktop takeover */}
      {osOpen && (
        <div
          className="fixed inset-0 z-[300] bg-[var(--bg)] flex flex-col animate-os-in"
          role="dialog"
          aria-modal="true"
          aria-label="ashOS desktop mode"
        >
          <div className="flex justify-between items-center px-4 py-[9px] bg-[#08070d] border-b border-[rgba(255,255,255,.12)]">
            <span className="font-mono text-[12px] text-[#9b97ad] flex items-center gap-[9px]">
              <span className="w-2 h-2 rounded-full bg-[#1ed760] shadow-[0_0_8px_#1ed760]" /> ashOS —
              desktop mode · running
            </span>
            <button
              ref={exitRef}
              onClick={closeOS}
              className="font-mono text-[12px] text-white bg-[rgba(255,255,255,.1)] border border-[rgba(255,255,255,.22)] px-[15px] py-[7px] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[rgba(255,255,255,.2)]"
            >
              ✕ Exit to site
            </button>
          </div>
          <iframe
            title="ashOS desktop"
            src={`/desktop?theme=${osTheme}`}
            className="flex-1 border-none w-full bg-[#0c0a16]"
          />
        </div>
      )}

      <CommandPalette onOpenOS={openOS} onToggleTheme={() => toggleTheme()} />
    </>
  );
}
