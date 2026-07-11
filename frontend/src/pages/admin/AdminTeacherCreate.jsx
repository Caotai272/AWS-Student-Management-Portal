import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import TeacherForm from '../../components/TeacherForm'
import { createTeacher } from '../../services/teacherService'

const EMPTY = { teacherId: '', fullName: '', email: '', phone: '', department: '', degree: '' }

export default function AdminTeacherCreate() {
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
      navigate('/admin/teachers')
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm giáo viên thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Thêm Giáo Viên (Admin)">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 5px 0' }}>Thêm giáo viên</h1>
          <p className="page-description" style={{ color: 'var(--color-text-muted)', margin: 0 }}>Điền thông tin giáo viên mới vào form bên dưới.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger" style={{ marginBottom: '15px' }}>{error}</div>}
      <TeacherForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} onCancel={() => navigate('/admin/teachers')} submitText="Lưu" loading={loading} />
    </Layout>
  )
}
