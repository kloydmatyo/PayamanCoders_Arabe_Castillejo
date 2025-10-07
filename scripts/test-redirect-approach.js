const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testRedirectApproach() {
  console.log('🧪 Testing Redirect Approach\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Import models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find a user with a resume
    const userWithResume = await User.findOne({ 
      resume: { $exists: true },
      'resume.cloudinaryUrl': { $exists: true }
    }).select('firstName lastName resume');
    
    if (!userWithResume) {
      console.log('❌ No user with resume found for testing');
      return;
    }
    
    console.log(`📄 Testing with: ${userWithResume.firstName} ${userWithResume.lastName}`);
    console.log(`   Original URL: ${userWithResume.resume.cloudinaryUrl}`);
    
    // Extract public ID from URL
    const extractPublicId = (url) => {
      const match = url.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    };
    
    const publicId = extractPublicId(userWithResume.resume.cloudinaryUrl);
    console.log(`📋 Extracted public ID: ${publicId}`);
    
    if (!publicId) {
      console.log('❌ Could not extract public ID');
      return;
    }
    
    // Test different URL generation approaches
    console.log('\n🔗 Testing different URL approaches...');
    const { v2: cloudinary } = require('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // 1. Original URL
    const originalUrl = userWithResume.resume.cloudinaryUrl;
    console.log(`1. Original URL: ${originalUrl}`);
    
    // 2. Public URL with inline flag
    const publicInlineUrl = cloudinary.url(publicId, {
      resource_type: 'image', // We know from testing it's stored as image
      secure: true,
      flags: 'attachment:false'
    });
    console.log(`2. Public inline URL: ${publicInlineUrl}`);
    
    // 3. URL with transformation
    const transformedUrl = cloudinary.url(publicId, {
      resource_type: 'image',
      secure: true,
      transformation: [
        { flags: 'attachment:false' }
      ]
    });
    console.log(`3. Transformed URL: ${transformedUrl}`);
    
    // 4. Try to make the resource public (if possible)
    console.log('\n🔓 Checking if we can make the resource public...');
    try {
      const updateResult = await cloudinary.api.update(publicId, {
        resource_type: 'image',
        access_mode: 'public'
      });
      console.log('✅ Resource updated to public access');
      console.log(`   Access mode: ${updateResult.access_mode}`);
      
      // Generate new public URL
      const newPublicUrl = cloudinary.url(publicId, {
        resource_type: 'image',
        secure: true,
        flags: 'attachment:false'
      });
      console.log(`   New public URL: ${newPublicUrl}`);
      
    } catch (updateError) {
      console.log('⚠️ Could not update access mode:', updateError.message);
      console.log('   This might be due to account restrictions or the resource is already public');
    }
    
    console.log('\n💡 Recommendations:');
    console.log('   1. Try the redirect approach with public inline URL');
    console.log('   2. If files are truly private, we need to proxy them server-side');
    console.log('   3. Consider updating upload settings to make files public by default');
    console.log('   4. Use signed URLs for temporary access');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testRedirectApproach();