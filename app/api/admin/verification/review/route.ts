import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      )
    }

    const { employerId, action, notes, trustScoreAdjustment } = await request.json()

    if (!employerId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const employer = await User.findById(employerId)
    if (!employer || employer.role !== 'employer') {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    const updateData: any = {
      'verification.lastReviewedAt': new Date(),
      'verification.reviewedBy': user.userId,
      'verification.notes': notes || employer.verification?.notes
    }

    if (action === 'approve') {
      updateData['verification.status'] = 'verified'
      updateData['verification.verifiedAt'] = new Date()
      updateData['verification.verificationChecks.manualReviewRequired'] = false
      
      // Adjust trust score if provided, otherwise set to minimum 70
      const currentScore = employer.verification?.trustScore || 0
      updateData['verification.trustScore'] = trustScoreAdjustment || Math.max(70, currentScore)
      
    } else if (action === 'reject') {
      updateData['verification.status'] = 'rejected'
      updateData['verification.rejectedAt'] = new Date()
      updateData['verification.rejectionReason'] = notes || 'Failed verification requirements'
      updateData['verification.trustScore'] = 0
      
    } else if (action === 'suspend') {
      updateData['verification.status'] = 'suspended'
      updateData['verification.trustScore'] = 0
      
    } else if (action === 'request_info') {
      updateData['verification.status'] = 'pending'
      updateData['verification.verificationChecks.manualReviewRequired'] = true
    }

    const updatedEmployer = await User.findByIdAndUpdate(
      employerId,
      { $set: updateData },
      { new: true }
    ).select('verification')

    return NextResponse.json({
      message: `Employer ${action}ed successfully`,
      verification: updatedEmployer.verification
    })

  } catch (error) {
    console.error('Verification review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
