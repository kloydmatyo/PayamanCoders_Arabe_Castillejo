import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Job from '@/models/Job';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const userProfile = await User.findById(user.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Generate cover letter using AI
    const coverLetter = await AIService.generateCoverLetterSuggestions(job, {
      ...userProfile.profile,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName
    });

    return NextResponse.json({
      success: true,
      coverLetter
    });
  } catch (error) {
    console.error('Cover letter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
