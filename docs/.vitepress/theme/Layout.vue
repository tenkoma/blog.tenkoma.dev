<script setup>
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import PostFooter from './PostFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isPost = computed(() => route.path.startsWith('/posts/') && route.path !== '/posts/')
</script>

<template>
  <div :class="{ 'is-post': isPost }">
    <Layout>
      <template #doc-before>
        <h1 v-if="isPost" class="post-title">{{ frontmatter.title }}</h1>
      </template>
      <template #doc-after>
        <PostFooter v-if="isPost" />
      </template>
    </Layout>
  </div>
</template>
