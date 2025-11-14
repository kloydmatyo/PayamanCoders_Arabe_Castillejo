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

    const { employerId, reason, description } = await request.json()

    if (!employerId || !reason || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the employer
    const employer = await User.findById(employerId)
    if (!employer || employer.role !== 'employer') {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Add flag to employer's verification
    const flag = {
      type: 'user_report',
      description: `${reason}: ${description}`,
      reportedBy: user.userId,
      createdAt: new Date(),
      resolved: false
    }

    await User.findByIdAndUpdate(employerId, {
      $push: { 'verification.flags': flag },
      $inc: { 'verification.reports': 1 },
      $set: { 
        'verification.verificationChecks.manualReviewRequired': true,
        'verification.verificationChecks.lastCheckedAt': new Date()
      }
    })

    // If reports exceed threshold, suspend verification
    const updatedEmployer = await User.findById(employerId)
    if (updatedEmployer.verification && updatedEmployer.verification.reports >= 3) {
      await User.findByIdAndUpdate(employerId, {
        $set: { 
          'verification.status': 'suspended',
          'verification.trustScore': Math.max(0, (updatedEmployer.verification.trustScore || 0) - 20)
        }
      })
    }

    return NextResponse.json({
      message: 'Report submitted successfully',
      reportCount: (updatedEmployer.verification?.reports || 0) + 1
    })

  } catch (error) {
    console.error('Report submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
