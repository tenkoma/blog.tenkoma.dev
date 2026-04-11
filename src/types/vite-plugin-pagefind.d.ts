// vite-plugin-pagefind 1.1.0 で型定義ファイルが同梱されていないため補完
// パッケージ側で修正されたらこのファイルは削除してよい
declare module "vite-plugin-pagefind" {
  import type { Plugin } from "vite";
  export function pagefind(options?: { outputDirectory?: string }): Plugin;
}
