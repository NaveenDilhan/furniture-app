import React from 'react';

export default function PropertiesPanel({ selectedItem, selectedId, updateItem, deleteItem, roomConfig }) {
  
  if (!selectedItem) {
    return (
      <div className="panel-empty-state">
        <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.5 }}>👆</div>
        <p>Select an object to access<br />Designer Tools.</p>
      </div>
    );
  }

  // --- Handlers ---

  // Handle direct number inputs (X, Z positions)
  const handlePosChange = (axis, value) => {
    const newPos = [...selectedItem.position];
    newPos[axis] = parseFloat(value);
    updateItem(selectedId, { position: newPos });
  };

  // Relative movement (Nudge)
  const nudgeItem = (axis, amount) => {
    const newPos = [...selectedItem.position];
    newPos[axis] = parseFloat((newPos[axis] + amount).toFixed(2));
    updateItem(selectedId, { position: newPos });
  };

  // Rotation logic (converts Radians <-> Degrees for UI)
  const currentRotationDeg = Math.round(selectedItem.rotation[1] * (180 / Math.PI));
  
  const setRotation = (deg) => {
    // Normalize degree to 0-360
    const normalizedDeg = ((deg % 360) + 360) % 360; 
    const rad = normalizedDeg * (Math.PI / 180);
    const newRot = [...selectedItem.rotation];
    newRot[1] = rad;
    updateItem(selectedId, { rotation: newRot });
  };

  const handleColorChange = (e) => {
    // Only works if your object structure supports a 'color' prop
    updateItem(selectedId, { color: e.target.value });
  };

  const randomizePosition = () => {
    const maxW = (roomConfig.width / 2) * 0.8;
    const maxD = (roomConfig.depth / 2) * 0.8;
    const x = (Math.random() * 2 - 1) * maxW;
    const z = (Math.random() * 2 - 1) * maxD;
    const rotY = Math.random() * Math.PI * 2;
    updateItem(selectedId, { position: [x, 0, z], rotation: [0, rotY, 0] });
  };

  // Calculated values for measurements
  const posX = selectedItem.position[0];
  const posZ = selectedItem.position[2];
  const distRight = ((roomConfig.width / 2) - posX).toFixed(2);
  const distLeft = ((roomConfig.width / 2) + posX).toFixed(2);

  return (
    <div className="properties-panel">
      {/* Header */}
      <div className="panel-header">
        <h4 className="panel-title">
          <span className="icon">🛠</span> {selectedItem.type}
        </h4>
        <div className="id-badge">ID: {selectedId.toString().slice(-4)}</div>
      </div>

      <div className="scroll-container">
        
        {/* SECTION: TRANSFORM */}
        <div className="control-group">
          <label className="group-label">Position (X / Z)</label>
          
          <div className="coordinate-inputs">
            <div className="input-wrapper">
              <span>X</span>
              <input 
                type="number" 
                step="0.1"
                value={posX.toFixed(2)} 
                onChange={(e) => handlePosChange(0, e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <span>Z</span>
              <input 
                type="number" 
                step="0.1"
                value={posZ.toFixed(2)} 
                onChange={(e) => handlePosChange(2, e.target.value)}
              />
            </div>
          </div>

          <div className="nudge-grid">
            <button className="btn-tool" onClick={() => nudgeItem(2, -0.1)}>⬆</button>
            <div className="nudge-row">
              <button className="btn-tool" onClick={() => nudgeItem(0, -0.1)}>⬅</button>
              <div className="nudge-center">Nudge</div>
              <button className="btn-tool" onClick={() => nudgeItem(0, 0.1)}>➡</button>
            </div>
            <button className="btn-tool" onClick={() => nudgeItem(2, 0.1)}>⬇</button>
          </div>
        </div>

        {/* SECTION: ROTATION */}
        <div className="control-group">
          <div className="label-row">
            <label className="group-label">Rotation</label>
            <span className="value-readout">{currentRotationDeg}°</span>
          </div>
          <input 
            type="range" min="0" max="359" 
            value={currentRotationDeg}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="slider"
          />
          <div className="quick-actions">
            <button className="btn-xs" onClick={() => setRotation(currentRotationDeg - 45)}>-45°</button>
            <button className="btn-xs" onClick={() => setRotation(0)}>Reset</button>
            <button className="btn-xs" onClick={() => setRotation(currentRotationDeg + 45)}>+45°</button>
          </div>
        </div>

        {/* SECTION: DIMENSIONS */}
        <div className="control-group">
          <div className="label-row">
            <label className="group-label">Scale</label>
            <span className="value-readout">{selectedItem.scale[0].toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.5" max="3" step="0.1"
            value={selectedItem.scale[0]}
            onChange={(e) => {
              const s = parseFloat(e.target.value);
              updateItem(selectedId, { scale: [s, s, s] });
            }}
            className="slider"
          />
        </div>

        {/* SECTION: APPEARANCE (Optional) */}
        {selectedItem.color && (
          <div className="control-group">
            <label className="group-label">Color</label>
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={selectedItem.color} 
                onChange={handleColorChange}
                className="color-input"
              />
              <span className="color-hex">{selectedItem.color}</span>
            </div>
          </div>
        )}

        {/* SECTION: MEASUREMENTS */}
        <div className="info-box">
          <label className="group-label">📏 Wall Distances</label>
          <div className="measure-row">
            <span>Left Wall</span>
            <div className="dotted-line"></div>
            <span className="measure-val">{distLeft}m</span>
          </div>
          <div className="measure-row">
            <span>Right Wall</span>
            <div className="dotted-line"></div>
            <span className="measure-val">{distRight}m</span>
          </div>
        </div>

        {/* SECTION: SMART ACTIONS */}
        <div className="control-group">
          <label className="group-label">Actions</label>
          <div className="action-grid">
            <button className="btn-secondary" onClick={randomizePosition}>
              🎲 Shuffle
            </button>
            <button className="btn-secondary" onClick={() => updateItem(selectedId, { position: [0, 0, 0] })}>
              🎯 Center
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="panel-footer">
        <button className="btn-danger" onClick={() => deleteItem(selectedId)}>
          🗑️ Remove Item
        </button>
      </div>

      {/* STYLES */}
      <style>{`
        /* Reset & Base */
        .properties-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1e1e1e; /* Dark theme background */
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
        }

        .panel-empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #777;
        }

        .scroll-container {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        /* Header */
        .panel-header {
          padding: 15px;
          border-bottom: 1px solid #333;
          background: #252525;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel-title { margin: 0; color: #fff; font-weight: 600; font-size: 1rem; }
        .id-badge { font-size: 0.75rem; background: #333; padding: 2px 6px; borderRadius: 4px; color: #999; }

        /* Control Groups */
        .control-group { margin-bottom: 20px; }
        .group-label { display: block; color: #888; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600; }
        .label-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .value-readout { color: #4facfe; font-family: monospace; }

        /* Inputs */
        .coordinate-inputs { display: flex; gap: 10px; margin-bottom: 10px; }
        .input-wrapper {
          display: flex; align-items: center; background: #2a2a2a;
          border: 1px solid #444; border-radius: 4px; padding: 0 8px; flex: 1;
        }
        .input-wrapper span { color: #666; font-weight: bold; margin-right: 8px; font-size: 0.8rem; }
        .input-wrapper input {
          width: 100%; background: transparent; border: none; color: #fff;
          padding: 6px 0; font-family: monospace; outline: none;
        }
        
        /* Sliders */
        .slider { width: 100%; cursor: pointer; accent-color: #4facfe; margin-bottom: 8px; }

        /* Nudge Grid */
        .nudge-grid { display: flex; flex-direction: column; align-items: center; gap: 5px; background: #252525; padding: 10px; border-radius: 6px; border: 1px solid #333; }
        .nudge-row { display: flex; align-items: center; gap: 5px; width: 100%; justify-content: center; }
        .nudge-center { font-size: 0.7rem; color: #555; width: 40px; text-align: center; }
        
        /* Buttons */
        .btn-tool {
          width: 30px; height: 30px; border-radius: 4px; border: 1px solid #444;
          background: #333; color: #ccc; cursor: pointer; display: flex; 
          align-items: center; justify-content: center; transition: all 0.2s;
        }
        .btn-tool:hover { background: #444; color: #fff; border-color: #666; }
        .btn-tool:active { background: #222; transform: translateY(1px); }

        .quick-actions { display: flex; gap: 5px; justify-content: space-between; }
        .btn-xs { flex: 1; background: #2a2a2a; border: 1px solid #444; color: #aaa; border-radius: 4px; padding: 4px; font-size: 0.75rem; cursor: pointer; }
        .btn-xs:hover { background: #333; color: #fff; }

        .action-grid { display: flex; gap: 10px; }
        .btn-secondary { flex: 1; background: #333; border: none; color: #eee; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
        .btn-secondary:hover { background: #444; }

        /* Color Picker */
        .color-picker-wrapper { display: flex; align-items: center; gap: 10px; background: #2a2a2a; padding: 5px; border-radius: 4px; border: 1px solid #444; }
        .color-input { border: none; width: 30px; height: 30px; cursor: pointer; background: none; padding: 0; }
        .color-hex { font-family: monospace; color: #ccc; }

        /* Info Box */
        .info-box { background: rgba(79, 172, 254, 0.1); border: 1px solid rgba(79, 172, 254, 0.2); padding: 12px; border-radius: 6px; margin-bottom: 20px; }
        .measure-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #ccc; margin-bottom: 4px; }
        .dotted-line { flex: 1; border-bottom: 1px dotted #555; margin: 0 8px; opacity: 0.5; }
        .measure-val { color: #4facfe; font-family: monospace; }

        /* Footer */
        .panel-footer { padding: 15px; border-top: 1px solid #333; background: #252525; margin-top: auto; }
        .btn-danger { width: 100%; background: #4a2222; color: #ff8888; border: 1px solid #632b2b; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .btn-danger:hover { background: #632b2b; color: #fff; border-color: #ff5555; }

      `}</style>
    </div>
  );
}