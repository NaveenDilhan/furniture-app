import React from 'react';
import { TABS } from './Sidebar';

const TabButton = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      flex: 1, background: active ? 'var(--bg-input)' : 'transparent',
      border: 'none', borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      color: active ? 'white' : 'var(--text-muted)', padding: '10px 5px', cursor: 'pointer',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}
  >
    <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{icon}</span>
    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
  </button>
);

export default function SidebarTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
      <TabButton label="Add" icon="➕" active={activeTab === TABS.LIBRARY} onClick={() => setActiveTab(TABS.LIBRARY)} />
      <TabButton label="Tools" icon="🛠️" active={activeTab === TABS.PROPERTIES} onClick={() => setActiveTab(TABS.PROPERTIES)} />
      <TabButton label="Room" icon="🏠" active={activeTab === TABS.ROOM} onClick={() => setActiveTab(TABS.ROOM)} />
      <TabButton label="Global" icon="🌍" active={activeTab === TABS.GLOBAL} onClick={() => setActiveTab(TABS.GLOBAL)} />
    </div>
  );
}