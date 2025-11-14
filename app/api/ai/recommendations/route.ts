import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Get active jobs
    const jobs = await Job.find({ status: 'active' })
      .limit(20)
      .lean();

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: []
      });
    }

    // Get AI-powered recommendations
    const recommendations = await AIService.generateJobRecommendations(
      userProfile.profile,
      jobs
    );

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, 10)
    });
  } catch (error) {
    console.error('AI recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
