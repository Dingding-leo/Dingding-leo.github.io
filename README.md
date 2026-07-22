# Austin Liu — Personal Space

A personal website for notes, travel moments, dental school, and the products I build. The current project collection includes KnightClub, ScholarBank, Denki, and this site itself.

**Live site:** [dingding-leo.github.io](https://dingding-leo.github.io)

## Stack

- Next.js 15 with the App Router and static export
- React 19 and TypeScript
- Framer Motion for restrained page transitions
- next-themes for light and dark colour modes
- GitHub Pages and OpenAI Sites deployment targets

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npx tsc --noEmit
npm run build
```

The production build is exported to `out/`. Pushes to `main` run the same build in CI and deploy the exported site to GitHub Pages.

## Main structure

```text
app/                 Next.js routes and global styles
components/          Shared navigation, home sections, and content pages
config/site.ts       Navigation and project data
public/assets/       Project previews and travel photography
scripts/             Additional Sites packaging
```
