const cloudinary = require('cloudinary').v2;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

async function uploadToCloudinary(filePath) {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'bookconnect'
      });
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error, using local path:', err.message);
    }
  }
  return null;
}

module.exports = {
  uploadToCloudinary
};
