# API Reference cho Frontend - Hotel Booking System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Hầu hết các API đều cần JWT token. Sau khi login/register, lưu token và gửi kèm trong header:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

---

## 1. AUTHENTICATION APIs

### 1.1 Đăng ký tài khoản
```javascript
POST /api/auth/register

// Request Body
{
  "full_name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789",      // Optional
  "role": "user"              // Optional: user | staff | admin
}

// Response Success (201)
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Response Error (400)
{
  "success": false,
  "message": "Email already registered"
}
```

### 1.2 Đăng nhập
```javascript
POST /api/auth/login

// Request Body
{
  "email": "user@example.com",
  "password": "password123"
}

// Response Success (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Response Error (401)
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 1.3 Xem thông tin cá nhân
```javascript
GET /api/auth/profile
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": {
    "user_id": 1,
    "full_name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "role": "user"
  }
}
```

### 1.4 Cập nhật thông tin
```javascript
PUT /api/auth/profile
Headers: Authorization: Bearer TOKEN

// Request Body
{
  "full_name": "Nguyễn Văn B",
  "phone": "0987654321",
  "email": "newemail@example.com"
}

// Response Success (200)
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### 1.5 Đổi mật khẩu
```javascript
POST /api/auth/change-password
Headers: Authorization: Bearer TOKEN

// Request Body
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}

// Response Success (200)
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. ROOM TYPES APIs (Loại phòng)

### 2.1 Lấy danh sách loại phòng
```javascript
GET /api/room-types?page=1&limit=10

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "room_type_id": 1,
      "name": "Phòng Deluxe",
      "capacity": 2,
      "price": "800000.00",
      "description": "Phòng cao cấp 2 người",
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### 2.2 Lấy loại phòng đang hoạt động
```javascript
GET /api/room-types/active

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "room_type_id": 1,
      "name": "Phòng Deluxe",
      "capacity": 2,
      "price": "800000.00"
    }
  ]
}
```

### 2.3 Lấy chi tiết loại phòng
```javascript
GET /api/room-types/:id

// Response Success (200)
{
  "success": true,
  "data": {
    "room_type_id": 1,
    "name": "Phòng Deluxe",
    "capacity": 2,
    "price": "800000.00",
    "description": "Phòng cao cấp"
  }
}
```

---

## 3. ROOMS APIs (Phòng)

### 3.1 Lấy danh sách phòng
```javascript
GET /api/rooms?page=1&limit=10

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "room_id": 1,
      "room_number": "101",
      "status": "available",
      "roomType": {
        "room_type_id": 1,
        "name": "Phòng Deluxe",
        "price": "800000.00"
      }
    }
  ],
  "pagination": { ... }
}
```

### 3.2 Kiểm tra phòng trống
```javascript
GET /api/rooms/available?checkin_date=2025-12-01&checkout_date=2025-12-05

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "room_id": 1,
      "room_number": "101",
      "status": "available",
      "roomType": {
        "name": "Phòng Deluxe",
        "price": "800000.00",
        "capacity": 2
      }
    }
  ]
}
```

### 3.3 Lấy chi tiết phòng
```javascript
GET /api/rooms/:id

// Response Success (200)
{
  "success": true,
  "data": {
    "room_id": 1,
    "room_number": "101",
    "status": "available",
    "image": "url_to_image",
    "roomType": { ... }
  }
}
```

---

## 4. BOOKINGS APIs (Đặt phòng)

### 4.1 Tạo đơn đặt phòng
```javascript
POST /api/bookings
Headers: Authorization: Bearer TOKEN

// Request Body
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

// Response Success (201)
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": 1,
    "user_id": 1,
    "checkin_date": "2025-12-01",
    "checkout_date": "2025-12-05",
    "status": "pending",
    "user": { ... },
    "rooms": [ ... ]
  }
}
```

### 4.2 Lấy danh sách đơn đặt
```javascript
GET /api/bookings?page=1&limit=10&status=confirmed
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "booking_id": 1,
      "checkin_date": "2025-12-01",
      "checkout_date": "2025-12-05",
      "status": "confirmed",
      "user": {
        "full_name": "Nguyễn Văn A",
        "phone": "0123456789"
      },
      "rooms": [
        {
          "room_number": "101",
          "BookingRoom": {
            "price_per_night": "800000.00"
          }
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

### 4.3 Lấy chi tiết đơn đặt
```javascript
GET /api/bookings/:id
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": {
    "booking_id": 1,
    "checkin_date": "2025-12-01",
    "checkout_date": "2025-12-05",
    "status": "confirmed",
    "user": { ... },
    "rooms": [ ... ]
  }
}
```

### 4.4 Cập nhật trạng thái đơn đặt
```javascript
PATCH /api/bookings/:id/status
Headers: Authorization: Bearer TOKEN

// Request Body
{
  "status": "confirmed"  // pending | confirmed | cancelled | checked_in | checked_out
}

// Response Success (200)
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": { ... }
}
```

### 4.5 Hủy đơn đặt
```javascript
DELETE /api/bookings/:id
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

## 5. SERVICES APIs (Dịch vụ)

### 5.1 Lấy danh sách dịch vụ
```javascript
GET /api/services?page=1&limit=10

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "service_id": 1,
      "name": "Giặt ủi",
      "price": "50000.00",
      "unit": "bộ"
    }
  ],
  "pagination": { ... }
}
```

### 5.2 Thêm dịch vụ vào đơn đặt
```javascript
POST /api/service-usage/:booking_id/services
Headers: Authorization: Bearer TOKEN

// Request Body
{
  "service_id": 1,
  "quantity": 2
}

// Response Success (201)
{
  "success": true,
  "message": "Service added to booking successfully",
  "data": {
    "usage_id": 1,
    "booking_id": 1,
    "service_id": 1,
    "quantity": 2,
    "total_price": "100000.00",
    "service": {
      "name": "Giặt ủi",
      "price": "50000.00"
    }
  }
}
```

### 5.3 Lấy dịch vụ của đơn đặt
```javascript
GET /api/service-usage/:booking_id/services
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "usage_id": 1,
      "quantity": 2,
      "total_price": "100000.00",
      "service": {
        "name": "Giặt ủi",
        "price": "50000.00"
      }
    }
  ]
}
```

---

## 6. PAYMENTS APIs (Thanh toán)

### 6.1 Tạo thanh toán
```javascript
POST /api/payments
Headers: Authorization: Bearer TOKEN

// Request Body
{
  "booking_id": 1,
  "amount": 3200000,
  "method": "momo",           // cash | momo | vnpay
  "transaction_code": "MOMO123456"  // Optional
}

// Response Success (201)
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 1,
    "booking_id": 1,
    "amount": "3200000.00",
    "method": "momo",
    "status": true
  }
}
```

### 6.2 Lấy thanh toán của đơn đặt
```javascript
GET /api/payments/booking/:booking_id
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "amount": "3200000.00",
      "method": "momo",
      "payment_time": "2025-11-25T07:00:00.000Z",
      "transaction_code": "MOMO123456"
    }
  ]
}
```

---

## 7. INVOICES APIs (Hóa đơn)

### 7.1 Tạo hóa đơn tự động
```javascript
POST /api/invoices/generate/:booking_id
Headers: Authorization: Bearer TOKEN

// Response Success (201)
{
  "success": true,
  "message": "Invoice generated successfully",
  "data": {
    "invoice_id": 1,
    "booking_id": 1,
    "room_charge": "3200000.00",
    "service_charge": "100000.00",
    "total_amount": "3300000.00",
    "booking": { ... },
    "payment": { ... }
  }
}
```

### 7.2 Lấy hóa đơn theo booking
```javascript
GET /api/invoices/booking/:booking_id
Headers: Authorization: Bearer TOKEN

// Response Success (200)
{
  "success": true,
  "data": {
    "invoice_id": 1,
    "room_charge": "3200000.00",
    "service_charge": "100000.00",
    "total_amount": "3300000.00",
    "created_at": "2025-11-25T07:00:00.000Z"
  }
}
```

---

## Error Responses

### 400 Bad Request
```javascript
{
  "success": false,
  "message": "Validation error",
  "error": ["Email is required", "Password must be at least 6 characters"]
}
```

### 401 Unauthorized
```javascript
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### 403 Forbidden
```javascript
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```javascript
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```javascript
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Frontend Integration Examples

### React/Vue/Angular Example

```javascript
// 1. Login và lưu token
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Lưu token vào localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// 2. Gọi API với token
async function getProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// 3. Tạo booking
async function createBooking(bookingData) {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  
  const data = await response.json();
  return data;
}

// 4. Lấy danh sách phòng trống
async function getAvailableRooms(checkin, checkout) {
  const response = await fetch(
    `http://localhost:5000/api/rooms/available?checkin_date=${checkin}&checkout_date=${checkout}`
  );
  
  const data = await response.json();
  return data.data; // Array of available rooms
}

// 5. Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
}
```

### Axios Example

```javascript
import axios from 'axios';

// Setup axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Usage
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const bookingAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status })
};

export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getAvailable: (checkin, checkout) => 
    api.get('/rooms/available', { params: { checkin_date: checkin, checkout_date: checkout } })
};
```

---

## Quick Start Checklist

1. ✅ **Login/Register** để lấy JWT token
2. ✅ **Lưu token** vào localStorage hoặc state management
3. ✅ **Gửi token** trong header `Authorization: Bearer TOKEN`
4. ✅ **Handle errors** đặc biệt 401 (token expired)
5. ✅ **Logout** khi cần (xóa token)

---

## Testing với Postman/Thunder Client

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }
```

### 2. Copy token từ response

### 3. Sử dụng token cho các API khác
```
GET http://localhost:5000/api/bookings
Headers: Authorization: Bearer YOUR_TOKEN_HERE
```

---

**Server đang chạy tại**: http://localhost:5000
**API Base URL**: http://localhost:5000/api
