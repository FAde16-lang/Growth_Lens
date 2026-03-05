import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0
    });
    // Product Form State
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        stock: ''
    });

    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', productForm);
            alert('Product Created Successfully!');
            setProductForm({ name: '', price: '', stock: '' });
            fetchStats(); // Update stats
        } catch (err) {
            console.error(err);
            alert('Failed to create product');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className='screen-container' style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '2rem' }}>
            <header className="app-bar mb-6" style={{ borderRadius: '16px' }}>
                <h1 className='h2' style={{ margin: 0, color: 'var(--primary-color)' }}>Admin Dashboard</h1>
                <button className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={logout}>Logout</button>
            </header>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                <div className="card text-center">
                    <h3 className="text-sm">Total Users</h3>
                    <p className="h1">{stats.totalUsers}</p>
                </div>
                <div className="card text-center">
                    <h3 className="text-sm">Products</h3>
                    <p className="h1">{stats.totalProducts}</p>
                </div>
                <div className="card text-center">
                    <h3 className="text-sm">Revenue</h3>
                    <p className="h1" style={{ color: 'var(--success-color)' }}>${stats.revenue}</p>
                </div>
            </div>

            {/* Create Product Form */}
            <section className="card mb-6" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="h2 text-center">Add New Product</h2>
                <form onSubmit={handleProductSubmit}>
                    <input
                        className="input-field"
                        name="name"
                        placeholder="Product Name"
                        value={productForm.name}
                        onChange={handleProductChange}
                        required
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            className="input-field"
                            name="price"
                            type="number"
                            placeholder="Price ($)"
                            value={productForm.price}
                            onChange={handleProductChange}
                            required
                        />
                        <input
                            className="input-field"
                            name="stock"
                            type="number"
                            placeholder="Stock Qty"
                            value={productForm.stock}
                            onChange={handleProductChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Product</button>
                </form>
            </section>
        </div>
    );
};

export default AdminDashboard;
