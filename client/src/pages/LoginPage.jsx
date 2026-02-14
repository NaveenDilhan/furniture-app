import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginBox from '../components/LoginBox';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Capture the role from navigation state
  const selectedRole = location.state?.role || 'User';

  return (
    <div style={pageStyles.wrapper}>
      {/* Professional Square Back Button */}
      <button 
        onClick={() => navigate('/')} 
        style={pageStyles.squareBtn}
        title="Back to Role Selection"
      >
        ←
      </button>

      <LoginBox 
        onLogin={(u, p) => console.log("Login", u, p)} 
        onRegister={(u, e, p) => console.log("Register", u, e, p)} 
        role={selectedRole} 
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
    position: 'relative'
  },
  squareBtn: {
    position: 'absolute',
    top: '15px', // Closer to the top header
    left: '15px', // Closer to the side
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1e293b', // Matches the LoginBox background
    border: '1px solid #334155',
    borderRadius: '8px', // Slightly rounded corners for a modern look
    color: '#94a3b8',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  }
};