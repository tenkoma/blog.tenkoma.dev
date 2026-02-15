import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "content",
  
  title: "tenkoma's blog",
  description: "tenkoma's blog site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Posts', link: '/posts' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tenkoma/blog.tenkoma.dev' }
    ]
  }
})
