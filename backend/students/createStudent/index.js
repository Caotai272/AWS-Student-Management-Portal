import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { validateStudent } from '../../common/validators.js'
import { sendMessage } from '../../common/sqs.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' })
const userPoolId = process.env.COGNITO_USER_POOL_ID || ''

const baseHandler = async (event) => {
  try {
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const errors = validateStudent(data)
    if (errors.length > 0) return error(errors.join('; '), 400)

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
        
        console.log(`Gán nhóm quyền Student cho ${data.email}...`)
        await cognitoClient.send(new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: data.email,
          GroupName: 'Student'
        }))
      } catch (cogErr) {
        console.warn('⚠️ Lỗi khi tạo tài khoản Cognito:', cogErr.message)
        if (cogErr.name !== 'UsernameExistsException') {
          throw cogErr
        }
      }
    }

    const item = {
      id: data.studentId,
      studentId: data.studentId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      gender: data.gender || '',
      dateOfBirth: data.dateOfBirth || '',
      major: data.major || '',
      className: data.className || '',
      status: data.status || 'Active',
      gpa: data.gpa !== undefined ? Number(data.gpa) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }))

    // Gửi thông báo (SQS) để worker gửi email chào mừng qua SES.
    await sendMessage({ type: 'STUDENT_CREATED', student: item })

    return success({ message: 'Tạo sinh viên thành công', student: item }, 201)
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Staff')(authHandler)

export const handler = authAndRoleHandler
