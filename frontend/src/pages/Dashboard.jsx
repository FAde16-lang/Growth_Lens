import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);
                const orderRes = await api.get('/orders');
                setOrders(orderRes.data);
                const userRes = await api.get('/users/profile');
                setProfile(userRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // Metrics
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockItems = products.filter(p => p.stock < 5).length;
    // Calculate today's sales (Mock logic for now, or filter orders by date)
    const todaysSales = orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length;
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

    return (
        <div className="screen-container">
            {/* Header */}
            <div className="flex-between mb-6">
                <div>
                    <div className="text-sm">Welcome back,</div>
                    <h1 className="h2">{profile.name || 'Business Owner'}</h1>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {profile.name ? profile.name.charAt(0) : 'U'}
                </div>
            </div>

            {/* Primary Metric Card */}
            <div className="card" style={{ background: 'var(--primary-color)', color: 'white' }}>
                <div className="text-sm" style={{ color: 'var(--primary-light)' }}>Total Revenue</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>${totalRevenue.toLocaleString()}</div>
                <div className="flex-between">
                    <span className="badge badge-success" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>+{todaysSales} Orders Today</span>
                </div>
            </div>

            {/* Grid Metrics */}
            <div className="grid-2 mb-6">
                <div className="card" onClick={() => navigate('/products')}>
                    <div className="nav-icon" style={{ color: 'var(--primary-color)' }}>📦</div>
                    <div className="h3" style={{ marginTop: '0.5rem' }}>{products.length} Products</div>
                    <div className="text-xs">{totalStock} units in stock</div>
                </div>
                <div className="card" onClick={() => navigate('/expenses')}>
                    <div className="nav-icon" style={{ color: 'var(--danger-color)' }}>💸</div>
                    <div className="h3" style={{ marginTop: '0.5rem' }}>Expenses</div>
                    <div className="text-xs">Manage Bills & Rent</div>
                </div>
                <div className="card" onClick={() => navigate('/customers')}>
                    <div className="nav-icon" style={{ color: '#2563eb' }}>📒</div>
                    <div className="h3" style={{ marginTop: '0.5rem' }}>Khata</div>
                    <div className="text-xs">Credit & Udhaar</div>
                </div>
                <div className="card" style={{ border: lowStockItems > 0 ? '2px solid var(--danger-color)' : '', background: lowStockItems > 0 ? 'rgba(239, 68, 68, 0.1)' : '' }}>
                    <div className="nav-icon" style={{ color: lowStockItems > 0 ? 'var(--danger-color)' : 'var(--warning-color)' }}>⚠️</div>
                    <div className="h3" style={{ marginTop: '0.5rem', color: lowStockItems > 0 ? 'var(--danger-color)' : '' }}>{lowStockItems} Alerts</div>
                    <div className="text-xs" style={{ color: lowStockItems > 0 ? 'var(--danger-color)' : '' }}>Low stock items</div>
                </div>
            </div>

            {/* Recent Activity */}
            <section>
                <h2 className="h3 mb-4">Recent Activity</h2>
                <div className="flex-col">
                    {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                💰
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>New Order #{order._id.slice(-4)}</div>
                                <div className="text-xs text-muted">{new Date(order.date).toLocaleTimeString()}</div>
                            </div>
                            <div style={{ fontWeight: '600' }}>+${order.totalAmount}</div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="text-muted text-center text-sm">No recent activity</div>}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
