// src/components/StatusBadge.jsx
const STATUS_MAP = {
  Active: { cls: 'badge-success', label: 'Đang học' },
  Inactive: { cls: 'badge-muted', label: 'Tạm ngưng' },
  Graduated: { cls: 'badge-info', label: 'Đã tốt nghiệp' },
  Warning: { cls: 'badge-warning', label: 'Cần bổ sung hồ sơ' },
  Deleted: { cls: 'badge-danger', label: 'Đã xóa' }
}

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { cls: 'badge-muted', label: status || '—' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}
