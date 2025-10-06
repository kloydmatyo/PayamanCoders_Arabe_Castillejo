import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/models/User'
import dbConnect from '@/lib/mongoose'

export async function verifyAdminAccess(request: NextRequest): Promise<{ isAdmin: boolean; user?: any; error?: string }> {
  try {
    await dbConnect()

    // Get token from cookie
    const token = request.cookies.get('token')?.value
    if (!token) {
      return { isAdmin: false, error: 'Authentication required' }
    }

    // Verify token
    const decoded = await verifyToken(request)
    if (!decoded) {
      return { isAdmin: false, error: 'Invalid token' }
    }

    // Get user and check admin role
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return { isAdmin: false, error: 'User not found' }
    }

    if (user.role !== 'admin') {
      return { isAdmin: false, error: 'Admin access required' }
    }

    return { isAdmin: true, user }

  } catch (error) {
    console.error('Admin verification error:', error)
    return { isAdmin: false, error: 'Internal server error' }
  }
}

export function createAdminResponse(error: string, status: number = 403) {
  return Response.json({ error }, { status })
}