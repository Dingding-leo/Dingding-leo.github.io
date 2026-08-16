# Personal Website

Personal site, engineering projects showcase, and technical notes archive.

**Live:** [dingding-leo.github.io](https://dingding-leo.github.io)

## Overview

Static-exported personal site built with Next.js 16 App Router and React 19. It combines a cinematic visual journal with project work, field notes, and a clear public identity as a dental student and independent builder in Adelaide.

## Features

* **Site-wide search** — ⌘K (or `/`) command palette across pages, notes, and projects.
* **Notes/journal system** — single data source (`config/notes.ts`) driving the index, homepage journal, per-note metadata, prev/next pagination, share actions, and print styles.
* **SEO layer** — `sitemap.xml`, `robots.txt`, RSS (`/feed.xml`), canonical URLs, Open Graph/Twitter cards, and JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList).
* **PWA** — ambience is opt-in, the service worker is versioned per deployment, and offline reading cannot pin an older page to stale JavaScript chunks.
* **Performance** — responsive `srcset` images, content-visibility-friendly layout, zero-CLS media via explicit dimensions and aspect ratios.
* **Accessibility** — keyboard-navigable dialogs and menus, reduced-motion support, semantic sharing controls, and correct `lang` tagging for bilingual content.

## Technical Details

* **Framework**: Next.js 16 (App Router, static export mode `output: 'export'`).
* **UI & Styling**: React 19, TypeScript, Tailwind CSS, Framer Motion, and `next-themes`.
* **Quality gate**: ESLint, TypeScript, production build, internal route/asset/fragment validation, service-worker syntax validation, and a high-severity production dependency audit.
* **Deployment**: GitHub Pages receives an artifact only after the complete quality gate passes on Node.js 22.

## Development

Requires Node.js 22+.

```bash
npm install
npm run dev
```

## Build & Export

```bash
npm run check
```

`npm run check` lints the active application source, typechecks it, builds the complete static export, and verifies internal links, fragments, required metadata files, manifest validity, and service-worker syntax. CI and deployment additionally require a clean high-severity production dependency audit.

## License

MIT
