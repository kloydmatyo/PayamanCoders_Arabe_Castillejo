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

    // Build filter object
    const filter: any = { status: 'active' }
    
    if (type) filter.type = type
    if (location) filter.location = { $regex: location, $options: 'i' }
    if (remote === 'true') filter.remote = true
    if (remote === 'false') filter.remote = false
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim())
      filter.skills = { $in: skillsArray }
    }

    const skip = (page - 1) * limit

    // Fetch jobs with optimized query
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() // Use lean() for better performance

    const total = await Job.countDocuments(filter)

    // Populate employer info efficiently
    const jobsWithEmployer = await Promise.all(
      jobs.map(async (job) => {
        try {
          const populatedJob = await Job.findById(job._id)
            .populate('employerId', 'firstName lastName email')
            .lean()
          return populatedJob || job
        } catch (populateError) {
          console.warn('Failed to populate employer for job:', job._id)
          return job
        }
      })
    )

    return NextResponse.json({
      jobs: jobsWithEmployer,
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
      { error: 'Internal server error' },
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

    const jobData = await request.json()
    
    const job = await Job.create({
      ...jobData,
      employerId: user.userId,
    })

    return NextResponse.json(
      { message: 'Job created successfully', job },
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