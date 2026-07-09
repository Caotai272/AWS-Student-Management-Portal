// common/s3.js
import { S3Client } from '@aws-sdk/client-s3'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const BUCKET = process.env.DOCUMENTS_BUCKET || 'student-documents'

export const getUploadSignedUrl = (key, contentType, expiresIn = 300) =>
  getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }), { expiresIn })

export const getDownloadSignedUrl = (key, expiresIn = 3600) =>
  getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn })

export const BUCKET_NAME = BUCKET
export default s3
