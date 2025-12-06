// HOW IT WORKS:
// This controller handles file uploads using Cloudinary with a local fallback
// It supports image uploads for user avatars and project files

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
}

// Set up storage - Cloudinary or local fallback
let storage;
if (process.env.CLOUDINARY_URL) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'collabverse',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'doc', 'docx']
    }
  });
} else {
  // Local storage fallback
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
}

const upload = multer({ storage: storage });

// Handle file upload
const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return file information
    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: req.file.path || req.file.secure_url
    };
    
    // If using Cloudinary, we get the secure_url
    if (req.file.secure_url) {
      fileData.url = req.file.secure_url;
    } else {
      // For local storage, construct the URL
      fileData.url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    res.json(fileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload: upload.single('file'),
  uploadFile
};