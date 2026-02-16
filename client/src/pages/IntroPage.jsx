import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function IntroPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Navigate to login and pass the selected role via state
    navigate('/login', { state: { role } });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Branding Section */}
        <div style={styles.brandSection}>
          <div style={styles.logoCircle}>W</div>
          <h1 style={styles.brandName}>Woodland</h1>
          <p style={styles.companyName}>Woodland Furnitures Pvt Ltd</p>
          <p style={styles.tagline}>Premium Interior Visualization System</p>
        </div>

        <h2 style={styles.instruction}>Select Your Portal</h2>

        {/* Role Selection Cards */}
        <div style={styles.cardContainer}>
          <div style={styles.roleCard} onClick={() => handleRoleSelect('Designer')}>
            <div style={styles.icon}>🎨</div>
            <h3 style={styles.roleTitle}>Designer</h3>
            <p style={styles.roleDesc}>Client Consultations & Room Visualization</p>
          </div>

          <div style={styles.roleCard} onClick={() => handleRoleSelect('Admin')}>
            <div style={styles.icon}>🛡️</div>
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
    backgroundColor: '#0f172a',
    backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
    margin: 0,
    padding: 0
  },
  container: { textAlign: 'center', maxWidth: '800px', padding: '20px' },
  brandSection: { marginBottom: '50px' },
  logoCircle: { 
    width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    fontSize: '40px', fontWeight: 'bold', color: 'white', margin: '0 auto 20px',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
  },
  brandName: { color: 'white', fontSize: '48px', fontWeight: '800', margin: '0', letterSpacing: '-1px' },
  companyName: { color: '#cbd5e1', fontSize: '18px', margin: '5px 0 0 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' },
  tagline: { color: '#94a3b8', fontSize: '14px', marginTop: '10px', fontStyle: 'italic' },
  instruction: { color: '#cbd5e1', fontSize: '20px', marginBottom: '30px', fontWeight: '400' },
  cardContainer: { display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' },
  roleCard: {
    width: '260px',
    padding: '40px 30px',
    background: '#1e293b',
    borderRadius: '20px',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
  },
  icon: { fontSize: '48px', marginBottom: '20px' },
  roleTitle: { color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '10px' },
  roleDesc: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }
};
