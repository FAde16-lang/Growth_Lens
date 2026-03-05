import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const ScannerModal = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);

    const handleUpdate = (err, result) => {
        if (err) {
            // console.error(err);
            return;
        }
        if (result) {
            onScan(result.text);
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <h2 className="h2" style={{ color: 'white', marginBottom: '1rem' }}>Scan Barcode</h2>

            <div style={{
                width: '300px', height: '300px',
                border: '4px solid #10b981', borderRadius: '20px',
                overflow: 'hidden', position: 'relative', background: '#000'
            }}>
                <BarcodeScannerComponent
                    width={300}
                    height={300}
                    onUpdate={handleUpdate}
                    onError={(err) => setError(err?.message)}
                />
            </div>

            {error && <p style={{ color: 'red', marginTop: '1rem' }}>Camera Error: {error}</p>}

            <button
                className="btn btn-outline"
                style={{ marginTop: '2rem', borderColor: 'white', color: 'white' }}
                onClick={onClose}
            >
                Cancel
            </button>
        </div>
    );
};

export default ScannerModal;
