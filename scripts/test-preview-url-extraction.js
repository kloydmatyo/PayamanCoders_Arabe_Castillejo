// Test script to verify public ID extraction from Cloudinary URLs

function extractPublicIdFromUrl(url) {
  try {
    console.log("Testing URL:", url);

    // Match Cloudinary URL pattern and extract public ID
    const match = url.match(
      /\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/
    );
    if (match && match[1]) {
      console.log("✅ Match found with pattern 1:", match[1]);
      return match[1];
    }

    // Alternative pattern for different Cloudinary URL formats
    const altMatch = url.match(
      /\/([^/]+\/[^/]+\/[^/]+)\.(?:pdf|docx?|jpe?g|png|gif|webp|bmp)$/i
    );
    if (altMatch && altMatch[1]) {
      console.log("✅ Match found with pattern 2:", altMatch[1]);
      return altMatch[1];
    }

    console.log("❌ No match found");
    return null;
  } catch (error) {
    console.error("❌ Error extracting public ID:", error);
    return null;
  }
}

function testUrlExtraction() {
  console.log("🧪 Testing Public ID Extraction from Cloudinary URLs\n");

  const testUrls = [
    "https://res.cloudinary.com/dmydag1zp/raw/upload/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf",
    "https://res.cloudinary.com/dmydag1zp/image/upload/v1759736041/workqit/resumes/resume_68cd3ce176b45143c27c85ba_1759736040034.pdf",
    "https://res.cloudinary.com/dmydag1zp/raw/upload/workqit/resumes/resume_user_123.pdf",
    "https://res.cloudinary.com/dmydag1zp/raw/upload/v1/workqit/resumes/test_resume.docx",
  ];

  testUrls.forEach((url, index) => {
    console.log(`\n${index + 1}️⃣ Testing URL ${index + 1}:`);
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      const previewUrl = `/api/files/preview/${encodeURIComponent(publicId)}`;
      console.log("   Generated preview URL:", previewUrl);
    } else {
      console.log("   ❌ Failed to extract public ID");
    }
  });

  console.log("\n🎯 Test Complete!");
  console.log("   The preview URLs should work with the new proxy endpoint.");
  console.log(
    "   These URLs will serve files with proper Content-Disposition headers."
  );
}

testUrlExtraction();
