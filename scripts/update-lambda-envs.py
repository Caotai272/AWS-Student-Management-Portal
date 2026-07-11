import subprocess
import json

functions = [
    "createStudent", "getStudents", "getStudentById", "updateStudent", "deleteStudent",
    "docUploadUrl", "docSaveMetadata", "getStudentDocuments",
    "createTeacher", "getTeachers", "getTeacherById", "updateTeacher", "deleteTeacher",
    "createGrade", "getGrades", "getGradeById", "updateGrade", "deleteGrade",
    "materials/createUploadUrl", "materials/saveMaterialMetadata", "materials/getMaterials"
]

# Wait, let's check functions list. In deploy-lambdas.sh, function names on AWS are:
# createStudent, getStudents, getStudentById, updateStudent, deleteStudent, docUploadUrl, docSaveMetadata,
# getStudentDocuments, createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher,
# createGrade, getGrades, getGradeById, updateGrade, deleteGrade,
# materialUploadUrl, materialSaveMetadata, getMaterials.
# Let's map them to actual deployed function names on AWS.
functions = [
    "createStudent", "getStudents", "getStudentById", "updateStudent", "deleteStudent",
    "docUploadUrl", "docSaveMetadata", "getStudentDocuments",
    "createTeacher", "getTeachers", "getTeacherById", "updateTeacher", "deleteTeacher",
    "createGrade", "getGrades", "getGradeById", "updateGrade", "deleteGrade",
    "materialUploadUrl", "materialSaveMetadata", "getMaterials"
]

cognito_pool_id = "us-east-1_7SwNQ0qYm"
cognito_client_id = "6o5g3hcus9ehbmk90acqeuplau"
region = "us-east-1"

for fn in functions:
    print(f"Updating configuration for {fn}...")
    try:
        # Get existing env vars
        cmd_get = ["aws", "lambda", "get-function-configuration", "--function-name", fn, "--region", region, "--output", "json"]
        res = subprocess.run(cmd_get, capture_output=True, text=True, check=True)
        config = json.loads(res.stdout)
        
        env_vars = config.get("Environment", {}).get("Variables", {})
        env_vars["COGNITO_USER_POOL_ID"] = cognito_pool_id
        env_vars["COGNITO_USER_POOL_CLIENT_ID"] = cognito_client_id
        
        # Format variables as KEY=VALUE inside braces
        env_pairs = [f"{k}={v}" for k, v in env_vars.items()]
        env_str = ",".join(env_pairs)
        env_param = f"Variables={{{env_str}}}"
        
        # Update function configuration
        cmd_update = [
            "aws", "lambda", "update-function-configuration",
            "--function-name", fn,
            "--region", region,
            "--environment", env_param
        ]
        res_update = subprocess.run(cmd_update, capture_output=True, text=True)
        if res_update.returncode == 0:
            print(f"[OK] Successfully updated {fn}")
        else:
            print(f"[ERROR] Failed to update {fn}: {res_update.stderr}")
    except Exception as e:
        print(f"[ERROR] Exception updating {fn}: {e}")
