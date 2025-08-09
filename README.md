# 🗓️ Calendar App

A simple calendar-based appointment scheduling app built with:

- ⚛️ **Frontend:** React + Vite + Tailwind CSS  
- 🔙 **Backend:** Express.js + SQLite  
- 🔐 **Auth:** JWT-based login/register system  

---

## 🛠️ Getting Started

### 📦 Install Dependencies

#### Backend (Server)

```bash
cd server
npm install

cd client
npm install
cd server

# If nodemon is installed
npm run start

# OR if nodemon is not installed
node server.js

cd client
npm run dev

Email:    suneel@gmail.com
Password: 123

Features
View weekly calendar using FullCalendar

Add new appointments by selecting time slots

Fill out visit details (title, patient, time range)

Prevent scheduling overlapping visits for the same patient

View all visits in a calendar interface

Secure login system using JWT

Automatically refreshes the calendar after adding a visit

Project Structure
project-root/
│
├── server/             # Express backend
│   ├── server.js       # Entry point
│   ├── routes/         # API endpoints
│   ├── db/             # SQLite DB and queries
│   └── .env            # Environment variables (e.g. JWT_SECRET)
│
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── slice/      # Redux slices
│   │   └── utils/
│   └── vite.config.js  # Vite config
│
├── README.md           # Project documentation

