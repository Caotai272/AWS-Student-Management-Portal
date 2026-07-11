import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { email, role, password } = data
    if (!email || !role) {
      return error('Thiếu email hoặc role', 400)
    }
    if (!userPoolId) {
      return error('Thiếu cấu hình Cognito User Pool ID', 400)
    }

    const createParams = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' }
      ],
      DesiredDeliveryMediums: ['EMAIL']
    }
    if (password) {
      createParams.TemporaryPassword = password
    }

    const createRes = await cognitoClient.send(new AdminCreateUserCommand(createParams))

    // Gán nhóm quyền
    await cognitoClient.send(new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: role
    }))

    return success({ message: 'Tạo tài khoản thành công', user: createRes.User }, 201)
  } catch (err) {
    console.error('Create user error:', err)
    return error(err.message || 'Lỗi máy chủ khi tạo tài khoản', 500)
  }
}

// Chỉ cho phép Admin truy cập
export const handler = requireRole('Admin')(withAuth(baseHandler))
