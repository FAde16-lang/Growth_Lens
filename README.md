# MERN Stack Application

This is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

-   `frontend`: React application (Vite)
-   `backend`: Node.js/Express API

## Quick Start
You need to run the backend and frontend in separate terminals.

### 1. Backend Setup
1.  Go to `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Copy `.env.example` to `.env`
    -   Update `MONGODB_URI` with your MongoDB connection string.
4.  Start server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Go to `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Copy `.env.example` to `.env`
    -   Ensure `VITE_API_BASE_URL` matches your backend URL.
4.  Start development server:
    ```bash
    npm run dev
    ```

## Features
-   **Separated Frontend & Backend**
-   **Authentication** (Placeholder JWT flow)
-   **Product Listing** (Mock data)
-   **Environment Configuration** via `.env` files
