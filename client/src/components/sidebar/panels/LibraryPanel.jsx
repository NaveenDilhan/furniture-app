import React, { useState, useEffect, useMemo } from 'react';

// You might store this in a config file
const API_BASE = 'http://localhost:5000/api';

const LibraryItem = ({ item, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'var(--bg-input)', 
      border: '1px solid var(--border)', 
      borderRadius: '8px',
      padding: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '8px',
      cursor: 'pointer', 
      transition: 'all 0.2s', 
      color: 'var(--text-main)',
      width: '100%'
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <div style={{ 
      width: '100%', aspectRatio: '1/1', background: '#fff', 
      borderRadius: '4px', overflow: 'hidden', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', position: 'relative'
    }}>
      {item.image ? (
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
             onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}/>
      ) : null}
      <span style={{ display: item.image ? 'none' : 'block', fontSize: '2rem' }}>📦</span>
    </div>
    <span style={{ fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>{item.name}</span>
  </button>
);

const CategoryHeader = ({ name, isOpen, onClick, count }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '12px 15px',
      background: isOpen ? 'var(--accent)' : 'var(--bg-panel)',
      color: isOpen ? '#fff' : 'var(--text-main)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      textAlign: 'left',
      fontWeight: 'bold',
      transition: 'background 0.2s'
    }}
  >
    <span>{name}</span>
    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
      {isOpen ? '▼' : `▶ (${count})`}
    </span>
  </button>
);

export default function LibraryPanel({ addItem }) {
  const [furnitureData, setFurnitureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // 1. Fetch furniture from Database
  useEffect(() => {
    fetch(`${API_BASE}/furniture`)
      .then(res => res.json())
      .then(data => {
        setFurnitureData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load furniture:", err);
        setLoading(false);
      });
  }, []);

  // 2. Group items by Category (Type)
  const groupedData = useMemo(() => {
    const groups = {};
    furnitureData.forEach(item => {
      const type = item.type || 'Uncategorized';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [furnitureData]);

  const categories = Object.keys(groupedData).sort();

  if (loading) return <div style={{ padding: 20 }}>Loading catalog...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '20px' }}>
      
      {categories.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', opacity: 0.6 }}>
          No items found in database.
        </div>
      )}

      {categories.map(category => {
        const isOpen = expandedCategory === category;
        const items = groupedData[category];

        return (
          <div key={category}>
            {/* Category Header */}
            <CategoryHeader 
              name={category} 
              count={items.length}
              isOpen={isOpen} 
              onClick={() => setExpandedCategory(isOpen ? null : category)} 
            />

            {/* Expandable Grid */}
            {isOpen && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '10px', 
                padding: '5px 0 15px 0',
                animation: 'fadeIn 0.3s ease-in-out'
              }}>
                {items.map(item => (
                  <LibraryItem 
                    key={item._id || item.id} 
                    item={item} 
                    onClick={() => addItem(item)} 
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}