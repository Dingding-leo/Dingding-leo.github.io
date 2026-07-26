# Personal Website

Personal site, engineering projects showcase, and technical notes archive.

**Live:** [dingding-leo.github.io](https://dingding-leo.github.io)

## Overview

Static-exported personal site built with Next.js 15 App Router and React 19. Designed for sub-second page loads, clean semantic HTML structure, and seamless deployment across GitHub Pages and custom targets.

## Features

* **Site-wide search** — ⌘K (or `/`) command palette across pages, notes, and projects.
* **Notes/journal system** — single data source (`config/notes.ts`) driving the index, homepage journal, per-note metadata, prev/next pagination, share actions, and print styles.
* **SEO layer** — `sitemap.xml`, `robots.txt`, RSS (`/feed.xml`), canonical URLs, Open Graph/Twitter cards, and JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList).
* **PWA** — web manifest plus a service worker for offline reading (network-first pages, stale-while-revalidate assets).
* **Performance** — responsive `srcset` images, content-visibility-friendly layout, zero-CLS media via CSS aspect ratios.
* **Accessibility** — WCAG AA contrast, keyboard-navigable dialogs and tabs, reduced-motion support, correct `lang` tagging for bilingual content.

## Technical Details

* **Framework**: Next.js 15 (App Router, static export mode `output: 'export'`).
* **UI & Styling**: React 19, TypeScript, Tailwind CSS, and `next-themes` for system-aware dark mode switching.
* **Build Pipeline**: Static site generation producing optimized static assets to `out/` for edge deployment; CI typechecks and builds on every push to `main`, then deploys to GitHub Pages.

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Build & Export

```bash
npm run build
```

## License

MIT
