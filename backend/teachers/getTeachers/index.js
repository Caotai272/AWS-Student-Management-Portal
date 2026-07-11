import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async () => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE.TEACHERS }))
    return success({ teachers: res.Items || [], count: res.Count || 0 })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Staff')(authHandler)

export const handler = authAndRoleHandler
