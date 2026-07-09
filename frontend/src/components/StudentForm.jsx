// src/components/StudentForm.jsx
import { useState, useEffect } from 'react'

export default function StudentForm({ initialData = {}, onSubmit, loading = false }) {
  const [form, setForm] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    major: '',
    gpa: '',
    ...initialData
  })

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...initialData }))
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <label>
        Mã sinh viên
        <input name="studentId" value={form.studentId} onChange={handleChange} required />
      </label>
      <label>
        Họ tên
        <input name="fullName" value={form.fullName} onChange={handleChange} required />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Số điện thoại
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        Ngành
        <input name="major" value={form.major} onChange={handleChange} />
      </label>
      <label>
        GPA
        <input name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} />
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}
