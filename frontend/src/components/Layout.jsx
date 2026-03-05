import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout = () => {
    const [role, setRole] = React.useState('owner');

    React.useEffect(() => {
        const fetchRole = async () => {
            try {
                // We assume api is imported or we use local helper
                // For simplicity in this layout, we'll assume the profile call in App/Dashboard syncs, 
                // but better to fetch here or read from localStorage if stored.
                // Let's do a quick fetch
                const token = localStorage.getItem('token');
                if (!token) return;

                // Using fetch directly to avoid circular dependency loop if api.js imports layout (unlikely but safe)
                const res = await fetch('http://localhost:5000/api/users/profile', {
                    headers: { 'x-auth-token': token }
                });
                const data = await res.json();
                if (data.role) setRole(data.role);
            } catch (err) { console.error(err); }
        };
        fetchRole();
    }, []);

    return (
        <>
            <div style={{ minHeight: '100vh' }}>
                <Outlet context={{ role }} />
            </div>
            <nav className="bottom-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span>
                    <span>Home</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📦</span>
                    <span>Products</span>
                </NavLink>
                {/* Center Scan Button Effect */}
                <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div style={{
                        width: '50px', height: '50px', background: 'var(--primary-color)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        marginTop: '-25px', boxShadow: '0 4px 10px rgba(22,101,52,0.3)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                    </div>
                    <span style={{ marginTop: '4px' }}>Scan</span>
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📄</span>
                    <span>Orders</span>
                </NavLink>

                {role === 'owner' && (
                    <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📊</span>
                        <span>Growth</span>
                    </NavLink>
                )}

                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">⚙️</span>
                    <span>Settings</span>
                </NavLink>
            </nav>
        </>
    );
};

export default Layout;
