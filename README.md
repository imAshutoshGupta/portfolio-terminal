# Ashutosh Gupta — Portfolio

A terminal-themed personal portfolio built with Next.js, TypeScript, and
Tailwind CSS v4. It pairs an editorial "Luxe Terminal" home page with a
fully interactive **ashOS** desktop takeover, plus a real in-browser REPL and
a command palette.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first, `@theme` tokens)
- Fonts: Clash Display + Satoshi (Fontshare), JetBrains Mono (Google)

## Routes

| Route              | What it is                                                                          |
| ------------------ | ----------------------------------------------------------------------------------- |
| `/`                | Luxe Terminal home (hero, work, experience, skills, writing, now-playing, contact)  |
| `/desktop`         | ashOS desktop — draggable glass windows, dock, menu bar (loaded in the takeover iframe) |
| `/work/[slug]`     | Project case studies (`ledger`, `atlas`, `pulse`, `drift`)                          |
| `/api/now-playing` | Spotify "now playing" (falls back to a simulated rotation)                          |
| `/api/github`      | Live repo stars (falls back to static numbers)                                      |
| `/api/contact`     | Contact delivery (logs when no provider is set)                                     |
| `/og`              | Dynamically generated Open Graph image                                              |

## Features

- **Interactive hero terminal** — the prompt is a real REPL. Click it and type
  `help`, `ls`, `cat ledger`, `open ashos`, `theme light`, `sudo hire-me`…
  (shared engine in `lib/repl.ts`).
- **⌘K command palette** — jump to sections, open case studies, launch ashOS,
  copy email, toggle theme. (`Esc` to close.)
- **Project case studies** — each work card links to a detail page.
- **Live data APIs** with graceful fallbacks, so the UI is identical with or
  without secrets configured.
- **SEO/OG** metadata + a dynamic OG image; **a11y** (aria-labels, dialog roles,
  focus restore); honors `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Environment

All optional — without them the live features fall back to static data.
See `.env.example`:

- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN`
- `GITHUB_TOKEN` / `GITHUB_USERNAME`
- `RESEND_API_KEY` / `CONTACT_TO_EMAIL`

## Notes

- Theme switching is driven entirely by CSS variables under `[data-theme]`, so
  flipping the attribute on `<html>` re-themes the whole page with no JS repaint.
  The ashOS iframe receives the parent's theme via `?theme=`.
