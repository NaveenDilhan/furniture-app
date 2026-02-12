import React from 'react';

export default function ScreenshotsPanel({ screenshots, onDownload, onDelete }) {
  return (
    <div>
      <h4 style={{ color: 'white', marginBottom: '15px' }}>Screenshot Gallery</h4>
      {screenshots.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
          No screenshots yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {screenshots.map((shot) => (
            <div key={shot.id} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={shot.dataUrl} alt={shot.name} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px 10px' }}>
                <p style={{ color: 'white', fontSize: '0.85rem', margin: '0 0 2px', fontWeight: 600 }}>{shot.name}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }} onClick={() => onDownload(shot.dataUrl, shot.name)}>⬇️</button>
                  <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => onDelete(shot.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}