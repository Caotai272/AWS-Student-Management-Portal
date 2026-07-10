// src/utils/testDataSeeder.js
// Script để thêm dữ liệu mẫu cho mục đích kiểm tra và phát triển
try {
  const testStudents = [
    {
      studentId: 'SV001',
      fullName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '0909123456',
      gender: 'Male',
      dateOfBirth: '2003-05-10',
      major: 'Information Technology',
      className: 'IT01',
      status: 'Active'
    },
    {
      studentId: 'SV002',
      fullName: 'Tran Thi B',
      email: 'tranthib@example.com',
      phone: '0909123457',
      gender: 'Female',
      dateOfBirth: '2002-08-15',
      major: 'Computer Science',
      className: 'CS02',
      status: 'Active'
    },
    {
      studentId: 'SV003',
      fullName: 'Le Van C',
      email: 'levanc@example.com',
      phone: '0909123458',
      gender: 'Male',
      dateOfBirth: '2004-03-20',
      major: 'Business Administration',
      className: 'BA01',
      status: 'Graduated'
    },
    {
      studentId: 'SV004',
      fullName: 'Pham Thi D',
      email: 'phamthid@example.com',
      phone: '0909123459',
      gender: 'Female',
      dateOfBirth: '2003-11-25',
      major: 'Electrical Engineering',
      className: 'EE01',
      status: 'Warning'
    },
    {
      studentId: 'SV005',
      fullName: 'Hoang Van E',
      email: 'hoangvane@example.com',
      phone: '0909123460',
      gender: 'Male',
      dateOfBirth: '2001-07-30',
      major: 'Mathematics',
      className: 'MATH01',
      status: 'Inactive'
    }
  ]

  const testTeachers = [
    {
      teacherId: 'T001',
      fullName: 'Dr. Nguyen Van F',
      email: 'nguyenvanf@example.com',
      phone: '0909123461',
      department: 'Information Technology',
      degree: 'Tiến sĩ'
    },
    {
      teacherId: 'T002',
      fullName: 'Dr. Tran Thi G',
      email: 'tranthig@example.com',
      phone: '0909123462',
      department: 'Computer Science',
      degree: 'Thạc sĩ'
    },
    {
      teacherId: 'T003',
      fullName: 'Ms. Le Thi H',
      email: 'lethih@example.com',
      phone: '0909123463',
      department: 'Business Administration',
      degree: 'Cử nhân'
    },
    {
      teacherId: 'T004',
      fullName: 'Prof. Pham Van I',
      email: 'phamvani@example.com',
      phone: '0909123464',
      department: 'Electrical Engineering',
      degree: 'Tiến sĩ'
    }
  ]

  console.log('=== Dữ liệu mẫu ===')
  console.log('Sinh viên:', testStudents.length, 'bản ghi')
  console.log('Giáo viên:', testTeachers.length, 'bản ghi')
  console.log('\n=== Chi tiết sinh viên ===')
  testStudents.forEach((s, i) => {
    console.log(`${i + 1}. ${s.fullName} (ID: ${s.studentId}) - ${s.major} - ${s.status}`)
  })

  console.log('\n=== Chi tiết giáo viên ===')
  testTeachers.forEach((t, i) => {
    console.log(`${i + 1}. ${t.fullName} (ID: ${t.teacherId}) - ${t.department} - ${t.degree}`)
  })

  console.log('\n=== Cách sử dụng ===')
  console.log('Để thêm dữ liệu mẫu vào hệ thống:')
  console.log('1. Import testStudents và testTeachers vào component của bạn')
  console.log('2. Lặp qua danh sách và gọi createStudent/createTeacher API')
  console.log('3. Tích hợp nút "Thêm dữ liệu mẫu" trong UI')

  console.log('\n=== Lưu ý ===')
  console.log('• ID sinh viên phải là duy nhất trong hệ thống')
  console.log('• ID giáo viên phải là duy nhất trong hệ thống')
  console.log('• Kiểm tra tính hợp lệ của dữ liệu trước khi tạo')
  console.log('• Có thể sử dụng cho mục đích kiểm tra giao diện người dùng')

  // Thêm kiểm tra danh sách hiện tại trước khi thêm mới
  const { getStudents, getTeachers } = await import('../services/studentService')
  const { getTeachers: getTeachersAPI } = await import('../services/teacherService')

  // Kiểm tra số lượng hiện tại
  try {
    const existingStudents = await getStudents()
    const existingTeachers = await getTeachersAPI()

    console.log('\n=== TRẠNG THÁI HIỆN TẠI CỦA DATABASE ===')
    console.log('Số lượng sinh viên hiện tại:', existingStudents.data?.students?.length || 0)
    console.log('Số lượng giáo viên hiện tại:', existingTeachers.data?.teachers?.length || 0)

    if (existingStudents.data?.students?.length > 0) {
      console.log('\n=== DANH SÁCH SINH VIÊN HIỆN TẠI ===')
      existingStudents.data.students.forEach((s, i) => {
        console.log(`${i + 1}. ${s.fullName} (${s.studentId}) - ${s.major || 'N/A'} - ${s.status || 'Active'} (${s.email})`)
      })
    }

    if (existingTeachers.data?.teachers?.length > 0) {
      console.log('\n=== DANH SÁCH GIÁO VIÊN HIỆN TẠI ===')
      existingTeachers.data.teachers.forEach((t, i) => {
        console.log(`${i + 1}. ${t.fullName} (${t.teacherId}) - ${t.department || 'N/A'} - ${t.degree || 'N/A'} (${t.email})`)
      })
    }

  } catch (error) {
    console.log('Không thể kiểm tra trạng thái hiện tại:', error)
  }

  module.exports = { testStudents, testTeachers }
} catch (error) {
  console.error('Lỗi khi tải dữ liệu mẫu:', error)
}