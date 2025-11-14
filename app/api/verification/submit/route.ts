import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { VerificationService } from '@/lib/verification-service'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized - employer access required' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      businessRegistrationNumber,
      linkedInProfile,
      officialEmail,
      documents
    } = data

    // Get user's current data
    const employer = await User.findById(user.userId)
    if (!employer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (employer.verification?.status === 'verified') {
      return NextResponse.json(
        { error: 'Already verified' },
        { status: 400 }
      )
    }

    // Perform automated verification
    const verificationResult = await VerificationService.verifyEmployer({
      email: officialEmail || employer.email,
      companyName: employer.companyProfile?.companyName,
      website: employer.companyProfile?.website,
      description: employer.companyProfile?.description,
      linkedInProfile,
      businessRegistrationNumber,
      hasDocuments: documents && documents.length > 0
    })

    // Extract email domain
    const emailDomain = (officialEmail || employer.email).split('@')[1]

    // Update user verification data
    const updateData: any = {
      'verification.status': verificationResult.passed ? 'verified' : 
                            verificationResult.checks.manualReviewRequired ? 'pending' : 'unverified',
      'verification.trustScore': verificationResult.score,
      'verification.businessRegistrationNumber': businessRegistrationNumber,
      'verification.linkedInProfile': linkedInProfile,
      'verification.officialEmail': officialEmail || employer.email,
      'verification.emailDomain': emailDomain,
      'verification.verificationChecks': {
        ...verificationResult.checks,
        lastCheckedAt: new Date()
      }
    }

    // Add flags if any
    if (verificationResult.flags.length > 0) {
      updateData['verification.flags'] = verificationResult.flags.map(flag => ({
        type: flag.type,
        description: flag.description,
        createdAt: new Date(),
        resolved: false
      }))
    }

    // Add documents if provided
    if (documents && documents.length > 0) {
      updateData['verification.documents'] = documents.map((doc: any) => ({
        type: doc.type,
        url: doc.url,
        uploadedAt: new Date(),
        verified: false
      }))
    }

    // Set verified date if passed
    if (verificationResult.passed) {
      updateData['verification.verifiedAt'] = new Date()
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $set: updateData },
      { new: true }
    )

    return NextResponse.json({
      message: verificationResult.passed 
        ? 'Verification successful' 
        : verificationResult.checks.manualReviewRequired
          ? 'Verification submitted for manual review'
          : 'Verification incomplete - please provide more information',
      verification: {
        status: updatedUser.verification?.status,
        trustScore: updatedUser.verification?.trustScore,
        checks: updatedUser.verification?.verificationChecks,
        flags: verificationResult.flags,
        manualReviewRequired: verificationResult.checks.manualReviewRequired
      }
    })

  } catch (error) {
    console.error('Verification submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
