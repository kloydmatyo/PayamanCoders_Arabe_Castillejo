'use client'

import { useMessaging } from '@/contexts/MessagingContext'
import ChatBox from './ChatBox'

export default function GlobalChatBox() {
  const { activeChatId, closeChat } = useMessaging()

  if (!activeChatId) return null

  return <ChatBox conversationId={activeChatId} onClose={closeChat} />
}
