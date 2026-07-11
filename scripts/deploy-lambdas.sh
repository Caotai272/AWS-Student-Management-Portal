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
  "documents/getStudentDocuments|getStudentDocuments|{DOCUMENTS_TABLE=Documents}"
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
  # Đóng gói từ backend root: bao gồm common/ (shared) + node_modules (dep)
  # và thư mục function, sao cho import '../../common' và '@aws-sdk/*' hoạt động
  # trong Lambda. Handler sẽ là <dir>/index.handler.
  local pkg="/tmp/pkg_$name"
  rm -rf "$pkg"; mkdir -p "$pkg/$dir"
  cp -r "backend/common" "$pkg/common"
  cp -r "backend/node_modules" "$pkg/node_modules"
  cp -r "backend/$dir/." "$pkg/$dir"
  # Copy package.json gốc vào root của gói để Lambda hiểu code là ESM
  # ("type":"module" trong backend/package.json). Thiếu file này Lambda báo
  # "Cannot use import statement outside a module".
  cp "backend/package.json" "$pkg/package.json"
  # Tự động chèn COGNITO_USER_POOL_ID và COGNITO_USER_POOL_CLIENT_ID vào env
  local env_trimmed="${env%\}}"
  local env_full="${env_trimmed},COGNITO_USER_POOL_ID=us-east-1_7SwNQ0qYm,COGNITO_USER_POOL_CLIENT_ID=6o5g3hcus9ehbmk90acqeuplau}"
  # Nén thành zip (dùng đường dẫn Windows tuyệt đối vì aws cli trên Windows
  # không đọc được /tmp kiểu POSIX). Dùng 7z nếu có, fallback python.
  local zipwin
  zipwin="$(cygpath -w "$TEMP" 2>/dev/null)/$name.zip"
  [ -z "$zipwin" ] && zipwin="$TEMP\\$name.zip"
  rm -f "$zipwin"
  if [ -f "/c/Program Files/7-Zip/7z.exe" ]; then
    ( cd "$pkg" && "/c/Program Files/7-Zip/7z.exe" a -tzip -r "$zipwin" . >/dev/null )
  else
    python -c "import shutil; shutil.make_archive('$TEMP/$name','zip','$pkg')"
    zipwin="$TEMP\\$name.zip"
  fi
  # update-function-configuration KHÔNG set AWS_REGION (reserved key).
  # Do Lambda có giới hạn 1 update đồng thời, thêm retry/backoff nhẹ.
  deploy_cfg () {
    local fn=$1 tries=0
    until aws lambda update-function-configuration --function-name "$fn" \
        --environment "Variables=$env_full" --region "$REGION" >/dev/null 2>&1; do
      tries=$((tries+1)); [ $tries -ge 5 ] && { echo "  ! skip cfg $fn"; return 1; }
      sleep 5
    done
  }
  if aws lambda get-function --function-name "$name" --region "$REGION" >/dev/null 2>&1; then
    aws lambda update-function-code --function-name "$name" --zip-file "fileb://$zipwin" --region "$REGION" >/dev/null
    deploy_cfg "$name"
  else
    aws lambda create-function --function-name "$name" --runtime "$RUNTIME" --handler "${dir}/index.handler" \
      --role "$ROLE" --zip-file "fileb://$zipwin" --environment "Variables=$env_full" --region "$REGION" >/dev/null
  fi
  echo "✓ $name"
}

for entry in "${FUNCS[@]}"; do
  IFS='|' read -r dir name env <<< "$entry"
  deploy_one "$dir" "$name" "$env"
done

echo ""
echo "Hoàn tất deploy $((${#FUNCS[@]})) Lambda functions."
