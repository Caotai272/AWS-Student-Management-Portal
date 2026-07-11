// src/services/authService.js
// Các hàm xác thực với Cognito thông qua AWS Amplify.
import { signIn, signOut, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'

export const login = async (username, password) => {
  try {
    // Fix Cognito authentication - Cognito v6 expects username to be email for loginWith.email: true
    const user = await signIn({ username, password })
    return user
  } catch (error) {
    // Xử lý trường hợp UserAlreadyAuthenticatedException
    if (error.name === 'UserAlreadyAuthenticatedException') {
      // Người dùng đã đăng nhập, lấy session hiện tại
      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()
      const accessToken = session.tokens?.accessToken?.toString()
      if (idToken) {
        localStorage.setItem('idToken', idToken)
        localStorage.setItem('accessToken', accessToken)
      }
      return { isAlreadyAuthenticated: true, message: 'Người dùng đã đăng nhập' }
    }
    // Cung cấp error message rõ ràng hơn cho việc xác thực Cognito thất bại
    if (error.message.includes('Invalid credentials') || error.message.includes('Authentication failure')) {
      throw new Error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.')
    }
    throw error
  }
}

export const clearSession = () => {
  localStorage.removeItem('idToken')
  localStorage.removeItem('accessToken')
}

export const logout = async () => {
  await signOut()
  clearSession()
}

export const getSessionTokens = async () => {
  // Lưu token từ session hiện tại để gọi API Gateway.
  // Amplify v6: dùng fetchAuthSession() để lấy tokens (getCurrentUser
  // chỉ trả về {username, userId, signInDetails}, KHÔNG có tokens).
  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()
  const accessToken = session.tokens?.accessToken?.toString()
  if (idToken) {
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('accessToken', accessToken)
  }
  return session
}

export const getCurrentUserAttributes = async () => {
  return await fetchUserAttributes()
}

export default { login, logout, getSessionTokens, getCurrentUserAttributes }
