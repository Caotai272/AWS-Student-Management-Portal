# Frontend Pages Structure & Plan

File này lưu cấu trúc thư mục `frontend/src/pages/`, phân chia module, phân quyền theo
vai trò và lộ trình làm trước 12 trang. Dùng làm căn cứ khi thiết kế DB và xây dựng
các trang tiếp theo.

---

## 1. Cấu trúc thư mục pages (đích)

```
frontend/src/pages/
│
├── Login.jsx
├── Dashboard.jsx
│
├── students/
│   ├── StudentList.jsx
│   ├── StudentCreate.jsx
│   ├── StudentDetail.jsx
│   ├── StudentEdit.jsx
│   ├── StudentDocuments.jsx
│   ├── StudentGrades.jsx
│   └── UploadDocument.jsx
│
├── teachers/
│   ├── TeacherList.jsx
│   ├── TeacherCreate.jsx
│   ├── TeacherDetail.jsx
│   └── TeacherEdit.jsx
│
├── grades/
│   ├── GradeList.jsx
│   ├── GradeCreate.jsx
│   ├── GradeEdit.jsx
│   └── TeacherGrades.jsx
│
├── materials/
│   ├── LearningMaterials.jsx
│   ├── UploadMaterial.jsx
│   └── StudentMaterials.jsx
│
├── notifications/
│   ├── Notifications.jsx
│   └── CreateNotification.jsx
│
├── profile/
│   └── Profile.jsx
│
├── settings/
│   └── Settings.jsx
│
├── Unauthorized.jsx
└── NotFound.jsx
```

---

## 2. Bốn module chính

| STT | Module | Mô tả |
|----:|--------|-------|
| 1 | Quản lý sinh viên | Student CRUD, hồ sơ, điểm cá nhân |
| 2 | Quản lý giáo viên | Teacher CRUD |
| 3 | Quản lý điểm | Grade CRUD, điểm theo giáo viên |
| 4 | Quản lý tài liệu học tập | Learning materials upload/download |

---

## 3. Phân quyền theo vai trò

### Admin / Staff
Quyền đầy đủ, vào được:
- Dashboard
- Students
- Teachers
- Grades
- Documents
- Notifications
- Settings

### Teacher / Giáo viên
Vào được:
- TeacherGrades
- UploadMaterial
- LearningMaterials
- Profile

Giáo viên làm được:
- Đăng điểm cho sinh viên
- Cập nhật điểm
- Upload tài liệu học tập
- Xem danh sách tài liệu đã đăng

### Student / Sinh viên
Vào được:
- StudentGrades
- StudentMaterials
- StudentDocuments
- Profile

Sinh viên làm được:
- Xem điểm
- Xem tài liệu giáo viên đăng
- Xem hồ sơ cá nhân
- Tải tài liệu học tập

---

## 4. Lộ trình làm trước (12 trang demo)

Không làm hết 26 trang ngay. Làm trước 12 trang quan trọng:

| STT | Trang | Module |
|----:|-------|--------|
| 1 | Login.jsx | Auth |
| 2 | Dashboard.jsx | Overview |
| 3 | StudentList.jsx | Students |
| 4 | StudentCreate.jsx | Students |
| 5 | StudentDetail.jsx | Students |
| 6 | StudentEdit.jsx | Students |
| 7 | TeacherList.jsx | Teachers |
| 8 | TeacherCreate.jsx | Teachers |
| 9 | GradeList.jsx | Grades |
| 10 | TeacherGrades.jsx | Grades |
| 11 | UploadMaterial.jsx | Materials |
| 12 | StudentMaterials.jsx | Materials |

---

## 5. Ghi chú thiết kế

- Routing bảo vệ bằng `ProtectedRoute` + kiểm tra role (Cognito groups:
  `Admin`, `Staff`, `Teacher`, `Student`).
- Sidebar hiển thị menu theo role tương ứng.
- Các trang chưa làm (StudentDocuments, StudentGrades, GradeEdit, TeacherDetail,
  TeacherEdit, LearningMaterials, Notifications, CreateNotification, Profile,
  Settings, Unauthorized, NotFound) bổ sung sau khi 12 trang trên chạy ổn.
- Cấu trúc DB (DynamoDB tables: Students, Teachers, Grades, Materials,
  Notifications, Documents) tham khảo `docs/dynamodb-design.md`.
