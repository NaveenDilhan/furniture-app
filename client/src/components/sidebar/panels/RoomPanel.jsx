import React from 'react';

export default function RoomPanel({ roomConfig, setRoomConfig }) {
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h4 style={{ color: 'white' }}>Room Layout</h4>
      <div className="input-group">
        <label className="label">Dimensions (Width x Depth)</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="number" className="input" 
            value={roomConfig.width} 
            onChange={e => updateRoom('width', Number(e.target.value))} 
          />
          <input 
            type="number" className="input" 
            value={roomConfig.depth} 
            onChange={e => updateRoom('depth', Number(e.target.value))} 
          />
        </div>
      </div>
      <h4 style={{ color: 'white', marginTop: '20px' }}>Materials</h4>
      <div className="input-group">
        <label className="label">Wall Color</label>
        <input 
          type="color" className="input" 
          value={roomConfig.wallColor} 
          onChange={e => updateRoom('wallColor', e.target.value)} 
          style={{height: 40}} 
        />
      </div>
      <div className="input-group">
        <label className="label">Floor Color</label>
        <input 
          type="color" className="input" 
          value={roomConfig.floorColor} 
          onChange={e => updateRoom('floorColor', e.target.value)} 
          style={{height: 40}} 
        />
      </div>
    </div>
  );
}