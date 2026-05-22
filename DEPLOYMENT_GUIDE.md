# Full-Stack Deployment Guide - NexusCRM

This document outlines the step-by-step procedure to deploy the **NexusCRM** full-stack application (React/Vite Frontend + Express/Node.js Backend) to production cloud platforms.

Our database is already configured to run on a **MongoDB Atlas Cloud Cluster**, which makes production deployment simple because both our local and production environments can connect to the same central database safely.

---

## 🛠️ Step 1: Prepare Environments

Before deploying, ensure both the frontend and backend have their environment variables aligned for production.

### A. Backend (`backend/.env`)
Ensure your cloud database URI is present and the server environment is set to `'production'`.
```ini
PORT=5000
MONGO_URI=mongodb+srv://mallasuryanarayana23_db_user:jx7dujsUj9LPDXRf@m0.wlfbkyx.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_123
NODE_ENV=production
```

### B. Frontend (`frontend/.env`)
Ensure that the API URL points to the production address of your deployed backend (e.g., on Render or Railway) instead of `localhost`.
Create a `.env.production` file in your `frontend` directory:
```ini
VITE_API_URL=https://your-backend-server.onrender.com/api
```
*(You will replace `https://your-backend-server.onrender.com` with the actual URL provided by your backend host in Step 2).*

---

## 🚀 Step 2: Deploy the Backend (Express API)

We recommend using **Render** or **Railway** for the Express backend as they offer free tiers and native support for Node.js apps.

### Option A: Deploying on Render (Recommended)
1. Go to [Render](https://render.com/) and log in (you can use your GitHub account).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`FUTURE_FS_02`).
4. Configure the Web Service settings:
   * **Name**: `nexuscrm-backend`
   * **Region**: Choose the region closest to your users.
   * **Branch**: `main`
   * **Root Directory**: `backend` *(Crucial: this tells Render where the backend package resides)*
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start` *(This runs `node server.js`)*
5. Scroll down to **Environment Variables** and add:
   * `MONGO_URI`: `mongodb+srv://mallasuryanarayana23_db_user:jx7dujsUj9LPDXRf@m0.wlfbkyx.mongodb.net/crm_db?retryWrites=true&w=majority`
   * `JWT_SECRET`: `your_super_secret_jwt_key_123`
   * `NODE_ENV`: `production`
6. Click **Create Web Service**. Render will build and deploy the server.
7. Once deployed, Render will provide a public URL (e.g., `https://nexuscrm-backend.onrender.com`). **Copy this URL** for the frontend setup!

---

## 🎨 Step 3: Deploy the Frontend (Vite / React)

We recommend using **Vercel** or **Netlify** for the frontend because they provide rapid global CDN loading, instant caching, and free custom domain support for static apps.

### Option A: Deploying on Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) and sign up using your GitHub account.
2. Click **Add New** and select **Project**.
3. Import your GitHub repository (`FUTURE_FS_02`).
4. Configure the Project settings:
   * **Framework Preset**: `Vite` *(Vercel automatically detects this)*
   * **Root Directory**: `frontend` *(Crucial: this tells Vercel where the React codebase resides)*
   * **Build and Output Settings**:
     * Build Command: `npm run build`
     * Output Directory: `dist`
   * **Environment Variables**:
     * Add `VITE_API_URL` with the value `https://your-backend-server.onrender.com/api` *(use the exact backend URL you got from Render in Step 2)*.
5. Click **Deploy**. Vercel will build and serve your static React application on a global CDN.
6. Once deployed, Vercel will provide you with a production URL (e.g., `https://nexuscrm.vercel.app`).

### Option B: Deploying Frontend to Netlify
1. Log into [Netlify](https://www.netlify.com/) using GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and authorize the repository.
4. Set Build configuration:
   * Base Directory: `frontend`
   * Build Command: `npm run build`
   * Publish Directory: `frontend/dist`
5. Go to **Environment variables** under Site settings and add `VITE_API_URL` pointing to your Render backend API.
6. Click **Deploy Site**.

---

## ⚙️ Step 4: Configure CORS on the Backend

To ensure your frontend can communicate with your backend securely, your Express server allows requests from any origin by default because of the global `cors()` middleware in [server.js](file:///c:/Users/Surya%20Narayana/Desktop/fsd%20-02/backend/server.js):
```javascript
app.use(cors());
```
This is perfect for deployment, as your React frontend will be able to make API requests without CORS issues.

---

## 🔍 Step 5: Verification Checklist

Once both services are deployed, perform the following verification check:

1. **Verify Home Page**: Open your deployed Vercel URL (e.g. `https://nexuscrm.vercel.app`). Verify that the agency landing page renders fully and beautifully.
2. **Submit Public Lead Form**: Scroll to the contact form on the landing page, fill out details, and hit submit. Ensure the success toast appears, proving that the frontend successfully communicated with the live Render API backend.
3. **Admin CRM Log In**: Go to `/login`, enter `admin@nexuscrm.com` / `password123`. Verify that authentication completes, a secure session JWT is generated, and you are successfully redirected to `/dashboard`.
4. **Interactive Profile Customization**: Head to settings, edit your **Job Title** and **Department**, upload a new profile photo, and save changes. Confirm that the top-right navbar updates dynamically with your custom photo!
