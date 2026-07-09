// common/validators.js
// Hàm kiểm tra dữ liệu đầu vào cho sinh viên, giáo viên và điểm.
export const validateStudent = (data) => {
  const errors = []
  if (!data.studentId) errors.push('studentId là bắt buộc')
  if (!data.fullName || data.fullName.trim() === '') errors.push('fullName là bắt buộc')
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('email không hợp lệ')
  if (data.gpa !== undefined && data.gpa !== null && data.gpa !== '') {
    const gpa = Number(data.gpa)
    if (isNaN(gpa) || gpa < 0 || gpa > 4) errors.push('gpa phải từ 0 đến 4')
  }
  return errors
}

export const validateTeacher = (data) => {
  const errors = []
  if (!data.teacherId) errors.push('teacherId là bắt buộc')
  if (!data.fullName || data.fullName.trim() === '') errors.push('fullName là bắt buộc')
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('email không hợp lệ')
  if (!data.department || data.department.trim() === '') errors.push('department là bắt buộc')
  return errors
}

export const validateGrade = (data) => {
  const errors = []
  if (!data.studentId) errors.push('studentId là bắt buộc')
  if (!data.teacherId) errors.push('teacherId là bắt buộc')
  if (!data.subject || data.subject.trim() === '') errors.push('subject là bắt buộc')
  if (data.score === undefined || data.score === null || data.score === '') {
    errors.push('score là bắt buộc')
  } else {
    const score = Number(data.score)
    if (isNaN(score) || score < 0 || score > 10) errors.push('score phải từ 0 đến 10')
  }
  return errors
}

export default { validateStudent, validateTeacher, validateGrade }
