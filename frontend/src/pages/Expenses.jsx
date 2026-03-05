import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Other' });
    const [loading, setLoading] = useState(false);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/expenses', newExpense);
            setNewExpense({ title: '', amount: '', category: 'Other' });
            fetchExpenses();
            alert('Expense Added');
        } catch (err) {
            alert('Error adding expense');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (err) {
            alert('Error deleting');
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="screen-container">
            <h1 className="h1 mb-6">Expenses</h1>

            {/* Total Card */}
            <div className="card mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)' }}>
                <div className="text-sm text-danger" style={{ color: 'var(--danger-color)' }}>Total Expenses</div>
                <div className="h2" style={{ color: 'var(--danger-color)' }}>${totalExpenses.toLocaleString()}</div>
            </div>

            {/* Add Expense Form */}
            <div className="card mb-6">
                <h3 className="h3 mb-4">Add New Expense</h3>
                <form onSubmit={handleSubmit} className="flex-col">
                    <input className="input-field" placeholder="Title (e.g. Shop Rent)" value={newExpense.title} onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} required />
                    <div className="grid-2">
                        <input className="input-field" type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} required />
                        <select className="input-field" value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                            <option value="Rent">Rent</option>
                            <option value="Salary">Salary</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Inventory">Inventory</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button className="btn btn-danger" style={{ backgroundColor: '#ef4444', color: 'white' }} disabled={loading}>
                        {loading ? 'Adding...' : 'Save Expense'}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="flex-col" style={{ paddingBottom: '80px' }}>
                {expenses.map(exp => (
                    <div key={exp._id} className="card flex-between" style={{ padding: '1rem', margin: 0 }}>
                        <div>
                            <div style={{ fontWeight: '500' }}>{exp.title}</div>
                            <div className="text-xs text-muted">{new Date(exp.date).toLocaleDateString()} • {exp.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>-${exp.amount}</div>
                            <button className="text-xs text-muted" style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleDelete(exp._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Expenses;
