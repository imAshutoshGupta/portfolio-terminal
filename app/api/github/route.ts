import { NextResponse } from "next/server";
import { PROJECTS } from "@/lib/data";

export const revalidate = 3600; // cache an hour

const FALLBACK = {
  live: false as const,
  totalStars: PROJECTS.reduce((n, p) => n + p.starsCount, 0),
  repos: PROJECTS.map((p) => ({ name: p.name.toLowerCase(), stars: p.starsCount })),
};

export async function GET() {
  const { GITHUB_TOKEN, GITHUB_USERNAME } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return NextResponse.json(FALLBACK);

    const repos = (await res.json()) as { name: string; stargazers_count: number; fork: boolean }[];
    const owned = repos.filter((r) => !r.fork);
    const totalStars = owned.reduce((n, r) => n + r.stargazers_count, 0);
    return NextResponse.json({
      live: true,
      totalStars,
      repos: owned
        .map((r) => ({ name: r.name, stars: r.stargazers_count }))
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 12),
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
