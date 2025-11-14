import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    // Find employers needing review
    const employers = await User.find({
      role: 'employer',
      'verification.status': status
    })
    .select('firstName lastName email companyProfile verification createdAt')
    .sort({ 'verification.verificationChecks.lastCheckedAt': -1 })
    .lean()

    return NextResponse.json({
      employers: employers.map(emp => ({
        id: emp._id,
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        companyName: emp.companyProfile?.companyName,
        verification: emp.verification,
        registeredAt: emp.createdAt
      })),
      total: employers.length
    })

  } catch (error) {
    console.error('Pending verification fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
