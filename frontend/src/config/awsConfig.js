// src/config/awsConfig.js
// Cấu hình AWS Amplify / Cognito cho frontend.
// Điền các giá trị từ User Pool và App Client của bạn khi triển khai.

import { Amplify } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_7SwNQ0qYm',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '6o5g3hcus9ehbmk90acqeuplau',
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      StudentApi: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://9k9i3ukwdh.execute-api.us-east-1.amazonaws.com/prod',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
      }
    }
  },
  // CORS configuration
  getCORSConfiguration: async function() {
    try {
      // Bạn có thể gọi API Gateway để lấy cấu hình CORS
      // Hoặc sử dụng cấu hình static
      return {
        allowHeaders: ['Authorization', 'Content-Type'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowOrigins: ['http://localhost:3001', 'http://localhost:3000', 'https://9k9i3ukwdh.execute-api.us-east-1.amazonaws.com/prod'],
        exposeHeaders: ['X-Amz-Date', 'Authorization', 'Content-Length'],
        maxAge: 600
      }
    } catch (error) {
      console.warn('Không thể tải CORS configuration, sử dụng mặc định:', error)
      return {
        allowHeaders: ['Authorization', 'Content-Type'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowOrigins: ['http://localhost:3001', 'http://localhost:3000', 'https://9k9i3ukwdh.execute-api.us-east-1.amazonaws.com/prod'],
        exposeHeaders: ['X-Amz-Date', 'Authorization', 'Content-Length'],
        maxAge: 600
      }
    }
  }
}

// Cấu hình AWS Amplify / Cognito cho frontend.
// Điền các giá trị từ User Pool và App Client của bạn khi triển khai.
Amplify.configure(amplifyConfig)

export { amplifyConfig }
export default amplifyConfig
