// backend/scripts/create-lambda-role-fixed.sh
#!/bin/bash
# Script tạo Lambda IAM execution roles cho AWS Student Management Portal
# Cấu hình roles theo README requirements cho từng Lambda service

set -e

echo "🔍 Bắt đầu tạo Lambda IAM roles..."

# Cấu hình
region="us-east-1"
account_id=$(aws sts get-caller-identity --query Account --output text)
role_prefix="arn:aws:iam::${account_id}:role"

echo "👤 Tạo Lambda execution role..."

# Tạo role cho Student Service (CRUD)
cat << EOF > student-service-role-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${region}:${account_id}:log-group:/aws/lambda/student-service:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      "Resource": "${role_prefix}:_students"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": "${role_prefix}:student-notifications"
    }
  ]
}
EOF

# Tạo role cho Document Service
cat << EOF > document-service-role-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${region}:${account_id}:log-group:/aws/lambda/document-service:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::student-management-documents"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": "${role_prefix}:student-documents"
    }
  ]
}
EOF

# Tạo role cho Notification Worker Service
cat << EOF > notification-worker-role-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${region}:${account_id}:log-group:/aws/lambda/notification-worker:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "${role_prefix}:student-notifications"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
EOF

echo "📋 Kiểm tra các file policy..."
ls -la *.json

echo "🏗️  Tạo các Lambda IAM roles..."

# Tạo Student Service role
aws iam create-role \
  --role-name student-service-role \
  --assume-role-policy-document '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}' \
  --description "Lambda execution role cho Student Service (CRUD)"

echo "✅ Created student-service-role"

# Tạo Document Service role
aws iam create-role \
  --role-name document-service-role \
  --assume-role-policy-document '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}' \
  --description "Lambda execution role cho Document Service"

echo "✅ Created document-service-role"

# Tạo Notification Worker role
aws iam create-role \
  --role-name notification-worker-role \
  --assume-role-policy-document '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}' \
  --description "Lambda execution role cho Notification Worker"

echo "✅ Created notification-worker-role"

echo "🔗 Đính kèm policies...

# Đính kèm policies
aws iam put-role-policy \
  --role-name student-service-role \
  --policy-name student-service-policy \
  --policy file://student-service-role-policy.json

echo "✅ Attached student-service-policy"

aws iam put-role-policy \
  --role-name document-service-role \
  --policy-name document-service-policy \
  --policy file://document-service-role-policy.json

echo "✅ Attached document-service-policy"

aws iam put-role-policy \
  --role-name notification-worker-role \
  --policy-name notification-worker-policy \
  --policy file://notification-worker-role-policy.json

echo "✅ Attached notification-worker-policy"

echo "✨ Hoàn tất tạo các Lambda IAM roles!"
echo ""
echo "📊 Các role đã tạo:"
echo "  - student-service-role (ARN: ${role_prefix}:student-service-role)"
echo "  - document-service-role (ARN: ${role_prefix}:document-service-role)"
echo "  - notification-worker-role (ARN: ${role_prefix}:notification-worker-role)"
echo ""
echo "🎯 Dịch vụ & Permissions:"
echo ""
echo "Student Service:"
echo "  - DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Scan"
echo "  - SQS: SendMessage"
echo "  - CloudWatch: CreateLogGroup, CreateLogStream, PutLogEvents"
echo ""
echo "Document Service:"
echo "  - S3: PutObject, GetObject"
echo "  - DynamoDB: PutItem, GetItem, Query"
echo "  - CloudWatch: CreateLogGroup, CreateLogStream, PutLogEvents"
echo ""
echo "Notification Worker:"
echo "  - SQS: ReceiveMessage, DeleteMessage, GetQueueAttributes"
echo "  - SES: SendEmail, SendRawEmail"
echo "  - CloudWatch: CreateLogGroup, CreateLogStream, PutLogEvents"

echo ""
echo "💾 Các file policy đã lưu ở:"
echo "  - student-service-role-policy.json"
echo "  - document-service-role-policy.json"
echo "  - notification-worker-role-policy.json"
echo ""
echo "📝 Dọn dẹp các file policy tạm thời..."
rm -f *.json

echo "🎉 Tạo Lambda IAM roles thành công!"
echo ""
echo "Các role này sẵn sàng để gán cho các Lambda functions trong deployment scripts."