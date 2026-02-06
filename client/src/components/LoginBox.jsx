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
    setError(''); // Clear validation errors when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Security: Validate passwords match on the client side
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          {isRegistering ? 'Create Account' : 'Furniture App Login'}
        </h2>
        
        {/* Error Message Display */}
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            style={styles.input}
            onChange={handleChange}
            required
          />
          
          {/* Only show Confirm Password during Registration */}
          {isRegistering && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              style={styles.input}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" style={styles.btn}>
            {isRegistering ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
          </p>
          <button onClick={toggleMode} style={styles.linkBtn}>
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#222' },
  card: { width: '350px', padding: '40px', background: '#333', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' },
  input: { display: 'block', width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #555', background: '#444', color: 'white', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', marginTop: '10px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' },
  linkBtn: { background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' },
  footer: { marginTop: '20px', textAlign: 'center' },
  errorAlert: { background: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }
};