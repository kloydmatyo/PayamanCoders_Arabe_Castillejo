import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // Verify admin access
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const adminUser = await User.findById(decoded.userId)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { action } = await request.json()
    const userId = params.id

    // Find target user
    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent admin from modifying other admins
    if (targetUser.role === 'admin' && targetUser._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot modify other admin accounts' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'activate':
        targetUser.emailVerified = true
        await targetUser.save()
        break

      case 'deactivate':
        targetUser.emailVerified = false
        await targetUser.save()
        break

      case 'delete':
        // Soft delete by setting a deleted flag or actually delete
        await User.findByIdAndDelete(userId)
        break

      case 'reset_password':
        // Remove password to force password reset
        targetUser.password = undefined
        targetUser.hasPassword = false
        if (targetUser.authProvider === 'local') {
          targetUser.authProvider = 'google' // Force them to use Google or set new password
        }
        await targetUser.save()
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `User ${action} successful`,
      user: {
        id: targetUser._id,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName
      }
    })

  } catch (error) {
    console.error('Admin user action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // Verify admin access
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const adminUser = await User.findById(decoded.userId)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const userId = params.id
    const user = await User.findById(userId).select('-password').lean()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}