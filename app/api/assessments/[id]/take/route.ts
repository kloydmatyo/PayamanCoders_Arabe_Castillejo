import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Assessment from '@/models/Assessment'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const assessment = await Assessment.findById(params.id)
      .select('-questions.correctAnswer -questions.explanation')
      .lean()
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ assessment })
  } catch (error) {
    console.error('Assessment fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}
