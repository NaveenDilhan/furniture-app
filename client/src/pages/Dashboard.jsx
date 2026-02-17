import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [screenshots, setScreenshots] = useState([]); // Screenshot gallery
  const [tourActive, setTourActive] = useState(false); // Track if pointer lock is active

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
    // If leaving Tour mode, tell DesignCanvas to reset camera
    if (mode === 'Tour' && newMode !== 'Tour') {
      setResetCamera(prev => prev + 1); // trigger camera reset
    }
    setMode(newMode);
    if (newMode === 'Tour') {
      setShowTourOverlay(true);
      setSidebarCollapsed(true);
      setTourActive(false);
    } else {
      setSidebarCollapsed(false);
      setTourActive(false);
    }
  };

  // Camera reset trigger — incremented to signal DesignCanvas
  const [resetCamera, setResetCamera] = useState(0);

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

  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? {...i, ...data} : i));
  
  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item Deleted');
  };

  // Take screenshot and save to gallery + database
  const takeScreenshot = async () => {
    const dataUrl = canvasRef.current?.takeScreenshot();
    if (dataUrl) {
      const newScreenshot = {
        id: Date.now(),
        dataUrl,
        name: `Screenshot ${screenshots.length + 1}`,
        timestamp: new Date().toLocaleString()
      };
      setScreenshots(prev => [...prev, newScreenshot]);

      // Save to database if user is logged in
      if (user?._id) {
        try {
          await fetch('http://localhost:5000/api/screenshots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id,
              name: newScreenshot.name,
              dataUrl: dataUrl,
              roomConfig
            })
          });
        } catch (err) {
          console.error('Failed to save screenshot to database:', err);
        }
      }

      showToast('Screenshot saved!');
    }
  };

  // Load screenshots from database on mount
  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/screenshots/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setScreenshots(data.map(s => ({
              id: s._id,
              dataUrl: s.dataUrl,
              name: s.name,
              timestamp: new Date(s.createdAt).toLocaleString()
            })));
          }
        })
        .catch(err => console.error('Failed to load screenshots:', err));
    }
  }, [user]);

  // Download a screenshot
  const downloadScreenshot = (dataUrl, name) => {
    const link = document.createElement('a');
    link.download = `${name || 'design'}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Delete a screenshot from gallery and database
  const deleteScreenshot = async (id) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`http://localhost:5000/api/screenshots/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete screenshot from database:', err);
    }
    showToast('Screenshot deleted');
  };

  // Handle tour unlock (ESC pressed)
  const handleTourUnlock = () => {
    setShowTourOverlay(true);
    setTourActive(false);
  };

  // Handle entering tour (overlay clicked)
  const handleEnterTour = () => {
    setShowTourOverlay(false);
    setTourActive(true);
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
      
      {/* Sidebar — hidden completely in active tour */}
      {!(mode === 'Tour' && tourActive) && (
        <div style={{
          width: sidebarCollapsed ? '0px' : '320px',
          minWidth: sidebarCollapsed ? '0px' : '320px',
          overflow: 'hidden',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          height: '100%',
          flexShrink: 0
        }}>
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
              takeScreenshot();
              const dataUrl = canvasRef.current?.takeScreenshot();
              if (dataUrl) downloadScreenshot(dataUrl, 'design');
            }}
            screenshots={screenshots}
            onDownloadScreenshot={downloadScreenshot}
            onDeleteScreenshot={deleteScreenshot}
          />
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        
        {/* Sidebar Toggle Button — hidden in active tour */}
        {!(mode === 'Tour' && tourActive) && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              zIndex: 15,
              background: 'rgba(30, 30, 30, 0.85)',
              color: '#fff',
              border: '1px solid #555',
              borderLeft: 'none',
              borderRadius: '0 8px 8px 0',
              width: '24px',
              height: '60px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
              transition: 'background 0.2s'
            }}
            title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.8)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.85)'}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        )}

        {/* Floating Toolbar — hidden in active tour */}
        {!(mode === 'Tour' && tourActive) && (
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
        )}

        <DesignCanvas
          ref={canvasRef}
          items={items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          updateItem={updateItem}
          mode={mode}
          roomConfig={roomConfig}
          onTourUnlock={handleTourUnlock}
          onScreenshot={takeScreenshot}
          resetCamera={resetCamera}
        />

        {/* Tour Mode Overlay — shows BEFORE entering tour with all instructions */}
        {mode === 'Tour' && showTourOverlay && (
          <div id="tour-overlay" onClick={handleEnterTour} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', cursor: 'pointer', zIndex: 2
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚶</div>
            <h2 style={{ color: 'white', margin: '0 0 16px', fontSize: '1.5rem' }}>Virtual Tour Mode</h2>
            
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px 28px',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <table style={{ color: '#ccc', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>W</kbd> <kbd style={kbdStyle}>A</kbd> <kbd style={kbdStyle}>S</kbd> <kbd style={kbdStyle}>D</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Move around</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>Mouse</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Look around</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>Scroll</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Zoom in / out</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>P</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Take screenshot</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>ESC</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Exit tour / Release cursor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '12px 32px', background: '#3b82f6', color: 'white',
              borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              Click to Enter Tour
            </div>
          </div>
        )}

        {/* CLEAN SCREEN: No HUD elements when tour is active */}
        {/* ESC will bring back the overlay with instructions */}
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

// Keyboard key style for the overlay instructions
const kbdStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '4px',
  padding: '2px 8px',
  fontSize: '0.8rem',
  fontFamily: 'monospace',
  color: '#fff',
  fontWeight: 600
};
