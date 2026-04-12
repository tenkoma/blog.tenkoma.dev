# Copilot Instructions

## Commands

```sh
npm run dev          # Start dev server
npm run build        # Type-check + build + run pagefind indexing
npm run preview      # Preview production build
npm run lint         # Run oxlint
npm run format       # Format with oxfmt (writes)
npm run format:check # Format check (CI)
```

No test suite exists. The pre-commit hook runs `lint-staged` (auto-formats staged `*.{js,ts,mjs,json,mdx,css}` files with `oxfmt`).

## Architecture

This is an **Astro 6 static blog** with Svelte components, Tailwind CSS v4, and MDX content.

### Content

Blog posts live in `src/content/blog/<year>/<month>/slug.{md,mdx}`. The content collection schema is defined in `src/content.config.ts`. Key frontmatter fields:

- `title`, `description`, `pubDate` — required
- `published: false` — hides post entirely (not listed, not accessible by URL)
- `hidden: true` — hides from list but accessible by direct URL (for draft sharing)
- `heroImage` — must be a path starting with `/src/assets/` pointing to an image in `src/assets/`
- `tags` — array of strings

### Path aliases

Configured in `astro.config.ts` via Vite:

| Alias | Resolves to |
|---|---|
| `$components` | `src/components` |
| `$layouts` | `src/layouts` |
| `$pages` | `src/pages` |
| `$assets` | `src/assets` |
| `$content` | `src/content` |

### Custom embeds

`astro-custom-embeds` is used to auto-transform bare URLs in markdown into rich embeds. Embeds are defined in `src/embeds/`:

- `link-card/` — general link previews (fetches OG metadata via `cheerio`)
- `youtube/` — lite-youtube-embed
- `excalidraw/` — embeds Excalidraw diagrams

Each embed has an `embed.ts` (astro-custom-embeds config) and a `matcher.ts` (URL matcher).

### Site configuration

All site-wide settings (title, colors, social links, pagination, feature flags) are in `src/config.ts`. Tailwind theme colors (`accent` / `base`) are driven by `ACCENT_COLOR` / `BASE_COLOR` from this file.

### Search

Pagefind is used for full-text search. The `npm run build` script runs `pagefind` after `astro build`. In dev, `vite-plugin-pagefind` serves the pagefind index. The `data-pagefind-body` attribute in `src/layouts/BlogPost.astro` marks indexable content.

### OG images

Auto-generated per post via `astro-og-canvas` under `src/pages/open-graph/`. The post slug is used as the image filename (`post.id + ".png"`).

### Styling

Tailwind CSS v4 with PostCSS. The typography plugin (`@tailwindcss/typography`) renders prose content. Dark mode is toggled via `.dark` class on `<html>` (controlled by `MANUAL_DARK_MODE` in config).
