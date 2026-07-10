// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const idToken = localStorage.getItem('idToken')

  // Kiểm tra cả idToken và accessToken để đảm bảo session hợp lệ
  if (!idToken || !localStorage.getItem('accessToken')) {
    console.log('🔒 Không tìm thấy token, chuyển hướng đến đăng nhập')
    return <Navigate to="/login" replace />
  }

  // Optional: Kiểm tra idToken có hợp lệ không (basic format)
  try {
    const tokenParts = idToken.split('.')
    if (tokenParts.length !== 3) {
      console.warn('⚠️ Token có định dạng không hợp lệ, chuyển hướng đến đăng nhập')
      localStorage.removeItem('idToken')
      localStorage.removeItem('accessToken')
      return <Navigate to="/login" replace />
    }
  } catch (e) {
    console.warn('⚠️ Lỗi khi kiểm tra token, chuyển hướng đến đăng nhập')
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    return <Navigate to="/login" replace />
  }

  console.log('✅ Token hợp lệ, cho phép truy cập')
  return children
}
