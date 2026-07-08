# Austin's Lab - Personal Homepage

This is the source code for my personal lab, portfolio, and public notebook, hosted on GitHub Pages. It is built purely with standard HTML, CSS, and vanilla JS to keep it simple, fast, and easy to maintain.

## Deployment to GitHub Pages

1. Navigate to your repository settings on GitHub.
2. Go to **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**, set the Source to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. In a few minutes, the site will be live at `https://Dingding-leo.github.io`.

## How to add a new Blog Post / Note

1. Create a new `.html` file inside the `posts/` folder (e.g., `posts/my-new-idea.html`). You can copy an existing file like `why-this-site.html` as a template.
2. Open `index.html`.
3. Locate the `<!-- Notes: 博客/笔记列表 -->` section.
4. Add a new `<li>` element to the list pointing to your new file:

```html
<li class="note-item">
    <a href="posts/my-new-idea.html" class="note-link">
        <span class="note-title">Title of my new idea</span>
        <span class="note-date">YYYY-MM-DD</span>
    </a>
</li>
```

## How to update personal info

* **Hero section / About**: Open `index.html` and modify the text inside `<header class="hero">`.
* **Projects**: Open `index.html` and modify the cards inside `<section id="projects">`.
* **Now section**: Modify the list items inside `<section id="now">`.

## Common Git Commands for Maintenance

Whenever you make changes to files on your computer, run these commands in the terminal to push them to your live website:

```bash
# 1. Stage all changes
git add .

# 2. Commit your changes with a descriptive message
git commit -m "Add a new blog post"

# 3. Push to GitHub (This automatically triggers a GitHub Pages deployment)
git push
```
