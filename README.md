# Personal Website

Personal site, engineering projects showcase, and technical notes archive.

**Live:** [dingding-leo.github.io](https://dingding-leo.github.io)

## Overview

Static-exported personal site built with Next.js 15 App Router and React 19. Designed for sub-second page loads, clean semantic HTML structure, and seamless deployment across GitHub Pages and custom targets.

## Features

* **Site-wide search** — ⌘K (or `/`) command palette across pages, notes, and projects.
* **Notes/journal system** — single data source (`config/notes.ts`) driving the index, homepage journal, per-note metadata, prev/next pagination, share actions, and print styles.
* **SEO layer** — `sitemap.xml`, `robots.txt`, RSS (`/feed.xml`), canonical URLs, Open Graph/Twitter cards, and JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList).
* **PWA** — opt-in ambience, a versioned service worker, and offline reading without letting an older deploy pin stale pages or chunks.
* **Performance** — responsive `srcset` images, content-visibility-friendly layout, zero-CLS media via CSS aspect ratios.
* **Accessibility** — WCAG AA contrast, keyboard-navigable dialogs and tabs, reduced-motion support, correct `lang` tagging for bilingual content.

## Technical Details

* **Framework**: Next.js 15 (App Router, static export mode `output: 'export'`).
* **UI & Styling**: React 19, TypeScript, Tailwind CSS, and `next-themes` for system-aware dark mode switching.
* **Build Pipeline**: Static site generation to `out/`; CI typechecks, builds, validates every internal route/asset/fragment, and only then deploys to GitHub Pages.

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Build & Export

```bash
npm run check
```

`npm run check` typechecks, builds the complete static export, and verifies that internal links, fragments, required metadata files, and service-worker syntax are valid.

## License

MIT
