import { CognitoIdentityProviderClient, AdminEnableUserCommand, AdminDisableUserCommand, AdminListGroupsForUserCommand, AdminRemoveUserFromGroupCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
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

    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { role, enabled } = data

    // 1. Cập nhật trạng thái kích hoạt (enabled/disabled)
    if (enabled !== undefined) {
      if (enabled) {
        await cognitoClient.send(new AdminEnableUserCommand({ UserPoolId: userPoolId, Username: username }))
      } else {
        await cognitoClient.send(new AdminDisableUserCommand({ UserPoolId: userPoolId, Username: username }))
      }
    }

    // 2. Cập nhật nhóm quyền (role)
    if (role) {
      // Lấy danh sách nhóm hiện tại của người dùng
      const groupsRes = await cognitoClient.send(new AdminListGroupsForUserCommand({
        UserPoolId: userPoolId,
        Username: username
      }))
      
      const currentGroups = (groupsRes.Groups || []).map(g => g.GroupName)

      // Xóa người dùng khỏi các nhóm quyền cũ (Admin, Staff, Student, Teacher)
      const rolesToRemove = ['Admin', 'Staff', 'Student', 'Teacher', 'User'].filter(r => currentGroups.includes(r))
      for (const group of rolesToRemove) {
        try {
          await cognitoClient.send(new AdminRemoveUserFromGroupCommand({
            UserPoolId: userPoolId,
            Username: username,
            GroupName: group
          }))
        } catch (rmErr) {
          console.warn(`Không thể xóa user khỏi nhóm ${group}:`, rmErr.message)
        }
      }

      // Thêm người dùng vào nhóm quyền mới
      await cognitoClient.send(new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: username,
        GroupName: role
      }))
    }

    return success({ message: 'Cập nhật thông tin tài khoản thành công' })
  } catch (err) {
    console.error('Update user error:', err)
    return error(err.message || 'Lỗi máy chủ khi cập nhật tài khoản', 500)
  }
}

export const handler = requireRole('Admin')(withAuth(baseHandler))
