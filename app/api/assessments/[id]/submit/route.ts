import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Assessment from '@/models/Assessment'
import AssessmentAttempt from '@/models/AssessmentAttempt'
import Certificate from '@/models/Certificate'
import { verifyToken } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function POST(
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
    
    const { answers, timeSpent } = await request.json()
    
    const assessment = await Assessment.findById(params.id)
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }
    
    // Grade the assessment
    let totalPoints = 0
    let earnedPoints = 0
    const gradedAnswers = []
    
    for (const question of assessment.questions) {
      totalPoints += question.points
      const userAnswer = answers[question.id]
      
      let isCorrect = false
      if (question.type === 'multiple_select') {
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer.sort() : []
        const user = Array.isArray(userAnswer) ? userAnswer.sort() : []
        isCorrect = JSON.stringify(correct) === JSON.stringify(user)
      } else {
        isCorrect = String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase()
      }
      
      const pointsEarned = isCorrect ? question.points : 0
      earnedPoints += pointsEarned
      
      gradedAnswers.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned,
        explanation: question.explanation
      })
    }
    
    const score = Math.round((earnedPoints / totalPoints) * 100)
    const passed = score >= assessment.passingScore
    
    // Create attempt record
    const attempt = await AssessmentAttempt.create({
      userId: user.userId,
      assessmentId: assessment._id,
      answers: gradedAnswers.map(a => ({
        questionId: a.questionId,
        answer: a.userAnswer,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned
      })),
      score,
      totalPoints,
      passed,
      completedAt: new Date(),
      timeSpent
    })
    
    // Issue certificate if passed
    let certificate = null
    if (passed) {
      const certificateId = `CERT-${randomBytes(8).toString('hex').toUpperCase()}`
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/certificates/verify/${certificateId}`
      
      certificate = await Certificate.create({
        userId: user.userId,
        assessmentId: assessment._id,
        certificateId,
        title: assessment.title,
        category: assessment.category,
        difficulty: assessment.difficulty,
        score,
        passingScore: assessment.passingScore,
        totalQuestions: assessment.questions.length,
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length,
        skills: assessment.skills,
        verificationUrl
      })
      
      await AssessmentAttempt.findByIdAndUpdate(attempt._id, {
        certificateId: certificate._id
      })
    }
    
    return NextResponse.json({
      message: passed ? 'Congratulations! You passed the assessment.' : 'Assessment completed. Keep practicing!',
      result: {
        score,
        passed,
        totalQuestions: assessment.questions.length,
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length,
        timeSpent,
        gradedAnswers,
        certificate: certificate ? {
          id: certificate.certificateId,
          verificationUrl: certificate.verificationUrl
        } : null
      }
    })
  } catch (error) {
    console.error('Assessment submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
