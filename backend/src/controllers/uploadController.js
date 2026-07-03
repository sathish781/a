const asyncHandler = require('../utils/asyncHandler');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  res.json({
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = {
  uploadImage
};