import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

async function getAllPosts() {
  let posts = []
  const years = ['2025']
  for (const year of years) {
    const { directories } = normalizePages({
      list: await getPageMap(`/posts/${year}`),
      route: `/posts/${year}`
    })
    posts = posts.concat(directories)
  }
  return posts
}
 
export async function getPosts() {
  const directories = await getAllPosts()
  return directories
    .filter(post => post.name !== 'index')
    .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date))
}
 
export async function getTags() {
  const posts = await getPosts()
  const tags = posts.flatMap(post => post.frontMatter.tags)
  return tags
}
