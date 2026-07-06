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
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.zip', '.rar'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images, documents, and archives (ZIP, RAR) are allowed.'), false);
  }
};

const multerInstance = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

/**
 * Express 5 + Multer 2 compatibility fix.
 *
 * Multer 2 has breaking changes with Express 5's async error handling.
 * Strategy:
 *   - If the request is NOT multipart/form-data, skip multer entirely.
 *     express.json() has already parsed the body, so controllers work fine.
 *   - If the request IS multipart/form-data, run multer inside a try/catch
 *     using a callback wrapper to normalise the error path.
 */
const wrapMulter = (multerMiddleware) => {
  return (req, res, next) => {
    // Skip multer for non-multipart requests (JSON, urlencoded, etc.)
    // express.json() has already parsed req.body — no work needed here.
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return next();
    }

    // For multipart requests, run multer with a safe callback
    try {
      multerMiddleware(req, res, (err) => {
        if (err) return next(err);
        next();
      });
    } catch (err) {
      next(err);
    }
  };
};

// Wrapped upload helpers — same API surface as multer directly
const upload = {
  single: (fieldName) => wrapMulter(multerInstance.single(fieldName)),
  fields: (fields) => wrapMulter(multerInstance.fields(fields)),
  array:  (fieldName, maxCount) => wrapMulter(multerInstance.array(fieldName, maxCount)),
  none:   () => wrapMulter(multerInstance.none()),
};

// Helper function to upload file to Cloudinary or save locally
const handleUpload = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'freelance_marketplace',
        resource_type: 'auto',
      });
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      return `/uploads/${file.filename}`;
    }
  } else {
    return `/uploads/${file.filename}`;
  }
};

module.exports = { upload, handleUpload };
