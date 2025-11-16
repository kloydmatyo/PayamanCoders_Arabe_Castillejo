'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
  lastMessage?: string
  lastMessageAt: string
  unreadCount: number
}

interface MessagesDropdownProps {
  onConversationClick: (conversationId: string) => void
}

export default function MessagesDropdown({
  onConversationClick,
}: MessagesDropdownProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations()
    }
  }, [isOpen, user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  )

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p._id !== (user as any)?._id)
  }

  const handleConversationClick = (conversationId: string) => {
    onConversationClick(conversationId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary-500/40 bg-white/70 text-secondary-700 shadow-xl shadow-primary-700/20 backdrop-blur-xl transition-all hover:border-primary-500/70 hover:bg-white/90 hover:text-primary-600 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-110 duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        <MessageCircle className="h-7 w-7 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        {totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-bold text-white ring-2 ring-white shadow-lg shadow-red-500/50 z-20 group-hover:scale-125 transition-transform duration-300">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-16 z-50 w-80 sm:w-96 animate-[floatUp_0.3s_ease-out]">
          <div className="rounded-2xl border-2 border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversations List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">No messages yet</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv)
                  if (!otherUser) return null

                  return (
                    <button
                      key={conv._id}
                      onClick={() => handleConversationClick(conv._id)}
                      className="flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      {/* Avatar */}
                      {otherUser.profile?.profilePicture ? (
                        <img
                          src={otherUser.profile.profilePicture}
                          alt={`${otherUser.firstName} ${otherUser.lastName}`}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-bold text-white">
                          {otherUser.firstName[0]}
                          {otherUser.lastName[0]}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">
                            {otherUser.firstName} {otherUser.lastName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className="truncate text-sm text-gray-600">
                            {conv.lastMessage}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
