import React from 'react';

export default function RoomPanel({ roomConfig, setRoomConfig }) {
  const updateRoom = (key, value) =>
    setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Room Layout</h4>

      <div className="input-group">
        <label className="label">Dimensions (Width x Depth)</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="number"
            className="input"
            value={roomConfig.width || 10}
            onChange={e => updateRoom('width', Number(e.target.value))}
            min="2"
          />
          <input
            type="number"
            className="input"
            value={roomConfig.depth || 10}
            onChange={e => updateRoom('depth', Number(e.target.value))}
            min="2"
          />
        </div>
      </div>

      <div className="input-group">
        <label className="label">Wall Height</label>
        <input
          type="number"
          className="input"
          value={roomConfig.wallHeight || 5}
          onChange={e => updateRoom('wallHeight', Number(e.target.value))}
          min="2"
          max="15"
          step="0.5"
        />
      </div>

      <h4 style={{ color: 'white', margin: '15px 0 5px 0' }}>Architecture</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={roomConfig.showFrontWall || false}
            onChange={e => updateRoom('showFrontWall', e.target.checked)}
          />
          Enclose Room (Show Front Wall)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={roomConfig.showCeiling || false}
            onChange={e => updateRoom('showCeiling', e.target.checked)}
          />
          Show Ceiling
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={roomConfig.showBaseboards !== false} // Default true
            onChange={e => updateRoom('showBaseboards', e.target.checked)}
          />
          Show Baseboards (Skirting)
        </label>
      </div>

      <h4 style={{ color: 'white', margin: '15px 0 5px 0' }}>Materials</h4>

      <div className="input-group">
        <label className="label">Wall Color</label>
        <input
          type="color"
          className="input"
          value={roomConfig.wallColor || '#ffffff'}
          onChange={e => updateRoom('wallColor', e.target.value)}
          style={{ height: 40, padding: '0', cursor: 'pointer' }}
        />
      </div>

      <div className="input-group">
        <label className="label">Wall Texture</label>
        <select
          className="input"
          value={roomConfig.wallTexture || '/textures/wall_paint.jpg'}
          onChange={e => updateRoom('wallTexture', e.target.value)}
          style={{ height: 40 }}
        >
          <option value="/textures/wall_paint.jpg">Paint</option>
          <option value="/textures/brick_wall.jpg">Brick</option>
          <option value="/textures/concrete_wall.jpg">Concrete</option>
          <option value="/textures/wallpaper_wall.jpg">Wallpaper</option>
          <option value="/textures/wood_panel_wall.jpg">Wood Panel</option>
        </select>
      </div>

      <div className="input-group">
        <label className="label">Floor Texture</label>
        <select
          className="input"
          value={roomConfig.floorTexture || '/textures/wood_floor.jpg'}
          onChange={e => updateRoom('floorTexture', e.target.value)}
          style={{ height: 40 }}
        >
          <option value="/textures/wood_floor.jpg">Wood</option>
          <option value="/textures/tile_floor.jpg">Tile</option>
          <option value="/textures/marble_floor.jpg">Marble</option>
          <option value="/textures/concrete_floor.jpg">Concrete</option>
        </select>
      </div>
    </div>
  );
}