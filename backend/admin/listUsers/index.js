import { CognitoIdentityProviderClient, ListUsersCommand, AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async () => {
  try {
    if (!userPoolId) {
      return error('Thiếu cấu hình Cognito User Pool ID', 400)
    }

    const listRes = await cognitoClient.send(new ListUsersCommand({ UserPoolId: userPoolId }))
    const users = await Promise.all((listRes.Users || []).map(async (u) => {
      let groups = []
      try {
        const groupsRes = await cognitoClient.send(new AdminListGroupsForUserCommand({
          UserPoolId: userPoolId,
          Username: u.Username
        }))
        groups = (groupsRes.Groups || []).map(g => g.GroupName)
      } catch (grpErr) {
        console.warn(`Không thể lấy nhóm cho user ${u.Username}:`, grpErr.message)
      }

      const emailAttr = u.Attributes?.find(a => a.Name === 'email')?.Value || ''
      return {
        username: u.Username,
        email: emailAttr,
        status: u.UserStatus,
        enabled: u.Enabled,
        groups: groups,
        createdAt: u.UserCreateDate ? new Date(u.UserCreateDate).toISOString() : ''
      }
    }))

    return success({ users })
  } catch (err) {
    console.error('List users error:', err)
    return error(err.message || 'Lỗi máy chủ khi lấy danh sách tài khoản', 500)
  }
}

// Chỉ cho phép Admin truy cập
export const handler = requireRole('Admin')(withAuth(baseHandler))
