import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ResumeBuilderAI } from '@/lib/resume-builder-ai';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bulletPoints, jobTitle, jobDescription } = await request.json();

    if (!bulletPoints || !Array.isArray(bulletPoints)) {
      return NextResponse.json(
        { error: 'Bullet points array is required' },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const optimizedBullets = await ResumeBuilderAI.optimizeBulletPoints(
      bulletPoints,
      jobTitle || 'Professional',
      jobDescription
    );

    return NextResponse.json({
      success: true,
      optimizedBullets
    });
  } catch (error) {
    console.error('Bullet optimization API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
