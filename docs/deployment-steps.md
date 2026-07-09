# Các bước triển khai (Deployment Steps)

> Môi trường: AWS Region `ap-southeast-1` (Singapore). Thay thế các giá trị ví dụ bằng tài nguyên thực tế.

## 1. Chuẩn bị
- Tài khoản AWS, cài `AWS CLI` và `aws configure`.
- Cài Node.js (v18+).
- Cài `AWS SAM CLI` hoặc `Serverless Framework` (tùy chọn).

## 2. Backend — DynamoDB
```bash
aws dynamodb create-table \
  --table-name Students \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1

aws dynamodb create-table \
  --table-name Documents \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1
```

## 3. Backend — S3 (tài liệu)
```bash
aws s3 mb s3://student-documents-<yourname> --region ap-southeast-1
aws s3api put-bucket-cors --bucket student-documents-<yourname> --cors-configuration file://cors.json
```

## 4. Backend — Cognito User Pool
- Tạo User Pool, App client (không secret), enable đăng nhập bằng email.
- Ghi lại `UserPoolId` và `AppClientId`.

## 5. Backend — SQS + SES
```bash
aws sqs create-queue --queue-name student-notifications
```
- Xác thực domain/email gửi trong SES (sandbox hoặc production).

## 6. Backend — Lambda + API Gateway
Với mỗi thư mục trong `backend/students`, `backend/documents`, `backend/notifications`:
```bash
cd backend/students/createStudent
npm install
zip -r createStudent.zip .
aws lambda create-function \
  --function-name createStudent \
  --runtime nodejs18.x --handler index.handler \
  --role <LAMBDA_EXECUTION_ROLE_ARN> \
  --zip-file fileb://createStudent.zip \
  --environment Variables={STUDENTS_TABLE=Students,DOCUMENTS_BUCKET=student-documents-<yourname>,NOTIFICATION_QUEUE_URL=<SQS_URL>,FROM_EMAIL=noreply@example.com}
```
- Tạo REST API trên API Gateway, thêm resources `/students`, `/students/{id}`,
  `/documents/upload-url`, `/documents/metadata` và nối với các Lambda tương ứng.
- Bật **Cognito Authorizer** cho các route cần xác thực.
- Deploy stage `prod`.

## 7. Frontend — Build & Deploy
```bash
cd frontend
npm install
npm run build
aws s3 sync dist/ s3://<frontend-bucket> --delete
```
- Tạo CloudFront distribution trỏ vào S3 bucket (hoặc S3 website endpoint).
- Cấu hình `awsConfig.js` (hoặc biến env `VITE_*`) với UserPoolId, AppClientId, API endpoint.

## 8. Kiểm thử
- Dùng file `postman/student-management-api.postman_collection.json` import vào Postman.
- Đăng nhập lấy idToken, set biến `idToken`, gọi các API.

## 9. Giám sát
- Xem log Lambda trong CloudWatch Logs (`/aws/lambda/<functionName>`).
- Theo dõi SQS, SES trong CloudWatch metrics.
