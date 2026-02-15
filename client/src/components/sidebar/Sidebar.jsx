import React, { useState } from 'react';
import SidebarTabs from './SidebarTabs';
import LibraryPanel from './panels/LibraryPanel';
import PropertiesPanel from './panels/PropertiesPanel';
import RoomPanel from './panels/RoomPanel';
import GlobalPanel from './panels/GlobalPanel';
import ScreenshotsPanel from './panels/ScreenshotsPanel';

export const TABS = { 
  LIBRARY: 'library', 
  PROPERTIES: 'properties', 
  ROOM: 'room', 
  GLOBAL: 'global',
  SCREENSHOTS: 'screenshots'
};

export default function Sidebar({ 
  user, onLogout, addItem, selectedId, items, updateItem, deleteItem,
  roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot,
  screenshots, onDownloadScreenshot, onDeleteScreenshot
}) {
  const [activeTab, setActiveTab] = useState(TABS.LIBRARY);
  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div style={{ width: '320px', height: '100%', background: 'var(--bg-panel)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>🛋️ Design Studio</h3>
        <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as {user.username}</p>
      </div>

      {/* Navigation */}
      <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {activeTab === TABS.LIBRARY && (
          <LibraryPanel addItem={addItem} />
        )}

        {activeTab === TABS.PROPERTIES && (
          <PropertiesPanel 
            selectedItem={selectedItem} 
            selectedId={selectedId} 
            updateItem={updateItem} 
            deleteItem={deleteItem} 
            roomConfig={roomConfig} 
          />
        )}

        {activeTab === TABS.ROOM && (
          <RoomPanel roomConfig={roomConfig} setRoomConfig={setRoomConfig} />
        )}

        {activeTab === TABS.GLOBAL && (
          <GlobalPanel 
            roomConfig={roomConfig} 
            setRoomConfig={setRoomConfig} 
            saveDesign={saveDesign} 
            loadDesigns={loadDesigns} 
            downloadScreenshot={downloadScreenshot} 
          />
        )}

        {activeTab === TABS.SCREENSHOTS && (
          <ScreenshotsPanel 
            screenshots={screenshots} 
            onDownload={onDownloadScreenshot} 
            onDelete={onDeleteScreenshot} 
          />
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}