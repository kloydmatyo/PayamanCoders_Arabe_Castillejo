import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
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

    const userProfile = await User.findById(user.userId)
    if (!userProfile || userProfile.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Only mentors can access score data' },
        { status: 403 }
      )
    }

    const score = calculateMentorScore(userProfile)

    return NextResponse.json({ score })

  } catch (error) {
    console.error('Mentor score error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Same as GET - recalculates score
  return GET(request)
}

function calculateMentorScore(user: any) {
  let profileCompleteness = 0
  let webinarActivity = 0
  let mentorshipEngagement = 0
  let platformContribution = 0
  let accountQuality = 0

  const missingItems: string[] = []
  const recommendations: string[] = []

  // Profile Completeness (25 points)
  if (user.profile?.bio) profileCompleteness += 8
  else missingItems.push('Add a professional bio to your profile')

  if (user.profile?.skills && user.profile.skills.length > 0) {
    profileCompleteness += Math.min(10, user.profile.skills.length * 2)
    if (user.profile.skills.length < 5) {
      missingItems.push('Add more skills to showcase your expertise')
    }
  } else {
    missingItems.push('Add your skills and areas of expertise')
  }

  if (user.profile?.experience) profileCompleteness += 7
  else missingItems.push('Add your professional experience')

  // Webinar Activity (25 points)
  // This would need to query webinars collection
  // For now, using placeholder logic
  const webinarCount = 0 // TODO: Query actual webinars
  if (webinarCount === 0) {
    missingItems.push('Create your first webinar to share knowledge')
    recommendations.push('Host webinars to increase your visibility and score')
  } else if (webinarCount < 3) {
    webinarActivity = webinarCount * 8
    recommendations.push('Host more webinars to reach expert status')
  } else {
    webinarActivity = 25
  }

  // Mentorship Engagement (25 points)
  // This would need to query mentorship requests
  // For now, using placeholder logic
  const mentorshipCount = 0 // TODO: Query actual mentorship requests
  if (mentorshipCount === 0) {
    missingItems.push('Accept mentorship requests to build your reputation')
    recommendations.push('Respond to mentorship requests promptly')
  } else if (mentorshipCount < 5) {
    mentorshipEngagement = mentorshipCount * 5
    recommendations.push('Take on more mentees to increase engagement')
  } else {
    mentorshipEngagement = 25
  }

  // Platform Contribution (15 points)
  if (user.profile?.location) platformContribution += 5
  else missingItems.push('Add your location to help mentees find you')

  if (user.verification?.status === 'verified') {
    platformContribution += 10
    recommendations.push('Maintain your verified status by staying active')
  } else {
    missingItems.push('Get verified to boost your credibility')
    recommendations.push('Complete verification to increase your score by 10 points')
  }

  // Account Quality (10 points)
  const accountAge = Date.now() - new Date(user.createdAt).getTime()
  const daysOld = accountAge / (1000 * 60 * 60 * 24)
  
  if (daysOld > 90) accountQuality += 5
  else if (daysOld > 30) accountQuality += 3
  else if (daysOld > 7) accountQuality += 1

  if (user.email && user.emailVerified) accountQuality += 5
  else missingItems.push('Verify your email address')

  const totalScore = profileCompleteness + webinarActivity + mentorshipEngagement + platformContribution + accountQuality

  // Determine tier
  let tier: 'beginner' | 'active' | 'experienced' | 'expert' | 'master'
  if (totalScore >= 90) tier = 'master'
  else if (totalScore >= 75) tier = 'expert'
  else if (totalScore >= 60) tier = 'experienced'
  else if (totalScore >= 40) tier = 'active'
  else tier = 'beginner'

  // Add tier-specific recommendations
  if (tier === 'beginner') {
    recommendations.push('Complete your profile to reach Active Mentor status')
    recommendations.push('Your first webinar will significantly boost your score')
  } else if (tier === 'active') {
    recommendations.push('Host regular webinars to reach Experienced Mentor')
    recommendations.push('Accept more mentorship requests to build your reputation')
  } else if (tier === 'experienced') {
    recommendations.push('Get verified to reach Expert Mentor status')
    recommendations.push('Maintain consistent engagement with mentees')
  } else if (tier === 'expert') {
    recommendations.push('You\'re almost at Master level - keep up the great work!')
    recommendations.push('Share your expertise through more webinars')
  } else {
    recommendations.push('Congratulations! You\'re a Master Mentor')
    recommendations.push('Continue inspiring and guiding mentees')
  }

  return {
    totalScore,
    breakdown: {
      profileCompleteness,
      webinarActivity,
      mentorshipEngagement,
      platformContribution,
      accountQuality,
    },
    tier,
    missingItems: missingItems.slice(0, 5), // Limit to top 5
    recommendations: recommendations.slice(0, 3), // Limit to top 3
  }
}
