import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [metrics, setMetrics] = useState({ totalSales: 0, totalProfit: 0, profitMargin: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const oRes = await api.get('/orders');
            const pRes = await api.get('/products');
            const eRes = await api.get('/expenses'); // Fetch Expenses
            setOrders(oRes.data);
            setProducts(pRes.data);
            calculateMetrics(oRes.data, eRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const calculateMetrics = (ordersData, expensesData) => {
        const totalSales = ordersData.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const grossProfit = ordersData.reduce((acc, curr) => acc + (curr.totalProfit || 0), 0);
        const totalExpenses = expensesData.reduce((acc, curr) => acc + curr.amount, 0);

        const netProfit = grossProfit - totalExpenses;
        const margin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

        setMetrics({ totalSales, totalProfit: netProfit, profitMargin: margin.toFixed(1), totalExpenses });
    };

    // Prepare Chart Data
    // 1. Sales vs Profit (Last 5 Orders)
    const chartData = orders.slice(0, 7).reverse().map(o => ({
        name: '#' + o._id.slice(-4),
        Sales: o.totalAmount,
        Profit: o.totalProfit || 0
    }));

    return (
        <div className="screen-container">
            <h1 className="h1 mb-6">Business Analytics</h1>

            {/* Metrics Cards */}
            <div className="grid-2 mb-6">
                <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                    <div className="text-sm text-muted">Total Sales</div>
                    <div className="h2">${metrics.totalSales.toLocaleString()}</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                    <div className="text-sm text-muted">Net Profit</div>
                    <div className="h2" style={{ color: 'var(--accent-color)' }}>${metrics.totalProfit.toLocaleString()}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="card mb-6">
                <div className="h3 mb-4">Sales vs Profit (Recent Orders)</div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)' }} />
                            <YAxis tick={{ fill: 'var(--text-muted)' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="Sales" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Profit" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <div className="h3 mb-4">Inventory Value</div>
                <div className="flex-between">
                    <span>Total Items:</span>
                    <span className="font-bold">{products.length}</span>
                </div>
                <div className="flex-between mt-2">
                    <span>Stock Value (Cost):</span>
                    <span className="font-bold">${products.reduce((acc, p) => acc + (p.cost || 0) * p.stock, 0).toLocaleString()}</span>
                </div>
                <div className="flex-between mt-2">
                    <span>Potential Sales Value:</span>
                    <span className="font-bold">${products.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
