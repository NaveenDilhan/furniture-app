import React from 'react';

export default function RoomPanel({ roomConfig, setRoomConfig }) {
  const updateRoom = (key, value) =>
    setRoomConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h4 style={{ color: 'white' }}>Room Layout</h4>

      <div className="input-group">
        <label className="label">Dimensions (Width x Depth)</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="number"
            className="input"
            value={roomConfig.width}
            onChange={e => updateRoom('width', Number(e.target.value))}
          />
          <input
            type="number"
            className="input"
            value={roomConfig.depth}
            onChange={e => updateRoom('depth', Number(e.target.value))}
          />
        </div>
      </div>

      <h4 style={{ color: 'white', marginTop: '20px' }}>Materials</h4>

      <div className="input-group">
        <label className="label">Wall Color</label>
        <input
          type="color"
          className="input"
          value={roomConfig.wallColor}
          onChange={e => updateRoom('wallColor', e.target.value)}
          style={{ height: 40 }}
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