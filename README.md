# Growth_Lens

This is a modern, full-stack application built with the MERN stack (MongoDB, Express, React, Node.js) and wrapped in **Electron** to function seamlessly as a powerful cross-platform Desktop Application.

## Project Structure

-   `frontend`: React application (Vite)
-   `backend`: Node.js/Express API
-   `electron-main.js`: The Electron wrapper connecting the compiled frontend with the backend capabilities.

## Quick Start (Desktop App Mode)

The application is configured to spin up the Database API, the Frontend Webpack dev server, and the Electron desktop window all at the same time with a single command!

### 1. Root Setup
From the root of the project, install all dependencies simultaneously:
```bash
npm run install:all
```

### 2. Environment Variables
- **Backend:** Inside the `/backend` folder, duplicate `.env.example` -> `.env` and configure your `MONGODB_URI`.
- **Frontend:** Inside the `/frontend` folder, duplicate `.env.example` -> `.env` and verify `VITE_API_BASE_URL`.

### 3. Launch the Application
From the root of the project, run:
```bash
npm start
```

> **Note:** The `npm start` command uses `concurrently` to boot the backend, wait for the frontend Vite server, and finally deploy the native Electron desktop experience window cleanly over it.

---

## Alternative: Manual Web Mode (Browser Only)
If you prefer developing in a standard web browser without the Electron window:

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run dev
```
