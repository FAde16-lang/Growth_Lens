import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import api from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      let res;
      if (isLogin) {
        res = await api.post('/auth/login', { email, password });
      } else {
        res = await api.post('/auth/register', { name, email, password });
      }

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      alert(err.response?.data?.msg || 'Authentication Failed');
    }
  };



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Decoded:', decoded);

      const { email, name, sub } = decoded;

      // Send to backend
      const res = await api.post('/auth/google', {
        email,
        name,
        googleId: sub
      });

      console.log('Backend Login Success:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Auth Error:', err);
      alert('Google Login Failed');
    }
  };

  // Replace with your actual Client ID from Google Cloud Console
  // Replace with your actual Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-screen">
        <div className="login-card">
          <div className="text-center mb-6">
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h1 className="h1" style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, var(--primary-color), #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Growth_Lens</h1>
              <h2 className="text-xl font-medium" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
              <p className="text-sm">Manage your business with clarity</p>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '0.3rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <button type="button" onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', background: isLogin ? 'var(--card-bg)' : 'transparent', color: isLogin ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', boxShadow: isLogin ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>Log In</button>
            <button type="button" onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', background: !isLogin ? 'var(--card-bg)' : 'transparent', color: !isLogin ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', boxShadow: !isLogin ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>Sign Up</button>
          </div>

          <form onSubmit={onSubmit} className="flex-col" style={{ gap: '1rem' }}>
            {!isLogin && (
              <div className="input-group">
                <input className="input-field" name="name" value={name} onChange={onChange} placeholder="Full Name" type="text" required style={{ background: 'var(--bg-color)' }} />
              </div>
            )}
            <div className="input-group">
              <input className="input-field" name="email" value={email} onChange={onChange} placeholder="Email Address" type="email" required style={{ background: 'var(--bg-color)' }} />
            </div>
            <div className="input-group">
              <input className="input-field" name="password" value={password} onChange={onChange} placeholder="Password" type="password" required minLength="6" style={{ background: 'var(--bg-color)' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="divider">OR CONTINUE WITH</div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                width="100%"
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
