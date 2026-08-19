# nidhikulkarni.com — content guide

Static site, no build step. Core files:

- `index.html` — homepage shell/structure (rarely touched)
- `project.html` — case study page template, shared by every project; reads `?id=<slug>` from the URL
- `styles.css` — all visual styling
- `script.js` — index.html behavior: loads `projects/manifest.json`, renders the Work list as links to `project.html?id=<slug>`, filtering, scroll reveals
- `project.js` — project.html behavior: fetches `projects/<slug>.json` for the id in the URL and renders it as a full case study page
- `facts.js` — shared facts (years of experience, employers, resume link, publications, contact links) — edit once here, synced everywhere via `data-fact*` attributes
- `projects/manifest.json` — one entry per project, in display order, drives the Work list rows
- `projects/<slug>.json` — one file per project, drives that project's case study page (opens at `project.html?id=<slug>`, a full page — not a popup)
- `images/<slug>/` — that project's photos, referenced by relative path from its JSON

## Adding a new project

1. **Add an entry to `projects/manifest.json`** (append or insert wherever you want it to sort):
   ```json
   {
     "id": "my-project-slug",
     "year": "2026",
     "yearAccent": false,
     "title": "Project Title",
     "subtitle": "One-line description",
     "employer": "Who it was for",
     "type": "product-design",
     "tags": [{ "label": "Product Design" }]
   }
   ```
   - `id` must be unique and match the JSON filename below.
   - `yearAccent: true` renders the year in accent color (used for "Ongoing").
   - `type` is a space-separated list of filter categories (matches a filter button's value in `index.html`). Multiple categories: `"type": "product-design installation"`.
   - `tags` can have more than one entry; add `"secondary": true` to de-emphasize one.
   - Leave `subtitle` as `""` if there isn't one.

2. **Create `projects/<slug>.json`** — pick whichever template shape fits:

   - **Template 1 — research paper** (`akal-badi.json`, `kahani.json`): `context`, `question`, `methodology`, `findings`, `contribution`, `badge`, `authorRole`, `supportImg`, `heroImg`
   - **Template 2 — product design** (`karya-learn.json`, `zen.json`): `about`, `stats: [{label, value, accent?}]`, `process: [{num, title, text}]` (3 steps), `images: []`, `heroImg`
   - **Template 3 — simple gallery** (`debashree.json`, `pottery.json`): `about`, `tools`, `images: []`, `heroImg`
   - **Template 4 — installation/hardware** (`vitm.json`, `invrse.json`): `about`, `role`, `tools`, `outcome`, `images: []`, `heroImg`

   Every project file also needs `id`, `template` (1–4), `tag`, `title`, `meta`.

3. **Add photos** (optional, can ship without them — placeholders show automatically):
   - Put images in `images/<slug>/`.
   - Resize/compress with macOS's built-in `sips` before committing, e.g.:
     ```
     sips -Z 1600 images/my-project-slug/hero.jpg
     ```
   - Reference them in the project JSON by relative path, e.g. `"heroImg": "images/my-project-slug/hero.jpg"`.
   - Images crop to fit automatically (`object-fit: cover`) — no need to precrop to an exact aspect ratio.

4. **Preview locally** before committing (fetch requires a real server, not `file://`):
   ```
   python3 -m http.server 8765
   ```
   then open `http://localhost:8765`.

## Editing styling

Edit `styles.css` (or `script.js` / `project.js` for behavior) — the JSON content files are never touched by a styling change. Only a genuine content *schema* change (a new field type in a template) needs both a JSON edit and a matching edit to `renderProject()` in `project.js`.
