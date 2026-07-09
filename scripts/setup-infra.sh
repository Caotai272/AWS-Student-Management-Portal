#!/usr/bin/env bash
# scripts/setup-infra.sh
# Tạo toàn bộ hạ tầng phụ trợ cho Lambda:
#   - IAM role student-portal-lambda (cho Lambda truy cập DynamoDB/S3/SQS/SES)
#   - S3 bucket lưu tài liệu
#   - SQS queue thông báo (notifications)
#   - DynamoDB tables (gọi deploy-dynamodb.sh)
# Chạy: bash scripts/setup-infra.sh [region]
set -e

REGION="${1:-us-east-1}"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="student-portal-lambda"
ROLE_ARN="arn:aws:iam::$ACCOUNT:role/$ROLE_NAME"
UNIQUE="$(echo $ACCOUNT | tail -c 9)"
BUCKET="student-documents-${ACCOUNT}"
QUEUE_NAME="student-notifications"
FROM_EMAIL="${FROM_EMAIL:-noreply@example.com}"

echo "→ Region = $REGION | Account = $ACCOUNT"

# ===== IAM Role =====
if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "✓ Role $ROLE_NAME đã tồn tại"
else
  echo "→ Tạo IAM role $ROLE_NAME ..."
  aws iam create-role --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
fi

attach () {
  aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$1" 2>/dev/null \
    && echo "✓ Gắn $2" || echo "• $2 có thể đã gắn"
}
attach "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" "AWSLambdaBasicExecutionRole"
attach "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess" "AmazonDynamoDBFullAccess"
attach "arn:aws:iam::aws:policy/AmazonS3FullAccess" "AmazonS3FullAccess"
attach "arn:aws:iam::aws:policy/AmazonSQSFullAccess" "AmazonSQSFullAccess"
# Cho phép gửi email qua SES (chỉ verified identities trong sandbox)
aws iam attach-role-policy --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess 2>/dev/null \
  && echo "✓ Gắn AmazonSESFullAccess" || echo "• AmazonSESFullAccess có thể đã gắn"

# Chờ role propagate
echo "→ Chờ IAM role ổn định (10s) ..."
sleep 10

# ===== S3 Bucket =====
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "✓ Bucket $BUCKET đã tồn tại"
else
  echo "→ Tạo S3 bucket $BUCKET ..."
  if [ "$REGION" = "us-east-1" ]; then
    # us-east-1 KHÔNG chấp nhận LocationConstraint
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
  else
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
  fi
  aws s3api put-bucket-cors --bucket "$BUCKET" --region "$REGION" --cors-configuration '{
    "CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","HEAD"],"AllowedOrigins":["*"],"MaxAgeSeconds":3000}]
  }'
  echo "✓ Đã tạo $BUCKET"
fi

# ===== SQS Queue =====
QUEUE_URL=$(aws sqs get-queue-url --queue-name "$QUEUE_NAME" --region "$REGION" --query QueueUrl --output text 2>/dev/null || true)
if [ -z "$QUEUE_URL" ]; then
  echo "→ Tạo SQS queue $QUEUE_NAME ..."
  QUEUE_URL=$(aws sqs create-queue --queue-name "$QUEUE_NAME" --region "$REGION" --attributes VisibilityTimeout=300 --query QueueUrl --output text)
  echo "✓ Đã tạo $QUEUE_NAME"
else
  echo "✓ Queue $QUEUE_NAME đã tồn tại"
fi

# ===== DynamoDB =====
echo "→ Tạo DynamoDB tables ..."
bash "$(dirname "$0")/deploy-dynamodb.sh" "$REGION"

echo ""
echo "=== HOÀN TẤT SETUP INFRA ==="
echo "LAMBDA_ROLE_ARN=$ROLE_ARN"
echo "DOCUMENTS_BUCKET=$BUCKET"
echo "NOTIFICATION_QUEUE_URL=$QUEUE_URL"
echo "FROM_EMAIL=$FROM_EMAIL"
echo ""
echo "→ Tiếp theo deploy Lambda:"
echo "LAMBDA_ROLE_ARN=$ROLE_ARN \\"
echo "DOCUMENTS_BUCKET=$BUCKET \\"
echo "NOTIFICATION_QUEUE_URL=$QUEUE_URL \\"
echo "FROM_EMAIL=$FROM_EMAIL \\"
echo "bash scripts/deploy-lambdas.sh $REGION"
