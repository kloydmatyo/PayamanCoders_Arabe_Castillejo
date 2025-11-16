import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getLearningResources } from '@/lib/ai-learning-resources';

export async function POST(request: NextRequest) {
  try {
    const userToken = await verifyToken(request);
    
    if (!userToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { careerTitle, skills } = body;

    if (!careerTitle || !skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Career title and skills array are required' },
        { status: 400 }
      );
    }

    const resources = await getLearningResources(careerTitle, skills);

    return NextResponse.json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error('❌ Error in learning resources API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get learning resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
