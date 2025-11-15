import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Certificate from '@/models/Certificate'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const certificates = await Certificate.find({ userId: user.userId })
      .sort({ issuedAt: -1 })
      .lean()
    
    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Certificates fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}
