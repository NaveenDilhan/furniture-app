import React, { useState } from 'react';

export default function LoginBox({ onLogin, onRegister, role }) {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (view === 'register') {
      if (formData.password !== formData.confirmPassword) return setError("Passwords match error");
      onRegister(formData.username, formData.email, formData.password);
    } else if (view === 'login') {
      onLogin(formData.username, formData.password);
    } else {
      alert(`Reset link sent to ${formData.email}`);
      setView('login');
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badge}>{role} Access</div>
        <h2 style={styles.title}>{view === 'login' ? 'Welcome Back' : view === 'register' ? 'Create Account' : 'Reset Password'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {view !== 'forgot' && (
          <input name="username" placeholder="Username" style={styles.input} onChange={handleChange} required />
        )}
        {(view === 'register' || view === 'forgot') && (
          <input name="email" type="email" placeholder="Email Address" style={styles.input} onChange={handleChange} required />
        )}
        {view !== 'forgot' && (
          <input name="password" type="password" placeholder="Password" style={styles.input} onChange={handleChange} required />
        )}
        {view === 'register' && (
          <input name="confirmPassword" type="password" placeholder="Confirm Password" style={styles.input} onChange={handleChange} required />
        )}

        {view === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <span onClick={() => setView('forgot')} style={styles.smallLink}>Forgot Password?</span>
          </div>
        )}

        <button type="submit" style={styles.btn}>
          {view === 'login' ? 'Sign In' : view === 'register' ? 'Sign Up' : 'Send Reset Link'}
        </button>
      </form>

      <div style={styles.footer}>
        <button onClick={() => setView(view === 'login' ? 'register' : 'login')} style={styles.linkBtn}>
          {view === 'login' ? 'New here? Create Account' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { width: '380px', padding: '40px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  badge: { display: 'inline-block', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  title: { color: 'white', fontSize: '24px', margin: 0 },
  input: { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  smallLink: { color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' },
  footer: { marginTop: '20px', textAlign: 'center' },
  linkBtn: { background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '14px' }
};