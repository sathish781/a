const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const asyncHandler = require('../utils/asyncHandler');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp).'));
    }
  }
});

const uploadImage = [
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded.');
    }

    let imageUrl;

    // Try Cloudinary first
    const cloudinaryUrl = await uploadToCloudinary(req.file.path);
    if (cloudinaryUrl) {
      // Delete local file since Cloudinary upload succeeded
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      imageUrl = cloudinaryUrl;
    } else {
      // Fallback: serve local file via Express static
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  })
];

module.exports = { uploadImage };