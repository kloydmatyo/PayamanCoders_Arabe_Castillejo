import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import Application from '@/models/Application'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    await dbConnect()

    // Verify admin access
    const { isAdmin, error } = await verifyAdminAccess(request)
    if (!isAdmin) {
      return NextResponse.json({ error }, { status: 403 })
    }

    const exportType = params.type

    let csvData = ''
    let filename = ''

    switch (exportType) {
      case 'users':
        const users = await User.find().select('-password').lean()
        
        // CSV headers
        csvData = 'ID,First Name,Last Name,Email,Role,Email Verified,Auth Provider,Has Password,Location,Skills,Created At\n'
        
        // CSV data
        users.forEach(user => {
          const skills = user.profile?.skills?.join('; ') || ''
          const location = user.profile?.location || ''
          csvData += `"${user._id}","${user.firstName}","${user.lastName}","${user.email}","${user.role}","${user.emailVerified}","${user.authProvider}","${user.hasPassword}","${location}","${skills}","${user.createdAt}"\n`
        })
        
        filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'jobs':
        const jobs = await Job.find()
          .populate('employer', 'firstName lastName email')
          .lean()
        
        // CSV headers
        csvData = 'ID,Title,Company,Type,Location,Remote,Status,Salary Min,Salary Max,Description,Requirements,Employer Name,Employer Email,Created At\n'
        
        // CSV data
        jobs.forEach(job => {
          const employerName = `${job.employer.firstName} ${job.employer.lastName}`
          const description = (job.description || '').replace(/"/g, '""').replace(/\n/g, ' ')
          const requirements = (job.requirements || []).join('; ')
          
          csvData += `"${job._id}","${job.title}","${job.company}","${job.type}","${job.location}","${job.remote}","${job.status}","${job.salaryMin || ''}","${job.salaryMax || ''}","${description}","${requirements}","${employerName}","${job.employer.email}","${job.createdAt}"\n`
        })
        
        filename = `jobs_export_${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'applications':
        const applications = await Application.find()
          .populate('applicant', 'firstName lastName email')
          .populate('job', 'title company')
          .populate('employer', 'firstName lastName email')
          .lean()
        
        // CSV headers
        csvData = 'ID,Applicant Name,Applicant Email,Job Title,Company,Employer Name,Employer Email,Status,Cover Letter,Applied At\n'
        
        // CSV data
        applications.forEach(app => {
          const applicantName = `${app.applicant.firstName} ${app.applicant.lastName}`
          const employerName = `${app.employer.firstName} ${app.employer.lastName}`
          const coverLetter = (app.coverLetter || '').replace(/"/g, '""').replace(/\n/g, ' ')
          
          csvData += `"${app._id}","${applicantName}","${app.applicant.email}","${app.job.title}","${app.job.company}","${employerName}","${app.employer.email}","${app.status}","${coverLetter}","${app.createdAt}"\n`
        })
        
        filename = `applications_export_${new Date().toISOString().split('T')[0]}.csv`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Return CSV file
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}