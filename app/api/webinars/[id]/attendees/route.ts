import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Webinar from '@/models/Webinar';
import User from '@/models/User';

// GET - Get webinar attendees (mentor only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const webinar = await Webinar.findById(params.id);
    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    // Check if user is the host or admin
    if (webinar.host.userId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to view attendees' },
        { status: 403 }
      );
    }

    // Get attendee details
    const attendeeIds = webinar.attendees.map((a: any) => a.userId);
    const attendeeDetails = await User.find({ _id: { $in: attendeeIds } })
      .select('firstName lastName email profile.profilePicture')
      .lean();

    // Merge attendee data with registration info
    const attendeesWithDetails = webinar.attendees.map((attendee: any) => {
      const userDetails = attendeeDetails.find(
        (u: any) => u._id.toString() === attendee.userId.toString()
      );
      return {
        userId: attendee.userId,
        registeredAt: attendee.registeredAt,
        attended: attendee.attended,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        email: userDetails?.email,
        profilePicture: (userDetails as any)?.profile?.profilePicture,
      };
    });

    return NextResponse.json({
      success: true,
      attendees: attendeesWithDetails,
      total: attendeesWithDetails.length,
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
