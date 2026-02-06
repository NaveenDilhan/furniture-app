import React from 'react';

export default function Sidebar({ 
  user, onLogout, addItem, setMode, mode, 
  selectedId, updateColor, saveDesign, loadDesigns,
  ambientIntensity, setAmbientIntensity, spotIntensity, setSpotIntensity
}) {

  return (
    <div style={styles.panel}>
      <h3>👤 {user.username}</h3>
      
      <div style={styles.section}>
        <h4>1. View Mode</h4>
        <button style={mode === '3D' ? styles.activeBtn : styles.btn} onClick={() => setMode('3D')}>3D View</button>
        <button style={mode === '2D' ? styles.activeBtn : styles.btn} onClick={() => setMode('2D')}>2D Blueprint</button>
      </div>

      <div style={styles.section}>
        <h4>2. Add Furniture</h4>
        <button style={styles.btn} onClick={() => addItem('Table')}>+ Add Table</button>
        <button style={styles.btn} onClick={() => addItem('Chair')}>+ Add Chair</button>
      </div>

      {selectedId && (
        <div style={styles.section}>
          <h4>3. Edit Selected</h4>
          <label>Color: </label>
          <input type="color" onChange={(e) => updateColor(selectedId, e.target.value)} />
          <p style={{fontSize: '12px', color: '#aaa'}}>Use the gizmo on object to scale.</p>
        </div>
      )}

            <div style={styles.section}>
        <h4>4. Lighting</h4>
        <label>Ambient Light: {ambientIntensity.toFixed(2)}</label>
        <input 
          type="range" min="0" max="2" step="0.1" 
          value={ambientIntensity} 
          onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))} 
          style={{width: '100%'}}
        />
        <label>Spot Light: {spotIntensity.toFixed(2)}</label>
        <input 
          type="range" min="0" max="5" step="0.1" 
          value={spotIntensity} 
          onChange={(e) => setSpotIntensity(parseFloat(e.target.value))} 
          style={{width: '100%'}}
        />
      </div>


      <div style={styles.section}>
        <h4>5. Project</h4>
        <button style={styles.saveBtn} onClick={saveDesign}>💾 Save Design</button>
        <button style={styles.btn} onClick={loadDesigns}>📂 Load Previous</button>
      </div>

      <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  panel: { width: '250px', height: '100%', background: '#333', color: 'white', padding: '20px', overflowY: 'auto' },
  btn: { display: 'block', width: '100%', padding: '8px', marginBottom: '5px', cursor: 'pointer', border: 'none', borderRadius: '4px' },
  activeBtn: { display: 'block', width: '100%', padding: '8px', marginBottom: '5px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' },
  saveBtn: { display: 'block', width: '100%', padding: '8px', marginBottom: '5px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' },
  logoutBtn: { width: '100%', marginTop: '20px', padding: '10px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  section: { marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }
};