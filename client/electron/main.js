
import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';


if (process.platform === 'win32') {

}

const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false, 
    },
  });


  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { 
          label: 'Save Project', 
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-action', 'save-project') 
        },
        { 
          label: 'Load Project', 
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-action', 'load-project') 
        },
        { type: 'separator' },
        { 
          label: 'Take Screenshot', 
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.send('menu-action', 'take-screenshot') 
        },
        { type: 'separator' },
        { 
          label: 'Sign Out', 
          click: () => mainWindow.webContents.send('menu-action', 'sign-out') 
        },
        { label: 'Exit', role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { 
          label: '3D View', 
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('menu-action', 'view-3d') 
        },
        { 
          label: '2D Blueprint', 
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('menu-action', 'view-2d') 
        },
        { 
          label: 'Tour Mode', 
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('menu-action', 'view-tour') 
        },
        { type: 'separator' },
        { 
          label: 'Screenshots', 
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.webContents.send('menu-action', 'view-screenshots') 
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Shop',
      submenu: [
        { 
          label: 'Checkout', 
          accelerator: 'CmdOrCtrl+Enter',
          click: () => mainWindow.webContents.send('menu-action', 'checkout') 
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);


  mainWindow.loadURL('http://localhost:5173');
};


app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});