#!/usr/bin/env bash
# scripts/deploy-only-get-docs.sh
# Deploy ONLY the getStudentDocuments Lambda function to save time.
set -e

REGION="us-east-1"
RUNTIME="nodejs18.x"
ROLE="arn:aws:iam::147997148454:role/student-portal-lambda"
dir="documents/getStudentDocuments"
name="getStudentDocuments"
env_full="{DOCUMENTS_TABLE=Documents,COGNITO_USER_POOL_ID=us-east-1_7SwNQ0qYm,COGNITO_USER_POOL_CLIENT_ID=6o5g3hcus9ehbmk90acqeuplau}"

echo "→ Deploying $name only..."
pkg="/tmp/pkg_$name"
rm -rf "$pkg"; mkdir -p "$pkg/$dir"
cp -r "backend/common" "$pkg/common"
cp -r "backend/node_modules" "$pkg/node_modules"
cp -r "backend/$dir/." "$pkg/$dir"
cp "backend/package.json" "$pkg/package.json"

zipwin="$(cygpath -w "$TEMP" 2>/dev/null)/$name.zip"
[ -z "$zipwin" ] && zipwin="$TEMP\\$name.zip"
rm -f "$zipwin"

if [ -f "/c/Program Files/7-Zip/7z.exe" ]; then
  ( cd "$pkg" && "/c/Program Files/7-Zip/7z.exe" a -tzip -r "$zipwin" . >/dev/null )
else
  python -c "import shutil; shutil.make_archive('$TEMP/$name','zip','$pkg')"
  zipwin="$TEMP\\$name.zip"
fi

if aws lambda get-function --function-name "$name" --region "$REGION" >/dev/null 2>&1; then
  echo "Updating existing function $name..."
  aws lambda update-function-code --function-name "$name" --zip-file "fileb://$zipwin" --region "$REGION" >/dev/null
  sleep 2
  aws lambda update-function-configuration --function-name "$name" --environment "Variables=$env_full" --region "$REGION" >/dev/null
else
  echo "Creating new function $name..."
  aws lambda create-function --function-name "$name" --runtime "$RUNTIME" --handler "${dir}/index.handler" \
    --role "$ROLE" --zip-file "fileb://$zipwin" --environment "Variables=$env_full" --region "$REGION" >/dev/null
fi
echo "✓ Done!"
