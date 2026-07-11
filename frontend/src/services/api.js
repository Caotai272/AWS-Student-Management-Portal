// src/services/api.js
// Cấu hình axios instance chung cho toàn bộ ứng dụng.
import axios from 'axios'
import awsConfig from '../config/awsConfig'

const api = axios.create({
  baseURL: awsConfig.API.REST.StudentApi.endpoint
})

// Tự động đính kèm Authorization header (Cognito idToken) vào mỗi request.
api.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem('idToken')
    if (token) {
      config.headers.Authorization = token
    }
  } catch (e) {
    // bỏ qua nếu không lấy được token
  }
  return config
})

// Xử lý lỗi 401 -> chuyển về trang login.
api.interceptors.response.use(
  (response) => {
    // Tự động giải nén response wrapper (success: true, data: ...) từ Lambda
    if (response.data && response.data.success === true && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('idToken')
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
