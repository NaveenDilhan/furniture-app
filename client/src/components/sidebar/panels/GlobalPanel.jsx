// client/src/components/sidebar/panels/GlobalPanel.jsx
import React from 'react';

export default function GlobalPanel({ roomConfig, setRoomConfig }) {
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h4 style={{ color: 'white', marginTop: '10px' }}>Environment & Lighting</h4>
      
      <div className="input-group">
        <label className="label">Time of Day</label>
        <select 
          className="input" 
          value={roomConfig.lightingMode || 'Day'} 
          onChange={e => updateRoom('lightingMode', e.target.value)}
        >
          <option value="Day">☀️ Daylight (Clear)</option>
          <option value="Golden">🌅 Golden Hour (Warm)</option>
          <option value="Night">🌙 Night (Cozy)</option>
        </select>
      </div>

      <h4 style={{ color: 'white', marginTop: '30px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
        Visual Settings
      </h4>
      
      {/* Suggestion 1: Blueprint Grid Toggle */}
      <div className="input-group" style={toggleRowStyle}>
        <label className="label" style={{ marginBottom: 0 }}>Show Blueprint Grid</label>
        <input 
          type="checkbox" 
          checked={roomConfig.showGrid ?? true} 
          onChange={e => updateRoom('showGrid', e.target.checked)} 
          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
        />
      </div>

      {/* Suggestion 2: Shadow Quality Toggle */}
      <div className="input-group" style={toggleRowStyle}>
        <label className="label" style={{ marginBottom: 0 }}>Enable Soft Shadows</label>
        <input 
          type="checkbox" 
          checked={roomConfig.shadowsEnabled ?? true} 
          onChange={e => updateRoom('shadowsEnabled', e.target.checked)} 
          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
        />
      </div>

      <h4 style={{ color: 'white', marginTop: '30px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
        Camera Settings
      </h4>

      {/* Suggestion 3: Camera Field of View Slider */}
      <div className="input-group">
        <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Field of View (FOV)</span>
          <span>{roomConfig.cameraFov || 50}°</span>
        </label>
        <input 
          type="range" 
          min="30" 
          max="90" 
          value={roomConfig.cameraFov || 50} 
          onChange={e => updateRoom('cameraFov', parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: '#3b82f6' }}
        />
      </div>
    </div>
  );
}

// Inline styles for layout
const toggleRowStyle = {
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '15px',
  background: 'rgba(255,255,255,0.05)',
  padding: '10px',
  borderRadius: '6px'
};