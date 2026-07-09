#!/usr/bin/env bash
# scripts/deploy-lambdas.sh
# Đóng gói & deploy tất cả Lambda Node.js vào AWS.
# Yêu cầu: AWS CLI đã cấu hình, biến môi trường bên dưới được set trước khi chạn.
#
# Cách dùng:
#   DOCUMENTS_BUCKET=student-documents-xxx \
#   NOTIFICATION_QUEUE_URL=https://sqs.ap-southeast-1.amazonaws.com/xxx/student-notifications \
#   FROM_EMAIL=noreply@example.com \
#   LAMBDA_ROLE_ARN=arn:aws:iam::xxx:role/student-portal-lambda \
#   bash scripts/deploy-lambdas.sh [region]
set -e

REGION="${1:-ap-southeast-1}"
RUNTIME="nodejs18.x"
ROLE="${LAMBDA_ROLE_ARN:?Thiếu biến LAMBDA_ROLE_ARN}"
BUCKET="${DOCUMENTS_BUCKET:?Thiếu biến DOCUMENTS_BUCKET}"
QUEUE="${NOTIFICATION_QUEUE_URL:?Thiếu biến NOTIFICATION_QUEUE_URL}"
EMAIL="${FROM_EMAIL:-noreply@example.com}"

# Danh sách function: <thư mục>|<tên function>|<env JSON>
FUNCS=(
  "students/createStudent|createStudent|{STUDENTS_TABLE=Students,DOCUMENTS_BUCKET=$BUCKET,NOTIFICATION_QUEUE_URL=$QUEUE,FROM_EMAIL=$EMAIL}"
  "students/getStudents|getStudents|{STUDENTS_TABLE=Students}"
  "students/getStudentById|getStudentById|{STUDENTS_TABLE=Students}"
  "students/updateStudent|updateStudent|{STUDENTS_TABLE=Students}"
  "students/deleteStudent|deleteStudent|{STUDENTS_TABLE=Students}"
  "documents/createUploadUrl|docUploadUrl|{DOCUMENTS_BUCKET=$BUCKET}"
  "documents/saveDocumentMetadata|docSaveMetadata|{DOCUMENTS_TABLE=Documents,NOTIFICATION_QUEUE_URL=$QUEUE,FROM_EMAIL=$EMAIL}"
  "teachers/createTeacher|createTeacher|{TEACHERS_TABLE=Teachers,NOTIFICATION_QUEUE_URL=$QUEUE,FROM_EMAIL=$EMAIL}"
  "teachers/getTeachers|getTeachers|{TEACHERS_TABLE=Teachers}"
  "teachers/getTeacherById|getTeacherById|{TEACHERS_TABLE=Teachers}"
  "teachers/updateTeacher|updateTeacher|{TEACHERS_TABLE=Teachers}"
  "teachers/deleteTeacher|deleteTeacher|{TEACHERS_TABLE=Teachers}"
  "grades/createGrade|createGrade|{GRADES_TABLE=Grades,NOTIFICATION_QUEUE_URL=$QUEUE,FROM_EMAIL=$EMAIL}"
  "grades/getGrades|getGrades|{GRADES_TABLE=Grades}"
  "grades/getGradeById|getGradeById|{GRADES_TABLE=Grades}"
  "grades/updateGrade|updateGrade|{GRADES_TABLE=Grades}"
  "grades/deleteGrade|deleteGrade|{GRADES_TABLE=Grades}"
  "materials/createUploadUrl|materialUploadUrl|{DOCUMENTS_BUCKET=$BUCKET}"
  "materials/saveMaterialMetadata|materialSaveMetadata|{MATERIALS_TABLE=Materials,NOTIFICATION_QUEUE_URL=$QUEUE,FROM_EMAIL=$EMAIL}"
  "materials/getMaterials|getMaterials|{MATERIALS_TABLE=Materials}"
  "notifications/sendEmailWorker|sendEmailWorker|{FROM_EMAIL=$EMAIL,NOTIFICATION_QUEUE_URL=$QUEUE}"
)

deploy_one () {
  local dir=$1 name=$2 env=$3
  echo "→ Deploy $name ..."
  ( cd "backend/$dir" && npm install --omit=dev >/dev/null 2>&1 && zip -r -q /tmp/$name.zip . )
  if aws lambda get-function --function-name "$name" --region "$REGION" >/dev/null 2>&1; then
    aws lambda update-function-code --function-name "$name" --zip-file fileb:///tmp/$name.zip --region "$REGION" >/dev/null
    aws lambda update-function-configuration --function-name "$name" --environment "Variables=$env" --region "$REGION" >/dev/null
  else
    aws lambda create-function --function-name "$name" --runtime "$RUNTIME" --handler index.handler \
      --role "$ROLE" --zip-file fileb:///tmp/$name.zip --environment "Variables=$env" --region "$REGION" >/dev/null
  fi
  echo "✓ $name"
}

for entry in "${FUNCS[@]}"; do
  IFS='|' read -r dir name env <<< "$entry"
  deploy_one "$dir" "$name" "$env"
done

echo ""
echo "Hoàn tất deploy $((${#FUNCS[@]})) Lambda functions."
