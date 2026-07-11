// common/dynamodb.js
// Khởi tạo DynamoDB DocumentClient dùng chung và tên bảng theo module.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(client)

export const TABLE = {
  STUDENTS: process.env.STUDENTS_TABLE || 'Students',
  DOCUMENTS: process.env.DOCUMENTS_TABLE || 'Documents',
  TEACHERS: process.env.TEACHERS_TABLE || 'Teachers',
  GRADES: process.env.GRADES_TABLE || 'Grades',
  MATERIALS: process.env.MATERIALS_TABLE || 'Materials',
  CLASSES: process.env.CLASSES_TABLE || 'Classes'
}

// Giữ lại export cũ để tương thích ngược với các Lambda students/documents.
export const TABLE_NAME = TABLE.STUDENTS
export { docClient }
export default docClient
