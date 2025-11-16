import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongoose'
import Assessment from '@/models/Assessment'
import { verifyToken } from '@/lib/auth'

// Get all assessments
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    
    const filter: any = { isActive: true }
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    
    const assessments = await Assessment.find(filter)
      .select('-questions.correctAnswer') // Don't send correct answers
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('Assessments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

// Create assessment (admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // TODO: Re-enable authentication after testing
    // const user = await verifyToken(request)
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized - admin access required' },
    //     { status: 401 }
    //   )
    // }
    
    const data = await request.json()
    
    // Map category to valid enum values
    const categoryMap: Record<string, string> = {
      'Programming': 'technical',
      'Design': 'technical',
      'Marketing': 'soft_skills',
      'Business': 'general',
      'Technical': 'technical',
      'Soft Skills': 'soft_skills',
      'Industry Specific': 'industry_specific',
      'General': 'general'
    }
    
    const mappedCategory = categoryMap[data.category] || 'technical'
    
    // Create a temporary admin user ID (you should replace this with actual user ID)
    const tempAdminId = new mongoose.Types.ObjectId()
    
    const assessment = await Assessment.create({
      ...data,
      category: mappedCategory,
      createdBy: tempAdminId
    })
    
    return NextResponse.json(
      { message: 'Assessment created successfully', assessment },
      { status: 201 }
    )
  } catch (error) {
    console.error('Assessment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}
