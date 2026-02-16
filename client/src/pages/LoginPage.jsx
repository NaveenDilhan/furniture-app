import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginBox from '../components/LoginBox';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Capture role from IntroPage state (defaults to 'User' if accessed directly)
  const selectedRole = location.state?.role || 'User';

  // --- LOGIN LOGIC ---
  const handleLogin = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: selectedRole }),
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard'); // Navigate to dashboard on success
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
        body: JSON.stringify({ username, email, password, role: selectedRole }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Registration Successful! Please login.");
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
      {/* Square Back Button */}
      <button 
        onClick={() => navigate('/')} 
        style={pageStyles.squareBtn}
        title="Back to Role Selection"
      >
        ←
      </button>

      <LoginBox 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        role={selectedRole} // Pass the role to the box
      />
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
    backgroundColor: '#0f172a',
    backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
    position: 'relative',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  squareBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '45px',
    height: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    color: '#94a3b8',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};