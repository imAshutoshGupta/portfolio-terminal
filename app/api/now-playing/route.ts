import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyItem = {
  name: string;
  duration_ms: number;
  artists: { name: string }[];
};

async function getAccessToken(id: string, secret: string, refresh: string): Promise<string | null> {
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function GET() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  // No creds → the client keeps the exact simulated rotation from the preview.
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ live: false });
  }

  try {
    const token = await getAccessToken(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN
    );
    if (!token) return NextResponse.json({ live: false });

    const headers = { Authorization: `Bearer ${token}` };
    const now = await fetch(NOW_PLAYING_URL, { headers, cache: "no-store" });

    if (now.status === 200) {
      const data = await now.json();
      const item = data.item as SpotifyItem | null;
      if (item) {
        return NextResponse.json({
          live: true,
          isPlaying: Boolean(data.is_playing),
          title: item.name,
          artist: item.artists.map((a) => a.name).join(", "),
          progressMs: data.progress_ms ?? 0,
          durationMs: item.duration_ms,
        });
      }
    }

    // Nothing playing — fall back to the most recent track, marked not-playing.
    const recent = await fetch(RECENT_URL, { headers, cache: "no-store" });
    if (recent.ok) {
      const data = await recent.json();
      const item = data.items?.[0]?.track as SpotifyItem | undefined;
      if (item) {
        return NextResponse.json({
          live: true,
          isPlaying: false,
          title: item.name,
          artist: item.artists.map((a) => a.name).join(", "),
          progressMs: 0,
          durationMs: item.duration_ms,
        });
      }
    }

    return NextResponse.json({ live: false });
  } catch {
    return NextResponse.json({ live: false });
  }
}
