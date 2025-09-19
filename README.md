# 💸 ExpenseTracker FE (React)


<img width="3775" height="1959" alt="Screenshot 2025-09-18 204354" src="https://github.com/user-attachments/assets/095f8ac5-9d5a-4980-95bd-559ad4939362" />


A sleek, production-ready **React + TypeScript** frontend for the [ExpenseTracker API](https://github.com/seannxh/ExpenseTrackerBE).  
Features secure auth (JWT), user-scoped expense tracking, monthly take-home budgeting, filtering/sorting/search, and charts — all wrapped in a modern dark UI.

---
##TESTING ACCOUNT
## Username: user@testing.com
## Password: User123!

## 🌐 Live Demo

**Frontend (S3 Hosting)**  
http://expensefrontendreal.s3-website-us-east-1.amazonaws.com

**Backend API (AWS EB)**  
http://expensetracker-env.eba-2mpjph9f.us-east-2.elasticbeanstalk.com

**Swagger UI (if enabled)**  
http://expensetracker-env.eba-2mpjph9f.us-east-2.elasticbeanstalk.com/swagger-ui/index.html

---

## ⚙️ Tech Stack

- **React 18** + **TypeScript** (Vite)
- **React Router** (protected routes)
- **Tailwind CSS** (dark theme)
- **Axios** (API client with JWT interceptor)
- **Recharts** (category spending charts)
- **Zod** (optional: request/response validation)
- **ESLint + Prettier** (lint/format)
- **GitHub Actions** (CI lint/build)

---

## ✅ Key Features

- **Authentication**
  - Login/Signup against backend `/api/auth/*`
  - JWT stored securely and attached on requests
  - Auto-redirect to dashboard after login

- **Expenses**
  - CRUD operations (`/api/expenses`)
  - Search, filter by date, sort asc/desc
  - Category filter + total breakdown

- **Budgeting**
  - **Monthly Take-Home** per user (persisted in backend)  
    - Loaded on mount via `GET /api/users/me/settings`  
    - Updated via `PUT /api/users/me/settings/take-home`

- **Charts**
  - Category distribution & monthly trend (Recharts)

- **Developer Experience**
  - Strong TypeScript models & DTOs
  - Reusable hooks and Axios client
  - Environment-driven config (`VITE_API_BASE_URL`)
