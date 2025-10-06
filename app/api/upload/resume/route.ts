import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Delete old resume if exists
    if (user.resume?.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(user.resume.cloudinaryPublicId);
      } catch (error) {
        console.error('Error deleting old resume:', error);
        // Continue with upload even if deletion fails
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: 'workqit/resumes',
      public_id: `resume_${user._id}_${Date.now()}`,
      allowed_formats: ['pdf', 'docx'],
      max_bytes: maxSize,
    });

    // Update user with resume information
    const resumeData = {
      filename: file.name,
      originalName: file.name,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      fileSize: uploadResult.bytes,
      fileType: uploadResult.format,
      uploadedAt: new Date(),
    };

    await User.findByIdAndUpdate(user._id, {
      resume: resumeData,
    });

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      resume: {
        filename: resumeData.filename,
        url: resumeData.cloudinaryUrl,
        size: resumeData.fileSize,
        type: resumeData.fileType,
        uploadedAt: resumeData.uploadedAt,
      },
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.resume?.cloudinaryPublicId) {
      return NextResponse.json(
        { error: 'No resume found to delete' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(user.resume.cloudinaryPublicId);

    // Remove resume from user document
    await User.findByIdAndUpdate(user._id, {
      $unset: { resume: 1 },
    });

    return NextResponse.json({
      message: 'Resume deleted successfully',
    });

  } catch (error) {
    console.error('Resume deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId).select('resume');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.resume) {
      return NextResponse.json({
        hasResume: false,
        resume: null,
      });
    }

    return NextResponse.json({
      hasResume: true,
      resume: {
        filename: user.resume.filename,
        url: user.resume.cloudinaryUrl,
        size: user.resume.fileSize,
        type: user.resume.fileType,
        uploadedAt: user.resume.uploadedAt,
      },
    });

  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}