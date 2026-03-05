import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { generateInvoice } from '../utils/InvoiceGenerator';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // New Order State
    const [cart, setCart] = useState({}); // { productId: qty }

    const fetchData = async () => {
        const oRes = await api.get('/orders');
        setOrders(oRes.data);
        const pRes = await api.get('/products');
        setProducts(pRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const addToCart = (pid) => {
        setCart(prev => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));
    };

    const submitOrder = async () => {
        const items = Object.entries(cart).map(([pid, qty]) => {
            const p = products.find(x => x._id === pid);
            return { product: pid, name: p.name, quantity: qty, price: p.price };
        });

        if (items.length === 0) return;

        const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        try {
            await api.post('/orders', { items, totalAmount, customerName: 'Walk-in' });
            setIsCreating(false);
            setCart({});
            alert('Order Completed Successfully');
            fetchData();
        } catch (err) {
            alert('Order failed');
        }
    };

    if (isCreating) {
        return (
            <div className="screen-container">
                <div className="flex-between mb-4">
                    <h1 className="h2">New Order</h1>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setIsCreating(false)}>Cancel</button>
                </div>

                {/* Manual Item Entry */}
                <div className="card mb-4" style={{ border: '1px dashed var(--primary-color)' }}>
                    <div className="h3 mb-2">Add Custom Item</div>
                    <div className="grid-2">
                        <input className="input-field" placeholder="Item Name" id="custom-name" />
                        <input className="input-field" type="number" placeholder="Price" id="custom-price" />
                    </div>
                    <button className="btn btn-secondary mt-2" style={{ width: '100%' }} onClick={() => {
                        const name = document.getElementById('custom-name').value;
                        const price = parseFloat(document.getElementById('custom-price').value);
                        if (name && price) {
                            // Use a timestamp as a temp unique ID for custom items
                            const tempId = 'custom_' + Date.now();
                            // Add to local products list temporarily so it renders in cart logic
                            setProducts(prev => [...prev, { _id: tempId, name, price, stock: 999 }]);
                            // Add to cart
                            setCart(prev => ({ ...prev, [tempId]: 1 }));
                            // Clear inputs
                            document.getElementById('custom-name').value = '';
                            document.getElementById('custom-price').value = '';
                        }
                    }}>+ Add Custom Item</button>
                </div>

                {/* Product Selection */}
                <h3 className="h3 mb-2">Inventory Items</h3>
                <div className="flex-col mb-6">
                    {products.map(p => (
                        <div key={p._id} className="card" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                            <div>
                                <div style={{ fontWeight: '500' }}>{p.name}</div>
                                <div className="text-sm">${p.price} | Stock: {p.stock}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {cart[p._id] > 0 && <span style={{ fontWeight: 'bold' }}>{cart[p._id]}x</span>}
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => addToCart(p._id)} disabled={p.stock <= (cart[p._id] || 0)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Bar */}
                <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '1.5rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', zIndex: 200 }}>
                    <div className="flex-between mb-4">
                        <span className="text-muted">Total:</span>
                        <span className="h2" style={{ marginBottom: 0 }}>${Object.entries(cart).reduce((acc, [pid, qty]) => acc + (products.find(x => x._id === pid)?.price || 0) * qty, 0)}</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitOrder}>Complete Order</button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container">
            <div className="flex-between mb-6">
                <h1 className="h1">Orders</h1>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setIsCreating(true)}>+ New</button>
            </div>

            <div className="flex-col">
                {orders.map(order => (
                    <div key={order._id} className="card" style={{ margin: 0 }}>
                        <div className="flex-between mb-2">
                            <div className="text-sm text-muted">#{order._id.slice(-6)}</div>
                            <div className="badge badge-success">Completed</div>
                        </div>
                        <div className="flex-between">
                            <div style={{ fontWeight: '500' }}>{order.items.length} Items</div>
                            <div className="text-xs text-muted mt-2">{new Date(order.date).toLocaleString()}</div>
                        </div>
                        <div className="flex-between" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ fontWeight: 'bold' }}>Total: ${order.totalAmount}</div>
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => generateInvoice(order)}>
                                📄 Invoice
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
