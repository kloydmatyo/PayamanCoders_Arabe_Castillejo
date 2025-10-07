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

export async function POST(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    await dbConnect();

    // Verify authentication - only admins can trigger migration
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const publicId = params.publicId;
    console.log('Starting migration for:', publicId);

    // Check if the resource exists as image type
    let resource;
    try {
      resource = await cloudinary.api.resource(publicId, { resource_type: 'image' });
    } catch (error) {
      return NextResponse.json(
        { error: 'Resource not found as image type' },
        { status: 404 }
      );
    }

    // Try to download the file using various methods
    let fileBuffer;
    let downloadSuccess = false;

    // Method 1: Private download URL
    try {
      const downloadUrl = cloudinary.utils.private_download_url(publicId, resource.format, {
        resource_type: 'image'
      });
      
      const response = await fetch(downloadUrl);
      if (response.ok) {
        fileBuffer = await response.arrayBuffer();
        downloadSuccess = true;
        console.log('Downloaded using private URL');
      }
    } catch (error) {
      console.log('Private download failed:', error.message);
    }

    // Method 2: Admin API with auth
    if (!downloadSuccess) {
      try {
        const authString = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
        
        const response = await fetch(resource.secure_url, {
          headers: {
            'Authorization': `Basic ${authString}`
          }
        });
        
        if (response.ok) {
          fileBuffer = await response.arrayBuffer();
          downloadSuccess = true;
          console.log('Downloaded using admin auth');
        }
      } catch (error) {
        console.log('Admin auth download failed:', error.message);
      }
    }

    if (!downloadSuccess) {
      return NextResponse.json(
        { error: 'Unable to download file for migration' },
        { status: 500 }
      );
    }

    // Create new public ID for raw resource
    const newPublicId = publicId.replace('workqit/resumes/', 'workqit/resumes/migrated_');
    
    console.log('Re-uploading as raw resource:', newPublicId);

    // Upload as raw resource
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        public_id: newPublicId,
        resource_type: 'raw',
        access_mode: 'public',
        use_filename: false,
        unique_filename: false
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(Buffer.from(fileBuffer));
    });

    console.log('Upload successful:', uploadResult.secure_url);

    // Update database records
    console.log('Updating database records...');

    // Update users collection
    const userUpdateResult = await User.updateMany(
      { 'resume.cloudinaryPublicId': publicId },
      { 
        $set: { 
          'resume.cloudinaryPublicId': uploadResult.public_id,
          'resume.cloudinaryUrl': uploadResult.secure_url,
          'resume.migratedAt': new Date(),
          'resume.migratedFrom': publicId
        } 
      }
    );

    // Update applications collection
    const appUpdateResult = await Application.updateMany(
      { 'resume.cloudinaryPublicId': publicId },
      { 
        $set: { 
          'resume.cloudinaryPublicId': uploadResult.public_id,
          'resume.cloudinaryUrl': uploadResult.secure_url,
          'resume.migratedAt': new Date(),
          'resume.migratedFrom': publicId
        } 
      }
    );

    console.log(`Updated ${userUpdateResult.modifiedCount} user records`);
    console.log(`Updated ${appUpdateResult.modifiedCount} application records`);

    // Test the new URL
    const testResponse = await fetch(uploadResult.secure_url);
    const isAccessible = testResponse.status === 200;

    if (isAccessible) {
      // Delete the old image resource
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        console.log('Old resource deleted');
      } catch (deleteError) {
        console.log('Could not delete old resource:', deleteError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      oldPublicId: publicId,
      newPublicId: uploadResult.public_id,
      newUrl: uploadResult.secure_url,
      usersUpdated: userUpdateResult.modifiedCount,
      applicationsUpdated: appUpdateResult.modifiedCount,
      isAccessible
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}