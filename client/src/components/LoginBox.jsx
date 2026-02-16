import React, { useState } from 'react';

export default function LoginBox({ onLogin, onRegister, role }) {
  const [view, setView] = useState('login'); // 'login', 'register', or 'forgot'
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
          {view === 'login' && 'Login to manage your design portfolio'}
          {view === 'register' && 'Join our furniture design community'}
          {view === 'forgot' && 'Enter your email to receive a recovery link'}
        </p>
      </div>
      
      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Username field: Hidden during 'forgot password' */}
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

        {/* Email field: Required for Register and Forgot Password */}
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

        {/* Password field: Hidden during 'forgot password' */}
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
        
        {/* Confirm Password: Only for Registration */}
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

        {/* Forgot Password Link: Only on Login view */}
        {view === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: '15px' }}>
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
        <span style={{ color: '#94a3b8' }}>
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
  card: { width: '400px', padding: '40px', background: '#1e293b', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid #334155' },
  header: { marginBottom: '32px', textAlign: 'center' },
  roleBadge: { display: 'inline-block', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', border: '1px solid rgba(16, 185, 129, 0.3)', letterSpacing: '1px' },
  title: { color: '#f8fafc', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subtitle: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  label: { display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '500' },
  input: { display: 'block', width: '100%', padding: '12px 16px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box', fontSize: '16px', outline: 'none' },
  btn: { width: '100%', padding: '14px', marginTop: '10px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px' },
  linkBtn: { background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: '600', marginLeft: '8px' },
  smallLink: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '14px' },
  errorAlert: { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.4)' }
};