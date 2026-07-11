import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth, requireRole } from '../../common/authMiddleware.js'

const baseHandler = async () => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE.GRADES }))
    return success({ grades: res.Items || [], count: res.Count || čku })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

const authHandler = withAuth(baseHandler)
const authAndRoleHandler = requireRole('Teacher')(authHandler)

export const handler = authAndRoleHandler
