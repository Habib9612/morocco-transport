# LoadHive - Morocco Transport Project

A full-stack application with React TypeScript frontend and Node.js Express backend for transportation services in Morocco.

## 🚀 Project Status
**BOTH FRONTEND AND BACKEND ARE FULLY OPERATIONAL**

## 📁 Project Structure
```
morocco-transport-project/
├── frontend/          # React TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── backend/           # Node.js Express API backend
    ├── app.js
    ├── package.json
    └── .env.local
```

## 🔧 Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on: http://localhost:5173/

### Backend
```bash
cd backend
npm install
npm start
```
- Backend API runs on: http://localhost:5001/

## ✅ Features
- **Frontend**: Vite + TypeScript + React template
- **Backend**: Express.js API with authentication endpoints
- **Health Check**: Backend API health endpoint available
- **CORS**: Configured for cross-origin requests
- **Environment**: Environment variables configured

## 🌐 API Endpoints
- `GET /` - API health check
- Authentication endpoints available

## 🔗 Repository
This project was successfully implemented with both services running simultaneously without conflicts.

## 📝 Development Notes
- Frontend uses Vite for fast development
- Backend includes authentication service
- Both services tested and verified working
- Port conflicts resolved (frontend: 5173, backend: 5001)

