// src/config/awsConfig.js
// Cấu hình AWS Amplify / Cognito cho frontend.
// Điền các giá trị từ User Pool và App Client của bạn khi triển khai.
export const awsConfig = {
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
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://your-api-id.execute-api.ap-southeast-1.amazonaws.com/prod'
      }
    }
  }
}

export default awsConfig
