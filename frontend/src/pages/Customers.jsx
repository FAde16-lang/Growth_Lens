import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', initialBalance: '' });
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // For handling payments
    const [transactionAmount, setTransactionAmount] = useState('');

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/customers', newCustomer);
            setNewCustomer({ name: '', phone: '', initialBalance: '' });
            fetchCustomers();
            alert('Customer Added');
        } catch (err) {
            alert('Error adding customer');
        }
        setLoading(false);
    };

    const handleTransaction = async (type) => {
        if (!selectedCustomer || !transactionAmount) return;
        try {
            await api.put(`/customers/${selectedCustomer._id}/balance`, {
                amount: transactionAmount,
                type // 'credit' (Udhaar) or 'payment' (Paid back)
            });
            setTransactionAmount('');
            setSelectedCustomer(null);
            fetchCustomers();
        } catch (err) {
            alert('Transaction failed');
        }
    };

    return (
        <div className="screen-container">
            <h1 className="h1 mb-6">Khata Book</h1>

            {/* Total Receivables */}
            <div className="card mb-6" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' }}>
                <div className="text-sm" style={{ color: '#3b82f6' }}>Total To Collect (Udhaar)</div>
                <div className="h2" style={{ color: '#3b82f6' }}>
                    ${customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0).toLocaleString()}
                </div>
            </div>

            {/* Add New Customer */}
            <div className="card mb-6">
                <h3 className="h3 mb-4">Add New Customer</h3>
                <form onSubmit={handleAddCustomer} className="flex-col">
                    <input className="input-field" placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
                    <div className="grid-2">
                        <input className="input-field" placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} required />
                        <input className="input-field" type="number" placeholder="Initial Balance" value={newCustomer.initialBalance} onChange={e => setNewCustomer({ ...newCustomer, initialBalance: e.target.value })} />
                    </div>
                    <button className="btn btn-primary" disabled={loading}>+ Add Customer</button>
                </form>
            </div>

            {/* Customer List */}
            <h3 className="h3 mb-4">Your Customers</h3>
            <div className="flex-col" style={{ paddingBottom: '80px' }}>
                {customers.map(c => (
                    <div key={c._id} className="card" style={{ margin: 0 }}>
                        <div className="flex-between">
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                                <div className="text-xs text-muted">{c.phone}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="text-xs text-muted">Balance</div>
                                <div style={{ fontWeight: 'bold', color: c.balance > 0 ? '#dc2626' : '#059669' }}>
                                    {c.balance > 0 ? `Owes $${c.balance}` : `Advance $${Math.abs(c.balance)}`}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid-2 mt-4" style={{ gap: '0.5rem' }}>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem' }} onClick={() => setSelectedCustomer({ ...c, type: 'credit' })}>
                                + Give Udhaar
                            </button>
                            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }} onClick={() => setSelectedCustomer({ ...c, type: 'payment' })}>
                                ✓ Receive Payment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transaction Modal (Simple inline overlay) */}
            {selectedCustomer && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
                        <h3 className="h3 mb-4">
                            {selectedCustomer.type === 'credit' ? 'Give Udhaar to ' : 'Receive Money from '}
                            {selectedCustomer.name}
                        </h3>
                        <input
                            className="input-field mb-4"
                            type="number"
                            placeholder="Amount"
                            value={transactionAmount}
                            onChange={e => setTransactionAmount(e.target.value)}
                            autoFocus
                        />
                        <div className="grid-2">
                            <button className="btn btn-outline" onClick={() => { setSelectedCustomer(null); setTransactionAmount(''); }}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => handleTransaction(selectedCustomer.type)}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
