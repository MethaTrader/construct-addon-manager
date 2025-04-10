const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const isAdmin = require('is-admin');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    frame: false, // Frameless window
    backgroundColor: '#0F0F0F', // Black 06 from guideline
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Check if running as admin
  checkAdminStatus();
}

async function checkAdminStatus() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      // Send a message to the renderer if not running as admin
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('not-admin');
      });
    }
  } catch (error) {
    console.error('Failed to check admin status:', error);
  }
}

// Create window when app is ready
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Listen for select folder event
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths;
});

// Listen for restart as admin request
ipcMain.on('restart-as-admin', () => {
  // This is a simplified version. In a real app, you'd need 
  // platform-specific code to restart with admin privileges
  app.quit();
});

// Window control handlers
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});