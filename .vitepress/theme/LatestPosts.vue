<script setup>
import { data as posts } from '../../content/posts.data'

const latestPosts = posts.slice(0, 10)
</script>

<template>
  <div class="latest-posts">
    <ul>
      <li v-for="post of latestPosts" :key="post.url">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
        <span class="date">{{ new Date(post.frontmatter.date).toLocaleDateString('ja-JP') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.latest-posts {
  margin-top: 2rem;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}

.latest-posts h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.latest-posts ul {
  list-style: none;
  padding: 0;
}

.latest-posts li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem 0;
}

.latest-posts li a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.latest-posts li a:hover {
  text-decoration: underline;
}

.latest-posts .date {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  white-space: nowrap;
  margin-left: 1rem;
}
</style>
