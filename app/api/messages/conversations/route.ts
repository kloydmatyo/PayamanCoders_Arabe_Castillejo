import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Conversation from '@/models/Conversation'
import { verifyToken } from '@/lib/auth'

// Get all conversations for current user
export async function GET(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const conversations = await Conversation.find({
      participants: currentUser.userId,
    })
      .populate('participants', 'firstName lastName email profile role')
      .sort({ lastMessageAt: -1 })
      .lean()

    // Calculate unread count for each conversation
    const conversationsWithUnread = conversations.map((conv: any) => {
      const unreadCount = conv.messages.filter(
        (msg: any) =>
          msg.sender.toString() !== currentUser.userId && !msg.read
      ).length

      return {
        ...conv,
        unreadCount,
      }
    })

    return NextResponse.json({ conversations: conversationsWithUnread })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// Create or get conversation with another user
export async function POST(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { participantId } = await req.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUser.userId, participantId] },
    }).populate('participants', 'firstName lastName email profile role')

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [currentUser.userId, participantId],
        messages: [],
        lastMessageAt: new Date(),
      })

      conversation = await conversation.populate(
        'participants',
        'firstName lastName email profile role'
      )
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
