import { CognitoIdentityProviderClient, AdminEnableUserCommand, AdminDisableUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async (event) => {
  try {
    // Trích xuất username từ tham số đường dẫn
    const username = event.pathParameters?.username
    if (!username) {
      return error('Thiếu tham số username', 400)
    }
    if (!userPoolId) {
      return error('Thiếu cấu hình Cognito User Pool ID', 400)
    }

    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { enabled } = data

    if (enabled) {
      await cognitoClient.send(new AdminEnableUserCommand({
        UserPoolId: userPoolId,
        Username: username
      }))
    } else {
      await cognitoClient.send(new AdminDisableUserCommand({
        UserPoolId: userPoolId,
        Username: username
      }))
    }

    return success({ message: `Đã ${enabled ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản thành công` })
  } catch (err) {
    console.error('Toggle user error:', err)
    return error(err.message || 'Lỗi máy chủ khi thay đổi trạng thái tài khoản', 500)
  }
}

// Chỉ cho phép Admin truy cập
export const handler = requireRole('Admin')(withAuth(baseHandler))
