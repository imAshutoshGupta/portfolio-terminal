"use client";

import { useEffect, useRef, useState } from "react";
import { FALLBACK_TRACKS } from "@/lib/data";

const fmt = (s: number) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

type Track = { title: string; artist: string; durationSec: number };

export default function NowPlaying() {
  const [track, setTrack] = useState<Track>(FALLBACK_TRACKS[0]);
  const [status, setStatus] = useState("Listening on Spotify");
  const [pos, setPos] = useState(() => Math.floor(FALLBACK_TRACKS[0].durationSec * 0.18));
  const [paused, setPaused] = useState(false);
  const idxRef = useRef(0);
  const liveRef = useRef(false);

  // Try the real endpoint; without creds it returns live:false and we keep the
  // exact simulated rotation the preview used.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/now-playing")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.live) return;
        liveRef.current = true;
        setTrack({ title: d.title, artist: d.artist, durationSec: Math.round(d.durationMs / 1000) });
        setPos(Math.round(d.progressMs / 1000));
        setStatus(d.isPlaying ? "Listening on Spotify" : "Last played");
        setPaused(!d.isPlaying);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) {
      setPaused(true);
      return;
    }
    const id = setInterval(() => {
      setPos((p) => {
        const next = p + 1;
        if (next >= track.durationSec) {
          if (!liveRef.current) {
            const ni = (idxRef.current + 1) % FALLBACK_TRACKS.length;
            idxRef.current = ni;
            setTrack(FALLBACK_TRACKS[ni]);
            return Math.floor(FALLBACK_TRACKS[ni].durationSec * 0.18);
          }
          return track.durationSec;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [track]);

  return (
    <div className="flex items-center gap-[22px] border border-[var(--glass-brd)] rounded-[18px] bg-[var(--glass)] [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)] px-6 py-[22px] max-w-[580px] relative overflow-hidden max-[560px]:flex-wrap">
      <div className="w-[88px] h-[88px] rounded-[12px] flex-none bg-[linear-gradient(135deg,var(--gold),var(--gold2))] relative grid place-items-center shadow-[0_10px_30px_color-mix(in_srgb,var(--gold)_30%,transparent)]">
        <span className="flex gap-[3px] items-end h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <i
              key={i}
              className="eq-bar w-[5px] h-2 bg-[rgba(255,255,255,.92)] rounded-[2px] animate-eqbar"
              style={{
                animationDelay: [0, 0.15, 0.35, 0.05, 0.25][i] + "s",
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          ))}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#1ed760] flex items-center gap-[7px] mb-2">
          <span className="w-[7px] h-[7px] rounded-full bg-[#1ed760] shadow-[0_0_8px_#1ed760]" />
          <span>{status}</span>
        </div>
        <div className="font-disp font-semibold text-[21px] tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
          {track.title}
        </div>
        <div className="text-[var(--muted)] text-[14px] mb-[13px] whitespace-nowrap overflow-hidden text-ellipsis">
          {track.artist}
        </div>
        <div className="h-[5px] rounded-[3px] bg-[var(--line2)] overflow-hidden">
          <span
            className="block h-full bg-[linear-gradient(90deg,var(--gold),var(--gold2))] rounded-[3px] [transition:width_.9s_linear]"
            style={{ width: (pos / track.durationSec) * 100 + "%" }}
          />
        </div>
        <div className="flex justify-between font-mono text-[11px] text-[var(--faint)] mt-[7px]">
          <span>{fmt(pos)}</span>
          <span>{fmt(track.durationSec)}</span>
        </div>
      </div>
      <div className="absolute top-[18px] right-5 font-mono text-[12px] text-[#1ed760] max-[560px]:hidden">
        ♫ Spotify
      </div>
    </div>
  );
}
