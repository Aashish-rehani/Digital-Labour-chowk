# Digital Labour Chowk - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## USER ENDPOINTS (Employer)

### 1. Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```
- **Response:** Token + User info

### 2. Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** Token + User info

### 3. Get Current User
- **GET** `/users/me`
- **Auth:** Required
- **Response:** User details

### 4. Update User Profile
- **PUT** `/users/me`
- **Auth:** Required
- **Body:**
```json
{
  "name": "Updated Name",
  "phone": "0987654321"
}
```

---

## WORKER ENDPOINTS

### 1. Register Worker
- **POST** `/workers/register`
- **Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "password123",
  "skill": "Carpentry",
  "location": "New York",
  "experience": 5
}
```
- **Response:** Token + Worker info (Status: pending)

### 2. Login Worker
- **POST** `/workers/login`
- **Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Response:** Token (Only approved workers can login)

### 3. Get All Workers
- **GET** `/workers`
- **Query Params:**
  - `skill` - Filter by skill
  - `location` - Filter by location
  - `available` - Filter available workers (true/false)
- **Response:** List of approved workers

### 4. Get Worker by ID
- **GET** `/workers/:id`
- **Response:** Worker details

### 5. Update Worker Profile
- **PUT** `/workers/:id`
- **Auth:** Required
- **Body:**
```json
{
  "name": "Updated Name",
  "skill": "Advanced Carpentry",
  "location": "Boston",
  "experience": 7
}
```

### 6. Update Worker Availability
- **PUT** `/workers/:id/availability`
- **Auth:** Required
- **Body:**
```json
{
  "availability": true
}
```

---

## EMPLOYER JOB REQUEST ENDPOINTS

### 1. Create Job Request
- **POST** `/employers/requests`
- **Auth:** Required (User/Employer)
- **Body:**
```json
{
  "title": "Build Wooden Deck",
  "description": "Need someone to build a 20x15 wooden deck",
  "location": "Brooklyn",
  "skill": "Carpentry",
  "wage": 500,
  "priority": "high",
  "dueDatetime": "2026-03-01T10:00:00Z"
}
```

### 2. Get Employer's Job Requests
- **GET** `/employers/requests`
- **Auth:** Required
- **Query Params:**
  - `status` - Filter by status (open, assigned, completed, cancelled)

### 3. Delete Job Request
- **DELETE** `/employers/requests/:id`
- **Auth:** Required
- **Note:** Only open jobs can be deleted

### 4. Assign Worker to Job
- **PUT** `/employers/requests/:id/assign`
- **Auth:** Required
- **Body:**
```json
{
  "workerId": "worker_id_here"
}
```

### 5. Complete Job Request
- **PUT** `/employers/requests/:id/complete`
- **Auth:** Required
- **Body:**
```json
{
  "rating": 5,
  "feedback": "Great work!"
}
```

### 6. Get All Open Job Requests
- **GET** `/employers/requests/all/open`
- **Query Params:**
  - `skill` - Filter by skill
  - `location` - Filter by location
  - `minWage` - Minimum wage
  - `maxWage` - Maximum wage

### 7. Get Job Request by ID
- **GET** `/employers/requests/:id/view`

---

## ADMIN ENDPOINTS

### 1. Get Admin Statistics
- **GET** `/admin/stats`
- **Auth:** Required
- **Response:** Complete stats on workers, users, and jobs

### 2. Get Pending Workers
- **GET** `/admin/workers/pending`
- **Auth:** Required

### 3. Get All Workers
- **GET** `/admin/workers`
- **Auth:** Required

### 4. Approve Worker
- **PUT** `/admin/workers/:id/approve`
- **Auth:** Required

### 5. Reject Worker
- **PUT** `/admin/workers/:id/reject`
- **Auth:** Required

### 6. Block Worker
- **PUT** `/admin/workers/:id/block`
- **Auth:** Required

### 7. Get All Users
- **GET** `/admin/users`
- **Auth:** Required

### 8. Block User
- **PUT** `/admin/users/:id/block`
- **Auth:** Required

### 9. Unblock User
- **PUT** `/admin/users/:id/unblock`
- **Auth:** Required

---

## ERROR RESPONSES

All errors return appropriate HTTP status codes:
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (access denied)
- **404** - Not Found
- **409** - Conflict (duplicate email/phone)
- **500** - Server Error

Example error response:
```json
{
  "message": "Error description"
}
```

---

## KEY FEATURES

✅ User (Employer) Registration & Login
✅ Worker Registration with approval workflow
✅ JWT Authentication & Authorization
✅ Input validation on all endpoints
✅ Password hashing with bcryptjs
✅ Worker status management (pending/approved/rejected)
✅ User/Worker blocking system
✅ Job request creation and assignment
✅ Job completion with rating system
✅ Admin dashboard with statistics
✅ Worker availability management
✅ Query filtering on list endpoints
✅ Proper error handling and status codes

---

## SETUP INSTRUCTIONS

1. Install dependencies:
```bash
npm install
```

2. Create .env file:
```
MONGO_URI=mongodb://localhost:27017/digital-labour-chowk
JWT_SECRET=your_secret_key_here
PORT=5000
```

3. Start server:
```bash
npm run dev
```

4. Test endpoints in Postman using the collection in `/postman` folder

