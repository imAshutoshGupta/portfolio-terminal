"use client";

import { useEffect, useRef, useState } from "react";
import { runCommand, complete, type Row, type SegColor } from "@/lib/repl";

const TYPE_TEXT = "Ashutosh Gupta — full-stack engineer ✦ SF";

const COLOR: Record<SegColor, string> = {
  gold: "var(--gold)",
  green: "var(--green)",
  fg: "var(--fg)",
  muted: "var(--muted)",
  faint: "var(--faint)",
};

function RowView({ row }: { row: Row }) {
  return (
    <div className="text-[var(--muted)]">
      {row.map((seg, i) => (
        <span key={i} style={seg.c ? { color: COLOR[seg.c] } : undefined}>
          {seg.t}
        </span>
      ))}
    </div>
  );
}

type HistoryItem = { cmd: string; rows: Row[] };

export type TerminalAction =
  | { type: "openOS" }
  | { type: "theme"; value?: "dark" | "light" }
  | { type: "nav"; href: string; external?: boolean };

const Cursor = () => (
  <span className="inline-block w-2 h-4 bg-[var(--gold)] align-[-3px] animate-blink" />
);

export default function HeroTerminal({ onAction }: { onAction: (a: TerminalAction) => void }) {
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLInputElement>(null);

  // typewriter on the whoami line — same 42ms/char cadence as the original
  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i <= TYPE_TEXT.length) {
        setTyped(TYPE_TEXT.slice(0, i));
        i++;
        timer = setTimeout(tick, 42);
      } else {
        setTypingDone(true);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  function submit(raw: string) {
    const res = runCommand(raw);
    if (res.action?.type === "clear") {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { cmd: raw, rows: res.rows }]);
      if (res.action) {
        if (res.action.type === "nav") {
          if (res.action.external) window.open(res.action.href, "_blank", "noopener");
          else window.location.href = res.action.href;
        } else if (res.action.type === "openOS") {
          onAction({ type: "openOS" });
        } else if (res.action.type === "theme") {
          onAction({ type: "theme", value: res.action.value });
        }
      }
    }
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = complete(input);
      if (hit) setInput(hit + " ");
    }
  }

  return (
    <div
      className="border border-[var(--glass-brd)] rounded-[14px] bg-[var(--glass)] [backdrop-filter:blur(20px)_saturate(150%)] [-webkit-backdrop-filter:blur(20px)_saturate(150%)] shadow-[0_30px_80px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.08)] overflow-hidden [transform-style:preserve-3d] [transition:transform_.15s_ease-out] will-change-transform"
      id="tilt"
      onClick={() => captureRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-[7px] px-[14px] py-3 border-b border-[var(--line)]">
        <i className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
        <i className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
        <i className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
        <span className="ml-1.5 font-mono text-[11px] text-[var(--faint)]">
          zsh — ashutosh@gupta — 64×18
        </span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        className="pt-[22px] px-5 pb-[26px] font-mono text-[13.5px] leading-[1.85] [transform:translateZ(40px)] max-h-[60vh] overflow-y-auto"
      >
        <div>
          <span className="text-[var(--gold)]">➜</span>{" "}
          <span className="text-[var(--fg)]">whoami</span>
        </div>
        <div className="text-[var(--muted)]">
          {typed}
          {!typingDone && <span className="opacity-50">▋</span>}
        </div>
        <div className="mt-2.5">
          <span className="text-[var(--gold)]">➜</span>{" "}
          <span className="text-[var(--fg)]">cat stack.json</span>
        </div>
        <div className="text-[var(--muted)]">
          {"{ "}
          <span className="text-[var(--green)]">&quot;role&quot;</span>:{" "}
          <span className="text-[var(--fg)]">&quot;full-stack&quot;</span>,
        </div>
        <div className="text-[var(--muted)]">
          &nbsp;&nbsp;<span className="text-[var(--green)]">&quot;years&quot;</span>:{" "}
          <span className="text-[var(--fg)]">6</span>,{" "}
          <span className="text-[var(--green)]">&quot;scale&quot;</span>:{" "}
          <span className="text-[var(--fg)]">&quot;40M req/day&quot;</span> {"}"}
        </div>

        {/* interactive history */}
        {history.map((h, i) => (
          <div key={i} className="mt-2.5">
            <div>
              <span className="text-[var(--gold)]">➜</span>{" "}
              <span className="text-[var(--fg)]">{h.cmd}</span>
            </div>
            {h.rows.map((row, j) => (
              <RowView key={j} row={row} />
            ))}
          </div>
        ))}

        {/* live prompt */}
        <div className="mt-2.5">
          <span className="text-[var(--gold)]">➜</span>{" "}
          <span className="text-[var(--fg)] whitespace-pre-wrap break-words">{input}</span>
          <Cursor />
        </div>

        {/* off-screen capture input keeps the block cursor look while staying typeable + accessible */}
        <input
          ref={captureRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command input — type help"
          spellCheck={false}
          autoComplete="off"
          className="fixed -left-[9999px] w-px h-px opacity-0"
        />
      </div>
    </div>
  );
}
