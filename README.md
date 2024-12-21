# Dissertation Management System

A web application built with Vue.js and Node.js to manage dissertations for students, teachers, and administrators. The system allows administrators to manage student lists, assign students to teachers, and view their progress. Teachers can manage assigned students, grade their progress and final reports, and finalize grades.

---

## Features

### Admin
1. **Input Student Lists:** Add students to the system.
2. **Assign Students to Teachers:** Allocate students to their respective teachers.
3. **View Student Status:** See all students with their assigned teacher, progress grade, final grade, and overall status.

### Teacher
1. **View Assigned Students:** List all students assigned to the teacher.
2. **Grade Students:** Input and save progress and final grades for students.
3. **Finalize Grades:** Submit grades and mark the student's record as finalized. Finalization requires both progress and final grades to be entered.

---

## API Documentation

The backend provides an API documentation interface powered by Swagger, accessible after starting the backend server.

### How to Access Swagger Docs

1. **Start the Backend Server**:
   - If using Docker: The backend is available at `http://localhost:3000`.
   - If running locally, ensure the server is running on the appropriate port.

2. **Access Swagger UI**:
   Navigate to `http://localhost:3000/api-docs` in your browser.

### Example Endpoints

#### Admin
- **GET** `/students`: Retrieve a list of all students.
- **POST** `/students`: Add a new student to the system.
- **POST** `/students/assign-teacher`: Assign a student to a teacher.

#### Teacher
- **GET** `/teacher`: Retrieve a list of all teachers.
- **GET** `/teacher/students`: Retrieve all students assigned to a teacher.
- **PUT** `/students/:id`: Update progress or final grades for a student.
- **PUT** `/students/:id/finalize`: Finalize a student's grades and mark their record as complete.

#### Authentication
- **POST** `/login`: Authenticate and receive a JWT token based on role.

---

## Tech Stack

- **Frontend:** Vue.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite (initialized via Docker using `schema.sql`)

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/charmaine-kwok/dissertation-management-system.git
cd dissertation-management-system
```

---

### Setup Instructions

Yes, it is important to mention that users need to create and configure a `.env` file before running `docker-compose up --build`. This ensures that the necessary environment variables (like `JWT_SECRET`) are available for the application to work properly.

### Updated Section in Documentation

#### 1. Docker Setup (Recommended)

1. **Ensure Docker is installed** on your machine.
2. **Create a `.env` file**:
   - Before building the containers, create a `.env` file in the `backend` directory with the following content:
     ```plaintext
     JWT_SECRET=your_secret_key
     ```
   - This is required for the backend to function properly.
3. **Build and start the containers**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:8080`

5. **Database Initialization:**
   - The database is automatically initialized using `schema.sql` during the first container startup.
   - On subsequent startups, if the database file already exists, it will be mounted and used as is.
   - No manual setup is required unless you want to reset or modify the database schema.

   **Database Tables:**

   The database consists of the following tables:

   1. **users Table**:
      - Stores user information such as id, name, email, password, and role.
      - Roles include admin, teacher, and student.
      - Relationships:
      - id is referenced by the user_id field in the teachers and students tables.

   2. **teachers Table**:
      - Stores teacher-specific data.
      - Fields: id (primary key) and user_id (foreign key from users table).
      - Relationships:
      - user_id links to the users table.

   3. **students Table**:
      - Stores student-specific data, including progress and final grades.
      - Fields: id (primary key), user_id (foreign key from users table), teacher_id (foreign key from teachers table), progress_grade, and final_grade.
      - Relationships:
      - user_id links to the users table.
      - teacher_id links to the teachers table.

   #### Table Relationships

   - **One-to-Many**:
   - Each teacher can be assigned to multiple students (students.teacher_id).
   - **One-to-One**:
   - Each user is linked to one teacher or one student via teachers.user_id or students.user_id.

---

#### 2. Local Setup (Without Docker)

If you prefer running the application locally:

##### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with the following:
   ```plaintext
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

##### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run serve
   ```

---

## Default Credentials

For testing purposes, the following default usernames and passwords are set up in the database:

| Role    | Username              | Password          |
|---------|-----------------------|-------------------|
| Admin   | admin@example.com     | adminpassword     |
| Teacher | teacher1@example.com  | teacher1password  |
| Teacher | teacher2@example.com  | teacher2password  |
| Student | student1@example.com  | student1password  |
| Student | student2@example.com  | student2password  |

These passwords are hashed using bcrypt before being stored in the database.

---

## Notes on Environment Variables

Here’s the updated section for your README file:

---

### `.env` File for Backend

The backend requires a `.env` file for configuration. If the file is missing, the backend won't start and will throw an error.

#### Example `.env` File

```plaintext
JWT_SECRET=your_secret_key
```

#### Using Environment Variables with Docker

When running the application with Docker, the environment variables are stored in a `.env` file and passed to the backend container using the `docker-compose.yml` configuration.

Make sure the `.env` file is located in the `backend` directory and contains the necessary configuration. For example:

```plaintext
JWT_SECRET=your_secret_key
```

---

## Additional Docker Details

1. **Database Initialization:**
   - During Docker startup, the database is created and initialized using `schema.sql`.

2. **Health Checks:**
   - The backend includes a health check to ensure it's running properly.

3. **Volume Mounting:**
   - The database is stored in a Docker volume, so data persists even if the container is stopped or restarted.

---
