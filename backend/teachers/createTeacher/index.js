import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { validateTeacher } from '../../common/validators.js'
import { sendMessage } from '../../common/sqs.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errs = validateTeacher(data)
    if (errs.length > 0) return error(errs.join('; '), 400)

    // Tạo tài khoản Amazon Cognito nếu có UserPoolId
    if (userPoolId) {
      try {
        console.log(`Tạo tài khoản Cognito cho ${data.email}...`)
        await cognitoClient.send(new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: data.email,
          UserAttributes: [
            { Name: 'email', Value: data.email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'name', Value: data.fullName }
          ],
          DesiredDeliveryMediums: ['EMAIL']
        }))
        
        console.log(`Gán nhóm quyền Staff (Teacher) cho ${data.email}...`)
        await cognitoClient.send(new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: data.email,
          GroupName: 'Staff'
        }))
      } catch (cogErr) {
        console.warn('⚠️ Lỗi khi tạo tài khoản Cognito:', cogErr.message)
        if (cogErr.name !== 'UsernameExistsException') {
          throw cogErr
        }
      }
    }

    const item = {
      id: data.teacherId,
      teacherId: data.teacherId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      department: data.department,
      degree: data.degree || '',
      subject: data.subject || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE.TEACHERS, Item: item }))
    await sendMessage({ type: 'TEACHER_CREATED', teacher: item })

    return success({ message: 'Tạo giáo viên thành công', teacher: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Admin')(authHandler)  // Teachers require Admin role

export const handler = authAndRoleHandler