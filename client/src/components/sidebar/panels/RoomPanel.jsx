import React from 'react';

export default function RoomPanel({ roomConfig, setRoomConfig }) {
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  const addWindow = () => {
    const newWindows = [...(roomConfig.windows || []), {
      id: Date.now(), wallIndex: 0, x: 2, y: 1, width: 2, height: 1.5
    }];
    updateRoom('windows', newWindows);
  };

  const updateWindow = (id, key, value) => {
    const newWindows = roomConfig.windows.map(w => 
      w.id === id ? { ...w, [key]: value } : w
    );
    updateRoom('windows', newWindows);
  };

  const deleteWindow = (id) => {
    updateRoom('windows', roomConfig.windows.filter(w => w.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Architecture</h4>

      <div className="input-group">
        <label className="label">Room Shape</label>
        <select
          className="input"
          value={roomConfig.shape || 'Rectangular'}
          onChange={e => updateRoom('shape', e.target.value)}
          style={{ height: 40 }}
        >
          <option value="Rectangular">Rectangular</option>
          <option value="L-Shape">L-Shape</option>
          <option value="T-Shape">T-Shape</option>
          <option value="U-Shape">U-Shape</option>
        </select>
      </div>

      <div className="input-group">
        <label className="label">Dimensions (Width x Depth)</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="number" className="input" min="5"
            value={roomConfig.width || 15}
            onChange={e => updateRoom('width', Number(e.target.value))}
          />
          <input
            type="number" className="input" min="5"
            value={roomConfig.depth || 15}
            onChange={e => updateRoom('depth', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="input-group">
        <label className="label">Wall Height</label>
        <input
          type="number" className="input" min="2" max="15" step="0.5"
          value={roomConfig.wallHeight || 5}
          onChange={e => updateRoom('wallHeight', Number(e.target.value))}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={roomConfig.showFrontWall || false} onChange={e => updateRoom('showFrontWall', e.target.checked)} />
          Enclose Room (Show Front Walls)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={roomConfig.showCeiling || false} onChange={e => updateRoom('showCeiling', e.target.checked)} />
          Show Ceiling
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={roomConfig.showBaseboards !== false} onChange={e => updateRoom('showBaseboards', e.target.checked)} />
          Show Baseboards
        </label>
      </div>

      {/* NEW FLOOR TILE EDITOR SECTION */}
      <h4 style={{ color: 'white', margin: '15px 0 5px 0' }}>Floor Editing</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={roomConfig.editFloorMode || false}
            onChange={e => updateRoom('editFloorMode', e.target.checked)}
          />
          Enable Floor Tile Editor 
        </label>
        {roomConfig.editFloorMode && (
          <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>
            Click anywhere on the floor in 3D/2D mode to add or remove grid tiles.
          </div>
        )}
        {roomConfig.editFloorMode && roomConfig.deletedTiles?.length > 0 && (
          <button
            onClick={() => updateRoom('deletedTiles', [])}
            style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reset Floor Tiles
          </button>
        )}
      </div>

      {/* WINDOWS SECTION */}
      <h4 style={{ color: 'white', margin: '15px 0 5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Windows
        <button onClick={addWindow} style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>+ Add</button>
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {roomConfig.windows?.map((win) => (
          <div key={win.id} style={{ background: '#2a2a2a', padding: '10px', borderRadius: '6px', border: '1px solid #444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>Wall Index</span>
              <button onClick={() => deleteWindow(win.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <input type="number" min="0" max="10" className="input" value={win.wallIndex} onChange={e => updateWindow(win.id, 'wallIndex', Number(e.target.value))} style={{ marginBottom: '8px', height: 30 }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <div>
                <span style={{ color: '#aaa', fontSize: '10px' }}>Position X</span>
                <input type="number" step="0.5" className="input" value={win.x} onChange={e => updateWindow(win.id, 'x', Number(e.target.value))} style={{ height: 30 }}/>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: '10px' }}>Position Y (Elev)</span>
                <input type="number" step="0.5" className="input" value={win.y} onChange={e => updateWindow(win.id, 'y', Number(e.target.value))} style={{ height: 30 }}/>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: '10px' }}>Width</span>
                <input type="number" step="0.5" className="input" value={win.width} onChange={e => updateWindow(win.id, 'width', Number(e.target.value))} style={{ height: 30 }}/>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: '10px' }}>Height</span>
                <input type="number" step="0.5" className="input" value={win.height} onChange={e => updateWindow(win.id, 'height', Number(e.target.value))} style={{ height: 30 }}/>
              </div>
            </div>
          </div>
        ))}
        {(!roomConfig.windows || roomConfig.windows.length === 0) && (
          <p style={{ color: '#888', fontSize: '12px', margin: 0, textAlign: 'center' }}>No windows added.</p>
        )}
      </div>

      <h4 style={{ color: 'white', margin: '15px 0 5px 0' }}>Materials</h4>
      <div className="input-group">
        <label className="label">Wall Color</label>
        <input type="color" className="input" value={roomConfig.wallColor || '#ffffff'} onChange={e => updateRoom('wallColor', e.target.value)} style={{ height: 40, padding: '0', cursor: 'pointer' }} />
      </div>
      <div className="input-group">
        <label className="label">Wall Texture</label>
        <select className="input" value={roomConfig.wallTexture || '/textures/wall_paint.jpg'} onChange={e => updateRoom('wallTexture', e.target.value)} style={{ height: 40 }}>
          <option value="/textures/wall_paint.jpg">Paint</option>
          <option value="/textures/brick_wall.jpg">Brick</option>
          <option value="/textures/concrete_wall.jpg">Concrete</option>
          <option value="/textures/wallpaper_wall.jpg">Wallpaper</option>
          <option value="/textures/wood_panel_wall.jpg">Wood Panel</option>
        </select>
      </div>
      <div className="input-group">
        <label className="label">Floor Texture</label>
        <select className="input" value={roomConfig.floorTexture || '/textures/wood_floor.jpg'} onChange={e => updateRoom('floorTexture', e.target.value)} style={{ height: 40 }}>
          <option value="/textures/wood_floor.jpg">Wood</option>
          <option value="/textures/tile_floor.jpg">Tile</option>
          <option value="/textures/marble_floor.jpg">Marble</option>
          <option value="/textures/concrete_floor.jpg">Concrete</option>
        </select>
      </div>
    </div>
  );
}