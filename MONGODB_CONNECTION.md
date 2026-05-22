# 🍃 MongoDB Connection & Verification Guide

This guide provides a detailed, step-by-step walkthrough of how MongoDB is connected to your Full-Stack Lead CRM application, and how you can manage, seed, and verify the connection.

---

## 🔍 1. Current Database Status

The local MongoDB instance on your Windows machine is **fully connected, active, and operational**:
*   **MongoDB Windows Service**: `Running`
*   **Database Port**: `27017`
*   **Connection URL**: `mongodb://localhost:27017/crm_db`
*   **Verification Status**: All 7 backend integration tests have **passed flawlessly**!

---

## 🛠️ 2. How the Connection is Structured

The connection is set up across a few key configuration files in your project:

### A. Environment Configuration (`backend/.env`)
The database connection string is stored in a clean environment file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_super_secret_jwt_key_123
NODE_ENV=development
```

### B. Mongoose Connection Setup (`backend/config/db.js`)
Mongoose connects automatically when the server starts up:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 🚀 3. How to Run & Verify the Database

We have automated everything so you do not need to do any complex manual steps! Here is exactly how to manage and run the servers:

### Step 1: Open Your Terminal
Open a terminal (e.g., PowerShell or Command Prompt) and navigate to the project directory:
```powershell
cd "c:\Users\Surya Narayana\Desktop\fsd -02"
```

### Step 2: Seed the Database with Fresh Data (Optional)
If you want to clear old records and populate the system with fresh demo leads, notifications, and an admin user, run:
```powershell
cd backend
npm run seed
```
*This command executes the high-fidelity `seed.js` script, setting up:*
*   **6 Custom Leads** with full timeline events, notes, and metrics.
*   **Admin Credential**: `admin@nexuscrm.com` / `password123`

### Step 3: Run the Integration Tests
To verify that the database is connecting and all API endpoints are behaving correctly:
```powershell
cd backend
node test_endpoints.js
```
All 7 integration checks will verify:
1. Admin Authentication `/api/auth/login`
2. Analytics Aggregation `/api/leads/stats`
3. Leads Listing `/api/leads`
4. Notification Badges `/api/notifications`
5. Activity History Logs `/api/activities`
6. Follow-Ups Scheduler `/api/followups`
7. Administrators List `/api/auth/admins`

---

## 💻 4. Starting the Web Application

The application is already running in the background for you! If you ever restart your computer, follow these simple commands to start them up again:

| Tier | Directory | Run Command | URL |
| :--- | :--- | :--- | :--- |
| **Backend API** | `/backend` | `npm run dev` | `http://localhost:5000` |
| **Frontend Web** | `/frontend` | `npm run dev` | `http://localhost:5173` |

### 🔒 Log In Credentials
To access the Admin CRM Dashboard, click **Admin CRM Portal** on the Landing Page or go directly to `http://localhost:5173/login`:
*   **Email**: `admin@nexuscrm.com`
*   **Password**: `password123`
