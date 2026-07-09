# Kiến trúc hệ thống (Architecture)

## Tổng quan
AWS Student Management Portal là ứng dụng **serverless** quản lý thông tin sinh viên,
triển khai hoàn toàn trên AWS. Không có server cần quản lý (no EC2).

## Sơ đồ luồng dữ liệu

```
Người dùng (Browser)
      │
      ▼
┌─────────────────────┐
│  Frontend (S3 +     │  ReactJS + Vite, tĩnh
│  CloudFront)        │
└─────────┬───────────┘
          │ HTTPS (Cognito JWT)
          ▼
┌─────────────────────┐
│  Amazon Cognito     │  Xác thực / Đăng nhập
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  API Gateway        │  REST API (proxy)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  AWS Lambda         │  Backend logic (Node.js)
└───┬───────────┬─────┘
    │           │
    ▼           ▼
┌────────────┐ ┌────────────┐
│ DynamoDB   │ │ S3         │  Lưu metadata│ lưu file
└────────────┘ └─────┬──────┘
                     │ Presigned URL
                     │
                     ▼
              ┌────────────┐
              │ SQS        │  Queue thông báo
              └─────┬──────┘
                    │ trigger
                    ▼
              ┌────────────┐
              │ Lambda     │  Worker gửi email
              └─────┬──────┘
                    ▼
              ┌────────────┐
              │ SES        │  Gửi email
              └────────────┘
```

## Thành phần

| Thành phần | AWS Service | Vai trò |
|-----------|-------------|---------|
| Web tĩnh | S3 + CloudFront | Hosting & CDN cho React app |
| Xác thực | Cognito User Pool | Đăng nhập, phát hành JWT |
| API | API Gateway (REST) | Điều hướng request đến Lambda |
| Backend | Lambda (Node.js) | CRUD sinh viên, upload URL |
| CSDL | DynamoDB | Lưu trữ sinh viên & metadata tài liệu |
| File | S3 | Lưu tài liệu qua Presigned URL |
| Queue | SQS | Đệm thông báo email |
| Email | SES | Gửi email xác nhận |
| Log | CloudWatch | Log & giám sát |

## Luồng Upload tài liệu
1. Frontend gọi API `POST /documents/upload-url` → Lambda tạo **Presigned URL** (S3).
2. Frontend PUT file trực tiếp lên S3 bằng URL đó.
3. Frontend gọi `POST /documents/metadata` → Lambda lưu metadata vào DynamoDB
   và đẩy message vào **SQS**.
4. Lambda worker (trigger bởi SQS) gửi email qua **SES**.

## Ưu điểm kiến trúc serverless
- Tự động scale theo tải.
- Chỉ trả tiền theo lượt gọi (pay-per-use).
- Không quản lý server/patch OS.
- Tích hợp sẵn bảo mật IAM theo nguyên tắc least-privilege.
