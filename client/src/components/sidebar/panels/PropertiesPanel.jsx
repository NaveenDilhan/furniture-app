import React from 'react';

export default function PropertiesPanel({ selectedItem, selectedId, updateItem, deleteItem, roomConfig }) {
  if (!selectedItem) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
        Select an object to access Designer Tools.
      </p>
    );
  }

  // --- Logic Internal to this Panel ---
  const nudgeItem = (axis, amount) => {
    const newPos = [...selectedItem.position];
    newPos[axis] += amount;
    updateItem(selectedId, { position: newPos });
  };

  const rotateItem = (deg) => {
    const rad = deg * (Math.PI / 180);
    const newRot = [...selectedItem.rotation];
    newRot[1] += rad;
    updateItem(selectedId, { rotation: newRot });
  };

  const randomizePosition = () => {
    const maxW = (roomConfig.width / 2) * 0.8;
    const maxD = (roomConfig.depth / 2) * 0.8;
    const x = (Math.random() * 2 - 1) * maxW;
    const z = (Math.random() * 2 - 1) * maxD;
    const rotY = Math.random() * Math.PI * 2;
    
    updateItem(selectedId, { position: [x, 0, z], rotation: [0, rotY, 0] });
  };

  const centerItem = () => {
    updateItem(selectedId, { position: [0, 0, 0] });
  };

  return (
    <div>
      <h4 style={{ color: 'white', marginBottom: '15px', borderBottom:'1px solid #444', paddingBottom:'5px' }}>
        Selected: {selectedItem.type}
      </h4>

      {/* Precision Movement */}
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Precision Nudge</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginBottom:'10px' }}>
          <button className="btn-tool" onClick={() => nudgeItem(0, -0.1)}>⬅ X</button>
          <button className="btn-tool" onClick={() => nudgeItem(2, -0.1)}>⬆ Z</button>
          <button className="btn-tool" onClick={() => nudgeItem(0, 0.1)}>X ➡</button>
          <button className="btn-tool" onClick={() => rotateItem(-15)}>↺ 15°</button>
          <button className="btn-tool" onClick={() => nudgeItem(2, 0.1)}>⬇ Z</button>
          <button className="btn-tool" onClick={() => rotateItem(15)}>15° ↻</button>
        </div>
        <small style={{color:'#888'}}>Use these for fine-tuning placement.</small>
      </div>

      {/* Measurements */}
      <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius:'6px' }}>
        <label className="label" style={{marginBottom:'5px'}}>📏 Measurements</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: '#ccc' }}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <span>From Center:</span>
            <span style={{fontFamily:'monospace'}}>
              X: {selectedItem.position[0].toFixed(2)}m | Z: {selectedItem.position[2].toFixed(2)}m
            </span>
          </div>
          <hr style={{width:'100%', borderColor:'#444', margin:'5px 0'}}/>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <span>Right Wall:</span>
            <span style={{color:'#66bb6a'}}>{((roomConfig.width/2) - selectedItem.position[0]).toFixed(2)}m</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <span>Left Wall:</span>
            <span style={{color:'#66bb6a'}}>{((roomConfig.width/2) + selectedItem.position[0]).toFixed(2)}m</span>
          </div>
        </div>
      </div>

      {/* Smart Placement */}
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Smart Placement</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" style={{flex:1, fontSize:'0.8rem'}} onClick={randomizePosition}>
            🎲 Random
          </button>
          <button className="btn" style={{flex:1, fontSize:'0.8rem'}} onClick={centerItem}>
            🎯 Center
          </button>
        </div>
      </div>

      {/* Scale */}
      <div className="input-group">
        <label className="label">Scale Size</label>
        <input 
          type="range" min="0.5" max="3" step="0.1"
          value={selectedItem.scale[0]}
          onChange={(e) => {
            const s = parseFloat(e.target.value);
            updateItem(selectedId, { scale: [s, s, s] });
          }}
        />
      </div>

      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => deleteItem(selectedId)}>
          🗑️ Delete Item
        </button>
      </div>

      <style>{`
        .btn-tool {
          background: #333; color: white; border: 1px solid #555;
          border-radius: 4px; padding: 8px; cursor: pointer;
          transition: background 0.2s; font-size: 0.8rem;
        }
        .btn-tool:hover { background: #444; border-color: #777; }
        .btn-tool:active { background: #222; }
      `}</style>
    </div>
  );
}