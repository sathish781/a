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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|m4a|mp3|wav|3gp|mp4/;
    const ext = path.extname(file.originalname).toLowerCase();
    const isValid = allowedTypes.test(ext) || allowedTypes.test(file.mimetype);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported.'));
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

const uploadFile = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded.');
    }

    let fileUrl;

    // Try Cloudinary for images only, use local/other for audio if Cloudinary isn't configured for it
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isImage = /jpeg|jpg|png|gif|webp/.test(ext);

    if (isImage) {
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      if (cloudinaryUrl) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
        fileUrl = cloudinaryUrl;
      }
    }

    if (!fileUrl) {
      // Fallback: serve local file via Express static
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    res.json({
      message: 'File uploaded successfully',
      fileUrl
    });
  })
];

module.exports = { uploadImage, uploadFile };
