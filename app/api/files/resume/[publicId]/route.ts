import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Application from '@/models/Application';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const publicId = params.publicId;
    
    // Check if this is a download request
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get('download') === 'true';
    
    // Verify access permissions
    let hasAccess = false;
    
    if (user.role === 'admin') {
      // Admins can access all files
      hasAccess = true;
    } else if (user.role === 'employer') {
      // Employers can access resumes of applicants to their jobs
      const applications = await Application.find({
        'resume.cloudinaryPublicId': publicId
      }).populate('jobId', 'employerId');
      
      hasAccess = applications.some(app => 
        app.jobId && app.jobId.employerId.toString() === user._id.toString()
      );
    } else if (user.role === 'job_seeker') {
      // Job seekers can access their own resumes
      const userWithResume = await User.findOne({
        _id: user._id,
        'resume.cloudinaryPublicId': publicId
      });
      
      hasAccess = !!userWithResume;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the file from Cloudinary - handle both raw and image resource types
    let resource;
    let resourceType;
    
    try {
      resource = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
      resourceType = 'raw';
    } catch (error) {
      // If raw fails, try image resource type
      try {
        resource = await cloudinary.api.resource(publicId, { resource_type: 'image' });
        resourceType = 'image';
      } catch (imageError) {
        console.error('Resource not found in either raw or image:', { publicId, error, imageError });
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    }

    // Get file content based on resource type
    let fileBuffer;
    
    if (resourceType === 'image') {
      // For image resource type PDFs, try multiple approaches
      console.log('Attempting to access image resource PDF:', publicId);
      
      let success = false;
      
      // Approach 1: Try direct URL first (might work for some files)
      try {
        const response = await fetch(resource.secure_url);
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
          success = true;
          console.log('Direct URL access successful');
        }
      } catch (error) {
        console.log('Direct URL failed:', error.message);
      }
      
      // Approach 2: Try private download URL
      if (!success) {
        try {
          const downloadUrl = cloudinary.utils.private_download_url(publicId, resource.format, {
            resource_type: 'image'
          });
          
          const response = await fetch(downloadUrl);
          if (response.ok) {
            fileBuffer = await response.arrayBuffer();
            success = true;
            console.log('Private download URL successful');
          }
        } catch (error) {
          console.log('Private download failed:', error.message);
        }
      }
      
      // Approach 3: Try using Cloudinary's admin API to get resource content
      if (!success) {
        try {
          // Use the admin API to get the resource and then fetch with auth headers
          const authString = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
          
          const adminResponse = await fetch(resource.secure_url, {
            headers: {
              'Authorization': `Basic ${authString}`
            }
          });
          
          if (adminResponse.ok) {
            fileBuffer = await adminResponse.arrayBuffer();
            success = true;
            console.log('Admin API access successful');
          }
        } catch (error) {
          console.log('Admin API failed:', error.message);
        }
      }
      
      // Approach 4: Last resort - try to re-upload as raw and redirect
      if (!success) {
        console.log('All access methods failed for image resource. This file may need migration.');
        return NextResponse.json(
          { 
            error: 'File access temporarily unavailable. Please contact support.',
            needsMigration: true,
            publicId: publicId
          },
          { status: 503 }
        );
      }
    } else {
      // For raw resources, use the direct URL
      const response = await fetch(resource.secure_url);
      if (!response.ok) {
        return new Response('File not found', { status: 404 });
      }
      fileBuffer = await response.arrayBuffer();
    }

    // Set appropriate headers for PDF or other files
    const contentType = resource.format === 'pdf' ? 'application/pdf' : 'application/octet-stream';
    const filename = publicId.split('/').pop() || 'resume';
    
    // Set content disposition based on whether it's a download request
    const disposition = isDownload ? 'attachment' : 'inline';
    const contentDisposition = `${disposition}; filename="${filename}.${resource.format}"`;

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('File access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}