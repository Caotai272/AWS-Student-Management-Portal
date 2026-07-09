// students/getStudents/index.js
import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient, TABLE_NAME } from '../../common/dynamodb'
import { success, error } from '../../common/response'

export const handler = async () => {
  try {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }))
    return success({ students: res.Items || [], count: res.Count || 0 })
  } catch (err) {
    console.error(err)
    return error(err.message || 'Lỗi máy chủ', 500)
  }
}
