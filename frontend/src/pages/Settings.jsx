import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Staff Management State
    const [isAddingStaff, setIsAddingStaff] = useState(false);
    const [staffData, setStaffData] = useState({ name: '', email: '', password: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
    }, [theme]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', profile);
            setIsEditing(false);
            alert('Profile Updated');
        } catch (err) {
            alert('Update Failed');
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/staff', staffData);
            setStaffData({ name: '', email: '', password: '' });
            setIsAddingStaff(false);
            alert('Staff Member Created! They can now login.');
        } catch (err) {
            alert('Failed to add staff. Email might be taken.');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="screen-container">
            <h1 className="h1 mb-6">Settings</h1>

            {/* Profile Card */}
            <div className="card mb-6">
                <div className="flex-between mb-4">
                    <h2 className="h3">Business Profile</h2>
                    <button className="btn btn-outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="flex-col">
                        <input className="input-field" value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Business Name" />
                        <input className="input-field" value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tagline / Bio" />
                        <input className="input-field" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
                        <input className="input-field" value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} placeholder="Address" />
                        <button className="btn btn-primary">Save Changes</button>
                    </form>
                ) : (
                    <div>
                        <div className="flex-between mb-2">
                            <span className="text-muted">Name:</span>
                            <span className="font-bold">{profile.name}</span>
                        </div>
                        <div className="flex-between mb-2">
                            <span className="text-muted">Email:</span>
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex-between mb-2">
                            <span className="text-muted">Role:</span>
                            <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{profile.role || 'Owner'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Staff Management (Owner Only) */}
            {profile.role === 'owner' && (
                <div className="card mb-6">
                    <div className="h3 mb-4">Team Management</div>
                    {!isAddingStaff ? (
                        <button className="btn btn-primary" style={{ background: '#2563eb' }} onClick={() => setIsAddingStaff(true)}>+ Add Staff Member</button>
                    ) : (
                        <form onSubmit={handleAddStaff} className="flex-col">
                            <input className="input-field" placeholder="Staff Name" value={staffData.name} onChange={e => setStaffData({ ...staffData, name: e.target.value })} required />
                            <input className="input-field" placeholder="Staff Email" value={staffData.email} onChange={e => setStaffData({ ...staffData, email: e.target.value })} required />
                            <input className="input-field" type="password" placeholder="Create Password" value={staffData.password} onChange={e => setStaffData({ ...staffData, password: e.target.value })} required />
                            <div className="grid-2">
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddingStaff(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Account</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* App Settings */}
            <div className="card">
                <h2 className="h3 mb-4">App Preferences</h2>
                <div className="flex-between mb-4">
                    <span>Dark Mode</span>
                    <button className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
                        <div className="toggle-thumb"></div>
                    </button>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} onClick={logout}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Settings;
