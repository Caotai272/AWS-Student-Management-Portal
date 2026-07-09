// src/config/awsConfig.js
// Cấu hình AWS Amplify / Cognito cho frontend.
// Điền các giá trị từ User Pool và App Client của bạn khi triển khai.
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'YOUR_USER_POOL_ID',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'YOUR_APP_CLIENT_ID',
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      StudentApi: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://your-api-id.execute-api.ap-southeast-1.amazonaws.com/prod'
      }
    }
  }
}

export default awsConfig
