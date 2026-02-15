import React from 'react';

const LibraryItem = ({ name, icon, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px',
      padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      cursor: 'pointer', transition: 'transform 0.1s, border-color 0.2s', color: 'var(--text-main)'
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <span style={{ fontSize: '1.8rem' }}>{icon}</span>
    <span style={{ fontSize: '0.85rem' }}>{name}</span>
  </button>
);

export default function LibraryPanel({ addItem }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      <LibraryItem name="Table" icon="🔲" onClick={() => addItem('Table')} />
      <LibraryItem name="Chair" icon="💺" onClick={() => addItem('Chair')} />
      <LibraryItem name="Bed" icon="🛏️" onClick={() => addItem('Bed')} />
      <LibraryItem name="Lamp" icon="💡" onClick={() => addItem('Lamp')} />
      <LibraryItem name="Sofa" icon="🛋️" onClick={() => addItem('Sofa')} />
      <LibraryItem name="Cabinet" icon="🚪" onClick={() => addItem('Cabinet')} />
    </div>
  );
}