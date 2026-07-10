# Hướng Dẫn Khởi Chạy Dự Án AWS Student Management Portal

## Mục Lục
1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Môi Trường Cần Cài Đặt](#2-môi-trường-cần-cài-đặt)
3. [Cài Đặt Môi Trường](#3-cài-đặt-môi-trường)
4. [Thứ Tự Setup Các Dịch Vụ AWS](#4-thứ-tự-setup-các-dịch-vụ-aws)
5. [Cấu Hình Chi Tiết Từng Bước](#5-cấu-hình-chi-tiết-từng-bước)
6. [Chạy Frontend](#6-chạy-frontend)
7. [Kiểm Tra & Xác Minh](#7-kiểm-tra--xác-minh)

---

## 1. Tổng Quan Kiến Trúc

Dự án sử dụng kiến trúc **Serverless** trên AWS:

```
Người dùng (Browser)
      │
      ▼
┌─────────────────────┐
│  Frontend (ReactJS)  │  React + Vite
└─────────┬───────────┘
          │ HTTPS (Cognito JWT)
          ▼
┌─────────────────────┐
│  Amazon Cognito     │  Xác thực / Đăng nhập
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  API Gateway (REST) │  Điều hướng request
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  AWS Lambda         │  Backend logic (Node.js)
└───┬───────────┬─────┘
    │           │
    ▼           ▼
┌────────────┐ ┌────────────┐
│ DynamoDB   │ │ S3         │
└────────────┘ └─────┬──────┘
                     │
                     ▼
              ┌────────────┐
              │ SQS        │  Queue thông báo
              └─────┬──────┘
                    │
                    ▼
              ┌────────────┐
              │ SES        │  Gửi email
              └────────────┘
```

---

## 2. Môi Trường Cần Cài Đặt

### 2.1 Node.js (Runtime)

| Thành phần | Phiên bản yêu cầu | Mục đích |
|-----------|-------------------|----------|
| **Node.js** | >= 18.x | Chạy backend Lambda, build frontend |
| **npm** | >= 9.x | Quản lý package |

**Kiểm tra:**
```bash
node --version
npm --version
```

### 2.2 Python (Cần cho script deploy)

| Thành phần | Phiên bản yêu cầu | Mục đích |
|-----------|-------------------|----------|
| **Python** | 3.8+ | Đóng gói Lambda (fallback 7z) |
| **pip** | latest | Quản lý Python packages |

### 2.3 AWS CLI

| Thành phần | Phiên bản yêu cầu | Mục đích |
|-----------|-------------------|----------|
| **AWS CLI v2** | >= 2.0 | Quản lý tài nguyên AWS |

**Kiểm tra:**
```bash
aws --version
```

### 2.4 Git

| Thành phần | Phiên bản yêu cầu | Mục đích |
|-----------|-------------------|----------|
| **Git** | >= 2.30 | Version control |

### 2.5 Các Công Cụ Bổ Sung (Tùy chọn)

| Thành phần | Mục đích |
|-----------|----------|
| **7-Zip** | Nén Lambda package (Windows) |
| **Postman** | Test API |
| **Git Bash** | Chạy shell script |

---

## 3. Cài Đặt Môi Trường

### 3.1 Cài Đặt Node.js

**Windows:**
1. Download từ https://nodejs.org/
2. Chọn phiên bản LTS (18.x hoặc 20.x)
3. Cài đặt, tick chọn "Add to PATH"
4. Kiểm tra:
```bash
node --version
npm --version
```

### 3.2 Cài Đặt Python

**Windows:**
1. Download từ https://www.python.org/downloads/
2. Chọn Python 3.8+
3. **Quan trọng:** Tick "Add Python to PATH"
4. Kiểm tra:
```bash
python --version
pip --version
```

### 3.3 Cài Đặt AWS CLI v2

**Windows (MSI Installer):**
1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Cài đặt
3. Kiểm tra:
```bash
aws --version
```

**Hoặc qua pip:**
```bash
pip install awscli
```

### 3.4 Cấu Hình AWS Credentials

1. Đăng nhập AWS Console: https://console.aws.amazon.com/
2. Vào **IAM** → **Users** → Chọn user của bạn
3. Vào tab **Security credentials**
4. Tạo **Access Key** mới
5. Cấu hình AWS CLI:
```bash
aws configure
# AWS Access Key ID: [Nhập Access Key]
# AWS Secret Access Key: [Nhập Secret Key]
# Default region name: us-east-1
# Default output format: json
```

**Xác minh credentials:**
```bash
aws sts get-caller-identity
```

### 3.5 Cài Đặt Git Bash (Windows)

Download từ https://git-scm.com/download/win

Đảm bảo chọn **"Use Git and optional Unix tools from Windows Command Prompt"**

---

## 4. Thứ Tự Setup Các Dịch Vụ AWS

**Thứ tự bắt buộc:**

```
1. Cài đặt môi trường phát triển
         ↓
2. Cài đặt npm packages (backend + frontend)
         ↓
3. Setup Infrastructure (setup-infra.sh)
   ├── Tạo IAM Role cho Lambda
   ├── Tạo S3 Bucket
   ├── Tạo SQS Queue
   └── Tạo DynamoDB Tables
         ↓
4. Setup Cognito (setup-cognito.sh)
   ├── Tạo User Pool
   └── Tạo App Client
         ↓
5. Deploy Lambdas (deploy-lambdas.sh)
   ├── Đóng gói code
   └── Deploy lên AWS
         ↓
6. Deploy API Gateway (deploy-apigateway.sh)
   ├── Tạo REST API
   ├── Cấu hình Cognito Authorizer
   └── Liên kết Lambda functions
         ↓
7. Cấu hình Frontend
         ↓
8. Chạy & Kiểm tra
```

---

## 5. Cấu Hình Chi Tiết Từng Bước

### Bước 1: Cài Đặt npm Packages

```bash
# Di chuyển vào thư mục dự án
cd "E:\INTERN AWS\Doan\AWS-Student-Management-Portal"

# Cài đặt backend dependencies
cd backend
npm install

# Cài đặt frontend dependencies (mở terminal mới)
cd frontend
npm install
```

### Bước 2: Setup Infrastructure

Script này sẽ tạo:
- IAM Role `student-portal-lambda`
- S3 Bucket `student-documents-[ACCOUNT_ID]`
- SQS Queue `student-notifications`
- DynamoDB Tables (Students, Documents, Teachers, Grades, Materials)

```bash
cd "E:\INTERN AWS\Doan\AWS-Student-Management-Portal"

# Chạy script setup infrastructure
bash scripts/setup-infra.sh us-east-1
```

**Lưu lại các giá trị output:**
```
LAMBDA_ROLE_ARN=arn:aws:iam::123456789:role/student-portal-lambda
DOCUMENTS_BUCKET=student-documents-123456789
NOTIFICATION_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/student-notifications
FROM_EMAIL=noreply@example.com
```

### Bước 3: Setup Cognito

```bash
cd "E:\INTERN AWS\Doan\AWS-Student-Management-Portal"

# Tạo User Pool và App Client
bash scripts/setup-cognito.sh us-east-1
```

**Lưu lại các giá trị output:**
```
UserPoolId = us-east-1_xxxxxxxxx
AppClientId = xxxxxxxxxxxxxxxxxx
```

**Tạo user demo:**
```bash
# Sau khi chạy script, user admin sẽ được tạo
# Username: admin@example.com
# Password tạm: Abc12345!
# (Đăng nhập lần đầu sẽ bắt đổi mật khẩu)
```

### Bước 4: Deploy Lambda Functions

```bash
cd "E:\INTERN AWS\Doan\AWS-Student-Management-Portal"

# Deploy tất cả Lambda functions
LAMBDA_ROLE_ARN=arn:aws:iam::123456789:role/student-portal-lambda \
DOCUMENTS_BUCKET=student-documents-123456789 \
NOTIFICATION_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/student-notifications \
FROM_EMAIL=noreply@example.com \
bash scripts/deploy-lambdas.sh us-east-1
```

**Các Lambda functions được deploy:**
| Module | Function | Mục đích |
|--------|----------|----------|
| students | createStudent | Tạo sinh viên |
| students | getStudents | Lấy danh sách sinh viên |
| students | getStudentById | Lấy sinh viên theo ID |
| students | updateStudent | Cập nhật sinh viên |
| students | deleteStudent | Xóa sinh viên |
| documents | docUploadUrl | Tạo presigned URL upload |
| documents | docSaveMetadata | Lưu metadata tài liệu |
| teachers | createTeacher | Tạo giáo viên |
| teachers | getTeachers | Lấy danh sách giáo viên |
| teachers | getTeacherById | Lấy giáo viên theo ID |
| teachers | updateTeacher | Cập nhật giáo viên |
| teachers | deleteTeacher | Xóa giáo viên |
| grades | createGrade | Tạo điểm |
| grades | getGrades | Lấy danh sách điểm |
| grades | getGradeById | Lấy điểm theo ID |
| grades | updateGrade | Cập nhật điểm |
| grades | deleteGrade | Xóa điểm |
| materials | materialUploadUrl | Tạo presigned URL tài liệu học |
| materials | materialSaveMetadata | Lưu metadata tài liệu học |
| materials | getMaterials | Lấy danh sách tài liệu học |
| notifications | sendEmailWorker | Worker gửi email |

### Bước 5: Deploy API Gateway

```bash
cd "E:\INTERN AWS\Doan\AWS-Student-Management-Portal"

# Deploy API Gateway với User Pool ID
USER_POOL_ID=us-east-1_xxxxxxxxx \
bash scripts/deploy-apigateway.sh us-east-1
```

**Lưu lại các giá trị output:**
```
API ID = xxxxxxxxxxx
Invoke URL = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

### Bước 6: Cấu Hình Frontend

Tạo file `frontend/.env`:
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Tạo file .env (copy từ .env.example nếu có)
```

Nội dung `frontend/.env`:
```env
# AWS Cognito Configuration
VITE_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxx

# API Endpoint
VITE_API_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod

# AWS Region
VITE_AWS_REGION=us-east-1
```

---

## 6. Chạy Frontend

### Chế độ Development:
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại http://localhost:5173

### Build Production:
```bash
cd frontend
npm run build
```

---

## 7. Kiểm Tra & Xác Minh

### 7.1 Kiểm Tra AWS Resources

```bash
# Kiểm tra Lambda functions
aws lambda list-functions --region us-east-1

# Kiểm tra DynamoDB tables
aws dynamodb list-tables --region us-east-1

# Kiểm tra S3 bucket
aws s3 ls

# Kiểm tra SQS queue
aws sqs list-queues --region us-east-1

# Kiểm tra API Gateway
aws apigateway get-rest-apis --region us-east-1

# Kiểm tra Cognito User Pool
aws cognito-idp list-user-pools --region us-east-1
```

### 7.2 Import Postman Collection

1. Mở Postman
2. Import file: `postman/student-management-api.postman_collection.json`
3. Cập nhật biến môi trường:
   - `baseUrl`: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
   - `idToken`: [Lấy từ Cognito sau khi đăng nhập]

### 7.3 Xử Lý Lỗi Thường Gặp

#### Lỗi "Credentials not found"
```bash
# Kiểm tra AWS credentials
aws configure
aws sts get-caller-identity
```

#### Lỗi "Function not found" khi deploy Lambda
```bash
# Kiểm tra IAM role đã được tạo chưa
aws iam get-role --role-name student-portal-lambda

# Kiểm tra Lambda functions
aws lambda list-functions --region us-east-1
```

#### Lỗi "Access Denied" khi gọi API
1. Kiểm tra Cognito User Pool đã được liên kết với API Gateway
2. Kiểm tra Lambda function có quyền invoke từ API Gateway
3. Kiểm tra user đã được xác thực chưa

#### Lỗi "Region mismatch"
Đảm bảo tất cả services cùng region:
- Lambda: us-east-1
- API Gateway: us-east-1
- Cognito: us-east-1
- DynamoDB: us-east-1
- S3: us-east-1
- SQS: us-east-1

---

## Quick Reference

### Các Biến Môi Trường Quan Trọng

| Biến | Mô tả |
|------|-------|
| `LAMBDA_ROLE_ARN` | ARN của IAM role cho Lambda |
| `DOCUMENTS_BUCKET` | Tên S3 bucket lưu tài liệu |
| `NOTIFICATION_QUEUE_URL` | URL của SQS queue thông báo |
| `FROM_EMAIL` | Email gửi thông báo |
| `USER_POOL_ID` | ID của Cognito User Pool |
| `APP_CLIENT_ID` | ID của Cognito App Client |
| `API_ID` | ID của API Gateway |
| `VITE_API_ENDPOINT` | URL của API Gateway |

### Các Scripts

| Script | Mục đích |
|--------|----------|
| `scripts/setup-infra.sh` | Tạo hạ tầng (IAM, S3, SQS, DynamoDB) |
| `scripts/setup-cognito.sh` | Tạo Cognito User Pool |
| `scripts/deploy-lambdas.sh` | Deploy tất cả Lambda functions |
| `scripts/deploy-apigateway.sh` | Deploy API Gateway |
| `scripts/deploy-dynamodb.sh` | Tạo DynamoDB tables |

---

## Liên Hệ Hỗ Trợ

Nếu gặp lỗi, kiểm tra:
1. AWS Console CloudWatch Logs cho Lambda errors
2. AWS Console API Gateway → Stages → Logs
3. Kiểm tra Network tab trong browser DevTools