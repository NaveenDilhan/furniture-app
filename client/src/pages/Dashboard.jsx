import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import CustomModal from '../components/CustomModal';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('3D');
  
  // Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/');
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  // ... (Keep your addItem, updateItem, updateColor functions exactly the same) ...
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };
  const addItem = (type) => { setItems([...items, { id: Date.now(), type, position: [0,0,0], rotation:[0,0,0], scale:[1,1,1], color:'orange' }]); };
  const updateItem = (id, data) => { setItems(items.map(i => i.id === id ? {...i, ...data} : i)); };
  const updateColor = (id, color) => { setItems(items.map(i => i.id === id ? {...i, color} : i)); };

  // --- NEW SAVE LOGIC ---
  const handleSaveSubmit = async (designName) => {
    try {
      await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, name: designName, items }),
      });
      alert('Design Saved!');
    } catch (err) { alert('Save Failed'); }
  };

  const loadDesigns = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${user._id}`);
      const data = await res.json();
      if (data.length > 0) {
        setItems(data[data.length - 1].items);
        alert(`Loaded: ${data[data.length - 1].name}`);
      } else {
        alert('No designs found.');
      }
    } catch (err) { alert('Load Failed'); }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        addItem={addItem}
        setMode={setMode}
        mode={mode}
        selectedId={selectedId}
        updateColor={updateColor}
        saveDesign={() => setShowSaveModal(true)} // Open modal instead of prompt
        loadDesigns={loadDesigns}
      />
      <DesignCanvas
        items={items}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        updateItem={updateItem}
        mode={mode}
      />

      {/* The Save Modal */}
      <CustomModal 
        isOpen={showSaveModal}
        title="Save Design"
        placeholder="Enter design name..."
        onClose={() => setShowSaveModal(false)}
        onSubmit={handleSaveSubmit}
      />
    </div>
  );
}