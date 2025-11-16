import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Conversation from '@/models/Conversation'
import { verifyToken } from '@/lib/auth'

// Get messages for a conversation
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const params = await context.params
    const conversation = await Conversation.findById(params.conversationId)
      .populate('participants', 'firstName lastName email profile role')
      .populate('messages.sender', 'firstName lastName profile')

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === currentUser.userId
    )

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

// Send a message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { content } = await req.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const params = await context.params
    const conversation = await Conversation.findById(params.conversationId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p.toString() === currentUser.userId
    )

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Add message
    conversation.messages.push({
      sender: currentUser.userId,
      content: content.trim(),
      read: false,
    } as any)

    conversation.lastMessage = content.trim()
    conversation.lastMessageAt = new Date()

    await conversation.save()

    // Populate and return
    await conversation.populate('messages.sender', 'firstName lastName profile')

    return NextResponse.json({
      message: conversation.messages[conversation.messages.length - 1],
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// Mark messages as read
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await verifyToken(req)
    if (!currentUser?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const params = await context.params
    const conversation = await Conversation.findById(params.conversationId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Mark all messages from other users as read
    conversation.messages.forEach((msg: any) => {
      if (msg.sender.toString() !== currentUser.userId) {
        msg.read = true
      }
    })

    await conversation.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
