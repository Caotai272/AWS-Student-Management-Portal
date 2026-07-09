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

## IAM cho Lambda
Lambda execution role cần policy:
- `dynamodb:GetItem, PutItem, UpdateItem, DeleteItem, Scan` trên 2 bảng.
- `s3:PutObject` trên bucket tài liệu (để tạo presigned url).
- `sqs:SendMessage` trên queue thông báo.
- `ses:SendEmail` trên identity đã verify.

## Lưu ý
- Dùng `DynamoDBDocumentClient` để làm việc với object JS thuần (không phải AttributeValue).
- On-demand giúp tránh ước lượng capacity; chi phí theo request thực tế.
