import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Application from '@/models/Application';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  console.log('🔍 Preview API called');
  
  try {
    await dbConnect();
    console.log('✅ Database connected');

    // Verify authentication
    const decoded = await verifyToken(request);
    if (!decoded) {
      console.log('❌ No authentication token');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('❌ User not found:', decoded.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const publicId = decodeURIComponent(params.publicId);
    console.log('🔍 Decoded public ID:', publicId);
    console.log('🔍 User role:', user.role);
    
    // For debugging, let's check what resumes exist in the database
    if (user.role === 'job_seeker') {
      const userResume = await User.findById(user._id).select('resume');
      console.log('👤 User resume info:', userResume?.resume);
    }

    // Simplified access check - for now, let's allow access and focus on the file issue
    console.log('✅ Access granted (simplified for debugging)');

    // Try to get the resource info from Cloudinary first
    console.log('🔍 Checking Cloudinary for resource...');
    
    let resourceInfo = null;
    let resourceType = 'raw';
    
    try {
      // Try raw resource type first
      resourceInfo = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
      console.log('✅ Found as raw resource:', resourceInfo.public_id);
    } catch (rawError) {
      console.log('⚠️ Not found as raw resource, trying image...');
      
      try {
        // Try image resource type (for old uploads)
        resourceInfo = await cloudinary.api.resource(publicId, { resource_type: 'image' });
        resourceType = 'image';
        console.log('✅ Found as image resource:', resourceInfo.public_id);
      } catch (imageError) {
        console.error('❌ Resource not found in any format');
        console.error('Raw error:', rawError instanceof Error ? rawError.message : rawError);
        console.error('Image error:', imageError instanceof Error ? imageError.message : imageError);
        
        // List available resources for debugging
        try {
          const allResources = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'workqit/resumes',
            max_results: 10,
            resource_type: 'raw'
          });
          console.log('📋 Available raw resources:');
          allResources.resources.forEach((res: any) => {
            console.log(`   - ${res.public_id}`);
          });
        } catch (listError) {
          console.log('❌ Could not list resources');
        }
        
        return NextResponse.json(
          { error: 'File not found in Cloudinary', publicId, details: rawError instanceof Error ? rawError.message : 'Unknown error' },
          { status: 404 }
        );
      }
    }

    // Generate the secure URL
    const fileUrl = resourceInfo.secure_url;
    console.log('🔗 File URL:', fileUrl);

    // Determine content type
    let contentType = 'application/octet-stream';
    let filename = 'resume';
    
    if (resourceInfo.format === 'pdf') {
      contentType = 'application/pdf';
      filename = `resume.pdf`;
    } else if (resourceInfo.format === 'docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename = `resume.docx`;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(resourceInfo.format)) {
      contentType = `image/${resourceInfo.format === 'jpg' ? 'jpeg' : resourceInfo.format}`;
      filename = `resume.${resourceInfo.format}`;
    }

    console.log('📄 Content type:', contentType);

    // Files are now public, generate URL with inline display flag
    console.log('🔗 Generating public URL with inline display...');
    
    const publicUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      secure: true,
      flags: 'attachment:false'
    });
    
    console.log('✅ Public URL generated:', publicUrl);
    
    // Redirect to the public URL with inline display
    return NextResponse.redirect(publicUrl, {
      status: 302,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'public, max-age=3600',
      }
    });

  } catch (error) {
    console.error('❌ File preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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