# 🏡 StayNest – Full Stack Home Rental Platform

StayNest is a full-stack home rental web application inspired by Airbnb.  
It allows users to explore, book, and manage rental properties with role-based authentication for guests and hosts.

---

## 🚀 Live Demo

🔗 Live: https://staynest-1-f4l6.onrender.com  

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration & login
- Role-based access (Guest / Host)
- Session-based authentication
- Protected host routes

### 🏠 Host Functionality

- Add new property listings
- Upload property images & documents
- Edit and delete only their own listings
- View all properties added by the host

### 🛒 Guest Functionality

- Browse all available homes
- Add/remove favourites
- Book properties
- Prevent duplicate bookings
- View booked properties

### 🔐 Security

- CSRF protection
- Session management with MongoDB store
- Environment variables for sensitive data

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary

### Frontend

- EJS (Server-side rendering)
- Tailwind CSS

### Other Tools

- Express-session
- Connect-MongoDB-Session
- Multer (File uploads)
- dotenv

---

## 🏗 Project Structure

├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── uploads/
├── app.js
├── package.json
└── .env

---

## ⚙️ Installation (Run Locally)

1. Clone the repository

2. Install dependencies = npm install

3. Create a `.env` file in the root directory:
   MONGO_URL=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key

4. Start the server :npm start

5. Open in browser: http://localhost:3000

---

## 🌍 Deployment

- Backend hosted on Render
- Database hosted on MongoDB Atlas

---

## 📌 Future Improvements

- Cloud-based image storage (Cloudinary) =>Done
- Payment integration
- Reviews & ratings system
- Advanced search & filtering
- Admin dashboard

---

## 📄 License

This project is built for educational and portfolio purposes.

---

## 🙌 Inspiration

Inspired by Airbnb’s rental platform concept, built independently to demonstrate full-stack development skills.

---

### 💼 Author

Anshul Sharma  
Full Stack Developer
