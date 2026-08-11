# QuizSphere – Open Source Online Assessment Platform

<p align="center">
  <h3 align="center">A Modern MERN Stack Based Online Assessment Platform</h3>
  <p align="center">
    Built for educational institutions and organizations to conduct secure, scalable, and efficient online assessments.
  </p>
</p>

---

## 📌 About the Project

QuizSphere was originally developed as a **college academic project** to simplify the process of conducting online examinations. It is now being actively enhanced into an **open-source project**, focusing on scalability, maintainability, and community-driven development.

The platform provides a complete online examination system with role-based access for **Administrators**, **Examiners**, and **Candidates**, enabling secure quiz creation, automated evaluation, result analysis, and performance tracking.

The goal is to build a production-ready assessment platform while encouraging contributors to learn and collaborate through open-source development.

---

## 🚀 Features

### 🔐 Authentication
- Secure Login & Registration
- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Access Control (RBAC)

### 👨‍💼 Admin
- Manage Users
- Manage Examiners
- Manage Candidates
- Dashboard Analytics
- View Feedback
- Monitor Platform Activity

### 👨‍🏫 Examiner
- Create Quizzes
- Add/Edit/Delete Questions
- Schedule Exams
- Configure Negative Marking
- Auto Evaluation
- View Student Performance

### 👨‍🎓 Candidate
- Register/Login
- Attempt Scheduled Quizzes
- Live Timer
- Instant Results
- Performance History

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT
- bcrypt

### Tools
- Git
- GitHub
- Postman

---

## 📂 Project Structure

```
QuizSphere
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── package.json
│
├── docs
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/SauravPandey56/QuizApplication.git
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
cd ../client
npm start
```

---

## 📌 Project Status

This project was initially developed as part of a college academic project and is currently being transformed into a production-ready open-source platform.

Current development focuses on:

- Improved project architecture
- Better documentation
- Modular codebase
- Contributor-friendly workflow
- Feature enhancements
- Testing and optimization

---

## 🎯 Roadmap

- Improve UI/UX
- Dark Mode
- Real-Time Quiz Support
- AI Question Suggestions
- Email Notifications
- Docker Support
- Unit Testing
- Analytics Dashboard
- Multi-language Support
- Mobile Application

---

## 🤝 Contributing

Contributions are welcome!

You can help by:

- Fixing bugs
- Improving documentation
- Enhancing UI/UX
- Developing new features
- Writing tests
- Optimizing APIs

Please read the `CONTRIBUTING.md` before submitting a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Saurav Pandey**

- GitHub: https://github.com/SauravPandey56
- LinkedIn: www.linkedin.com/in/sauravpandey56

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
