// src/components/GradeForm.jsx
const SEMESTERS = ['HK1', 'HK2', 'Năm 1', 'Năm 2', 'Năm 3', 'Năm 4']

export default function GradeForm({ formData, onChange, onSubmit, onCancel, submitText = 'Lưu', loading = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2 className="card-title">Thông tin điểm</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Mã sinh viên *</label>
          <input className="form-input" name="studentId" value={formData.studentId || ''} onChange={handleChange} placeholder="SV001" />
        </div>
        <div className="form-group">
          <label className="form-label">Mã giáo viên *</label>
          <input className="form-input" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} placeholder="T001" />
        </div>
        <div className="form-group">
          <label className="form-label">Môn học *</label>
          <input className="form-input" name="subject" value={formData.subject || ''} onChange={handleChange} placeholder="Toán rời rạc" />
        </div>
        <div className="form-group">
          <label className="form-label">Học kỳ</label>
          <select className="form-select" name="semester" value={formData.semester || ''} onChange={handleChange}>
            <option value="">-- Chọn --</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Điểm (0-10) *</label>
          <input className="form-input" name="score" type="number" step="0.1" min="0" max="10" value={formData.score || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <input className="form-input" name="note" value={formData.note || ''} onChange={handleChange} placeholder="..." />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : submitText}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Hủy</button>}
      </div>
    </form>
  )
}
