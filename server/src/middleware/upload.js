import multer from 'multer';
import { SUPPORTED_IMAGE_MIMES } from '../validators/aiValidators.js';

// In-memory storage: uploaded files are never permanently saved to disk
const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes limit
  },
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_IMAGE_MIMES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      const err = new Error(
        `Unsupported image type: ${file.mimetype}. Allowed formats: ${SUPPORTED_IMAGE_MIMES.join(', ')}`
      );
      err.status = 400;
      cb(err, false);
    }
  },
});

export default uploadImage;
