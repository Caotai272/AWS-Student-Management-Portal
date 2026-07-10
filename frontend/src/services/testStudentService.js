// src/services/testStudentService.js
export const getStudents = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Return mock data that matches the real backend response
  return {
    data: {
      students: [
        {
          studentId: "SV001",
          fullName: "Nguyen Van A",
          email: "nguyenvana@example.com",
          phone: "0909123456",
          gender: "Male",
          dateOfBirth: "2003-05-10",
          major: "Information Technology",
          className: "IT01",
          status: "Active",
          createdAt: "2026-07-09T10:00:00Z",
          id: "1"
        },
        {
          studentId: "SV002",
          fullName: "Tran Thi B",
          email: "tranthib@example.com",
          phone: "0909123457",
          gender: "Female",
          dateOfBirth: "2002-08-15",
          major: "Computer Science",
          className: "CS02",
          status: "Active",
          createdAt: "2026-07-08T14:30:00Z",
          id: "2"
        },
        {
          studentId: "SV003",
          fullName: "Le Van C",
          email: "levanc@example.com",
          phone: "0909123458",
          gender: "Male",
          dateOfBirth: "2004-03-20",
          major: "Business Administration",
          className: "BA01",
          status: "Graduated",
          createdAt: "2026-07-07T09:15:00Z",
          id: "3"
        },
        {
          studentId: "SV004",
          fullName: "Pham Thi D",
          email: "phamthid@example.com",
          phone: "0909123459",
          gender: "Female",
          dateOfBirth: "2003-11-25",
          major: "Electrical Engineering",
          className: "EE01",
          status: "Warning",
          createdAt: "2026-07-06T16:45:00Z",
          id: "4"
        },
        {
          studentId: "SV005",
          fullName: "Hoang Van E",
          email: "hoangvane@example.com",
          phone: "0909123460",
          gender: "Male",
          dateOfBirth: "2001-07-30",
          major: "Mathematics",
          className: "MATH01",
          status: "Inactive",
          createdAt: "2026-07-05T11:20:00Z",
          id: "5"
        }
      ],
      count: 5
    }
  }
}

export const getStudentById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const students = [
    {
      studentId: "SV001", fullName: "Nguyen Van A", email: "nguyenvana@example.com",
      phone: "0909123456", gender: "Male", dateOfBirth: "2003-05-10",
      major: "Information Technology", className: "IT01", status: "Active", id: "1"
    },
    {
      studentId: "SV002", fullName: "Tran Thi B", email: "tranthib@example.com",
      phone: "0909123457", gender: "Female", dateOfBirth: "2002-08-15",
      major: "Computer Science", className: "CS02", status: "Active", id: "2"
    }
  ]

  const student = students.find(s => s.id === id || s.studentId === id)
  if (!student) {
    throw { response: { data: { message: 'Student not found' }, status: 404 } }
  }

  return { data: student }
}

export const createStudent = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const newStudent = {
    id: Date.now().toString(),
    studentId: data.studentId || `SV${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    gender: data.gender || '',
    dateOfBirth: data.dateOfBirth || '',
    major: data.major,
    className: data.className,
    status: data.status || 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return { data: newStudent, message: 'Student created successfully' }
}

export const updateStudent = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 600))

  // Mock update - just return updated data
  const updatedStudent = {
    id: id,
    studentId: data.studentId || "SV001",
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    gender: data.gender || '',
    dateOfBirth: data.dateOfBirth || '',
    major: data.major,
    className: data.className,
    status: data.status || 'Active',
    createdAt: "2026-07-09T10:00:00Z",
    updatedAt: new Date().toISOString()
  }

  return { data: updatedStudent }
}

export const deleteStudent = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return { message: 'Student deleted successfully' }
}

export default {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
}
