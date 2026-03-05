import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ScannerModal from '../components/ScannerModal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', cost: '', stock: '', barcode: '' });

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [scannerTarget, setScannerTarget] = useState('add'); // 'add' or 'edit'

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', newProduct);
            setIsAdding(false);
            setNewProduct({ name: '', price: '', cost: '', stock: '', barcode: '' });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error adding product');
        }
    };

    const [editProduct, setEditProduct] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editProduct._id}`, editProduct);
            setEditProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Error updating product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleScanResult = (code) => {
        if (scannerTarget === 'add') {
            setNewProduct(prev => ({ ...prev, barcode: code }));
        } else {
            setEditProduct(prev => ({ ...prev, barcode: code }));
        }
    };

    const openScanner = (mode) => {
        setScannerTarget(mode);
        setShowScanner(true);
    };

    return (
        <div className="screen-container">
            <div className="flex-between mb-6">
                <h1 className="h1">Inventory</h1>
                <div className="text-sm">{products.length} Items</div>
            </div>

            {/* Product List */}
            <div className="flex-col" style={{ paddingBottom: '80px' }}>
                {products.map(p => (
                    <div key={p._id} className="card" style={{ margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="h3">{p.name}</div>
                            <div className="text-sm text-muted">Stock: <span style={{ color: p.stock < 5 ? 'var(--warning-color)' : 'inherit', fontWeight: 'bold' }}>{p.stock}</span></div>
                            {p.barcode && <div className="text-sm text-muted">Tag: {p.barcode}</div>}
                        </div>
                        <div className="text-right">
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>${p.price}</div>
                            <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', marginTop: '0.3rem' }} onClick={() => setEditProduct(p)}>
                                ✏️ Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Product Modal */}
            {isAdding && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px', margin: 0 }}>
                        <h2 className="h2 mb-4">Add New Item</h2>
                        <form onSubmit={handleAdd} className="flex-col">
                            <input className="input-field" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                            <div className="grid-2">
                                <input className="input-field" type="number" placeholder="Sell Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                                <input className="input-field" type="number" placeholder="Cost Price" value={newProduct.cost} onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })} />
                            </div>
                            <input className="input-field" type="number" placeholder="Stock Qty" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required />

                            <div className="flex-between gap-2">
                                <input className="input-field" placeholder="Barcode (Scan ->)" value={newProduct.barcode} onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })} />
                                <button type="button" className="btn btn-secondary" onClick={() => openScanner('add')}>📷</button>
                            </div>

                            <div className="grid-2 mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editProduct && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px', margin: 0 }}>
                        <div className="flex-between mb-4">
                            <h2 className="h2">Edit Item</h2>
                            <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => { handleDelete(editProduct._id); setEditProduct(null); }}>
                                🗑️ Delete
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="flex-col">
                            <input className="input-field" placeholder="Product Name" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} required />
                            <div className="grid-2">
                                <input className="input-field" type="number" placeholder="Sell Price" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} required />
                                <input className="input-field" type="number" placeholder="Stock Qty" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })} required />
                            </div>

                            <div className="flex-between gap-2">
                                <input className="input-field" placeholder="Barcode" value={editProduct.barcode || ''} onChange={e => setEditProduct({ ...editProduct, barcode: e.target.value })} />
                                <button type="button" className="btn btn-secondary" onClick={() => openScanner('edit')}>📷</button>
                            </div>

                            <div className="grid-2 mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => setEditProduct(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Camera Modal */}
            {showScanner && (
                <ScannerModal
                    onScan={handleScanResult}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* FAB */}
            <div className="fab" onClick={() => setIsAdding(true)}>+</div>
        </div>
    );
};

export default Products;
