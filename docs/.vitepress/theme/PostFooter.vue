<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `Published: ${year}/${month}/${day} ${hours}:${minutes}`
}
</script>

<template>
  <footer class="post-footer">
    <p>{{ formatDate(frontmatter.date) }}</p>
    <p>&copy;tenkoma</p>
  </footer>
</template>

<style scoped>
.post-footer {
  text-align: right;
  margin-top: 3rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.post-footer p {
  margin: 0.25rem 0;
}
</style>
