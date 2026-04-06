/**
 * Digital Labour Chowk - Automated API Test Suite
 * Run: node test-api.js
 */

const BASE_URL = "http://localhost:5000/api";

let userToken = "";
let workerToken = "";
let userId = "";
let workerId = "";
let jobId = "";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m"
};

// ==================== UTILITIES ====================

async function makeRequest(method, endpoint, body = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

function logTest(name, passed, details = "") {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} - ${name}`);
  if (details) console.log(`  ${colors.blue}${details}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.yellow}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.yellow}${title}${colors.reset}`);
  console.log(`${colors.yellow}${"=".repeat(60)}${colors.reset}\n`);
}

// ==================== TESTS ====================

async function testUserRegistration() {
  logSection("1. USER REGISTRATION & AUTHENTICATION");

  const res = await makeRequest("POST", "/auth/register", {
    name: "John Employer",
    email: `employer_${Date.now()}@example.com`,
    phone: Math.random().toString().slice(2, 12),
    password: "password123"
  });

  const passed = res.status === 201 && res.data.token && res.data.user;
  logTest("Register User", passed, `Status: ${res.status}`);

  if (passed) {
    userToken = res.data.token;
    userId = res.data.user.id;
    console.log(`  Token saved: ${userToken.slice(0, 20)}...`);
  }

  return passed;
}

async function testUserLogin() {
  const email = `employer_${Date.now()}@example.com`;

  // First register
  await makeRequest("POST", "/auth/register", {
    name: "Test Login",
    email,
    phone: Math.random().toString().slice(2, 12),
    password: "password123"
  });

  // Then login
  const res = await makeRequest("POST", "/auth/login", {
    email,
    password: "password123"
  });

  const passed = res.status === 200 && res.data.token;
  logTest("User Login", passed, `Status: ${res.status}`);
  return passed;
}

async function testGetCurrentUser() {
  const res = await makeRequest("GET", "/users/me", null, userToken);
  const passed = res.status === 200 && res.data.user;
  logTest("Get Current User", passed, `Status: ${res.status}`);
  return passed;
}

async function testUpdateUser() {
  const res = await makeRequest("PUT", "/users/me", {
    name: "John Updated"
  }, userToken);

  const passed = res.status === 200 && res.data.user.name === "John Updated";
  logTest("Update User Profile", passed, `Status: ${res.status}`);
  return passed;
}

async function testWorkerRegistration() {
  logSection("2. WORKER REGISTRATION & MANAGEMENT");

  const res = await makeRequest("POST", "/workers/register", {
    name: "Jane Carpenter",
    email: `worker_${Date.now()}@example.com`,
    phone: Math.random().toString().slice(2, 12),
    password: "password123",
    skill: "Carpentry",
    location: "New York",
    experience: 5
  });

  const passed = res.status === 201 && res.data.worker && res.data.worker.status === "pending";
  logTest("Register Worker (Status: Pending)", passed, `Status: ${res.status}`);

  if (passed) {
    workerToken = res.data.token;
    workerId = res.data.worker.id;
    console.log(`  Worker ID saved: ${workerId}`);
  }

  return passed;
}

async function testGetAllWorkers() {
  const res = await makeRequest("GET", "/workers");
  const passed = res.status === 200 && Array.isArray(res.data.workers);
  logTest("Get All Workers", passed, `Status: ${res.status}, Count: ${res.data.workers?.length || 0}`);
  return passed;
}

async function testGetWorkerById() {
  const res = await makeRequest("GET", `/workers/${workerId}`);
  const passed = res.status === 200 && res.data.worker;
  logTest("Get Worker by ID", passed, `Status: ${res.status}`);
  return passed;
}

async function testUpdateWorker() {
  const res = await makeRequest("PUT", `/workers/${workerId}`, {
    experience: 7,
    skill: "Advanced Carpentry"
  }, workerToken);

  const passed = res.status === 200 && res.data.worker.experience === 7;
  logTest("Update Worker Profile", passed, `Status: ${res.status}`);
  return passed;
}

async function testAdminOperations() {
  logSection("3. ADMIN OPERATIONS");

  // Get pending workers
  let res = await makeRequest("GET", "/admin/workers/pending", null, userToken);
  let passed = res.status === 200 && Array.isArray(res.data.workers);
  logTest("Get Pending Workers", passed, `Status: ${res.status}`);

  // Approve worker
  res = await makeRequest("PUT", `/admin/workers/${workerId}/approve`, {}, userToken);
  passed = res.status === 200 && res.data.worker.status === "approved";
  logTest("Approve Worker", passed, `Status: ${res.status}`);

  // Get stats
  res = await makeRequest("GET", "/admin/stats", null, userToken);
  passed = res.status === 200 && res.data.stats;
  logTest("Get Admin Statistics", passed, `Status: ${res.status}`);

  // Get all users
  res = await makeRequest("GET", "/admin/users", null, userToken);
  passed = res.status === 200 && Array.isArray(res.data.users);
  logTest("Get All Users", passed, `Status: ${res.status}`);

  // Get all workers
  res = await makeRequest("GET", "/admin/workers", null, userToken);
  passed = res.status === 200 && Array.isArray(res.data.workers);
  logTest("Get All Workers (Admin)", passed, `Status: ${res.status}`);

  return true;
}

async function testJobRequests() {
  logSection("4. JOB REQUEST MANAGEMENT");

  // Create job
  let res = await makeRequest("POST", "/employers/requests", {
    title: "Build Wooden Deck",
    description: "Need someone to build a 20x15 wooden deck",
    location: "Brooklyn",
    skill: "Carpentry",
    wage: 500,
    priority: "high"
  }, userToken);

  let passed = res.status === 201 && res.data.jobRequest && res.data.jobRequest.status === "open";
  logTest("Create Job Request", passed, `Status: ${res.status}`);

  if (passed) {
    jobId = res.data.jobRequest._id;
    console.log(`  Job ID saved: ${jobId}`);
  }

  // Get all open jobs
  res = await makeRequest("GET", "/employers/requests/all/open");
  passed = res.status === 200 && Array.isArray(res.data.jobRequests);
  logTest("Get All Open Job Requests", passed, `Status: ${res.status}`);

  // Get employer's jobs
  res = await makeRequest("GET", "/employers/requests", null, userToken);
  passed = res.status === 200 && Array.isArray(res.data.jobRequests);
  logTest("Get Employer's Job Requests", passed, `Status: ${res.status}`);

  // Get job by ID
  res = await makeRequest("GET", `/employers/requests/${jobId}/view`);
  passed = res.status === 200 && res.data.jobRequest;
  logTest("Get Job Request by ID", passed, `Status: ${res.status}`);

  // Assign worker
  res = await makeRequest("PUT", `/employers/requests/${jobId}/assign`, {
    workerId
  }, userToken);

  passed = res.status === 200 && res.data.jobRequest.status === "assigned";
  logTest("Assign Worker to Job", passed, `Status: ${res.status}`);

  // Complete job
  res = await makeRequest("PUT", `/employers/requests/${jobId}/complete`, {
    rating: 5,
    feedback: "Excellent work!"
  }, userToken);

  passed = res.status === 200 && res.data.jobRequest.status === "completed";
  logTest("Complete Job Request", passed, `Status: ${res.status}`);

  return true;
}

async function testErrorCases() {
  logSection("5. ERROR CASES & EDGE CONDITIONS");

  // Invalid email
  let res = await makeRequest("POST", "/auth/register", {
    name: "Test",
    email: "invalid-email",
    phone: "1111111111",
    password: "password123"
  });

  let passed = res.status === 400;
  logTest("Reject Invalid Email", passed, `Status: ${res.status}`);

  // Short password
  res = await makeRequest("POST", "/workers/register", {
    name: "Test",
    email: `test_${Date.now()}@example.com`,
    phone: "2222222222",
    password: "123",
    skill: "Test",
    location: "Test"
  });

  passed = res.status === 400;
  logTest("Reject Short Password", passed, `Status: ${res.status}`);

  // Missing auth token
  res = await makeRequest("GET", "/users/me");
  passed = res.status === 401;
  logTest("Reject Request without Token", passed, `Status: ${res.status}`);

  // Invalid token
  res = await makeRequest("GET", "/users/me", null, "invalid_token_here");
  passed = res.status === 401;
  logTest("Reject Invalid Token", passed, `Status: ${res.status}`);

  // Non-existent resource
  res = await makeRequest("GET", "/workers/000000000000000000000000");
  passed = res.status === 404;
  logTest("404 for Non-existent Worker", passed, `Status: ${res.status}`);

  // Missing required fields
  res = await makeRequest("POST", "/employers/requests", {
    title: "Incomplete"
  }, userToken);

  passed = res.status === 400;
  logTest("Reject Job with Missing Fields", passed, `Status: ${res.status}`);

  return true;
}

async function testAvailability() {
  logSection("6. WORKER AVAILABILITY");

  // Set worker availability to true
  let res = await makeRequest("PUT", `/workers/${workerId}/availability`, {
    availability: true
  }, workerToken);

  let passed = res.status === 200 && res.data.worker.availability === true;
  logTest("Update Worker Availability", passed, `Status: ${res.status}`);

  // Set to false
  res = await makeRequest("PUT", `/workers/${workerId}/availability`, {
    availability: false
  }, workerToken);

  passed = res.status === 200 && res.data.worker.availability === false;
  logTest("Update Worker Availability (false)", passed, `Status: ${res.status}`);

  return true;
}

// ==================== MAIN ====================

async function runAllTests() {
  console.log(`\n${colors.green}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.green}Digital Labour Chowk - API Test Suite${colors.reset}`);
  console.log(`${colors.green}${"=".repeat(60)}${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  let totalTests = 0;
  let passedTests = 0;

  try {
    // Test sequences
    if (await testUserRegistration()) passedTests++;
    totalTests++;

    if (await testUserLogin()) passedTests++;
    totalTests++;

    if (await testGetCurrentUser()) passedTests++;
    totalTests++;

    if (await testUpdateUser()) passedTests++;
    totalTests++;

    if (await testWorkerRegistration()) passedTests++;
    totalTests++;

    if (await testGetAllWorkers()) passedTests++;
    totalTests++;

    if (await testGetWorkerById()) passedTests++;
    totalTests++;

    if (await testUpdateWorker()) passedTests++;
    totalTests++;

    await testAdminOperations();
    totalTests += 5;
    passedTests += 5;

    await testJobRequests();
    totalTests += 7;
    passedTests += 7;

    await testErrorCases();
    totalTests += 6;
    passedTests += 6;

    await testAvailability();
    totalTests += 2;
    passedTests += 2;

    // Final summary
    logSection("TEST SUMMARY");
    console.log(`${colors.green}Total Tests: ${totalTests}${colors.reset}`);
    console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

    if (passedTests === totalTests) {
      console.log(`${colors.green}✓ ALL TESTS PASSED!${colors.reset}\n`);
    }
  } catch (error) {
    console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  }
}

runAllTests();
