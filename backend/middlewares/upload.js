const multer = require('multer');
const path = require('path');
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


// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
