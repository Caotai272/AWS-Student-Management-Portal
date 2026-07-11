import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

export default function MaterialEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', subject: '', type: 'slide', fileName: '' })
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/materials`)
      .then(res => {
        const list = res.data.materials || res.data || []
        const current = list.find(m => m.id === id)
        if (current) setForm(current)
      })
      .catch(err => console.error(err))
  }, [id])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setForm({ ...form, fileName: e.target.files[0].name })
      setMessage('Đã chọn file thay thế thành công.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Cập nhật thay đổi tài liệu học tập thành công!')
    setTimeout(() => {
      navigate('/materials')
    }, 1500)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="Chỉnh Sửa Tài Liệu Giảng Dạy" />
        <main className="main-content">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Môn học</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">Tên file đính kèm: <strong>{form.fileName || 'N/A'}</strong></label>
                <div style={{ marginTop: '5px' }}>
                  <input
                    type="file"
                    id="replace-file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button type="button" className="btn btn-outline" onClick={() => document.getElementById('replace-file').click()}>Thay file</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/materials')}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
