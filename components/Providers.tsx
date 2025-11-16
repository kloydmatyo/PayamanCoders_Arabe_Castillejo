'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { CounterProvider } from '@/contexts/CounterContext'
import { MessagingProvider } from '@/contexts/MessagingContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CounterProvider>
        <MessagingProvider>
          {children}
        </MessagingProvider>
      </CounterProvider>
    </AuthProvider>
  )
}