import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CommunityPost from '@/models/CommunityPost';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const post = await CommunityPost.findById(params.id)
      .populate({
        path: 'comments.author',
        select: 'firstName lastName role',
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const formattedComments = post.comments.map((comment: any) => ({
      id: comment._id.toString(),
      author: {
        name: `${comment.author.firstName} ${comment.author.lastName}`,
        role: comment.author.role?.replace('_', ' ') || 'Member',
      },
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    return NextResponse.json({
      comments: formattedComments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
