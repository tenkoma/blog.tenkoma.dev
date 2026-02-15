import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import LatestPosts from './LatestPosts.vue'
import type { Theme } from 'vitepress'
import './post.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LatestPosts', LatestPosts)
  }
} satisfies Theme
