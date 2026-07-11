import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { withAuth, requireRole } from '../../common/authMiddleware'

const handler = async (event) => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE.GRADES }))
    let items = res.Items || []
    const teacherId = event.queryStringParameters?.teacherId
    if (teacherId) items = items.filter((g) => g.teacherId === teacherId)
    const studentId = event.queryStringParameters?.studentId
    if (studentId) items = items.filter((g) => g.studentId === studentId)
    return success({ grades: items, count: items.length })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(handler)
const authAndRoleHandler = requireRole('Teacher')(authHandler)

export const handler = authAndRoleHandler
