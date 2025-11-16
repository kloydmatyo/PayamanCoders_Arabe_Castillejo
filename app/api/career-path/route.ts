import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

// GET - Retrieve user's saved career path
export async function GET(request: NextRequest) {
  try {
    const userToken = await verifyToken(request);
    
    if (!userToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(userToken.userId);

    if (!user) {
      console.error('❌ User not found:', userToken.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', userToken.userId);
    console.log('📦 Career path in DB:', user.careerPath);

    return NextResponse.json({
      success: true,
      careerPath: user.careerPath || null,
    });
  } catch (error) {
    console.error('❌ Error retrieving career path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve career path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Save user's career path
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
    const { careerPath } = body;

    if (!careerPath || !careerPath.title) {
      return NextResponse.json(
        { error: 'Career path data is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const careerPathData = {
      title: careerPath.title,
      description: careerPath.description,
      matchScore: careerPath.matchScore,
      reasons: careerPath.reasons || [],
      requiredSkills: careerPath.requiredSkills || [],
      salaryRange: careerPath.salaryRange,
      growthPotential: careerPath.growthPotential,
      selectedAt: new Date(),
    };
    
    const user = await User.findByIdAndUpdate(
      userToken.userId,
      { careerPath: careerPathData },
      { new: true, runValidators: false }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      careerPath: user.careerPath || careerPathData,
      message: 'Career path saved successfully',
    });
  } catch (error) {
    console.error('❌ Error saving career path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save career path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove user's saved career path
export async function DELETE(request: NextRequest) {
  try {
    const userToken = await verifyToken(request);
    
    if (!userToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const user = await User.findByIdAndUpdate(
      userToken.userId,
      {
        $unset: { careerPath: 1 },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }



    return NextResponse.json({
      success: true,
      message: 'Career path removed successfully',
    });
  } catch (error) {
    console.error('❌ Error removing career path:', error);
    return NextResponse.json(
      { 
        error: 'Failed to remove career path',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
