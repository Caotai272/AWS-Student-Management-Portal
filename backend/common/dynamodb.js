// common/dynamodb.js
// Khởi tạo DynamoDB DocumentClient dùng chung.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-1' })
const docClient = DynamoDBDocumentClient.from(client)

export const TABLE_NAME = process.env.STUDENTS_TABLE || 'Students'
export { docClient }
export default docClient
