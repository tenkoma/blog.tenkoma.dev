---
title: 'このサイトをVitePressに移行した'
date: '2026-02-16T22:39'
---

[作って](/posts/2025/03/create-new-blog-site)から全然記事を書いておらず、Dependabot alertも来てしまっていた。

[VitePress](https://vitepress.dev/)がもっとメンテナンスしやすそうな気がしたので、[Markdownファイルのみを残してVitePress化](https://github.com/tenkoma/blog.tenkoma.dev/pull/5)した。

まず自分でMarkdownファイル以外を削除し、Node.jsのバージョン24への変更とVitePressをインストールした。
次にClaude Codeに指示して[トップページ](/)と[Postsページ](/posts)に記事一覧を表示させた。

プルリクエストを作ったら、Vercelの管理画面にて "Settings > Framework Preset" を "VitePress" に変更すればVitePressサイトとしてプレビューできた。

マージして変更完了。ブログ記事URLを維持したまま1時間でVitePressにできた。
