# 🏫 Student Management System
> Full-Stack: **Express + Mongoose + React** with **RBAC** (Role-Based Access Control)

---

## 📁 Project Structure

```
student-management/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seed demo data
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── course.controller.js
│   │   └── grade.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT + RBAC middleware
│   ├── models/
│   │   ├── User.js            # User model (admin/teacher/student)
│   │   ├── Course.js          # Course model
│   │   └── Grade.js           # Grade model
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── course.routes.js
│   │   └── grade.routes.js
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/shared/
    │   │   ├── AppLayout.jsx      # Sidebar layout wrapper
    │   │   ├── Sidebar.jsx        # Role-aware sidebar nav
    │   │   └── ProtectedRoute.jsx # Route guard with RBAC
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx      # Role-based dashboard
    │   │   ├── admin/
    │   │   │   ├── AdminUsers.jsx    # CRUD users
    │   │   │   └── AdminCourses.jsx  # CRUD courses
    │   │   ├── teacher/
    │   │   │   ├── TeacherCourses.jsx  # View courses, enroll students
    │   │   │   └── TeacherGrades.jsx   # Assign grades
    │   │   └── student/
    │   │       ├── StudentCourses.jsx  # View enrolled courses
    │   │       └── StudentGrades.jsx   # View own grades
    │   ├── utils/api.js           # Axios instance with JWT interceptor
    │   ├── App.jsx                # All routes with RBAC protection
    │   └── index.css
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or use MongoDB Atlas)

---

### 1. Backend Setup

```bash
cd backend
npm install

# Copy env and set your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

```bash
# Seed demo data (creates users + courses)
npm run seed

# Start backend
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Demo Login Credentials

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Admin   | admin@school.com    | password123 |
| Teacher | ramesh@school.com   | password123 |
| Teacher | priya@school.com    | password123 |
| Student | arjun@school.com    | password123 |
| Student | sneha@school.com    | password123 |
| Student | rahul@school.com    | password123 |

---

## 🔐 RBAC — Role-Based Access Control

### How it works (Backend)

```js
// middleware/auth.middleware.js

// 1. protect — verifies JWT token
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};

// 2. authorize — checks user role
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
```

### Usage in routes

```js
// Only admin can manage users
router.get("/users", protect, authorize("admin"), getAllUsers);

// Only teacher can grade
router.post("/grades", protect, authorize("teacher"), addGrade);

// All logged-in users can see their courses
router.get("/courses", protect, getCourses);  // controller filters by role
```

### Frontend RBAC (React)

```jsx
// ProtectedRoute — guards entire pages
<ProtectedRoute roles={["admin"]}>
  <AdminUsers />
</ProtectedRoute>

// Sidebar auto-shows items based on role
const NAV_ITEMS = [
  { path: "/admin/users", roles: ["admin"] },
  { path: "/teacher/grades", roles: ["teacher"] },
  { path: "/student/grades", roles: ["student"] },
];
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Role Access        |
|--------|---------------------------|--------------------|
| POST   | /api/auth/login           | Public             |
| GET    | /api/auth/me              | All                |
| GET    | /api/users                | Admin              |
| POST   | /api/users                | Admin              |
| PUT    | /api/users/:id            | Admin              |
| DELETE | /api/users/:id            | Admin              |
| GET    | /api/courses              | All (filtered)     |
| POST   | /api/courses              | Admin              |
| POST   | /api/courses/:id/enroll   | Admin, Teacher     |
| GET    | /api/grades               | All (filtered)     |
| POST   | /api/grades               | Teacher            |
| PUT    | /api/grades/:id           | Teacher            |
| DELETE | /api/grades/:id           | Admin              |

---

## 🧠 Key Learning Concepts

1. **Mongoose Models** — Schema definition, pre-save hooks, virtuals
2. **JWT Authentication** — Token generation, verification, refresh
3. **RBAC Middleware** — Role checking with Express middleware chain
4. **Mongoose Populate** — Joining documents across collections
5. **React Context** — Global auth state management
6. **Protected Routes** — Role-based page access in React Router
7. **Axios Interceptors** — Auto-attach JWT token to every request
