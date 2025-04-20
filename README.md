# MERN Todo Application

A full-stack todo application built with the MERN stack (MongoDB, Express.js, React, Node.js).

![Todo App Screenshot](https://raw.githubusercontent.com/musavirchukkan/project-images/refs/heads/main/mern-todo/dashboard.png)

## Features

- Create, read, update, and delete todos
- Filter todos by status (pending, in-progress, completed) and priority (low, medium, high)
- Track overdue tasks automatically
- Responsive UI with loading indicators and error handling
- State management with React Context API

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Installation and Setup

### Clone the repository

```bash
git clone https://github.com/musavirchukkan/mern-todo.git
cd mern-todo-app
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file using .env.example
# Required environment variables:
# MONGO_URI=mongodb://localhost:27017/mern-todo-app
# PORT=5000 (optional, defaults to 5000)
# NODE_ENV=development

# Start the backend server in development mode
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file if needed
# VITE_API_URL=http://localhost:5000/api/todos (defaults to this in development)

# Start the frontend development server
npm run dev
```

## Running the Application

- Backend API will be available at: http://localhost:5000
- Frontend will be available at: http://localhost:3000
- You can configure different ports in the respective .env files

## Error Handling

- The application implements comprehensive error handling:
  - Backend: Express error middleware provides detailed error responses
  - Frontend: Axios interceptors handle network errors and display user-friendly messages via React Toastify
  - Form validation with descriptive error messages

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Todo Model

```javascript
{
  title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      minlength: [2, 'Title must be at least 2 characters'],
      validate: {
          validator: function (v) {
              return v.trim().length > 0;
          },
          message: 'Title cannot be empty'
      }
  },
  description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
      type: String,
      required: true,
      enum: {
          values: ['pending', 'in-progress', 'completed'],
          message: '{VALUE} is not a valid status'
      },
      default: 'pending'
  },
  priority: {
      type: String,
      enum: {
          values: ['low', 'medium', 'high'],
          message: '{VALUE} is not a valid priority'
      },
      default: 'medium'
  },
  completed: {
      type: Boolean,
      default: false
  },
  dueDate: {
      type: Date,
      validate: {
          validator: function (value) {
              // Date validation is optional
              return !value || value >= new Date();
          },
          message: 'Due date cannot be in the past'
      }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Additional Model Features

- **Virtual Properties**:

  - `isOverdue` - Automatically detects if a non-completed task is past its due date

- **Pre-save Middleware**:

  - Synchronizes the `completed` boolean with the `status` field
  - When status is set to 'completed', the completed flag is automatically set to true

- **Indexes**:
  - Optimized indexes for status and creation date for better query performance

## Technologies Used

### Backend

- Node.js (v18.x)
- Express.js (v4.18.x)
- MongoDB
- Mongoose (v7.x)
- dotenv (v16.x)
- cors (v2.8.x)

### Frontend

- React (v18.x)
- Vite (v4.x)
- React Router (v6.x)
- React Context API for state management
- Axios (v1.x)
- React Icons (v4.x)
- React Toastify (v9.x)

## Project Structure

```
mern-todo-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── todoController.js
│   ├── models/
│   │   └── todoModel.js
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
└── README.md
```

## License

MIT

## Author

Abdul Musavir Chukkan
