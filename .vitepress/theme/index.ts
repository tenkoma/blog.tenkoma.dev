import DefaultTheme from 'vitepress/theme'
import LatestPosts from './LatestPosts.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LatestPosts', LatestPosts)
  }
} satisfies Theme
