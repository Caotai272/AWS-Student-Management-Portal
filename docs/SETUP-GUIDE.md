# Hướng Dẫn Cấu Hình và Chạy Frontend Sau Khi Lấy Code Từ GitHub

Tài liệu này hướng dẫn chi tiết các bước cài đặt môi trường, cấu hình dịch vụ AWS và khởi chạy **Frontend** của dự án **AWS Student Management Portal** sau khi bạn nhân bản (clone) mã nguồn từ GitHub về máy tính cá nhân.

---

## 1. Yêu Cầu Hệ Thống & Công Cụ Cần Cài Đặt

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

### 1.1 Node.js & npm (Môi trường chạy React/Vite)
* **Node.js**: Phiên bản `>= 18.x` (Khuyến nghị dùng bản LTS mới nhất như 20.x).
* **npm**: Phiên bản `>= 9.x` (Tự động cài đặt đi kèm Node.js).
* **Kiểm tra phiên bản đã cài**:
  ```bash
  node -v
  npm -v
  ```

### 1.2 AWS CLI (Công cụ dòng lệnh AWS - Cần khi deploy lên S3/CloudFront)
* Tải xuống và cài đặt từ trang chủ AWS:
  * **Windows**: Tải file cài đặt [AWS CLI MSI Installer](https://awscli.amazonaws.com/AWSCLIV2.msi).
* **Kiểm tra phiên bản đã cài**:
  ```bash
  aws --version
  ```

---

## 2. Các Bước Cấu Hình và Chạy Local Frontend

Sau khi lấy mã nguồn về từ GitHub, bạn thực hiện các bước sau để kết nối và khởi chạy ở local:

### Bước 1: Cài đặt các thư viện phụ thuộc (Dependencies)
Mở cửa sổ terminal, di chuyển vào thư mục `frontend` của dự án và chạy lệnh:
```bash
cd frontend
npm install
```

### Bước 2: Tạo và cấu hình file môi trường `.env`
Tạo một tệp tin mới có tên là `.env` nằm trực tiếp trong thư mục `frontend` (`frontend/.env`). Cấu hình các thông số kết nối tới AWS theo thông tin hệ thống đã triển khai như sau:

```env
# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_7SwNQ0qYm
VITE_COGNITO_CLIENT_ID=6o5g3hcus9ehbmk90acqeuplau

# API Gateway Endpoint (URL API Backend thực tế đã triển khai)
VITE_API_ENDPOINT=https://9k9i3ukwdh.execute-api.us-east-1.amazonaws.com/prod

# AWS Region
VITE_AWS_REGION=us-east-1

# App Configuration
VITE_APP_NAME=AWS Student Management Portal
VITE_APP_VERSION=1.0.0
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_FILE_UPLOAD=true
```

> [!IMPORTANT]
> Toàn bộ các biến cấu hình sử dụng trong React thông qua Vite phải bắt đầu bằng tiền tố `VITE_`. Nếu đặt tên biến thiếu tiền tố này, ứng dụng sẽ không đọc được giá trị và không thể kết nối tới các dịch vụ AWS.

### Bước 3: Khởi chạy local server
Khởi động ứng dụng React bằng lệnh:
```bash
npm run dev
```
Ứng dụng sẽ được khởi tạo tại địa chỉ mặc định: `http://localhost:5173` (hoặc cổng khác tuỳ cấu hình hiển thị trên terminal). Mở trình duyệt truy cập link trên để kiểm tra kết nối.

---

## 3. Cấu Hình AWS CLI Để Triển Khai (Deploy) Lên Cloud

Khi bạn thực hiện chỉnh sửa code ở local và muốn deploy bản build mới lên môi trường cloud (để cập nhật trang **https://d3th0yl82lu593.cloudfront.net**), thực hiện cấu hình AWS CLI như sau:

### Bước 1: Cấu hình thông tin xác thực AWS Credentials
Chạy lệnh sau trên terminal của máy tính:
```bash
aws configure
```
Hệ thống sẽ yêu cầu nhập các thông tin:
1. **AWS Access Key ID**: Nhập Access Key từ IAM User của bạn (được cấp quyền quản lý S3 và CloudFront).
2. **AWS Secret Access Key**: Nhập Secret Key tương ứng.
3. **Default region name**: `us-east-1` (hoặc region mà bạn deploy hạ tầng).
4. **Default output format**: `json`

**Xác minh thông tin kết nối AWS thành công**:
```bash
aws sts get-caller-identity
```
Nếu hiện thông tin `Account` và `Arn` của User, chứng tỏ bạn đã đăng nhập thành công.

### Bước 2: Build mã nguồn cho Production
Trước khi deploy, biên dịch toàn bộ source code của Frontend:
```bash
npm run build
```
Thư mục chứa bản build đóng gói là `frontend/dist` sẽ được sinh ra.

### Bước 3: Đồng bộ lên S3 và refresh CloudFront
Chạy các lệnh AWS CLI từ thư mục `frontend` để triển khai:

1. **Đồng bộ hóa thư mục dist lên S3 bucket của frontend**:
   ```bash
   aws s3 sync dist/ s3://student-portal-frontend-147997148454 --delete
   ```
   *(Lệnh này sẽ upload tệp mới lên S3 và xóa các tệp cũ không còn sử dụng trên bucket)*

2. **Xóa bộ nhớ đệm (Invalidation) trên CloudFront để cập nhật ngay cho người dùng**:
   ```bash
   aws cloudfront create-invalidation --distribution-id E39TFB7INWHA6Y --paths "/*"
   ```
   *(Thay đổi `E39TFB7INWHA6Y` bằng CloudFront Distribution ID tương ứng với trang web của bạn)*

---

## 4. Cách Tra Cứu Thông Tin Dịch Vụ AWS Trên AWS Console (Khi deploy mới)

Nếu bạn triển khai một hệ thống backend mới trên AWS và cần lấy thông tin cấu hình cho file `.env`, hãy làm theo hướng dẫn sau:

### 4.1 Lấy thông tin Cognito User Pool & App Client ID
1. Truy cập [AWS Management Console](https://console.aws.amazon.com/).
2. Tìm dịch vụ **Cognito** → Chọn mục **User Pools**.
3. Chọn User Pool tương ứng với dự án của bạn (ví dụ: `User pool - r8hpjb`).
4. **UserPool ID**: Copy mã ID ở ngay phần đầu trang thông tin (dạng `us-east-1_xxxxxxxxx`).
5. **App Client ID**: Di chuyển sang tab **App integration** → Cuộn xuống dưới cùng tại phần **App client list** → Copy chuỗi ký tự **Client ID** của App Client.

### 4.2 Lấy thông tin Endpoint API Gateway
1. Tìm kiếm dịch vụ **API Gateway** trên AWS Console.
2. Chọn REST API của dự án (ví dụ: `student-portal-api`).
3. Click vào mục **Stages** ở menu bên trái → Chọn Stage đang chạy (ví dụ: `prod`).
4. **Invoke URL**: Copy đường dẫn URL hiển thị ở trên cùng (dạng `https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod`).

### 4.3 Lấy CloudFront Distribution ID & S3 Bucket Name
1. Tìm kiếm dịch vụ **CloudFront** trên AWS Console.
2. Tìm Distribution tương ứng với domain trang web của bạn (`d3th0yl82lu593.cloudfront.net`).
3. **Distribution ID**: Lấy ở cột **ID** của bảng danh sách (ví dụ: `E39TFB7INWHA6Y`).
4. **S3 Bucket**: Chuyển sang tab **Origins** của Distribution đó để xem chính xác tên S3 Bucket nguồn (ví dụ: `student-portal-frontend-147997148454.s3.amazonaws.com` -> Tên bucket là `student-portal-frontend-147997148454`).

---

## 5. Xử Lý Các Sự Cố Thường Gặp (Troubleshooting)

* **Lỗi 403 Forbidden hoặc CORS khi tương tác với API từ Local**:
  * Kiểm tra lại file `frontend/.env` đã cấu hình đúng `VITE_API_ENDPOINT` chưa (thiếu dấu `/` ở cuối hoặc sai giao thức `https`).
  * Đảm bảo cấu hình CORS trên API Gateway đã cho phép Domain Local của bạn (ví dụ: `http://localhost:5173`).
* **Đăng nhập thất bại / Báo lỗi kết nối UserPool**:
  * Kiểm tra xem các biến `VITE_COGNITO_USER_POOL_ID` và `VITE_COGNITO_CLIENT_ID` đã khớp chính xác với thông số trên AWS Console chưa.
* **AWS CLI báo lỗi Expired Token khi deploy**:
  * Phiên đăng nhập AWS của bạn đã hết hạn. Hãy lấy Access Key mới từ AWS IAM / AWS Academy Learner Lab và chạy lại lệnh `aws configure`.