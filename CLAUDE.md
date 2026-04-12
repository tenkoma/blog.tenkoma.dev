# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conversation Guidelines

- 常に日本語で会話する

## Project Overview

Astro で構築された静的ブログサイト（blog.tenkoma.dev）。Cloudflare Workers にデプロイ。
flo-bit/blog-template をフォークしてカスタマイズしている。

## Commands

```bash
npm run dev          # 開発サーバー起動
npm run build        # TypeScript チェック → Astro ビルド → Pagefind インデックス生成
npm run preview      # ビルド済みサイトのプレビュー
npm run format       # oxfmt でフォーマット
npm run format:check # フォーマットチェック（CI で使用）
npm run lint         # oxlint でリント
```

Pre-commit hooks（husky + lint-staged）が `*.{js,ts,mjs,json,mdx,css}` に oxfmt を自動適用する。

## Architecture

- **Astro** — 静的サイト生成、ページルーティング、コンテンツコレクション
- **Svelte** — インタラクティブな検索 UI（Pagefind）
- **MDX** — ブログ記事のリッチコンテンツ（カスタム埋め込み、数式）
- **Tailwind CSS** — スタイリング（PostCSS 経由）

### パスエイリアス

- `astro.config.ts / tsconfig.json` で定義: `$components`, `$layouts`, `$pages`, `$assets` → `src/` 配下の各ディレクトリ
- `astro.config.ts` 側のみ: `$content` → `src/content/`

### ブログ記事

- 配置: `src/content/blog/YYYY/MM/filename.mdx`
- スキーマ: `src/content.config.ts` で定義（title, description, pubDate が必須）
- カスタム埋め込み: `src/embeds/` に YouTube, Excalidraw, Link Card

### 主要な設定ファイル

- `src/config.ts` — サイトタイトル、SNS リンク、カラーテーマ、ページネーション等
- `astro.config.ts` — Vite エイリアス、プラグイン、Shiki 設定
- `tailwind.config.mjs` — カスタムカラー（BASE_COLOR: neutral, ACCENT_COLOR: cyan）

### デプロイ

- Cloudflare Workers（`wrangler.toml`）、アセットは `./dist`
- GitHub Actions（`.github/workflows/lint.yml`）で push 時に format:check + lint を実行
