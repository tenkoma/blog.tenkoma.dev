import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
 
export const metadata = {
  title: 'tenkoma\'s blog'
}
 
export default async function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap('/')}>
            {/* <Search /> */}
            <ThemeSwitch />
          </Navbar>
 
          {children}
 
          <Footer>
            {new Date().getFullYear()} © tenkoma
            <a href="/rss.xml" style={{ float: 'right' }}>RSS</a>
          </Footer>
        </Layout>
      </body>
    </html>
  )
}
