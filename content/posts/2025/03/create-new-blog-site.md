---
title: '新しいブログサイトを作ってみた'
date: '2025-03-26T23:40'
---

いままで [はてなブログ](https://tenkoma.hatenablog.com/)に書いていたけれど、
もっと簡素な感じ(タイトル、本文、日付、トップページに戻るボタンのみ)で公開したくなった。

要件としてはGitで管理できMarkdownで書けて、ツールを変更してもURLが維持できそうなツールを探した。

[Next.js Pages Router チュートリアル](https://nextjs.org/learn/pages-router)きっかけで
[Templates](https://vercel.com/templates)を探して見つけた[Nextra: Docs Starter Kit](https://vercel.com/templates/next.js/documentation-starter-kit)がこの要件を満たしてそうだった。

[Nextra Blog Theme](https://nextra.site/docs/blog-theme)の手順を行ったあと、[不要だったタグを削ったり](https://github.com/tenkoma/blog.tenkoma.dev/commit/a9e2c0c72678cb79922bccf27479eca5585c7899)してから、[Vercel](https://vercel.com/)で公開。


* [github.com/tenkoma/blog.tenkoma.dev](https://github.com/tenkoma/blog.tenkoma.dev)
