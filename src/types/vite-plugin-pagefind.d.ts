declare module "vite-plugin-pagefind" {
  import type { Plugin } from "vite";
  export function pagefind(options?: { outputDirectory?: string }): Plugin;
}
