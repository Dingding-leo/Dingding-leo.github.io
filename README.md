# Austin's Lab

My personal laboratory, portfolio, and public notebook. Built with Jekyll and hosted on GitHub Pages.

**Live site:** [Dingding-leo.github.io](https://Dingding-leo.github.io)

## Tech Stack

- **Static Site Generator:** Jekyll (kramdown markdown, Liquid templates)
- **Frontend:** Vanilla HTML, CSS (custom properties, glassmorphism), vanilla JS
- **Plugins:** jekyll-sitemap, jekyll-seo-tag
- **Hosting:** GitHub Pages (auto-deploy on push to `main`)

## Project Structure

```
├── _config.yml          # Jekyll configuration
├── _layouts/            # Page templates (default, page, post)
├── _includes/           # Reusable components (head, header, footer)
├── _posts/              # Blog posts (Markdown with frontmatter)
├── assets/              # Images, backgrounds, gallery photos
├── index.html           # Homepage (hero section)
├── about.html           # About page with animated stats
├── projects.html        # Project showcase
├── notes.html           # Blog post listing (Jekyll loop)
├── moments.html         # Travel photo gallery
├── now.html             # What I'm currently doing
├── style.css            # All styles (Apple-inspired light theme)
└── script.js            # Page loader, scroll reveal, mouse spotlight, counters, nav
```

## Local Development

```bash
# Install Jekyll and bundler (requires Ruby)
gem install bundler jekyll

# Serve locally
bundle exec jekyll serve

# Visit http://localhost:4000
```

## Adding a Blog Post

Create a new Markdown file in `_posts/` with the naming convention `YYYY-MM-DD-slug.md`:

```markdown
---
layout: post
title: "Your Post Title"
reading_time: 3
---

Your content here...
```

Jekyll automatically picks it up — no manual list editing needed.

## Deployment

Push to `main`. GitHub Pages builds and deploys automatically.
