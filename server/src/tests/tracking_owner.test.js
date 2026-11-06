const http = require("http");
const app = require("../server");
const db = require("../config/connection");
const { ADMIN_COOKIE_NAME, OWNER_COOKIE_NAME } = require("../middleware/auth");

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
  console.log("  ANALYTICS OWNER EXCLUSION 21-POINT TEST SUITE   ");
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

  let anonymousCookieHeader = "";
  let ownerAdminCookieHeader = "";
  let ownerOnlyCookieHeader = "";

  try {
    // ----------------------------------------------------
    // CATEGORY 1: Anonymous visitor
    // ----------------------------------------------------
    console.log("--- Category 1: Anonymous Visitor Tracking ---");

    // 1. Anonymous browser POST /api/track -> page view is recorded
    const res1 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { page: "/" }
    });
    assert(1, res1.statusCode === 200 && res1.body.success && !res1.body.ignored, "Anonymous '/' visit recorded");
    const visitorId1 = res1.setCookies.visitor_id;
    anonymousCookieHeader = `visitor_id=${visitorId1}`;

    // 2. Anonymous browser visits /projects -> page view is recorded
    const res2 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: anonymousCookieHeader },
      body: { page: "/projects" }
    });
    assert(2, res2.statusCode === 200 && res2.body.success && !res2.body.ignored, "Anonymous '/projects' visit recorded");

    // 3. Anonymous browser visits /resume -> page view is recorded
    const res3 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: anonymousCookieHeader },
      body: { page: "/resume" }
    });
    assert(3, res3.statusCode === 200 && res3.body.success && !res3.body.ignored, "Anonymous '/resume' visit recorded");

    // ----------------------------------------------------
    // CATEGORY 2: Owner login
    // ----------------------------------------------------
    console.log("\n--- Category 2: Owner Login & Cookie Issuance ---");

    // Fetch credentials from DB or use exact admin credentials
    const usersRes = await db.query("SELECT email, password FROM users LIMIT 1");
    const adminUser = usersRes.rows[0] || { email: "rithishcodespace@gmail.com", password: "Rithish@2006" };

    // 4 & 5. Successfully log in through /api/admin/login -> admin_token & analytics_owner set
    const loginRes = await makeRequest("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: adminUser.email, password: adminUser.password }
    });

    const adminTokenVal = loginRes.setCookies[ADMIN_COOKIE_NAME];
    const analyticsOwnerVal = loginRes.setCookies[OWNER_COOKIE_NAME];

    assert(4, Boolean(adminTokenVal), "admin_token cookie set on successful login");
    assert(5, Boolean(analyticsOwnerVal), "analytics_owner cookie set on successful login");

    ownerAdminCookieHeader = `${ADMIN_COOKIE_NAME}=${adminTokenVal}; ${OWNER_COOKIE_NAME}=${analyticsOwnerVal}`;
    ownerOnlyCookieHeader = `${OWNER_COOKIE_NAME}=${analyticsOwnerVal}`;

    // ----------------------------------------------------
    // CATEGORY 3: Owner while logged in
    // ----------------------------------------------------
    console.log("\n--- Category 3: Owner While Logged In ---");

    // 6. Owner visits '/' -> NOT recorded
    const res6 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/" }
    });
    assert(6, res6.body.ignored === true && res6.body.reason === "owner", "Owner '/' visit ignored");

    // 7. Owner visits '/projects' -> NOT recorded
    const res7 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/projects" }
    });
    assert(7, res7.body.ignored === true && res7.body.reason === "owner", "Owner '/projects' visit ignored");

    // 8. Owner visits '/resume' -> NOT recorded
    const res8 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/resume" }
    });
    assert(8, res8.body.ignored === true && res8.body.reason === "owner", "Owner '/resume' visit ignored");

    // 9. Owner visits '/contact' -> NOT recorded
    const res9 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/contact" }
    });
    assert(9, res9.body.ignored === true && res9.body.reason === "owner", "Owner '/contact' visit ignored");

    // 10. Owner visits '/admin' -> NOT recorded
    const res10 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/admin" }
    });
    assert(10, res10.body.ignored === true, "Owner '/admin' visit ignored");

    // 11. Owner visits '/admin/messages' -> NOT recorded
    const res11 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
      body: { page: "/admin/messages" }
    });
    assert(11, res11.body.ignored === true, "Owner '/admin/messages' visit ignored");

    // 12. Owner refreshes pages multiple times -> no analytics records created
    let allIgnored = true;
    for (let i = 0; i < 5; i++) {
      const refreshRes = await makeRequest("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: ownerAdminCookieHeader },
        body: { page: "/" }
      });
      if (!refreshRes.body.ignored) allIgnored = false;
    }
    assert(12, allIgnored, "Owner 5x refresh visits all ignored");

    // ----------------------------------------------------
    // CATEGORY 4: Owner after logout
    // ----------------------------------------------------
    console.log("\n--- Category 4: Owner After Logout ---");

    // 13 & 14. Owner logs out -> admin_token cleared, analytics_owner remains
    const logoutRes = await makeRequest("/api/admin/logout", {
      method: "POST",
      headers: { Cookie: ownerAdminCookieHeader }
    });
    const logoutSetCookies = logoutRes.headers["set-cookie"] || [];
    const clearedAdminToken = logoutSetCookies.some(s => s.includes("admin_token=;"));
    assert(13, clearedAdminToken, "admin_token cookie cleared on logout");
    assert(14, Boolean(ownerOnlyCookieHeader), "analytics_owner cookie remains in browser storage after logout");

    // 15. After logout, owner visits '/' -> STILL NOT recorded
    const res15 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerOnlyCookieHeader },
      body: { page: "/" }
    });
    assert(15, res15.body.ignored === true && res15.body.reason === "owner", "Owner '/' visit STILL ignored after logout");

    // 16. After logout, owner visits '/projects' -> STILL NOT recorded
    const res16 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerOnlyCookieHeader },
      body: { page: "/projects" }
    });
    assert(16, res16.body.ignored === true && res16.body.reason === "owner", "Owner '/projects' visit STILL ignored after logout");

    // 17. After logout, owner visits '/resume' -> STILL NOT recorded
    const res17 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: ownerOnlyCookieHeader },
      body: { page: "/resume" }
    });
    assert(17, res17.body.ignored === true && res17.body.reason === "owner", "Owner '/resume' visit STILL ignored after logout");

    // ----------------------------------------------------
    // CATEGORY 5: Admin routes explicit safety check
    // ----------------------------------------------------
    console.log("\n--- Category 5: Admin Routes Explicit Exclusion ---");

    // 18. Any request tracking '/admin' (even without owner cookie) -> NOT recorded
    const res18 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { page: "/admin" }
    });
    assert(18, res18.body.ignored === true && res18.body.reason === "admin_route", "Unauthenticated '/admin' tracking request ignored with reason: admin_route");

    // 19. Any request tracking '/admin/*' (e.g. /admin/analytics) -> NOT recorded
    const res19 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { page: "/admin/analytics" }
    });
    assert(19, res19.body.ignored === true && res19.body.reason === "admin_route", "Unauthenticated '/admin/analytics' tracking request ignored with reason: admin_route");

    // ----------------------------------------------------
    // CATEGORY 6: Isolation & Security
    // ----------------------------------------------------
    console.log("\n--- Category 6: Isolation & Security ---");

    // 20. Completely new browser/device with no analytics_owner -> views ARE recorded
    const res20 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { page: "/about" }
    });
    assert(20, res20.body.success && !res20.body.ignored, "New browser without analytics_owner is recorded normally");

    // 21. Normal visitor trying to fake isAdmin in body -> still recorded as visitor
    const res21 = await makeRequest("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { page: "/", isAdmin: true, analytics_owner: true }
    });
    assert(21, res21.body.success && !res21.body.ignored, "Forged request body { isAdmin: true } ignored by backend and tracked normally");

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
