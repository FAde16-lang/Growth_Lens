import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import api from '../services/api';

const Scan = () => {
    const [scannedCode, setScannedCode] = useState('');
    const [foundProduct, setFoundProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(true);
    const [error, setError] = useState('');

    const handleScan = async (err, result) => {
        if (err) {
            // console.error(err); // Too noisy in logs usually
            return;
        }
        if (result && scanning) {
            setScanning(false); // Stop scanning immediately to prevent duplicate fetches
            const code = result.text;
            setScannedCode(code);
            await handleSimulateScan(code);
        }
    };

    const handleSimulateScan = async (code) => {
        if (!code) return;
        setLoading(true);
        try {
            const res = await api.get('/products');
            // Try to find by exact barcode match first, then by name includes as fallback
            const product = res.data.find(p =>
                (p.barcode && p.barcode === code) ||
                p.name.toLowerCase().includes(code.toLowerCase())
            );

            if (product) {
                setFoundProduct(product);
            } else {
                alert(`Product with code "${code}" not found.`);
                setFoundProduct(null);
                setScanning(true); // Restart scanning if not found
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch products');
            setScanning(true);
        }
        setLoading(false);
    };

    const handleUpdateStock = async (delta) => {
        if (!foundProduct) return;
        try {
            await api.put(`/products/${foundProduct._id}`, { stock: foundProduct.stock + delta });
            setFoundProduct({ ...foundProduct, stock: foundProduct.stock + delta });
            alert('Stock Updated');
        } catch (err) {
            alert('Update Failed');
        }
    };

    const resetScan = () => {
        setFoundProduct(null);
        setScannedCode('');
        setScanning(true);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'black', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Camera Viewfinder */}
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {scanning ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarcodeScannerComponent
                            width={500}
                            height={500}
                            onUpdate={handleScan}
                        />
                        {/* Overlay Guide */}
                        <div style={{ position: 'absolute', width: '280px', height: '280px', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '24px', boxShadow: '0 0 0 999px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                            <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderRadius: '4px 0 0 0' }}></div>
                            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderRadius: '0 4px 0 0' }}></div>
                            <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderRadius: '0 0 0 4px' }}></div>
                            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderRadius: '0 0 4px 0' }}></div>
                        </div>
                    </div>
                ) : (
                    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                        <h3>Product Found!</h3>
                        <button className="btn btn-outline" style={{ marginTop: '1rem', borderColor: 'white', color: 'white' }} onClick={resetScan}>Scan Another</button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ width: '100%', padding: '2rem', background: 'var(--card-bg)', borderRadius: '24px 24px 0 0' }}>
                <h1 className="h2 text-center mb-4">Scanner</h1>

                <div className="flex-between gap-2 mb-4">
                    <input
                        className="input-field"
                        placeholder="Or Enter Barcode Manually"
                        value={scannedCode}
                        onChange={e => setScannedCode(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={() => handleSimulateScan(scannedCode)} disabled={loading}>
                        {loading ? '...' : 'Search'}
                    </button>
                </div>

                {foundProduct && (
                    <div className="card" style={{ border: '2px solid var(--primary-color)' }}>
                        <div className="h3 mb-2">{foundProduct.name}</div>
                        <div className="flex-between mb-4">
                            <span>Price: ${foundProduct.price}</span>
                            <span style={{ fontWeight: 'bold' }}>Stock: {foundProduct.stock}</span>
                        </div>
                        <div className="grid-2">
                            <button className="btn btn-outline" onClick={() => handleUpdateStock(-1)}>-1 Stock</button>
                            <button className="btn btn-secondary" onClick={() => handleUpdateStock(1)}>+1 Stock</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scan;
