const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function createFolder(folderName) {
  try {
    // Cloudinary creates folders implicitly by uploading an empty file or using the explicit API
    const result = await cloudinary.api.create_folder(folderName);
    console.log(`✅ Folder "${folderName}" created:`, result);
  } catch (error) {
    if (error.http_code === 409) {
      console.log(`⚠️ Folder "${folderName}" already exists.`);
    } else {
      console.error('❌ Error creating folder:', error.message);
    }
  }
}

createFolder('matthew');