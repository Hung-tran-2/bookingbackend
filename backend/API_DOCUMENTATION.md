# Hotel Booking API - Complete Documentation

## Base URL
```
http://localhost:5000/api
```

## API Endpoints

### 1. Users (Khách hàng)

#### Get all users
```http
GET /api/users?page=1&limit=10
```

#### Get user by ID
```http
GET /api/users/:id
```

#### Create user
```http
POST /api/users
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "user@example.com",
  "id_card": "123456789",
  "role": "user"  // user | staff | admin
}
```

#### Update user
```http
PUT /api/users/:id
Content-Type: application/json

{
  "full_name": "Nguyễn Văn B",
  "role": "staff"
}
```

#### Delete user
```http
DELETE /api/users/:id
```

---

### 2. Room Types (Loại phòng)

#### Get all room types
```http
GET /api/room-types?page=1&limit=10
```

#### Get active room types
```http
GET /api/room-types/active
```

#### Get room type by ID
```http
GET /api/room-types/:id
```

#### Create room type
```http
POST /api/room-types
Content-Type: application/json

{
  "name": "Phòng Deluxe",
  "capacity": 2,
  "price": 800000,
  "description": "Phòng cao cấp 2 người",
  "is_active": true
}
```

#### Update room type
```http
PUT /api/room-types/:id
```

#### Delete room type
```http
DELETE /api/room-types/:id
```

---

### 3. Rooms (Phòng)

#### Get all rooms
```http
GET /api/rooms?page=1&limit=10
```

#### Get available rooms
```http
GET /api/rooms/available?checkin_date=2025-12-01&checkout_date=2025-12-05
```

#### Get room by ID
```http
GET /api/rooms/:id
```

#### Create room
```http
POST /api/rooms
Content-Type: application/json

{
  "room_number": "101",
  "room_type_id": 1,
  "status": "available",  // available | booked | maintenance
  "image": "url_to_image"
}
```

#### Update room
```http
PUT /api/rooms/:id
```

#### Update room status
```http
PATCH /api/rooms/:id/status
Content-Type: application/json

{
  "status": "maintenance"
}
```

#### Delete room
```http
DELETE /api/rooms/:id
```

---

### 4. Bookings (Đặt phòng)

#### Get all bookings
```http
GET /api/bookings?page=1&limit=10&status=confirmed
```

#### Get booking by ID
```http
GET /api/bookings/:id
```

#### Create booking
```http
POST /api/bookings
Content-Type: application/json

{
  "user_id": 1,
  "checkin_date": "2025-12-01",
  "checkout_date": "2025-12-05",
  "source": "website",
  "rooms": [
    {
      "room_id": 1,
      "price_per_night": 800000
    },
    {
      "room_id": 2,
      "price_per_night": 800000
    }
  ]
}
```

#### Update booking status
```http
PATCH /api/bookings/:id/status
Content-Type: application/json

{
  "status": "confirmed"  // pending | confirmed | cancelled | checked_in | checked_out
}
```

#### Delete booking
```http
DELETE /api/bookings/:id
```

---

### 5. Services (Dịch vụ)

#### Get all services
```http
GET /api/services?page=1&limit=10
```

#### Get service by ID
```http
GET /api/services/:id
```

#### Create service
```http
POST /api/services
Content-Type: application/json

{
  "name": "Giặt ủi",
  "price": 50000,
  "unit": "bộ"
}
```

#### Update service
```http
PUT /api/services/:id
```

#### Delete service
```http
DELETE /api/services/:id
```

---

### 6. Service Usage (Sử dụng dịch vụ)

#### Get services for a booking
```http
GET /api/service-usage/:booking_id/services
```

#### Add service to booking
```http
POST /api/service-usage/:booking_id/services
Content-Type: application/json

{
  "service_id": 1,
  "quantity": 2
}
```

#### Delete service usage
```http
DELETE /api/service-usage/:id
```

---

### 7. Payments (Thanh toán)

#### Get payments for a booking
```http
GET /api/payments/booking/:booking_id
```

#### Get payment by ID
```http
GET /api/payments/:id
```

#### Create payment
```http
POST /api/payments
Content-Type: application/json

{
  "booking_id": 1,
  "amount": 3200000,
  "method": "momo",  // cash | momo | vnpay
  "transaction_code": "MOMO123456"
}
```

#### Delete payment
```http
DELETE /api/payments/:id
```

---

### 8. Invoices (Hóa đơn)

#### Get invoice by booking ID
```http
GET /api/invoices/booking/:booking_id
```

#### Generate invoice for booking
```http
POST /api/invoices/generate/:booking_id
```

#### Delete invoice
```http
DELETE /api/invoices/:id
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

### Pagination Response
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

---

## Complete Workflow Example

### 1. Create a user
```bash
POST /api/users
{
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "user@example.com"
}
# Response: { user_id: 1 }
```

### 2. Create room types
```bash
POST /api/room-types
{
  "name": "Phòng Deluxe",
  "capacity": 2,
  "price": 800000
}
# Response: { room_type_id: 1 }
```

### 3. Create rooms
```bash
POST /api/rooms
{
  "room_number": "101",
  "room_type_id": 1
}
# Response: { room_id: 1 }
```

### 4. Create booking
```bash
POST /api/bookings
{
  "user_id": 1,
  "checkin_date": "2025-12-01",
  "checkout_date": "2025-12-05",
  "rooms": [
    { "room_id": 1, "price_per_night": 800000 }
  ]
}
# Response: { booking_id: 1 }
```

### 5. Add services to booking
```bash
POST /api/service-usage/1/services
{
  "service_id": 1,
  "quantity": 2
}
```

### 6. Create payment
```bash
POST /api/payments
{
  "booking_id": 1,
  "amount": 3200000,
  "method": "cash"
}
# Response: { payment_id: 1 }
```

### 7. Generate invoice
```bash
POST /api/invoices/generate/1
# Automatically calculates room_charge + service_charge
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
