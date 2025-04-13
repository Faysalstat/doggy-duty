# 🐾 DoggyDuty

DoggyDuty is a full-stack web application developed to help manage community-based services such as pet waste management and garbage collection. The system includes functionality for scheduling, creating tasks, tracking inventory (such as decoration tools), managing service costs, and sending automated reminders. It is built using Angular for the frontend and Node.js with Express.js for the backend, with MySQL as the relational database and Sequelize as the ORM.

---

## 🏗️ Application Architecture

### 🔹 Frontend (Angular)
- Developed using Angular (TypeScript).
- Provides a responsive and interactive user interface.
- Communicates with backend services using RESTful APIs.
- Displays data related to users, services, communities, schedules, and job tasks.

### 🔹 Backend (Node.js + Express.js)
- Built using Node.js and Express.js.
- Manages all server-side logic, routing, authentication, and API endpoints.
- Sequelize is used for object-relational mapping with a MySQL database.
- Responsible for job generation, service tracking, cost calculation, and email reminders.

### 🔹 Database (MySQL)
- Stores user profiles, communities, tasks, services, inventories, costs, and logs.
- Sequelize models define all relationships and schema structure.

---

## ⚙️ Technologies Used

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Angular, TypeScript     |
| Backend    | Node.js, Express.js     |
| Database   | MySQL                   |
| ORM        | Sequelize               |
| Others     | CORS, node cron, dotenv |

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure the following tools are installed:
- Node.js (v16 or later)
- Angular CLI (v14 or later)
- MySQL Server

---

### 🔧 Backend Setup

```bash
cd service/api-service
npm install
```
### database
Make sure you created the database and the database information should be defined in the code.
src>connector>db-connector.js

#### ▶️ Run the Backend

```bash
npm start
```

The backend server will run at: `http://localhost:3000`

---

### 🖥️ Frontend Setup

```bash
cd web/webapp
npm install
npm start
```

The frontend app will be accessible at: `http://localhost:4200`

Make sure the backend server is running before using the frontend.

---


## 🧠 Features

- Community service scheduling
- Automatic daily job/task creation
- Service duration & cost tracking
- Email reminders for scheduled tasks
- RESTful API integration between frontend & backend

---

## 📄 License

This project is developed for private use and distribution is not permitted without consent.

---

## 📬 Contact

For questions or support, please reach out to the developer directly.