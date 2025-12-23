# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher) installed
- MongoDB running locally OR MongoDB Atlas account

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anatomy-learning
SESSION_SECRET=your-secret-key-change-in-production
```

Start backend:
```bash
npm start
# or for development:
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Make sure MongoDB is running on your machine
- Default connection: `mongodb://localhost:27017/anatomy-learning`

**Option B: MongoDB Atlas**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in `.env` file

### 4. Testing the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account (choose Student or Teacher role)
3. Login with your credentials
4. Start exploring!

## Default Routes

- Landing Page: `/`
- Register: `/register`
- Login: `/login`
- Student Dashboard: `/student/dashboard`
- Teacher Dashboard: `/teacher/dashboard`

## Notes

- Make sure both backend and frontend servers are running
- Backend must be running before frontend can make API calls
- Session-based authentication - cookies must be enabled
- For 3D models, use direct URLs to `.glb` files

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

**Frontend won't start:**
- Make sure you're in the `frontend` directory
- Run `npm install` if you haven't already
- Check if port 3000 is available

**API calls failing:**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify session cookies are enabled

