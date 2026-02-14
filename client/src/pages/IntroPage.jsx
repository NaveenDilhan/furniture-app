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
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>F</div>
          <h1 style={styles.brandName}>FurnitureVision</h1>
          <p style={styles.tagline}>Intelligent Room Visualization System</p>
        </div>

        <h2 style={styles.instruction}>Please select your role to continue</h2>

        <div style={styles.cardContainer}>
          {/* Designer Role */}
          <div style={styles.roleCard} onClick={() => handleRoleSelect('Designer')}>
            <div style={styles.icon}>🎨</div>
            <h3 style={styles.roleTitle}>Designer</h3>
            <p style={styles.roleDesc}>Create room layouts and visualize 3D designs with customers.</p>
          </div>

          {/* Admin Role */}
          <div style={styles.roleCard} onClick={() => handleRoleSelect('Admin')}>
            <div style={styles.icon}>🛡️</div>
            <h3 style={styles.roleTitle}>Admin</h3>
            <p style={styles.roleDesc}>Manage designer accounts, furniture inventory, and system data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a', backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' },
  container: { textAlign: 'center', maxWidth: '800px' },
  logoSection: { marginBottom: '40px' },
  logoCircle: { width: '70px', height: '70px', background: '#10b981', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '35px', fontWeight: 'bold', margin: '0 auto 15px', color: 'white' },
  brandName: { color: 'white', fontSize: '32px', fontWeight: '800', margin: 0 },
  tagline: { color: '#94a3b8', fontSize: '16px' },
  instruction: { color: '#cbd5e1', fontSize: '18px', marginBottom: '30px', fontWeight: '400' },
  cardContainer: { display: 'flex', gap: '25px', justifyContent: 'center' },
  roleCard: { width: '250px', padding: '35px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  icon: { fontSize: '45px', marginBottom: '15px' },
  roleTitle: { color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '10px' },
  roleDesc: { color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }
};