import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb'
import { success, error } from '../../common/response'
import { withAuth, requireRole } from '../../common/authMiddleware'

const handler = async (event) => {
  try {
    const id = event.pathParameters?.id
    if (!id) return error('Thiếu id', 400)
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    const fields = ['subject', 'semester', 'score', 'note']
    const updates = []
    const values = {}
    for (const f of fields) {
      if (data[f] !== undefined) {
        updates.push(`${f} = :${f}`)
        values[`:${f}`] = f === 'score' ? Number(data[f]) : data[f]
      }
    }
    if (updates.length === 0) return error('Không có trường nào để cập nhật', 400)

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE.GRADES,
      Key: { id },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW'
    }))
    return success({ message: 'Cập nhật điểm thành công', grade: res.Attributes })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}

// Áp dụng middleware auth và RBAC
const authHandler = withAuth(handler)
const authAndRoleHandler = requireRole('Teacher')(authHandler)

export const handler = authAndRoleHandler
