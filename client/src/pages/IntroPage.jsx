import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png'; 
import woodBg from '../assets/wood-bg.jpg'; 

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Branding & Welcome Section */}
        <div style={styles.brandSection}>
          <img src={logoImage} alt="WoodLand Furniture Logo" style={styles.logoImage} />
          
          <h1 style={styles.welcomeTitle}>Welcome to WoodLand</h1>
          
          <p style={styles.description}>
            Step into a world of premium interior design. Plan, visualize, and 
            perfect your living spaces with our advanced 3D room visualization system. 
            Whether you are looking for inspiration or ready to design your dream home, 
            we are here to bring your vision to life.
          </p>
        </div>

        {/* Action Button */}
        <div style={styles.buttonContainer}>
          <button 
            style={styles.primaryButton} 
            onClick={() => navigate('/login', { state: { action: 'login' } })}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '40px 20px',
    boxSizing: 'border-box',
    backgroundImage: `url(${woodBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    margin: 0
  },
  container: { 
    textAlign: 'center', 
    maxWidth: '650px', 
    padding: '50px 40px', 
    zIndex: 1, 
    background: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '24px', 
    boxShadow: '0 15px 50px rgba(0,0,0,0.3)'
  },
  brandSection: { marginBottom: '35px' },
  logoImage: { 
    width: '260px', 
    height: 'auto',
    marginBottom: '20px'
  },
  welcomeTitle: { 
    color: '#2A4E3B', 
    fontSize: '28px', 
    fontWeight: '700', 
    margin: '0 0 15px 0',
    letterSpacing: '0.5px'
  },
  description: { 
    color: '#475569', 
    fontSize: '16px', 
    lineHeight: '1.7', 
    margin: '0', 
    fontWeight: '400' 
  },
  buttonContainer: { 
    display: 'flex', 
    justifyContent: 'center' 
  },
  primaryButton: {
    padding: '14px 36px',
    backgroundColor: '#2A4E3B',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(42, 78, 59, 0.2)'
  }
};