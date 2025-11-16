import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Resource from '@/models/Resource';
import User from '@/models/User';

// GET - List resources
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (featured === 'true') query.featured = true;

    const resources = await Resource.find(query)
      .sort({ featured: -1, upvotes: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Resource.countDocuments(query);

    return NextResponse.json({
      success: true,
      resources,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Resources list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create resource
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

    // Only mentors and admins can create resources
    const userProfile = await User.findById(user.userId);
    if (!userProfile || !['mentor', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Only mentors and admins can create resources' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const resource = await Resource.create({
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      tags: data.tags || [],
      url: data.url,
      fileUrl: data.fileUrl,
      author: {
        userId: user.userId,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      resource,
      message: 'Resource created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
