import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import React, { useState, useEffect } from 'react';

// Placeholder Pages (We will implement these next)
import Products from './pages/Products';
import Orders from './pages/Orders';
import Scan from './pages/Scan';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Expenses from './pages/Expenses';
import Customers from './pages/Customers';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsAuthenticated(true);

        // Initialize Theme (Default to Dark)
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', savedTheme);
    }, []);

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        return token ? children : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Protected Routes with Bottom Nav Layout */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/scan" element={<Scan />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
