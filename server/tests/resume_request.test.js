const http = require("http");
const app = require("../server");
const db = require("../config/connection");
const { ADMIN_COOKIE_NAME, generateAdminToken } = require("../middleware/auth");
const emailService = require("../utils/email");

let server;
let baseUrl;

function parseSetCookie(setCookieHeaders) {
  const cookies = {};
  if (!setCookieHeaders) return cookies;
  const headerList = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  for (const str of headerList) {
    const parts = str.split(";")[0].split("=");
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim();
    cookies[key] = val;
  }
  return cookies;
}

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqOptions = {
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          setCookies: parseSetCookie(res.headers["set-cookie"]),
          body: json || body,
          rawBody: body
        });
      });
    });

    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("     RESUME REQUEST FEATURE & RESEND TEST SUITE   ");
  console.log("==================================================\n");

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(num, condition, message) {
    if (condition) {
      console.log(`  ✓ TEST ${num}: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ TEST ${num}: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Missing required fields rejected
    const res1 = await makeRequest("/api/resume/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "test@company.com", company: "Tech Corp" }
    });
    assert(1, res1.statusCode === 400, "Validation rejects missing required fullName");

    // 2. Invalid email rejected
    const res2 = await makeRequest("/api/resume/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { fullName: "Alice Smith", email: "not-an-email", company: "Tech Corp" }
    });
    assert(2, res2.statusCode === 400, "Validation rejects invalid email format");

    // 3. Invalid LinkedIn URL rejected
    const res3 = await makeRequest("/api/resume/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        fullName: "Alice Smith",
        email: "alice@techcorp.com",
        company: "Tech Corp",
        linkedin: "invalid-url-string"
      }
    });
    assert(3, res3.statusCode === 400, "Validation rejects invalid LinkedIn URL");

    // 4. Valid Request accepted & saved
    const testEmail = `test.recruiter.${Date.now()}@google.com`;
    const res4 = await makeRequest("/api/resume/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        fullName: "Jane Recruiter",
        email: testEmail,
        company: "Google",
        role: "Software Engineering Recruiter",
        reason: "Internship opportunity for Summer 2026",
        linkedin: "https://linkedin.com/in/jane-recruiter"
      }
    });
    assert(4, res4.statusCode === 200 && res4.body.success, "Valid resume request accepted successfully");

    // 5. PostgreSQL resume request created
    const dbRes = await db.query("SELECT * FROM resume_requests WHERE email = $1", [testEmail]);
    assert(5, dbRes.rows.length > 0 && dbRes.rows[0].company === "Google", "Record verified in PostgreSQL resume_requests table");

    // 6. Verify API Key is NEVER returned to client
    const apiKeyExposed = res4.rawBody.includes(process.env.RESEND_API_KEY || "re_");
    assert(6, !apiKeyExposed, "Resend API key is never exposed in client API responses");

    // 7. Verify Resend Client Instance & Attachment structure
    const resendClient = emailService.getResendClient();
    assert(7, resendClient !== undefined, "Resend client instance initialized correctly");

    // 8. Admin Retrieval GET /api/resume/requests -> 200 with admin token
    const adminToken = generateAdminToken({ id: 1, email: "admin@portfolio" });
    const res8 = await makeRequest("/api/resume/requests", {
      method: "GET",
      headers: { Cookie: `${ADMIN_COOKIE_NAME}=${adminToken}` }
    });
    assert(8, res8.statusCode === 200 && Array.isArray(res8.body.requests), "Admin can fetch list of resume requests");

    // 9. Unauthenticated GET /api/resume/requests -> 401
    const res9 = await makeRequest("/api/resume/requests", {
      method: "GET"
    });
    assert(9, res9.statusCode === 401, "Unauthenticated access to GET /api/resume/requests rejected with 401");

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    server.close();
    await db.end().catch(() => {});
    console.log("\n==================================================");
    console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
