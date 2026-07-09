# Dọn dẹp tài nguyên (Cleanup)

Để tránh phát sinh chi phí, xóa toàn bộ tài nguyên sau khi báo cáo/học tập xong.

## 1. Xóa các hàm Lambda
```bash
for fn in createStudent getStudents getStudentById updateStudent deleteStudent createUploadUrl saveDocumentMetadata sendEmailWorker; do
  aws lambda delete-function --function-name $fn
done
```

## 2. Xóa API Gateway
```bash
aws apigateway delete-rest-api --rest-api-id <API_ID>
```

## 3. Xóa Cognito User Pool
```bash
aws cognito-idp delete-user-pool --user-pool-id <USER_POOL_ID>
```

## 4. Xóa SQS
```bash
aws sqs delete-queue --queue-url <QUEUE_URL>
```

## 5. Xóa DynamoDB
```bash
aws dynamodb delete-table --table-name Students
aws dynamodb delete-table --table-name Documents
```

## 6. Xóa S3
```bash
aws s3 rm s3://student-documents-<yourname> --recursive
aws s3 rb s3://student-documents-<yourname>
# Frontend bucket tương tự
aws s3 rb s3://<frontend-bucket>
```

## 7. Xóa CloudFront
- Disable distribution trước, chờ triển khai xong (~15–20 phút), sau đó delete.

## 8. Xóa IAM role/policy (nếu tạo riêng)
```bash
aws iam delete-role --role-name <LAMBDA_EXECUTION_ROLE>
```

## 9. Kiểm tra chi phí
Vào **Billing Dashboard** → Cost Explorer để xác nhận không còn tài nguyên chạy.
