import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const remote = searchParams.get('remote')
    const skills = searchParams.get('skills')
    const employer = searchParams.get('employer')

    // Build filter object
    const filter: any = { status: 'active' }
    
    // If employer=true, filter by current user's jobs
    if (employer === 'true') {
      const user = await verifyToken(request)
      if (!user || user.role !== 'employer') {
        return NextResponse.json(
          { error: 'Unauthorized - employer access required' },
          { status: 401 }
        )
      }
      filter.employerId = user.userId
    }
    
    if (type) filter.type = type
    if (location) filter.location = { $regex: location, $options: 'i' }
    if (remote === 'true') filter.remote = true
    if (remote === 'false') filter.remote = false
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim())
      filter.skills = { $in: skillsArray }
    }

    const skip = (page - 1) * limit

    // Fetch jobs without population first to avoid errors
    let jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Job.countDocuments(filter)

    // Try to populate employerId, but handle failures gracefully
    try {
      jobs = await Job.populate(jobs, {
        path: 'employerId',
        select: 'firstName lastName email'
      })
    } catch (populateError) {
      console.warn('Could not populate employerId for some jobs:', populateError)
      // Continue with unpopulated data
    }

    // Add applicant count for employer view and ensure employerId is present
    const jobsWithApplicantCount = jobs.map(job => {
      const jobData: any = {
        ...job,
        // Ensure employerId is always an object, even if population failed
        employerId: job.employerId || null
      }
      
      if (employer === 'true') {
        jobData.applicantCount = job.applicants ? job.applicants.length : 0
      }
      
      return jobData
    })

    return NextResponse.json({
      jobs: jobsWithApplicantCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check employer verification status
    const User = (await import('@/models/User')).default
    const employer = await User.findById(user.userId).select('verification')
    
    if (!employer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Only verified or pending employers can post jobs
    const verificationStatus = employer.verification?.status || 'unverified'
    if (verificationStatus === 'unverified') {
      return NextResponse.json(
        { 
          error: 'Verification required',
          message: 'Please complete employer verification before posting jobs',
          verificationRequired: true
        },
        { status: 403 }
      )
    }

    if (verificationStatus === 'rejected' || verificationStatus === 'suspended') {
      return NextResponse.json(
        { 
          error: 'Account suspended',
          message: 'Your account verification has been rejected or suspended. Please contact support.',
          verificationStatus
        },
        { status: 403 }
      )
    }

    const jobData = await request.json()
    
    // Set job status based on verification
    const jobStatus = verificationStatus === 'verified' ? 'active' : 'draft'
    
    const job = await Job.create({
      ...jobData,
      employerId: user.userId,
      status: jobStatus
    })

    return NextResponse.json(
      { 
        message: verificationStatus === 'verified' 
          ? 'Job created successfully' 
          : 'Job created as draft - will be published after verification',
        job,
        requiresVerification: verificationStatus === 'pending'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}