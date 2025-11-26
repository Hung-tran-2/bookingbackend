# Test Image Upload cho Room API

## Cách test với Postman hoặc Thunder Client

### 1. Tạo Room MỚI với ảnh

**Endpoint:** `POST http://localhost:5000/api/rooms`

**Request Type:** `multipart/form-data`

**Body (form-data):**
- `room_number`: 101
- `room_type_id`: 1
- `status`: available
- `image`: [Chọn file ảnh từ máy tính]

**Expected Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room_id": 1,
    "room_number": "101",
    "room_type_id": 1,
    "status": "available",
    "image": "/uploads/1732537200000-123456789.jpg",
    "created_at": "2025-11-25T13:40:00.000Z"
  }
}
```

### 2. Tạo Room KHÔNG có ảnh

**Endpoint:** `POST http://localhost:5000/api/rooms`

**Body (form-data):**
- `room_number`: 102
- `room_type_id`: 1

**Expected Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room_id": 2,
    "room_number": "102",
    "room_type_id": 1,
    "status": "available",
    "image": null,
    "created_at": "2025-11-25T13:41:00.000Z"
  }
}
```

### 3. Cập nhật Room với ảnh MỚI

**Endpoint:** `PUT http://localhost:5000/api/rooms/1`

**Request Type:** `multipart/form-data`

**Body (form-data):**
- `image`: [Chọn file ảnh mới]

**Expected Response:**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    "room_id": 1,
    "room_number": "101",
    "room_type_id": 1,
    "status": "available",
    "image": "/uploads/1732537300000-987654321.jpg",
    "created_at": "2025-11-25T13:40:00.000Z"
  }
}
```

### 4. Xem ảnh đã upload

Sau khi upload thành công, bạn có thể xem ảnh qua browser:

**URL:** `http://localhost:5000/uploads/[filename].jpg`

Ví dụ: `http://localhost:5000/uploads/1732537200000-123456789.jpg`

---

## Kiểm tra File Validation

### Test 1: Upload file KHÔNG phải ảnh (PDF, TXT, etc.)

**Expected:** Lỗi 400 với message "Only image files (JPEG, JPG, PNG, GIF) are allowed!"

### Test 2: Upload ảnh quá lớn (> 5MB)

**Expected:** Lỗi 400 với message về file size limit

---

## Kiểm tra trong Database

Sau khi tạo/cập nhật room, kiểm tra trong database:

```sql
SELECT * FROM rooms WHERE room_id = 1;
```

Cột `image` sẽ chứa đường dẫn: `/uploads/[filename].jpg`

---

## Kiểm tra trong thư mục uploads

Vào thư mục: `backend/uploads/`

Bạn sẽ thấy các file ảnh đã upload với tên dạng: `1732537200000-123456789.jpg`

---

## Lưu ý khi sử dụng từ Frontend

Khi gọi API từ frontend (React, Vue, etc.), sử dụng FormData:

```javascript
const formData = new FormData();
formData.append('room_number', '101');
formData.append('room_type_id', 1);
formData.append('status', 'available');
formData.append('image', fileInput.files[0]); // File object từ input type="file"

fetch('http://localhost:5000/api/rooms', {
  method: 'POST',
  body: formData
  // KHÔNG set Content-Type header, browser sẽ tự set
});
```

---

## Swagger UI Testing

Bạn cũng có thể test trực tiếp từ Swagger UI:

1. Mở `http://localhost:5000/api-docs`
2. Tìm endpoint `POST /api/rooms`
3. Click "Try it out"
4. Điền thông tin và chọn file ảnh
5. Click "Execute"
