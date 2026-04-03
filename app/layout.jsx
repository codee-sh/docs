import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: 'Medusa Hub',
  description: 'Community plugins, starters, and guides extending Medusa.js.',
}

const navbar = (
  <Navbar logo={<b>Medusa Hub</b>} />
)

const currentYear = new Date().getFullYear()
const footer = (
  <Footer>
    <p>
      © {currentYear}{' '}
      <a href="https://codee.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        Codee
      </a>
      {' · '}
      <a href="https://github.com/codee-sh/medusa-hub" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        Contribute on GitHub
      </a>
    </p>
  </Footer>
)

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout navbar={navbar} pageMap={pageMap || []} footer={footer}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
