const BASE_URL = "http://localhost:5000/api";

async function makeRequest(method, endpoint, body = null, token = null) {
  const url = BASE_URL + endpoint;
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  let res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    console.error("fetch error for", url, e.message);
    return { status: 0, error: e.message };
  }
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

(async () => {
  try {
    console.log("E2E UI-sim start");

    // Register employer
    const unique = Date.now() + Math.floor(Math.random() * 10000);
    const empEmail = `emp_e2e_${unique}@example.com`;
    let r = await makeRequest("POST", "/auth/register", {
      name: "E2E Employer",
      email: empEmail,
      phone: String(9000000000 + (unique % 100000)),
      password: "password123",
    });
    if (r.status !== 201)
      throw new Error("employer register failed " + r.status);
    const userToken = r.data.token;
    console.log("Employer registered");

    // Register worker
    const workerEmail = `wrk_e2e_${unique}_${Math.floor(Math.random() * 10000)}@example.com`;
    r = await makeRequest("POST", "/workers/register", {
      name: "E2E Worker",
      email: workerEmail,
      phone: String(9111111111 + (unique % 100000)),
      password: "password123",
      skill: "TestSkill",
      location: "TestLocation",
    });
    if (r.status !== 201) throw new Error("worker register failed " + r.status);
    const workerToken = r.data.token;
    const workerId = r.data.worker.id;
    console.log("Worker registered (auto-approved) id=", workerId);

    // Skip approval - workers are auto-approved on registration
    // r = await makeRequest(
    //   "PUT",
    //   `/admin/workers/${workerId}/approve`,
    //   {},
    //   userToken,
    // );
    // if (r.status !== 200) throw new Error("approve failed " + r.status);
    // console.log("Worker approved");

    // Create job as employer
    r = await makeRequest(
      "POST",
      "/employers/requests",
      {
        title: "E2E Job",
        description: "Test job",
        location: "TestLocation",
        skill: "TestSkill",
        wage: 100,
      },
      userToken,
    );
    if (r.status !== 201) throw new Error("create job failed " + r.status);
    const jobId = r.data.jobRequest._id;
    console.log("Job created id=", jobId);

    // Set worker availability true
    r = await makeRequest(
      "PUT",
      `/workers/${workerId}/availability`,
      { availability: true },
      workerToken,
    );
    if (r.status !== 200)
      throw new Error("set availability failed " + r.status);
    console.log("Worker availability set to true");

    // Worker claims job
    r = await makeRequest("PUT", `/workers/claims/${jobId}`, {}, workerToken);
    if (r.status !== 200) {
      console.error("claim response:", r);
      throw new Error("claim job failed " + r.status);
    }
    console.log("Job claimed by worker");

    // Verify job assigned
    r = await makeRequest("GET", `/employers/requests/${jobId}/view`);
    if (r.status !== 200) throw new Error("get job failed " + r.status);
    const assigned = r.data.jobRequest.assignedWorkerId;
    console.log(
      "Assigned worker id on job:",
      assigned && (assigned._id || assigned),
    );

    console.log("E2E UI-sim completed successfully");
  } catch (err) {
    console.error("E2E UI-sim error:", err.message || err);
    process.exitCode = 1;
  }
})();
