# Personal Website

Personal site, engineering projects showcase, and technical notes archive.

## Overview

Static-exported personal site built with Next.js 15 App Router and React 19. Designed for sub-second page loads, clean semantic HTML structure, and seamless deployment across GitHub Pages and custom targets.

## Technical Details

* **Framework**: Next.js 15 (App Router, static export mode `output: 'export'`).
* **UI & Styling**: React 19, TypeScript, Tailwind CSS, and `next-themes` for system-aware dark mode switching.
* **Build Pipeline**: Static site generation producing optimized static assets to `out/` for edge deployment.

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
