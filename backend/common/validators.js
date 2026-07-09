// common/validators.js
// Hàm kiểm tra dữ liệu đầu vào cho sinh viên.
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

export default { validateStudent }
