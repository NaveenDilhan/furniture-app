import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png'; 
import woodBg from '../assets/wood-bg.jpg'; 

export default function IntroPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Branding Section */}
        <div style={styles.brandSection}>
          <img src={logoImage} alt="Woodland Furnitures Logo" style={styles.logoImage} />
          <p style={styles.tagline}>Premium Interior Visualization System</p>
        </div>

        <h2 style={styles.instruction}>Select Your Portal</h2>

        {/* Role Selection Cards */}
        <div style={styles.cardContainer}>
          <div style={styles.roleCard} onClick={() => handleRoleSelect('Designer')}>
            <div style={styles.icon}>📐</div>
            <h3 style={styles.roleTitle}>Designer</h3>
            <p style={styles.roleDesc}>Client Consultations & Room Visualization</p>
          </div>

          <div style={styles.roleCard} onClick={() => handleRoleSelect('Admin')}>
            <div style={styles.icon}>📋</div>
            <h3 style={styles.roleTitle}>Admin</h3>
            <p style={styles.roleDesc}>System Management & Inventory Control</p>
          </div>
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
    // Removed the white gradient so the pure wood shows through
    backgroundImage: `url(${woodBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    margin: 0
  },
  container: { 
    textAlign: 'center', 
    maxWidth: '800px', 
    padding: '40px', 
    zIndex: 1, 
    // Kept the white background on the container so text is easy to read
    background: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '24px', 
    boxShadow: '0 15px 50px rgba(0,0,0,0.3)' // Slightly stronger shadow for the wood bg
  },
  brandSection: { marginBottom: '40px' },
  logoImage: { 
    width: '280px', 
    height: 'auto',
    marginBottom: '15px'
  },
  tagline: { color: '#64748b', fontSize: '15px', marginTop: '10px', fontWeight: '400', letterSpacing: '1px' },
  instruction: { color: '#334155', fontSize: '18px', marginBottom: '30px', fontWeight: '500' },
  cardContainer: { display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' },
  roleCard: {
    width: '240px',
    padding: '30px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  icon: { fontSize: '40px', marginBottom: '15px' },
  roleTitle: { color: '#2A4E3B', fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
  roleDesc: { color: '#64748b', fontSize: '13px', lineHeight: '1.5' }
};