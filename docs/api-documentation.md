# Tài liệu API (API Documentation)

Base URL: `https://<api-id>.execute-api.ap-southeast-1.amazonaws.com/prod`

Tất cả request (trừ login) cần header:
`Authorization: <Cognito idToken>`

## Auth
Mọi xác thực thực hiện qua Cognito (frontend login). API Gateway dùng Cognito
Authorizer để validate token.

## Students

### GET /students
Lấy danh sách sinh viên.
- Response `200`:
```json
{ "students": [ { "id": "S001", "studentId": "S001", "fullName": "Nguyen Van A", "email": "a@x.edu.vn", "gpa": 3.5 } ], "count": 1 }
```

### GET /students/{id}
Lấy chi tiết một sinh viên.
- `200`: object sinh viên.
- `404`: `{ "message": "Không tìm thấy sinh viên" }`

### POST /students
Tạo sinh viên mới.
- Body:
```json
{ "studentId": "S001", "fullName": "Nguyen Van A", "email": "a@x.edu.vn", "phone": "0123", "major": "CNTT", "gpa": 3.5 }
```
- `201`: `{ "message": "Tạo sinh viên thành công", "student": {...} }`
- `400`: lỗi validate.

### PUT /students/{id}
Cập nhật sinh viên. Body chứa các trường cần đổi (`fullName`, `email`, `phone`, `major`, `gpa`).

### DELETE /students/{id}
Xóa sinh viên. `200`: `{ "message": "Xóa thành công" }`

## Documents

### POST /documents/upload-url
Tạo Presigned URL upload lên S3.
- Body: `{ "fileName": "thesis.pdf", "contentType": "application/pdf", "studentId": "S001" }`
- `200`:
```json
{ "uploadUrl": "https://s3...?sig=...", "s3Key": "documents/S001/123-thesis.pdf", "fileUrl": "https://bucket.s3.../documents/S001/123-thesis.pdf" }
```

### POST /documents/metadata
Lưu metadata tài liệu và kích hoạt gửi email (SQS → SES).
- Body: `{ "studentId": "S001", "fileName": "thesis.pdf", "s3Key": "documents/S001/123-thesis.pdf", "fileUrl": "..." }`
- `201`: `{ "message": "Lưu metadata thành công", "document": {...} }`

## Mã lỗi chuẩn
| Code | Ý nghĩa |
|------|---------|
| 400 | Dữ liệu không hợp lệ |
| 401 | Thiếu/hết hạn token |
| 404 | Không tìm thấy |
| 500 | Lỗi máy chủ |
