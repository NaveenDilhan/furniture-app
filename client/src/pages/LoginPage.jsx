import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBox from '../components/LoginBox';

export default function LoginPage() {
  const navigate = useNavigate();

  // --- LOGIN LOGIC ---
  const handleLogin = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Securely store user session (JWT)
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        alert("Login Failed: " + data.message);
      }
    } catch (err) { 
      console.error(err);
      alert('Server Connection Error. Is the backend running?'); 
    }
  };

  // --- REGISTRATION LOGIC ---
  const handleRegister = async (username, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Registration Successful! Please login with your new account.");
        window.location.reload(); 
      } else {
        alert("Registration Failed: " + (data.message || "User likely exists"));
      }
    } catch (err) { 
      console.error(err);
      alert('Registration Server Error'); 
    }
  };

  return (
    <div style={pageStyles.wrapper}>
      <LoginBox onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}

const pageStyles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a', // Professional deep navy/slate
    backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  }
};