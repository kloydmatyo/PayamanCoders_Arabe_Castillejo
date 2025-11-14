import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
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

    const { resumeText, jobId } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    let targetJob = null;
    if (jobId) {
      targetJob = await Job.findById(jobId);
    }

    // Analyze resume using AI
    const analysis = await AIService.analyzeResume(resumeText, targetJob);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Resume analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
