# 📝 Task List API

<p align="center">
  <img src="https://github.com/user-attachments/assets/197eb19f-744e-4879-93b7-c5941e01372c" alt="Project Preview">
</p>

A simple and efficient **Task Management API**, built with Node.js and Express, featuring user authentication, task CRUD operations, and PDF report generation.

---

## 📁 Project Structure

```bash
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── tasksController.js
│   │   └── tests
│   │       └── tasksController.spec.js
│   ├── middlewares
│   │   └── tasksMiddleware.js
│   ├── models
│   │   ├── connection.js
│   │   ├── taskSchema.js
│   │   └── userSchema.js
│   ├── router.js
│   └── testeAddUser.js
└── vercel.json
```

---

## 🧭 API Routes

All routes go through the global middleware **`validateDay`**, which runs before any request.
This middleware performs general validations such as date/time control or access restrictions.

### 📡 Available Endpoints

| Method   | Route        | Middleware(s)                                                    | Description                                   |
| :------- | :----------- | :--------------------------------------------------------------- | :-------------------------------------------- |
| `POST`   | `/logar`     | `validateDay`                                                    | Logs in the user.                             |
| `GET`    | `/tasks`     | `validateDay`, `authenticate`                                    | Returns all tasks for the authenticated user. |
| `GET`    | `/task/:id`  | `validateDay`, `authenticate`                                    | Returns a specific task by its ID.            |
| `POST`   | `/tasks`     | `validateDay`, `authenticate`, `validateTitle`                   | Creates a new task.                           |
| `DELETE` | `/tasks/:id` | `validateDay`, `authenticate`                                    | Deletes a task by its ID.                     |
| `PUT`    | `/tasks/:id` | `validateDay`, `authenticate`, `validateTitle`, `validateStatus` | Updates an existing task.                     |
| `GET`    | `/pdf`       | `validateDay`, `authenticate`                                    | Generates a PDF report with all tasks.        |

---

### 🧩 Middlewares

* **`validateDay`** → Global middleware executed before all routes.
* **`authenticate`** → Ensures the user is authenticated before accessing a route.
* **`validateTitle`** → Checks if the `title` field is provided and valid.
* **`validateStatus`** → Verifies that the provided task status is allowed.

---

### 💡 Example Request

```http
GET /tasks HTTP/1.1
Host: apii-swart.vercel.app/logar
Authorization: Bearer <token>
```

---

## 📦 Dependencies

Main packages used in the project:

* **express** → Routing and HTTP server.
* **mongoose / mongodb** → MongoDB connection and data modeling.
* **mysql2** → MySQL database connection.
* **bcrypt** → Password hashing.
* **jsonwebtoken** → JWT authentication.
* **dotenv** → Environment variable management.
* **pdfkit** → PDF generation.
* **nodemon** → Auto-reload for development.
* **jest** → Unit testing.
* **multer** → File upload handling.
* **aws-sdk** → Integration with Amazon Web Services.

**Dev dependencies:** eslint, @eslint/js, globals.

---

## 🚀 Running the Project Locally

Follow these steps to set up the project on your local environment:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/VictorNicolau-coder/Task-list.git

# 2️⃣ Enter the project directory
cd Task-list

# 3️⃣ Install dependencies
npm install

# 4️⃣ Create a .env file (example below)
DB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key
PORT=3000

# 5️⃣ Run the server
npm run dev
```

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify it as you wish.

---

## ✨ Author

**Victor Nicolau**
👨‍💻 Computer Networks Technician | Information Systems Student
🔗 [GitHub Profile](https://github.com/VictorNicolau-coder)
