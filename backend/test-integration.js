import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const region = "us-east-1";
const clientId = "6o5g3hcus9ehbmk90acqeuplau";
const apiEndpoint = "https://9k9i3ukwdh.execute-api.us-east-1.amazonaws.com/prod";

console.log("🔒 Đang đăng nhập vào AWS Cognito với tài khoản admin@example.com...");

async function getJwtToken() {
  const client = new CognitoIdentityProviderClient({ region });
  try {
    const response = await client.send(new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: "admin@example.com",
        PASSWORD: "Abc12345!"
      }
    }));
    return response.AuthenticationResult.IdToken;
  } catch (err) {
    console.error("❌ Lỗi đăng nhập Cognito:", err.message);
    throw err;
  }
}

async function testEndpoint(name, path, token) {
  console.log(`📡 Đang gọi API: [GET] ${path}...`);
  try {
    const res = await fetch(`${apiEndpoint}${path}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (res.ok) {
      console.log(`🟢 [${name}] THÀNH CÔNG (Status ${res.status})`);
      if (Array.isArray(data)) {
        console.log(`   └─ Trả về danh sách: ${data.length} bản ghi.`);
      } else if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        console.log(`   └─ Trả về đối tượng: { ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? '...' : ''} }`);
        if (data.users) console.log(`   └─ Số lượng User Cognito: ${data.users.length}`);
        if (data.logs) console.log(`   └─ Số lượng dòng logs: ${data.logs.length}`);
      } else {
        console.log(`   └─ Phản hồi: ${String(text).substring(0, 100)}`);
      }
    } else {
      console.error(`🔴 [${name}] THẤT BẠI (Status ${res.status}):`, data);
    }
  } catch (err) {
    console.error(`🔴 [${name}] LỖI KẾT NỐI:`, err.message);
  }
}

async function run() {
  const token = await getJwtToken();
  if (!token) {
    console.error("❌ Không lấy được JWT Token");
    return;
  }
  console.log("🔑 Đăng nhập thành công! Đã lấy được ID Token.");
  console.log("==================================================================");

  // Test các chức năng nghiệp vụ (Lớp học, Sinh viên, Giáo viên, Điểm, Tài liệu)
  await testEndpoint("API Lớp học (Classes)", "/classes", token);
  await testEndpoint("API Sinh viên (Students)", "/students", token);
  await testEndpoint("API Giáo viên (Teachers)", "/teachers", token);
  await testEndpoint("API Điểm số (Grades)", "/grades", token);
  await testEndpoint("API Tài liệu (Materials)", "/materials", token);

  // Test các chức năng Admin (Quản trị Cognito Users và Logs hệ thống)
  await testEndpoint("API Admin Cognito Users", "/admin/users", token);
  await testEndpoint("API Admin CloudWatch Logs", "/admin/logs", token);
  
  console.log("==================================================================");
  console.log("🎉 Hoàn tất kiểm tra liên kết hệ thống!");
}

run().catch(console.error);
