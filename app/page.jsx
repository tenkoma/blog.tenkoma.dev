import { PostCard } from 'nextra-theme-blog'
import { getPosts } from './posts/get-posts'

export default async function Index() {
  const posts = await getPosts()
  return (
    <div data-pagefind-ignore="all">
      <h1>tenkoma's blog</h1>
      {posts.map(post => (
        <PostCard key={post.route} post={post} />
      ))}
    </div>
  );
}
