// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const idToken = localStorage.getItem('idToken')
  if (!idToken) {
    return <Navigate to="/login" replace />
  }
  return children
}
