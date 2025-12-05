'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ConditionalFooter from './ConditionalFooter'
import Providers from '@/components/Providers'

const GlobalChatBox = dynamic(
  () => import('@/components/messaging/GlobalChatBox'),
  { ssr: false }
)

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <Providers>
      {isAuthPage ? (
        <main className="min-h-screen w-full">
          {children}
        </main>
      ) : (
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </div>
      )}
      {!isAuthPage && <GlobalChatBox />}
    </Providers>
  )
}
