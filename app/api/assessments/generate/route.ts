import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { generateAssessment } from '@/lib/ai-assessment-generator'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await verifyToken(req)
    
    // Only admins can generate assessments
    if (!currentUser?.userId || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { topic, difficulty, numberOfQuestions, category } = await req.json()

    // Validate input
    if (!topic || !difficulty || !numberOfQuestions || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, difficulty, numberOfQuestions, category' },
        { status: 400 }
      )
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    if (numberOfQuestions < 1 || numberOfQuestions > 20) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 20' },
        { status: 400 }
      )
    }

    console.log('Generating assessment with AI:', { topic, difficulty, numberOfQuestions, category })

    // Generate assessment using Bytez AI
    const assessment = await generateAssessment({
      topic,
      difficulty,
      numberOfQuestions,
      category,
    })

    console.log('Assessment generated successfully')

    return NextResponse.json({
      success: true,
      assessment,
    })
  } catch (error) {
    console.error('Error in assessment generation API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate assessment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
