import React, { useState } from 'react';

export default function LoginBox({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      onRegister(formData.username, formData.password);
    } else {
      onLogin(formData.username, formData.password);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {isRegistering ? 'Create Account' : 'Welcome'}
        </h2>
        <p style={styles.subtitle}>
          {isRegistering ? 'Join our furniture design community' : 'Login to manage your design portfolio'}
        </p>
      </div>
      
      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Username</label>
        <input
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          style={styles.input}
          onChange={handleChange}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          style={styles.input}
          onChange={handleChange}
          required
        />
        
        {isRegistering && (
          <>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              style={styles.input}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" style={styles.btn}>
          {isRegistering ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div style={styles.footer}>
        <span style={{ color: '#94a3b8' }}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
        </span>
        <button onClick={toggleMode} style={styles.linkBtn}>
          {isRegistering ? 'Sign In' : 'Create an Account'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { 
    width: '400px', 
    padding: '48px', 
    background: '#1e293b', // Slate 800
    borderRadius: '16px', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155' // Subtle border
  },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { color: '#f8fafc', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subtitle: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  label: { display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '500' },
  input: { 
    display: 'block', 
    width: '100%', 
    padding: '12px 16px', 
    marginBottom: '20px', 
    borderRadius: '8px', 
    border: '1px solid #334155', 
    background: '#0f172a', 
    color: 'white', 
    boxSizing: 'border-box',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.2s'
  },
  btn: { 
    width: '100%', 
    padding: '14px', 
    marginTop: '10px', 
    cursor: 'pointer', 
    background: '#10b981', // Emerald 500
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '600', 
    fontSize: '16px',
    transition: 'background 0.3s'
  },
  linkBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#10b981', 
    cursor: 'pointer', 
    fontWeight: '600',
    marginLeft: '8px',
    padding: 0
  },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '14px' },
  errorAlert: { 
    background: 'rgba(239, 68, 68, 0.2)', 
    color: '#fca5a5', 
    padding: '12px', 
    borderRadius: '8px', 
    marginBottom: '20px', 
    textAlign: 'center', 
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.4)'
  }
};