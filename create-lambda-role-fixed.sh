#!/bin/bash

# Create a Lambda execution role for AWS Student Management Portal

# Create the role
echo "Creating Lambda execution role..."
aws iam create-role \
  --role-name student-management-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }' \
  --description "Lambda execution role for Student Management Portal"

# Get the role ARN
ROLE_ARN=$(aws iam get-role --role-name student-management-lambda-role --query 'Role.Arn' --output text)
echo "✅ Created Lambda role: $ROLE_ARN"

# Attach basic Lambda execution policy (creates log groups)
aws iam attach-role-policy \
  --role-name student-management-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
echo "✅ Attached basic Lambda execution policy"

# Create custom policy for S3 access (documents bucket)
cat > s3-policy.json << 'S3_POLICY_EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::*",
                "arn:aws:s3:::*/*"
            ]
        }
    ]
}
S3_POLICY_EOF

aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementS3 \
  --policy-document file://s3-policy.json
echo "✅ Attached S3 permissions policy"

# Create custom policy for DynamoDB access
DYNAMODB_POLICY=$(cat << 'DYNAMODB_POLICY_EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/Students",
                "arn:aws:dynamodb:*:*:table/Teachers",
                "arn:aws:dynamodb:*:*:table/Grades",
                "arn:aws:dynamodb:*:*:table/Materials",
                "arn:aws:dynamodb:*:*:table/Documents"
            ]
        }
    ]
}
DYNAMODB_POLICY_EOF
)

echo "$DYNAMODB_POLICY" > dynamodb-policy.json

aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementDynamoDB \
  --policy-document file://dynamodb-policy.json
echo "✅ Attached DynamoDB permissions policy"

# Create custom policy for SQS access
SQS_POLICY=$(cat << 'SQS_POLICY_EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sqs:SendMessage",
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage",
                "sqs:GetQueueAttributes"
            ],
            "Resource": "*"
        }
    ]
}
SQS_POLICY_EOF
)

echo "$SQS_POLICY" > sqs-policy.json

aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementSQS \
  --policy-document file://sqs-policy.json
echo "✅ Attached SQS permissions policy"

# Create custom policy for SES access
SES_POLICY=$(cat << 'SES_POLICY_EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "ses:SendTemplatedEmail"
            ],
            "Resource": "*"
        }
    ]
}
SES_POLICY_EOF
)

echo "$SES_POLICY" > ses-policy.json

aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementSES \
  --policy-document file://ses-policy.json
echo "✅ Attached SES permissions policy"

# Clean up temporary files
rm -f s3-policy.json dynamodb-policy.json sqs-policy.json ses-policy.json

echo "\n🎉 Role setup complete!"
echo "📋 Role ARN: $ROLE_ARN"
echo "\n🔑 To use this role, run:"
echo "aws sts assume-role --role-arn $ROLE_ARN --role-session-name lambda-session --duration-seconds 3600"
echo "\n💡 Then set temporary credentials:"
echo "export AWS_ACCESS_KEY_ID=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name lambda-session --duration-seconds 3600 --query 'Credentials.AccessKeyId' --output text)"
echo "export AWS_SECRET_ACCESS_KEY=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name lambda-session --duration-seconds 3600 --query 'Credentials.SecretAccessKey' --output text)"
echo "export AWS_SESSION_TOKEN=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name lambda-session --duration-seconds 3600 --query 'Credentials.SessionToken' --output text)"

echo "\n✅ Role created successfully with all required permissions!"
