import boto3
import time

region = 'us-east-1'
dynamodb = boto3.resource('dynamodb', region_name=region)

print("🌱 Bắt đầu nạp dữ liệu mẫu lên DynamoDB (us-east-1)...")

# 1. Nạp dữ liệu Sinh viên (Students)
students_data = [
    {
        'id': 'SV001',
        'studentId': 'SV001',
        'fullName': 'Nguyen Van A',
        'email': 'nguyenvana@example.com',
        'phone': '0909123456',
        'gender': 'Male',
        'dateOfBirth': '2003-05-10',
        'major': 'Information Technology',
        'className': 'IT01',
        'status': 'Active',
        'gpa': 3.6,
        'createdAt': '2026-07-09T10:00:00Z',
        'updatedAt': '2026-07-09T10:00:00Z'
    },
    {
        'id': 'SV002',
        'studentId': 'SV002',
        'fullName': 'Tran Thi B',
        'email': 'tranthib@example.com',
        'phone': '0909123457',
        'gender': 'Female',
        'dateOfBirth': '2002-08-15',
        'major': 'Computer Science',
        'className': 'IT01',
        'status': 'Active',
        'gpa': 3.8,
        'createdAt': '2026-07-08T14:30:00Z',
        'updatedAt': '2026-07-08T14:30:00Z'
    },
    {
        'id': 'SV003',
        'studentId': 'SV003',
        'fullName': 'Le Van C',
        'email': 'levanc@example.com',
        'phone': '0909123458',
        'gender': 'Male',
        'dateOfBirth': '2004-03-20',
        'major': 'Business Administration',
        'className': 'SEC01',
        'status': 'Graduated',
        'gpa': 3.2,
        'createdAt': '2026-07-07T09:15:00Z',
        'updatedAt': '2026-07-07T09:15:00Z'
    },
    {
        'id': 'SV004',
        'studentId': 'SV004',
        'fullName': 'Pham Thi D',
        'email': 'phamthid@example.com',
        'phone': '0909123459',
        'gender': 'Female',
        'dateOfBirth': '2003-11-25',
        'major': 'Electrical Engineering',
        'className': 'SEC01',
        'status': 'Warning',
        'gpa': 1.8,
        'createdAt': '2026-07-06T16:45:00Z',
        'updatedAt': '2026-07-06T16:45:00Z'
    }
]

try:
    table = dynamodb.Table('Students')
    for item in students_data:
        table.put_item(Item=item)
    print("✅ Đã nạp dữ liệu bảng Students thành công!")
except Exception as e:
    print(f"❌ Lỗi nạp bảng Students: {e}")

# 2. Nạp dữ liệu Giáo viên (Teachers)
teachers_data = [
    {
        'id': 'GV001',
        'teacherId': 'GV001',
        'fullName': 'Tran Minh Tri',
        'email': 'teacher1@example.com',
        'phone': '0987654321',
        'department': 'Cloud Computing',
        'degree': 'PhD',
        'subject': 'Cybersecurity',
        'createdAt': '2026-07-09T08:00:00Z',
        'updatedAt': '2026-07-09T08:00:00Z'
    },
    {
        'id': 'GV002',
        'teacherId': 'GV002',
        'fullName': 'Nguyen Thi Mai',
        'email': 'teacher2@example.com',
        'phone': '0987654322',
        'department': 'Software Engineering',
        'degree': 'Master',
        'subject': 'Lập trình Java',
        'createdAt': '2026-07-09T08:15:00Z',
        'updatedAt': '2026-07-09T08:15:00Z'
    }
]

try:
    table = dynamodb.Table('Teachers')
    for item in teachers_data:
        table.put_item(Item=item)
    print("✅ Đã nạp dữ liệu bảng Teachers thành công!")
except Exception as e:
    print(f"❌ Lỗi nạp bảng Teachers: {e}")

# 3. Nạp dữ liệu Điểm số (Grades)
grades_data = [
    {
        'id': 'grade-1',
        'studentId': 'SV001',
        'teacherId': 'GV001',
        'subject': 'Cybersecurity',
        'semester': '2026-1',
        'score': 9.0,
        'note': 'Tích cực tham gia thảo luận lớp học',
        'createdAt': '2026-07-10T12:00:00Z'
    },
    {
        'id': 'grade-2',
        'studentId': 'SV002',
        'teacherId': 'GV001',
        'subject': 'Cybersecurity',
        'semester': '2026-1',
        'score': 8.5,
        'note': 'Làm bài thi tốt',
        'createdAt': '2026-07-10T12:05:00Z'
    },
    {
        'id': 'grade-3',
        'studentId': 'SV001',
        'teacherId': 'GV002',
        'subject': 'Lập trình Java',
        'semester': '2026-1',
        'score': 9.5,
        'note': 'Kỹ năng code rất tốt',
        'createdAt': '2026-07-10T12:10:00Z'
    }
]

try:
    table = dynamodb.Table('Grades')
    for item in grades_data:
        table.put_item(Item=item)
    print("✅ Đã nạp dữ liệu bảng Grades thành công!")
except Exception as e:
    print(f"❌ Lỗi nạp bảng Grades: {e}")

# 4. Nạp dữ liệu Tài liệu (Materials)
materials_data = [
    {
        'id': 'mat-1',
        'title': 'Giáo trình AWS Cloud Practitioner',
        'subject': 'Cybersecurity',
        'type': 'book',
        'fileName': 'aws_practitioner_guide.pdf',
        's3Key': 'materials/IT01/aws_practitioner_guide.pdf',
        'fileUrl': 'https://student-documents-147997148454.s3.amazonaws.com/materials/IT01/aws_practitioner_guide.pdf',
        'createdAt': '2026-07-11T09:00:00Z'
    },
    {
        'id': 'mat-2',
        'title': 'Tài liệu Lab Cybersecurity Thực hành',
        'subject': 'Cybersecurity',
        'type': 'slide',
        'fileName': 'lab_cybersecurity_v1.pdf',
        's3Key': 'materials/IT01/lab_cybersecurity_v1.pdf',
        'fileUrl': 'https://student-documents-147997148454.s3.amazonaws.com/materials/IT01/lab_cybersecurity_v1.pdf',
        'createdAt': '2026-07-11T09:30:00Z'
    }
]

try:
    table = dynamodb.Table('Materials')
    for item in materials_data:
         table.put_item(Item=item)
    print("✅ Đã nạp dữ liệu bảng Materials thành công!")
except Exception as e:
    print(f"❌ Lỗi nạp bảng Materials: {e}")

print("🌱 Hoàn tất nạp toàn bộ dữ liệu mẫu!")
