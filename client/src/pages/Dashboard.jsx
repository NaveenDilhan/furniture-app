import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import CustomModal from '../components/CustomModal';

// Toast Notification Component
const Toast = ({ message }) => (
  <div style={{
    position: 'absolute', bottom: 20, right: 20, 
    background: '#3b82f6', color: 'white', padding: '12px 24px', 
    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.3s ease-out', zIndex: 1000, fontWeight: 500, fontFamily: 'sans-serif'
  }}>
    {message}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const canvasRef = useRef();
  
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('3D'); // Modes: 3D, 2D, Tour
  const [showTourOverlay, setShowTourOverlay] = useState(true);

  
  const [roomConfig, setRoomConfig] = useState({
    width: 15, depth: 15, wallColor: '#e0e0e0', floorColor: '#5c3a21', lightingMode: 'Day'
  });

  const [toast, setToast] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/');
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

    const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'Tour') {
      setShowTourOverlay(true);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  const addItem = (type) => {
    const newItem = { 
      id: Date.now(), 
      type, 
      position: [0, 0.5, 0], 
      rotation: [0, 0, 0], 
      scale: [1, 1, 1], 
      color: type === 'Lamp' ? '#ffaa00' : '#888888' 
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
    showToast(`Added ${type}`);
  };

  // This function will now be called only when the user *releases* the mouse after dragging
  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? {...i, ...data} : i));
  
  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item Deleted');
  };

  const handleSaveSubmit = async (designName) => {
    const thumbnail = canvasRef.current?.takeScreenshot() || '';
    try {
      await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, name: designName, items, roomConfig, thumbnail }),
      });
      showToast('Project Saved Successfully!');
      setShowSaveModal(false);
    } catch (err) { showToast('Save Failed'); }
  };

  const loadDesigns = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${user._id}`);
      const data = await res.json();
      if (data.length > 0) {
        const design = data[data.length - 1];
        setItems(design.items);
        if(design.roomConfig) setRoomConfig(design.roomConfig);
        showToast(`Loaded: ${design.name}`);
      } else showToast('No saved designs found.');
    } catch (err) { showToast('Load Failed'); }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <Sidebar
        user={user}
        onLogout={handleLogout}
        addItem={addItem}
        selectedId={selectedId}
        items={items}
        updateItem={updateItem}
        deleteItem={deleteItem}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        saveDesign={() => setShowSaveModal(true)}
        loadDesigns={loadDesigns}
        downloadScreenshot={() => {
          const link = document.createElement('a');
          link.download = `design-${Date.now()}.jpg`;
          link.href = canvasRef.current.takeScreenshot();
          link.click();
        }}
      />

      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        {/* Floating Toolbar */}
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', gap: 10, background: 'rgba(30,30,30,0.85)',
          padding: '8px 16px', borderRadius: 20, backdropFilter: 'blur(6px)', 
          border: '1px solid #555', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <button className={`btn ${mode === '3D' ? 'btn-primary' : ''}`} onClick={() => handleModeChange('3D')}>📦 3D View</button>
          <button className={`btn ${mode === '2D' ? 'btn-primary' : ''}`} onClick={() => handleModeChange('2D')}>📐 Blueprint</button>
          <button className={`btn ${mode === 'Tour' ? 'btn-primary' : ''}`} onClick={() => handleModeChange('Tour')}>🚶 Tour Mode</button>

        </div>

        <DesignCanvas
          ref={canvasRef}
          items={items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          updateItem={updateItem}
          mode={mode}
          roomConfig={roomConfig}
               />

                {/* Tour Mode Overlay - only shows when overlay is active */}
        {mode === 'Tour' && showTourOverlay && (
          <div id="tour-overlay" onClick={() => setShowTourOverlay(false)} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', cursor: 'pointer', zIndex: 2
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚶</div>
            <h2 style={{ color: 'white', margin: '0 0 10px' }}>Virtual Tour Mode</h2>
            <p style={{ color: '#aaa', margin: '0 0 20px', textAlign: 'center' }}>
              Click anywhere to start walking  
                

              Use <b>W A S D</b> to move around  
                

              Move your <b>mouse</b> to look around  
                

              Press <b>ESC</b> to release cursor
            </p>
            <div style={{
              padding: '12px 32px', background: '#3b82f6', color: 'white',
              borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600
            }}>
              Click to Enter Tour
            </div>
          </div>
        )}

        {/* Small Help Button - shows when touring (overlay hidden) */}
        {mode === 'Tour' && !showTourOverlay && (
          <button
            onClick={() => setShowTourOverlay(true)}
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              zIndex: 10,
              background: 'rgba(30, 30, 30, 0.8)',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              transition: 'background 0.2s'
            }}
            title="Show tour instructions"
            onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.8)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.8)'}
          >
            ?
          </button>
        )}

      </div>


      {toast && <Toast message={toast} />}
      
      <CustomModal 
        isOpen={showSaveModal}
        title="Save Project"
        placeholder="Project Name..."
        onClose={() => setShowSaveModal(false)}
        onSubmit={handleSaveSubmit}
      />
    </div>
  );
}