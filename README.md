# AR-Based Anatomy Learning Tool (MERN Stack)

A comprehensive web application for medical students to learn anatomy through interactive 3D models and quizzes, built with the MERN stack.

## Features

- **3D Anatomy Models**: View and interact with 3D anatomy models using web-embedded model-viewer component
- **Interactive Quizzes**: Take quizzes created by teachers and track your progress
- **Role-Based Access**: Separate dashboards for Students and Teachers
- **Dark Mode**: Students can toggle dark mode for comfortable studying
- **Marks Tracking**: View quiz scores and performance history

## Technology Stack

### Frontend
- React.js (Functional Components)
- React Router
- Axios
- Tailwind CSS
- JavaScript (ES6+)
- @google/model-viewer (for 3D model viewing)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Session
- Cookie Parser
- Bcryptjs

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anatomy-learning
SESSION_SECRET=your-secret-key-change-in-production
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Student Features
- Register/Login as a Student
- Browse available 3D anatomy models
- View models in fullscreen mode
- Take quizzes on different body systems
- View marks and performance history
- Toggle dark mode for comfortable viewing

### Teacher Features
- Register/Login as a Teacher
- Upload 3D model URLs (.glb files)
- Create quizzes with multiple choice questions
- View and manage uploaded models
- View and manage created quizzes
- Delete models and quizzes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Models
- `GET /api/models` - Get all models
- `GET /api/models/teacher` - Get teacher's models
- `GET /api/models/:id` - Get single model
- `POST /api/models` - Add new model (Teacher only)
- `DELETE /api/models/:id` - Delete model (Teacher only)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/teacher` - Get teacher's quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `POST /api/quizzes` - Create quiz (Teacher only)
- `POST /api/quizzes/:id/submit` - Submit quiz (Student only)
- `DELETE /api/quizzes/:id` - Delete quiz (Teacher only)

### Marks
- `GET /api/marks` - Get student marks (Student only)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student | teacher),
  quizScores: Array
}
```

### Organ (Model)
```javascript
{
  name: String,
  system: String,
  description: String,
  modelUrl: String (.glb URL),
  teacherId: ObjectId
}
```

### Quiz
```javascript
{
  system: String,
  questions: [{
    question: String,
    options: [String] (4 options),
    correctAnswer: String
  }],
  teacherId: ObjectId
}
```

## Project Structure

```
mernproject/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Organ.js
│   │   └── Quiz.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── models.js
│   │   ├── quizzes.js
│   │   └── marks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Notes

- The application uses session-based authentication
- 3D models must be .glb format and accessible via direct URL
- All routes are protected with appropriate middleware
- Dark mode is only available for student routes
- No file uploads - teachers paste direct URLs to .glb files

## License

This project is created for educational purposes.

