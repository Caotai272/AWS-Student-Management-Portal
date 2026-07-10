// src/services/testTeacherService.js
export const getTeachers = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Return mock data that matches the real backend response
  return {
    data: {
      teachers: [
        {
          teacherId: "T001",
          fullName: "Dr. Nguyen Van F",
          email: "nguyenvanf@example.com",
          phone: "0909123461",
          department: "Information Technology",
          degree: "Tiến sĩ",
          createdAt: "2026-07-09T10:00:00Z",
          id: "1"
        },
        {
          teacherId: "T002",
          fullName: "Dr. Tran Thi G",
          email: "tranthig@example.com",
          phone: "0909123462",
          department: "Computer Science",
          degree: "Thạc sĩ",
          createdAt: "2026-07-08T14:30:00Z",
          id: "2"
        },
        {
          teacherId: "T003",
          fullName: "Ms. Le Thi H",
          email: "lethih@example.com",
          phone: "0909123463",
          department: "Business Administration",
          degree: "Cử nhân",
          createdAt: "2026-07-07T09:15:00Z",
          id: "3"
        },
        {
          teacherId: "T004",
          fullName: "Prof. Pham Van I",
          email: "phamvani@example.com",
          phone: "0909123464",
          department: "Electrical Engineering",
          degree: "Tiến sĩ",
          createdAt: "2026-07-06T16:45:00Z",
          id: "4"
        }
      ],
      count: 4
    }
  }
}

export const getTeacherById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const teachers = [
    {
      teacherId: "T001", fullName: "Dr. Nguyen Van F", email: "nguyenvanf@example.com",
      phone: "0909123461", department: "Information Technology", degree: "Tiến sĩ", id: "1"
    },
    {
      teacherId: "T002", fullName: "Dr. Tran Thi G", email: "tranthig@example.com",
      phone: "0909123462", department: "Computer Science", degree: "Thạc sĩ", id: "2"
    }
  ]

  const teacher = teachers.find(t => t.id === id || t.teacherId === id)
  if (!teacher) {
    throw { response: { data: { message: 'Teacher not found' }, status: 404 } }
  }

  return { data: teacher }
}

export const createTeacher = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const newTeacher = {
    id: Date.now().toString(),
    teacherId: data.teacherId || `T${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    department: data.department,
    degree: data.degree || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return { data: newTeacher, message: 'Teacher created successfully' }
}

export const updateTeacher = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 600))

  const updatedTeacher = {
    id: id,
    teacherId: data.teacherId || "T001",
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    department: data.department,
    degree: data.degree || '',
    createdAt: "2026-07-09T10:00:00Z",
    updatedAt: new Date().toISOString()
  }

  return { data: updatedTeacher }
}

export const deleteTeacher = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return { message: 'Teacher deleted successfully' }
}

export default {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
}
