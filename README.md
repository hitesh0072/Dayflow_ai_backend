# Dayflow AI Backend

This is the backend server for the Dayflow AI application, a task management system with advanced AI capabilities.

## Features

-   **Authentication**: Secure JWT-based auth with Register, Login, Email Verification, and Token Invalidation (Logout).
-   **Task Management**: Create, read, update, delete tasks. Support for categories, tags, priority, and due dates.
-   **Smart Status**: Tasks automatically move to 'overdue' if not completed by the due date.
-   **Dashboard**: Aggregated statistics for tasks by category.
-   **AI Enhancements**: Integrated with OpenRouter (Meta Llama 3) for:
    -   Task Summarization
    -   Smart Prioritization
    -   Time Estimation
    -   Breaking down complex tasks
    -   Generating anti-procrastination prompts
-   **Default Data**: Automatically sets up default categories and tags for new users.
-   **Profile Management**: Profile image upload and profile updates.

## Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JSON Web Tokens (JWT), bcrypt
-   **AI Service**: OpenRouter (OpenAI SDK compatible)
-   **Email**: Nodemailer

## Prerequisites

-   Node.js (v18+)
-   MongoDB installed and running locally
-   OpenRouter API Key

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the server directory:
    ```bash
    cd server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root of the `server` directory with the following variables:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hackathon_db
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
OPENROUTER_API_KEY=your_openrouter_api_key
# Optional
OPENROUTER_MODEL=meta-llama/llama-3-8b-instruct
```

## Running the Server

-   **Development Mode** (with nodemon):
    ```bash
    npm run dev
    ```
-   **Production Mode**:
    ```bash
    npm start
    ```

The server runs on `http://localhost:5001` by default.

## API Endpoints

### Authentication
-   `POST /api/v1/auth/register` - Register new user (Multipart form-data for profile image)
-   `POST /api/v1/auth/verify-email` - Verify OTP
-   `POST /api/v1/auth/resend-otp` - Resend verification OTP
-   `POST /api/v1/auth/login` - Login user
-   `POST /api/v1/auth/logout` - Logout (Invalidate token)
-   `GET /api/v1/auth/check-username` - Check availability
-   `PATCH /api/v1/auth/update-profile` - Update profile

### Tasks
-   `GET /api/v1/task` - Get all tasks (Supports pagination & filtering)
-   `POST /api/v1/task` - Create new task
-   `GET /api/v1/task/:id` - Get task details
-   `PATCH /api/v1/task/:id` - Update task
-   `DELETE /api/v1/task/:id` - Delete task
-   `PATCH /api/v1/task/:id/status` - Update specific status
-   `GET /api/v1/task/stats` - Get category-wise task counts

### AI Features (Protected)
-   `POST /api/v1/ai/summarize` - Summarize a task
    -   Body: `{ "taskId": "..." }`
-   `POST /api/v1/ai/prioritize` - Prioritize tasks
    -   Body: `{ "category": "..." }` (Optional category filter)
-   `POST /api/v1/ai/estimate` - Estimate time
    -   Body: `{ "taskId": "..." }`
-   `POST /api/v1/ai/prompts` - Get start prompts
    -   Body: `{ "taskId": "..." }`
-   `POST /api/v1/ai/breakdown` - Breakdown task
    -   Body: `{ "taskId": "..." }`

### Categories & Tags
-   `GET /api/v1/category` - List categories
-   `POST /api/v1/category` - Create category
-   `GET /api/v1/tag` - List tags
-   `POST /api/v1/tag` - Create tag
