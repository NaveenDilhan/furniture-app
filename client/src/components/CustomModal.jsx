import React, { useState } from 'react';

export default function CustomModal({ title, isOpen, onClose, onSubmit, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue(''); // Reset after submit
      onClose();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            style={styles.input}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div style={styles.buttons}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.confirmBtn}>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
    width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    color: '#333'
  },
  input: {
    width: '100%', padding: '8px', marginBottom: '15px',
    boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px'
  },
  buttons: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { padding: '8px 12px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '4px' },
  confirmBtn: { padding: '8px 12px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }
};