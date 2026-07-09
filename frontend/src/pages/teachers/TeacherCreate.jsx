// src/pages/teachers/TeacherCreate.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import TeacherForm from '../../components/TeacherForm'
import { createTeacher } from '../../services/teacherService'

const EMPTY = { teacherId: '', fullName: '', email: '', phone: '', department: '', degree: '' }

export default function TeacherCreate() {
  const [formData, setFormData] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.teacherId || !formData.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || !formData.department) {
      setError('Vui lòng điền đầy đủ: mã, họ tên, email hợp lệ và bộ môn.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createTeacher(formData)
      navigate('/teachers')
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm giáo viên thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Create Teacher">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thêm giáo viên</h1>
          <p className="page-description">Điền thông tin giáo viên mới vào form.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <TeacherForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} onCancel={() => navigate('/teachers')} submitText="Lưu" loading={loading} />
    </Layout>
  )
}
