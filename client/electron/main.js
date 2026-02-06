// electron/main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform === 'win32') {
//   require('electron-squirrel-startup'); 
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Allows using Node.js in the renderer
      contextIsolation: false, // Simplifies communication for this coursework
    },
  });

  // Load the React app
  // In development, we load the Vite local server
  // In production, we would load the built index.html file
  mainWindow.loadURL('http://localhost:5173');

  // Open the DevTools (optional - remove this line for final submission)
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
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