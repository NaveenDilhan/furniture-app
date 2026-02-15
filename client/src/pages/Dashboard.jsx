import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import CustomModal from '../components/CustomModal';
import Minimap from '../components/Minimap';

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

  // Week 2: Furniture hover info & minimap state
  const [hoveredFurniture, setHoveredFurniture] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 });
  const [playerRotation, setPlayerRotation] = useState(0);
  const [showMinimap, setShowMinimap] = useState(true);

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
      setSidebarCollapsed(true);
      setTourActive(false);
      setHoveredFurniture(null);
    } else {
      setSidebarCollapsed(false);
      setTourActive(false);
      setHoveredFurniture(null);
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

  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? {...i, ...data} : i));
  
  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item Deleted');
  };

  // Take screenshot and save to gallery
  const takeScreenshot = () => {
    const dataUrl = canvasRef.current?.takeScreenshot();
    if (dataUrl) {
      const newScreenshot = {
        id: Date.now(),
        dataUrl,
        name: `Screenshot ${screenshots.length + 1}`,
        timestamp: new Date().toLocaleString()
      };
      setScreenshots(prev => [...prev, newScreenshot]);
      showToast('Screenshot saved to gallery!');
    }
  };

  // Download a screenshot
  const downloadScreenshot = (dataUrl, name) => {
    const link = document.createElement('a');
    link.download = `${name || 'design'}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Delete a screenshot from gallery
  const deleteScreenshot = (id) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
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

  // Exit tour mode completely
  const handleExitTour = () => {
    handleModeChange('3D');
  };

  // Week 2: Handle player position updates from TourControls
  const handlePlayerMove = (data) => {
    setPlayerPos({ x: data.x, z: data.z });
    setPlayerRotation(data.rotation);
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
      
      {/* Sidebar with collapse/expand */}
      <div style={{
        width: sidebarCollapsed ? '0px' : '320px',
        minWidth: sidebarCollapsed ? '0px' : '320px',
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        height: '100%'
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

      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        
        {/* Sidebar Toggle Button */}
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
          onTourUnlock={handleTourUnlock}
          onScreenshot={takeScreenshot}
          onHoverFurniture={setHoveredFurniture}
          onPlayerMove={handlePlayerMove}
          onToggleMinimap={() => setShowMinimap(prev => !prev)}
        />

        {/* Crosshair - visible when tour is active and overlay is hidden */}
        {mode === 'Tour' && tourActive && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            pointerEvents: 'none'
          }}>
            {/* Horizontal line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '2px',
              background: hoveredFurniture ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1px',
              transition: 'background 0.2s'
            }} />
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '2px',
              height: '20px',
              background: hoveredFurniture ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1px',
              transition: 'background 0.2s'
            }} />
            {/* Center dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '4px',
              background: hoveredFurniture ? 'rgba(59, 130, 246, 1)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }} />
          </div>
        )}

        {/* Furniture Info Tooltip - shows when crosshair hovers over furniture */}
        {mode === 'Tour' && tourActive && hoveredFurniture && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(20px, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            background: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '8px',
            padding: '10px 14px',
            minWidth: '120px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ 
              color: '#3b82f6', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              marginBottom: '4px',
              fontFamily: 'sans-serif'
            }}>
              {hoveredFurniture.type}
            </div>
            <div style={{ 
              color: '#888', 
              fontSize: '0.7rem',
              fontFamily: 'monospace'
            }}>
              Distance: {hoveredFurniture.distance}m
            </div>
          </div>
        )}

        {/* Minimap - top-right corner during tour */}
        <Minimap
          roomWidth={roomConfig.width}
          roomDepth={roomConfig.depth}
          items={items}
          playerPos={playerPos}
          playerRotation={playerRotation}
          visible={mode === 'Tour' && tourActive && showMinimap}
        />

        {/* Tour Mode Overlay */}
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
                      <kbd style={kbdStyle}>Shift</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Sprint (move faster)</td>
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
                      <kbd style={kbdStyle}>M</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Toggle minimap</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0', textAlign: 'right' }}>
                      <kbd style={kbdStyle}>ESC</kbd>
                    </td>
                    <td style={{ padding: '4px 0' }}>Release cursor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '16px', textAlign: 'center' }}>
              Look at furniture to see its name and distance
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

        {/* Tour HUD - shows when actively touring */}
        {mode === 'Tour' && !showTourOverlay && (
          <>
            {/* Help Button (bottom-left) */}
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
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                transition: 'background 0.2s'
              }}
              title="Show controls"
              onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.8)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(30, 30, 30, 0.8)'}
            >
              ?
            </button>

            {/* Minimap Toggle Button (bottom-left, next to help) */}
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              style={{
                position: 'absolute',
                bottom: 20,
                left: 70,
                zIndex: 10,
                background: showMinimap ? 'rgba(59, 130, 246, 0.8)' : 'rgba(30, 30, 30, 0.8)',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                transition: 'background 0.2s'
              }}
              title={showMinimap ? 'Hide minimap' : 'Show minimap'}
            >
              🗺
            </button>

            {/* Exit Tour Button (bottom-right) */}
            <button
              onClick={handleExitTour}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                zIndex: 10,
                background: 'rgba(239, 68, 68, 0.8)',
                color: '#fff',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                transition: 'background 0.2s'
              }}
              title="Exit tour mode"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
            >
              ✕ Exit Tour
            </button>

            {/* Tour Mode Label (top-right, below minimap) */}
            <div style={{
              position: 'absolute',
              top: showMinimap ? 230 : 20,
              right: 20,
              zIndex: 10,
              background: 'rgba(30, 30, 30, 0.7)',
              color: '#aaa',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              backdropFilter: 'blur(6px)',
              border: '1px solid #444',
              pointerEvents: 'none',
              transition: 'top 0.3s ease'
            }}>
              🚶 Tour Mode &nbsp;|&nbsp; Room: {roomConfig.width}m × {roomConfig.depth}m
            </div>
          </>
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
