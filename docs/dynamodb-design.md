# Thiết kế DynamoDB (DynamoDB Design)

## Bảng Students
Lưu thông tin sinh viên.

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id (PK) | String | Partition key = studentId |
| studentId | String | Mã sinh viên (duy nhất) |
| fullName | String | Họ tên |
| email | String | Email |
| phone | String | SĐT |
| major | String | Ngành |
| gpa | Number | Điểm trung bình (0–4) |
| createdAt | String | ISO timestamp |

**Key schema:** Partition key `id` (HASH).
**Billing:** `PAY_PER_REQUEST` (on-demand) — phù hợp tải không đều, sinh viên.
**Access pattern:** lấy theo id (GetItem) và liệt kê toàn bộ (Scan, đủ cho quy mô nhỏ).
Nếu sau này cần query theo `major`, thêm GSI `major-index`.

## Bảng Documents
Lưu metadata tài liệu upload.

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id (PK) | String | Partition key = `${studentId}-${timestamp}` |
| studentId | String | Liên kết sinh viên |
| fileName | String | Tên file gốc |
| s3Key | String | Key trong S3 |
| fileUrl | String | URL truy cập file |
| createdAt | String | ISO timestamp |

**Key schema:** Partition key `id` (HASH).
**Index gợi ý:** GSI `studentId-index` để query "tất cả tài liệu của một SV".

## Bảng Teachers
Lưu thông tin giáo viên.

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id (PK) | String | Partition key = teacherId |
| teacherId | String | Mã giáo viên (duy nhất) |
| fullName | String | Họ tên |
| email | String | Email |
| phone | String | SĐT |
| department | String | Bộ môn |
| degree | String | Học vị (Cử nhân/Thạc sĩ/Tiến sĩ) |
| createdAt | String | ISO timestamp |

## Bảng Grades
Lưu điểm của sinh viên theo môn/học kỳ.

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id (PK) | String | Partition key = `${studentId}-${subject}-${timestamp}` |
| studentId | String | Mã sinh viên |
| teacherId | String | Mã giáo viên đăng điểm |
| subject | String | Môn học |
| semester | String | Học kỳ (HK1/HK2/Năm 1...) |
| score | Number | Điểm (0–10) |
| note | String | Ghi chú |
| createdAt | String | ISO timestamp |

**Index gợi ý:** GSI `studentId-index`, `teacherId-index` để query điểm theo SV/giáo viên.

## Bảng Materials
Lưu metadata tài liệu học tập.

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id (PK) | String | Partition key = `${type}-${timestamp}` |
| title | String | Tiêu đề tài liệu |
| subject | String | Môn học |
| type | String | Loại (slide/exercise/exam/reference/other) |
| fileName | String | Tên file gốc |
| s3Key | String | Key trong S3 |
| fileUrl | String | URL truy cập file |
| createdAt | String | ISO timestamp |

**Index gợi ý:** GSI `type-index`, `subject-index` để lọc tài liệu.

## IAM cho Lambda
Lambda execution role cần policy:
- `dynamodb:GetItem, PutItem, UpdateItem, DeleteItem, Scan` trên 2 bảng.
- `s3:PutObject` trên bucket tài liệu (để tạo presigned url).
- `sqs:SendMessage` trên queue thông báo.
- `ses:SendEmail` trên identity đã verify.

## Lưu ý
- Dùng `DynamoDBDocumentClient` để làm việc với object JS thuần (không phải AttributeValue).
- On-demand giúp tránh ước lượng capacity; chi phí theo request thực tế.
