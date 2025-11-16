'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  _id: string
  sender: {
    _id: string
    firstName: string
    lastName: string
    profile?: {
      profilePicture?: string
    }
  }
  content: string
  createdAt: string
  read: boolean
}

interface Conversation {
  _id: string
  participants: Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    profile?: {
      profilePicture?: string
    }
  }>
  messages: Message[]
}

interface ChatBoxProps {
  conversationId: string
  onClose: () => void
}

export default function ChatBox({ conversationId, onClose }: ChatBoxProps) {
  const { user } = useAuth()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversation()
    markAsRead()

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchConversation, 3000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data.conversation)
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
    }
  }

  const markAsRead = async () => {
    try {
      await fetch(`/api/messages/${conversationId}`, {
        method: 'PATCH',
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    try {
      setSending(true)
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      })

      if (response.ok) {
        setMessage('')
        fetchConversation()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const otherParticipant = conversation?.participants.find(
    (p) => p._id !== (user as any)?._id
  )

  if (!conversation || !otherParticipant) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl border-2 border-white/40 bg-white shadow-2xl transition-all ${
        isMinimized ? 'h-16 w-80' : 'h-[500px] w-96'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          {otherParticipant.profile?.profilePicture ? (
            <img
              src={otherParticipant.profile.profilePicture}
              alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              {otherParticipant.firstName[0]}
              {otherParticipant.lastName[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-white">
              {otherParticipant.firstName} {otherParticipant.lastName}
            </p>
            <p className="text-xs text-white/80">{otherParticipant.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversation.messages.map((msg) => {
              const isOwn = msg.sender._id === (user as any)?._id

              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isOwn ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-gray-200 p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
