import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async (event) => {
  try {
    const username = event.pathParameters?.username
    if (!username) {
      return error('Thiếu tham số username', 400)
    }
    if (!userPoolId) {
      return error('Thiếu cấu hình Cognito User Pool ID', 400)
    }

    await cognitoClient.send(new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username
    }))

    return success({ message: 'Xóa tài khoản thành công' })
  } catch (err) {
    console.error('Delete user error:', err)
    return error(err.message || 'Lỗi máy chủ khi xóa tài khoản', 500)
  }
}

// Chỉ cho phép Admin truy cập
export const handler = requireRole('Admin')(withAuth(baseHandler))
