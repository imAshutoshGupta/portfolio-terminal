"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "@/lib/data";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  run: () => void;
};

export default function CommandPalette({
  onOpenOS,
  onToggleTheme,
}: {
  onOpenOS: () => void;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    lastFocus.current?.focus?.();
  }, []);

  const go = useCallback(
    (hash: string) => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      close();
    },
    [close]
  );

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = [
      { id: "work", label: "Selected Work", group: "Go to", run: () => go("#projects") },
      { id: "exp", label: "Experience", group: "Go to", run: () => go("#exp") },
      { id: "skills", label: "Toolkit", group: "Go to", run: () => go("#skills") },
      { id: "writing", label: "Writing", group: "Go to", run: () => go("#writing") },
      { id: "now", label: "Now Playing", group: "Go to", run: () => go("#nowplaying") },
      { id: "contact", label: "Contact", group: "Go to", run: () => go("#contact") },
    ];
    const cases: Cmd[] = PROJECTS.map((p) => ({
      id: "case-" + p.slug,
      label: p.name,
      hint: "case study",
      group: "Case studies",
      run: () => {
        window.location.href = "/work/" + p.slug;
      },
    }));
    const actions: Cmd[] = [
      {
        id: "ashos",
        label: "Launch ashOS",
        hint: "desktop mode",
        group: "Actions",
        run: () => {
          close();
          onOpenOS();
        },
      },
      {
        id: "theme",
        label: "Toggle theme",
        hint: "dark / light",
        group: "Actions",
        run: () => {
          onToggleTheme();
          close();
        },
      },
      {
        id: "email",
        label: "Copy email",
        hint: "hello@ashutoshgupta.dev",
        group: "Actions",
        run: () => {
          navigator.clipboard?.writeText("hello@ashutoshgupta.dev");
          close();
        },
      },
      {
        id: "gh",
        label: "GitHub",
        hint: "↗",
        group: "Links",
        run: () => window.open("https://github.com/imAshutoshGupta", "_blank", "noopener"),
      },
      {
        id: "li",
        label: "LinkedIn",
        hint: "↗",
        group: "Links",
        run: () => window.open("https://linkedin.com/in/imAshutoshGupta", "_blank", "noopener"),
      },
      {
        id: "resume",
        label: "Résumé",
        hint: "↓",
        group: "Links",
        run: () => window.open("/resume.pdf", "_blank", "noopener"),
      },
    ];
    return [...nav, ...cases, ...actions];
  }, [go, close, onOpenOS, onToggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          close();
        } else {
          lastFocus.current = document.activeElement as HTMLElement;
          setOpen(true);
          setActive(0);
        }
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[400] flex items-start justify-center pt-[14vh] px-4 bg-[rgba(0,0,0,.5)] [backdrop-filter:blur(4px)]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-[560px] border border-[var(--glass-brd)] rounded-[16px] bg-[var(--glass)] [backdrop-filter:blur(24px)_saturate(160%)] [-webkit-backdrop-filter:blur(24px)_saturate(160%)] shadow-[0_30px_80px_rgba(0,0,0,.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onListKey}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[var(--line)]">
          <span className="font-mono text-[13px] text-[var(--gold)]">➜</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Command palette search"
            spellCheck={false}
            className="flex-1 bg-transparent border-0 outline-none py-4 font-mono text-[14px] text-[var(--fg)] placeholder:text-[var(--faint)]"
          />
          <kbd className="font-mono text-[11px] text-[var(--faint)] border border-[var(--line2)] rounded-[6px] px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <ul className="max-h-[52vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-[13px] text-[var(--faint)]">No matches.</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => c.run()}
                className={
                  "w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer transition-colors " +
                  (i === active ? "bg-[color-mix(in_srgb,var(--gold)_14%,transparent)]" : "")
                }
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)] w-[88px] shrink-0">
                    {c.group}
                  </span>
                  <span className="text-[14px] text-[var(--fg)] truncate">{c.label}</span>
                </span>
                {c.hint && (
                  <span className="font-mono text-[11px] text-[var(--muted)] shrink-0">{c.hint}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
