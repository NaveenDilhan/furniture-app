import React from 'react';

export default function GlobalPanel({ roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot }) {
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
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
  );
}