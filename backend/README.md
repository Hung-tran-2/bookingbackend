# Hotel Booking System - Backend API

Backend API cho hệ thống đặt phòng khách sạn sử dụng Node.js, Express và Sequelize.

## Cấu trúc thư mục

```
backend/
├── config/          # Cấu hình database
├── models/          # Sequelize models
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Middleware functions
├── utils/           # Utility functions
├── app.js           # Express app setup
├── server.js        # Server entry point
└── package.json     # Dependencies
```

## Cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình database:**
   - Sao chép file `.env.example` thành `.env`
   - Cập nhật thông tin kết nối MySQL:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=hotel_db
     DB_USER=root
     DB_PASSWORD=your_password
     PORT=5000
     NODE_ENV=development
     ```

3. **Import database:**
   - Đảm bảo WAMP/XAMPP đang chạy
   - Import file `hotel_db.sql` vào MySQL
   - Hoặc sử dụng phpMyAdmin để import

## Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Kiểm tra server status

### Customers (Khách hàng)
- `GET /api/customers` - Lấy danh sách khách hàng (có pagination)
- `GET /api/customers/:id` - Lấy thông tin khách hàng theo ID
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/:id` - Cập nhật thông tin khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Room Types (Loại phòng)
- `GET /api/room-types` - Lấy danh sách loại phòng (có pagination)
- `GET /api/room-types/active` - Lấy loại phòng đang active
- `GET /api/room-types/:id` - Lấy thông tin loại phòng theo ID
- `POST /api/room-types` - Tạo loại phòng mới
- `PUT /api/room-types/:id` - Cập nhật loại phòng
- `DELETE /api/room-types/:id` - Xóa loại phòng

### Rooms (Phòng) - Coming soon
### Bookings (Đặt phòng) - Coming soon
### Services (Dịch vụ) - Coming soon
### Payments (Thanh toán) - Coming soon
### Invoices (Hóa đơn) - Coming soon

## Response Format

Tất cả API responses đều có format nhất quán:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Database Models

- **Customer** - Khách hàng
- **RoomType** - Loại phòng
- **Room** - Phòng
- **Booking** - Đơn đặt phòng
- **BookingRoom** - Chi tiết phòng đặt (junction table)
- **Service** - Dịch vụ
- **ServiceUsage** - Sử dụng dịch vụ
- **Payment** - Thanh toán
- **Invoice** - Hóa đơn

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **dotenv** - Environment variables
- **cors** - CORS middleware
