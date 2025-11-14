import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { VerificationService } from '@/lib/verification-service'
import { AIVerificationService } from '@/lib/ai-verification-service'

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

    console.log('🤖 Starting AI-powered verification analysis...')

    // Perform AI-powered verification analysis
    const aiAnalysis = await AIVerificationService.analyzeCompanyCredibility({
      companyName: employer.companyProfile?.companyName || 'Unknown',
      email: officialEmail || employer.email,
      website: employer.companyProfile?.website,
      businessRegistrationNumber,
      linkedInProfile,
      description: employer.companyProfile?.description,
      industry: employer.companyProfile?.industry,
      founded: employer.companyProfile?.founded,
      location: employer.companyProfile?.location,
      documents
    })

    console.log('✅ AI Analysis Complete:', {
      score: aiAnalysis.credibilityScore,
      level: aiAnalysis.credibilityLevel,
      recommendation: aiAnalysis.recommendation
    })

    // Perform basic automated verification checks
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

    // Determine final status based on AI recommendation and credibility score
    let finalStatus: 'verified' | 'pending' | 'unverified' | 'rejected'
    let finalScore = Math.max(verificationResult.score, aiAnalysis.credibilityScore)

    if (aiAnalysis.recommendation === 'auto_approve' && aiAnalysis.credibilityScore >= 80) {
      finalStatus = 'verified'
    } else if (aiAnalysis.recommendation === 'reject' && aiAnalysis.credibilityScore < 40) {
      finalStatus = 'rejected'
    } else {
      finalStatus = 'pending'
    }

    // Update user verification data with AI analysis
    const updateData: any = {
      'verification.status': finalStatus,
      'verification.trustScore': finalScore,
      'verification.businessRegistrationNumber': businessRegistrationNumber,
      'verification.linkedInProfile': linkedInProfile,
      'verification.officialEmail': officialEmail || employer.email,
      'verification.emailDomain': emailDomain,
      'verification.verificationChecks': {
        ...verificationResult.checks,
        lastCheckedAt: new Date()
      },
      'verification.notes': `AI Analysis: ${aiAnalysis.reasoning}\n\nCredibility Level: ${aiAnalysis.credibilityLevel}\nRecommendation: ${aiAnalysis.recommendation}\n\nStrengths: ${aiAnalysis.analysis.strengths.join(', ')}\nWeaknesses: ${aiAnalysis.analysis.weaknesses.join(', ')}`
    }

    // Add flags from both AI and basic verification
    const allFlags = [
      ...verificationResult.flags.map(flag => ({
        type: flag.type,
        description: flag.description,
        createdAt: new Date(),
        resolved: false
      })),
      ...aiAnalysis.analysis.riskFactors.map(risk => ({
        type: 'pattern_mismatch',
        description: `AI Risk Factor: ${risk}`,
        createdAt: new Date(),
        resolved: false
      }))
    ]

    if (allFlags.length > 0) {
      updateData['verification.flags'] = allFlags
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

    // Set verified date if auto-approved
    if (finalStatus === 'verified') {
      updateData['verification.verifiedAt'] = new Date()
    }

    // Set rejected date if rejected
    if (finalStatus === 'rejected') {
      updateData['verification.rejectedAt'] = new Date()
      updateData['verification.rejectionReason'] = `AI Analysis: Credibility score too low (${aiAnalysis.credibilityScore}/100). ${aiAnalysis.reasoning}`
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $set: updateData },
      { new: true }
    )

    // Prepare response message based on AI analysis
    let message = ''
    if (finalStatus === 'verified') {
      message = `✅ Verification Successful! Your company has been verified with a credibility score of ${finalScore}/100.`
    } else if (finalStatus === 'rejected') {
      message = `❌ Verification Rejected. Your company's credibility score (${aiAnalysis.credibilityScore}/100) is below the minimum threshold. Please provide additional documentation and information.`
    } else {
      message = `⏳ Verification Pending Review. Your company has a credibility score of ${finalScore}/100. Our team will review your application within 24-48 hours.`
    }

    return NextResponse.json({
      message,
      verification: {
        status: updatedUser.verification?.status,
        trustScore: updatedUser.verification?.trustScore,
        credibilityLevel: aiAnalysis.credibilityLevel,
        credibilityDescription: AIVerificationService.getCredibilityDescription(aiAnalysis.credibilityLevel),
        checks: updatedUser.verification?.verificationChecks,
        aiAnalysis: {
          score: aiAnalysis.credibilityScore,
          level: aiAnalysis.credibilityLevel,
          recommendation: aiAnalysis.recommendation,
          strengths: aiAnalysis.analysis.strengths,
          weaknesses: aiAnalysis.analysis.weaknesses,
          riskFactors: aiAnalysis.analysis.riskFactors,
          recommendations: aiAnalysis.analysis.recommendations
        },
        flags: allFlags,
        manualReviewRequired: finalStatus === 'pending'
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
