# NexusCRM - Modern Customer Relationship Management System

A premium, full-stack CRM dashboard built for managing client leads, tracking follow-ups, and analyzing conversion metrics.

## Features

- **Secure Authentication**: Admin login with JWT and bcrypt hashing.
- **Lead Management**: Full CRUD operations for customer leads.
- **Dynamic Status Workflow**: Track leads through New, Contacted, Qualified, Converted, and Closed statuses.
- **Advanced Analytics**: Real-time stats, growth charts, and conversion rate tracking.
- **Premium UI/UX**: SaaS-style dashboard with glassmorphism, responsive design, and smooth animations.
- **Search & Filtering**: Quick search and status-based filtering for efficient lead management.
- **Activity Log**: Keep track of recent updates and status changes.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Charts)
- Framer Motion (Animations)
- Axios (API Calls)
- React Router (Navigation)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)
- Morgan & Helmet (Security & Logging)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm-project
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start the Backend**
   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend**
   ```bash
   cd client
   npm run dev
   ```

## Deployment

- **Frontend**: Vercel
- **Backend**: Render / Heroku
- **Database**: MongoDB Atlas

## License
MIT License
