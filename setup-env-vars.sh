#!/bin/bash

# Setup environment variables for Lambda functions

# Set up environment variables for Lambda deployment
export REGION="ap-southeast-1"
export STUDENTS_TABLE="Students"
export TEACHERS_TABLE="Teachers"
export GRADES_TABLE="Grades"
export MATERIALS_TABLE="Materials"
export DOCUMENTS_TABLE="Documents"

# S3 bucket for document storage (you'd typically create this first)
export DOCUMENTS_BUCKET="student-documents-$(aws sts get-caller-identity --query Account --output text)"

# SQS queue for notifications
export NOTIFICATION_QUEUE_URL=$(aws sqs create-queue --queue-name student-notifications --region $REGION --output json | jq -r '.QueueUrl')

# Email sender address
export FROM_EMAIL="noreply@example.com"

# Output the environment variables
echo "🎉 Environment Variables Setup Complete!"
echo "======================================================"
echo "AWS Region: $REGION"
echo "Students Table: $STUDENTS_TABLE"
echo "Teachers Table: $TEACHERS_TABLE"
export GRADES_TABLE="Grades"
export MATERIALS_TABLE="Materials"
export DOCUMENTS_TABLE="Documents"

# S3 bucket for document storage (you'd typically create this first)
export DOCUMENTS_BUCKET="student-documents-$(aws sts get-caller-identity --query Account --output text)"

# SQS queue for notifications
export NOTIFICATION_QUEUE_URL=$(aws sqs create-queue --queue-name student-notifications --region $REGION --output json | jq -r '.QueueUrl')

# Email sender address
export FROM_EMAIL="noreply@example.com"

# Output the environment variables
echo "🎉 Environment Variables Setup Complete!"
echo "======================================================"
echo "AWS Region: $REGION"
echo "Students Table: $STUDENTS_TABLE"
echo "Teachers Table: $TEACHERS_TABLE"
echo "Grades Table: $GRADES_TABLE"
echo "Materials Table: $MATERIALS_TABLE"
echo "Documents Table: $DOCUMENTS_TABLE"
echo "Documents Bucket: $DOCUMENTS_BUCKET"
echo "Notification Queue: $NOTIFICATION_QUEUE_URL"
echo "From Email: $FROM_EMAIL"

echo "\n📋 Commands to use these environment variables:"
echo "export REGION=\"$REGION\""
echo "export STUDENTS_TABLE=\"$STUDENTS_TABLE\""
echo "export TEACHERS_TABLE=\"$TEACHERS_TABLE\""
echo "export GRADES_TABLE=\"$GRADES_TABLE\""
echo "export MATERIALS_TABLE=\"$MATERIALS_TABLE\""
echo "export DOCUMENTS_TABLE=\"$DOCUMENTS_TABLE\""
echo "export DOCUMENTS_BUCKET=\"$DOCUMENTS_BUCKET\""
echo "export NOTIFICATION_QUEUE_URL=\"$NOTIFICATION_QUEUE_URL\""
echo "export FROM_EMAIL=\"$FROM_EMAIL\""

echo "\n💡 To use these variables in the deploy script, run:"
echo "bash scripts/deploy-lambdas.sh"
