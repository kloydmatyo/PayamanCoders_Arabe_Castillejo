'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MessagingContextType {
  activeChatId: string | null
  openChat: (conversationId: string) => void
  closeChat: () => void
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
)

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const openChat = (conversationId: string) => {
    setActiveChatId(conversationId)
  }

  const closeChat = () => {
    setActiveChatId(null)
  }

  return (
    <MessagingContext.Provider value={{ activeChatId, openChat, closeChat }}>
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context = useContext(MessagingContext)
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}
