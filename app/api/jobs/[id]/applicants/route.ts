import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔍 Job applicants API called for job:', params.id)
  
  try {
    await dbConnect()
    console.log('✅ Database connected')
    
    const user = await verifyToken(request)
    if (!user) {
      console.log('❌ No user token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (user.role !== 'employer') {
      console.log('❌ User is not an employer:', user.role)
      return NextResponse.json(
        { error: 'Unauthorized - employer access required' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated as employer:', user.userId)

    const jobId = params.id
    console.log('🔍 Looking for job:', jobId)

    // Verify that the job belongs to the current employer
    const job = await Job.findById(jobId)
    if (!job) {
      console.log('❌ Job not found:', jobId)
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    console.log('✅ Job found:', job.title, 'by employer:', job.employerId)

    if (job.employerId.toString() !== user.userId) {
      console.log('❌ Job does not belong to user:', {
        jobEmployer: job.employerId.toString(),
        currentUser: user.userId
      })
      return NextResponse.json(
        { error: 'Unauthorized - not your job' },
        { status: 403 }
      )
    }

    console.log('✅ Job ownership verified')

    console.log('🔍 Fetching applications for job:', jobId)

    // Validate and convert jobId to ObjectId for proper comparison
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      console.log('❌ Invalid job ID format:', jobId)
      return NextResponse.json(
        { error: 'Invalid job ID format' },
        { status: 400 }
      )
    }

    const jobObjectId = new mongoose.Types.ObjectId(jobId)
    console.log('🔍 Using ObjectId:', jobObjectId)

    // Get all applications for this job with applicant details
    let applications
    try {
      applications = await Application.find({ jobId: jobObjectId })
        .populate({
          path: 'applicantId',
          select: 'firstName lastName email profile.bio profile.skills profile.experience profile.location',
          model: 'User'
        })
        .sort({ createdAt: -1 })
        .lean()
      
      console.log('✅ Applications query successful')
    } catch (populateError) {
      console.error('❌ Population error:', populateError)
      
      // Fallback: get applications without population and manually populate
      applications = await Application.find({ jobId: jobObjectId })
        .sort({ createdAt: -1 })
        .lean()
      
      console.log('✅ Fallback query successful, will manually populate')
    }

    console.log('📊 Found applications:', applications.length)

    // Format the response with better error handling
    const formattedApplicants = []
    
    for (const app of applications) {
      try {
        if (!app.applicantId) {
          console.log('⚠️ Skipping application with missing applicantId:', app._id)
          continue
        }

        let applicantData
        
        // Check if applicantId is populated (object) or just an ID (string/ObjectId)
        if (typeof app.applicantId === 'object' && app.applicantId.firstName) {
          // Already populated
          applicantData = app.applicantId
        } else {
          // Need to manually populate
          console.log('🔍 Manually populating applicant:', app.applicantId)
          applicantData = await User.findById(app.applicantId)
            .select('firstName lastName email profile.bio profile.skills profile.experience profile.location')
            .lean()
          
          if (!applicantData) {
            console.log('⚠️ Applicant not found:', app.applicantId)
            continue
          }
        }

        const formattedApplicant = {
          applicationId: app._id,
          applicant: {
            id: applicantData._id,
            firstName: applicantData.firstName || 'Unknown',
            lastName: applicantData.lastName || 'User',
            email: applicantData.email || 'No email',
            bio: applicantData.profile?.bio || '',
            skills: applicantData.profile?.skills || [],
            experience: applicantData.profile?.experience || '',
            location: applicantData.profile?.location || ''
          },
          application: {
            status: app.status || 'pending',
            coverLetter: app.coverLetter || '',
            appliedDate: app.createdAt,
            feedbacks: app.feedbacks || [],
            resume: app.resume ? {
              filename: app.resume.filename,
              cloudinaryUrl: app.resume.cloudinaryUrl,
              uploadedAt: app.resume.uploadedAt
            } : null
          }
        }

        formattedApplicants.push(formattedApplicant)
        
      } catch (formatError) {
        console.error('❌ Error formatting applicant:', formatError, app._id)
        continue
      }
    }

    console.log('✅ Formatted applicants:', formattedApplicants.length)

    return NextResponse.json({
      job: {
        id: job._id,
        title: job.title,
        company: job.company
      },
      applicants: formattedApplicants,
      totalApplicants: formattedApplicants.length
    })

  } catch (error) {
    console.error('❌ Job applicants fetch error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized - employer access required' },
        { status: 401 }
      )
    }

    const jobId = params.id
    const { applicationId, status, feedback } = await request.json()

    // Verify that the job belongs to the current employer
    const job = await Job.findById(jobId)
    if (!job || job.employerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update the application status
    const updateData: any = { status }
    
    // Add feedback if provided
    if (feedback) {
      updateData.$push = {
        feedbacks: {
          ...feedback,
          employerId: user.userId,
          createdAt: new Date()
        }
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    )

    if (!updatedApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Application status updated successfully',
      application: {
        id: updatedApplication._id,
        status: updatedApplication.status
      }
    })

  } catch (error) {
    console.error('Application status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}