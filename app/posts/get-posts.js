import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'
import fs from 'fs'
import path from 'path'

async function getAllPosts() {
  // 2階層目までを列挙する
  const baseDir = path.join(process.cwd(), 'content/posts')
  const postDirectories = fs.readdirSync(baseDir)
    .filter(dir => fs.statSync(path.join(baseDir, dir)).isDirectory())
    .flatMap(dir => {
      const subDir = path.join(baseDir, dir)
      return fs.readdirSync(subDir)
        .filter(sub => fs.statSync(path.join(subDir, sub)).isDirectory())
        .map(sub => path.join(dir, sub))
    })

  let posts = []
  for (const dir of postDirectories) {
    const { directories } = normalizePages({
      list: await getPageMap(`/posts/${dir}`),
      route: `/posts/${dir}`
    })
    posts = posts.concat(directories)
  }
  console.log(posts)
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
