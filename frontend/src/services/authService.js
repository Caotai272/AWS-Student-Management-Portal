// src/services/authService.js
// Các hàm xác thực với Cognito thông qua AWS Amplify.
import { signIn, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'

export const login = async (username, password) => {
  const user = await signIn({ username, password })
  return user
}

export const logout = async () => {
  await signOut()
  localStorage.removeItem('idToken')
  localStorage.removeItem('accessToken')
}

export const getSessionTokens = async () => {
  // Lưu token từ session hiện tại để gọi API Gateway.
  const session = await getCurrentUser()
  const tokens = session.tokens
  if (tokens) {
    localStorage.setItem('idToken', tokens.idToken.toString())
    localStorage.setItem('accessToken', tokens.accessToken.toString())
  }
  return session
}

export const getCurrentUserAttributes = async () => {
  return await fetchUserAttributes()
}

export default { login, logout, getSessionTokens, getCurrentUserAttributes }
