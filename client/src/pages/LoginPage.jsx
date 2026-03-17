import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginBox from '../components/LoginBox';
import logoImage from '../assets/logo.png'; 
import woodBg from '../assets/wood-bg.jpg'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Since we removed the role selection screen, we default the role to 'User'
  const selectedRole = 'User';

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
        navigate('/dashboard'); 
      } else {
        alert("Login Failed: " + data.message);
      }
    } catch (err) { 
      console.error(err);
      alert('Server Connection Error. Is the backend running?'); 
    }
  };

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
      <button 
        onClick={() => navigate('/')} 
        style={pageStyles.backBtn}
        title="Back to Welcome Page"
      >
        <span style={{ transform: 'translateX(-2px)' }}>←</span>
      </button>

      <div style={pageStyles.contentContainer}>
        {/* Brand Logo with a subtle glow so it stands out against dark wood */}
        <img src={logoImage} alt="WoodLand Furniture" style={pageStyles.logoImage} />
        
        <LoginBox 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          role={selectedRole} 
        />
      </div>
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
    padding: '60px 20px', 
    boxSizing: 'border-box',
    backgroundImage: `url(${woodBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    margin: 0
  },
  contentContainer: {
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  logoImage: { 
    width: '240px',
    marginBottom: '25px',
    objectFit: 'contain',
    filter: 'drop-shadow(0px 4px 15px rgba(255, 255, 255, 0.6))'
  },
  backBtn: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '45px',
    height: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    color: '#2A4E3B',
    fontSize: '22px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 2
  }
};