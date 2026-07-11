import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE } from '../../common/dynamodb.js'
import { success, error } from '../../common/response.js'
import { withAuth } from '../../common/authMiddleware.js'

const baseHandler = async () => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE.CLASSES }))
    return success({ classes: res.Items || [], count: res.Count || 0 })
  } catch (err) {
    console.error('Get classes error:', err)
    return error(err.message || 'Lỗi máy chủ khi lấy danh sách lớp học', 500)
  }
}

export const handler = withAuth(baseHandler)
