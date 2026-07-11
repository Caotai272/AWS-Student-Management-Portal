import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

console.log("🌱 Bắt đầu nạp dữ liệu mẫu lên DynamoDB us-east-1...");

const students = [
  {
    id: "SV001",
    studentId: "SV001",
    fullName: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0909123456",
    gender: "Male",
    dateOfBirth: "2003-05-10",
    major: "Information Technology",
    className: "IT01",
    status: "Active",
    gpa: 3.6,
    createdAt: "2026-07-09T10:00:00Z",
    updatedAt: "2026-07-09T10:00:00Z"
  },
  {
    id: "SV002",
    studentId: "SV002",
    fullName: "Tran Thi B",
    email: "tranthib@example.com",
    phone: "0909123457",
    gender: "Female",
    dateOfBirth: "2002-08-15",
    major: "Computer Science",
    className: "IT01",
    status: "Active",
    gpa: 3.8,
    createdAt: "2026-07-08T14:30:00Z",
    updatedAt: "2026-07-08T14:30:00Z"
  },
  {
    id: "SV003",
    studentId: "SV003",
    fullName: "Le Van C",
    email: "levanc@example.com",
    phone: "0909123458",
    gender: "Male",
    dateOfBirth: "2004-03-20",
    major: "Business Administration",
    className: "SEC01",
    status: "Graduated",
    gpa: 3.2,
    createdAt: "2026-07-07T09:15:00Z",
    updatedAt: "2026-07-07T09:15:00Z"
  },
  {
    id: "SV004",
    studentId: "SV004",
    fullName: "Pham Thi D",
    email: "phamthid@example.com",
    phone: "0909123459",
    gender: "Female",
    dateOfBirth: "2003-11-25",
    major: "Electrical Engineering",
    className: "SEC01",
    status: "Warning",
    gpa: 1.8,
    createdAt: "2026-07-06T16:45:00Z",
    updatedAt: "2026-07-06T16:45:00Z"
  }
];

const teachers = [
  {
    id: "GV001",
    teacherId: "GV001",
    fullName: "Tran Minh Tri",
    email: "teacher1@example.com",
    phone: "0987654321",
    department: "Cloud Computing",
    degree: "PhD",
    subject: "Cybersecurity",
    createdAt: "2026-07-09T08:00:00Z",
    updatedAt: "2026-07-09T08:00:00Z"
  },
  {
    id: "GV002",
    teacherId: "GV002",
    fullName: "Nguyen Thi Mai",
    email: "teacher2@example.com",
    phone: "0987654322",
    department: "Software Engineering",
    degree: "Master",
    subject: "Lập trình Java",
    createdAt: "2026-07-09T08:15:00Z",
    updatedAt: "2026-07-09T08:15:00Z"
  }
];

const grades = [
  {
    id: "grade-1",
    studentId: "SV001",
    teacherId: "GV001",
    subject: "Cybersecurity",
    semester: "2026-1",
    score: 9.0,
    note: "Tích cực tham gia thảo luận lớp học",
    createdAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "grade-2",
    studentId: "SV002",
    teacherId: "GV001",
    subject: "Cybersecurity",
    semester: "2026-1",
    score: 8.5,
    note: "Làm bài thi tốt",
    createdAt: "2026-07-10T12:05:00Z"
  },
  {
    id: "grade-3",
    studentId: "SV001",
    teacherId: "GV002",
    subject: "Lập trình Java",
    semester: "2026-1",
    score: 9.5,
    note: "Kỹ năng code rất tốt",
    createdAt: "2026-07-10T12:10:00Z"
  }
];

const materials = [
  {
    id: "mat-1",
    title: "Giáo trình AWS Cloud Practitioner",
    subject: "Cybersecurity",
    type: "book",
    fileName: "aws_practitioner_guide.pdf",
    s3Key: "materials/IT01/aws_practitioner_guide.pdf",
    fileUrl: "https://student-documents-147997148454.s3.amazonaws.com/materials/IT01/aws_practitioner_guide.pdf",
    createdAt: "2026-07-11T09:00:00Z"
  },
  {
    id: "mat-2",
    title: "Tài liệu Lab Cybersecurity Thực hành",
    subject: "Cybersecurity",
    type: "slide",
    fileName: "lab_cybersecurity_v1.pdf",
    s3Key: "materials/IT01/lab_cybersecurity_v1.pdf",
    fileUrl: "https://student-documents-147997148454.s3.amazonaws.com/materials/IT01/lab_cybersecurity_v1.pdf",
    createdAt: "2026-07-11T09:30:00Z"
  }
];

async function seedTable(tableName, items) {
  console.log(`⏳ Đang nạp bảng ${tableName}...`);
  for (const item of items) {
    try {
      await ddb.send(new PutCommand({
        TableName: tableName,
        Item: item
      }));
    } catch (err) {
      console.error(`❌ Lỗi khi nạp item vào bảng ${tableName}:`, err.message);
    }
  }
  console.log(`✅ Hoàn tất nạp bảng ${tableName}`);
}

async function run() {
  await seedTable("Students", students);
  await seedTable("Teachers", teachers);
  await seedTable("Grades", grades);
  await seedTable("Materials", materials);
  console.log("🎉 Nạp dữ liệu mẫu hoàn tất!");
}

run().catch(console.error);
