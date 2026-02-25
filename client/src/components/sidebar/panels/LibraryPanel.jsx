import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Configuration
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// --- Styles ---
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingBottom: '20px',
    height: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-main)',
    marginBottom: '10px',
    fontSize: '0.9rem',
  },
  categoryHeader: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', // Slightly wider columns
    gap: '10px',
    padding: '5px 0 15px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  itemBtn: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px', // Reduced padding slightly to give image more room
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'transform 0.1s, border-color 0.2s',
    color: 'var(--text-main)',
    width: '100%',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: '1/1',
    // Used a very light grey so white-background images stand out slightly
    background: '#f3f4f6', 
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  priceTag: {
    fontSize: '0.8rem',
    color: '#4ade80',
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  errorContainer: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--text-danger, #ef4444)',
    border: '1px dashed var(--border)',
    borderRadius: '8px',
  },
};

// --- Sub-Components ---

const LibraryItem = React.memo(({ item, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      style={styles.itemBtn}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      aria-label={`Add ${item.name} for $${item.price}`}
    >
      <div style={styles.imageContainer}>
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', // CHANGED: 'cover' forces image to fill the square
              display: 'block' 
            }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: '2rem' }}>📦</span>
        )}
      </div>
      
      <span style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.2' }}>
        {item.name}
      </span>
      
      <span style={styles.priceTag}>
        ${item.price?.toLocaleString() || '0'}
      </span>
    </button>
  );
});

const CategoryHeader = ({ name, isOpen, onClick, count }) => {
  const headerStyle = {
    ...styles.categoryHeader,
    background: isOpen ? 'var(--accent)' : 'var(--bg-panel)',
    color: isOpen ? '#fff' : 'var(--text-main)',
    border: isOpen ? 'none' : '1px solid var(--border)',
  };

  return (
    <button
      onClick={onClick}
      style={headerStyle}
      aria-expanded={isOpen}
    >
      <span>{name}</span>
      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
        {isOpen ? '▼' : `▶ (${count})`}
      </span>
    </button>
  );
};

// --- Main Component ---

export default function LibraryPanel({ addItem }) {
  const [furnitureData, setFurnitureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/furniture`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setFurnitureData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groupedData = useMemo(() => {
    const groups = {};
    const lowerSearch = searchTerm.toLowerCase();

    furnitureData.forEach(item => {
      if (searchTerm && !item.name.toLowerCase().includes(lowerSearch)) {
        return;
      }

      const type = item.type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    
    return groups;
  }, [furnitureData, searchTerm]);

  // Auto-expand on search
  useEffect(() => {
    const keys = Object.keys(groupedData);
    if (searchTerm && keys.length > 0) {
        setExpandedCategory(keys[0]);
    }
  }, [searchTerm, groupedData]);

  const categories = Object.keys(groupedData).sort();

  const handleCategoryClick = (category) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  if (loading && !furnitureData.length) {
    return <div style={{ padding: 20, color: 'var(--text-secondary)' }}>Loading Library...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p>Error loading library.</p>
        <button onClick={fetchData} style={{ padding: '5px 10px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <input 
        type="text" 
        placeholder="Search furniture..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.6, marginTop: 20 }}>
          No items found.
        </div>
      )}

      {categories.map(category => (
        <div key={category}>
          <CategoryHeader 
            name={category} 
            count={groupedData[category].length}
            isOpen={expandedCategory === category} 
            onClick={() => handleCategoryClick(category)} 
          />
          
          {expandedCategory === category && (
            <div style={styles.grid}>
              {groupedData[category].map(item => (
                <LibraryItem 
                  key={item._id || item.id} 
                  item={item} 
                  onClick={() => addItem(item)} 
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}