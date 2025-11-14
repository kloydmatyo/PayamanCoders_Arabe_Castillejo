import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const jobId = params.id
    
    // Fetch job without population first
    let job = await Job.findById(jobId).lean()
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Try to populate employerId, but handle failures gracefully
    try {
      const populated = await Job.populate(job, {
        path: 'employerId',
        select: 'firstName lastName'
      })
      job = populated
    } catch (populateError) {
      console.warn('Could not populate employerId for job:', populateError)
      // Continue with unpopulated data
    }

    return NextResponse.json({
      job
    })

  } catch (error) {
    console.error('Job fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}