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

    const { currentSkills, jobDescription } = await request.json();

    if (!currentSkills || !Array.isArray(currentSkills)) {
      return NextResponse.json(
        { error: 'Current skills array is required' },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const skillSuggestions = await ResumeBuilderAI.suggestSkills(
      currentSkills,
      jobDescription
    );

    return NextResponse.json({
      success: true,
      skills: skillSuggestions
    });
  } catch (error) {
    console.error('Skill suggestion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
