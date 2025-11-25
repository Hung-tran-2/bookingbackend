# Authentication API Documentation

## Auth Endpoints

### 1. Register (Đăng ký)
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // Optional: user (default) | staff | admin
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2025-11-25T07:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login (Đăng nhập)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2025-11-25T07:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Profile (Lấy thông tin cá nhân)
**Requires Authentication**

```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "full_name": "Nguyễn Văn A",
    "phone": "0123456789",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2025-11-25T07:00:00.000Z"
  }
}
```

---

### 4. Update Profile (Cập nhật thông tin)
**Requires Authentication**

```http
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "full_name": "Nguyễn Văn B",
  "phone": "0987654321",
  "email": "newem ail@example.com"
}
```

---

### 5. Change Password (Đổi mật khẩu)
**Requires Authentication**

```http
POST /api/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "current_password": "password123",
  "new_password": "newpassword456"
}
```

---

## Using JWT Token

### In Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Payload
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700604800
}
```

---

## Middleware Usage

### Protect Routes (Require Authentication)
```javascript
const { verifyToken } = require('../middleware/auth');

router.get('/protected', verifyToken, controller.method);
```

### Role-Based Access Control
```javascript
const { verifyToken, checkRole } = require('../middleware/auth');

// Only admin can access
router.delete('/users/:id', verifyToken, checkRole('admin'), controller.deleteUser);

// Admin or staff can access
router.get('/bookings', verifyToken, checkRole('admin', 'staff'), controller.getAllBookings);
```

### Optional Authentication
```javascript
const { optionalAuth } = require('../middleware/auth');

// Works with or without token
router.get('/rooms', optionalAuth, controller.getRooms);
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}
```

### Token Expired
```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## Security Features

✅ **Password Hashing**: Bcrypt with salt rounds = 10
✅ **JWT Tokens**: 7 days expiration (configurable)
✅ **Password Validation**: Minimum 6 characters
✅ **Email Uniqueness**: Prevents duplicate registrations
✅ **Role-Based Access**: user, staff, admin roles
✅ **Password Exclusion**: Never returns password in responses

---

## Complete Workflow Example

### 1. Register new user
```bash
POST /api/auth/register
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
# Save the token from response
```

### 2. Login (if already registered)
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secure123"
}
# Save the token
```

### 3. Use token for protected routes
```bash
GET /api/auth/profile
Headers: Authorization: Bearer YOUR_TOKEN

POST /api/bookings
Headers: Authorization: Bearer YOUR_TOKEN
Body: { booking data }
```

### 4. Change password
```bash
POST /api/auth/change-password
Headers: Authorization: Bearer YOUR_TOKEN
{
  "current_password": "secure123",
  "new_password": "newsecure456"
}
```
