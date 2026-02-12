import React, { useState } from 'react';

// Define the 5 distinct tabs (added SCREENSHOTS)
const TABS = { 
  LIBRARY: 'library', 
  PROPERTIES: 'properties', 
  ROOM: 'room', 
  GLOBAL: 'global',
  SCREENSHOTS: 'screenshots'
};

export default function Sidebar({ 
  user, onLogout, addItem, selectedId, items, updateItem, deleteItem,
  roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot,
  screenshots = [], onDownloadScreenshot, onDeleteScreenshot
}) {
  const [activeTab, setActiveTab] = useState(TABS.LIBRARY);

  const selectedItem = items.find(i => i.id === selectedId);

  // Helper to update room config
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div style={{ width: '320px', height: '100%', background: 'var(--bg-panel)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- Header --- */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>🛋️ Design Studio</h3>
        <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as {user.username}</p>
      </div>

      {/* --- Tab Navigation --- */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <TabButton label="Add" icon="➕" active={activeTab === TABS.LIBRARY} onClick={() => setActiveTab(TABS.LIBRARY)} />
        <TabButton label="Edit" icon="🎨" active={activeTab === TABS.PROPERTIES} onClick={() => setActiveTab(TABS.PROPERTIES)} />
        <TabButton label="Room" icon="🏠" active={activeTab === TABS.ROOM} onClick={() => setActiveTab(TABS.ROOM)} />
        <TabButton label="Global" icon="🌍" active={activeTab === TABS.GLOBAL} onClick={() => setActiveTab(TABS.GLOBAL)} />
        <TabButton label="Shots" icon="📸" active={activeTab === TABS.SCREENSHOTS} onClick={() => setActiveTab(TABS.SCREENSHOTS)} />
      </div>

      {/* --- Content Area --- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* 1. LIBRARY TAB */}
        {activeTab === TABS.LIBRARY && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <LibraryItem name="Table" icon="🔲" onClick={() => addItem('Table')} />
            <LibraryItem name="Chair" icon="💺" onClick={() => addItem('Chair')} />
            <LibraryItem name="Bed" icon="🛏️" onClick={() => addItem('Bed')} />
            <LibraryItem name="Lamp" icon="💡" onClick={() => addItem('Lamp')} />
            <LibraryItem name="Sofa" icon="🛋️" onClick={() => addItem('Sofa')} />
            <LibraryItem name="Cabinet" icon="🚪" onClick={() => addItem('Cabinet')} />
          </div>
        )}

        {/* 2. PROPERTIES TAB (Contextual Edit) */}
        {activeTab === TABS.PROPERTIES && (
          <div>
            {!selectedItem ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                Select an object to edit properties.
              </p>
            ) : (
              <>
                <h4 style={{ color: 'white', marginBottom: '15px' }}>{selectedItem.type} Properties</h4>
                
                <div className="input-group">
                  <label className="label">Color</label>
                  <input 
                    type="color" 
                    className="input" 
                    value={selectedItem.color} 
                    style={{ height: '40px', padding: '2px' }}
                    onChange={(e) => updateItem(selectedId, { color: e.target.value })} 
                  />
                </div>

                <div className="input-group">
                  <label className="label">Position (X / Y / Z)</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[0, 1, 2].map(axis => (
                      <input 
                        key={axis} type="number" step="0.1" className="input"
                        value={selectedItem.position[axis].toFixed(2)}
                        onChange={(e) => {
                          const newPos = [...selectedItem.position];
                          newPos[axis] = parseFloat(e.target.value);
                          updateItem(selectedId, { position: newPos });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Rotation (Y-Axis)</label>
                  <input 
                    type="range" min="0" max={Math.PI * 2} step="0.1"
                    value={selectedItem.rotation[1]}
                    onChange={(e) => {
                      const newRot = [...selectedItem.rotation];
                      newRot[1] = parseFloat(e.target.value);
                      updateItem(selectedId, { rotation: newRot });
                    }}
                  />
                </div>

                <div className="input-group">
                  <label className="label">Scale</label>
                  <input 
                    type="range" min="0.5" max="3" step="0.1"
                    value={selectedItem.scale[0]}
                    onChange={(e) => {
                      const s = parseFloat(e.target.value);
                      updateItem(selectedId, { scale: [s, s, s] });
                    }}
                  />
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => deleteItem(selectedId)}>
                    🗑️ Delete Item
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. ROOM TAB (Geometry & Materials) */}
        {activeTab === TABS.ROOM && (
          <div>
            <h4 style={{ color: 'white' }}>Room Layout</h4>
            
            <div className="input-group">
              <label className="label">Dimensions (Width x Depth)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input type="number" className="input" value={roomConfig.width} onChange={e => updateRoom('width', Number(e.target.value))} />
                <input type="number" className="input" value={roomConfig.depth} onChange={e => updateRoom('depth', Number(e.target.value))} />
              </div>
            </div>

            <h4 style={{ color: 'white', marginTop: '20px' }}>Materials</h4>

            <div className="input-group">
              <label className="label">Wall Color</label>
              <input type="color" className="input" value={roomConfig.wallColor} onChange={e => updateRoom('wallColor', e.target.value)} style={{height: 40}} />
            </div>

            <div className="input-group">
              <label className="label">Floor Color</label>
              <input type="color" className="input" value={roomConfig.floorColor} onChange={e => updateRoom('floorColor', e.target.value)} style={{height: 40}} />
            </div>
          </div>
        )}

        {/* 4. GLOBAL TAB (Lighting & Project) */}
        {activeTab === TABS.GLOBAL && (
          <div>
            <h4 style={{ color: 'white' }}>Environment</h4>

            <div className="input-group">
              <label className="label">Lighting Mode</label>
              <select className="input" value={roomConfig.lightingMode} onChange={e => updateRoom('lightingMode', e.target.value)}>
                <option value="Day">☀️ Daylight (Clear)</option>
                <option value="Golden">🌅 Golden Hour (Warm)</option>
                <option value="Night">🌙 Night (Cozy)</option>
              </select>
            </div>

            <h4 style={{ color: 'white', marginTop: '30px' }}>Project Management</h4>
            
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }} onClick={saveDesign}>
              💾 Save Project
            </button>
            <button className="btn" style={{ width: '100%', marginBottom: '10px' }} onClick={loadDesigns}>
              📂 Load Previous
            </button>
            <button className="btn" style={{ width: '100%' }} onClick={downloadScreenshot}>
              📸 Take Screenshot
            </button>
          </div>
        )}

        {/* 5. SCREENSHOTS TAB (Gallery) */}
        {activeTab === TABS.SCREENSHOTS && (
          <div>
            <h4 style={{ color: 'white', marginBottom: '15px' }}>Screenshot Gallery</h4>
            
            {screenshots.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                No screenshots yet. Use 📸 Take Screenshot in the Global tab or during Tour mode to capture your designs.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {screenshots.map((shot) => (
                  <div key={shot.id} style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {/* Thumbnail */}
                    <img 
                      src={shot.dataUrl} 
                      alt={shot.name}
                      style={{ 
                        width: '100%', 
                        height: '140px', 
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />
                    {/* Info & Actions */}
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ 
                        color: 'white', 
                        fontSize: '0.85rem', 
                        margin: '0 0 2px',
                        fontWeight: 600
                      }}>
                        {shot.name}
                      </p>
                      <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '0.7rem', 
                        margin: '0 0 8px' 
                      }}>
                        {shot.timestamp}
                      </p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                          onClick={() => onDownloadScreenshot(shot.dataUrl, shot.name)}
                        >
                          ⬇️ Download
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                          onClick={() => onDeleteScreenshot(shot.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

// --- Styled Sub-components ---
const TabButton = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      flex: 1, background: active ? 'var(--bg-input)' : 'transparent',
      border: 'none', borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      color: active ? 'white' : 'var(--text-muted)', padding: '10px 5px', cursor: 'pointer',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}
  >
    <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{icon}</span>
    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
  </button>
);

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
