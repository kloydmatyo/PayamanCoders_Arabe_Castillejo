import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { step, action, data } = await request.json()

    const updateData: any = {}

    if (action === 'complete_step') {
      updateData['onboarding.currentStep'] = step + 1
      
      if (data?.skills) {
        updateData['profile.skills'] = data.skills
        updateData['onboarding.skillsAdded'] = true
      }
      
      if (data?.assessmentTaken) {
        updateData['onboarding.assessmentTaken'] = true
      }
      
      if (data?.certificateEarned) {
        updateData['onboarding.certificateEarned'] = true
      }
    } else if (action === 'skip_step') {
      updateData['onboarding.currentStep'] = step + 1
      updateData.$push = { 'onboarding.skippedSteps': `step_${step}` }
    } else if (action === 'complete_onboarding') {
      updateData['onboarding.completed'] = true
      updateData['onboarding.completedAt'] = new Date()
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true }
    ).select('onboarding profile')

    return NextResponse.json({
      message: 'Onboarding updated successfully',
      onboarding: updatedUser.onboarding
    })
  } catch (error) {
    console.error('Onboarding update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
