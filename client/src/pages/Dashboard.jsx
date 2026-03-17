import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import CustomModal from '../components/CustomModal';
import CheckoutModal from '../components/CheckoutModal'; 

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
const getBaseFurnitureScale = (type = '') => {
  const t = type.toLowerCase();

  if (t.includes('bed')) return 1.8;
  if (t.includes('sofa') || t.includes('couch')) return 1.6;
  if (t.includes('dining table')) return 1.4;
  if (t.includes('table') || t.includes('desk')) return 1.2;
  if (t.includes('chair') || t.includes('stool')) return 0.9;
  if (t.includes('lamp')) return 0.8;
  if (t.includes('wardrobe') || t.includes('cabinet') || t.includes('closet')) return 1.5;
  if (t.includes('shelf') || t.includes('bookshelf')) return 1.3;
  if (t.includes('tv stand')) return 1.2;

  return 1.1;
};

const getRoomFitMultiplier = (roomWidth, roomDepth) => {
  const avgRoomSize = (roomWidth + roomDepth) / 2;

  if (avgRoomSize <= 8) return 0.75;
  if (avgRoomSize <= 12) return 0.9;
  if (avgRoomSize <= 18) return 1;
  if (avgRoomSize <= 25) return 1.15;

  return 1.25;
};

const getDefaultFurnitureScale = (type, roomConfig) => {
  const base = getBaseFurnitureScale(type);
  const roomFactor = getRoomFitMultiplier(roomConfig.width, roomConfig.depth);
  const finalScale = base * roomFactor;

  return [finalScale, finalScale, finalScale];
};
export default function Dashboard() {
  const navigate = useNavigate();
  const canvasRef = useRef();
  
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // Modes: '3D', '2D', 'Tour'
  const [mode, setMode] = useState('3D');
  const [showTourOverlay, setShowTourOverlay] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [showScreenshotsModal, setShowScreenshotsModal] = useState(false); // New State for Screenshots Gallery

  const [roomConfig, setRoomConfig] = useState({
  width: 15,
  depth: 15,
  wallColor: '#e0e0e0',
  wallTexture: '/textures/wall_paint.jpg',
  floorTexture: '/textures/wood_floor.jpg',
  lightingMode: 'Day'
});

  const [toast, setToast] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // New States for Loading Projects
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);

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
    } else {
      setSidebarCollapsed(false);
    }
  };

  const handleTourUnlock = () => {
    setShowTourOverlay(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  const addItem = (itemData) => {
  const newItem = {
    id: Date.now(),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  };

  if (typeof itemData === 'object') {
    Object.assign(newItem, itemData, {
      id: Date.now(),
      scale: itemData.scale || [1, 1, 1],
    });
  } else {
    newItem.type = itemData;
    newItem.name = itemData;
    newItem.price = 0;
  }

  setItems([...items, newItem]);
  setSelectedId(newItem.id);
  showToast(`Added ${newItem.name || newItem.type}`);
};

  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? {...i, ...data} : i));
  
  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item Deleted');
  };

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
      return dataUrl;
    }
    return null;
  };

  const downloadScreenshot = (dataUrl, name) => {
    const link = document.createElement('a');
    link.download = `${name || 'design'}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const deleteScreenshot = (id) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    showToast('Screenshot deleted');
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

  // Fetch all designs and open the selection modal
  const fetchDesigns = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${user._id}`);
      const data = await res.json();
      if (data.length > 0) {
        setSavedDesigns(data);
        setShowLoadModal(true);
      } else {
        showToast('No saved designs found.');
      }
    } catch (err) { 
      showToast('Failed to fetch designs'); 
    }
  };

  // Load a specific chosen design
  const handleLoadDesign = (design) => {
    setItems(design.items);
    if(design.roomConfig) setRoomConfig(design.roomConfig);
    showToast(`Loaded: ${design.name}`);
    setShowLoadModal(false);
  };

  // --- Electron Native Menu Integration ---
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      const handleMenuAction = (event, action) => {
        switch (action) {
          case 'view-3d': handleModeChange('3D'); break;
          case 'view-2d': handleModeChange('2D'); break;
          case 'view-tour': handleModeChange('Tour'); break;
          case 'view-screenshots': setShowScreenshotsModal(true); break;
          case 'checkout': setShowCheckout(true); break;
          case 'save-project': setShowSaveModal(true); break;
          case 'load-project': fetchDesigns(); break; 
          case 'sign-out': handleLogout(); break; // Handled Sign Out from app bar
          case 'take-screenshot': 
            const dataUrl = takeScreenshot();
            if (dataUrl) downloadScreenshot(dataUrl, 'design');
            break;
          default: break;
        }
      };

      ipcRenderer.on('menu-action', handleMenuAction);

      // Cleanup listener on unmount
      return () => {
        ipcRenderer.removeListener('menu-action', handleMenuAction);
      };
    }
  }, [user, screenshots, mode]); 

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '0px' : '320px',
        minWidth: sidebarCollapsed ? '0px' : '320px',
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        height: '100%'
      }}>
        <Sidebar
          user={user}
          addItem={addItem}
          selectedId={selectedId}
          items={items}
          updateItem={updateItem}
          deleteItem={deleteItem}
          roomConfig={roomConfig}
          setRoomConfig={setRoomConfig}
          saveDesign={() => setShowSaveModal(true)}
          loadDesigns={fetchDesigns} 
          downloadScreenshot={() => {
            const dataUrl = takeScreenshot();
            if (dataUrl) downloadScreenshot(dataUrl, 'design');
          }}
        />
      </div>

      <div style={{ flex: 1, position: 'relative', background: '#000', minWidth: 0, overflow: 'hidden' }}>
        
        {/* Toggle Sidebar */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={toggleBtnStyle}>
          {sidebarCollapsed ? '▶' : '◀'}
        </button>

        <DesignCanvas
          ref={canvasRef}
          items={items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          updateItem={updateItem}
          deleteItem={deleteItem}
          mode={mode}
          roomConfig={roomConfig}
          onTourUnlock={handleTourUnlock}
        />

        {mode === 'Tour' && showTourOverlay && (
          <div id="tour-overlay" onClick={() => setShowTourOverlay(false)} style={overlayStyle}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚶</div>
            <h2 style={{ color: 'white', margin: '0 0 10px' }}>Virtual Tour Mode</h2>
            <p style={{ color: '#aaa', margin: '0 0 20px', textAlign: 'center' }}>
              Click anywhere to start walking<br/>
              Use <b>W A S D</b> to move around<br/>
              Move your <b>mouse</b> to look around<br/>
              Press <b>ESC</b> to release cursor
            </p>
            <div style={btnBlue}>Click to Enter Tour</div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} />}
      
      {/* Save Project Modal */}
      <CustomModal 
        isOpen={showSaveModal}
        title="Save Project"
        placeholder="Project Name..."
        onClose={() => setShowSaveModal(false)}
        onSubmit={handleSaveSubmit}
      />

      {/* Load Project Selection Modal */}
      {showLoadModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Select Project to Load</h2>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
              {savedDesigns.slice().reverse().map(design => (
                <div 
                  key={design._id} 
                  onClick={() => handleLoadDesign(design)}
                  style={designCardStyle}
                >
                  {design.thumbnail ? (
                    <img src={design.thumbnail} alt={design.name} style={thumbnailStyle} />
                  ) : (
                    <div style={{ ...thumbnailStyle, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                      No Img
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#222' }}>{design.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                      Items: {design.items?.length || 0}
                    </p>
                    {design.createdAt && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
                        {new Date(design.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowLoadModal(false)} style={cancelBtnStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshots Gallery Modal */}
      {showScreenshotsModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '600px', maxWidth: '95%' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Screenshot Gallery</h2>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
              {screenshots.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                  No screenshots yet. Use "File - Take Screenshot" or Ctrl+P.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                  {screenshots.map((shot) => (
                    <div key={shot.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb' }}>
                      <img src={shot.dataUrl} alt={shot.name} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '12px' }}>
                        <p style={{ color: '#222', fontSize: '0.95rem', margin: '0 0 10px', fontWeight: 600 }}>{shot.name}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ ...actionBtnStyle, flex: 1, background: '#3b82f6', color: 'white' }} onClick={() => downloadScreenshot(shot.dataUrl, shot.name)}>
                            ⬇️ Download
                          </button>
                          <button style={{ ...actionBtnStyle, background: '#ef4444', color: 'white' }} onClick={() => deleteScreenshot(shot.id)}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowScreenshotsModal(false)} style={cancelBtnStyle}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        onOrderSuccess={() => showToast("Order Placed Successfully!")}
      />
    </div>
  );
}

// --- Styles ---

const toggleBtnStyle = {
  position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
  zIndex: 15, background: 'rgba(30, 30, 30, 0.85)', color: '#fff',
  border: '1px solid #555', borderLeft: 'none', borderRadius: '0 8px 8px 0',
  width: '24px', height: '60px', fontSize: '14px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(6px)', boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
  transition: 'background 0.2s'
};

const overlayStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.7)', cursor: 'pointer', zIndex: 2
};

const btnBlue = {
  padding: '12px 32px', background: '#3b82f6', color: 'white', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600
};

// Modal Styles
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
  alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
  background: 'white', padding: '24px', borderRadius: '12px', 
  width: '500px', maxWidth: '90%', fontFamily: 'sans-serif',
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};

const designCardStyle = {
  display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', 
  border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer',
  transition: 'background 0.2s, borderColor 0.2s', background: '#f9fafb'
};

const thumbnailStyle = {
  width: '100px', height: '70px', objectFit: 'cover', borderRadius: '6px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const actionBtnStyle = {
  padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
};

const cancelBtnStyle = {
  padding: '8px 16px', background: '#e5e7eb', color: '#374151', 
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};