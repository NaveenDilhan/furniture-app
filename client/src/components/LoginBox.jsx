import React, { useState } from 'react';

export default function LoginBox({ onLogin, onRegister, role }) {
  const [view, setView] = useState('login'); 
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '',
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

    if (view === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      onRegister(formData.username, formData.email, formData.password);
    } else if (view === 'login') {
      onLogin(formData.username, formData.password);
    } else if (view === 'forgot') {
      alert(`Password reset link sent to: ${formData.email}`);
      setView('login');
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        {/* Role Badge */}
        <div style={styles.roleBadge}>{role} Portal</div>
        
        <h2 style={styles.title}>
          {view === 'login' && 'Welcome Back'}
          {view === 'register' && 'Create Account'}
          {view === 'forgot' && 'Reset Password'}
        </h2>
        <p style={styles.subtitle}>
          {view === 'login' && 'Please enter your details to sign in.'}
          {view === 'register' && 'Join our design community.'}
          {view === 'forgot' && 'Enter your email for a recovery link.'}
        </p>
      </div>
      
      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {view !== 'forgot' && (
          <>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              style={styles.input}
              onChange={handleChange}
              required
            />
          </>
        )}

        {(view === 'register' || view === 'forgot') && (
          <>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              style={styles.input}
              onChange={handleChange}
              required
            />
          </>
        )}

        {view !== 'forgot' && (
          <>
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
          </>
        )}
        
        {view === 'register' && (
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

        {view === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: '14px' }}>
            <button type="button" onClick={() => switchView('forgot')} style={styles.smallLink}>
              Forgot Password?
            </button>
          </div>
        )}

        <button type="submit" style={styles.btn}>
          {view === 'login' && 'Sign In'}
          {view === 'register' && 'Create Account'}
          {view === 'forgot' && 'Send Reset Link'}
        </button>
      </form>

      <div style={styles.footer}>
        <span style={{ color: '#64748b' }}>
          {view === 'login' ? "Don't have an account?" : "Back to"}
        </span>
        <button 
          onClick={() => switchView(view === 'login' ? 'register' : 'login')} 
          style={styles.linkBtn}
        >
          {view === 'login' ? 'Create an Account' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { 
    width: '380px', 
    padding: '35px', 
    backgroundColor: '#ffffff', 
    borderRadius: '16px', 
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', 
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },
  header: { marginBottom: '25px', textAlign: 'center' }, 
  roleBadge: { 
    display: 'inline-block', 
    padding: '6px 14px', 
    backgroundColor: 'rgba(42, 78, 59, 0.1)', 
    color: '#2A4E3B', 
    borderRadius: '20px', 
    fontSize: '11px', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    marginBottom: '12px', 
    letterSpacing: '1px' 
  },
  title: { 
    color: '#1e293b', 
    fontSize: '22px', 
    fontWeight: '600', 
    margin: '0 0 6px 0', 
    letterSpacing: '-0.5px' 
  },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  label: { 
    display: 'block', 
    color: '#475569', 
    fontSize: '12px', 
    marginBottom: '4px', 
    fontWeight: '500' 
  },
  input: { 
    display: 'block', 
    width: '100%', 
    padding: '10px 14px', 
    marginBottom: '14px', 
    borderRadius: '8px', 
    border: '1px solid #cbd5e1', 
    backgroundColor: '#f8fafc', 
    color: '#0f172a', 
    boxSizing: 'border-box', 
    fontSize: '14px', 
    outline: 'none', 
    transition: 'border-color 0.2s' 
  },
  btn: { 
    width: '100%', 
    padding: '12px', 
    marginTop: '6px', 
    cursor: 'pointer', 
    backgroundColor: '#2A4E3B', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '600', 
    fontSize: '15px', 
    transition: 'background-color 0.2s'
  },
  linkBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#2A4E3B', 
    cursor: 'pointer', 
    fontWeight: '600', 
    marginLeft: '6px' 
  },
  smallLink: { 
    background: 'none', 
    border: 'none', 
    color: '#64748b', 
    cursor: 'pointer', 
    fontSize: '12px', 
    textDecoration: 'none', 
    fontWeight: '500' 
  },
  footer: { 
    marginTop: '20px', 
    textAlign: 'center', 
    fontSize: '13px', 
    borderTop: '1px solid #f1f5f9', 
    paddingTop: '16px' 
  },
  errorAlert: { 
    backgroundColor: '#fef2f2', 
    color: '#b91c1c', 
    padding: '10px', 
    borderRadius: '8px', 
    marginBottom: '16px', 
    textAlign: 'center', 
    fontSize: '13px', 
    border: '1px solid #fecaca' 
  }
};