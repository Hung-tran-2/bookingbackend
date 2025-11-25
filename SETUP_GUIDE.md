# Hướng dẫn Setup Backend - Hotel Booking System

## Bước 1: Chuẩn bị Database

### 1.1. Khởi động WAMP/XAMPP
- Mở WAMP hoặc XAMPP
- Đảm bảo MySQL service đang chạy (màu xanh)

### 1.2. Import Database
1. Mở phpMyAdmin: `http://localhost/phpmyadmin`
2. Tạo database mới tên `hotel_db` (nếu chưa có)
3. Click vào database `hotel_db`
4. Chọn tab "Import"
5. Chọn file `hotel_db.sql` từ thư mục gốc
6. Click "Go" để import

## Bước 2: Cấu hình Backend

### 2.1. Cài đặt Dependencies
```bash
cd backend
npm install
```

### 2.2. Cấu hình Environment Variables
File `.env` đã được tạo sẵn với cấu hình mặc định:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hotel_db
DB_USER=root
DB_PASSWORD=
PORT=5000
NODE_ENV=development
```

**Lưu ý:** Nếu MySQL của bạn có password, hãy cập nhật `DB_PASSWORD`

## Bước 3: Chạy Server

### Development Mode (khuyến nghị)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Nếu thành công, bạn sẽ thấy:
```
✓ Database connection established successfully.

🚀 Server is running on port 5000
📍 API endpoint: http://localhost:5000/api
💚 Health check: http://localhost:5000/health
```

## Bước 4: Test API

### 4.1. Test Health Check
Mở trình duyệt hoặc Postman:
```
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Hotel Booking API is running",
  "timestamp": "2025-11-25T06:30:00.000Z"
}
```

### 4.2. Test API Root
```
GET http://localhost:5000/api
```

Response:
```json
{
  "success": true,
  "message": "Hotel Booking API",
  "version": "1.0.0",
  "endpoints": {
    "customers": "/api/customers",
    "roomTypes": "/api/room-types",
    "rooms": "/api/rooms",
    "bookings": "/api/bookings",
    "services": "/api/services",
    "payments": "/api/payments",
    "invoices": "/api/invoices"
  }
}
```

## Bước 5: Test CRUD Operations

### 5.1. Tạo Customer (POST)
```bash
POST http://localhost:5000/api/customers
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "nguyenvana@example.com",
  "id_card": "123456789"
}
```

### 5.2. Lấy danh sách Customers (GET)
```bash
GET http://localhost:5000/api/customers?page=1&limit=10
```

### 5.3. Tạo Room Type (POST)
```bash
POST http://localhost:5000/api/room-types
Content-Type: application/json

{
  "name": "Phòng Standard",
  "capacity": 2,
  "price": 500000,
  "description": "Phòng tiêu chuẩn 2 người",
  "is_active": true
}
```

### 5.4. Lấy danh sách Room Types (GET)
```bash
GET http://localhost:5000/api/room-types/active
```

## Troubleshooting

### Lỗi: "Unable to connect to the database"
- Kiểm tra WAMP/XAMPP đã chạy chưa
- Kiểm tra thông tin trong file `.env`
- Kiểm tra MySQL port (mặc định 3306)

### Lỗi: "Table doesn't exist"
- Import lại file `hotel_db.sql`
- Kiểm tra database name trong `.env` có đúng là `hotel_db`

### Lỗi: "Port 5000 already in use"
- Đổi PORT trong file `.env` thành số khác (ví dụ: 5001)
- Hoặc tắt ứng dụng đang dùng port 5000

## Cấu trúc API đã hoàn thành

✅ **Customers API** - CRUD đầy đủ
✅ **Room Types API** - CRUD đầy đủ

## Các API sẽ phát triển tiếp

⏳ **Rooms API** - Quản lý phòng
⏳ **Bookings API** - Đặt phòng
⏳ **Services API** - Dịch vụ
⏳ **Payments API** - Thanh toán
⏳ **Invoices API** - Hóa đơn

## Công cụ Test API khuyến nghị

1. **Postman** - https://www.postman.com/downloads/
2. **Thunder Client** - Extension trong VS Code
3. **REST Client** - Extension trong VS Code
4. **Browser** - Cho GET requests đơn giản

## Next Steps

1. ✅ Backend structure đã setup xong
2. ✅ Database models đã tạo
3. ✅ Customer & RoomType APIs đã hoạt động
4. ⏳ Tiếp tục tạo các APIs còn lại (Rooms, Bookings, Services, Payments, Invoices)
5. ⏳ Setup Frontend React
6. ⏳ Tích hợp Frontend với Backend
