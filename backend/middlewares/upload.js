const multer = require('multer');
const path = require('path');
<<<<<<< HEAD:backend/middlewares/upload.js
const fs = require('fs');

// 🔥 Đảm bảo thư mục tồn tại
const uploadPath = path.join(__dirname, '..', 'uploads', 'rooms');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// nơi lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `room-${Date.now()}${ext}`);
  },
});

// ✅ Chỉ cần kiểm tra là file ảnh (mimetype bắt đầu bằng "image/")
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
=======

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to uploads directory
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - only allow images including WebP
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
>>>>>>> 11923ed3277ffd570a2d36fe7015645dcee4c27a:backend/middleware/upload.js
