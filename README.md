# 🌍 LifeChain

LifeChain is a MERN Stack based community disaster assistance platform that connects people who need help with nearby responders in real time.

## 🚀 Features

- 📱 Phone number based login
- 📍 Automatic location detection using browser Geolocation API
- 🤝 Nearby responder matching within 5 km
- 🆘 Create emergency help requests
- ✅ Accept help requests
- 🗺️ Google Maps navigation
- ✔️ Mark help as completed
- 🔐 Requester verification before completion
- 👤 Single user can act as Requester or Responder
- 🛡️ Admin dashboard for managing users and requests
- 📢 Notification support

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

---

## 📂 Project Structure

```
LifeChain
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Greeshmanth-P/LifeChain.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

PORT=5000

FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Future Enhancements

- Offline mesh networking
- OTP authentication
- Real-time notifications
- Image upload support
- AI-based request prioritization
- Mobile application

---

## 👨‍💻 Author

**Greeshmanth Puppala**

GitHub:

https://github.com/Greeshmanth-P

LinkedIn:

(Add your LinkedIn profile here)

---

## ⭐ If you like this project

Please consider giving this repository a Star ⭐