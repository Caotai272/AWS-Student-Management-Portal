// src/pages/materials/UploadMaterial.jsx
import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import Layout from '../../components/Layout'
import { createUploadUrl, saveMaterialMetadata } from '../../services/materialService'

const TYPES = [
  { value: 'slide', label: 'Slide bài giảng' },
  { value: 'exercise', label: 'Bài tập' },
  { value: 'exam', label: 'Đề thi' },
  { value: 'reference', label: 'Tài liệu tham khảo' },
  { value: 'other', label: 'Khác' }
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function UploadMaterial() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('slide')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    setStatus({ type: '', message: '' })
    if (!title || !subject) return setStatus({ type: 'danger', message: 'Vui lòng nhập tiêu đề và môn học.' })
    if (!file) return setStatus({ type: 'danger', message: 'Vui lòng chọn file.' })

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) return setStatus({ type: 'danger', message: 'Chỉ cho phép PDF, JPG, PNG, DOCX.' })
    if (file.size > MAX_SIZE) return setStatus({ type: 'danger', message: 'File tối đa 10MB.' })

    setLoading(true)
    try {
      const { data } = await createUploadUrl({ fileName: file.name, contentType: file.type, type })
      await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      await saveMaterialMetadata({ title, subject, type, fileName: file.name, s3Key: data.s3Key, fileUrl: data.fileUrl })
      setStatus({ type: 'success', message: 'Tải tài liệu lên thành công!' })
      setTitle(''); setSubject(''); setFile(null)
    } catch (err) {
      setStatus({ type: 'danger', message: err.message || 'Tải lên thất bại.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Upload Material">
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload tài liệu học tập</h1>
          <p className="page-description">Đăng tài liệu cho sinh viên (slide, bài tập, đề thi...).</p>
        </div>
      </div>

      {status.message && <div className={`alert alert-${status.type}`}>{status.message}</div>}

      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Slide chương 1" />
          </div>
          <div className="form-group">
            <label className="form-label">Môn học *</label>
            <input className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Cơ sở dữ liệu" />
          </div>
          <div className="form-group">
            <label className="form-label">Loại tài liệu *</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Chọn file (PDF, JPG, PNG, DOCX - tối đa 10MB)</label>
            <input className="form-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={(e) => setFile(e.target.files[0])} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleUpload} disabled={loading}><Upload size={16} /> {loading ? 'Đang tải...' : 'Tải lên'}</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="card-title">Hướng dẫn</h2>
        <p className="card-description"><FileText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Tài liệu upload trực tiếp lên S3 qua Presigned URL, metadata lưu vào DynamoDB.</p>
      </div>
    </Layout>
  )
}
