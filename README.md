# Online Learning Course Recommendation Platform (OLCRP)

Problem statement:
Provide an online-learning platform that recommends courses to users based on profiles and progress. The project contains a React frontend and an Express + MongoDB backend.

Solution:
- Backend: Express API with authentication, course, enrollment and recommendation endpoints.
- Frontend: React (Vite) single-page app with routes for courses, dashboard, profile and auth.

Tech stack & tools:
- Node.js, Express, Mongoose
- React, Vite, React Router
- MongoDB Atlas (configured via `server/.env`)
- Axios for HTTP client

Quick start (development):

1. Server

```powershell
cd server
npm install
npm run dev
```

2. Client

```powershell
cd client
npm install
npm run dev
```

Open the client at `http://localhost:5173/` and the API at `http://localhost:5000/`.

Project structure (top-level):

```
Online-Learning-Course-Recommendation-Platform/
├─ client/
│  ├─ public/index.html
│  ├─ package.json
│  └─ src/
│     ├─ App.js
│     ├─ index.js
│     ├─ index.css
│     ├─ components/
│     │  ├─ common/Navbar.js
│     │  └─ courses/CourseCard.js
│     ├─ context/AuthContext.js
│     └─ pages/
│        ├─ HomePage.js
│        ├─ CoursesPage.js
│        ├─ CourseDetailPage.js
│        ├─ DashboardPage.js
│        └─ (other pages...)
├─ server/
│  ├─ server.js
│  ├─ package.json
│  ├─ .env (local)
│  ├─ config/db.js
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  └─ utils/seeder.js
└─ docs/
	├─ INTERVIEW_QA.md
	└─ PROOF_BUILDING_STRATEGY.md
```

Screenshots
- `docs/screenshots/dashboard.png` — (add screenshots by running the app and saving images here)

Summary & future improvements:
- Basic working scaffold with API and frontend connected to MongoDB Atlas.
- Improvements: richer recommendation algorithm (collaborative filtering), RBAC, tests, CI/CD, UI polish, caching.

Author
- Your Name — replace this with the project author details.

---
Generated/updated by assistant to prepare the project for local development.

## Detailed Project Description

Online Learning Course Recommendation Platform (OLCRP) is a full-stack web application that allows learners to discover, enroll in, and track progress for online courses. The platform includes an admin/instructor interface to create and manage courses, and a recommendation engine that suggests courses based on user profile, skills and progress.

Key features

- Course discovery (search, filters, featured)
- User authentication (JWT)
- Admin dashboard to create/update courses
- Enrollment and progress tracking
- Recommendation endpoint (placeholder algorithm)
- Vite + React frontend and Express + MongoDB backend

## Dashboard & Expected Outputs

The project includes a simple dashboard UI for learners and an Admin page for course creation. Example outputs you should see after running the app and seeding the database:

- API health: `GET http://localhost:5000/` returns

```
{ "message": "OLCRP API running ✓" }
```

- Admin seeder created credentials (if you ran the seeder):

```
email: admin@learnhub.local
password: AdminPass123
```

- Courses list (sample response from `GET /api/courses`):

```
{
	"success": true,
	"total": 3,
	"page": 1,
	"pages": 1,
	"data": [ { "title": "Intro to JavaScript", "category": "Programming" }, { "title": "React for Beginners" }, { "title": "Data Science 101" } ]
}
```

- Frontend dashboard shows:
	- Number of enrolled courses
	- Recently recommended courses
	- Quick links to `My Courses`, `Profile`, and `Explore`

Add screenshots to `docs/screenshots/` with names like `dashboard-01.png` and `admin-create-course.png`. The README will link to them when present.

## Running locally (full steps)

1. Create `.env` files

Put a `server/.env` file with at least:

```
PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=http://localhost:5173
```

2. Install dependencies and seed DB

```powershell
cd server
npm install
npm run seed   # creates admin and sample courses
npm run dev

cd ../client
npm install
npm run dev
```

3. Login as admin at `http://localhost:<vite-port>/login` using the seeded credentials and navigate to `/admin` to create courses.


## Future improvements

- Implement production-grade authentication (refresh tokens, secure cookies)
- Build a real recommendation engine (collaborative filtering + content-based hybrid)
- Add image uploads and course media hosting
- Unit and integration tests + CI pipeline
- Pagination, caching and performance improvements

## Author

- Seethaka Rakshitha



