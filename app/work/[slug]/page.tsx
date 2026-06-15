import "../../theme-luxe.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.name} — Ashutosh Gupta`,
    description: project.blurb,
    openGraph: {
      title: `${project.name} — case study`,
      description: project.blurb,
      images: [{ url: `/og?title=${encodeURIComponent(project.name)}`, width: 1200, height: 630 }],
    },
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen">
      <div className="bg-layer">
        <div className="bg-grid" />
        <div className="bg-glow" />
        <div className="bg-vignette" />
      </div>
      <div className="grain-luxe" />

      <div className="max-w-[820px] mx-auto px-10 max-[640px]:px-[22px] relative z-[2] pt-[120px] pb-[120px]">
        <Link
          href="/#projects"
          className="font-mono text-[12px] text-[var(--muted)] no-underline hover:text-[var(--gold)] transition-colors"
        >
          ← cd ~/work
        </Link>

        <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
          <div className="font-mono text-[12px] text-[var(--faint)]">{project.no}</div>
          <div className="font-mono text-[12px] text-[var(--gold)]">{project.stars}</div>
        </div>

        <h1 className="font-disp font-semibold text-[clamp(44px,8vw,84px)] tracking-[-0.03em] leading-[0.92] mt-3 mb-5">
          {project.name}
        </h1>
        <p className="text-[18px] text-[var(--muted)] max-w-[620px] leading-[1.6]">{project.blurb}</p>

        <div className="flex gap-[7px] flex-wrap mt-6">
          {project.stack.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] text-[var(--muted)] border border-[var(--line2)] rounded-[7px] px-[9px] py-[3px]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[14px] overflow-hidden mt-12 max-[640px]:grid-cols-1">
          {project.metrics.map((mt) => (
            <div key={mt.label} className="bg-[var(--bg2)] p-[22px]">
              <div className="font-disp font-medium text-[30px] tracking-[-0.02em]">
                <span className="bg-[linear-gradient(120deg,var(--gold),var(--gold2))] bg-clip-text text-transparent [-webkit-background-clip:text]">
                  {mt.value}
                </span>
              </div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] mt-1">
                {mt.label}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <div className="font-mono text-[13px] text-[var(--muted)] mb-4">
            <span className="text-[var(--gold)]">~/</span>problem
          </div>
          <p className="text-[17px] text-[var(--fg)] leading-[1.7] max-w-[640px]">{project.problem}</p>
        </section>

        <section className="mt-14">
          <div className="font-mono text-[13px] text-[var(--muted)] mb-4">
            <span className="text-[var(--gold)]">~/</span>approach
          </div>
          <ul className="flex flex-col gap-3 max-w-[640px]">
            {project.approach.map((a, i) => (
              <li key={i} className="flex gap-3 text-[16px] text-[var(--muted)] leading-[1.6]">
                <span className="font-mono text-[var(--gold)] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {project.snippet && (
          <section className="mt-14">
            <div className="font-mono text-[13px] text-[var(--muted)] mb-4">
              <span className="text-[var(--gold)]">~/</span>snippet
              <span className="text-[var(--faint)]"> — {project.snippet.lang}</span>
            </div>
            <pre className="border border-[var(--glass-brd)] rounded-[14px] bg-[var(--glass)] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] p-6 overflow-x-auto font-mono text-[13px] leading-[1.7] text-[var(--fg)]">
              {project.snippet.code}
            </pre>
          </section>
        )}

        <div className="mt-16 flex gap-[14px] flex-wrap">
          <a
            href={project.href}
            target="_blank"
            rel="noopener"
            className="font-mono text-[13px] no-underline px-[22px] py-[13px] rounded-[11px] transition-all duration-[220ms] inline-flex items-center gap-2 text-[var(--bg)] bg-[linear-gradient(120deg,var(--gold2),var(--gold))] font-medium shadow-[0_8px_26px_color-mix(in_srgb,var(--gold)_35%,transparent)] hover:-translate-y-0.5"
          >
            view on github ↗
          </a>
          <Link
            href="/#projects"
            className="font-mono text-[13px] no-underline px-[22px] py-[13px] rounded-[11px] transition-all duration-[220ms] inline-flex items-center gap-2 border border-[var(--line2)] text-[var(--fg)] hover:border-[var(--gold)] hover:-translate-y-0.5"
          >
            ← back to work
          </Link>
        </div>
      </div>
    </main>
  );
}
