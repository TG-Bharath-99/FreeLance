const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images (PNG, JPG, JPEG) and documents (PDF, DOC, DOCX) are allowed.'), false);
  }
};

const multerInstance = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

/**
 * Express 5 + Multer 2 compatibility wrapper.
 * Wraps a multer middleware in a Promise so Express 5's async error handling works correctly.
 */
const wrapMulter = (multerMiddleware) => {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => new Promise((resolve, reject) => {
        multerMiddleware(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }))
      .then(() => next())
      .catch((err) => next(err));
  };
};

// Wrapped upload helpers for Express 5 compatibility
const upload = {
  single: (fieldName) => wrapMulter(multerInstance.single(fieldName)),
  fields: (fields) => wrapMulter(multerInstance.fields(fields)),
  array: (fieldName, maxCount) => wrapMulter(multerInstance.array(fieldName, maxCount)),
  none: () => wrapMulter(multerInstance.none()),
};

// Helper function to upload file (Cloudinary or Local fallback)
const handleUpload = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'freelance_marketplace',
        resource_type: 'auto',
      });
      // Delete temporary local file after uploading to Cloudinary
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      // Fallback to local URL if Cloudinary upload fails
      return `/uploads/${file.filename}`;
    }
  } else {
    // Return relative URL for locally stored file
    return `/uploads/${file.filename}`;
  }
};

module.exports = {
  upload,
  handleUpload,
};
