# AGENTS.md — LoweNiyan.github.io

## Project overview
- Static GitHub Pages personal site, no build step, no framework, no package manager.
- Domain: `nyan.work` (configured in `CNAME`).
- All page files use `.htm` extension (not `.html`).

## File layout
| Path | Purpose |
|------|---------|
| `index.htm` | Homepage entry point |
| `pages/*.htm` | Sub-pages (about, connect, log_index) |
| `pages/blogs/` | Blog articles (currently empty) |
| `js/script.js` | Shared utility (`printer()` typewriter function) + console art |
| `js/index.js` | Homepage-specific logic (parallax, more-menu expand/collapse) |
| `js/log_index.js` | Log page logic (date display, horizontal scroll) |
| `js/devtools.js` | Dev-only; not linked in any production page |
| `style/style.css` | Shared base styles (typography, scrollbar, links) |
| `style/index.css` | Homepage styles |
| `style/log_index.css` | Log page styles |
| `style/fluent.css` | Fluent-style titlebar/navbar component |
| `style/normalize.css` | CSS reset |
| `animation/animation.css` | Shared animations |
| `fonts/` | Self-hosted fonts (Rubik, OPPOSans, JetBrainsMono, Segoe Icons, Green Screen, Times) |
| `404.htm` | Custom 404 page |

## Page wiring conventions
- Every page that needs jQuery must include the CDN script tag:
  ```html
  <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.6.3.min.js"></script>
  ```
- Shared includes per page: `normalize.css` → `style.css` → `animation.css` → page-specific CSS → jQuery CDN → `script.js` → page-specific JS.
- Sub-pages reference assets with `../` relative paths (root pages use no prefix).
- `script.js` provides `printer(text, element, speed)` — a typewriter effect that mutates the element's `.text()`. It is used by `index.js`.

## Quirks & gotchas
- **`.htm` extension**: All HTML files use `.htm`, not `.html`. Use `/` (forward slash) in paths; `404.htm` has broken backslash paths (`..\style\...`) that should be fixed.
- **`devtools.js`**: Contains an `alert("Dev Mode")` on page load. Never link it unless intentionally debugging.
- **No build/dev server**: Just open `index.htm` in a browser or use VS Code Live Server (port 5501 per `.vscode/settings.json`).
- **No CI/automation**: Deployment is manual push to the `main` branch; GitHub Pages serves from the repo root.
- **jQuery version**: pinned to 3.6.3 from ASP.NET CDN — don't upgrade without verifying compatibility.
