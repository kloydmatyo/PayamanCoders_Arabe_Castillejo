import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import Providers from '@/components/Providers'
import AuthDebug from '@/components/AuthDebug'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata = {
  title: 'WorkQit - Connecting Talent with Opportunity',
  description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-transparent font-[family-name:var(--font-space-grotesk)]">
        <Providers>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1 w-full">
                {children}
              </main>
              <ConditionalFooter />
            </div>
            <AuthDebug />
          </div>
        </Providers>
      </body>
    </html>
  )
}