#!/bin/bash

# Create a Lambda execution role for AWS Student Management Portal

# Create the role
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

# Attach AWS managed policies for basic Lambda functionality
aws iam attach-role-policy \
  --role-name student-management-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
echo "✅ Attached basic Lambda execution policy"

# Attach DynamoDB permissions policy
aws iam attach-role-policy \
  --role-name student-management-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole
echo "✅ Attached DynamoDB execution policy"

# Attach SQS permissions for notifications
aws iam attach-role-policy \
  --role-name student-management-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSExecutionRole
echo "✅ Attached SQS execution policy"

# Create custom policy for SES (email service)
cat > ses-policy.json << POLICY_EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "ses:SendTemplatedEmail",
                "ses:SendEmail"
            ],
            "Resource": "*"
        }
    ]
}
POLICY_EOF

aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementSES \
  --policy-document file://ses-policy.json
echo "✅ Attached SES permissions policy"

# Create custom policy for S3 access
S3_POLICY=$(cat << S3_POLICY_EOF
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
                "arn:aws:s3:::student-documents-*",
                "arn:aws:s3:::student-documents-*/*"
            ]
        }
    ]
}
S3_POLICY_EOF
)

echo "$S3_POLICY" > s3-policy.json
aws iam put-role-policy \
  --role-name student-management-lambda-role \
  --policy-name StudentManagementS3 \
  --policy-document file://s3-policy.json
echo "✅ Attached S3 permissions policy"

# Display role details
echo "\n📋 Role Details:"
echo "Role ARN: $ROLE_ARN"

echo "\n🔑 To use this role with AWS CLI, run:"
echo "export AWS_ROLE_ARN=$ROLE_ARN"
echo "echo \"Enter session duration (300-3600):\""
read DURATION
echo "aws sts assume-role --role-arn $ROLE_ARN --role-session-name lambda-session --duration-seconds $DURATION"

# Clean up temporary files
rm -f ses-policy.json s3-policy.json

