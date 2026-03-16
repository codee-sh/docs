import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
 
export const metadata = {
  title: 'Medusa Hub',
  description: 'Community plugins, starters, and guides extending Medusa.js.',
}
 
// const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={
      <b>Medusa Hub</b>
    }
    // ... Your additional navbar options
  />
)
const currentYear = typeof window === 'undefined' ? new Date().getFullYear() : new Date().getFullYear()
const footer = (
  <Footer>
    <p>
      © {currentYear}{' '}
      <a 
        href="https://codee.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        Codee
      </a>
      {' · '}
      <a 
        href="https://github.com/codee-sh/medusajs-hub-docs" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        Contribute on GitHub
      </a>
    </p>
  </Footer>
)
 
export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          // banner={banner}
          navbar={navbar}
          pageMap={pageMap || []}
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
