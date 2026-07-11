// materials/getMaterials/index.js
import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { withAuth, requireRole } from '../../common/authMiddleware'

const handler = async () => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE.MATERIALS }))
    return success({ materials: res.Items || [], count: res.Count || 0 })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(handler)
const authAndRoleHandler = requireRole('Student')(authHandler)

export const handler = authAndRoleHandler
