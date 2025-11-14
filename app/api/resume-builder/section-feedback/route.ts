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

    const { sectionName, sectionContent, jobDescription } = await request.json();

    if (!sectionName || !sectionContent) {
      return NextResponse.json(
        { error: 'Section name and content are required' },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const feedback = await ResumeBuilderAI.getSectionFeedback(
      sectionName,
      sectionContent,
      jobDescription
    );

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Section feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
