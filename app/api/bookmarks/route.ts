import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

// GET - Retrieve user's bookmarked resources
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
    const user = await User.findById(userToken.userId).select('bookmarkedResources');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bookmarks: user.bookmarkedResources || [],
    });
  } catch (error) {
    console.error('Error retrieving bookmarks:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve bookmarks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Add a bookmark
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
    const { resource } = body;

    if (!resource || !resource.url) {
      return NextResponse.json(
        { error: 'Resource data with URL is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Check if already bookmarked
    const user = await User.findById(userToken.userId);
    if (!user) {
      console.error('User not found:', userToken.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize bookmarkedResources if it doesn't exist
    if (!user.bookmarkedResources) {
      user.bookmarkedResources = [];
    }

    const isBookmarked = user.bookmarkedResources.some(
      (bookmark: any) => bookmark.url === resource.url
    );

    if (isBookmarked) {
      return NextResponse.json(
        { error: 'Resource already bookmarked' },
        { status: 400 }
      );
    }

    // Add bookmark - explicitly structure the data
    const bookmarkData = {
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      platform: resource.platform,
      difficulty: resource.difficulty,
      estimatedTime: resource.estimatedTime,
      isFree: resource.isFree,
      rating: resource.rating || '',
      bookmarkedAt: new Date(),
    };

    console.log('Adding bookmark:', JSON.stringify(bookmarkData, null, 2));

    // Use direct save instead of findByIdAndUpdate to avoid casting issues
    user.bookmarkedResources.push(bookmarkData);
    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(userToken.userId).select('bookmarkedResources');

    return NextResponse.json({
      success: true,
      bookmarks: updatedUser?.bookmarkedResources || [],
      message: 'Resource bookmarked successfully',
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add bookmark',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const userToken = await verifyToken(request);
    
    if (!userToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Resource URL is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const updatedUser = await User.findByIdAndUpdate(
      userToken.userId,
      {
        $pull: {
          bookmarkedResources: { url: url },
        },
      },
      { new: true }
    ).select('bookmarkedResources');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bookmarks: updatedUser.bookmarkedResources || [],
      message: 'Bookmark removed successfully',
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { 
        error: 'Failed to remove bookmark',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
